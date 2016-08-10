/*
 Called when the item has been created, or when creation failed due to an error.
 We'll just log success/failure here.
 */
function onCreated(n) {
    if (chrome.runtime.lastError) {
        console.log("error creating item:" + chrome.runtime.lastError);
    } else {
        console.log("item created successfully");
    }
}

/*
 Called when the item has been removed, or when there was an error.
 We'll just log success or failure here.
 */
function onRemoved() {
    if (chrome.runtime.lastError) {
        console.log("error removing item:" + chrome.runtime.lastError);
    } else {
        console.log("item removed successfully");
    }
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
