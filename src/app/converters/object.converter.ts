import { DocumentSnapshot, SnapshotOptions } from 'firebase/firestore';
import { DocumentInterface } from '@models';
import { FirestoreDataConverter } from '@firebase/firestore';

export const objectConverter = <T extends DocumentInterface>(): FirestoreDataConverter<T> => {
  return {
    toFirestore: (device: T): T => {
      const deviceFields = { ...device };
      delete deviceFields.id;
      return deviceFields;
    },
    fromFirestore: (snapshot: DocumentSnapshot, options: SnapshotOptions) => {
      return snapshot.data(options) as T;
    }
  };
};
