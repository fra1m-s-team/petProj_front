import $api from '../../http';

//FIXME: Add response
export default class SceneService {
	static async save(scneJSON: string, user: any ) {
		return $api.post('/scene/save', { dataJSON: scneJSON, author: user });
	}
}
