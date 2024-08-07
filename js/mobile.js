// Define a function to run your code when the form fields have been added
function runCodeWhenFormIsReady() {
    const countryCodes = {
        AL: "+355",
        AD: "+376",
        AM: "+374",
        AT: "+43",
        AZ: "+994",
        BY: "+375",
        BE: "+32",
        BA: "+387",
        BG: "+359",
        HR: "+385",
        CY: "+357",
        CZ: "+420",
        DK: "+45",
        EE: "+372",
        FO: "+298",
        FI: "+358",
        FR: "+33",
        GE: "+995",
        DE: "+49",
        GI: "+350",
        GR: "+30",
        HU: "+36",
        IS: "+354",
        IE: "+353",
        IM: "+44",
        IT: "+39",
        KZ: "+7",
        XK: "+383",
        LV: "+371",
        LI: "+423",
        LT: "+370",
        LU: "+352",
        MK: "+389",
        MT: "+356",
        MD: "+373",
        MC: "+377",
        ME: "+382",
        NL: "+31",
        NO: "+47",
        PL: "+48",
        PT: "+351",
        RO: "+40",
        RU: "+7",
        SM: "+378",
        RS: "+381",
        SK: "+421",
        SI: "+386",
        ES: "+34",
        SE: "+46",
        CH: "+41",
        UA: "+380",
        GB: "+44",
        VA: "+39",
    };

    const keywords = ["phone", "telefon", "mobil", "mobile_form_field"];
    const phoneInputs = [];

    const form = document.querySelector("form");
    const inputFields = form.querySelectorAll("input");

    inputFields.forEach((inputField) => {
        const fieldId = inputField.getAttribute("id");
        if (
            fieldId !== null &&
            keywords.some((keyword) => fieldId.toLowerCase().includes(keyword))
        ) {
            phoneInputs.push(inputField);
        }
    });

    phoneInputs.forEach((phoneInput) => {
        phoneInput.addEventListener("blur", () => {
            let phoneNumber = phoneInput.value.replace(/\s+/g, "");

            if (phoneNumber.match(/^[0-9+]+$/)) {
                if (phoneNumber.startsWith("00")) {
                    phoneNumber = "+" + phoneNumber.slice(2);
                }

                //        if (phoneNumber.startsWith("+")) {
                //          const prefix = phoneNumber.slice(0, 4);
                //          const rest = phoneNumber.slice(4);
                //          const formattedRest = rest.replace(/(.{3})/g, "$1 ").trim();
                //          phoneNumber = prefix + " " + formattedRest;
                //        } else {
                //          phoneNumber = phoneNumber.replace(/(.{3})/g, "$1 ").trim();
                //        }

                for (const countryCode in countryCodes) {
                    if (phoneNumber.startsWith(countryCodes[countryCode])) {
                        const prefix = countryCodes[countryCode];
                        const rest = phoneNumber.slice(prefix.length);
                        const formattedRest = rest
                            .replace(/(.{3})/g, "$1 ")
                            .trim();
                        phoneNumber = prefix + " " + formattedRest;
                        break;
                    }
                }

                phoneInput.value = phoneNumber;
            }
        });
    });

    // Prefill empty phone fields with "+420"
    phoneInputs.forEach((phoneInput) => {
        if (phoneInput.value === "") {
            phoneInput.value = "+420 ";
        }
    });

    // Prevent default behavior of selecting content on focus via TAB key
    // Prevent default behavior of selecting content on focus via TAB key
    inputFields.forEach((inputField) => {
        // Attach "focus" event to each form field
        inputField.addEventListener("focus", (event) => {
            // Save current content to variable
            const savedValue = event.target.value;
            // Delete content
            event.target.value = "";
            // Set content back from saved value
            event.target.value = savedValue;
        });
    });

    // Set focus on the first input field
    $(document).ready(function () {
        $("form:first *:input[type!=hidden]:first").focus();
    });
}

// Create a new MutationObserver instance
const observer = new MutationObserver(function (mutationsList, observer) {
    // Check if the #mobile_form_field element is in the DOM
    if (document.getElementById("mobile_form_field")) {
        // If it is, disconnect the observer
        observer.disconnect();
        // Call your function
        runCodeWhenFormIsReady();
        console.log("page loaded");
    }
});

// Start observing the document for changes to the DOM
observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
});
