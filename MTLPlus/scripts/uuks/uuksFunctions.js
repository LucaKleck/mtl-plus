var link = document.createElement("link");
link.href = chrome.runtime.getURL('scripts/uuks/uuksStylesheet.css');
link.type = "text/css";
link.rel = "stylesheet";
document.documentElement.insertBefore(link, document.documentElement.firstChild);