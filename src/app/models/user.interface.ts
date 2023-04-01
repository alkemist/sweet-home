import { DocumentBackInterface } from './document.interface';
import { HasIdWithInterface } from './id.interface';


export interface UserInterface extends DocumentBackInterface {
  email: string;
  token: string;
  code: string;
}

export type UserStoredInterface = HasIdWithInterface<UserInterface>;
