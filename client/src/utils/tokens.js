import globToRegexp from 'glob-to-regexp';

/**
 * Get the auth token that suits the source being requested.
 *
 * @param {object} tokens
 * @param {object} source
 *
 * @return {string} auth token matching source's id.
 */
export const getAuthTokenForSource = (tokens, source) => {
  const keys = Object.keys(tokens);

  const authToken = keys.find(key => {
    const re = globToRegexp(key);
    if (re.test(source.source_id)) {
      return key;
    }
  });

  return tokens[authToken];
};
