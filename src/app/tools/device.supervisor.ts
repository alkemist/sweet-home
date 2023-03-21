import { ComponentRef } from '@angular/core';
import { BaseDeviceComponent } from '../modules/devices/device.component';
import { CoordinateInterface, DeviceModel } from '@models';
import { Subject } from 'rxjs';
import { MathHelper } from './math.helper';

export class DeviceSupervisor {
  private _isDragging = false;
  private _moved = new Subject<CoordinateInterface>();
  private _position: CoordinateInterface = { x: 0, y: 0 };

  constructor(
    private _componentRef: ComponentRef<BaseDeviceComponent>,
    private _device: DeviceModel
  ) {
  }

  get device(): DeviceModel {
    return this._device;
  }

  private _hammer?: HammerManager;

  private get hammer(): HammerManager {
    return this._hammer as HammerManager;
  }

  switchEditMode(editMode: boolean) {
    if (editMode) {
      this._hammer = new Hammer(this._componentRef.location.nativeElement);
      this._hammer.add(new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: 0 }));

      this._hammer.on("pan", (event) => {
        console.log('-- Hammer pan', event.deltaX, event.deltaY)
        const element = event.target;

        if (!this._isDragging) {
          this._isDragging = true;
          this._componentRef.instance.draggable = true;
          //this._device.x = element.offsetLeft;
          //this._device.y = element.offsetTop;
          this._position.x = element.offsetLeft;
          this._position.y = element.offsetTop;
        }

        const position: CoordinateInterface = {
          x: MathHelper.round(this._position.x + event.deltaX),
          y: MathHelper.round(this._position.y + event.deltaY),
        }

        //this._componentRef.instance.setPosition(position);

        element.style.left = position.x + "px";
        element.style.top = position.y + "px";

        if (event.isFinal) {
          //console.log('-- Hammer end')
          this._isDragging = false;
          this._componentRef.instance.draggable = false;
          //this._device.position = position;
          //this._moved.next(position);
        }
      });
    } else {
      this.hammer.stop(true);
      this._hammer = undefined;
    }
  }
}
