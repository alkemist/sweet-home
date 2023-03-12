import { DocumentBackInterface } from '@app/models/document.interface';
import { HasIdWithInterface } from '@app/models/id.interface';

export interface UserInterface extends DocumentBackInterface {
  email: string;
  token: string;
}

export type UserStoredInterface = HasIdWithInterface<UserInterface>;
