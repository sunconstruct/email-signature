(function() {
    console.log("Templator loader starting");
    // Create the Templator namespace
    window.Templator = window.Templator || {};

    var scripts = [
        'js/templator-core.js',
        'js/templator-form-generator.js',
        'js/templator-input-formatters.js',
        'js/templator-ui-utils.js',
        'js/templator-clipboard.js',
        'js/templator-ajax-loader.js'
    ];

    function loadScript(src, callback) {
        var script = document.createElement('script');
        script.src = src;
        script.onload = callback;
        document.head.appendChild(script);
        console.log("Loading script: " + src);
    }

    function loadScripts(scripts, index) {
        if (index < scripts.length) {
            loadScript(scripts[index], function() {
                loadScripts(scripts, index + 1);
            });
        } else {
            console.log("All scripts loaded, initializing Templator");
            initTemplator();
        }
    }

    function initTemplator() {
        console.log("Initializing Templator");
        Templator.AjaxLoader.initByAjaxTemplate('template.html', {
            inputFormContainerSelector: "#templator-form-container",
            previewContainerSelector: "#templator-preview-container",
            codeFieldSelector: "#templator-code-field",
            copyToClipboardButtonSelector: "#templator-copy-to-clipboard-button"
        });
        implementLazyLoading();
    }

    window.implementLazyLoading = function() {
        const images = document.querySelectorAll('img[data-src]');
        
        const config = {
            rootMargin: '50px 0px',
            threshold: 0.01
        };

        let observer = new IntersectionObserver((entries, self) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    preloadImage(entry.target);
                    self.unobserve(entry.target);
                }
            });
        }, config);

        images.forEach(image => {
            observer.observe(image);
        });
    }

    function preloadImage(img) {
        const src = img.getAttribute('data-src');
        if (!src) { return; }
        img.src = src;
    }

    // Start loading scripts immediately
    loadScripts(scripts, 0);

    // Initialize Templator as soon as DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        if (window.Templator && window.Templator.AjaxLoader) {
            initTemplator();
        }
    });
})();
