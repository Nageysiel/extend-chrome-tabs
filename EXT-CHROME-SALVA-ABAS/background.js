chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed");
  });
  
  chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.query({}, (tabs) => {
      let tabUrls = tabs.map(tab => tab.url);
      chrome.storage.local.set({ savedTabs: tabUrls }, () => {
        console.log('Tabs saved');
      });
    });
  });
  