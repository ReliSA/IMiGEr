/**
 * Class containing a few static methods for easier communication using AJAX. Under the hood, Fetch API is used to actually perform the requests.
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API}
 */
class AJAX {
	static async do(url, options) {
		const response = await fetch(url, options);

		return AJAX._handleHttpError(response);
	}

	static async get(url) {
		return AJAX.do(url, {
			method: 'GET',
			credentials: 'same-origin',
		});
	}

	static async post(url, body) {
		return AJAX.do(url, {
			method: 'POST',
			credentials: 'same-origin',
			body,
		});
	}

	static async put(url, body) {
		return AJAX.do(url, {
			method: 'PUT',
			credentials: 'same-origin',
			body,
		});
	}

	static async delete(url) {
		return AJAX.do(url, {
			method: 'DELETE',
			credentials: 'same-origin',
		});
	}

	static async getJSON(url) {
		const response = await AJAX.do(url, {
			method: 'GET',
			credentials: 'same-origin',
		});

		return response.json();
	}

	static async _handleHttpError(response) {
		if (response.ok === true) {
			return response;
		} else {
			throw new HttpError(response);
		}
	}
	
}