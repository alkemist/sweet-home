import {DeviceStoredInterface, HasIdInterface} from '@models';
import {AddDocument, FillDocuments, InvalideDocuments, RemoveDocument, UpdateDocument} from './document.action';

export class AddDevice extends AddDocument<DeviceStoredInterface> {
  static override readonly type: string = '[Device] Add';

  constructor(payload: DeviceStoredInterface) {
    super(payload);
  }
}

export class UpdateDevice extends UpdateDocument<DeviceStoredInterface> {
  static override readonly type: string = '[Device] Update';

  constructor(payload: DeviceStoredInterface) {
    super(payload);
  }
}

export class RemoveDevice extends RemoveDocument<HasIdInterface> {
  static override readonly type: string = '[Device] Remove';

  constructor(payload: HasIdInterface) {
    super(payload);
  }
}

export class FillDevices extends FillDocuments<DeviceStoredInterface> {
  static override readonly type: string = '[Device] Fill';

  constructor(payload: DeviceStoredInterface[]) {
    super(payload);
  }
}

export class InvalideDevices extends InvalideDocuments<DeviceStoredInterface> {
  static override readonly type: string = '[Device] Invalide';

  constructor() {
    super();
  }
}
