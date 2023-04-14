import { DocumentSnapshot, SnapshotOptions } from 'firebase/firestore';
import { DocumentBackInterface } from '@models';
import { FirestoreDataConverter } from '@firebase/firestore';

export const objectConverter = <I extends DocumentBackInterface>(): FirestoreDataConverter<I> => {
  return {
    toFirestore: (document: I): DocumentBackInterface => {
      return document;
    },
    fromFirestore: (snapshot: DocumentSnapshot, options: SnapshotOptions) => {
      return snapshot.data(options) as I;
    },
  };
};
