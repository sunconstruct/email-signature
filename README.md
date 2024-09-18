Here's an updated README with the additional information about the redirections:

---

# Email Signature Generator

## Overview
This project is a web-based application that generates pre-filled email signatures for employees. The application allows users to enter employee details, generate a pre-filled signature, and copy it to the clipboard for use in email clients.

## File Structure
- `index.html`: The main entry point for the application. It includes a form for generating email signatures, a preview of the signature, and instructions for copying the signature to the clipboard. It also includes a redirect logic.
- `prefill.html`: An alternative page where users can prefill details for generating email signatures. This file also includes a redirect to the new version of the prefill page.
- `template.html`: The HTML template for the email signature. It contains placeholders for employee details such as name, position, phone, and email.

## Redirection
### Redirection Files
- `index.html` (new file):
    - **Purpose**: This file now includes logic for automatically redirecting users to a newer version of the application located at `https://signature.sunconstruct.cz/2024-09-v1/index.html`.
    - **JavaScript-based Redirection**: Upon page load, JavaScript constructs the target URL (including any URL parameters) and redirects the user to the new URL.
    - **Fallback**: If the JavaScript fails or is disabled, a meta refresh tag will redirect users after 5 seconds.

- `prefill.html` (new file):
    - **Purpose**: This file also redirects users to a newer version of the prefill page (`https://signature.sunconstruct.cz/2024-09-v1/prefill.html`) using a meta refresh tag.

## Features
- **Dynamic Form Generation**: The form is dynamically generated based on the fields in the email signature template (`template.html`).
- **URL Prefilling**: Users can prefill the form using URL parameters.
- **Clipboard Copy**: The generated signature can be copied directly to the clipboard.
- **Template Preview**: Users can preview the generated signature in real-time.
- **Lazy Loading**: Images are loaded lazily to improve performance.

## Dependencies
- jQuery (v3.6.0)
- Bootstrap (v5.3.0)

## Usage
1. Open `index.html` in a web browser.
2. Fill in the required employee information.
3. Review the generated email signature in the preview section.
4. Copy the signature to the clipboard by clicking the "Copy to Clipboard" button.
5. Follow the instructions to paste the signature into your email client.

### Redirection Usage
- If you land on the old `index.html` or `prefill.html`, you will be automatically redirected to the new URL.

## Prefill Functionality
- Open `prefill.html` to prefill the form via URL parameters.
- Modify the URL query parameters to pre-populate fields in the form (e.g., `?fullName=John%20Doe&position=Developer`).

## Development
### Adding New Fields
To add new fields to the signature form:
1. Modify the `template.html` file to include a new field in the form of `{{ fieldName label="Field Label" placeholder="Field Placeholder" }}`.
2. The new field will automatically be picked up by the `Templator` engine and added to the form.

---

### Script Initialization
The Templator loader (`templator-loader.js`) automatically initializes the application by loading the necessary scripts and invoking the `Templator.AjaxLoader` to process the template and generate the form.

Here is the updated **JavaScript section** for the README:

## JavaScript Files

### 1. `templator-loader.js`
- **Purpose**: Manages the loading of various Templator components and initializes the Templator system after all scripts are loaded.
- **Key Features**: 
  - Loads the required scripts sequentially.
  - Initializes the template loading process.
  - Supports lazy loading of images.

### 2. `templator-core.js`
- **Purpose**: The core functionality of the Templator system, responsible for processing the template and handling URL parameters.
- **Key Features**: 
  - Parses templates for fields using `{{}}` syntax.
  - Retrieves values from URL parameters and template defaults.
  - Generates form fields based on the template and URL parameters.

### 3. `templator-form-generator.js`
- **Purpose**: Dynamically generates forms based on the template fields and handles form validation.
- **Key Features**: 
  - Creates form input fields based on the parsed template.
  - Handles form submission and validation (email and phone numbers).
  - Updates the form preview as input changes.

### 4. `templator-ajax-loader.js`
- **Purpose**: Loads templates asynchronously using AJAX and initializes the Templator form generator.
- **Key Features**: 
  - Fetches the HTML template via AJAX.
  - Passes the template data to `templator-core.js` for field extraction and form generation.

### 5. `templator-input-formatters.js`
- **Purpose**: Provides input validation and formatting utilities for the form fields.
- **Key Features**: 
  - Validates email fields using a regex pattern.
  - Formats phone numbers according to country-specific formats.
  - Provides static phone number formatting.

### 6. `templator-ui-utils.js`
- **Purpose**: Contains utility functions for user interface interactions.
- **Key Features**: 
  - Focuses on the first input field in the form when the page loads.
  - Displays a confirmation message when content is copied to the clipboard.

### 7. `templator-clipboard.js`
- **Purpose**: Adds clipboard functionality to copy the generated email signature.
- **Key Features**: 
  - Copies the content of the form preview to the clipboard.
  - Uses `execCommand('copy')` to execute the copy action.

### 8. `prefill.js`
- **Purpose**: Handles the logic for generating pre-filled forms via URL parameters and dynamic template rendering.
- **Key Features**: 
  - Loads the template and parses fields for prefilled data.
  - Updates the URL output based on user inputs and generates a pre-filled URL for email signatures.
  - Manages copying the generated content to the clipboard.

### 9. `mobile-detector.js`
- **Purpose**: Detects if the user is accessing the application from a mobile device and adjusts the page display accordingly.
- **Key Features**: 
  - Detects mobile devices using user-agent string matching.
  - Displays mobile-specific content or disables certain features for mobile devices.
