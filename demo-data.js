"use strict";

// Example key positions for the browser simulator.
const SOFLE = (() => {
    const layout = [];
    const stagger = [60,48,22,12,26,44];
    const add = (side,x,y,w=90,h=90,angle=0) => layout.push([layout.length,side,x,y,w,h,angle]);
    for (let row = 0; row < 4; row++) {
        for (let column = 0; column < 6; column++) add(0,column*99,stagger[column]+row*96);
        for (let column = 0; column < 6; column++) add(1,948+column*99,stagger[5-column]+row*96);
    }
    add(0,205,410); add(0,305,410); add(0,405,419); add(0,512,447,90,90,19); add(0,617,481,90,90,27);
    add(1,830,481,90,90,-27); add(1,935,447,90,90,-19); add(1,1042,419); add(1,1142,410); add(1,1242,410);
    add(0,654,260,46,46); add(0,654,362,46,46); add(0,603,311,46,46); add(0,705,311,46,46); add(0,654,311,46,46);
    add(1,831,315,70,70);

    const names = [
        "Esc","1","2","3","4","5", "6","7","8","9","0","Bksp",
        "Tab","Q","W","E","R","T", "Y","U","I","O","P","\\",
        "Caps","A","S","D","F","G", "H","J","K","L",";","'",
        "Shift","Z","X","C","V","B", "N","M",",",".","/","Shift",
        "Ctrl","GUI","Alt","Fn","Space", "Enter","Fn","Alt","GUI","Ctrl",
        "↑","↓","←","→","Enter","Mute",
    ];
    const functionNames = [
        null,"F1","F2","F3","F4","F5", "F6","F7","F8","F9","F10","Del",
        null,"F11","F12","Home","End",null, "←","↓","↑","→","PgUp","PgDn",
    ];
    return {layout,names,functionNames};
})();

// LCD cells redrawn from the visible keyboard layout. Indices follow the Sofle Mod keymap order.
const SOFLE_MOD_FACE = (() => {
    const cells = [];
    const tops = [36,36,10,0,13,26];
    const add = (hand,x,y) => cells.push([cells.length,hand,x,y,100,100]);
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 6; col++) add(0,col*100,tops[col]+row*100);
        for (let col = 0; col < 6; col++) add(1,(col+1)*100,tops[5-col]+row*100);
    }
    const thumbs = [410,400,413,426,486];
    for (let col = 0; col < thumbs.length; col++) add(0,200+col*100,thumbs[col]);
    for (let col = 0; col < thumbs.length; col++) add(1,col*100,thumbs[thumbs.length-1-col]);
    return {cells,fiveWay:[58,59,60,61,62],encoderPress:63};
})();

// Silakka54's public 54-key order, with six additional simulator input positions.
const SILAKKA = (() => {
    const layout = [];
    const stagger = [36,36,10,0,13,26];
    const add = (hand,x,y,w=100,h=100,angle=0) => layout.push([layout.length,hand,x,y,w,h,angle]);
    for (let row=0; row<4; row++) {
        for (let col=0; col<6; col++) add(0,col*100,stagger[col]+row*100);
        for (let col=0; col<6; col++) add(1,900+col*100,stagger[5-col]+row*100);
    }
    const thumbs = [412,427,461];
    for (let col=0; col<3; col++) add(0,400+col*100,thumbs[col]);
    for (let col=0; col<3; col++) add(1,800+col*100,thumbs[2-col]);
    add(0,648,260,40,40); add(0,648,350,40,40); add(0,603,305,40,40);
    add(0,693,305,40,40); add(0,648,305,40,40);
    add(1,817,297,68,68);

    const names = [
        "Esc","1","2","3","4","5", "6","7","8","9","0","-",
        "Tab","Q","W","E","R","T", "Y","U","I","O","P","Bksp",
        "Ctrl","A","S","D","F","G", "H","J","K","L",";","'",
        "Shift","Z","X","C","V","B", "N","M",",",".","/","Shift",
        "GUI","Fn","Space", "Enter","Ctrl","Alt",
        "↑","↓","←","→","Enter","Mute",
    ];
    const functionNames = [
        "\x60","F1","F2","F3","F4","F5", "F6","F7","F8","F9","F10","F11",
        null,null,null,null,null,null, "PgUp","PgDn","Home","End","Del","F12",
        null,null,null,null,null,null, "←","↓","↑","→","[","]",
    ];
    const fiveWay = [54,55,56,57,58], encoderPress = 59;
    return {layout,cells:layout.slice(0,fiveWay[0]),names,functionNames,fiveWay,encoderPress};
})();
