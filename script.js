document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ JavaScript Loaded Successfully");

    // 📌 Get elements
    let modeButtons = document.querySelectorAll(".mode-option");
    let phonebookButton = document.getElementById("phonebookButton");
    let dialerSection = document.getElementById("dialer-section");
    let phonebookContainer = document.getElementById("phonebook-container");
    let phonebookSection = document.getElementById("phonebookSection");
    let vaPhonebookSection = document.getElementById("vaPhonebookSection");
    let luriePhonebookSection = document.getElementById("luriePhonebookSection");
    let inputField = document.getElementById("phoneNumber");
    let body = document.body;

    // 📌 Load mode from localStorage, including the original VA preference
    let storedMode = localStorage.getItem("phonebookMode");
    let mode = storedMode || (localStorage.getItem("isVA") === "true" ? "va" : "nmh");
    let inPhonebookView = false;

    const modeNames = {
        nmh: "NMH",
        va: "VA",
        lurie: "Lurie"
    };

    const prefixMappings = {
        nmh: { "6": "312-926", "5": "312-695", "4": "312-694", "2": "312-472" },
        va: { "5": "312-569", "4": "312-469" },
        lurie: { "7": "312-227" }
    };

    const patterns = {
        nmh: /^([2456])-(\d{4})$/,
        va: /^([45])-(\d{4})$/,
        lurie: /^(7)-(\d{4})$/
    };

    function applyMode() {
        modeButtons.forEach(function (button) {
            let isActive = button.dataset.mode === mode;
            button.classList.toggle("active", isActive);
            button.setAttribute("aria-pressed", String(isActive));
        });

        phonebookButton.textContent = inPhonebookView
            ? `Go to ${modeNames[mode]} Dialer`
            : `Go to ${modeNames[mode]} Phonebook`;

        body.classList.remove("nmh-mode", "va-mode", "lurie-mode");
        body.classList.add(`${mode}-mode`);

        if (inPhonebookView) {
            phonebookSection.style.display = mode === "nmh" ? "block" : "none";
            vaPhonebookSection.style.display = mode === "va" ? "block" : "none";
            luriePhonebookSection.style.display = mode === "lurie" ? "block" : "none";
        }

        console.log("🔄 Mode Loaded: " + modeNames[mode]);
    }

    // 📌 Handle the three-way mode selector
    modeButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            mode = this.dataset.mode;
            localStorage.setItem("phonebookMode", mode);
            localStorage.setItem("isVA", String(mode === "va"));
            inputField.value = "";
            applyMode();
        });
    });

    // 📌 Toggle between Dialer & Phonebook
    phonebookButton.addEventListener("click", function () {
        inPhonebookView = !inPhonebookView;

        if (inPhonebookView) {
            dialerSection.style.display = "none";
            phonebookContainer.style.display = "block";
        } else {
            dialerSection.style.display = "block";
            phonebookContainer.style.display = "none";
        }

        applyMode();
    });

    // 📌 Function to add numbers to the input field
    function addNumber(num) {
        if (!inputField) return;

        let prefixMapping = prefixMappings[mode];

        if (inputField.value.length === 0 && prefixMapping[num]) {
            inputField.value = num + "-";
            return;
        }

        inputField.value += num;
    }

    // 📌 Function to clear last entered digit
    function clearNumber() {
        if (inputField) {
            inputField.value = inputField.value.slice(0, -1);
        }
    }

    // 📌 Function to make a call
    function callNumber() {
        if (!inputField) return;
        let number = inputField.value.trim();
        let prefixMapping = prefixMappings[mode];
        let pattern = patterns[mode];

        if (pattern.test(number)) {
            let match = number.match(pattern);
            number = `${prefixMapping[match[1]]}-${match[2]}`;
        }

        console.log("📞 Dialing: " + number);

        if (number) {
            let dialLink = document.createElement("a");
            dialLink.href = "tel:" + number;
            document.body.appendChild(dialLink);
            dialLink.click();
            document.body.removeChild(dialLink);
        }
    }

    // 📌 Attach event listeners to dial pad buttons
    document.querySelectorAll(".dial-pad button").forEach(function (button) {
        function handlePress() {
            let value = button.innerText.trim();
            if (value === "📞 Call") callNumber();
            else if (value === "⌫") clearNumber();
            else addNumber(value);
        }

        button.addEventListener("click", handlePress);
        button.addEventListener("touchstart", function (event) {
            event.preventDefault();
            handlePress();
        }, { passive: false });
    });

    // 📌 Apply stored mode on page load
    applyMode();
});
