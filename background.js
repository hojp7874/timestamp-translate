let tabStates = {};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const action = message.action;
    const tabId = message.tabId || sender.tab.id;
    const isActive = message.isActive;
    if (action === 'getActiveState') {
        sendResponse({ isActive: tabStates[tabId] || false });
        return true;
    } else if (action === 'setActiveState') {
        tabStates[tabId] = isActive;
        if (isActive) {
            chrome.tabs.sendMessage(tabId, { action: 'on' });
        } else {
            chrome.tabs.sendMessage(tabId, { action: 'off' });
        }
    }
})
