import { DataObjectInterface } from '@app/models/data-object.interface';

export interface UserInterface extends DataObjectInterface {
  email: string;
  token: string;
}
