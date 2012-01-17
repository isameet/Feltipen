$(function () {

    var feltipen = {
        separator: '|f-lt:p-n|',

        saveSelection_locally: function (range) {
            localStorage[document.domain] = localStorage[document.domain] ? localStorage[document.domain] + feltipen.separator + JSON.stringify(range) : JSON.stringify(range);
        },

        markText: function () {
            try {
                var date = new Date();
                var feltipen_now = 'feltipen_' + Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());

                var classApplier = rangy.createCssClassApplier(feltipen_now, true);
                classApplier.applyToSelection();

                $('.' + feltipen_now).css({ 'background-color': 'yellow' }).addClass('feltipen_marked').addClass('visible');

                $.each($('.' + feltipen_now), function (index, markedElement) {
                    localStorage[document.domain] = localStorage[document.domain] ? localStorage[document.domain] + feltipen.separator + $(markedElement).text() : $(markedElement).text();
                });

                feltipen.clearSelection();
            }
            catch (err) {
                console.log('[feltipen-ERROR] ' + err.message);
            }
        },

        clearSelection: function () {
            try {
                if (document.selection) {
                    document.selection.empty();
                }
                else if (window.getSelection) {
                    window.getSelection().removeAllRanges();
                }
            }
            catch (err) {
                console.log('[feltipen-ERROR] ' + err.message);
            }
        },

        toggleMarkings: function () {
            if ($('.feltipen_marked:first').hasClass('visible')) {
                feltipen.hideMarkings();
            }
            else {
                feltipen.showMarkings();
            }
        },

        hideMarkings: function () {
            $('.feltipen_marked').css('background-color', '');
            $('.feltipen_marked').removeClass('visible');
        },

        showMarkings: function () {
            $('.feltipen_marked').css('background-color', 'yellow');
            $('.feltipen_marked').addClass('visible');
        },

        removeMarkings: function () {
            var tempHtml = '';
            $.each($('.feltipen_marked'), function (index, span) {
                tempHtml = $(span).html();
                $(span).after(tempHtml);
                $(span).remove();
            });
            delete localStorage[document.domain];
        },

        highlightText: function (str) {
            if (window.find)
                window.find(str);
            else if (window.TextRange && window.TextRange.prototype.findText) {
                var bodyRange = document.body.createTextRange();
                bodyRange.findText(str);
                bodyRange.select();
            }
        },

        restoreMarkings: function () {
            if (localStorage[document.domain]) {
                var classApplier = rangy.createCssClassApplier('feltipen_marked', true);
                $.each(localStorage[document.domain].split(feltipen.separator), function (index, text) {
                    while (window.find(text, false, false ,false, false, true, false)) {
                        classApplier.applyToSelection();
                    }
                });
                feltipen.clearSelection();
                window.scrollTo(0, 0);
                $('.feltipen_marked').css({ 'background-color': 'yellow' });
                $('.feltipen_marked').addClass('visible');
            }
        }
    };

    chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
        switch (request.method) {
            case 'markText': feltipen.markText(); sendResponse({ data: '1' }); break;
            case 'toggleMarkings': feltipen.toggleMarkings(); sendResponse({ data: '1' }); break;
            case 'removeMarkings': feltipen.removeMarkings(); sendResponse({ data: '1' }); break;
            default: sendResponse({}); break;
        }
    });

    console.log('[feltipen] ' + (localStorage[document.domain] ? localStorage[document.domain].split(feltipen.separator).length : 'No') + ' marking(s) found');
    rangy.init();
    feltipen.restoreMarkings();
});