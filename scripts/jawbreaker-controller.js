import { updateCanvas } from '/scripts/jawbreaker-canvas-controller.js';
import { save_pic } from '/scripts/jawbreaker-canvas-controller.js';
import { save_lines } from '/scripts/jawbreaker-canvas-controller.js';


//field initialization_________________________________________________________
let masterlist;
const default_current = {
    "body": {
        color: "#ffffff",
        selected: "straight"
    },
    "teeth": {
        color: "#ffffff",
        selected: "teeth"
    },
    "markings": {
        color: "#ffffff",
        selected: "none"
    },
    "antenna": {
        color: "#ffffff",
        selected: "alpha"
    },
    "tongue": {
        color: "#ffffff",
        selected: "round"
    },
    "tail": {
        color: "#ffffff",
        selected: "none"
    },
    "wings": {
        color: "#ffffff",
        selected: "none"
    },
    "horn": {
        color: "#ffffff",
        selected: "none"
    },
    "ears": {
        color: "#ffffff",
        selected: "none"
    },
    "background": {
        color: "#ffffff",
        selected: "none"
    }
}
let current = structuredClone(default_current);
let currentCategory = "body";
let assetsLoaded = false;

const body_canvas = document.getElementById("body-canvas");
body_canvas.width = 860;
body_canvas.height = 635;
const body_ctx = body_canvas.getContext("2d");

const fore_canvas = document.getElementById("fore-canvas");
fore_canvas.width = 860;
fore_canvas.height = 635;
const fore_ctx = fore_canvas.getContext("2d");

const back_canvas = document.getElementById("back-canvas");
back_canvas.width = 860;
back_canvas.height = 635;
const back_ctx = back_canvas.getContext("2d");
const placeholder_canvas = document.getElementById("placeholder-canvas");
placeholder_canvas.width = 860;
placeholder_canvas.height = 635;


//initialize method
async function initialize() {
    masterlist = await loadMasterlist();
    const loaded = Promise.all(loadImages());
    loaded.then(result => {
        assetsLoaded = true;
        readSessionData();
        verify();
        update("all");
    });

    generateColorListeners();
    populateCategories();
    enablePopups();
    saveButtonsSetup();
    clearButtonsSetup();
    randomButtonsSetup();
}


//html setup functions_________________________________________________________

function generateColorListeners() {
    //add on click event handlers for each color
    const colors = document.getElementsByClassName("color");
    for (const color of colors) {
        color.addEventListener("click", () => {
            if (assetsLoaded) {
                colorSelection(event.target.dataset.hex);
            }
        })
        keyboardEnable(color);
        color.setAttribute("role", "button");
        color.setAttribute("aria-label", color.dataset.hex);
        color.setAttribute("tabindex", "3");
    }

    //add on click event handlers for color input
    const customs = document.getElementsByClassName("custom");
    for (const custom of customs) {
        const input = custom.firstElementChild;
        custom.addEventListener("click", () => {
            input.click();
        })
        input.addEventListener("change", () => {
            if (assetsLoaded) {
                colorSelection(event.target.value);
            }
        })
        keyboardEnable(custom);
    }
}

function populateCategories() {
    //on click event handlers for each feature category button
    const categories = document.getElementsByClassName("category");
    for (const category of categories) {
        category.addEventListener("click", () => {
            categorySelection(event.target);
        });
        keyboardEnable(category);

        //populate features
        const feature_type = category.dataset.type;
        const cat_div = document.getElementById(feature_type);
        const features_div = document.createElement("div");
        features_div.className = "features " + feature_type;

        for (const [feature, images] of Object.entries(masterlist[feature_type])) { //for every feature and images pair in features
            const feature_div = document.createElement("div");
            feature_div.className = "feature";
            feature_div.setAttribute("role", "button");
            feature_div.setAttribute("tabindex", "0");
            feature_div.setAttribute("data-type", feature_type);
            feature_div.setAttribute("data-feature", feature);

            const img = document.createElement("img");
            img.setAttribute("data-type", feature_type);
            img.setAttribute("data-feature", feature);
            img.setAttribute("src", images["preview"]);
            img.setAttribute("alt", feature);

            feature_div.appendChild(img);
            feature_div.appendChild(document.createTextNode(feature.charAt(0).toUpperCase() + feature.slice(1)));

            //add on-click event watcher for feature_div
            feature_div.addEventListener('click', () => {
                if (assetsLoaded) {
                    featureSelection(event.target.dataset.feature, event.target.dataset.type);
                }
            });
            keyboardEnable(feature_div);
            features_div.appendChild(feature_div);
        }
        cat_div.appendChild(features_div);
    }
}

//enable enter and space for accessiblity purposes
function keyboardEnable(element) {
    element.addEventListener("keyup", (event) => {
        if (event.code === "Enter" || event.code === "Space") {
            event.target.click();
        }
    })
}

function enablePopups() {
    const save_btn = document.getElementById("save");
    const clear_btn = document.getElementById("clear");
    const random_btn = document.getElementById("random");

    const overlay = document.getElementById("overlay");
    const save_popup = document.getElementById("save-confirm");
    const clear_popup = document.getElementById("clear-confirm");
    const random_popup = document.getElementById("randomize-confirm");

    save_btn.addEventListener("click", () => {
        overlay.classList.toggle("invisible");
        save_popup.classList.toggle("invisible");
    })
    clear_btn.addEventListener("click", () => {
        overlay.classList.toggle("invisible");
        clear_popup.classList.toggle("invisible");
    })
    random_btn.addEventListener("click", () => {
        overlay.classList.toggle("invisible");
        random_popup.classList.toggle("invisible");
    })

    const save_back = document.getElementById("save-back");
    const clear_back = document.getElementById("clear-back");
    const randomize_back = document.getElementById("randomize-back");

    save_back.addEventListener("click", () => {
        overlay.classList.toggle("invisible");
        save_popup.classList.toggle("invisible");
    })
    clear_back.addEventListener("click", () => {
        overlay.classList.toggle("invisible");
        clear_popup.classList.toggle("invisible");
    })
    randomize_back.addEventListener("click", () => {
        overlay.classList.toggle("invisible");
        random_popup.classList.toggle("invisible");
    })

    overlay.addEventListener("click", () => {
        overlay.classList.toggle("invisible");
        random_popup.classList.add("invisible");
        save_popup.classList.add("invisible");
        clear_popup.classList.add("invisible");
    })
}

function saveButtonsSetup() {
    const picture_btn = document.getElementById("save-picture");
    const lines_btn = document.getElementById("save-lines");
    picture_btn.addEventListener("click", () => {
        save("all");
    })
    lines_btn.addEventListener("click", () => {
        save("lines");
    })
}
function clearButtonsSetup() {
    const clear_btn = document.getElementById("clear-all");
    clear_btn.addEventListener("click", clear)
}

function randomButtonsSetup() {
    const all = document.getElementById("randomize-all");
    const cat = document.getElementById("randomize-category");
    const color = document.getElementById("randomize-colors");
    const trait = document.getElementById("randomize-traits");
    all.addEventListener("click", () => {
        randomize("all");
    })
    cat.addEventListener("click", () => {
        randomize("category");
    })
    color.addEventListener("click", () => {
        randomize("color");
    })
    trait.addEventListener("click", () => {
        randomize("traits");
    })
}

//local storage functions_________________________________________________________
//functions relating to interacting with local storage or the data pulled from local storage

function readSessionData() {
    const stored_current = JSON.parse(localStorage.getItem("current"));
    if (!stored_current) {
        return;
    }
    for (const [feature, data] of Object.entries(current)) {
        for (const [key, info] of Object.entries(data)) {
            if (stored_current[feature][key]) {
                current[feature][key] = stored_current[feature][key];
            }
        }
    }
}

//check object is valid
function verify() {
    //body
    if (!Object.hasOwn(masterlist["body"], current.body.selected)) {
        current.body.selected = "straight";
    }
    if (!Object.hasOwn(masterlist["tongue"], current.tongue.selected)) {
        current.tongue.selected = "round";
    }
    if (!Object.hasOwn(masterlist["markings"], current.markings.selected)) {
        current.markings.selected = "none";
    }
    if (!Object.hasOwn(masterlist["teeth"], current.teeth.selected)) {
        current.markings.selected = "teeth";
    }

    //add ons
    if (!Object.hasOwn(masterlist["horn"], current.horn.selected)) {
        current.horn.selected = "none";
    }
    if (!Object.hasOwn(masterlist["ears"], current.ears.selected)) {
        current.ears.selected = "none";
    }
    if (!Object.hasOwn(masterlist["wings"], current.wings.selected)) {
        current.wings.selected = "none";
    }

    //other
    if (!Object.hasOwn(masterlist["antenna"], current.antenna.selected)) {
        current.antenna.selected = "alpha";
    }
    if (!Object.hasOwn(masterlist["background"], current.background.selected)) {
        current.background.selected = "none";
    }
}

//save current object to session data
function saveObject() {
    localStorage.setItem("current", JSON.stringify(current));
}



//core functionality_________________________________________________________

function categorySelection(trigger) {
    const current = document.getElementById(currentCategory);
    const new_category = document.getElementById(trigger.dataset.type);
    for (const category_select of document.getElementsByClassName("category")) {
        category_select.classList.remove("selected");
    }
    trigger.classList.toggle("selected");
    current.classList.toggle("transparent");
    new_category.classList.toggle("transparent");
    currentCategory = trigger.dataset.type;
}

function featureSelection(feature, category) {
    //if current is same as new, exit
    if (feature == current[category].selected) {
        return;
    }
    if (!Object.hasOwn(masterlist[category], feature)) {
        return;
    }
    current[category].selected = feature;
    verify();

    update(category);
    saveObject();
}

function colorSelection(hex) {
    const cat = currentCategory;
    //if current is same as new, exit
    if (current[cat].color == hex) {
        return;
    }
    changeColor(cat, hex);
}

function changeColor(cat, hexcode) {
    //hex code validation occurs later
    current[cat].color = hexcode;
    update(cat);
    saveObject();
}

function clear() {
    //update object
    current = structuredClone(default_current);
    saveObject();
    update("all");
    const overlay = document.getElementById("overlay");
    overlay.click();
}

function save(type) {
    switch (type) {
        case "lines":
            save_lines(current, masterlist);
            break;
        default:
            save_pic(body_canvas, fore_canvas, back_canvas);
    }
    const overlay = document.getElementById("overlay");
    overlay.click();
}

function randomize(type) {
    switch (type) {
        case "category":
            current[currentCategory].selected = selectRandom(masterlist[currentCategory]);
            current[currentCategory].color = randomHex();
            break;
        case "color":
            for (const [feature, data] of Object.entries(current)) {
                data.color = randomHex();
            }
            break;
        case "traits":
            for (const [feature, data] of Object.entries(current)) {
                if(feature != "background"){
                    data.selected = selectRandom(masterlist[feature]);
                }
            }
            break;
        default:
            for (const [feature, data] of Object.entries(current)) {
                data.selected = selectRandom(masterlist[feature]);
            }
            for (const [feature, data] of Object.entries(current)) {
                data.color = randomHex();
            }
    }
    verify();
    update("all");
    saveObject();
    const overlay = document.getElementById("overlay");
    overlay.click();
}

function selectRandom(object) {
    const keys = Object.keys(object);

    const index = Math.floor(Math.random() * keys.length);

    return keys[index];
}

function randomHex() {
    const rgb = Math.floor(Math.random() * 16777216).toString(16);
    return "#" + rgb;
}

function update(category) {
    updateCanvas(category, current, masterlist, body_canvas, fore_canvas, back_canvas);
}



//asset loading_________________________________________________________

async function loadMasterlist() {
    try {
        const res = await fetch('/scripts/traits.json');

        return await res.json();
    } catch (error) {
        throw new Error("Unable to load dollmaker resources.");
    }
}


function loadImage(src) {
    return new Promise(function (resolve) {
        const img = new Image();
        img.onload = () => {
            resolve(img);
        };
        img.src = src;
    });
}

//preload all non-preview assets into masterlist
//returns an array of promises, one for each image load
function loadImages() {
    let promises = [];
    //update to return an array of promises for each one
    //three nested loops look intimidated, but its just looping through every image in masterlist and loading it
    for (const [category, features] of Object.entries(masterlist)) {
        for (const [feature, images] of Object.entries(features)) {
            for (const [image, url] of Object.entries(images)) {

                //for each image in masterlist
                if (url != "none" && image != "preview") { //don't load in none's and keep previews as urls
                    promises.push(
                        loadImage(url).then(img => {
                            //load image, and then replace in masterlist once loaded
                            images[image] = img;
                        })
                    );
                }

            }
        }
    }
    return promises;
}


initialize();