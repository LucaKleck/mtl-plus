const filterList = [
    "ps:",
    "PS:"
];
var regex = new RegExp('.*[a-zA-Z].*', 'i');
var siteUrlFilter = new RegExp('(www)? ?\. ?librarynovel\.?(com)?', 'g');

createStorage();
createUI(document.getElementsByClassName("site-header")[0]);
checkCopyCondition();

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
    if(document.getElementsByClassName("reading-content")[0] != undefined) {
        copy();
    }
}
function copy() {
    let contentBox = document.getElementsByClassName("reading-content")[0].getElementsByClassName("text-left")[0];
    let textNodes = contentBox.childNodes;
    let chapter = "";
    chapter += copyNodesToText(textNodes);
    // filter text
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
/**
* @param {NodeListOf<ChildNode>} nodes
*/
function copyNodesToText(nodes) {
    let singleChapter = "";
    nodes.forEach(contentBoxElement => {
        if (contentBoxElement.textContent != undefined) {
            if (
                (contentBoxElement.textContent.includes("Translator:"))
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
    let link = document.getElementsByClassName("next_page")[0];
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