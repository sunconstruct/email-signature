(function(Templator) {
    console.log("Templator AJAX loader loading");
    Templator.AjaxLoader = Templator.AjaxLoader || {};

    Templator.AjaxLoader.initByAjaxTemplate = function (url, options) {
        console.log("Initiating AJAX template load from: " + url, options);
        jQuery.ajax({
            url: url,
            type: 'GET',
            dataType: 'text',
            success: function(data) {
                console.log("Template data received:", data.substring(0, 100) + "...");
                var templator = new Templator.TemplateMachine(data, options);
                if (templator.fields && Object.keys(templator.fields).length > 0) {
                    console.log("Fields extracted:", templator.fields);
                    Templator.UIUtils.setFocusToFirstInput();
                } else {
                    console.error('No fields could be extracted from the template');
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error("Failed to load template:", textStatus, errorThrown);
            }
        });
    };

})(window.Templator = window.Templator || {});