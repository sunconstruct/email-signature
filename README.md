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

### Script Initialization
The Templator loader (`templator-loader.js`) automatically initializes the application by loading the necessary scripts and invoking the `Templator.AjaxLoader` to process the template and generate the form.

