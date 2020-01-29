import { format, parseISO } from "date-fns"

// @todo make locale configurable, get from i18next
import de from "date-fns/locale/de"

export enum DateFormat {
  NONE = "",
  SHORT = "P",
  MEDIUM = "PPP",
  LONG = "PPPP",
}

export enum TimeFormat {
  NONE = "",
  MINUTES = "p",
  SECONDS = "pp",
}

export function formatDate(
  date: string | Date,
  dateFormat = DateFormat.SHORT,
  timeFormat = TimeFormat.NONE
) {
  if (!date) {
    // @todo log error, should be checked before by caller
    return "n/a"
  }

  if (typeof date === "string") {
    date = parseISO(date)
  }

  return format(date, dateFormat + timeFormat, { locale: de })
}

export default formatDate