import { ITokens } from './ITokens';

export interface RegResponse {
	name: string;
	email: string;
	password: string;
	tokens?: ITokens;
}
