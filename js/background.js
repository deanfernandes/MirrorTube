chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        if(tab.url.includes('youtube.com/')) {
            chrome.action.enable();

            chrome.action.setIcon({
                tabId: tab.id,
                path: {
                    "16": "../icons/icon_16.png",
                    "48": "../icons/icon_48.png",
                    "128": "../icons/icon_128.png"
                }
            });
        }
        else {
            chrome.action.disable();

            chrome.action.setIcon({
                tabId: tab.id,
                path: {
                    "16": "../icons/icon_16_greyscale.png",
                    "48": "../icons/icon_48_greyscale.png",
                    "128": "../icons/icon_128_greyscale.png"
                }
            });
        }
    });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if(tab.url.includes('youtube.com/')) {
        chrome.action.enable();

        chrome.action.setIcon({
            tabId: tab.id,
            path: {
                "16": "../icons/icon_16.png",
                "48": "../icons/icon_48.png",
                "128": "../icons/icon_128.png"
            }
        });
    }
    else {
        chrome.action.disable();

        chrome.action.setIcon({
            tabId: tab.id,
            path: {
                "16": "../icons/icon_16_greyscale.png",
                "48": "../icons/icon_48_greyscale.png",
                "128": "../icons/icon_128_greyscale.png"
            }
        });
    }
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.tabs.query({ url: "*://*.youtube.com/*" }, (tabs) => {
      for (const tab of tabs) {
        chrome.scripting.insertCSS({
            target: { tabId: tab.id },
            files: ['css/mirror.css']
        });

        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['js/content.js']
        });
      }
    });
});