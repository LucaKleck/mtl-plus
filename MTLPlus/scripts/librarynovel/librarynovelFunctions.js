var link = document.createElement("link");
link.href = chrome.runtime.getURL('scripts/librarynovel/librarynovelStylesheet.css');
link.type = "text/css";
link.rel = "stylesheet";
document.documentElement.insertBefore(link, document.documentElement.firstChild);