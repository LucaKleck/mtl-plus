createFilterList();
// create filterList var
var filterList = window.localStorage.getItem("filterList").split(','); // creates String array
if(enableNovelFilter) createUiElements();
if(document.getElementsByClassName("m-card single-page")[0] != undefined) {
    let tmp = document.createElement("h1");
    tmp.innerText = "⠀";
    document.getElementsByClassName("m-card single-page")[0].appendChild(tmp);
}

function createFilterList() {
    // create filterList if null
    if(window.localStorage.getItem("filterList") == null) {
        window.localStorage.setItem("filterList","Smut,Josei,Gender Bender"); //default filter
    }
}

function createUiElements() {
    // filterList
    let filterListDiv = document.createElement("div");
    filterListDiv.id = "filterListDiv";
    filterListDiv.className = "listDiv";

    // filterListExpandH
    let expandBtn = document.createElement("button");
    expandBtn.id = "expandBtnFilter";
    expandBtn.innerHTML = "<h2>Filter List</h2>"
    expandBtn.className = "listBtn expandBtn";

    expandBtn.onclick = function () {
        if(document.getElementById("filterListDiv").className == "listDiv customExpanded") {
            document.getElementById("filterListDiv").className = "listDiv";
        } else {
            document.getElementById("filterListDiv").className = "listDiv customExpanded";
        }
    }
    filterListDiv.appendChild(expandBtn);

    // filterListItems
    for(let filterTag of filterList) {
        let genreEle = document.createElement("span");
        genreEle.innerHTML = filterTag;
        genreEle.className = "listElement";
        // Button to remove item from the list (filterList)
        let removeFromListBtn = document.createElement("button");
        removeFromListBtn.innerHTML = "&#10006;";
        removeFromListBtn.className = "emptyBtn filterBtn";
        removeFromListBtn.onclick = function() {
            let elemGen = filterTag;
            filterList.splice(filterList.indexOf(elemGen),1);
            window.localStorage.setItem("filterList",filterList.join());
            this.parentElement.style="display:none";
        }
        genreEle.appendChild(removeFromListBtn);
        filterListDiv.appendChild(genreEle);
    }

    setTimeout(() => {
        let genreElements = document.getElementsByClassName("genre");
        Array.from(genreElements).forEach(genreTag => {
            genreTag.href = ".";
            // Button to add item to the list (filterList)
            let addToListBtn = document.createElement("button");
            addToListBtn.innerHTML = "&#10006;";
            addToListBtn.className = "emptyBtn filterBtn";
            addToListBtn.onclick = function() {
                let elem = genreTag;
                let elemGen = getElemHTML(genreTag);
                let newStorage = elemGen + "," + window.localStorage.getItem("filterList");
                window.localStorage.setItem("filterList",newStorage);
                filterItems(elem);
            }
            genreTag.appendChild(addToListBtn);
            filterItems(genreTag)
        });
        // filter tags (custom taglist)
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
                            if(filterItems(tag)) {
                                link.parentElement.parentElement.remove();
                                break;
                            }
                        }
                    }
                }
            }
        }
    }, 50);
    document.getElementsByClassName("main-title")[0].parentNode.insertBefore(filterListDiv,document.getElementsByClassName("main-title")[0].nextSibling);
}

function filterItems(element) {
    if( filterList[0]=='' ) return false;
    if( filterList.includes(getElemHTML(element)) ) {
        element.parentElement.parentElement.remove();
        return true;
    }
    return false;
}