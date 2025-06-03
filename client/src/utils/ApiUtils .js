class ApiUtils {

    async checkResponseStatus(response) {
        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }
        return response.json();
    }

    async fetch(url) {
        console.log("fetching", url);
            const response = await fetch(url);
            console.log("response", response);
            return await this.checkResponseStatus(response);
    }

    async put(url, newData) {
            const response = await fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newData),
            });
            return await this.checkResponseStatus(response);
    }
    async get(url) {
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        return await this.checkResponseStatus(response);
    }
    async post(url,newData) {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newData),
            });
            return await this.checkResponseStatus(response);
    }

    async delete(url) {
            const response = await fetch(url, {
                method: 'DELETE',
            });
            await this.checkResponseStatus(response);
    }

    async patch(url, newData) {
            const response = await fetch(url, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newData),
            });
            return await this.checkResponseStatus(response);
    }
}
export default ApiUtils;