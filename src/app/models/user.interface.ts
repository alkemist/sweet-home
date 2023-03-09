import { DocumentInterface } from '@app/models/document.interface';

export interface UserInterface extends DocumentInterface {
  email: string;
  token: string;
}
