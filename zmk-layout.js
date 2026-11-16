"use strict";

const ZmkLayout = (() => {
    const LIMIT = 192;
    const clean = text => text.replace(/"(?:\\.|[^"\\])*"|\/\*[\s\S]*?\*\/|\/\/[^\n]*/g,
        part => part.startsWith('"') ? part : " ");

    function scan(source) {
        const text = clean(source.replace(/\r\n?/g,"\n")).replace(/\\\n/g," ");
        const defines = new Map();
        for (const [,name,value] of text.matchAll(/^\s*#\s*define[ \t]+(\w+)[ \t]+([\w]+)[ \t]*$/gm)) defines.set(name,value);
        const input = text.replace(/^[ \t]*#[ \t]*(?:include|define|if|ifdef|ifndef|else|elif|endif|pragma)\b[^\n]*/gm,"");
        const root = {children:[],properties:new Map(),name:""};
        const stack = [root];
        let value = "";
        for (const [part] of input.matchAll(/"(?:\\.|[^"\\])*"|[{};]|[^"{};]+/g)) {
            const node = stack.at(-1);
            if (part === "{") {
                const parts = value.trim().split(/:\s*/);
                const child = {children:[],properties:new Map(),name:parts.at(-1),label:parts.length > 1 ? parts[0] : ""};
                node.children.push(child);
                stack.push(child);
            } else if (part === "}") {
                if (stack.length > 1) stack.pop();
            } else if (part === ";") {
                const pair = /^\s*([\w,-]+)\s*=\s*([\s\S]+)$/.exec(value);
                if (pair) node.properties.set(pair[1],pair[2].trim());
            } else { value += part; continue; }
            value = "";
        }
        return {root,defines};
    }

    function nodes(root) {
        return root.children.flatMap(node => [node,...nodes(node)]);
    }

    const labels = {
        ESC:"Esc", ESCAPE:"Esc", BACKSPACE:"Bksp", BSPC:"Bksp", RETURN:"Enter", RET:"Enter", SPACE:"Space", TAB:"Tab",
        LCTRL:"Ctrl", RCTRL:"Ctrl", LCTL:"Ctrl", RCTL:"Ctrl", LSHIFT:"Shift", RSHIFT:"Shift", LSFT:"Shift", RSFT:"Shift",
        LSHFT:"Shift", RSHFT:"Shift",
        LALT:"Alt", RALT:"Alt", LGUI:"GUI", RGUI:"GUI", LCMD:"GUI", RCMD:"GUI", LWIN:"GUI", RWIN:"GUI",
        CAPS:"Caps", CAPSLOCK:"Caps", NUMLOCK:"Num", UP:"↑", DOWN:"↓", LEFT:"←", RIGHT:"→",
        UP_ARROW:"↑", DOWN_ARROW:"↓", LEFT_ARROW:"←", RIGHT_ARROW:"→", MINUS:"-", EQUAL:"=", COMMA:",", DOT:".",
        FSLH:"/", BSLH:"\\", SEMI:";", SQT:"'", LBKT:"[", RBKT:"]", GRAVE:"`", C_MUTE:"Mute", C_VOL_UP:"Vol+", C_VOL_DN:"Vol-",
    };

    function keyLabel(code, defines) {
        if (!code) return "";
        const value = defines.get(code) || code;
        return labels[value] ?? (/^N[0-9]$/.test(value) ? value[1] : value);
    }

    function readBindings(value, defines) {
        return [...value.matchAll(/<([^<>]*)>/g)].flatMap(([,group]) =>
            [...group.matchAll(/&([A-Za-z_]\w*)\b([^&]*)/g)].map(([,behavior,args]) => {
                const parameters = args.trim().replace(/\s+/g," ");
                const cells = parameters.match(/\S+?\([^)]*\)|\S+/g) || [];
                let label = behavior.toUpperCase();
                if (behavior === "none") label = "-";
                if (behavior === "trans") label = "";
                if (behavior === "kp") label = keyLabel(cells[0],defines);
                if (["mt","lt"].includes(behavior)) label = keyLabel(cells[1],defines);
                if (["mo","tog","to","sl"].includes(behavior)) label = "L" + (defines.get(cells[0]) || cells[0] || "?");
                return {behavior,parameters:parameters.slice(0,180),label:label.slice(0,22)};
            }));
    }

    function readEncoders(value,defines,sensors) {
        return readBindings(value || "",defines).map(({behavior,parameters}) => {
            if (behavior === "trans") return {clockwise:"",counterclockwise:"",transparent:true};
            const sensor = sensors.get(behavior);
            if (sensor?.kind === "fixed") return {clockwise:sensor.labels[0] || "",counterclockwise:sensor.labels[1] || ""};
            const [clockwise,counterclockwise] = parameters.split(" ");
            if (behavior === "inc_dec_kp" || sensor?.kind === "variable") {
                return {clockwise:keyLabel(clockwise,defines),counterclockwise:keyLabel(counterclockwise,defines)};
            }
            return {clockwise:"",counterclockwise:""};
        });
    }

    function parseKeymap(text,name) {
        if (/^[ \t]*#[ \t]*(?:if|ifdef|ifndef|elif|else)\b/m.test(clean(text))) {
            throw Error("检测到预处理条件。请导入已按目标固件展开的 keymap");
        }
        const {root,defines} = scan(text);
        const children = nodes(root);
        const keymap = children.find(node => node.properties.get("compatible")?.includes('"zmk,keymap"') || node.name === "keymap");
        const sensors = new Map();
        for (const node of children) {
            const type = node.properties.get("compatible");
            if (!node.label || !node.properties.has("bindings")) continue;
            if (type === '"zmk,behavior-sensor-rotate"') {
                sensors.set(node.label,{kind:"fixed",labels:readBindings(node.properties.get("bindings"),defines).map(item=>item.label)});
            }
            if (type === '"zmk,behavior-sensor-rotate-var"' && readBindings(node.properties.get("bindings"),defines).every(item=>item.behavior === "kp")) {
                sensors.set(node.label,{kind:"variable"});
            }
        }
        const layers = (keymap?.children ?? []).filter(node => node.properties.has("bindings")).map(node => {
            const bindings = readBindings(node.properties.get("bindings"),defines);
            const name = (node.properties.get("display-name")?.replace(/^"|"$/g,"") || node.name).slice(0,48);
            const encoders = readEncoders(node.properties.get("sensor-bindings"),defines,sensors);
            return {name,bindings,encoders,sourceBindingCount:bindings.length};
        });
        if (!layers.length || !layers[0].bindings.length) throw Error("文件中找不到 ZMK 的 keymap 层和 bindings");
        const count = Math.max(...layers.map(layer => layer.sourceBindingCount));
        if (count > LIMIT || layers.length > 48) throw Error("目前支持最多 192 个键位、48 层");
        for (const layer of layers) {
            while (layer.bindings.length < count) layer.bindings.push({behavior:"unbound",parameters:"",label:"-"});
        }
        return {file:name.slice(0,120),layers,layout:"auto",physical:null};
    }

    function parsePhysical(text) {
        const {root} = scan(text);
        const layouts = nodes(root).flatMap(node => {
            const value = node.properties.get("keys");
            if (!value || !value.includes("&key_physical_attrs")) return [];
            const entries = [...value.matchAll(/<\s*&key_physical_attrs\s+([^>]+)>/g)];
            const keys = entries.map(([,params]) => params.replace(/\(\s*(-?\d+)\s*\)/g,"$1").trim().split(/\s+/).map(Number));
            if (!keys.length || keys.length > LIMIT || keys.some(key => key.length !== 7 || !key.every(n => Number.isInteger(n) && Math.abs(n) <= 100000) || key[0] <= 0 || key[1] <= 0)) return [];
            return [{name:(node.properties.get("display-name")?.replace(/^"|"$/g,"") || node.name).slice(0,48),keys}];
        });
        if (!layouts.length) throw Error("找不到可用的 key_physical_attrs 坐标，请导入含数字坐标的 DTSI");
        return layouts;
    }

    function validate(value) {
        if (!value || !Array.isArray(value.layers) || value.layers.length < 1 || value.layers.length > 48) return null;
        const size = value.layers[0]?.bindings?.length;
        if (!size || size > LIMIT || value.layers.some(layer => !Array.isArray(layer?.bindings) || layer.bindings.length !== size)) throw Error("键位数据无效");
        const string = (text,length) => typeof text === "string" ? text.slice(0,length) : "";
        const layers = value.layers.map((layer,index) => ({name:string(layer.name,48)||"Layer "+index,
            sourceBindingCount:Number.isInteger(layer.sourceBindingCount) && layer.sourceBindingCount >= 0 && layer.sourceBindingCount <= size ? layer.sourceBindingCount : size,
            encoders:Array.isArray(layer.encoders) ? layer.encoders.slice(0,16).map(item=>({clockwise:string(item?.clockwise,22),
                counterclockwise:string(item?.counterclockwise,22),transparent:item?.transparent === true})) : [],
            bindings:layer.bindings.map(binding => ({behavior:string(binding?.behavior,48),parameters:string(binding?.parameters,180),label:string(binding?.label,22)}))}));
        const physical = value.physical;
        const keys = physical?.keys;
        const accepted = Array.isArray(keys) && keys.length === size && keys.every(key => Array.isArray(key) && key.length === 7 && key[0] > 0 && key[1] > 0 && key.every(n => Number.isInteger(n) && Math.abs(n) <= 100000));
        return {file:string(value.file,120),layout:["grid","sofle","physical"].includes(value.layout) ? value.layout : "auto",layers,
            physical:accepted ? {name:string(physical.name,48),keys} : null};
    }

    function geometry(keymap) {
        if (!keymap) return {kind:"sofle-demo",keys:SOFLE.layout};
        const count = keymap.layers[0].bindings.length;
        if (keymap.layout === "physical" && keymap.physical) {
            const keys = keymap.physical.keys;
            const centers = keys.map(key => key[2] + key[0]/2).sort((a,b)=>a-b);
            let middle = (centers[Math.floor((count-1)/2)] + centers[Math.floor(count/2)])/2;
            let gap = 0;
            let centerDistance = count;
            for (let index = Math.max(1,Math.ceil(count/4)); index <= Math.min(count-1,Math.floor(count*3/4)); index++) {
                const distance = centers[index] - centers[index-1];
                const toCenter = Math.abs(index-count/2);
                if (distance > gap || distance === gap && toCenter < centerDistance) {
                    gap = distance; centerDistance = toCenter; middle = (centers[index] + centers[index-1])/2;
                }
            }
            return {kind:"physical-dtsi",keys:keys.map(([w,h,x,y,a,rx,ry],index) => [index,x+w/2 > middle ? 1 : 0,x,y,w,h,a/100,rx,ry])};
        }
        if ([58,64].includes(count) && (keymap.layout === "sofle" || keymap.layout === "auto" && /sofle/i.test(keymap.file))) {
            return {kind:"sofle-demo",keys:SOFLE.layout.slice(0,count)};
        }
        const left = Math.ceil(count/2);
        const cols = Math.ceil(Math.sqrt(left * 1.45));
        const keys = Array.from({length:count},(_,id) => {
            const hand = Number(id >= left), index = id - hand * left;
            return [id,hand,((index%cols)+hand*(cols+1))*100,Math.floor(index/cols)*100,90,90,0];
        });
        return {kind:"position-grid",keys};
    }

    function binding(keymap, layer, id) {
        if (!keymap) return {label:(layer === 1 ? SOFLE.functionNames[id] : null) ?? SOFLE.names[id] ?? "-"};
        const layers = keymap.layers;
        const current = layers[layer]?.bindings[id];
        const base = layers[0].bindings[id];
        return current?.behavior === "trans" || !current ? base : current;
    }

    return {parseKeymap,parsePhysical,validate,geometry,binding};
})();
