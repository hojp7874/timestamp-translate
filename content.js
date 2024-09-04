const originalContent = {};

function findLocaleString(timestamp) {
    const now = Date.now();
    const range = 60 * 60 * 24 * 7 * 365 * 1000; // 1 year

    if (parseInt(timestamp) > now - range && parseInt(timestamp) < now + range) {
        return new Date(parseInt(timestamp)).toLocaleString();
    } else if (parseInt(timestamp) * 1000 > now - range && parseInt(timestamp) * 1000 < now + range) {
        return new Date(parseInt(timestamp) * 1000).toLocaleString();
    }
    return false;
}

function makeTimestampId() {
    return Math.random();
}

function viewTimestamp(elements) {
    for (let idx = 0; idx < elements.length; idx++) {
        const element = elements[idx];
        if (!element.children || element.children.length > 0) continue;

        const localeString = findLocaleString(element.innerHTML);
        if (!localeString) continue;

        if (!element.dataset.timestampId) {
            element.dataset.timestampId = makeTimestampId();
        }
        originalContent[element.dataset.timestampId] = element.innerHTML;
        element.innerHTML = localeString;
    }
}

const observer = new MutationObserver(((mutations) => {
    for (const mutation of mutations) {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
                if (!node.querySelectorAll) return;
                viewTimestamp(node.querySelectorAll('*'));
            })
        } else if (mutation.type === 'characterData') {
            viewTimestamp([mutation.target.textContent]);
        }
    }
}))

const config = {
    childList: true,
    characterData: true,
    subtree: true,
}

function on() {
    viewTimestamp(document.body.querySelectorAll('*'));
    observer.observe(document.body, config);
}

function off() {
    for (const [id, content] of Object.entries(originalContent)) {
        const element = document.querySelector(`[data-timestamp-id="${id}"]`);
        if (element) {
            element.innerHTML = content;
        }
    }
    observer.disconnect();
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'on') {
        on();
    } else if (message.action === 'off') {
        off();
    }
})

chrome.runtime.sendMessage({ action: 'getActiveState' }, (response) => {
    if (response.isActive) {
        on();
    } else {
        off();
    }
});
