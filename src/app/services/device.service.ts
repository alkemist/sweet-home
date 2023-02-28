import { Injectable } from '@angular/core';
import { FirestoreService } from '@app/services/firestore.service';
import { LoggerService } from '@app/services/logger.service';
import { deviceConverter } from '@app/converters/device.converter';
import { DeviceInterface } from '@app/models/device.interface';
import { JeedomService } from '@app/services/jeedom.service';
import { DeviceModel } from '@models';


@Injectable({
  providedIn: 'root'
})
export class DeviceService extends FirestoreService<DeviceInterface, DeviceModel> {
  constructor(private logger: LoggerService, jeedomService: JeedomService) {
    super(logger, 'device', deviceConverter, DeviceModel);
  }
}
