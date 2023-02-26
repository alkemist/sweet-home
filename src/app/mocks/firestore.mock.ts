import { FirestoreDataConverter } from '@firebase/firestore';
import { DataObjectInterface } from '@models';

export const dummyConverter: FirestoreDataConverter<DataObjectInterface> = {
  toFirestore: (object: any): DataObjectInterface => {
    return object;
  },
  fromFirestore: () => {
    return {};
  }
};
