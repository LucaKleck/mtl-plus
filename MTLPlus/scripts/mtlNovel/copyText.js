createStorageIfNull();
createUI();
copyText();

function createStorageIfNull() {
	// create copy amount if null
	if(window.localStorage.getItem("copyAmount") == null || window.localStorage.getItem("copyAmount") == "NaN") {
		window.localStorage.setItem("copyAmount",0);
	}
	if(window.localStorage.getItem("textContent") == null) {
		window.localStorage.setItem("textContent","");
	}
}

function copyText() {
	let copyText = document.getElementsByClassName("fontsize-16")[0];
	if(copyText != undefined) {
		let elements = copyText.childNodes;
		let text = "";
		let regex = new RegExp('.*[a-zA-Z].*', 'i');
		elements.forEach(element => {
			if (element.textContent != undefined && (element.nodeName == "P" || element.nodeName == "#text")) {
				if(
					(element.textContent.includes("You can search for ") && element.textContent.includes("in Baidu to find the latest chapters"))
				||  element.textContent == "　　"
				||  !element.textContent.match(regex)
				||  checkFilterList(element.textContent)
				) {/*Dont add to text*/} else {
					text = text + element.textContent + "\n\n";
				}
			}
		});
		// filter text
		text = text.replaceAll("UU reading","");

		let lStorage = window.localStorage;
		let storedText = lStorage.getItem("textContent");

		if(storedText == null) {
			lStorage.setItem("textContent",text);
		} else {
			storedText += text;
			lStorage.setItem("textContent",storedText);
		}
		/* Disabled until option is created
		// mark selected
		if (document.body.createTextRange) {
			const range = document.body.createTextRange();
			range.moveToElementText(copyText);
			range.select();
		} else if (window.getSelection) {
			const selection = window.getSelection();
			const range = document.createRange();
			range.selectNodeContents(copyText);
			selection.removeAllRanges();
			selection.addRange(range);
		} else {
			console.warn("Could not select text in node: Unsupported browser.");
		}
		*/
		if(window.localStorage.getItem("copyAmount") > 0) {
			window.localStorage.setItem("copyAmount",(parseInt(window.localStorage.getItem("copyAmount"))-1) );
			nextChapter();
		}
	}
}

function createUI() {
	let insertPosition = document.getElementsByClassName("chapter-nav")[0];
	if(insertPosition != undefined) {
		// Copy current local storage
		let clearStorageBtn = document.createElement("button");
		clearStorageBtn.innerHTML = "Clear";
		clearStorageBtn.id = "clearStorageBtn";
		clearStorageBtn.className  = "niceButton";

		clearStorageBtn.onclick = function () {
			window.localStorage.removeItem("textContent");
			document.getElementById("clearStorageBtn").innerHTML = "Cleared";
			document.getElementById("clearStorageBtn").className  = "deleted niceButton";
			document.getElementById("storageTextLengthCounterLbl").innerHTML = "0 MB";
		}

		let copyStorageBtn = document.createElement("button");
		copyStorageBtn.innerHTML = "Copy";
		copyStorageBtn.id = "copyStorageBtn";
		copyStorageBtn.className  = "niceButton";

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
		copyInputAmountBtn.className  = "niceButton";

		copyInputAmountBtn.onclick = function () {
			let amount = parseInt(window.localStorage.getItem("copyAmount"))+parseInt(document.getElementById("inputCopyAmountLbl").value);
			window.localStorage.setItem("copyAmount", amount);
			nextChapter();
		}
		// clear copy amount
		let clearCopyBtn = document.createElement("button");
		clearCopyBtn.innerHTML = "Clear x";
		clearCopyBtn.id = "clearCopyBtn";
		clearCopyBtn.className  = "niceButton";

		clearCopyBtn.onclick = function () {
			window.localStorage.setItem("copyAmount", 0);
			document.getElementById("copyAmountLbl").innerHTML = "0 to copy";
		}

		let copyAmountLbl = document.createElement("h5");
		copyAmountLbl.id = "copyAmountLbl";
		copyAmountLbl.innerHTML = window.localStorage.getItem("copyAmount") + " to copy";

		let storageTextLengthCounterLbl = document.createElement("h5");
		storageTextLengthCounterLbl.id = "storageTextLengthCounterLbl";
		if(window.localStorage.getItem("textContent") != null) {
			storageTextLengthCounterLbl.innerHTML = (window.localStorage.getItem("textContent").length*8/8000000) + " MB";
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
}

function setCopyAmount(amount) {
	window.localStorage.setItem("copyAmount",parseInt(amount));
}

function nextChapter() {
	let navElement = document.getElementsByClassName("next")[0];
	if(navElement.getAttribute('href')==null) {
		setCopyAmount(0);
		document.getElementById("copyAmountLbl").innerHTML = "0 to copy";
	} else {
		navElement.click();
	}
}
/**
 * @param {String} toFilter
 */
function checkFilterList(toFilter) {
	var isFiltered = false;
	textFilterList.forEach(element => {
		if(toFilter.includes(element)){isFiltered = true};
	});
	return isFiltered;
}