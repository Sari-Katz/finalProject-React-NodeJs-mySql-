
// class ApiUtils {
//  constructor() {
//     this.onUnauthorized = null; // callback שייקרא כשיש 401
//   }
//   // 1) בדיקת סטטוס — ללא שינוי
//   async checkResponseStatus(response) {
//     if (response.status === 401 &&this.onUnauthorized) {
//       this.onUnauthorized(); 
//     }
//     if (!response.ok) {
//       throw new Error(`HTTP Error! Status: ${response.status}`);
//     }

//     return response.status === 204 ? null : response.json();
//   }

//   // 2) כותרות ברירת‑מחדל — אין יותר Authorization
//   getAuthHeaders(customHeaders = {}) {
//     return {
//       'Content-Type': 'application/json',
//       ...customHeaders,
//     };
//   }

//   // === פונקציות עזר פנימית לאיחוד קוד ===
//   _options(method = 'GET', body, customHeaders = {}) {
//     const options = {
//       method,
//       headers: this.getAuthHeaders(customHeaders),
//       credentials: 'include',          
//     };
//     if (body) options.body = JSON.stringify(body);
//     return options;
//   }

//   async fetch(url)                         { return this._request(url, this._options('GET')); }
//   async get(url, headers = {})             { return this._request(url, this._options('GET',  null, headers)); }
//   async post(url, data, headers = {})      { return this._request(url, this._options('POST', data, headers)); }
//   async put(url, data, headers = {})       { return this._request(url, this._options('PUT',  data, headers)); }
//   async patch(url, data, headers = {})     { return this._request(url, this._options('PATCH', data, headers)); }
//   async delete(url, headers = {})          { return this._request(url, this._options('DELETE', null, headers)); }

//   // === פונקציה פרטית אחת לביצוע בפועל ===
//   async _request(url, options) {
//     const response = await fetch(url, options);
//     return this.checkResponseStatus(response);
//   }
// }

// export default new ApiUtils();
// src/utils/ApiUtils.js

class ApiUtil {
  setUnauthorizedHandler(handler) {
    this.onUnauthorized = handler;
  }

  async checkResponseStatus(response) {
    if (response.status === 401 && this.onUnauthorized) {
      this.onUnauthorized();
    }
    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
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
    const options = {
      method,
      headers: this.getAuthHeaders(customHeaders),
      credentials: 'include',
    };
    if (body) options.body = JSON.stringify(body);
    return options;
  }

  async fetch(url)                         { return this._request(url, this._options('GET')); }
  async get(url, headers = {})             { return this._request(url, this._options('GET',  null, headers)); }
  async post(url, data, headers = {})      { return this._request(url, this._options('POST', data, headers)); }
  async put(url, data, headers = {})       { return this._request(url, this._options('PUT',  data, headers)); }
  async patch(url, data, headers = {})     { return this._request(url, this._options('PATCH', data, headers)); }
  async delete(url, headers = {})          { return this._request(url, this._options('DELETE', null, headers)); }

  async _request(url, options) {
    const response = await fetch(url, options);
    return this.checkResponseStatus(response);
  }
}

const ApiUtils = new ApiUtil();
export default ApiUtils;

