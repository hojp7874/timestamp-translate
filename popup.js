// timestamp display
const timestampDisplay = document.getElementById('currentTimestamp');
timestampDisplay.textContent = Math.floor(Date.now() / 1000);
setInterval(() => timestampDisplay.textContent++, 1000);
document.getElementById('currentTimestamp').addEventListener('click', () =>
    navigator.clipboard.writeText(timestampDisplay.textContent)
);


// toggle switch
const toggleSwitch = document.getElementById('toggleSwitch');
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs[0].url.startsWith('http')) {
        toggleSwitch.disabled = true;
        return;
    }

    const tabId = tabs[0].id;
    chrome.runtime.sendMessage({ action: 'getActiveState', tabId }, (response) => {
        toggleSwitch.checked = response.isActive || false;
    });

    toggleSwitch.addEventListener('change', () => {
        const isActive = toggleSwitch.checked;
        chrome.runtime.sendMessage({ action: 'setActiveState', tabId, isActive });
    })
})
