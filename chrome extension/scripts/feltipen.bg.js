chrome.contextMenus.create({ 'title': 'Hide/Show Markings', 'contexts': ['page'], 'onclick': toggleMarkings });
chrome.contextMenus.create({ 'title': 'Mark', 'contexts': ['selection'], 'onclick': markText });
chrome.contextMenus.create({ 'title': 'Remove Markings', 'contexts': ['page'], 'onclick': removeMarkings });

function feltipen_callMethod(methodName, data) {
    chrome.tabs.getSelected(null, function (tab) {
        chrome.tabs.sendRequest(tab.id, { method: methodName, data: data }, function (response) {
        });
    });
}

function markText() {
    feltipen_callMethod('markText');
}

function toggleMarkings() {
    feltipen_callMethod('toggleMarkings');
}

function removeMarkings() {
    feltipen_callMethod('removeMarkings');
}