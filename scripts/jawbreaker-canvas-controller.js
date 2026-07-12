export function updateCanvas(type, current, masterlist, body, fore, back) {
    switch (type) {
        case "body":
        case "teeth":
        case "markings":
        case "tongue":
            updateBodyCanvas(current, masterlist, body);
            break;
        case "antenna":
            updateForegroundCanvas(current, masterlist, fore);
            break;
        case "horns":
        case "ears":
            updateBackgroundCanvas(current, masterlist, back);
            updateForegroundCanvas(current, masterlist, fore);
            break;
        case "wings":
        case "tail":
        case "backgroud":
            updateBackgroundCanvas(current, masterlist, back);
            break;
        default:
            updateForegroundCanvas(current, masterlist, fore);
            updateBodyCanvas(current, masterlist, body);
            updateBackgroundCanvas(current, masterlist, back);
    }
}

function updateBodyCanvas(current, masterlist, body) {
    const newCanvas = document.createElement("canvas");
    newCanvas.width = 860;
    newCanvas.height = 635;
    const new_ctx = newCanvas.getContext("2d");
    const old_ctx = body.getContext("2d");

    //if the thing is "none" skip that stage when rebuilding the canvas
    if (current.body.selected === "curled") {
        //add curled base, markings, and lines
        new_ctx.drawImage(
            changeImageColor(current.body.color,
                masterlist["body"][current.body.selected]["base"]
            ), 0, 0);
        if (masterlist["markings"][current.markings.selected]["base-curled"] !== "none") {
            new_ctx.drawImage(
                changeImageColor(current.markings.color,
                    masterlist["markings"][current.markings.selected]["base-curled"]
                ), 0, 0);
        }
        new_ctx.drawImage(masterlist["body"][current.body.selected]["lines"], 0, 0);
    } else {
        //add straight base markings, and lines
        new_ctx.drawImage(
            changeImageColor(current.body.color,
                masterlist["body"]["straight"]["base"]
            ), 0, 0);
        if (masterlist["markings"][current.markings.selected]["base-straight"] !== "none") {
            new_ctx.drawImage(
                changeImageColor(current.markings.color,
                    masterlist["markings"][current.markings.selected]["base-straight"]
                ), 0, 0);
        }
        new_ctx.drawImage(masterlist["body"]["straight"]["lines"], 0, 0);
    }

    //tongue base
    new_ctx.drawImage(
        changeImageColor(current.tongue.color,
            masterlist["tongue"][current.tongue.selected]["base"]
        ), 0, 0);
    //teeth base
    new_ctx.drawImage(
        changeImageColor(current.teeth.color,
            masterlist["teeth"]["teeth"]["base"]
        ), 0, 0);
    //tongue lines
    new_ctx.drawImage(masterlist["tongue"][current.tongue.selected]["lines"], 0, 0);

    old_ctx.clearRect(0, 0, body.width, body.height);
    old_ctx.drawImage(newCanvas, 0, 0);
}

function updateBackgroundCanvas(current, masterlist, back) {
    const newCanvas = document.createElement("canvas");
    newCanvas.width = 860;
    newCanvas.height = 635;
    const new_ctx = newCanvas.getContext("2d");
    const old_ctx = back.getContext("2d");
    //if the thing is "none" skip that stage when rebuilding the canvas
    //background
    if (!(current.background.selected == "none")) {
        new_ctx.drawImage(
            changeImageColor(current.background.color,
                masterlist["background"][current.background.selected]["base"]
            ), 0, 0);
        new_ctx.drawImage(masterlist["background"][current.background.selected]["lines"], 0, 0);
    }
    //tail
    if (!(masterlist["tail"][current.tail.selected]["lines"] == "none")) {
        new_ctx.drawImage(
            changeImageColor(current.tail.color,
                masterlist["tail"][current.tail.selected]["base"]
            ), 0, 0);
        new_ctx.drawImage(masterlist["tail"][current.tail.selected]["lines"], 0, 0);
    }
    //wings
    if (!(masterlist["wings"][current.wings.selected]["lines"] == "none")) {
        new_ctx.drawImage(
            changeImageColor(current.wings.color,
                masterlist["wings"][current.wings.selected]["base"]
            ), 0, 0);
        new_ctx.drawImage(masterlist["wings"][current.wings.selected]["lines"], 0, 0);
    }
    //ears
    if (!(masterlist["ears"][current.ears.selected]["back_lines"] == "none")) {
        new_ctx.drawImage(
            changeImageColor(current.ears.color,
                masterlist["ears"][current.ears.selected]["back_base"]
            ), 0, 0);
        new_ctx.drawImage(masterlist["ears"][current.ears.selected]["back_lines"], 0, 0);
    }
    //horn
    if (!(masterlist["horn"][current.horn.selected]["back_lines"] == "none")) {
        new_ctx.drawImage(
            changeImageColor(current.horn.color,
                masterlist["horn"][current.horn.selected]["back_base"]
            ), 0, 0);
        new_ctx.drawImage(masterlist["horn"][current.horn.selected]["back_lines"], 0, 0);
    }

    old_ctx.clearRect(0, 0, back.width, back.height);
    old_ctx.drawImage(newCanvas, 0, 0);
}

function updateForegroundCanvas(current, masterlist, fore) {
    const newCanvas = document.createElement("canvas");
    newCanvas.width = 860;
    newCanvas.height = 635;
    const new_ctx = newCanvas.getContext("2d");
    const old_ctx = fore.getContext("2d");
    //if the thing is "none" skip that stage when rebuilding the canvas
    //ears
    if (!(masterlist["ears"][current.ears.selected]["front_lines"] == "none")) {
        new_ctx.drawImage(
            changeImageColor(current.ears.color,
                masterlist["ears"][current.ears.selected]["front_base"]
            ), 0, 0);
        new_ctx.drawImage(masterlist["ears"][current.ears.selected]["front_lines"], 0, 0);
    }
    //horns
    if (!(masterlist["horn"][current.horn.selected]["front_lines"] == "none")) {
        new_ctx.drawImage(
            changeImageColor(current.horn.color,
                masterlist["horn"][current.horn.selected]["front_base"]
            ), 0, 0);
        new_ctx.drawImage(masterlist["horn"][current.horn.selected]["front_lines"], 0, 0);
    }
    //antenna
    new_ctx.drawImage(
        changeImageColor(current.antenna.color,
            masterlist["antenna"][current.antenna.selected]["base"]
        ), 0, 0);
    new_ctx.drawImage(masterlist["antenna"][current.antenna.selected]["lines"], 0, 0);

    old_ctx.clearRect(0, 0, fore.width, fore.height);
    old_ctx.drawImage(newCanvas, 0, 0);
}

function changeImageColor(hex, image) {
    const imageCanvas = document.createElement("canvas");
    imageCanvas.width = 860;
    imageCanvas.height = 635;
    const ctx = imageCanvas.getContext("2d");
    ctx.drawImage(image, 0, 0);

    const imageData = ctx.getImageData(0, 0, imageCanvas.width, imageCanvas.height);
    const data = imageData.data;

    const rgb = hexToRGB(hex);

    for (let i = 0; i < data.length; i += 4) {
        data[i + 0] = rgb[0]; //red
        data[i + 1] = rgb[1]; //green
        data[i + 2] = rgb[2]; //blue
        //data[i+3] = data[i+3]; //leave alpha alone
    }
    ctx.putImageData(imageData, 0, 0);
    return imageCanvas;
}

function hexToRGB(hex) {
    let newHex = hex.replace("#", "");
    if (newHex.length > 6) {
        //too long, shorten it
        newHex = newHex.substring(0, 7);
    }
    const regex = /^[A-Fa-f0-9]/;
    if (!regex.test(newHex)) {
        //not a valid hexcode, replace with white
        console.log("Not a valid hex code: " + newHex);
        newHex = "ffffff";
    }
    const r = parseInt(newHex.substring(0, 2), 16);
    const g = parseInt(newHex.substring(2, 4), 16);
    const b = parseInt(newHex.substring(4, 6), 16);
    return [r, g, b];
}

export function save_pic(body, fore, back) {
    const imageCanvas = document.createElement("canvas");
    imageCanvas.width = 860;
    imageCanvas.height = 635;
    const ctx = imageCanvas.getContext("2d");
    ctx.drawImage(back, 0, 0);
    ctx.drawImage(body, 0, 0);
    ctx.drawImage(fore, 0, 0);

    const download_btn = document.createElement("a");
    download_btn.download = "jawbreaker_bat.png";
    download_btn.href = imageCanvas.toDataURL("image/png");
    download_btn.click();
}

export function save_lines(current, masterlist) {
    const imageCanvas = document.createElement("canvas");
    imageCanvas.width = 860;
    imageCanvas.height = 635;
    const ctx = imageCanvas.getContext("2d");

    //prepare canvases with white
    const bodyCanvas = document.createElement("canvas");
    bodyCanvas.width = 860;
    bodyCanvas.height = 635;
    const backCanvas = document.createElement("canvas");
    backCanvas.width = 860;
    backCanvas.height = 635;
    const foreCanvas = document.createElement("canvas");
    foreCanvas.width = 860;
    foreCanvas.height = 635;
    const current_white = structuredClone(current);
    for (const [feature, data] of Object.entries(current_white)) {
        data["color"] = "#ffffff";
    }

    //draw canvases on
    updateCanvas("all", current_white, masterlist, bodyCanvas, foreCanvas, backCanvas);
    ctx.drawImage(backCanvas, 0, 0);
    ctx.drawImage(bodyCanvas, 0, 0);
    ctx.drawImage(foreCanvas, 0, 0);

    //luminance to transparency
    const imageData = ctx.getImageData(0, 0, imageCanvas.width, imageCanvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] <= 12) {
            data[i + 3] = 0;
            continue;
        }
        const alpha = 255 - (0.2126 * data[i + 0] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]);
        data[i + 3] = data[i + 3] * (alpha/255);
        data[i] = 0;
        data[i + 1] = 0;
        data[i + 2] = 0;
    }
    ctx.putImageData(imageData, 0, 0);

    const download_btn = document.createElement("a");
    download_btn.download = "jawbreaker_bat_lines.png";
    download_btn.href = imageCanvas.toDataURL("image/png");
    download_btn.click();
}