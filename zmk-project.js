"use strict";

const ZmkProject = (() => {
    const format = "color-view/zmk-display-layout";
    const size = 128;
    const bytesPerFrame = size*size/2;
    const frameEncoding = "palette-index4-base64";
    const events = {
        status:["endpoint","bluetooth_profile","usb_presence","charging","battery_percent"],
        keys:["active_layer","key_position","encoder","pointing_device"],
        sprite:["key_position","animation_timer"], asset:["key_position","animation_timer"],
        layer:["active_layer"], last:["key_position","encoder","pointing_device"],
        wpm:["key_position","time"], wave:["key_position","time"],
        mods:["modifier_state","caps_lock","num_lock"], spacer:[],
    };
    const integration = {
        purpose:"Display layout specification for adapting an existing Color View renderer in a ZMK keyboard repository.",
        steps:[
            "Find the repository's existing Color View display driver and widget or screen entry point. Keep panel initialization, protocol, board pin assignments and VCOM maintenance in that implementation.",
            "Use screens.left and screens.right to select which half renders each layout. The preview side is not the ZMK central/peripheral role. For an inactive side, apply the board's existing display suspend or power policy if supported. Follow the driver's VCOM requirements while a panel stays powered.",
            "Implement the modules in array order with their supplied x, y, width and height in screen pixels. Draw before applying the screen's rotation. Apply the supplied palette, resolved colors, options and asset timing.",
            "Use each module's inputs as logical data requirements. Resolve event APIs against the repository's ZMK revision. Sync only the state required by an enabled peripheral display, using the repository's existing split transport where possible.",
            "Map keyboard.positions by zero-based ZMK position index. Verify geometry and position mapping against the build target. Use the firmware's layer and behavior resolution at runtime.",
            "Build both split targets and verify the display orientation, state updates, and sleep/wake behavior on the real keyboard.",
        ],
    };

    function rgbValue(color) { return [1,3,5].map(offset => parseInt(color.slice(offset,offset+2),16)); }

    function encode(frames,palette) {
        const lookup = new Map(palette.map((color,index) => [rgbValue(color).join(","),index]));
        return {width:size,height:size,encoding:frameEncoding,pixelOrder:"row-major; first pixel in high nibble",frames:frames.map(({canvas,ms}) => {
            const {data} = canvas.getContext("2d").getImageData(0,0,size,size);
            const pixel = offset => lookup.get(`${data[offset]},${data[offset+1]},${data[offset+2]}`) ?? 0;
            let raw = "";
            for (let offset = 0; offset < data.length; offset += 8) raw += String.fromCharCode((pixel(offset)<<4)|pixel(offset+4));
            return {durationMs:ms,data:btoa(raw)};
        })};
    }

    function decode(asset,palette) {
        if (!asset || asset.width !== size || asset.height !== size || asset.encoding !== frameEncoding ||
            !Array.isArray(asset.frames) || !asset.frames.length || asset.frames.length > 60) throw Error("动图素材格式无效");
        const rgb = palette.map(rgbValue);
        return asset.frames.map(frame => {
            if (!frame || typeof frame.data !== "string" || frame.data.length !== Math.ceil(bytesPerFrame/3)*4 ||
                !Number.isFinite(frame.durationMs) || frame.durationMs < 20 || frame.durationMs > 10000) throw Error("动图帧格式无效");
            const raw = atob(frame.data);
            if (raw.length !== bytesPerFrame) throw Error("动图像素数不正确");
            const canvas = Object.assign(document.createElement("canvas"),{width:size,height:size});
            const context = canvas.getContext("2d");
            const image = context.createImageData(size,size);
            for (let index=0; index<raw.length; index++) {
                const byte = raw.charCodeAt(index);
                const a = rgb[byte>>4], b = rgb[byte&15];
                if (!a || !b) throw Error("动图使用了无效的颜色索引");
                image.data.set(a,index*8); image.data[index*8+3] = 255;
                image.data.set(b,index*8+4); image.data[index*8+7] = 255;
            }
            context.putImageData(image,0,0);
            return {canvas,ms:frame.durationMs};
        });
    }
    return {format,events,integration,encode,decode};
})();
