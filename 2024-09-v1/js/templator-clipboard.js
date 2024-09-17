(function(Templator) {
    console.log("Templator clipboard loading");
    Templator.Clipboard = Templator.Clipboard || {};

    Templator.Clipboard.activateCopyToClipboard = function (templator) {
        jQuery(templator.settings.copyToClipboardButtonSelector).on(
            "click",
            function (e) {
                e.preventDefault();
                templator.previewTemplate();
                const previewContainer = document.querySelector(
                    templator.settings.previewContainerSelector
                );
                if (previewContainer) {
                    const range = document.createRange();
                    range.selectNodeContents(previewContainer);
                    const selection = window.getSelection();
                    selection.removeAllRanges();
                    selection.addRange(range);
                    try {
                        document.execCommand("copy");
                        console.log('Content copied to clipboard:', previewContainer.innerHTML);
                        Templator.UIUtils.showConfirmation();
                    } catch (err) {
                        console.error('Unable to copy to clipboard', err);
                    }
                    selection.removeAllRanges();
                } else {
                    console.error('Preview container not found');
                }
            }
        );
    };

})(window.Templator = window.Templator || {});
