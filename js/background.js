chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    handleTab(tab);
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  chrome.tabs.get(tabId, (tab) => {
    handleTab(tab);
  });
});

chrome.runtime.onInstalled.addListener((details) => {
  chrome.action.disable();

  //inject content scripts for existing youtube tabs
  chrome.tabs.query({ url: ["*://www.youtube.com/*"] }, (tabs) => {
    tabs.forEach((tab) => {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["js/content.js"],
      });
      chrome.scripting.insertCSS({
        target: { tabId: tab.id },
        files: ["css/mirror.css"],
      });

      console.log(`injected ${tab.url}`);
    });
  });
});

function handleTab(tab) {
  if (tab.url.includes("youtube")) {
    chrome.action.enable();
  } else {
    chrome.action.disable();
  }
}
