createHighlightList();
// create ignoreList var
var ignoreList = window.localStorage.getItem("ignoreList").split('#'); // creates String array
if(enableNovelIgnore) createUiElements();
if(document.getElementsByClassName("main-title")[0] != undefined) {
    document.getElementsByClassName("main-title")[0].parentNode.insertBefore(createSettingsUI(),document.getElementsByClassName("main-title")[0].nextSibling);
}

function createHighlightList() {
    // create ignoreList if null
    if(window.localStorage.getItem("ignoreList") == null) {
        window.localStorage.setItem("ignoreList","Plug-in Player"); //default filter
    }
}

function createUiElements() {
    // ignoreList
    var ignoreListDiv = document.createElement("div");
    ignoreListDiv.id = "ignoreListDiv";
    ignoreListDiv.className = "listDiv";

    // fignoreListExpandH
    var expandBtn = document.createElement("button");
    expandBtn.id = "expandBtnIgnore";
    expandBtn.innerHTML = "<h2>Ignore List</h2>"
    expandBtn.className = "listBtn expandBtn";

    expandBtn.onclick = function () {
        if(document.getElementById("ignoreListDiv").className == "listDiv customExpanded") {
            document.getElementById("ignoreListDiv").className = "listDiv";
        } else {
            document.getElementById("ignoreListDiv").className = "listDiv customExpanded";
        }
    }
    ignoreListDiv.appendChild(expandBtn);

    // ignoreListItems
    ignoreList.forEach(element => {
        let genreEle = document.createElement("span");
        genreEle.innerHTML = element;
        genreEle.className = "listElement";
        // Button to remove item from the list (ignoreList)
        let removeFromListBtn = document.createElement("button");
        removeFromListBtn.innerHTML = "&#10006;";
        removeFromListBtn.className = "emptyBtn filterBtn";
        removeFromListBtn.onclick = function() {
            let elemGen = element;
            ignoreList.splice(ignoreList.indexOf(elemGen),1);
            window.localStorage.setItem("ignoreList",ignoreList.join("#"));
            if(ignoreList.includes('')) ignoreList.splice(ignoreList.indexOf(''),1);
            window.localStorage.setItem("ignoreList",ignoreList.join("#"));
            
            this.parentElement.style="display:none";
        }
        genreEle.appendChild(removeFromListBtn);
        ignoreListDiv.appendChild(genreEle);
    });

    setTimeout(() => {
        // list title = array of <a> or <h3>
        let listTitleArray = document.getElementsByClassName("list-title");
        // title = <a>
        Array.from(listTitleArray).forEach(aOrh3 => {
            // Button to add item to the list (ignoreList)
            let addToListBtn = document.createElement("button");
            addToListBtn.innerHTML = "&#10006;";
            addToListBtn.className = "rmvBtn";
            addToListBtn.onclick = function() {
                let elemGen = getElemAttributeLable(aOrh3);
                let newStorage = elemGen + "#" + window.localStorage.getItem("ignoreList");
                window.localStorage.setItem("ignoreList",newStorage);
                this.parentElement.parentElement.style="display:none";
            }
            aOrh3.parentElement.appendChild(addToListBtn);
            ignoreItems(aOrh3)
        });
    }, timeoutTime);

    document.getElementsByClassName("main-title")[0].parentNode.insertBefore(ignoreListDiv,document.getElementsByClassName("main-title")[0].nextSibling);
}

function ignoreItems(a) {
    if( ignoreList[0]=='' ) return false;
    if( ignoreList.includes(getElemAttributeLable(a)) ) {
        a.parentElement.parentElement.remove();
        return true;
    }
    return false;
}

function getElemAttributeLable(element) {
    let attribute = element.getAttribute("aria-label");
    if(attribute == null) attribute = element.innerHTML;
    return attribute;
}