// use JS instead of TS because this file is used by the non-transpiled server.js

// replace Intl by polyfill, nodeJs per default only supports small-icu
if (!process.browser) {
  Intl = require("intl")
}

const formatDate = require("../src/services/formatDate").formatDate
const dateFormats = require("../src/services/formatDate").formats
const NextI18Next = require("next-i18next").default;

const dateFormatNames = Object.keys(dateFormats)

module.exports = new NextI18Next({
  defaultLanguage: "de",
  fallbackLng: ["de"],
  localePath: typeof window === "undefined" ? "public/locales" : "locales",
  otherLanguages: ["en"],
  interpolation: {
    format: (value, format, locale) => {
      if (value === null) {
        return value
      }

      // @todo currency symbol configurable
      if (format === "currency") {
        return new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" }).format(value);
      }

      if (format === "number") {
        return new Intl.NumberFormat(locale).format(value);
      }

      if (dateFormatNames.includes(format)) {
        return formatDate(locale, value, format)
      }

      return value;
    }
  },
});
