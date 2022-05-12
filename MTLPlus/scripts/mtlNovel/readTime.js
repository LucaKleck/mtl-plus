if(document.location.href.includes("www.mtlnovel.com/library")) {
    for(let element of document.getElementsByClassName("box read-box")) {
        //addEstematedReadingTimeLableBoxRead(element);
    }
} else {
    for(let element of document.getElementsByClassName("box wide")) {
        addEstematedReadingTimeLableBox(element);
    }
}

/**
 * @param {HTMLDivElement} boxElement
 */
 function addEstematedReadingTimeLableBoxRead(boxElement) {
	let lable = document.createElement("lable");
	lable.setAttribute("class","readingTimeLbl");
    let chapters = parseInt(boxElement.getElementsByTagName("small")[0].textContent.replaceAll(numberRegex,"").replaceAll(numberRegex2,""));
    console.log(chapters);
	boxElement.appendChild(lable);
	lable.textContent = "loading read time...";
    let xmlr2 = new XMLHttpRequest();
    xmlr2.responseType = "document";
    if(boxElement.getElementsByClassName("list-a")[0].href != null){
        xmlr2.open("GET",boxElement.getElementsByClassName("list-a")[0].href,true);
        xmlr2.send();
        xmlr2.onreadystatechange = function() {
            if (this.readyState == 4 && this.response != null) {
                let copyText = this.response.getElementsByClassName("fontsize-16")[0];
                let elements = copyText.childNodes;
                let text = "";
                elements.forEach(element => {
                    text = text + element.textContent;
                });
                let length = text.split(" ").length;
                if(length < 700) {
                    length = 1250;
                }
                lable.textContent = ("~"+Math.ceil(length*chapters/225/60)+" hours to read");
            }
        }
    }
}
/**
 * @param {HTMLDivElement} boxWideElement
 */
 function addEstematedReadingTimeLableBox(boxWideElement) {
	let lable = document.createElement("lable");
	lable.setAttribute("class","readingTimeLbl");
	boxWideElement.appendChild(lable);
	lable.textContent = "loading read time...";
	setReadingTime(boxWideElement.getElementsByClassName("list-title")[0], lable);
}
/**
 * @param {HTMLLinkElement} chapterLink
 * @param {HTMLLabelElement} lable
 */
function setReadingTime(chapterLink, lable) {
	let xmlr = new XMLHttpRequest();
	xmlr.responseType = "document";
	if(chapterLink.href != null){
		xmlr.open("GET",chapterLink.href,true);
		xmlr.send();
		xmlr.onreadystatechange = function() {
			if (this.readyState == 4 && this.response != null) {
				let chapters = parseInt(this.response.getElementsByClassName("i")[1].childNodes[0].data);
				let xmlr2 = new XMLHttpRequest();
				xmlr2.responseType = "document";
				if(this.response.getElementsByClassName("nov-head")[0].getElementsByClassName("but")[0].href != null){
					xmlr2.open("GET",this.response.getElementsByClassName("nov-head")[0].getElementsByClassName("but")[0].href,true);
					xmlr2.send();
					xmlr2.onreadystatechange = function() {
						if (this.readyState == 4 && this.response != null) {
							let copyText = this.response.getElementsByClassName("fontsize-16")[0];
							let elements = copyText.childNodes;
							let text = "";
							elements.forEach(element => {
								text = text + element.textContent;
							});
							let length = text.split(" ").length;
							if(length < 700) {
								length = 1250;
							}
							lable.textContent = ("~"+Math.ceil(length*chapters/225/60)+" hours to read");
						}
					}
				}		
			}
		}
	}
}