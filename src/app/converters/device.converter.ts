import { FirestoreDataConverter } from '@firebase/firestore';
import { DocumentSnapshot, SnapshotOptions } from 'firebase/firestore';
import { DeviceInterface } from '@app/models/device.interface';

export const deviceConverter: FirestoreDataConverter<DeviceInterface> = {
  toFirestore: (device: DeviceInterface): DeviceInterface => {
    return device;
  },
  fromFirestore: (snapshot: DocumentSnapshot, options: SnapshotOptions) => {
    return snapshot.data(options) as DeviceInterface;
  }
};
