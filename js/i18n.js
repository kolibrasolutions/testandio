// i18n.js - Internationalization logic

const translations = {};
let currentLanguage = "pt"; // Default language

// Function to load translation file for a specific language
async function loadTranslations(lang) {
    if (translations[lang]) {
        return translations[lang]; // Already loaded
    }
    try {
        // Path relative to the HTML file (index.html)
        const response = await fetch(`texts_${lang}.json`); 
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        translations[lang] = await response.json();
        console.log(`Translations loaded for ${lang}`);
        return translations[lang];
    } catch (error) {
        console.error(`Could not load translations for ${lang}:`, error);
        // Attempt to load default PT if target fails, otherwise return null
        if (lang !== "pt" && !translations["pt"]) {
            console.log("Attempting to load default Portuguese translations...");
            await loadTranslations("pt"); 
            return translations["pt"]; // Return PT data as fallback
        }
        return null; // Return null if loading fails
    }
}

// Function to update the active state of language buttons
function updateLanguageButtons(selectedLang) {
    const buttons = document.querySelectorAll(".lang-btn");
    buttons.forEach(button => {
        if (button.getAttribute("data-lang") === selectedLang) {
            button.classList.add("active");
        } else {
            button.classList.remove("active");
        }
    });
}

// Function to translate the page
function translatePage(lang) {
    const elements = document.querySelectorAll("[data-i18n-key]");
    const translationData = translations[lang];

    if (!translationData) {
        console.error(`No translation data available for ${lang}. Trying Portuguese fallback.`);
        // If target language data failed to load, try falling back to Portuguese if available
        const fallbackData = translations["pt"];
        if (!fallbackData) {
             console.error("Fallback Portuguese translation data also unavailable.");
             return; // Nothing to translate with
        }
        // Use fallback data
        lang = "pt"; // Set lang to pt for console messages
        translationData = fallbackData;
    }

    elements.forEach(element => {
        const key = element.getAttribute("data-i18n-key");
        // Use the original key (Portuguese text) to look up the translation
        const translation = translationData[key]; 

        if (translation) {
            // Handle different element types and attributes
            if (element.hasAttribute("placeholder")) {
                element.placeholder = translation;
            } else if (element.hasAttribute("alt")) {
                element.alt = translation;
            } else if (element.hasAttribute("title")) {
                element.title = translation;
            } else if (element.tagName === "META" && element.getAttribute("name") === "description") {
                element.content = translation;
            } else if (element.tagName === "INPUT" && (element.type === "submit" || element.type === "button")) {
                 element.value = translation; // Update value for input buttons
            } else {
                // Default: update innerHTML or textContent
                // Using innerHTML allows for simple HTML tags within translations if needed
                element.innerHTML = translation;
            }
        } else {
            console.warn(`Translation not found for key: "${key}" in language "${lang}". Keeping original.`);
            // If translation not found in target lang, try to ensure original PT text is shown
            const originalText = translations["pt"] ? translations["pt"][key] : key; // Get original PT text
            if (originalText) {
                 if (element.hasAttribute("placeholder")) element.placeholder = originalText;
                 else if (element.hasAttribute("alt")) element.alt = originalText;
                 else if (element.hasAttribute("title")) element.title = originalText;
                 else if (element.tagName === "META" && element.getAttribute("name") === "description") element.content = originalText;
                 else if (element.tagName === "INPUT" && (element.type === "submit" || element.type === "button")) element.value = originalText;
                 else element.innerHTML = originalText;
            }
        }
    });

    // Update the lang attribute of the HTML tag
    document.documentElement.lang = lang.split("-")[0]; // e.g., "pt", "en", "es"
    console.log(`Page translated to ${lang}`);
}

// Function to set the language
async function setLanguage(lang) {
    if (!["pt", "en", "es"].includes(lang)) {
        console.warn(`Unsupported language: ${lang}. Defaulting to Portuguese.`);
        lang = "pt";
    }
    
    await loadTranslations(lang); // Load target language
    // Ensure PT is loaded if not already, for fallbacks
    if (lang !== "pt" && !translations["pt"]) {
        await loadTranslations("pt");
    }
    
    translatePage(lang);
    updateLanguageButtons(lang); // Update button styles
    currentLanguage = lang;
    
    // Save preference to local storage
    try {
        localStorage.setItem("preferredLanguage", lang);
    } catch (e) {
        console.warn("Could not save language preference to local storage:", e);
    }
}

// Function to get preferred language (check local storage, then browser settings)
function getPreferredLanguage() {
    try {
        const savedLang = localStorage.getItem("preferredLanguage");
        if (savedLang && ["pt", "en", "es"].includes(savedLang)) {
            return savedLang;
        }
    } catch (e) {
        console.warn("Could not read language preference from local storage:", e);
    }

    // Fallback to browser language
    const browserLang = navigator.language.split("-")[0]; // Get primary language code (e.g., "en" from "en-US")
    if (["pt", "en", "es"].includes(browserLang)) {
        return browserLang;
    }

    return "pt"; // Default to Portuguese
}

// Initial load and event listeners
document.addEventListener("DOMContentLoaded", async () => {
    const preferredLang = getPreferredLanguage();
    await setLanguage(preferredLang);

    // Add event listeners to language buttons
    const langButtons = document.querySelectorAll(".lang-btn");
    langButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            const selectedLang = event.target.getAttribute("data-lang");
            if (selectedLang && selectedLang !== currentLanguage) {
                setLanguage(selectedLang);
            }
        });
    });
});

