function showConfirmation() {
    var confirmation = document.getElementById("confirmation");
    confirmation.classList.add("show");
    setTimeout(function () {
        confirmation.classList.remove("show");
    }, 4500);
}

// Templator namespace
var Templator = Templator || {};

/*
 * Templator templatetag syntax
 *
 * {{ fullname label="Jmeno" default="Jiri Jan" }}
 *
 * fullname - identifikator fieldu
 * muze byt pozit vicekrat v sablone pro vypsani v sablone, ale bude z nej generovan pouze jeden field formulare
 *
 * label - label pro field vygenerovany do formulare. Hodnota uzavrena ve dvojityvh uvozovkach.
 * default - hodnota, ktera se predvyplni v sablone. Hodnota uzavrena ve dvojityvh uvozovkach.
 *
 */

// TemplatorMachine - BEGIN
Templator.TemplateMachine = function (templateRaw, options) {
    // settings
    this.settings = jQuery.extend(
        {
            inputFormContainerSelector: "#templator-form-container",
            previewContainerSelector: "#templator-preview-container",
            codeFieldSelector: "#templator-code-field",
            copyToClipboardButtonSelector:
                "#templator-copy-to-clipboard-button",
        },
        options
    );

    // raw template
    this.templateRaw = templateRaw;

    // fields
    this.fields = this.getFieldsFromTemplate();

    // vytvoreni formulare
    this.createForm();

    // vykresleni sablony
    this.previewTemplate();

    // aktivace tlacitka pro kopirovani do clipboardu
    jQuery(this.settings.copyToClipboardButtonSelector).on(
        "click",
        jQuery.proxy(function (e) {
            e.preventDefault();
            this.previewTemplate();
            const previewContainer = document.querySelector(
                "#preview-container"
            );
            const range = document.createRange();
            range.selectNodeContents(previewContainer);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            document.execCommand("copy");
            selection.removeAllRanges();
            //alert("Zkopírováno do schránky");
            showConfirmation();
        }, this)
    );
};

// vraci jmeno formularoveho prvku na zaklade id fieldu
Templator.TemplateMachine.prototype.getFieldHtmlId = function (id) {
    return id + "_form_field";
};

// vytvori formular z raw sablony
Templator.TemplateMachine.prototype.createForm = function () {
    var $form = jQuery("<form></form>");

    // jednotlive fieldy
    for (var fieldId in this.fields) {
        var field = this.fields[fieldId];
        var fieldHtml = jQuery("<div />").addClass("form-group");

        if (field.label) {
            var label = field.label;
        } else {
            var label = fieldId;
        }

        var id = this.getFieldHtmlId(fieldId);
        fieldHtml.append(
            jQuery('<label for="' + id + '">' + label + "</label>")
        );
        fieldHtml.append(
            jQuery("<input />").attr("id", id).addClass("form-control")
        );
        $form.append(fieldHtml);
    }

    // nastaveni akce
    jQuery("input", $form).on(
        "change keyup",
        jQuery.proxy(function (e) {
            this.previewTemplate();
        }, this)
    );

    // vlozeni do stranky
    jQuery(this.settings.inputFormContainerSelector).append($form);
};

// zobrazi sablonu v preview
Templator.TemplateMachine.prototype.previewTemplate = function () {
    var parsedTemplate = this.parseTemplate();

    // preview
    jQuery(this.settings.previewContainerSelector).html(parsedTemplate);

    // code field
    jQuery(this.settings.codeFieldSelector).html(parsedTemplate);
};

// vraci html string zparsovane sablony
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

// vrati pole objektu fieldu ziskane parsovanim raw sablony
Templator.TemplateMachine.prototype.getFieldsFromTemplate = function () {
    // objekt fieldu
    var fields = {};

    // nalezeni vsech templatetagu ve formatu {{ * }}
    var regexp = /(\{{.*?\}})/gim;
    var matches = this.templateRaw.match(regexp);

    // naplneni objektu fieldu
    for (i in matches) {
        var templateTagObject = this.parseTemplateTag(matches[i]);
        if (typeof fields[templateTagObject.id] == "undefined") {
            fields[templateTagObject.id] = {
                id: templateTagObject.id,
                default: null,
                label: null,
                tags: [],
            };
        }

        if (
            !fields[templateTagObject.id].default &&
            typeof templateTagObject.default != "none" &&
            templateTagObject.default
        ) {
            fields[templateTagObject.id].default = templateTagObject.default;
        }

        if (
            !fields[templateTagObject.id].label &&
            typeof templateTagObject.label != "none" &&
            templateTagObject.label
        ) {
            fields[templateTagObject.id].label = templateTagObject.label;
        }

        fields[templateTagObject.id].tags.push(templateTagObject.rawTag);
    }

    return fields;
};

// parsuje string template tagu
Templator.TemplateMachine.prototype.parseTemplateTag = function (templateTag) {
    // odstraneni ohranicujicich zavorek templatetagu
    strippedTemplateTag = templateTag
        .replace("{{", "")
        .replace("}}", "")
        .trim();

    // rozdeleni obsahu templatetagu na jednotlive casti
    // (podle mezer, ale zachovava mezery v parametrech ohranicenych dvojitou uvozovkou)
    var regexp = /(?:[^\s"]+|"[^"]*")+/g;
    var parsedTemplateTag = strippedTemplateTag.match(regexp);

    // template object
    var templateTagObject = {
        id: parsedTemplateTag.shift(),
        rawTag: templateTag,
    };

    // template object - dalsi property
    for (i in parsedTemplateTag) {
        var propertyString = parsedTemplateTag[i];
        var pso = propertyString.split("=");
        var propertyName = pso.shift();
        var propertyValue = pso.shift().replace(/^"/, "").replace(/"$/, "");
        templateTagObject[propertyName] = propertyValue;
    }

    return templateTagObject;
};

// TemplatorMachine - END

// inicializace nactenim sablony pres ajax
Templator.initByAjaxTemplate = function (url, options) {
    jQuery.get(
        url,
        {},
        function (data) {
            var templator = new Templator.TemplateMachine(data, options);
        },
        "text"
    );
};

// nastavi na strance vyber obsahu prvku s predanym ID
// https://stackoverflow.com/a/11128179
function selectText(element) {
    var doc = document;
    var text = doc.getElementById(element);

    if (doc.body.createTextRange) {
        // ms
        var range = doc.body.createTextRange();
        range.moveToElementText(text);
        range.select();
    } else if (window.getSelection) {
        // moz, opera, webkit
        var selection = window.getSelection();
        var range = doc.createRange();
        range.selectNodeContents(text);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}
