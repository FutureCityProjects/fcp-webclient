// use JS instead of TS because this file is used by the non-transpiled server.js

const NextI18Next = require("next-i18next").default;

module.exports = new NextI18Next({
  defaultLanguage: "de",
  fallbackLng: ["de"],
  localePath: typeof window === "undefined" ? "public/locales" : "locales",
  otherLanguages: ["en"],
});
