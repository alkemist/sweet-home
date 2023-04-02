import { DocumentBackInterface } from './document.interface';
import { HasIdWithInterface } from './id.interface';
import {OauthTokensInterface} from "./oauth-tokens.model";


export interface UserInterface extends DocumentBackInterface {
  email: string;
  jeedom: string;
  spotify: OauthTokensInterface;
  sonos: OauthTokensInterface;
}

export type UserStoredInterface = HasIdWithInterface<UserInterface>;
