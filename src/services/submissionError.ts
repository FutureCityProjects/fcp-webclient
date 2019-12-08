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
