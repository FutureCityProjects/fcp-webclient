// use JS instead of TS because this file is used by the non-transpiled server.js
dateFns = require("date-fns")

/*
const intlFormats = {
  date: { day: "2-digit", month: "2-digit", year: "numeric" },
  longDate: { day: "numeric", month: "long", year: "numeric", weekday: "long" },
  longDateTime: {
    day: "numeric", month: "long", year: "numeric", weekday: "long", hour: "2-digit", minute: "2-digit"
  }
}
*/

const formats = {
  date: "P",
  longDate: "PPPP",
  longDateTime: "PPPPp",
  month: "MMMM",
  monthYear: "LL'/'y",
  longMonthYear: "MMMM y",
  shortMonth: "MMM",
}

const supportedLocales = {
  de: require(`date-fns/locale/de/index.js`),
  en: require(`date-fns/locale/en-US/index.js`),
}

function getLocale(locale) {
  // return require(`date-fns/locale/${locale}/index.js`)
  return supportedLocales[locale] || supportedLocales.de
}

function formatDate(locale, date, format) {
  if (!date) {
    // @todo log error, should be checked before by caller
    return "n/a"
  }

  if (typeof date === "string") {
    date = new Date(date)
  }

  if (!formats[format]) {
    // @todo log error?
    return "[invalid datetime format]"
  }
  // @todo node per default only includes small-icu (english)
  // return new Intl.DateTimeFormat(locale, intlFormats[format]).format(date))

  return dateFns.format(date, formats[format], { locale: getLocale(locale) })
}

module.exports = { formats, formatDate }