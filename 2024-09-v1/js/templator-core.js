(function(Templator) {
    console.log("Templator core loading");

    Templator.TemplateMachine = function (templateRaw, options) {
        console.log("TemplateMachine constructor called", options);
        this.settings = jQuery.extend({
            inputFormContainerSelector: "#templator-form-container",
            previewContainerSelector: "#templator-preview-container",
            codeFieldSelector: "#templator-code-field",
            copyToClipboardButtonSelector: "#templator-copy-to-clipboard-button",
        }, options);

        if (typeof templateRaw !== 'string' || templateRaw.trim() === '') {
            console.error('Invalid template provided to Templator.TemplateMachine');
            return;
        }
        this.templateRaw = templateRaw;
        this.initUrlParams();
        this.fields = this.getFieldsFromTemplate();
        console.log("Fields extracted:", this.fields);

        if (Object.keys(this.fields).length > 0) {
            console.log("Creating form");
            Templator.FormGenerator.createForm(this);
            console.log("Form created. Container content:", jQuery(this.settings.inputFormContainerSelector).html());
            this.previewTemplate();
            Templator.Clipboard.activateCopyToClipboard(this);
        } else {
            console.error('No fields could be extracted from the template');
        }
    };

    Templator.TemplateMachine.prototype.getDefaultValue = function(fieldId, templateDefault) {
        console.log(`Getting default value for ${fieldId}`);
        if (this.urlParams && this.urlParams.has(fieldId)) {
            const urlValue = this.urlParams.get(fieldId);
            console.log(`Using URL parameter for ${fieldId}: ${urlValue}`);
            return urlValue;
        }
        if (this.urlParams && this.urlParams.has(fieldId.toLowerCase())) {
            const urlValue = this.urlParams.get(fieldId.toLowerCase());
            console.log(`Using URL parameter for ${fieldId} (lowercase): ${urlValue}`);
            return urlValue;
        }
        console.log(`Using template default for ${fieldId}: ${templateDefault}`);
        return templateDefault;
    };

    Templator.TemplateMachine.prototype.initUrlParams = function() {
        this.urlParams = new URLSearchParams(window.location.search);
        console.log("Initialized URL params:");
        this.urlParams.forEach((value, key) => {
            console.log(`${key}: ${value}`);
        });
    };

    Templator.TemplateMachine.prototype.getFieldHtmlId = function (id) {
        return id + "_form_field";
    };

    Templator.TemplateMachine.prototype.getFieldsFromTemplate = function () {
        var fields = {};
        var regexp = /(\{{.*?\}})/gim;
        var matches = this.templateRaw.match(regexp);

        if (!matches) {
            console.warn('No template tags found in the provided template');
        }

        // First, process all URL parameters
        if (this.urlParams) {
            this.urlParams.forEach((value, key) => {
                fields[key] = {
                    id: key,
                    default: value,
                    label: key,
                    help: null,
                    placeholder: null,
                    tags: [],
                };
                console.debug(`Added URL parameter ${key} with value: ${value}`);
            });
        }

        // Then, process template tags
        if (matches) {
            for (var i = 0; i < matches.length; i++) {
                var templateTagObject = this.parseTemplateTag(matches[i]);
                if (typeof fields[templateTagObject.id] == "undefined") {
                    fields[templateTagObject.id] = {
                        id: templateTagObject.id,
                        default: null,
                        label: null,
                        help: null,
                        placeholder: null,
                        tags: [],
                    };
                }

                fields[templateTagObject.id].default = this.getDefaultValue(templateTagObject.id, templateTagObject.default);
                if (templateTagObject.label) {
                    fields[templateTagObject.id].label = templateTagObject.label;
                }
                if (templateTagObject.help) {
                    fields[templateTagObject.id].help = templateTagObject.help;
                }
                if (templateTagObject.placeholder) {
                    fields[templateTagObject.id].placeholder = templateTagObject.placeholder;
                }

                fields[templateTagObject.id].tags.push(templateTagObject.rawTag);
            }
        }

        return fields;
    };

    Templator.TemplateMachine.prototype.parseTemplateTag = function (templateTag) {
        var strippedTemplateTag = templateTag
            .replace("{{", "")
            .replace("}}", "")
            .trim();

        var regexp = /(?:[^\s"]+|"[^"]*")+/g;
        var parsedTemplateTag = strippedTemplateTag.match(regexp);

        var templateTagObject = {
            id: parsedTemplateTag.shift(),
            rawTag: templateTag,
        };

        for (var i = 0; i < parsedTemplateTag.length; i++) {
            var propertyString = parsedTemplateTag[i];
            var pso = propertyString.split("=");
            var propertyName = pso.shift();
            var propertyValue = pso.join("=").replace(/^"/, "").replace(/"$/, "");
            templateTagObject[propertyName] = propertyValue;
        }

        return templateTagObject;
    };

    Templator.TemplateMachine.prototype.previewTemplate = function () {
        var parsedTemplate = this.parseTemplate();

        jQuery(this.settings.previewContainerSelector).html(parsedTemplate);
        jQuery(this.settings.codeFieldSelector).html(parsedTemplate);
    };

    Templator.TemplateMachine.prototype.parseTemplate = function () {
        var parsedTemplate = this.templateRaw;

        for (var fieldId in this.fields) {
            var value = jQuery("#" + this.getFieldHtmlId(fieldId)).val();
            var field = this.fields[fieldId];

            for (var i = 0; i < field.tags.length; i++) {
                var tag = field.tags[i];
                parsedTemplate = parsedTemplate.replace(tag, value);
            }
        }

        return parsedTemplate;
    };

})(window.Templator = window.Templator || {});
