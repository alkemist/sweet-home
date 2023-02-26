import { FirestoreDataConverter } from '@firebase/firestore';
import { UserInterface } from '@models';
import { DocumentSnapshot, SnapshotOptions } from 'firebase/firestore';

export const userConverter: FirestoreDataConverter<UserInterface> = {
  toFirestore: (user: UserInterface): UserInterface => {
    return user;
  },
  fromFirestore: (snapshot: DocumentSnapshot, options: SnapshotOptions) => {
    return snapshot.data(options) as UserInterface;
  }
};
