import { HasIdWithInterface } from '@app/models/id.interface';

export interface DocumentBackInterface {
  name: string;
  slug: string;
}

export interface DocumentFrontInterface {
  id: string;
  name: string;
}

export type DocumentStoredInterface = HasIdWithInterface<DocumentBackInterface>;


