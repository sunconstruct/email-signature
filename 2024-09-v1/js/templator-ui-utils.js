(function(Templator) {
    console.log("Templator UI utils loading");
    Templator.UIUtils = Templator.UIUtils || {};

    Templator.UIUtils.setFocusToFirstInput = function() {
        setTimeout(() => {
            const firstInput = document.querySelector("form:first-of-type input:not([type='hidden']):first-of-type");
            if (firstInput) {
                firstInput.focus();
                const valueLength = firstInput.value.length;
                firstInput.setSelectionRange(valueLength, valueLength);
            }
        }, 0);
    };

    Templator.UIUtils.showConfirmation = function () {
        var confirmation = document.getElementById("confirmation");
        confirmation.classList.add("show");
        setTimeout(function () {
            confirmation.classList.remove("show");
        }, 2000);
    };

})(window.Templator = window.Templator || {});
