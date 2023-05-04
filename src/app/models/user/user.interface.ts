import {DocumentBackInterface, HasIdWithInterface} from '../document';
import {OauthTokensInterface} from "../oauth";


export interface UserInterface extends DocumentBackInterface {
  email: string;
  jeedom: string;
  spotify?: OauthTokensInterface;
  sonos?: OauthTokensInterface;
}

export type UserStoredInterface = HasIdWithInterface<UserInterface>;
