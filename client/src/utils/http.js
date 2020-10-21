export const JSON_HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

export const FORM_HEADERS = {
  Accept: 'application/json, application/xml, text/plain, text/html, *.*',
};

export const getJsonAuthHeaders = state => {
  const {
    accounts: { userKey },
  } = state;

  return {
    ...JSON_HEADERS,
    Authorization: `Token ${userKey}`,
  };
};

export const getFormAuthHeaders = state => {
  const {
    accounts: { userKey },
  } = state;

  return {
    ...FORM_HEADERS,
    Authorization: `Token ${userKey}`,
  };
};

export const getData = (url, headers = {}) => {
  return url.startsWith('/api')
    ? fetch(`${window.orbis.getEnv().REACT_APP_API_HOST}${url}`, {
        credentials: 'include',
        method: 'GET',
        headers: headers,
      })
        .then(response => response)
        .catch(error => error)
    : fetch(url, {
        credentials: 'include',
        method: 'GET',
        headers: headers,
      })
        .then(response => response)
        .catch(error => error);
};

/**
 * @param {string} url
 * @param {string | object} data
 * @param {object} headers
 * @param {'POST' | 'PUT' | 'DELETE'} method
 * @returns {Promise<any>}
 */
export const sendData = (url, data = '', headers = {}, method = 'POST') => {
  let submission = { ...data };

  if (Object.prototype.toString.call(data) !== '[object FormData]') {
    submission = JSON.stringify(submission);
  } else {
    submission = data;
  }

  if (method === 'DELETE') {
    return fetch(`${window.orbis.getEnv().REACT_APP_API_HOST}${url}${data}/`, {
      credentials: 'include',
      method,
      headers: headers,
    })
      .then(response => response)
      .catch(error => error);
  } else if (method === 'PUT') {
    return fetch(`${window.orbis.getEnv().REACT_APP_API_HOST}${url}`, {
      credentials: 'include',
      method,
      headers: headers,
      body: submission,
    })
      .then(response => response)
      .catch(error => error);
  } else {
    return fetch(`${window.orbis.getEnv().REACT_APP_API_HOST}${url}`, {
      credentials: 'include',
      method,
      headers: headers,
      body: submission,
    })
      .then(response => response)
      .catch(error => error);
  }
};
