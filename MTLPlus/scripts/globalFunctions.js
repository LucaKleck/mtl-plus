instertGlobalStyle();
/**
* @param {HTMLElement} insertPosition
*/
function createUI(insertPosition) {
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
    copyDiv.setAttribute("class", "copyDiv");

    copyDiv.appendChild(copyStorageBtn);
    copyDiv.appendChild(clearStorageBtn);
    copyDiv.appendChild(storageTextLengthCounterLbl);
    copyDiv.appendChild(inputCopyAmount);
    copyDiv.appendChild(copyInputAmountBtn);
    copyDiv.appendChild(clearCopyBtn);
    copyDiv.appendChild(copyAmountLbl);

    insertPosition.appendChild(copyDiv);
}

function instertGlobalStyle() {
    var link = document.createElement("link");
    link.href = chrome.runtime.getURL('scripts/globalStyle.css');
    link.type = "text/css";
    link.rel = "stylesheet";
    document.documentElement.insertBefore(link, document.documentElement.firstChild);
}