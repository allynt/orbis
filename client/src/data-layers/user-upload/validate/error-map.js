const ERROR_MAP = {
  /**
   * @param {string} message
   * @returns {string | undefined}
   */
  get(message) {
    for (const key in this) {
      if (message.includes(key)) {
        return this[key];
      }
    }
    return undefined;
  },
  /**
   * @param {string[]} messages
   * @param {string} messageKey
   */
  register(messages, messageKey) {
    if (!this[messageKey])
      throw Error(`Could not find key ${messageKey} in ERROR_MAP`);
    messages.forEach(message => (this[message] = this[messageKey]));
  },
  invalidFormat:
    'Invalid file format. Please upload a file according to the guidelines!',
  emptyFile:
    'The uploaded file is empty, therefore we can not show anything on the map. Please fill it with data and start the upload process again. We are not saving this file so you don’t have to worry about it.',
  incorrectHeaders: 'Must include latitude and longitude headers',
};
ERROR_MAP.register(
  ['No valid loader found', 'arrayBuffer is not a function'],
  'invalidFormat',
);
ERROR_MAP.register(
  [
    "Cannot read properties of undefined (reading 'length')",
    "Cannot read property 'length' of undefined",
  ],
  'emptyFile',
);

export { ERROR_MAP };
