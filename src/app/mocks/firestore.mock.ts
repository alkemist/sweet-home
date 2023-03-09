import { FirestoreDataConverter } from '@firebase/firestore';
import { DocumentInterface } from '@models';

export const dummyConverter: FirestoreDataConverter<DocumentInterface> = {
  toFirestore: (object: any): DocumentInterface => {
    return object;
  },
  fromFirestore: () => {
    return {};
  }
};
