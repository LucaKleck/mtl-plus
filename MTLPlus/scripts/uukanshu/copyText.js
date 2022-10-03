const filterList = [
    "Genius remembers",
    "ps:",
    "PS:",
    "send flowers",
    "It’s so easy to use, I rely on this reading aloud to pass the time before driving and before going to bed, you can download it here",
    "The book chasing app recommended to me by an old book friend who I have known for ten years, Mimi read",
    "In other words, the best app for reading aloud and listening to books at present, Mimi Read, install the latest version",
    "Click to download this site APP, massive novels, free to read",
    "To tell the truth, recently I have been using Mimi to read and read books to keep up with updates, switch sources, and read aloud tones, which can be used on Android and Apple"
];
var regex = new RegExp('.*[a-zA-Z].*', 'i');
var siteUrlFilter = new RegExp('(www)? ?\. ?uukanshu\.?(com)?', 'g');
if(window.localStorage.getItem("enableScrolling") == null) {
    window.localStorage.setItem("enableScrolling", "true");
} 
var enableScrolling = window.localStorage.getItem("enableScrolling");
createStorage();
checkCopyCondition();
createUI();

function createStorage() {
    // create copy amount if null
    if (window.localStorage.getItem("copyAmount") == null || window.localStorage.getItem("copyAmount") == "NaN") {
        window.localStorage.setItem("copyAmount", 0);
    }
    let storedText = window.localStorage.getItem("textContent");

    if (storedText == null) {
        window.localStorage.setItem("textContent", "");
    }
}
function checkCopyCondition() {
    if(document.getElementById("contentbox") != undefined) {
        if(    document.getElementById("contentbox").querySelector(".ad_content") != null
            && document.getElementById("contentbox").querySelector("FONT") != null) {
            window.setTimeout(copy(), 200);
        } else {
            if(enableScrolling == "true") {
                window.scrollTo({
                    top: document.body.scrollHeight,
                    left: 0,
                    behavior: 'smooth'
                });
            }
            window.setTimeout(checkCopyCondition, 1000);
            return;
        }
    }
}
function copy() {
    let contentBox = document.getElementById("contentbox");
    if (contentBox != undefined) {
        let textNodes = contentBox.childNodes;
        let chapter = "";
        chapter += copyNodesToText(textNodes);
        // filter text
        chapter = chapter.replaceAll("UU reading", "");
        chapter = chapter.replaceAll(siteUrlFilter, "");
        chapter = chapter.replaceAll("&nbsp;", "\n\n");
        chapter = chapter.replaceAll("    ", "\n");

        // Text sending
        navigator.clipboard.writeText(chapter);

        let storedText = window.localStorage.getItem("textContent");

        if (storedText == null) {
            window.localStorage.setItem("textContent", chapter);
        } else {
            storedText += chapter;
            window.localStorage.setItem("textContent", storedText);
        }
       if (window.localStorage.getItem("copyAmount") > 0) {
           setCopyAmount((parseInt(window.localStorage.getItem("copyAmount")) - 1));
           nextChapter();
       }
        document.getElementById("storageTextLengthCounterLbl").textContent = (window.localStorage.getItem("textContent").length * 8 / 8000000) + " MB ["+storedText.split(' ').length+" words]";
    }
}
/**
* @param {NodeListOf<ChildNode>} nodes
*/
function copyNodesToText(nodes) {
    let singleChapter = "";
    nodes.forEach(contentBoxElement => {
        if (contentBoxElement.textContent != undefined && contentBoxElement.nodeName == "FONT" || contentBoxElement.nodeName == "P" ) {
            if (
                contentBoxElement.firstChild == null
                ||(contentBoxElement.textContent.includes("You can search for ") && contentBoxElement.textContent.includes("in Baidu to find the latest chapters"))
                || contentBoxElement.textContent == "　　"
                || !contentBoxElement.textContent.match(regex)
                || checkFilterList(contentBoxElement.textContent)
            ) {/*Dont add to text*/ } else {
                singleChapter = singleChapter + contentBoxElement.textContent + "\n\n";
            }
        }

    });
    return singleChapter;
}
/**
* @param {int} toFilter
*/
function setCopyAmount(amount) {
    window.localStorage.setItem("copyAmount", parseInt(amount));
}
function nextChapter() {
    let link = document.getElementById("next");
    if (link.getAttribute('href') == null) {
        setCopyAmount(0);
        document.getElementById("copyAmountLbl").innerHTML = "0 to copy";
    }
    link.click();
}
/**
* @param {String} toFilter
*/
function checkFilterList(toFilter) {
    var isFiltered = false;
    filterList.forEach(element => {
        if (toFilter.includes(element)) { isFiltered = true };
    });
    return isFiltered;
}
function createUI() {
    let insertPosition = document.getElementsByClassName("readset")[0];
    if(insertPosition == undefined) return;
    let scrollingCheckbox = document.createElement("input");
    scrollingCheckbox.type = "checkbox";
    if(enableScrolling == "true") {
        scrollingCheckbox.checked = true
    } else {
        scrollingCheckbox.checked = false;
    }
    scrollingCheckbox.onclick = function() {
        if(enableScrolling == "true") {
            enableScrolling = "false";
        } else {
            enableScrolling = "true";
        }
        window.localStorage.setItem("enableScrolling", enableScrolling);
    }
    let scrollingCheckboxLbl = document.createElement("lable");
    scrollingCheckboxLbl.textContent = "Enable Scrolling";
    scrollingCheckboxLbl.setAttribute("style","margin-left: 3px");
    // Copy current local storage
    let clearStorageBtn = document.createElement("button");
    clearStorageBtn.innerHTML = "Clear";
    clearStorageBtn.id = "clearStorageBtn";
    clearStorageBtn.className = "niceButton";

    clearStorageBtn.onclick = function () {
        window.localStorage.setItem("textContent", "");
        document.getElementById("clearStorageBtn").innerHTML = "Cleared";
        document.getElementById("clearStorageBtn").className = "deleted niceButton";
        document.getElementById("storageTextLengthCounterLbl").innerHTML = "0 MB [0 words]";
    }

    let copyStorageBtn = document.createElement("button");
    copyStorageBtn.innerHTML = "Copy";
    copyStorageBtn.id = "copyStorageBtn";
    copyStorageBtn.className = "niceButton";

    copyStorageBtn.onclick = function () {
        navigator.clipboard.writeText(window.localStorage.getItem("textContent"));
        document.getElementById("copyStorageBtn").innerHTML = "Copied";
        document.getElementById("copyStorageBtn").className = "copied niceButton";
    }

    let inputCopyAmount = document.createElement("input");
    inputCopyAmount.type = "number";
    inputCopyAmount.id = "inputCopyAmount";
    inputCopyAmount.value = 20;
    // copyX
    let copyInputAmountBtn = document.createElement("button");
    copyInputAmountBtn.innerHTML = "Copy x";
    copyInputAmountBtn.id = "copyInputAmountBtn";
    copyInputAmountBtn.className = "niceButton";

    copyInputAmountBtn.onclick = function () {
        let amount = parseInt(window.localStorage.getItem("copyAmount")) + parseInt(document.getElementById("inputCopyAmount").value - 1);
        setCopyAmount(amount);
        nextChapter();
    }
    // clear copy amount
    let clearCopyBtn = document.createElement("button");
    clearCopyBtn.innerHTML = "Clear x";
    clearCopyBtn.id = "clearCopyBtn";
    clearCopyBtn.className = "niceButton";

    clearCopyBtn.onclick = function () {
        window.localStorage.setItem("copyAmount", 0);
        document.getElementById("copyAmountLbl").innerHTML = "0 to copy";
    }

    let copyAmountLbl = document.createElement("h5");
    copyAmountLbl.id = "copyAmountLbl";
    copyAmountLbl.innerHTML = window.localStorage.getItem("copyAmount") + " to copy";


    let storageTextLengthCounterLbl = document.createElement("h5");
    storageTextLengthCounterLbl.id = "storageTextLengthCounterLbl";
    if (window.localStorage.getItem("textContent") != null) {
        storageTextLengthCounterLbl.innerHTML = (window.localStorage.getItem("textContent").length * 8 / 8000000) + " MB ["+window.localStorage.getItem("textContent").split(' ').length+" words]";
    }

    let copyDiv = document.createElement("div");
    copyDiv.className = "copyDiv";

    copyDiv.appendChild(copyStorageBtn);
    copyDiv.appendChild(clearStorageBtn);
    copyDiv.appendChild(storageTextLengthCounterLbl);
    copyDiv.appendChild(inputCopyAmount);
    copyDiv.appendChild(copyInputAmountBtn);
    copyDiv.appendChild(clearCopyBtn);
    copyDiv.appendChild(copyAmountLbl);
    copyDiv.appendChild(scrollingCheckbox);
    copyDiv.appendChild(scrollingCheckboxLbl);

    insertPosition.appendChild(copyDiv);
}