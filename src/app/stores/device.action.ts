import { DeviceInterface } from '@models';
import { AddDocument, FillDocuments, RemoveDocument, UpdateDocument } from '@app/stores/document.action';

export class AddDevice extends AddDocument<DeviceInterface> {
  static override readonly type: string = '[Device] Add';

  constructor(payload: DeviceInterface) {
    super(payload);
  }
}

export class UpdateDevice extends UpdateDocument<DeviceInterface> {
  static override readonly type: string = '[Device] Update';

  constructor(payload: DeviceInterface) {
    super(payload);
  }
}

export class RemoveDevice extends RemoveDocument<DeviceInterface> {
  static override readonly type: string = '[Device] Remove';

  constructor(payload: DeviceInterface) {
    super(payload);
  }
}

export class FillDevices extends FillDocuments<DeviceInterface> {
  static override readonly type: string = '[Device] Fill';

  constructor(payload: DeviceInterface[]) {
    super(payload);
  }
}
