if(document.getElementById("tags")!= undefined) {
    addButtonsToGenreElems();
}

function addButtonsToGenreElems() {
    let genreElements = document.getElementById("tags").children;
    for (let element of genreElements) {
        element.href = ".";
        let addToFilterListBtn = document.createElement("button");
        addToFilterListBtn.innerHTML = "&#10006;";
        addToFilterListBtn.className = "emptyBtn";
        addToFilterListBtn.onclick = function() {
            let elem = element;
            let elemGen = getElemHTML(element);
            let newStorage = elemGen + "," + window.localStorage.getItem("filterList");
            window.localStorage.setItem("filterList",newStorage);
        }
        element.appendChild(addToFilterListBtn);
        let addToHighlightListBtn = document.createElement("button");
        addToHighlightListBtn.innerHTML = "+";
        addToHighlightListBtn.className = "emptyBtn";
        addToHighlightListBtn.onclick = function() {
            let elem = element;
            let elemGen = getElemHTML(element);
            let newStorage = elemGen + "," + window.localStorage.getItem("highlightList");
            window.localStorage.setItem("highlightList",newStorage);
        }
        element.appendChild(addToHighlightListBtn);
    }
}

function getElemHTML(element) {
    return element.innerHTML.replace("<button class=\"emptyBtn\">✖</button>","").replace("<button class=\"emptyBtn\">+</button>","");
}