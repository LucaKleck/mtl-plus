let load = document.createElement("div");
load.id = "loadPre"
load.style = "height:100vh; width:100vw; background-color:#000; position: fixed; top:0; left:0; z-index:99;";
document.documentElement.appendChild(load);
// check for some functions you could make global
const getTotalChapters1 = new RegExp('Progress\: [0-9]+\/', 'g');
const getTotalChapters2 = new RegExp(' \([0-9]+\.[0-9]+%\)', 'g');
const getCurrentChapter1 = new RegExp('Progress\: ', 'g');
const getCurrentChapter2 = new RegExp('\/[0-9]+ \([0-9]+\.[0-9]+%\)', 'g');
const timeoutTime = 3;
//const uukanshuRegExp = new RegExp('', 'g');
//const mtlnovelRegExp = new RegExp('', 'g');
const textFilterList = [	
	"Genius remembers this site address in one second:",
	"In order to facilitate the next reading, you can click",
	": https://",
	"please recommend this book to your friends (QQ, blog",
	"PS: ",
	"ps: ",
	"Seeking flowers",
	"Find the latest chapter",
	"Please recommend this book to your friends",
	"For the convenience of reading next time",
	"Seeking flowers!","monthly pass",
	"seeking flowers"
 ];
var enableNovelHighlight = true;
var enableNovelFilter = true;
var enableNovelIgnore = true;
var enableLightMode = false;
var wpmReadingSpeed = 225;

loadSettings();
saveSettings();

var link = document.createElement("link");
if(enableLightMode) {
	link.href = chrome.runtime.getURL('scripts/mtlNovel/mtlNovelStylesheetLight.css');
} else {
	link.href = chrome.runtime.getURL('scripts/mtlNovel/mtlNovelStylesheetDark.css');
}
link.type = "text/css";
link.rel = "stylesheet";
document.documentElement.insertBefore(link, document.documentElement.firstChild);

setTimeout(() => {
	load.remove();
}, 200);

function loadSettings() {
	if(window.localStorage.getItem("settingList") == null) {
        window.localStorage.setItem("settingList","true,true,true,false,225"); //default
    }
	let settings = window.localStorage.getItem("settingList").split(',');
	
	enableNovelHighlight = (settings[0] === 'true');
	enableNovelFilter = (settings[1] === 'true');
	enableNovelIgnore = (settings[2] === 'true');
	enableLightMode = (settings[3] === 'true');
	wpmReadingSpeed = parseInt(settings[4]);
}

function saveSettings() {
	let settings = window.localStorage.getItem("settingList").split(',');
	
	settings[0] = enableNovelHighlight.toString();
	settings[1] = enableNovelFilter.toString();
	settings[2] = enableNovelIgnore.toString();
	settings[3] = enableLightMode.toString();
	settings[4] = wpmReadingSpeed;

	let stringSettings = settings.join(",");

	window.localStorage.setItem("settingList",stringSettings);
}

function createSettingsUI() {
	let containerDiv = document.createElement("div");
    containerDiv.id = "settingDiv";
    containerDiv.className = "listDiv";

    // filterListExpandH
    let expandBtn = document.createElement("button");
    expandBtn.id = "expandBtnSettings";
    expandBtn.innerHTML = "<h2>Settings</h2>"
    expandBtn.className = "listBtn expandBtn";

    expandBtn.onclick = function () {
        if(document.getElementById("settingDiv").className == "listDiv customExpanded") {
            document.getElementById("settingDiv").className = "listDiv";
        } else {
            document.getElementById("settingDiv").className = "listDiv customExpanded";
        }
    }
    containerDiv.appendChild(expandBtn);

	{
		let container = document.createElement("span");
		container.setAttribute("class", "settingContainer");

		let text = document.createElement("div");
		text.innerText = "Enable Light Mode";
		text.setAttribute("class", "textForSetting");

		let lable = document.createElement("lable");
		lable.setAttribute("class", "toggle");
		let input = document.createElement("input");
		input.setAttribute("type","checkbox");
		input.id = "inputEnableLightMode"
		input.checked = enableLightMode;
		let span = document.createElement("span");
		span.setAttribute("class", "slider");
		let onOffSpan = document.createElement("span");
		onOffSpan.setAttribute("class", "labels");
		onOffSpan.setAttribute("data-on", "ON");
		onOffSpan.setAttribute("data-off", "OFF");

		onOffSpan.onclick  = function () {
			document.getElementById("inputEnableLightMode").checked = !document.getElementById("inputEnableLightMode").checked;
			enableLightMode = document.getElementById("inputEnableLightMode").checked;
			saveSettings();
			location.reload();
		}

		lable.appendChild(input);
		lable.appendChild(span);
		lable.appendChild(onOffSpan);

		let newline = document.createElement("div");

		container.appendChild(lable);
		container.appendChild(text);
		
		containerDiv.appendChild(container);
		containerDiv.appendChild(newline);
	}
	{
		let container = document.createElement("span");
		container.setAttribute("class","settingContainer");
		
		let text = document.createElement("div");
		text.innerText = "Enable Novel Ignore List";
		text.setAttribute("class", "textForSetting");

		let lable = document.createElement("lable");
		lable.setAttribute("class", "toggle");
		let input = document.createElement("input");
		input.setAttribute("type","checkbox");
		input.id = "inputEnableIgnoreList"
		input.checked = enableNovelIgnore;
		let span = document.createElement("span");
		span.setAttribute("class", "slider");
		let onOffSpan = document.createElement("span");
		onOffSpan.setAttribute("class", "labels");
		onOffSpan.setAttribute("data-on", "ON");
		onOffSpan.setAttribute("data-off", "OFF");

		onOffSpan.onclick  = function () {
			document.getElementById("inputEnableIgnoreList").checked = !document.getElementById("inputEnableIgnoreList").checked;
			enableNovelIgnore = document.getElementById("inputEnableIgnoreList").checked;
			saveSettings();
		}

		lable.appendChild(input);
		lable.appendChild(span);
		lable.appendChild(onOffSpan);
		
		container.appendChild(lable);
		container.appendChild(text);

		let newline = document.createElement("div");

		containerDiv.appendChild(container);
		containerDiv.appendChild(newline);
	}
	{
		let container = document.createElement("span");
		container.setAttribute("class","settingContainer");
		
		let text = document.createElement("div");
		text.innerText = "Enable Novel Highlight";
		text.setAttribute("class", "textForSetting");

		let lable = document.createElement("lable");
		lable.setAttribute("class", "toggle");
		let input = document.createElement("input");
		input.setAttribute("type","checkbox");
		input.id = "inputEnableNovelHighlight"
		input.checked = enableNovelHighlight;
		let span = document.createElement("span");
		span.setAttribute("class", "slider");
		let onOffSpan = document.createElement("span");
		onOffSpan.setAttribute("class", "labels");
		onOffSpan.setAttribute("data-on", "ON");
		onOffSpan.setAttribute("data-off", "OFF");

		onOffSpan.onclick  = function () {
			document.getElementById("inputEnableNovelHighlight").checked = !document.getElementById("inputEnableNovelHighlight").checked;
			enableNovelHighlight = document.getElementById("inputEnableNovelHighlight").checked;
			saveSettings();
		}

		lable.appendChild(input);
		lable.appendChild(span);
		lable.appendChild(onOffSpan);
		
		container.appendChild(lable);
		container.appendChild(text);

		let newline = document.createElement("div");

		containerDiv.appendChild(container);
		containerDiv.appendChild(newline);
	}
	{
		let container = document.createElement("span");
		container.setAttribute("class","settingContainer");
		
		let text = document.createElement("div");
		text.innerText = "Enable Genre Filter";
		text.setAttribute("class", "textForSetting");

		let lable = document.createElement("lable");
		lable.setAttribute("class", "toggle");
		let input = document.createElement("input");
		input.setAttribute("type","checkbox");
		input.id = "inputEnableNovelFilter"
		input.checked = enableNovelFilter;
		let span = document.createElement("span");
		span.setAttribute("class", "slider");
		let onOffSpan = document.createElement("span");
		onOffSpan.setAttribute("class", "labels");
		onOffSpan.setAttribute("data-on", "ON");
		onOffSpan.setAttribute("data-off", "OFF");

		onOffSpan.onclick  = function () {
			document.getElementById("inputEnableNovelFilter").checked = !document.getElementById("inputEnableNovelFilter").checked;
			enableNovelFilter = document.getElementById("inputEnableNovelFilter").checked;
			saveSettings();
		}

		lable.appendChild(input);
		lable.appendChild(span);
		lable.appendChild(onOffSpan);
		
		container.appendChild(lable);
		container.appendChild(text);

		let newline = document.createElement("div");

		containerDiv.appendChild(container);
		containerDiv.appendChild(newline);
	}
	{
		let container = document.createElement("span");
		container.setAttribute("class","settingContainer");
		
		let text = document.createElement("div");
		text.textContent = "WPM Reading Speed";
		text.setAttribute("class", "textForSetting");

		let input = document.createElement("input");
		input.setAttribute("type","number");
		input.id = "inputWPMNumber"
		input.value = wpmReadingSpeed;
		input.onchange = function() {
			wpmReadingSpeed = input.value;
			text.textContent = "WPM Reading Speed";
			saveSettings();
		};
		
		container.appendChild(input);
		container.appendChild(text);

		let newline = document.createElement("div");

		containerDiv.appendChild(container);
		containerDiv.appendChild(newline);
	}
	return containerDiv;
}

function getElemHTML(element) {
    return element.textContent.replace("✖","").replace("✚","");
}
