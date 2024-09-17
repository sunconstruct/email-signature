(function(Templator) {
    console.log("Templator form generator loading");
    Templator.FormGenerator = Templator.FormGenerator || {};

    Templator.FormGenerator.createForm = function (templator) {
        console.log("Creating form", templator);
        var $form = jQuery("<form></form>");

        for (var fieldId in templator.fields) {
            console.log("Creating field:", fieldId);
            var field = templator.fields[fieldId];
            var fieldHtml = jQuery("<div />").addClass("form-group");

            fieldHtml.append(
                jQuery('<label for="' + templator.getFieldHtmlId(fieldId) + '" class="label">' + field.label + "</label>")
            );
            var $input = jQuery("<input />")
                .attr("id", templator.getFieldHtmlId(fieldId))
                .addClass("form-control")
                .attr("placeholder", field.placeholder || "")
                .val(field.default || "");
            
            if (fieldId.toLowerCase().includes('email')) {
                $input.on('blur', Templator.InputFormatters.validateEmail);
            } else if (fieldId.toLowerCase().includes('phone')) {
                $input.on('input', Templator.InputFormatters.formatPhoneNumber);
                $input.on('blur', Templator.InputFormatters.debugPhoneNumber);
                // Format phone number on form load
                if (field.default) {
                    $input.val(Templator.InputFormatters.formatPhoneNumberStatic(field.default));
                }
            }
            
            fieldHtml.append($input);
            fieldHtml.append(
                jQuery("<span />")
                    .addClass("error-message")
                    .css("color", "red")
                    .hide()
            );
            $form.append(fieldHtml);
        }

        jQuery("input", $form).on("change keyup", function () {
            console.log("Input changed, updating preview");
            templator.previewTemplate();
        });

        jQuery("input", $form).on("focus", function() {
            console.log("Input focused");
            this.selectionStart = this.selectionEnd = this.value.length;
        });

        jQuery("input", $form).on("mouseup", function(e) {
            console.log("Input mouse up");
            e.preventDefault();
        });

        $form.on("submit", this.handleFormSubmit.bind(templator));

        console.log("Form HTML:", $form[0].outerHTML);
        console.log("Appending form to", templator.settings.inputFormContainerSelector);
        jQuery(templator.settings.inputFormContainerSelector).append($form);
        console.log("Form appended. Container content:", jQuery(templator.settings.inputFormContainerSelector).html());
        Templator.UIUtils.setFocusToFirstInput();
    };

    Templator.FormGenerator.handleFormSubmit = function (e) {
        console.log("Form submitted");
        e.preventDefault();
        var isValid = true;

        jQuery("input", e.target).each(function() {
            if (this.id.toLowerCase().includes('email')) {
                if (!Templator.InputFormatters.validateEmail.call(this)) {
                    isValid = false;
                }
            }
        });

        if (isValid) {
            console.log("Form is valid, updating preview");
            this.previewTemplate();
        } else {
            console.log("Form is invalid");
        }
    };

})(window.Templator = window.Templator || {});
