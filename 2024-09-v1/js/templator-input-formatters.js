(function(Templator) {
    console.log("Templator input formatters loading");
    Templator.InputFormatters = Templator.InputFormatters || {};

    Templator.InputFormatters.validateEmail = function () {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        var $input = jQuery(this);
        var $errorMessage = $input.siblings('.error-message');
        
        console.log('Validating email:', $input.val());
        
        if ($input.val().trim() === '') {
            console.log('Email field is empty');
            $errorMessage.hide();
            $input.removeClass('is-invalid');
            return true;
        }
        
        if (!emailRegex.test($input.val())) {
            console.log('Email is invalid');
            $errorMessage.text('Please enter a valid email address.').show();
            $input.addClass('is-invalid');
            return false;
        } else {
            console.log('Email is valid');
            $errorMessage.hide();
            $input.removeClass('is-invalid');
            return true;
        }
    };

    Templator.InputFormatters.formatPhoneNumber = function () {
        let phoneNumber = this.value.replace(/\s+/g, "");

        if (phoneNumber.match(/^[0-9+]+$/)) {
            if (phoneNumber.startsWith("00")) {
                phoneNumber = "+" + phoneNumber.slice(2);
            }

            let formatted = false;
            for (const countryCode in Templator.InputFormatters.countryCodes) {
                if (phoneNumber.startsWith(Templator.InputFormatters.countryCodes[countryCode])) {
                    const prefix = Templator.InputFormatters.countryCodes[countryCode];
                    const rest = phoneNumber.slice(prefix.length);
                    const formattedRest = rest.replace(/(.{3})/g, "$1 ").trim();
                    phoneNumber = prefix + " " + formattedRest;
                    formatted = true;
                    break;
                }
            }

            if (!formatted) {
                // If no country code was found, format the number in groups of three
                phoneNumber = phoneNumber.replace(/(.{3})/g, "$1 ").trim();
            }

            this.value = phoneNumber;
        }
    };

    Templator.InputFormatters.debugPhoneNumber = function () {
        console.log('Phone number formatted:', this.value);
    };

    Templator.InputFormatters.formatPhoneNumberStatic = function (phoneNumber) {
        phoneNumber = phoneNumber.replace(/\s+/g, "");

        if (phoneNumber.match(/^[0-9+]+$/)) {
            if (phoneNumber.startsWith("00")) {
                phoneNumber = "+" + phoneNumber.slice(2);
            }

            let formatted = false;
            for (const countryCode in Templator.InputFormatters.countryCodes) {
                if (phoneNumber.startsWith(Templator.InputFormatters.countryCodes[countryCode])) {
                    const prefix = Templator.InputFormatters.countryCodes[countryCode];
                    const rest = phoneNumber.slice(prefix.length);
                    const formattedRest = rest.replace(/(.{3})/g, "$1 ").trim();
                    phoneNumber = prefix + " " + formattedRest;
                    formatted = true;
                    break;
                }
            }

            if (!formatted) {
                // If no country code was found, format the number in groups of three
                phoneNumber = phoneNumber.replace(/(.{3})/g, "$1 ").trim();
            }
        }

        return phoneNumber;
    };

    Templator.InputFormatters.countryCodes = {
        AL: "+355", AD: "+376", AM: "+374", AT: "+43", AZ: "+994", BY: "+375", BE: "+32", BA: "+387",
        BG: "+359", HR: "+385", CY: "+357", CZ: "+420", DK: "+45", EE: "+372", FO: "+298", FI: "+358",
        FR: "+33", GE: "+995", DE: "+49", GI: "+350", GR: "+30", HU: "+36", IS: "+354", IE: "+353",
        IM: "+44", IT: "+39", KZ: "+7", XK: "+383", LV: "+371", LI: "+423", LT: "+370", LU: "+352",
        MK: "+389", MT: "+356", MD: "+373", MC: "+377", ME: "+382", NL: "+31", NO: "+47", PL: "+48",
        PT: "+351", RO: "+40", RU: "+7", SM: "+378", RS: "+381", SK: "+421", SI: "+386", ES: "+34",
        SE: "+46", CH: "+41", UA: "+380", GB: "+44", VA: "+39"
    };

})(window.Templator = window.Templator || {});
