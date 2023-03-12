import { DocumentSnapshot, SnapshotOptions } from 'firebase/firestore';
import { DocumentBackInterface } from '@models';
import { FirestoreDataConverter } from '@firebase/firestore';

export const objectConverter = <T extends DocumentBackInterface>(): FirestoreDataConverter<T> => {
  return {
    toFirestore: (document: T): DocumentBackInterface => {
      return document;
    },
    fromFirestore: (snapshot: DocumentSnapshot, options: SnapshotOptions) => {
      return snapshot.data(options) as T;
    }
  };
};
