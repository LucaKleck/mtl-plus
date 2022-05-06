const filterList = [
    "Genius remembers this site address in one second:",
];


var regex = new RegExp('.*[a-zA-Z].*', 'i');
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
        if (document.getElementById("contentbox").childNodes[3].firstChild == null || document.getElementById("contentbox").childNodes[3].firstChild.firstChild == null) {
            if(document.getElementById("contentbox").querySelector(".ad_content") != null && document.getElementById("contentbox").querySelector(".ad_content").nextSibling.nodeType == 1 && document.getElementById("contentbox").querySelector(".ad_content").nextSibling.nodeName == "FONT") {
                window.setTimeout(copy(false), 200);
            } else {
                window.scrollTo({
                    top: document.body.scrollHeight,
                    left: 0,
                    behavior: 'smooth'
                });
                window.setTimeout(checkCopyCondition, 1000);
                return;
            }
        } else {
            window.setTimeout(copy(true), 200);
        }
    }
}
function copy(isNested) {
    let contentBox = document.getElementById("contentbox");
    if (contentBox == undefined) { } else {
        let textNodes = contentBox.childNodes;
        let chapter = "";
        if(isNested) {
            chapter += copyNodesToTextNested(textNodes);
        } else {
            chapter += copyNodesToText(textNodes);
        }
        // filter text
        chapter = chapter.replaceAll("UU reading", "");
        chapter = chapter.replaceAll("&nbsp;", "");

        // Text sending
        navigator.clipboard.writeText(chapter);

        let storedText = window.localStorage.getItem("textContent");

        if (storedText == null) {
            window.localStorage.setItem("textContent", chapter);
        } else {
            storedText += chapter;
            window.localStorage.setItem("textContent", storedText);
        }

        // mark selected
        if (document.body.createTextRange) {
            const range = document.body.createTextRange();
            range.moveToElementText(contentBox);
            range.select();
        } else if (window.getSelection) {
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(contentBox);
            selection.removeAllRanges();
            selection.addRange(range);
        } else {
            console.warn("Could not select text in node: Unsupported browser.");
        }

        if (window.localStorage.getItem("copyAmount") > 0) {
            setCopyAmount((parseInt(window.localStorage.getItem("copyAmount")) - 1));
            nextChapter();
        }
        document.getElementById("storageTextLengthCounterLbl").innerHTML = (window.localStorage.getItem("textContent").length * 8 / 8000000) + " MB";
    }
}
/**
* @param {NodeListOf<ChildNode>} nodes
*/
function copyNodesToText(nodes) {
    let paragraph = "";
    nodes.forEach(contentBoxElement => {
        if (contentBoxElement.innerHTML != undefined && (contentBoxElement.nodeType == 1 && contentBoxElement.nodeName == "FONT")) {
            if (
                contentBoxElement.firstChild == null
                ||(contentBoxElement.firstChild.innerHTML.includes("You can search for ") && contentBoxElement.firstChild.innerHTML.includes("in Baidu to find the latest chapters"))
                || contentBoxElement.firstChild.innerHTML == "　　"
                || !contentBoxElement.firstChild.innerHTML.match(regex)
                || checkFilterList(contentBoxElement.firstChild.innerHTML)
            ) {/*Dont add to text*/ } else {
                paragraph = paragraph + contentBoxElement.firstChild.innerHTML + "\n\n";
            }
        }

    });
    return paragraph;
}
/**
* @param {NodeListOf<ChildNode>} nodes
*/
function copyNodesToTextNested(nodes) {
    let paragraph = "";
    nodes.forEach(contentBoxElement => {
        if (contentBoxElement.firstChild != null && contentBoxElement.firstChild.firstChild != null) {
            if (contentBoxElement.firstChild.firstChild.innerHTML != undefined && (contentBoxElement.nodeName == "P")) {
                if (
                    (contentBoxElement.firstChild.firstChild.innerHTML.includes("You can search for ") && contentBoxElement.firstChild.firstChild.innerHTML.includes("in Baidu to find the latest chapters"))
                    || contentBoxElement.firstChild.firstChild.innerHTML == "　　"
                    || !contentBoxElement.firstChild.firstChild.innerHTML.match(regex)
                    || checkFilterList(contentBoxElement.firstChild.firstChild.innerHTML)
                ) {/*Dont add to text*/ } else {
                    paragraph = paragraph + contentBoxElement.firstChild.firstChild.innerHTML + "\n\n";
                }
            }
        }
    });
    return paragraph;
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
    // Copy current local storage
    let clearStorageBtn = document.createElement("button");
    clearStorageBtn.innerHTML = "Clear";
    clearStorageBtn.id = "clearStorageBtn";
    clearStorageBtn.className = "niceButton";

    clearStorageBtn.onclick = function () {
        window.localStorage.setItem("textContent", "");
        document.getElementById("clearStorageBtn").innerHTML = "Cleared";
        document.getElementById("clearStorageBtn").className = "deleted niceButton";
        document.getElementById("storageTextLengthCounterLbl").innerHTML = "0 MB";
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

    let inputCopyAmountLbl = document.createElement("input");
    inputCopyAmountLbl.type = "number";
    inputCopyAmountLbl.id = "inputCopyAmountLbl";
    inputCopyAmountLbl.value = 20;
    // copyX
    let copyInputAmountBtn = document.createElement("button");
    copyInputAmountBtn.innerHTML = "Copy x";
    copyInputAmountBtn.id = "copyInputAmountBtn";
    copyInputAmountBtn.className = "niceButton";

    copyInputAmountBtn.onclick = function () {
        let amount = parseInt(window.localStorage.getItem("copyAmount")) + parseInt(document.getElementById("inputCopyAmountLbl").value - 1);
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
        storageTextLengthCounterLbl.innerHTML = (window.localStorage.getItem("textContent").length * 8 / 8000000) + " MB";
    }

    let copyDiv = document.createElement("div");
    copyDiv.className = "copyDiv";

    copyDiv.appendChild(copyStorageBtn);
    copyDiv.appendChild(clearStorageBtn);
    copyDiv.appendChild(storageTextLengthCounterLbl);
    copyDiv.appendChild(inputCopyAmountLbl);
    copyDiv.appendChild(copyInputAmountBtn);
    copyDiv.appendChild(clearCopyBtn);
    copyDiv.appendChild(copyAmountLbl);

    insertPosition.appendChild(copyDiv);
}