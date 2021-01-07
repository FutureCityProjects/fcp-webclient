import { IFund } from "./schema"

const normalizeNumber = (value: number | string, zeroAllowed = true): number | string =>
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
  strings?: string[]
  nullableStrings?: string[]
  numbers?: string[]
  nonZeroNumbers?: string[]
}

const normalizeObject = <T>(model: T, properties: INormalizeOptions): T => {
  if (properties.strings) {
    properties.strings
      .forEach((property) => model[property] = normalizeString(model[property] as string))
  }

  if (properties.nullableStrings) {
    properties.nullableStrings
      .forEach((property) => model[property] = normalizeNullableString(model[property] as string))
  }

  if (properties.numbers) {
    properties.numbers
      .forEach((property) => model[property] = normalizeNumber(model[property] as number | string, true))
  }

  if (properties.nonZeroNumbers) {
    properties.nonZeroNumbers
      .forEach((property) => model[property] = normalizeNumber(model[property] as number | string, false))
  }

  return model
}

export const normalizeFund = (fund: IFund): IFund => normalizeObject<IFund>(fund, {
  strings: ["description", "imprint", "name", "region", "sponsor",],
  numbers: ["budget", "maximumGrant", "minimumGrant",]
})
