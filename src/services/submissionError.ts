export interface ISubmissionErrorList {
  [key: string]: string
}

export class SubmissionError extends Error {
  public errors: ISubmissionErrorList

  constructor(errors: ISubmissionErrorList) {
    super("Submit Validation Failed")
    this.errors = errors
    // Error.captureStackTrace(this, this.constructor)
    this.name = this.constructor.name

    return this
  }
}

/**
 * Flattens a nested array of errors by combining the keys and prepending the prefix.
 * IF a nummric key is found it is ignored (for array properties).
 * Used to display form errors that have no direct form elements to be placed at.
 *
 * flattenErrors({workPackages: [0: {name: "error"}]}, "project") ->
 * {"project.workPackages.name": "error"}
 *
 * @param errors (nested) error set
 * @param prefix string
 */
export const flattenErrors = (errors: any, prefix: string = ""): ISubmissionErrorList => {
  let flattened = {}
  Object.keys(errors).forEach((k) => {
    if (typeof errors[k] !== "string") {
      const newPrefix = k.match(/^\d+$/)
        ? prefix
        : prefix ? prefix + "." + k : k

      flattened = {
        ...flattened,
        ...flattenErrors(errors[k], newPrefix)
      }
    } else {
      flattened[prefix ? prefix + "." + k : k] = errors[k]
    }
  })

  return flattened
}