import { ComponentRef } from '@angular/core';
import { BaseDeviceComponent } from '../modules/devices/device.component';
import { CoordinateInterface, DeviceModel, SizeInterface } from '@models';
import { Subject } from 'rxjs';
import { MathHelper } from './math.helper';
import * as Hammer from 'hammerjs';

export class DeviceSupervisor {
  private _isDragging = false;
  private _currentPosition: CoordinateInterface = { x: 0, y: 0 };
  private _deviceSize: SizeInterface = { w: 0, h: 0 };
  private _mapSize: SizeInterface = { w: 0, h: 0 };
  private _scale: number = 1;
  private _hammer: HammerManager;

  constructor(
    private _componentRef: ComponentRef<BaseDeviceComponent>,
    private _device: DeviceModel,
  ) {
    //console.log('-- Supervisor', _device.position, _device.x, _device.y);

    this._hammer = new Hammer(this._componentRef.location.nativeElement);
    this._deviceSize = {
      w: this._componentRef.location.nativeElement.offsetWidth,
      h: this._componentRef.location.nativeElement.offsetHeight
    }

    this._hammer.add(new Hammer.Pan({ enable: false, direction: Hammer.DIRECTION_ALL }));
    this._hammer.on("pan", (event) => {
      //console.log('-- Hammer pan', event.deltaX, event.deltaY);

      if (!this._isDragging) {
        this._isDragging = true;
        this._currentPosition.x = this._device.x;
        this._currentPosition.y = this._device.y;
      }

      const position: CoordinateInterface = {
        x: MathHelper.clamp(
          MathHelper.round(this._currentPosition.x + (event.deltaX / this._scale)),
          0,
          MathHelper.round(this._mapSize.w - this._deviceSize.w - 1)
        ),
        y: MathHelper.clamp(
          MathHelper.round(this._currentPosition.y + (event.deltaY / this._scale)),
          0,
          MathHelper.round(this._mapSize.h - this._deviceSize.h)
        ),
      }

      this._componentRef.instance.setPosition(position);

      if (event.isFinal) {
        this._isDragging = false;
        this._device.position = position;
        this._moved$.next(position);
      }
    });
  }

  private _moved$ = new Subject<CoordinateInterface>();

  get moved$() {
    return this._moved$.asObservable();
  }

  get device(): DeviceModel {
    return this._device;
  }

  switchEditMode(editMode: boolean, _mapSize: SizeInterface, _scale: number) {
    //console.log('-- Switch Edit Mode Device', editMode);

    this._hammer.get('pan').set({ enable: editMode, direction: Hammer.DIRECTION_ALL });

    if (editMode) {
      this._componentRef.instance.draggable = true;
      this._scale = _scale;
      this._mapSize = _mapSize;
      //console.log('-- Map scale', _scale);


    } else {
      this._hammer.stop(true);
      this._componentRef.instance.draggable = false;
    }
  }
}
