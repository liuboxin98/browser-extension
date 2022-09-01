function init() {
    console.log('[ init ] >', 'init')
    updateFilters();
}

function blockRequest(details) {
    console.log("Blocked: ", details.url);

    localStorage.setItem('test', JSON.stringify(details));
    return {
        cancel: true
    };
}

function updateFilters(urls) {
    if (chrome.webRequest.onBeforeRequest.hasListener(blockRequest)) {
        chrome.webRequest.onBeforeRequest.removeListener(blockRequest);
    }

    // var validPatterns = patterns.filter(isValidPattern);
    // console.log('[ validPatterns ] >', validPatterns);

    try {
        chrome.webRequest.onBeforeRequest.addListener(blockRequest, {
            urls: ['*://*.csdn.net/']
        }, ['blocking']);
    } catch (e) {
        console.error(e);
    }

}

init();