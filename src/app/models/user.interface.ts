import { DocumentBackInterface } from './document.interface';
import { HasIdWithInterface } from './id.interface';


export interface UserInterface extends DocumentBackInterface {
  email: string;
  jeedom: string;
  spotify: string;
  sonos: string;
}

export type UserStoredInterface = HasIdWithInterface<UserInterface>;
