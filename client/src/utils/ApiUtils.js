class ApiUtils {
    async checkResponseStatus(response) {
        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }
        return response.json();
    }

    getAuthHeaders(customHeaders = {}) {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...customHeaders,
        };
    }

    async fetch(url) {
        const response = await fetch(url, {
            method: 'GET',
            headers: this.getAuthHeaders()
        });
        return await this.checkResponseStatus(response);
    }

    async get(url, customHeaders = {}) {
        console.log(url);
        const response = await fetch(url, {
            method: 'GET',
            headers: this.getAuthHeaders(customHeaders)
        });
        // console.log(headers||response);
        return await this.checkResponseStatus(response);
    }

    async post(url, newData, customHeaders = {}) {
        const response = await fetch(url, {
            method: 'POST',
            headers: this.getAuthHeaders(customHeaders),
            body: JSON.stringify(newData),
        });
        return await this.checkResponseStatus(response);
    }

    async put(url, newData, customHeaders = {}) {
        const response = await fetch(url, {
            method: 'PUT',
            headers: this.getAuthHeaders(customHeaders),
            body: JSON.stringify(newData),
        });
        return await this.checkResponseStatus(response);
    }

    async delete(url, customHeaders = {}) {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: this.getAuthHeaders(customHeaders),
        });
        await this.checkResponseStatus(response);
    }

    async patch(url, newData, customHeaders = {}) {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: this.getAuthHeaders(customHeaders),
            body: JSON.stringify(newData),
        });
        return await this.checkResponseStatus(response);
    }
}

export default ApiUtils;
