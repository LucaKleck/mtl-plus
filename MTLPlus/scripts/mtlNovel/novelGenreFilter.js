if(document.getElementById("tags")!= undefined) {
    addButtonsToGenreElems();
}

function addButtonsToGenreElems() {
    let genreElements = document.getElementById("tags").children;
    for (let element of genreElements) {
        if(element.className!="edit-history-button") {
            element.href = ".";
            let addToFilterListBtn = document.createElement("button");
            addToFilterListBtn.innerHTML = "&#10006;";
            addToFilterListBtn.className = "emptyBtn filterBtn";
            addToFilterListBtn.onclick = function() {
                let elem = element;
                let elemGen = getElemHTML(element);
                let newStorage = elemGen + "," + window.localStorage.getItem("filterList");
                window.localStorage.setItem("filterList",newStorage);
            }
            element.appendChild(addToFilterListBtn);
            let addToHighlightListBtn = document.createElement("button");
            addToHighlightListBtn.innerHTML = "✚";
            addToHighlightListBtn.className = "emptyBtn addHighlightBtn";
            addToHighlightListBtn.onclick = function() {
                let elem = element;
                let elemGen = getElemHTML(element);
                let newStorage = elemGen + "," + window.localStorage.getItem("highlightList");
                window.localStorage.setItem("highlightList",newStorage);
            }
            element.appendChild(addToHighlightListBtn);
        }
    }
}