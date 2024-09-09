import axios from 'axios';

export function useFetch(url: string, method: string, requestData: {}) {
	if (method === 'POST') {
		const fetchPost = async (url: string, data: {}) => {
			try {
				console.log('data: ', data);
				const response = await axios.post(url, data);
				console.log(response);
				return response;
			} catch (error) {
				console.error('Error occurred during POST request:', error);
			}
		};
		return fetchPost(url, requestData);
	} else if (method === 'GET') {
		//get method
		return false;
	}
}

export function postAuth(email: string, password: string) {
	const data = useFetch('http://localhost:8080/user/auth', 'POST', {
		email: email,
		password: password,
	});
	return data;
}

export function postReg(user: string, email: string, password: string) {
	const data = useFetch('http://localhost:8080/user/registration', 'POST', {
		email: email,
		name: user,
		password: password,
	});
	return data;
}
