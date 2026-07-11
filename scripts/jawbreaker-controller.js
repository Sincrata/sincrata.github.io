import { updateCanvas } from '/scripts/jawbreaker-canvas-controller.js';
import { save } from '/scripts/jawbreaker-canvas-controller.js';
let masterlist;
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
function loadImages() {
    let promises = [];
    //update to return an array of promises for each one
    for (const [category, features] of Object.entries(masterlist)) {
        for (const [feature, images] of Object.entries(features)) {
            for (const [image, url] of Object.entries(images)) {
                if (url != "none" && image != "preview") { //don't load in none's and keep previews as urls
                    promises.push(
                        loadImage(url).then(img => {
                            images[image] = img;
                        })
                    );
                }
            }
        }
    }

    return promises;
}

//generate current object
let current = {
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

//generate 2 other canvases and contexes


//initialize method
async function initialize() {
    masterlist = await loadMasterlist();
    const loaded = Promise.all(loadImages());
    loaded.then(result => {
        assetsLoaded = true;
        update("all");
    });
    //update object from session data
    //verify object
    //if session data does not exist, keep default

    //add on click event handlers for each color
    const colors = document.getElementsByClassName("color");
    for (const color of colors) {
        color.addEventListener("click", () => {
            if (assetsLoaded) {
                colorSelection(event.target.dataset.hex);
            }
        })
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
    }

    //on click event handlers for each feature category button
    const categories = document.getElementsByClassName("category");
    for (const category of categories) {
        category.addEventListener("click", () => {
            const current = document.getElementById(currentCategory);
            const new_category = document.getElementById(event.target.dataset.type);
            for (const category_select of categories) {
                category_select.classList.remove("selected");
            }
            event.target.classList.toggle("selected");
            current.style.display = "none";
            new_category.style.display = "block";
            currentCategory = event.target.dataset.type;
        });

        //populate features
        const feature_type = category.dataset.type;
        const cat_div = document.getElementById(feature_type);
        const features_div = document.createElement("div");
        features_div.className = "features " + feature_type;

        for (const [feature, images] of Object.entries(masterlist[feature_type])) { //for every feature and images pair in features
            const feature_div = document.createElement("div");
            feature_div.className = "feature";

            const img = document.createElement("img");
            img.setAttribute("data-type", feature_type);
            img.setAttribute("data-feature", feature);
            img.setAttribute("src", images["preview"]);
            img.setAttribute("alt", feature);

            feature_div.appendChild(img);
            feature_div.appendChild(document.createTextNode(feature));

            //add on-click event watcher for feature_div
            feature_div.addEventListener('click', () => {
                if (assetsLoaded) {
                    featureSelection(event.target.dataset.feature, event.target.dataset.type);
                }
            });
            features_div.appendChild(feature_div);
        }
        cat_div.appendChild(features_div);
    }

    //add on click event handlers for clear, randomize, and save
    const save_btn = document.getElementById("save");
    save_btn.addEventListener("click", () => {
        if(assetsLoaded){
            save("all", body_canvas, fore_canvas, back_canvas);
        }
    })
}

function categorySelection() {
    //get category from the data
    //save old category
    //set current category
    //set old to not display and new to display
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

    update(category);
    saveObject();
}

function colorSelection(hex) {
    const cat = currentCategory;
    //if current is same as new, exit
    if(current[cat].color == hex){
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

//check object is valid
function verify() {
    if (!Object.hasOwn(something_here, current.tongue.selected)) {
        current.tongue.selected = "round";
    }

}

//save current object to session data
function saveObject() {

}

function clear() {
    //update object
    //save object
    //update canvas
}

function randomize(type) {
    //update object
    //save object
    //update canvas
}

function update(category){
    updateCanvas(category, current, masterlist, body_canvas, fore_canvas, back_canvas);
}


initialize();