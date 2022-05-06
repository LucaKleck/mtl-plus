createFilterList();
// create highlight var
var highlightList = window.localStorage.getItem("highlightList").split(','); // creates String array
if(enableNovelHighlight) createUiElements();

function createHighlightList() {
    // create highlightList if null
    if(window.localStorage.getItem("highlightList") == null) {
        window.localStorage.setItem("highlightList","Fantasy"); //default highlight
    }
}

function createUiElements() {
    // filterList
    var highlightListDiv = document.createElement("div");
    highlightListDiv.id = "highlightListDiv";
    highlightListDiv.className = "listDiv";

    // filterListExpandH
    var expandBtn = document.createElement("button");
    expandBtn.id = "expandBtnHighlight";
    expandBtn.innerHTML = "<h2>Highlight List</h2>"
    expandBtn.className = "listBtn expandBtn";

    expandBtn.onclick = function () {
        if(document.getElementById("highlightListDiv").className == "listDiv customExpanded") {
            document.getElementById("highlightListDiv").className = "listDiv";
        } else {
            document.getElementById("highlightListDiv").className = "listDiv customExpanded";
        }
    }
    highlightListDiv.appendChild(expandBtn);

    // hidden menu entrys (for removing from list)
    for(let highlightTag of highlightList) {
        let genreEle = document.createElement("span");
        genreEle.innerHTML = highlightTag;
        genreEle.className = "listElement";
        // Button to remove item from the list (highlightList)
        let removeFromListBtn = document.createElement("button");
        removeFromListBtn.innerHTML = "&#10006;";
        removeFromListBtn.className = "emptyBtn";
        removeFromListBtn.onclick = function() {
            let elemGen = highlightTag;
            highlightList.splice(highlightList.indexOf(elemGen),1);
            if(highlightList.includes('')) highlightList.splice(highlightList.indexOf(''),1);
            window.localStorage.setItem("highlightList",highlightList.join());
            this.parentElement.style="display:none";
        }
        genreEle.appendChild(removeFromListBtn);
        highlightListDiv.appendChild(genreEle);
    }

    setTimeout(() => {
        let genreElements = document.getElementsByClassName("genre");
        // for each genre tag
        Array.from(genreElements).forEach(element => {
            element.href = ".";
            // Button to add item to the list (highlightList)
            let addToListBtn = document.createElement("button");
            addToListBtn.innerHTML = "+";
            addToListBtn.className = "emptyBtn";
            addToListBtn.onclick = function() {
                let elem = element;
                let elemGen = getElemHTML(element);
                let newStorage = elemGen + "," + window.localStorage.getItem("highlightList");
                window.localStorage.setItem("highlightList",newStorage);
                highlightItems(elem);
            }
            element.appendChild(addToListBtn);
        });
        // highlight tags (custom taglist)
        let listTitle = document.getElementsByClassName("list-title");
        for(let link of listTitle) {
            var xmlr = new XMLHttpRequest();
            xmlr.responseType = "document";
            if(link.href != null){
                xmlr.open("GET",link.href,true);
                xmlr.send();
                xmlr.onreadystatechange = function() {
                    if (this.readyState == 4 && this.response != null) {
                        let tags = this.response.getElementById("tags").children;
                        for (let tag of tags) {
                            if(highlightItems(tag)) {
                                link.parentElement.parentElement.className=link.parentElement.parentElement.className+" customHighlight";
                                break;
                            }
                        }
                    }
                }
            }
        }
    }, 60);

    document.getElementsByClassName("main-title")[0].parentNode.insertBefore(highlightListDiv,document.getElementsByClassName("main-title")[0].nextSibling);
}

function highlightItems(element) {
    if(highlightList[0]=='') return false;
    if(highlightList.includes(getElemHTML(element)) ) {
        element.parentElement.parentElement.className = element.parentElement.parentElement.className+" customHighlight";
        return true;
    }
    return false;
}

function getElemHTML(element) {
    return element.innerHTML.replace("<button class=\"emptyBtn\">✖</button>","").replace("<button class=\"emptyBtn\">+</button>","");
}