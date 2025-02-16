/*
 Called when the item has been created, or when creation failed due to an error.
 We'll just log success/failure here.
 */
function onCreated(n) {
}

/*
 Called when the item has been removed, or when there was an error.
 We'll just log success or failure here.
 */
function onRemoved() {
}

/*
 Create all the context menu items.
 */
chrome.contextMenus.create({
    id: "diki-selection",
    title: chrome.i18n.getMessage("contextMenuItemSelectionDiki"),
    contexts: ["selection"]
}, onCreated);


/*
 The click event listener, where we perform the appropriate action given the
 ID of the menu item that was clicked.
 */
chrome.contextMenus.onClicked.addListener(function (info, tab) {
    switch (info.menuItemId) {
        case "diki-selection":
            browser.windows.create(
                {
                    url: "http://diki.pl/"+info.selectionText,
                    type: "popup",
                    left: 100,
                    top: 100,
                    width: 1200,
                    height: 1200
                }
            )
            break;
    }
});

browser.commands.onCommand.addListener((command) => {
  if (command === "open-url") {
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      const currentTab = tabs[0];
      if (currentTab) {
        browser.scripting.executeScript({
          target: { tabId: currentTab.id },
          func: getSelectedText
        }).then((results) => {
          if (results[0]?.result) {
            const selectedText = results[0].result;
            const baseURL = "https://example.com/search?q=";
            const encodedText = encodeURIComponent(selectedText);
            browser.tabs.create({ url: baseURL + encodedText });
          }
        }).catch((error) => {
          console.error("Error executing script:", error);
        });
      }
    }).catch((error) => {
      console.error("Error querying tabs:", error);
    });
  }
});

function getSelectedText() {
  return window.getSelection().toString().trim();
}
