$(function () {
    $('#markText').click(chrome.extension.getBackgroundPage().markText);
    $('#toggleMarkings').click(chrome.extension.getBackgroundPage().toggleMarkings);
    $('#removeMarkings').click(chrome.extension.getBackgroundPage().removeMarkings);
});