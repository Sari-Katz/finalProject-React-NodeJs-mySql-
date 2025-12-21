class ApiUtil {
  setUnauthorizedHandler(handler) {

    this.onUnauthorized = handler;
  }

  async checkResponseStatus(response) {
    if (response.status === 401 && this.onUnauthorized && !response.url.includes('/users/login')&&!response.url.includes('users/register')) {
      this.onUnauthorized();
    }
    if (!response.ok) {
      const errorText =  await response.json(); ;
      const error = new Error(`HTTP Error! Status: ${response.status}`);
      error.status = response.status;
      error.body = errorText;
      throw error;
    }
    return response.status === 204 ? null : response.json();
  }

  getAuthHeaders(customHeaders = {}) {
    return {
      'Content-Type': 'application/json',
      ...customHeaders,
    };
  }

  _options(method = 'GET', body, customHeaders = {}) {
    const isFormData = body instanceof FormData;

     const options = {
    method,
    headers: isFormData
      ? { ...customHeaders }            // ❗ בלי Content-Type
      : this.getAuthHeaders(customHeaders),
    credentials: 'include',
  };

  if (body) {
    options.body = isFormData ? body : JSON.stringify(body);
  }
    return options;
  }

  async fetch(url) { return this._request(url, this._options('GET')); }
  async get(url, headers = {}) { return this._request(url, this._options('GET', null, headers)); }
  async post(url, data, headers = {}) { return this._request(url, this._options('POST', data, headers)); }
  async put(url, data, headers = {}) { return this._request(url, this._options('PUT', data, headers)); }
  async patch(url, data, headers = {}) { return this._request(url, this._options('PATCH', data, headers)); }
  async delete(url, headers = {}) { return this._request(url, this._options('DELETE', null, headers)); }

  async _request(url, options) {
    const response = await fetch(url, options);
    return this.checkResponseStatus(response);
  }
}

const ApiUtils = new ApiUtil();
export default ApiUtils;

