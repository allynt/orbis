/**
 * @template B
 */
export class ResponseError extends Error {
  /** @type {number} */
  status;
  /** @type {Response} */
  response;
  /**
   * @type {{errors?: {[key: string]: string[]}, detail?: string} & B}
   * @private
   */
  #body;

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
    const body = await this.getBody();
    if (body.detail || (!body.errors && !body.non_field_errors)) {
      return;
    }

    let errorMessages = [];
    if (body.non_field_errors) {
      errorMessages = [...errorMessages, ...body.non_field_errors];
    }
    if (body.errors) {
      for (const key of Object.keys(body.errors)) {
        for (const index in body.errors[key]) {
          const array = body.errors[key];
          errorMessages = [...errorMessages, array[index]];
        }
      }
    }
    return errorMessages;
  }

  async getBody() {
    if (this.#body) return this.#body;
    const body = await this.response.json();
    this.#body = body;
    return this.#body;
  }
}
