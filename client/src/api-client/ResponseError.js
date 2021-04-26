export class ResponseError extends Error {
  /** @type {number} */
  status;
  /** @type {Response} */
  response;

  /**
   * @param {Response} [response]
   */
  constructor(response) {
    super(response.statusText);
    this.status = response.status;
    this.response = response;
  }

  /** @returns {Promise<string[] | undefined>} */
  async getErrors() {
    const errorObject = await this.response.json();
    if (errorObject.detail || !errorObject.errors) {
      return;
    }

    const errors = errorObject.errors;

    let errorMessages = [];
    for (const key of Object.keys(errors)) {
      for (const index in errors[key]) {
        const array = errors[key];
        errorMessages = [...errorMessages, array[index]];
      }
    }
    return errorMessages;
  }
}
