(function () {
    const baseUrl = window.location.origin + window.location.pathname.replace('prefill.html', 'index.html');
    let templateFields = [];
    const defaultComment = "posílám \"odkaz na generátor email podpisu\".";

    function loadTemplate() {
        console.log('Starting to load template...');
        $.get('template.html')
            .done(function (data) {
                console.log('Template loaded. Content:', data);

                const regex = /\{\{([^}]+)\}\}/g;
                console.log('Using regex:', regex);

                let match;
                while ((match = regex.exec(data)) !== null) {
                    console.log('Found match:', match);

                    const fullMatch = match[0];
                    const innerContent = match[1].trim();
                    console.log('Full match:', fullMatch);
                    console.log('Inner content:', innerContent);

                    const parts = innerContent.split(/\s+(.+)/);
                    const fieldName = parts[0];
                    const attributesString = parts[1] || '';
                    console.log('Field name:', fieldName);
                    console.log('Attributes string:', attributesString);

                    const attributes = {};
                    const attributeRegex = /(\w+)="([^"]*)"/g;
                    let attrMatch;
                    while ((attrMatch = attributeRegex.exec(attributesString)) !== null) {
                        console.log('Attribute match:', attrMatch);
                        attributes[attrMatch[1]] = attrMatch[2];
                    }
                    console.log('Parsed attributes:', attributes);

                    const existingFieldIndex = templateFields.findIndex(field => field.name === fieldName);
                    if (existingFieldIndex === -1) {
                        const newField = { name: fieldName, ...attributes };
                        templateFields.push(newField);
                        console.log('Added new field:', newField);
                    } else {
                        // Merge new attributes with existing field
                        templateFields[existingFieldIndex] = { 
                            ...templateFields[existingFieldIndex], 
                            ...attributes 
                        };
                        console.log('Updated existing field:', templateFields[existingFieldIndex]);
                    }
                }

                console.log('Final templateFields array:', templateFields);
                createForm();
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                console.error('Error loading template:', textStatus, errorThrown);
                $('#employeeForm').html('<div class="alert alert-danger">Failed to load the form template. Please try refreshing the page.</div>');
            });
    }

    function createForm() {
        const form = $('#employeeForm');
        templateFields.forEach(field => {
            const formGroup = $('<div class="mb-3"></div>');
            const labelTitle = field.label || field.name;
            const placeholderText = field.placeholder || '';
            formGroup.append(`<label for="${field.name}" class="form-label">${labelTitle}</label>`);
            const input = $(`<input type="text" class="form-control" id="${field.name}" name="${field.name}" placeholder="${placeholderText}">`);
            formGroup.append(input);
            formGroup.append(`<div class="error-message" id="${field.name}-error"></div>`);
            form.append(formGroup);

            if (field.name.toLowerCase().includes('email')) {
                input.on('blur', Templator.InputFormatters.validateEmail);
            } else if (field.name.toLowerCase().includes('phone')) {
                input.on('input', Templator.InputFormatters.formatPhoneNumber);
            }

            // Add input event listener to each field
            input.on('input', generateUrl);
        });

        // Load saved comment or set default for the existing textarea
        const savedComment = localStorage.getItem('hrComment') || defaultComment;
        $('#hrComment').val(savedComment);

        // Add input event listener to the existing textarea
        $('#hrComment').on('input', generateUrl);

        // Generate URL on initial load
        generateUrl();
    }

    function generateUrl() {
        if (hasAnyContent()) {
            let url = new URL(baseUrl);
            templateFields.forEach(field => {
                const value = $(`#${field.name}`).val();
                if (value) {
                    url.searchParams.append(field.name, value);
                }
            });
            updateUrlOutput(url.toString());
        } else {
            $('#urlOutput').html(''); // Clear the output if no content
        }
    }

    function hasAnyContent() {
        // Check if any input field or textarea has content
        for (const field of templateFields) {
            if ($(`#${field.name}`).val().trim() !== '') {
                return true;
            }
        }
        return $('#hrComment').val().trim() !== '';
    }

    function updateUrlOutput(generatedUrl) {
        const hrComment = $('#hrComment').val() || defaultComment;
        
        // Function to replace enclosed text containing "odkaz" with a link
        function replaceEnclosedOdkaz(match, p1, p2, p3) {
            if (p2.toLowerCase().includes('odkaz')) {
                return `${p1}<a href="${generatedUrl}">${p2}</a>${p3}`;
            }
            return match;
        }

        // Regular expression to match text enclosed in various quotes and parentheses
        const enclosureRegex = /(['"'`"„«\(\[\{])([^'"'`"„»\)\]\}]*)(['"'`"„»\)\]\}])/g;

        // Split the comment into lines and process each line separately
        const lines = hrComment.split('\n');
        const processedLines = lines.map(line => {
            // Replace enclosed text containing "odkaz" with links
            let updatedLine = line.replace(enclosureRegex, replaceEnclosedOdkaz);

            // If no enclosed "odkaz" was found, replace individual words
            if (!updatedLine.includes('<a href=')) {
                updatedLine = updatedLine.replace(/\b\w*odkaz\w*\b/gi, `<a href="${generatedUrl}">$&</a>`);
            }

            return updatedLine;
        });

        // Join the processed lines, preserving newlines
        let updatedComment = processedLines.join('<br>');
        
        // If no "odkaz" was found at all, add a default link
        if (!updatedComment.includes('<a href=')) {
            updatedComment += `<div><a href="${generatedUrl}">odkaz na generator podpisu</a></div>`;
        }

        $('#urlOutput').html(updatedComment);
    }

    function copyToClipboard() {
        const urlHtml = $('#urlOutput').html();
        
        // Create a temporary element
        const tempElement = document.createElement('div');
        tempElement.innerHTML = urlHtml;
        
        // Temporarily add the element to the DOM
        document.body.appendChild(tempElement);
        
        // Select the content
        const range = document.createRange();
        range.selectNodeContents(tempElement);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        
        // Copy the selected content
        document.execCommand('copy');
        
        // Remove the temporary element
        document.body.removeChild(tempElement);
        
        // Clear the selection
        selection.removeAllRanges();

        showConfirmation();
        const hrComment = $('#hrComment').val();
        localStorage.setItem('hrComment', hrComment);
    }

    function showConfirmation() {
        const confirmation = $('#confirmation');
        confirmation.addClass('show');
        setTimeout(() => {
            confirmation.removeClass('show');
        }, 2000);
    }

    function openUrlInNewWindow(url) {
        if (url) {
            window.open(url, '_blank');
        }
    }

    $(document).ready(() => {
        loadTemplate();
        $('#copyUrlButton').on('click', copyToClipboard);
        
        // Handle clicks on the entire urlOutput div
        $('#urlOutput').on('click', function(e) {
            // If the click is not on an <a> tag, open the first link
            if (e.target.tagName.toLowerCase() !== 'a') {
                const firstLink = $(this).find('a').first().attr('href');
                openUrlInNewWindow(firstLink);
            }
        });

        // Handle clicks on <a> tags inside urlOutput
        $('#urlOutput').on('click', 'a', function(e) {
            e.preventDefault(); // Prevent the default action
            e.stopPropagation(); // Stop the event from bubbling up
            openUrlInNewWindow($(this).attr('href'));
        });

        $('#urlOutput').on('keypress', function (e) {
            if (e.which === 13) {
                const firstLink = $(this).find('a').first().attr('href');
                openUrlInNewWindow(firstLink);
            }
        });
    });
})();