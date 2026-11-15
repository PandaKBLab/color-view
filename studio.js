"use strict";

const SIZE = 128;
const COLORS = ["#000000", "#ffffff", "#ff0000", "#00ff00", "#0000ff", "#00ffff", "#ff00ff", "#ffff00"];
const [BLACK, WHITE, RED, GREEN, , CYAN, , YELLOW] = COLORS;
const PIXELS = {
    A:"25755", B:"65656", C:"74447", D:"65556", E:"74647", F:"74644", G:"74557",
    H:"55755", I:"72227", J:"11156", K:"55655", L:"44447", M:"77555", N:"67553",
    O:"75557", P:"75644", Q:"75571", R:"65655", S:"74617", T:"72222", U:"55557",
    V:"55552", W:"55577", X:"55255", Y:"55222", Z:"71247",
    0:"75557", 1:"26227", 2:"71747", 3:"71717", 4:"55711", 5:"74717",
    6:"74757", 7:"71122", 8:"75757", 9:"75717",
    " ":"00000", "-":"00700", "+":"02720", ".":"00002", "%":"51245", "/":"11244",
    "\\":"44211", "[":"64446", "]":"31113", "'":"22000", ";":"02024", ",":"00024",
    "=":"07070", "\x60":"42000", "↑":"27222", "↓":"22272", "←":"24742", "→":"21712",
};
const CATEGORIES = {status:"状态栏", keys:"按键图", animation:"动图", interaction:"交互"};
const TYPES = {
    status:{category:"status", name:"连接与电量", height:16, min:12},
    keys:{category:"keys", name:"Sofle 键位与外设", height:64, min:32},
    sprite:{category:"animation", name:"方块鸡", height:48, min:16},
    asset:{category:"animation", name:"本地图片／GIF", height:48, min:16},
    layer:{category:"interaction", name:"当前层", height:24, min:16},
    last:{category:"interaction", name:"最近键值", height:24, min:16},
    wpm:{category:"interaction", name:"WPM", height:24, min:16},
    wave:{category:"interaction", name:"WPM 波形", height:32, min:20},
    mods:{category:"interaction", name:"修饰键与锁定", height:16, min:12},
    spacer:{name:"空行", height:4, min:1},
};
const OPTIONS = {
    status:{icon:["连接样式",{icons:"像素图标",text:"纯文字"}],battery:["电量样式",{percent:"百分比",gauge:"电池格"}]},
    keys:{keys:["键位范围",{local:"本侧",all:"双侧"}]},
    sprite:{animation:["播放方式",{key:"按键触发",loop:"循环",still:"静态"}]},
    asset:{animation:["播放方式",{key:"按键触发",loop:"循环",still:"静态"}]},
};
const MODIFIERS = ["Ctrl", "Shift", "Alt", "GUI", "Caps", "Num"];
const LAYERS = ["QWERTY", "FUNCTION", "LAYER 2", "LAYER 3", "LAYER 4", "LAYER 5", "LAYER 6", "LAYER 7"];
const by = id => document.getElementById(id);
const each = selector => [...document.querySelectorAll(selector)];
const copy = value => JSON.parse(JSON.stringify(value));
const STORAGE = "color-view-studio-prototype-v1";

function createModule(type, values = {}) {
    if (!Object.hasOwn(TYPES,type)) throw Error("模块类型无效");
    const template = TYPES[type];
    const height = values.height ?? template.height;
    if (!Number.isInteger(height) || height < template.min || height > SIZE) {
        throw Error(`${template.name}高度须为 ${template.min}–${SIZE} px`);
    }
    const name = type === "spacer" ? template.name : String(values.name ?? template.name).trim().slice(0,24);
    const module = {type, name:name || template.name, height};
    for (const [field,[, choices]] of Object.entries(OPTIONS[type] || {})) {
        module[field] = Object.hasOwn(choices, values[field]) ? values[field] : Object.keys(choices)[0];
    }
    return module;
}

const totalHeight = modules => modules.reduce((total,module) => total + module.height, 0);

function preset(name) {
    const content = {status:"layer",pixel:"sprite",keys:"keys"};
    const modules = [createModule("status"), createModule(content[name],{height:88}), createModule("mods")];
    return {preset:name, theme:name === "pixel" ? "dark" : "light", rotation:0, modules};
}

function defaultConfig() {
    return {version:2,hardware:"DD",library:[],screens:{left:preset("status"),right:preset("status")}};
}

function migrateModules(screen) {
    if (!Array.isArray(screen.order) || !Array.isArray(screen.enabled)) throw Error("模块数据不完整");
    const order = [...new Set(screen.order)].filter(type =>
        ["status","feature","keys","mods"].includes(type) && screen.enabled.includes(type));
    const flexible = order.filter(type => type === "feature" || type === "keys");
    const room = SIZE - 16 * (order.length - flexible.length);
    const regular = flexible.length ? Math.floor(room / flexible.length) : 0;
    return order.map(type => {
        const height = flexible.includes(type)
            ? (type === flexible.at(-1) ? room - regular * (flexible.length - 1) : regular) : 16;
        const variant = ["layer","sprite","last","wpm","asset"].includes(screen.feature) ? screen.feature : "layer";
        return createModule(type === "feature" ? variant : type, {...screen,height});
    });
}

function validate(raw) {
    const result = defaultConfig();
    if (!raw || ![1,2].includes(raw.version) || !raw.screens) throw Error("配置格式不匹配");
    const readModule = value => {
        if (!value || !Number.isInteger(value.height) || typeof value.name !== "string") throw Error("模块数据不完整");
        return createModule(value.type,value);
    };
    if (raw.version === 2) {
        if (!Array.isArray(raw.library) || raw.library.length > 40) throw Error("自定义模块库无效");
        result.library = raw.library.map(readModule);
        if (result.library.some(module => module.type === "spacer")) throw Error("空行应放在布局中");
    }
    result.hardware = raw.hardware === "DB" ? "DB" : "DD";
    for (const side of ["left","right"]) {
        const value = raw.screens[side];
        if (!value || (raw.version === 2 && !Array.isArray(value.modules))) throw Error("模块数据不完整");
        const modules = raw.version === 1 ? migrateModules(value) : value.modules.map(readModule);
        if (totalHeight(modules) > SIZE) throw Error("模块总高度超过 128 px");
        result.screens[side] = {
            preset:["status","pixel","keys"].includes(value.preset) ? value.preset : "custom",
            theme:value.theme === "dark" ? "dark" : "light", rotation:value.rotation === 180 ? 180 : 0, modules,
        };
    }
    return result;
}

let config;
try { config = validate(JSON.parse(localStorage.getItem(STORAGE))); }
catch { config = defaultConfig(); }
let side = "left";
const settings = () => config.screens[side];
let selectedIndex = -1;
const state = {
    endpoint:"BLE", profile:1, battery:78, usb:false, charge:false, layer:0, held:new Set(),
    manual:new Set(), caps:false, num:false, last:"", device:"", deviceUntil:0, kicked:0,
    scroll:false, recent:[], flashed:new Map(),
};
const assets = new WeakMap();
let toastTimeout;
const canvas = by("lcd");
const ctx = canvas.getContext("2d");
const back = Object.assign(document.createElement("canvas"), {width:SIZE,height:SIZE});
const pen = back.getContext("2d");
ctx.imageSmoothingEnabled = false;
pen.imageSmoothingEnabled = false;

function note(text) {
    const el = by("toast");
    clearTimeout(toastTimeout);
    el.textContent = text;
    el.hidden = false;
    toastTimeout = setTimeout(() => { el.hidden = true; }, 3000);
}

function save() {
    try { localStorage.setItem(STORAGE, JSON.stringify(config)); } catch {}
}

function update(key, value) {
    const s = settings();
    if (s[key] === value) return;
    s[key] = value;
    layoutChanged();
}

function layoutChanged(focus) {
    settings().preset = "custom";
    save();
    refreshControls(focus);
}

function paint(x, y, w, h, color) {
    pen.fillStyle = color;
    pen.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

function strokeBox(x,y,w,h,color) {
    paint(x,y,w,1,color); paint(x,y+h-1,w,1,color);
    paint(x,y,1,h,color); paint(x+w-1,y,1,h,color);
}

function textWidth(value, scale) { return Math.max(0, value.length * 4 - 1) * scale; }

function bitmap(text, x, y, scale, color) {
    for (const character of String(text).toUpperCase()) {
        const glyph = PIXELS[character] || PIXELS["-"];
        for (let row = 0; row < 5; row++) for (let col = 0; col < 3; col++) {
            if (Number(glyph[row]) & (4 >> col)) paint(x + col * scale, y + row * scale, scale, scale, color);
        }
        x += scale * 4;
    }
}

function center(text, x, y, w, h, scale, color) {
    bitmap(text, x + (w - textWidth(text,scale))/2, y + (h - 5*scale)/2, scale, color);
}

function paletteOptions() {
    const names = ["黑","白","红","绿","蓝","青","品红","黄"];
    COLORS.forEach((color,i) => {
        const dot = document.createElement("i");
        dot.style.backgroundColor = color;
        dot.title = names[i];
        by("palette").append(dot);
    });
}

function makeChickenFrame(frame) {
    const sprite = Object.assign(document.createElement("canvas"),{width:SIZE,height:SIZE});
    const p = sprite.getContext("2d");
    const rectangle = (color,x,y,w,h) => { p.fillStyle = color; p.fillRect(x,y,w,h); };
    const hop = [0,7,16,8][frame];
    const x = 32 + [0,7,14,7][frame];
    rectangle(CYAN,0,0,SIZE,SIZE);
    rectangle(WHITE,8,27,27,7); rectangle(WHITE,18,20,12,7);
    rectangle(WHITE,88,15,30,7); rectangle(WHITE,98,8,14,7);
    rectangle(BLACK,0,102,SIZE,26); rectangle(GREEN,0,96,SIZE,10);
    for (const col of [7,21,98,110,119]) rectangle(GREEN,col,92,4,4);
    rectangle(WHITE,x,60-hop,38,23); rectangle(WHITE,x+26,39-hop,23,28);
    rectangle(WHITE,x-8,54-hop,11,13); rectangle(RED,x+29,35-hop,14,5);
    rectangle(YELLOW,x+49,50-hop,10,7); rectangle(RED,x+42,57-hop,7,8);
    rectangle(BLACK,x+40,46-hop,5,5); rectangle(YELLOW,x+7,65-hop,16,8);
    rectangle(YELLOW,x+8,83-hop,6,13-frame); rectangle(YELLOW,x+24,83-hop,6,10+(frame%2)*3);
    return sprite;
}

const chickenFrames = [0,1,2,3].map(makeChickenFrame);
const chicken = [0,1,2,3,2,1].map((frame,i) => ({
    canvas:chickenFrames[frame], ms:[280,100,100,150,100,100][i],
}));

function animationFrame(frames, mode, now) {
    if (mode === "still" || (mode === "key" && !state.kicked)) return frames[0].canvas;
    const duration = frames.reduce((total,f) => total + f.ms, 0);
    let time = mode === "loop" ? now % duration : now - state.kicked;
    if (time >= duration) return frames[0].canvas;
    for (const frame of frames) {
        if (time < frame.ms) return frame.canvas;
        time -= frame.ms;
    }
    return frames[0].canvas;
}

function drawStatus(module, y, h, fg) {
    const top = y + Math.floor((h - 16) / 2);
    const link = state.endpoint === "BLE" ? "BT" + state.profile : state.endpoint;
    if (module.icon === "icons") {
        const tint = state.endpoint === "OFF" ? RED : CYAN;
        paint(5,top+3,10,9,tint);
        center(state.endpoint === "BLE" ? "B" : state.endpoint === "USB" ? "U" : "-",
            5,top+3,10,9,1,BLACK);
    }
    bitmap(link, module.icon === "icons" ? 18 : 5, top+5, 1, fg);
    if (state.usb) bitmap("PWR", 44, top+5, 1, fg);
    if (state.charge) bitmap("CHG", 63, top+5, 1, fg);
    if (module.battery === "gauge") {
        strokeBox(96,top+4,24,8,fg);
        paint(120,top+6,2,4,fg);
        paint(98,top+6,Math.round(Math.min(20,state.battery/5)),4,state.battery < 20 ? RED : fg);
    } else {
        const number = state.battery + "%";
        bitmap(number, 123-textWidth(number,1), top+5, 1, fg);
    }
    paint(4,y+h-1,120,1,fg);
}

function modifiers() {
    const on = new Set(state.manual);
    for (const position of state.held) {
        const key = binding(position);
        if (MODIFIERS.slice(0,4).includes(key)) on.add(key);
    }
    if (state.caps) on.add("Caps");
    if (state.num) on.add("Num");
    return on;
}

function drawMods(y,h,fg) {
    const on = modifiers();
    const labels = ["CTL","SFT","ALT","GUI","CAP","NUM"];
    const top = y + Math.floor((h-10)/2);
    for (let i = 0; i < labels.length; i++) {
        const x = 5 + i * 20;
        const active = on.has(MODIFIERS[i]);
        if (active) paint(x,top,18,10,YELLOW);
        else strokeBox(x,top,18,10,fg);
        center(labels[i],x,top,18,10,1,active ? BLACK : fg);
    }
}

function drawAnimation(module,y,h,fg,now) {
    const frames = module.type === "sprite" ? chicken : assets.get(module);
    if (!frames) { center("ADD IMAGE",0,y,SIZE,h,2,fg); return; }
    const frameSize = Math.min(h-4,SIZE-8);
    const offsetX = Math.floor((SIZE-frameSize)/2);
    const offsetY = y + Math.floor((h-frameSize)/2);
    pen.drawImage(animationFrame(frames,module.animation,now),offsetX,offsetY,frameSize,frameSize);
}

function drawValue(y,h,fg,label,value) {
    center(label,0,y,SIZE,8,1,fg);
    const scale = Math.max(1,Math.min(4,Math.floor(120 / textWidth(value,1)),Math.floor((h-9)/5)));
    center(value,0,y+8,SIZE,h-8,scale,fg);
}

function drawWave(y,h,fg,now) {
    const samples = Array(12).fill(0);
    for (const time of state.recent) {
        const sample = 11 - Math.floor((now - time)/5000);
        if (sample >= 0 && sample < samples.length) samples[sample]++;
    }
    const max = Math.max(1,...samples);
    const bottom = y + h - 3;
    bitmap("WPM "+Math.round(state.recent.length/5),5,y+2,1,fg);
    paint(5,bottom,118,1,fg);
    const levels = samples.map(count => bottom - Math.round(count * (h-12) / max));
    for (let index = 1; index < levels.length; index++) {
        const from = levels[index-1], to = levels[index];
        const x = 8 + (index-1)*10;
        const steps = Math.max(10,Math.abs(to-from));
        for (let step = 0; step <= steps; step++) {
            paint(x + 10*step/steps,from + (to-from)*step/steps,1,1,fg);
        }
    }
}

function binding(position) {
    return (state.layer === 1 ? SOFLE.functionNames[position] : null) ?? SOFLE.names[position];
}

function screenKey(position, short) {
    const long = binding(position);
    const tiny = {Space:"SP",Enter:"ENT",Shift:"SFT",Ctrl:"CTL",Bksp:"BK",Mute:"MT",Caps:"CAP"};
    const label = tiny[long] || long;
    return label.slice(0,short ? 1 : 3);
}

function drawKeys(module,y,h,fg,bg,now) {
    const all = module.keys === "all";
    const local = side === "left" ? 0 : 1;
    const dims = {x: all ? 0 : (local === 0 ? 0 : 795), w:all ? 1550 : 760, h:595};
    const header = h >= 62 ? 9 : 0;
    const scale = Math.min(120/dims.w,(h-header-3)/dims.h);
    const left = (128-dims.w * scale)/2;
    const top = y + header + (h-header-dims.h*scale)/2;
    if (header) bitmap(all ? "ALL KEYS" : side.toUpperCase()+" KEYS",5,y+2,1,fg);
    for (const [id,hand,x0,y0,w0,h0] of SOFLE.layout) {
        if (!all && hand !== local) continue;
        const x = Math.round(left+(x0-dims.x)*scale), yy = Math.round(top+y0*scale);
        const w = Math.max(2, Math.round(w0*scale)), high = Math.max(2,Math.round(h0*scale));
        const down = state.held.has(id) || (state.flashed.get(id) || 0) > now;
        if (down) paint(x,yy,w,high,GREEN);
        else strokeBox(x,yy,w,high,fg);
        const label = screenKey(id,all || w < 12);
        if (high >= 7 && w >= 5 && textWidth(label,1) <= w-2) {
            center(label,x,yy,w,high,1,down ? BLACK : fg);
        }
    }
    if (state.device && now < state.deviceUntil) {
        const tag = state.device.toUpperCase();
        const width = textWidth(tag,1) + 10;
        paint(128-width-4,y+2,width,10,bg);
        strokeBox(128-width-4,y+2,width,10,fg);
        center(tag,128-width-4,y+2,width,10,1,fg);
    }
}

function drawScreen(now) {
    const s = settings();
    const fg = s.theme === "dark" ? WHITE : BLACK;
    const bg = s.theme === "dark" ? BLACK : WHITE;
    paint(0,0,128,128,bg);
    while (state.recent.length && now - state.recent[0] >= 60000) state.recent.shift();
    let y = 0;
    for (const module of s.modules) {
        const {height:h, type} = module;
        if (type !== "spacer") {
            pen.save();
            pen.beginPath();
            pen.rect(0,y,SIZE,h);
            pen.clip();
            if (type === "status") drawStatus(module,y,h,fg);
            if (type === "mods") drawMods(y,h,fg);
            if (type === "keys") drawKeys(module,y,h,fg,bg,now);
            if (TYPES[type].category === "animation") drawAnimation(module,y,h,fg,now);
            if (type === "layer") drawValue(y,h,fg,"LAYER "+state.layer,LAYERS[state.layer]);
            if (type === "last") drawValue(y,h,fg,"LAST KEY",state.last || "-");
            if (type === "wpm") drawValue(y,h,fg,"WPM",String(Math.round(state.recent.length/5)));
            if (type === "wave") drawWave(y,h,fg,now);
            pen.restore();
        }
        y += module.height;
    }
    ctx.setTransform(s.rotation === 180 ? -1 : 1,0,0,s.rotation === 180 ? -1 : 1,
        s.rotation === 180 ? 128 : 0,s.rotation === 180 ? 128 : 0);
    ctx.drawImage(back,0,0);
    ctx.resetTransform();
}

function optionSelect(label, key, choices, value, onChange) {
    const field = document.createElement("label");
    field.className = "option-row";
    field.textContent = label;
    const select = document.createElement("select");
    select.id = "option-" + key;
    for (const [item, name] of Object.entries(choices)) select.add(new Option(name,item));
    select.value = value;
    select.onchange = () => onChange(select.value,select.id);
    field.append(select);
    return field;
}

function toolButton(label, action, title = label) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.setAttribute("aria-label",title);
    button.onclick = action;
    return button;
}

function insertModule(template) {
    const modules = settings().modules;
    const available = SIZE - totalHeight(modules);
    if (template.height > available) {
        const message = "只剩 " + available + " px。请先缩短或移除其他模块，再添加 " + template.height + " px 的" + template.name + "。";
        note(message);
        by("library-message").textContent = message;
        return false;
    }
    const insertAt = selectedIndex < 0 ? modules.length : selectedIndex + 1;
    modules.splice(insertAt,0,createModule(template.type,template));
    selectedIndex = insertAt;
    layoutChanged();
    return true;
}

function sectionRows(modules) {
    return modules.map((module,index) => {
        const row = document.createElement("div");
        row.className = "module";
        row.dataset.selected = String(index === selectedIndex);
        const field = toolButton(module.name,() => {
            selectedIndex = index;
            refreshControls("module-" + index);
        },"编辑" + module.name);
        field.id = "module-" + index;
        field.className = "module-select";
        field.setAttribute("aria-pressed",String(index === selectedIndex));
        const meta = document.createElement("small");
        const category = CATEGORIES[TYPES[module.type].category];
        meta.textContent = category ? category + " · " + module.height + " px" : module.height + " px";
        field.append(meta);
        const actions = document.createElement("div");
        actions.className = "move";
        for (const [delta,symbol] of [[-1,"↑"],[1,"↓"]]) {
            const next = index + delta;
            const move = toolButton(symbol,() => {
                [modules[index],modules[next]] = [modules[next],modules[index]];
                selectedIndex = next;
                layoutChanged("module-" + next);
            },(delta < 0 ? "上移" : "下移") + module.name);
            move.disabled = next < 0 || next >= modules.length;
            actions.append(move);
        }
        actions.append(toolButton("×",() => {
            modules.splice(index,1);
            if (selectedIndex > index) selectedIndex--;
            if (selectedIndex >= modules.length) selectedIndex = modules.length-1;
            layoutChanged(selectedIndex < 0 ? "open-library" : "module-" + selectedIndex);
        },"移除" + module.name));
        row.append(field,actions);
        return row;
    });
}

function moduleOptions(module, maxHeight) {
    if (!module) return [];
    const heightRow = document.createElement("label");
    heightRow.className = "option-row";
    heightRow.textContent = "高度（px）";
    const height = document.createElement("input");
    Object.assign(height, {id:"selected-height",type:"number",step:1,required:true,
        min:TYPES[module.type].min,max:maxHeight,value:module.height});
    height.onchange = () => {
        if (!height.validity.valid) {
            note("可设高度为 " + height.min + "–" + height.max + " px");
            height.value = module.height;
            return;
        }
        module.height = height.valueAsNumber;
        layoutChanged(height.id);
    };
    heightRow.append(height);
    const options = [heightRow];
    for (const [key,[label,choices]] of Object.entries(OPTIONS[module.type] || {})) {
        options.push(optionSelect(label,key,choices,module[key],(value,id) => {
            module[key] = value;
            layoutChanged(id);
        }));
    }
    if (module.type === "asset") {
        const row = document.createElement("div");
        row.className = "option-row";
        row.textContent = assets.has(module) ? "素材已加载" : "待选择素材";
        const button = toolButton("选择素材",() => {
            assetTarget = module;
            by("asset-file").click();
        });
        button.className = "button";
        row.append(button);
        options.push(row);
    }
    return options;
}

function refreshControls(focus) {
    const s = settings();
    by("hardware").value = config.hardware;
    by("theme").value = s.theme;
    by("rotation").value = String(s.rotation);
    by("preset-status").textContent = s.preset === "custom" ? "自定义" : "";
    by("trackball").hidden = config.hardware !== "DB";
    by("right-hw").textContent = config.hardware === "DB" ? "旋钮 · 轨迹球" : "旋钮";
    each("[data-preset]").forEach(b => b.setAttribute("aria-pressed",String(s.preset === b.dataset.preset)));
    each("[data-side]").forEach(b => {
        b.setAttribute("aria-pressed",String(side === b.dataset.side));
        b.disabled = config.hardware === "DB" && b.dataset.side === "right";
        b.title = b.disabled ? "DB 装配只有左屏" : "";
    });
    const used = totalHeight(s.modules);
    const remaining = SIZE - used;
    by("height-text").textContent = "已用 " + used + " / 128 px · 剩余 " + remaining + " px";
    by("height-meter").value = used;
    by("modules").replaceChildren(...sectionRows(s.modules));
    by("empty-layout").hidden = s.modules.length > 0;
    const module = s.modules[selectedIndex];
    by("module-options").replaceChildren(...moduleOptions(module,remaining + (module?.height ?? 0)));
    if (focus) by(focus)?.focus();
    drawScreen(performance.now());
}

function renderLibrary() {
    const category = by("library-category").value;
    const builtIn = Object.keys(TYPES).filter(type => type !== "spacer").map(type => createModule(type));
    const entries = [...builtIn.map(module => ({module,saved:false})), ...config.library.map(module => ({module,saved:true}))];
    const rows = [];
    for (const {module,saved} of entries) {
        const group = TYPES[module.type].category;
        if (category === "custom" ? !saved : category !== "all" && category !== group) continue;
        const row = document.createElement("div");
        row.className = "library-row";
        const label = document.createElement("div");
        const name = document.createElement("strong");
        name.textContent = module.name;
        const meta = document.createElement("small");
        meta.textContent = CATEGORIES[group] + " · 128 × " + module.height + " px" + (saved ? " · 自建" : "");
        label.append(name,meta);
        const add = toolButton("添加",() => {
            if (insertModule(module)) {
                by("module-library").close();
                by("module-" + selectedIndex)?.focus();
            }
        },"添加" + module.name);
        add.className = "button";
        row.append(label,add);
        if (saved) {
            const remove = toolButton("×",() => {
                config.library = config.library.filter(item => item !== module);
                save();
                renderLibrary();
                by("library-category").focus();
            },"从模块库移除" + module.name);
            remove.className = "button";
            row.append(remove);
        }
        rows.push(row);
    }
    by("library-entries").replaceChildren(...rows);
    by("library-empty").hidden = rows.length > 0;
    by("library-message").textContent = "";
}

const builderType = by("builder-type");
const libraryFilter = by("library-category");
for (const [category,label] of Object.entries(CATEGORIES)) {
    libraryFilter.add(new Option(label,category));
    const group = document.createElement("optgroup");
    group.label = label;
    for (const [type,template] of Object.entries(TYPES)) {
        if (template.category === category) group.append(new Option(template.name,type));
    }
    builderType.append(group);
}
libraryFilter.add(new Option("自建模块","custom"));
libraryFilter.onchange = renderLibrary;

let builderDraft;
let assetTarget;
function initBuilder() {
    builderDraft = createModule(builderType.value);
    const height = by("builder-height");
    height.min = TYPES[builderDraft.type].min;
    height.value = builderDraft.height;
    by("builder-error").textContent = "";
    const options = Object.entries(OPTIONS[builderDraft.type] || {}).map(([key,[label,choices]]) =>
        optionSelect(label,"builder-"+key,choices,builderDraft[key],value => { builderDraft[key] = value; }));
    by("builder-options").replaceChildren(...options);
}

builderType.onchange = initBuilder;
by("open-library").onclick = () => {
    libraryFilter.value = "all";
    renderLibrary();
    by("module-library").showModal();
};
by("insert-spacer").onclick = () => {
    if (insertModule(createModule("spacer"))) by("selected-height")?.focus();
};
by("new-module").onclick = () => {
    by("module-library").close();
    by("builder-form").reset();
    initBuilder();
    by("module-builder").showModal();
};
by("builder-back").onclick = () => {
    by("module-builder").close();
    renderLibrary();
    by("module-library").showModal();
};
by("builder-form").onsubmit = e => {
    e.preventDefault();
    try {
        const name = by("builder-name").value.trim();
        if (!name) throw Error("请输入模块名称");
        if (config.library.length >= 40) throw Error("自建模块库已满，请先移除一个旧模块");
        const module = createModule(builderType.value,{...builderDraft,name,height:by("builder-height").valueAsNumber});
        config.library.push(module);
        save();
        by("module-builder").close();
        libraryFilter.value = "custom";
        renderLibrary();
        by("module-library").showModal();
    } catch (error) { by("builder-error").textContent = error.message; }
};

const keyNodes = new Map();
function createKeyboard() {
    for (const [id,hand,x,y,w,h,angle] of SOFLE.layout) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "key";
        button.dataset.position = id;
        button.dataset.deviceKey = String(id>=58);
        const x0 = hand === 0 ? -17 : 777;
        Object.assign(button.style,{left:(x-x0)/780*100+"%",top:(y+4)/595*100+"%",width:w/780*100+"%",
            height:h/595*100+"%",transform:"rotate("+angle+"deg)"});
        button.addEventListener("pointerdown",e=>{
            if (e.button !== 0) return;
            button.setPointerCapture(e.pointerId);
            press(id);
        });
        for (const e of ["pointerup","pointercancel","lostpointercapture"]) button.addEventListener(e,()=>release(id));
        button.addEventListener("click",e=>{
            if (e.detail !== 0) return;
            press(id); release(id);
        });
        by(hand === 0 ? "keyboard-left" : "keyboard-right").append(button);
        keyNodes.set(id,button);
    }
    renderKeyLabels();
}

function renderKeyLabels() {
    for (const [id,button] of keyNodes) {
        const label = binding(id);
        button.textContent = id === 62 ? "中" : id === 63 ? "●" : label;
        const side = SOFLE.layout[id][1] === 0 ? "左" : "右";
        const role = id>=58 && id<=62 ? "五向" : id===63 ? "旋钮按压" : "键位";
        button.title = side+"侧 "+role+" "+label;
        button.setAttribute("aria-label",button.title);
    }
}

let fnReturn = null;
function setLayer(layer) {
    state.layer = layer;
    by("layer").value = String(layer);
    renderKeyLabels();
}

function press(id) {
    if (state.held.has(id)) return;
    const label = binding(id);
    state.held.add(id);
    state.last = label;
    state.kicked = performance.now();
    if (id < 58 && /^[A-Z0-9]$/.test(label)) state.recent.push(state.kicked);
    if (label === "Caps") state.caps = !state.caps;
    if (label === "Fn" && fnReturn === null) {
        fnReturn = state.layer;
        setLayer(1);
    }
    if (id >= 58) peripheral(["↑","↓","←","→","ENTER","MUTE"][id-58]);
    else by("last-event").textContent = "按键 "+label;
}

function release(id) {
    if (!state.held.delete(id)) return;
    state.flashed.set(id,performance.now()+260);
    if (fnReturn !== null && !state.held.has(51) && !state.held.has(54)) {
        setLayer(fnReturn);
        fnReturn = null;
    }
}

function peripheral(event) {
    state.device = event;
    state.deviceUntil = performance.now()+1000;
    state.kicked = performance.now();
    state.last = event;
    by("last-event").textContent = "外设 "+event;
}

function keyCode(name,id) {
    if (/^[A-Z]$/.test(name)) return "Key"+name;
    if (/^[0-9]$/.test(name)) return "Digit"+name;
    const codes = {Esc:"Escape",Bksp:"Backspace",Caps:"CapsLock","\\":"Backslash", "'":"Quote",
        ";":"Semicolon",",":"Comma",".":"Period","/":"Slash","↑":"ArrowUp","↓":"ArrowDown","←":"ArrowLeft","→":"ArrowRight"};
    if (["Ctrl","Shift","Alt","GUI"].includes(name))
        return {Ctrl:"Control",Shift:"Shift",Alt:"Alt",GUI:"Meta"}[name]+(SOFLE.layout[id][1] === 0 ? "Left" : "Right");
    return codes[name] || (name === "Space" || name === "Tab" || name === "Enter" ? name : "");
}
const codeToPosition = new Map();
SOFLE.names.forEach((name,id) => {
    const code = keyCode(name,id);
    if (code && !codeToPosition.has(code)) codeToPosition.set(code,id);
});

function download(blob,name) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url),1000);
}

function quantize(image,w,h) {
    const c = Object.assign(document.createElement("canvas"),{width:128,height:128});
    const p = c.getContext("2d");
    p.imageSmoothingEnabled = false;
    p.fillStyle = "#000";
    p.fillRect(0,0,128,128);
    const s = 128 / Math.max(w,h);
    const dw = Math.max(1, Math.round(w*s)), dh = Math.max(1, Math.round(h*s));
    p.drawImage(image,Math.round((128-dw)/2),Math.round((128-dh)/2),dw,dh);
    const data = p.getImageData(0,0,128,128);
    for (let i = 0; i < data.data.length; i += 4)
        for (let channel = 0; channel < 3; channel++) data.data[i+channel] = data.data[i+channel] >= 128 ? 255 : 0;
    p.putImageData(data,0,0);
    return c;
}

async function readAsset(file) {
    if (file.size > 8_000_000) throw Error("素材请控制在 8 MB 以内");
    if (file.type === "image/gif") {
        if (!window.ImageDecoder) throw Error("当前浏览器无法逐帧读取 GIF，请用 Chrome／Edge 或导入静态图");
        const decoder = new ImageDecoder({type:"image/gif",data:await file.arrayBuffer()});
        const frames = [];
        try {
            await decoder.tracks.ready;
            const length = decoder.tracks.selectedTrack.frameCount;
            if (!length || length > 60) throw Error("GIF 请使用 1–60 帧");
            for (let frameIndex = 0; frameIndex < length; frameIndex++) {
                const {image} = await decoder.decode({frameIndex});
                try {
                    frames.push({canvas:quantize(image,image.displayWidth,image.displayHeight),
                        ms:Math.min(10000,Math.max(20,(image.duration || 100000)/1000))});
                } finally { image.close(); }
            }
        } finally { decoder.close(); }
        return frames;
    }
    const image = await createImageBitmap(file);
    try { return [{canvas:quantize(image,image.width,image.height),ms:1000}]; }
    finally { image.close(); }
}

by("hardware").onchange = e => {
    config.hardware = e.target.value;
    if (config.hardware === "DB" && side !== "left") { side = "left"; selectedIndex = -1; }
    save(); refreshControls();
};
by("theme").onchange = e => update("theme",e.target.value);
by("rotation").onchange = e => update("rotation",Number(e.target.value));
each("[data-preset]").forEach(b=>b.onclick=()=>{
    const rotation = settings().rotation;
    config.screens[side] = {...preset(b.dataset.preset),rotation};
    selectedIndex = -1;
    save(); refreshControls();
});
each("[data-side]").forEach(b=>b.onclick=()=>{ side=b.dataset.side; selectedIndex = -1; refreshControls(); });
by("endpoint").onchange = e => { state.endpoint = e.target.value; };
by("profile").onchange = e => { state.profile = +e.target.value; };
by("battery").oninput = e => { state.battery = +e.target.value; by("battery-value").value = state.battery+"%"; };
by("usb-power").onchange = e => { state.usb = e.target.checked; };
by("charging").onchange = e => { state.charge = e.target.checked; };
by("layer").onchange = e => { fnReturn = null; setLayer(+e.target.value); };
each("[data-mod]").forEach(b=>b.onclick=()=>{
    const key = b.dataset.mod;
    if (!state.manual.delete(key)) state.manual.add(key);
});
each("[data-lock]").forEach(b=>b.onclick=()=>{
    const flag = b.dataset.lock.toLowerCase();
    state[flag] = !state[flag];
});
each("[data-device]").forEach(b=>b.onclick=()=>{
    if (b.dataset.device === "MUTE") { press(63); release(63); }
    else peripheral(b.dataset.device);
});
by("scroll-mode").onclick = e => {
    state.scroll = !state.scroll;
    e.currentTarget.setAttribute("aria-pressed",String(state.scroll));
    peripheral(state.scroll ? "SCROLL" : "MOVE");
};
const track = by("track-surface");
function moveTrack(x,y) {
    const direction = Math.abs(x) > Math.abs(y) ? (x > 0 ? "→" : "←") : (y > 0 ? "↓" : "↑");
    peripheral((state.scroll ? "SC " : "")+direction);
    const dot = by("track-dot");
    dot.style.left = 50 + Math.max(-40,Math.min(40,x))+"%";
    dot.style.top = 50 + Math.max(-38,Math.min(38,y))+"%";
}
track.addEventListener("pointerdown",e=>track.setPointerCapture(e.pointerId));
track.addEventListener("pointermove",e=>{
    if (!(e.buttons & 1)) return;
    const bounds = track.getBoundingClientRect();
    moveTrack((e.clientX-bounds.left)/bounds.width*100-50,(e.clientY-bounds.top)/bounds.height*100-50);
});
track.addEventListener("wheel",e=>{ e.preventDefault(); peripheral(e.deltaY > 0 ? "SC ↓" : "SC ↑"); },{passive:false});
track.addEventListener("keydown",e=>{
    const directions = {ArrowUp:[0,-30],ArrowDown:[0,30],ArrowLeft:[-30,0],ArrowRight:[30,0]};
    if (!directions[e.key]) return;
    e.preventDefault();
    e.stopPropagation();
    moveTrack(...directions[e.key]);
});
window.addEventListener("keydown",e=>{
    if (!by("keyboard-capture").checked || e.repeat || e.target.closest?.("dialog,input,select,button,[contenteditable],#track-surface")) return;
    if ((e.ctrlKey || e.metaKey || e.altKey) && !/^(Control|Meta|Alt)/.test(e.code)) return;
    const id = codeToPosition.get(e.code);
    if (id === undefined) return;
    if (e.code !== "Tab") e.preventDefault();
    press(id);
});
window.addEventListener("keyup",e=>{
    const id = codeToPosition.get(e.code);
    if (id !== undefined) release(id);
});
window.addEventListener("blur",()=>[...state.held].forEach(release));
by("export-png").onclick = () => canvas.toBlob(b=>{ if(b) download(b,"color-view-"+side+"-128.png"); });
by("export-config").onclick = () => {
    download(new Blob([JSON.stringify(copy(config),null,2)],{type:"application/json"}),"color-view.json");
    if (Object.values(config.screens).some(screen => screen.modules.some(module => assets.has(module)))) {
        note("已导出画面设置，本地图片或 GIF 需在导入时重新选择。");
    }
};
by("import-config").onclick = () => by("config-file").click();
by("config-file").onchange = async e => {
    const file = e.target.files[0];
    if (!file) return;
    try {
        if (file.size > 256000) throw Error("配置文件过大");
        config = validate(JSON.parse(await file.text()));
        if (config.hardware === "DB") side = "left";
        selectedIndex = -1;
        save(); refreshControls(); note("已导入配置");
    } catch (error) { note("导入失败 · "+error.message); }
    finally { e.target.value = ""; }
};
by("asset-file").onchange = async e => {
    const file = e.target.files[0];
    const module = assetTarget;
    assetTarget = null;
    if (!file || !module) return;
    try {
        const frames = await readAsset(file);
        assets.set(module,frames);
        state.kicked = performance.now();
        if (settings().modules[selectedIndex] === module) refreshControls();
        note("已转换为 128×128 八色素材 · "+frames.length+" 帧");
    } catch (error) { note("素材读取失败 · "+error.message); }
    finally { e.target.value = ""; }
};

function tick(now) {
    drawScreen(now);
    for (const [id,until] of state.flashed) if (until <= now) state.flashed.delete(id);
    for (const [id,button] of keyNodes) button.classList.toggle("active",state.held.has(id)||state.flashed.has(id));
    const on = modifiers();
    each("[data-mod],[data-lock]").forEach(b => b.setAttribute("aria-pressed",String(on.has(b.dataset.mod || b.dataset.lock))));
    requestAnimationFrame(tick);
}

paletteOptions();
createKeyboard();
refreshControls();
requestAnimationFrame(tick);
