export class ResponseError extends Error {
  /** @type {number} */
  status;

  /**
   * @param {Error['message']} message
   * @param {number} status
   */
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}
