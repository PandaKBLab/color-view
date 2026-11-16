"use strict";

const SIZE = 128;
const COLORS = ["#000000", "#ffffff", "#ff0000", "#00ff00", "#0000ff", "#00ffff", "#ff00ff", "#ffff00"];
const [BLACK, WHITE, RED, GREEN, , CYAN, , YELLOW] = COLORS;
const COLOR_LABELS = Object.fromEntries(COLORS.map((color,index) => [color,["黑","白","红","绿","蓝","青","品红","黄"][index]]));
const THEME_COLORS = {auto:"跟随屏幕",...COLOR_LABELS};
const SIDES = ["left","right"];
const SIDE_LABEL = {left:"左屏",right:"右屏"};
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
    keys:{category:"keys", name:"键位与外设", height:64, min:32},
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
    status:{icon:["连接图标",{icons:"像素图标与档位",badge:"字母徽标与档位",text:"仅文字",none:"隐藏"}],
        linkColor:["连接颜色",{[CYAN]:"青",...COLOR_LABELS,auto:"跟随模块文字"}],
        battery:["电量图标",{percent:"百分比",gauge:"电池格",both:"电池格＋百分比",none:"隐藏"}],
        batteryColor:["电量颜色",{auto:"跟随模块文字",...COLOR_LABELS}],
        power:["供电与充电",{text:"PWR / CHG",icons:"插头 / 闪电",none:"隐藏"}]},
    keys:{keys:["键位范围",{local:"本侧",all:"双侧"}],keyLayer:["键位层",{active:"跟随当前层",base:"固定基础层"}]},
    sprite:{animation:["播放方式",{key:"按键触发",loop:"循环",still:"静态"}]},
    asset:{animation:["播放方式",{key:"按键触发",loop:"循环",still:"静态"}]},
};
const MODIFIERS = ["Ctrl", "Shift", "Alt", "GUI", "Caps", "Num"];
const LAYERS = ["QWERTY", "FUNCTION", "LAYER 2", "LAYER 3", "LAYER 4", "LAYER 5", "LAYER 6", "LAYER 7"];
const by = id => document.getElementById(id);
const each = selector => [...document.querySelectorAll(selector)];
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
    if (type !== "spacer") {
        module.foreground = COLORS.includes(values.foreground) ? values.foreground : "auto";
        module.background = COLORS.includes(values.background) ? values.background : "auto";
    }
    for (const [field,[, choices]] of Object.entries(OPTIONS[type] || {})) {
        module[field] = Object.hasOwn(choices, values[field]) ? values[field] : Object.keys(choices)[0];
    }
    return module;
}

const totalHeight = modules => modules.reduce((total,module) => total + module.height, 0);

function preset(name) {
    const content = {status:"layer",pixel:"sprite",keys:"keys"};
    const modules = [createModule("status"), createModule(content[name],{height:88}), createModule("mods")];
    return {preset:name, theme:name === "pixel" ? "dark" : "light", rotation:0, enabled:true, modules};
}

function defaultConfig() {
    return {version:3,trackball:false,keymap:null,library:[],screens:{left:preset("status"),right:preset("status")}};
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
    if (!raw || ![1,2,3].includes(raw.version) || !raw.screens) throw Error("配置格式不匹配");
    const readModule = value => {
        if (!value || !Number.isInteger(value.height) || typeof value.name !== "string") throw Error("模块数据不完整");
        return createModule(value.type,value);
    };
    if (raw.version >= 2) {
        if (!Array.isArray(raw.library) || raw.library.length > 40) throw Error("自定义模块库无效");
        result.library = raw.library.map(readModule);
        if (result.library.some(module => module.type === "spacer")) throw Error("空行应放在布局中");
    }
    result.trackball = raw.trackball === true || raw.hardware === "DB";
    result.keymap = ZmkLayout.validate(raw.keymap);
    for (const side of SIDES) {
        const value = raw.screens[side];
        if (!value || (raw.version >= 2 && !Array.isArray(value.modules))) throw Error("模块数据不完整");
        const modules = raw.version === 1 ? migrateModules(value) : value.modules.map(readModule);
        if (totalHeight(modules) > SIZE) throw Error("模块总高度超过 128 px");
        result.screens[side] = {
            preset:["status","pixel","keys"].includes(value.preset) ? value.preset : "custom",
            theme:value.theme === "dark" ? "dark" : "light", rotation:value.rotation === 180 ? 180 : 0,
            enabled:raw.version === 3 ? value.enabled !== false : !(raw.hardware === "DB" && side === "right"), modules,
        };
    }
    return result;
}

let config;
try { config = validate(JSON.parse(localStorage.getItem(STORAGE))); }
catch { config = defaultConfig(); }
let side = SIDES.find(hand => config.screens[hand].enabled) ?? "left";
const settings = () => config.screens[side];
let selectedIndex = -1;
let geometry;
const state = {
    endpoint:"BLE", profile:1, battery:78, usb:false, charge:false, layer:0, held:new Set(),
    manual:new Set(), caps:false, num:false, last:"", device:"", deviceUntil:0, kicked:0,
    scroll:false, recent:[], flashed:new Map(),
};
const assets = new WeakMap();
let toastTimeout;
const canvases = Object.fromEntries(SIDES.map(hand => [hand,by("lcd-"+hand)]));
const displays = Object.fromEntries(SIDES.map(hand => [hand,canvases[hand].getContext("2d")]));
const back = Object.assign(document.createElement("canvas"), {width:SIZE,height:SIZE});
const pen = back.getContext("2d");
for (const ctx of Object.values(displays)) ctx.imageSmoothingEnabled = false;
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
    save(); refreshControls();
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
    const linkColor = module.linkColor === "auto" ? fg : module.linkColor;
    const batteryColor = module.batteryColor === "auto" ? fg : module.batteryColor;
    if (module.icon === "icons") drawIcon(state.endpoint,6,top+3,linkColor);
    if (module.icon === "badge") {
        paint(5,top+3,10,9,linkColor);
        center(link[0],5,top+3,10,9,1,linkColor === BLACK || linkColor === "#0000ff" ? WHITE : BLACK);
    }
    if (module.icon !== "none") bitmap(link,module.icon === "text" ? 5 : 18,top+5,1,module.icon === "text" ? linkColor : fg);
    if (module.power === "text") {
        if (state.usb) bitmap("PWR",44,top+5,1,fg);
        if (state.charge) bitmap("CHG",62,top+5,1,fg);
    }
    if (module.power === "icons") {
        if (state.usb) drawIcon("PLUG",45,top+3,fg);
        if (state.charge) drawIcon("CHARGE",64,top+3,fg);
    }
    if (module.battery === "gauge" || module.battery === "both") {
        const x = module.battery === "both" ? 85 : 98;
        strokeBox(x,top+4,19,8,batteryColor);
        paint(x+19,top+6,2,4,batteryColor);
        paint(x+2,top+6,Math.round(state.battery*0.15),4,state.battery < 20 && module.batteryColor === "auto" ? RED : batteryColor);
    }
    if (module.battery === "percent" || module.battery === "both") {
        const number = state.battery + "%";
        bitmap(number,123-textWidth(number,1),top+5,1,batteryColor);
    }
    paint(4,y+h-1,120,1,fg);
}

const STATUS_ICONS = {BLE:[4,6,21,14,21,6,4],USB:[4,14,4,21,31,4,14],OFF:[0,17,10,4,10,17,0],
    PLUG:[10,10,31,17,14,4,4],CHARGE:[2,4,8,30,4,8,16]};

function drawIcon(icon,x,y,color) {
    STATUS_ICONS[icon].forEach((bits,row) => {
        for (let col=0; col<5; col++) if (bits & (16 >> col)) paint(x+col,y+row,1,1,color);
    });
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

const binding = (position,layer=state.layer) => ZmkLayout.binding(config.keymap,layer,position)?.label || "-";
const layerNames = () => config.keymap?.layers.map(layer => layer.name) ?? LAYERS;
const pixelText = (text,fallback) => /^[\x20-\x7e↑↓←→]+$/.test(text) ? text.slice(0,24) : fallback;

function screenKey(position, short, layer) {
    const long = binding(position,layer);
    const tiny = {Space:"SP",Enter:"ENT",Shift:"SFT",Ctrl:"CTL",Bksp:"BK",Mute:"MT",Caps:"CAP"};
    const label = tiny[long] || long;
    return pixelText(label,"-").slice(0,short ? 1 : 3);
}

function layoutBounds(keys) {
    if (!keys.length) return {x:0,y:0,w:100,h:100};
    const x = Math.min(...keys.map(key => key[2]));
    const y = Math.min(...keys.map(key => key[3]));
    return {x,y,w:Math.max(...keys.map(key=>key[2]+key[4]))-x,h:Math.max(...keys.map(key=>key[3]+key[5]))-y};
}

function prepareGeometry() {
    geometry = ZmkLayout.geometry(config.keymap);
    geometry.groups = [0,1].map(hand => geometry.keys.filter(key => key[1] === hand));
    geometry.bounds = [...geometry.groups,geometry.keys].map(layoutBounds);
    geometry.layerNames = layerNames();
}

function drawKeys(module,y,h,fg,bg,now,screen) {
    const all = module.keys === "all";
    const local = Number(screen === "right");
    const dims = geometry.bounds[all ? 2 : local];
    const keys = all ? geometry.keys : geometry.groups[local];
    const header = h >= 62 ? 9 : 0;
    const scale = Math.min(120/dims.w,(h-header-3)/dims.h);
    const left = (128-dims.w * scale)/2;
    const top = y + header + (h-header-dims.h*scale)/2;
    if (header) bitmap(all ? "ALL KEYS" : screen.toUpperCase()+" KEYS",5,y+2,1,fg);
    if (!keys.length) center("NO KEYS",0,y,SIZE,h,1,fg);
    for (const [id,,x0,y0,w0,h0] of keys) {
        const x = Math.round(left+(x0-dims.x)*scale), yy = Math.round(top+(y0-dims.y)*scale);
        const w = Math.max(2, Math.round(w0*scale)), high = Math.max(2,Math.round(h0*scale));
        const down = state.held.has(id) || (state.flashed.get(id) || 0) > now;
        if (down) paint(x,yy,w,high,GREEN);
        else strokeBox(x,yy,w,high,fg);
        const label = screenKey(id,all || w < 12,module.keyLayer === "base" ? 0 : state.layer);
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

function drawScreen(now,screen) {
    const s = config.screens[screen];
    if (!s.enabled) return;
    const ctx = displays[screen];
    const screenColor = s.theme === "dark" ? BLACK : WHITE;
    paint(0,0,SIZE,SIZE,screenColor);
    let y = 0;
    for (const module of s.modules) {
        const {height:h, type} = module;
        if (type !== "spacer") {
            pen.save();
            pen.beginPath();
            pen.rect(0,y,SIZE,h);
            pen.clip();
            const {background:bg,foreground:fg} = moduleColors(module,screenColor);
            if (bg !== screenColor) paint(0,y,SIZE,h,bg);
            if (type === "status") drawStatus(module,y,h,fg);
            if (type === "mods") drawMods(y,h,fg);
            if (type === "keys") drawKeys(module,y,h,fg,bg,now,screen);
            if (TYPES[type].category === "animation") drawAnimation(module,y,h,fg,now);
            if (type === "layer") drawValue(y,h,fg,"LAYER "+state.layer,pixelText(geometry.layerNames[state.layer] || "","LAYER "+state.layer));
            if (type === "last") drawValue(y,h,fg,"LAST KEY",pixelText(state.last || "-","-"));
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

function drawScreens(now) {
    while (state.recent.length && now - state.recent[0] >= 60000) state.recent.shift();
    for (const hand of SIDES) drawScreen(now,hand);
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
        const field = toolButton(module.name,() => selectModule(side,index,"module-"+index),"编辑" + module.name);
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
            const move = toolButton(symbol,() => moveModule(index,delta),(delta < 0 ? "上移" : "下移") + module.name);
            move.disabled = next < 0 || next >= modules.length;
            actions.append(move);
        }
        actions.append(toolButton("×",() => removeModule(index),"移除" + module.name));
        row.append(field,actions);
        return row;
    });
}

function selectModule(hand,index,focus) {
    side = hand;
    selectedIndex = index;
    refreshControls(focus);
}

function moveModule(index,delta,fromPreview=false) {
    const modules = settings().modules, next = index + delta;
    if (!modules[next]) return;
    [modules[index],modules[next]] = [modules[next],modules[index]];
    selectedIndex = next;
    layoutChanged(fromPreview ? "hit-"+side+"-"+next : "module-"+next);
}

function removeModule(index,fromPreview=false) {
    const modules = settings().modules;
    modules.splice(index,1);
    if (selectedIndex > index) selectedIndex--;
    if (selectedIndex >= modules.length) selectedIndex = modules.length-1;
    layoutChanged(selectedIndex < 0 ? "open-library" : (fromPreview ? "hit-"+side+"-" : "module-")+selectedIndex);
}

function screenHotspots(hand) {
    const screen = config.screens[hand];
    let y = 0;
    return screen.enabled ? screen.modules.map((module,index) => {
        const name = SIDE_LABEL[hand]+" · "+module.name;
        const button = toolButton("",() => selectModule(hand,index,button.id),"编辑"+name);
        button.id = "hit-"+hand+"-"+index;
        button.title = name + " · " + module.height + " px";
        button.setAttribute("aria-pressed",String(hand === side && index === selectedIndex));
        button.style.top = ((screen.rotation ? SIZE-y-module.height : y)/SIZE*100)+"%";
        button.style.height = (module.height/SIZE*100)+"%";
        y += module.height;
        return button;
    }) : [];
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
    const fields = {...(OPTIONS[module.type] || {})};
    if (module.type !== "spacer") {
        fields.foreground = ["文字颜色",THEME_COLORS];
        fields.background = ["背景颜色",THEME_COLORS];
    }
    for (const [key,[label,choices]] of Object.entries(fields)) {
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
    by("theme").value = s.theme;
    by("rotation").value = String(s.rotation);
    by("editing-side").textContent = SIDE_LABEL[side];
    by("preset-status").textContent = s.preset === "custom" ? "自定义" : "";
    by("track-toggle").checked = config.trackball;
    by("trackball").hidden = !config.trackball;
    by("export-png").disabled = !s.enabled;
    if (SIDES.some(hand => config.screens[hand].enabled)) {
        by("preview-title").textContent = SIDES.every(hand => config.screens[hand].enabled) ? "双屏预览" : "单屏预览";
    } else by("preview-title").textContent = "屏幕预览";
    each("[data-preset]").forEach(b => b.setAttribute("aria-pressed",String(s.preset === b.dataset.preset)));
    each("[data-side]").forEach(b => {
        b.setAttribute("aria-pressed",String(side === b.dataset.side));
    });
    for (const hand of SIDES) {
        const enabled = config.screens[hand].enabled;
        by("preview-"+hand).dataset.editing = String(hand === side);
        by("active-"+hand).hidden = !enabled;
        by("off-"+hand).hidden = enabled;
        document.querySelector('[data-screen-power="'+hand+'"]').checked = enabled;
        by("hotspots-"+hand).replaceChildren(...screenHotspots(hand));
    }
    const used = totalHeight(s.modules);
    const remaining = SIZE - used;
    by("height-text").textContent = "已用 " + used + " / 128 px · 剩余 " + remaining + " px";
    by("height-meter").value = used;
    by("modules").replaceChildren(...sectionRows(s.modules));
    by("empty-layout").hidden = s.modules.length > 0;
    const module = s.modules[selectedIndex];
    by("inspector-hint").hidden = Boolean(module);
    by("inspector-selection").hidden = !module;
    if (module) {
        by("selected-title").textContent = `${SIDE_LABEL[side]} · ${module.name}`;
        const up = toolButton("上移",() => moveModule(selectedIndex,-1,true));
        const down = toolButton("下移",() => moveModule(selectedIndex,1,true));
        const remove = toolButton("删除",() => removeModule(selectedIndex,true));
        up.disabled = selectedIndex === 0;
        down.disabled = selectedIndex === s.modules.length-1;
        [up,down,remove].forEach(button => { button.className = "button"; });
        remove.classList.add("danger");
        by("selected-actions").replaceChildren(up,down,remove);
    }
    by("module-options").replaceChildren(...moduleOptions(module,remaining + (module?.height ?? 0)));
    if (focus) by(focus)?.focus();
    drawScreens(performance.now());
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
    prepareGeometry();
    keyNodes.clear();
    codeToPosition.clear();
    for (const hand of SIDES) by("keyboard-"+hand).replaceChildren();
    for (const [id,hand,x,y,w,h,angle,originX,originY] of geometry.keys) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "key";
        button.dataset.position = id;
        button.dataset.deviceKey = String(geometry.kind === "sofle-demo" && id>=58);
        const box = geometry.bounds[hand];
        Object.assign(button.style,{left:(x-box.x+25)/(box.w+50)*100+"%",top:(y-box.y+25)/(box.h+50)*100+"%",
            width:w/(box.w+50)*100+"%",height:h/(box.h+50)*100+"%",transform:"rotate("+angle+"deg)"});
        if (Number.isFinite(originX) && Number.isFinite(originY)) button.style.transformOrigin = `${(originX-x)/w*100}% ${(originY-y)/h*100}%`;
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
        const code = keyCode(binding(id,0),hand);
        if (code && !codeToPosition.has(code)) codeToPosition.set(code,id);
    }
    for (const [index,hand] of SIDES.entries()) {
        const box = geometry.bounds[index];
        by("keyboard-"+hand).style.aspectRatio = `${box.w+50} / ${box.h+50}`;
    }
    by("layer").replaceChildren(...geometry.layerNames.map((name,index)=>new Option(index + " · " + name,String(index))));
    by("layer").value = String(state.layer);
    syncKeymapControls();
    renderKeyLabels();
}

function renderKeyLabels() {
    for (const [id,button] of keyNodes) {
        const label = binding(id);
        button.textContent = !config.keymap && id === 62 ? "中" : !config.keymap && id === 63 ? "●" : label;
        button.title = `位置 ${id} · ${label}`;
        button.setAttribute("aria-label",button.title);
    }
}

let fnReturn = null;
function setLayer(layer) {
    if (layer < 0 || layer >= geometry.layerNames.length) return;
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
    if (/^[A-Z0-9]$/.test(label)) state.recent.push(state.kicked);
    if (label === "Caps") state.caps = !state.caps;
    const row = ZmkLayout.binding(config.keymap,state.layer,id);
    const target = row?.parameters?.match(/^\d+$/) ? Number(row.parameters) : -1;
    if (fnReturn === null && (label === "Fn" && !config.keymap || row?.behavior === "mo" && target >= 0)) {
        fnReturn = {layer:state.layer,id};
        setLayer(config.keymap ? target : 1);
    }
    if (geometry.kind === "sofle-demo" && id >= 58) peripheral(["↑","↓","←","→","ENTER","MUTE"][id-58]);
    else by("last-event").textContent = "按键 "+label;
}

function release(id) {
    if (!state.held.delete(id)) return;
    state.flashed.set(id,performance.now()+260);
    if (fnReturn?.id === id) {
        setLayer(fnReturn.layer);
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

function keyCode(name,hand) {
    if (/^[A-Z]$/.test(name)) return "Key"+name;
    if (/^[0-9]$/.test(name)) return "Digit"+name;
    const codes = {Esc:"Escape",Bksp:"Backspace",Caps:"CapsLock","\\":"Backslash", "'":"Quote",
        ";":"Semicolon",",":"Comma",".":"Period","/":"Slash","↑":"ArrowUp","↓":"ArrowDown","←":"ArrowLeft","→":"ArrowRight"};
    if (["Ctrl","Shift","Alt","GUI"].includes(name))
        return {Ctrl:"Control",Shift:"Shift",Alt:"Alt",GUI:"Meta"}[name]+(hand === 0 ? "Left" : "Right");
    return codes[name] || (name === "Space" || name === "Tab" || name === "Enter" ? name : "");
}
const codeToPosition = new Map();

function syncKeymapControls() {
    const keymap = config.keymap;
    const layout = by("keymap-layout");
    const modes = {"physical-dtsi":"物理配列","sofle-demo":"Sofle 示例配列","position-grid":"顺序网格"};
    by("load-physical").disabled = !keymap;
    by("reset-keymap").hidden = !keymap;
    layout.disabled = !keymap;
    layout.value = keymap?.layout ?? "auto";
    layout.querySelector('option[value="physical"]').disabled = !keymap?.physical;
    layout.querySelector('option[value="sofle"]').disabled = ![58,64].includes(geometry.keys.length);
    const shortLayers = keymap?.layers.filter(layer => layer.sourceBindingCount < geometry.keys.length).length || 0;
    by("keymap-info").textContent = `${keymap ? keymap.file + " · " : ""}${modes[geometry.kind]} · ${geometry.keys.length} 键${keymap ? " · "+keymap.layers.length+" 层" : ""}${shortLayers ? " · "+shortLayers+" 层末尾有空位" : ""}`;
    by("left-hw").textContent = geometry.kind === "sofle-demo" && geometry.keys.length === 64 ? "五向开关" : "";
    by("right-hw").textContent = config.trackball ? "轨迹球模拟" : geometry.kind === "sofle-demo" && geometry.keys.length === 64 ? "旋钮" : "";
}

function setKeymap(keymap) {
    config.keymap = keymap;
    state.held.clear(); state.flashed.clear(); state.layer = 0;
    fnReturn = null;
    createKeyboard();
    save(); refreshControls();
}

function download(blob,name) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url),1000);
}

function moduleColors(module,screenBackground) {
    const background = module.background === "auto" ? screenBackground : module.background;
    const foreground = module.foreground === "auto" ? (background === BLACK || background === "#0000ff" ? WHITE : BLACK) : module.foreground;
    return {background,foreground};
}

function exportProject() {
    const exportedAssets = {};
    const screens = Object.fromEntries(SIDES.map(hand => {
        const screen = config.screens[hand];
        const background = screen.theme === "dark" ? BLACK : WHITE;
        let y = 0;
        const modules = screen.modules.map((module,index) => {
            const assetId = module.type === "sprite" ? "pixel-chicken" : assets.has(module) ? hand+"-"+index : undefined;
            if (assetId && !exportedAssets[assetId]) {
                exportedAssets[assetId] = ZmkProject.encode(module.type === "sprite" ? chicken : assets.get(module),COLORS);
            }
            const colors = module.type === "spacer" ? undefined : moduleColors(module,background);
            const entry = {...module,x:0,y,width:SIZE,colors,inputs:ZmkProject.events[module.type]};
            if (assetId) entry.assetId = assetId;
            y += module.height;
            return entry;
        });
        return [hand,{...screen,background,modules}];
    }));
    return {
        format:ZmkProject.format,version:1,
        display:{width:SIZE,height:SIZE,colorMode:"RGB111",palette:COLORS,origin:"top-left before rotation"},
        screens,assets:exportedAssets,
        keyboard:{geometrySource:geometry.kind,geometryUnits:"centi-keyunit",file:config.keymap?.file ?? null,
            positions:geometry.keys.map(([index,hand,x,y,width,height,rotation,originX,originY]) => ({
                index,side:SIDES[hand],x,y,width,height,rotation,originX,originY,
            })),
            layers:config.keymap?.layers ?? [0,1].map(layer => ({name:geometry.layerNames[layer],bindings:geometry.keys.map(([id]) => ({label:binding(id,layer)}))})),
        },
        keymap:config.keymap ? {file:config.keymap.file,layout:config.keymap.layout,physical:config.keymap.physical} : null,
        trackball:config.trackball,library:config.library,integration:ZmkProject.integration,
    };
}

function importProject(raw) {
    if (raw?.format !== ZmkProject.format) return validate(raw);
    if (raw.version !== 1) throw Error("此 ZMK 布局格式版本不受支持");
    const keymap = raw.keymap ? {...raw.keymap,layers:raw.keyboard?.layers} : null;
    const next = validate({...raw,keymap,version:3});
    const loaded = new Map();
    for (const hand of SIDES) {
        for (const [index,module] of next.screens[hand].modules.entries()) {
            const id = raw.screens[hand].modules[index]?.assetId;
            if (!id || module.type !== "asset") continue;
            if (typeof id !== "string" || !Object.hasOwn(raw.assets ?? {},id)) throw Error("找不到导出的动图素材");
            if (!loaded.has(id)) loaded.set(id,ZmkProject.decode(raw.assets[id],COLORS));
            assets.set(module,loaded.get(id));
        }
    }
    return next;
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

by("track-toggle").onchange = e => {
    config.trackball = e.target.checked;
    syncKeymapControls(); save(); refreshControls();
};
each("[data-screen-power]").forEach(input => input.onchange = () => {
    const hand = input.dataset.screenPower;
    config.screens[hand].enabled = input.checked;
    const other = SIDES.find(item => item !== hand);
    if (!input.checked && side === hand && config.screens[other].enabled) {
        side = other; selectedIndex = -1;
    }
    save(); refreshControls();
});
by("theme").onchange = e => update("theme",e.target.value);
by("rotation").onchange = e => update("rotation",Number(e.target.value));
each("[data-preset]").forEach(b=>b.onclick=()=>{
    const {rotation,enabled} = settings();
    config.screens[side] = {...preset(b.dataset.preset),rotation,enabled};
    selectedIndex = -1;
    save(); refreshControls();
});
each("[data-side]").forEach(b=>b.onclick=()=>{ side=b.dataset.side; selectedIndex = -1; refreshControls(); });
by("load-keymap").onclick = () => by("keymap-file").click();
by("load-physical").onclick = () => by("physical-file").click();
by("reset-keymap").onclick = () => setKeymap(null);
by("keymap-layout").onchange = e => setKeymap({...config.keymap,layout:e.target.value});
function onTextUpload(id, callback) {
    by(id).onchange = async e => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            if (file.size > 1024*1024) throw Error("键位文件须小于 1 MB");
            callback(await file.text(),file.name);
        } catch (error) { note("导入失败 · " + error.message); }
        finally { e.target.value = ""; }
    };
}
onTextUpload("keymap-file",(text,name) => {
    const keymap = ZmkLayout.parseKeymap(text,name);
    setKeymap(keymap);
    note("已读取 " + geometry.keys.length + " 键 · " + keymap.layers.length + " 层");
});
onTextUpload("physical-file",text => {
    const matches = ZmkLayout.parsePhysical(text).filter(layout => layout.keys.length === geometry.keys.length);
    if (!matches.length) throw Error("没有与当前 keymap 键数相同的物理配列");
    setKeymap({...config.keymap,layout:"physical",physical:matches[0]});
    note("已应用物理配列 · " + matches[0].name + (matches.length > 1 ? "（第一个匹配项）" : ""));
});
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
    if (b.dataset.device === "MUTE" && geometry.kind === "sofle-demo" && keyNodes.has(63)) { press(63); release(63); }
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
by("export-png").onclick = () => {
    const hand = side;
    canvases[hand].toBlob(b=>{ if(b) download(b,"color-view-"+hand+"-128.png"); });
};
by("export-config").onclick = () => {
    try {
        const project = exportProject();
        download(new Blob([JSON.stringify(project,null,2)+"\n"],{type:"application/json"}),"color-view.zmk.json");
        note("已导出 ZMK 显示布局，可和固件工程一起交给 AI");
    } catch (error) { note("导出失败 · "+error.message); }
};
by("import-config").onclick = () => by("config-file").click();
by("config-file").onchange = async e => {
    const file = e.target.files[0];
    if (!file) return;
    try {
        if (file.size > 12_000_000) throw Error("配置文件过大");
        config = importProject(JSON.parse(await file.text()));
        side = SIDES.find(hand => config.screens[hand].enabled) ?? "left";
        selectedIndex = -1;
        setKeymap(config.keymap); note("已导入布局");
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
    drawScreens(now);
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
