import { ITokens } from './ITokens';
import { IAuthUser } from './IAuthUser';

export interface AuthResponse {
	tokens: ITokens;
	user: IAuthUser;
}
