export const JSON_HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json'
};

export const FORM_HEADERS = {
  Accept: 'application/json, application/xml, text/plain, text/html, *.*'
  // 'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary1234 // cannot hard-code form boundary
};

export const getData = (url, headers = {}) => {
  return fetch(url, {
    credentials: 'include',
    method: 'GET',
    headers: headers
  })
    .then(response => response)
    .catch(error => error);
};

export const sendData = (url, data = '', headers = {}, method = 'POST') => {
  let submission = { ...data };

  if (Object.prototype.toString.call(data) !== '[object FormData]') {
    submission = JSON.stringify(submission);
  } else {
    submission = data;
  }

  if (method === 'DELETE') {
    return fetch(`${url}${data}/`, {
      credentials: 'include',
      method,
      headers: headers
    })
      .then(response => response)
      .catch(error => error);
  } else if (method === 'PUT') {
    return fetch(url, {
      credentials: 'include',
      method,
      headers: headers,
      body: submission
    })
      .then(response => response)
      .catch(error => error);
  } else {
    return fetch(url, {
      credentials: 'include',
      method,
      headers: headers,
      body: submission
    })
      .then(response => response)
      .catch(error => error);
  }
};
