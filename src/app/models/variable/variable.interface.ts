import { DocumentBackInterface, DocumentFrontInterface } from '@alkemist/ngx-data-store';

export interface VariableBackInterface extends DocumentBackInterface {
  key: string;
  value: string;
}

export interface VariableFrontInterface extends DocumentFrontInterface {
  key: string;
  value: string;
}
