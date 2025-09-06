chrome.runtime.onMessage.addListener((message, sender, sendResponse)=>{
    if(message.action === "toggle") {
        chrome.storage.sync.get(["enabled", "color"], ({enabled, color}) =>{
            updateAllTabs(enabled ? color : null);
        });        
    }

    if(message.action==="setColor"){
        chrome.storage.sync.get("enabled", ({enabled})=>{
            if(enabled) updateAllTabs(message.color);
        });
    }
});

function updateAllTabs(color) {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach(tab => {
      if (!tab.url.startsWith("chrome://") &&
          !tab.url.startsWith("edge://") &&
          !tab.url.startsWith("about:")) {
        if (color) {
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: (c) => document.body.style.backgroundColor = c,
            args: [color]
          });
        } else {
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => document.body.style.backgroundColor = ""
          });
        }
      }
    });
  });
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    chrome.storage.sync.get(["enabled", "color"], ({ enabled, color }) => {
      if (enabled && color && !tab.url.startsWith("chrome://")) {
        chrome.scripting.executeScript({
          target: { tabId },
          func: (c) => document.body.style.backgroundColor = c,
          args: [color]
        });
      }
    });
  }
});