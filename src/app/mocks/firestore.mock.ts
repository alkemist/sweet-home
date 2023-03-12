import { FirestoreDataConverter } from '@firebase/firestore';
import { DocumentBackInterface } from '@models';

export const dummyConverter: FirestoreDataConverter<DocumentBackInterface> = {
  toFirestore: (object: any): DocumentBackInterface => {
    return object;
  },
  fromFirestore: () => {
    return {} as DocumentBackInterface;
  }
};
