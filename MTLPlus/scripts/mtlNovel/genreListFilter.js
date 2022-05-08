// create filterList if null
if(window.localStorage.getItem("filterList") == null) {
    window.localStorage.setItem("filterList","Smut"); //default filter
}
var filterList = window.localStorage.getItem("filterList").split(','); // creates String array

if(window.localStorage.getItem("highlightList") == null) {
    window.localStorage.setItem("highlightList","Fantasy"); //default highlight
}
// create highlight var
var highlightList = window.localStorage.getItem("highlightList").split(','); // creates String array

let novelBoxes = document.getElementsByClassName("post-content")[0].children;

for(let box of novelBoxes) {
    if(box.className=="box") {
        var xmlr = new XMLHttpRequest();
        xmlr.responseType = "document";
        if(box.getElementsByTagName("a")[0].href != null){
            xmlr.open("GET",box.getElementsByTagName("a")[0].href,true);
            xmlr.send();
            xmlr.onreadystatechange = function() {
                if (this.readyState == 4 && this.response != null) {
                    let tags = this.response.getElementById("tags").children;
                    for (let tag of tags) {
                        if(highlightItems(tag)) {
                            box.className=box.className+" customHighlight";
                        }
                        if(filterItems(tag)) {
                            box.style="display:none";
                            break;
                        }
                    }
                    let genreList = this.response.getElementById("currentgen").getElementsByTagName("a");
                    for(let genre of genreList) {
                        if(highlightItems(genre)) {
                            box.className=box.className+" customHighlight";
                        }
                        if(filterItems(genre)) {
                            box.style="display:none";
                            break;
                        }
                    }
                }
            }
        }
    }
}

function filterItems(element) {
    if(filterList[0]=="") return false;
    if( filterList.includes(getElemHTML(element)) ) {
        return true;
    }
    return false;
}

function highlightItems(element) {
    if(highlightList[0]=="") return false;
    if( highlightList.includes(element.innerHTML) ) {
        return true;
    }
    return false;
}