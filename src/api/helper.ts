import { IFund } from "./schema"

const normalizeNumber = (value, zeroAllowed = true): number =>
  value === "" || (!zeroAllowed && value === 0) ? null : value

const normalizeNullableString = (value: string) => {
  if (value === null) {
    return null
  }
  const trimmed = value.trim()
  return trimmed.length ? trimmed : null
}

const normalizeString = (value: string) => value === null ? "" : value.trim()

interface INormalizeOptions {
  strings?: string[],
  nullableStrings?: string[],
  numbers?: string[],
  nonZeroNumbers?: string[]
}

const normalizeObject = (model: any, properties: INormalizeOptions) => {
  if (properties.strings) {
    properties.strings
      .forEach((property) => model[property] = normalizeString(model[property]))
  }

  if (properties.nullableStrings) {
    properties.nullableStrings
      .forEach((property) => model[property] = normalizeNullableString(model[property]))
  }

  if (properties.numbers) {
    properties.numbers
      .forEach((property) => model[property] = normalizeNumber(model[property], true))
  }

  if (properties.nonZeroNumbers) {
    properties.nonZeroNumbers
      .forEach((property) => model[property] = normalizeNumber(model[property], false))
  }

  return model
}

export const normalizeFund = (fund): IFund => normalizeObject(fund, {
  strings: ["description", "imprint", "name", "region", "sponsor",],
  nonZeroNumbers: ["budget", "maximumGrant", "minimumGrant",]
})
