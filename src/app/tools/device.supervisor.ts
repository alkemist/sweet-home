import { ComponentRef } from '@angular/core';
import { BaseDeviceComponent } from '../modules/devices/base-device.component';
import { CoordinateInterface, DeviceModel, SizeInterface } from '@models';
import { Subject } from 'rxjs';
import { MathHelper } from './math.helper';
import * as Hammer from 'hammerjs';
import { OverlayPanel } from 'primeng/overlaypanel';

export class DeviceSupervisor {
  private _isDragging = false;
  private _currentPosition: CoordinateInterface = { x: 0, y: 0 };
  private readonly _deviceSize: SizeInterface = { w: 0, h: 0 };
  private _mapSize: SizeInterface = { w: 0, h: 0 };
  private _scale: number = 1;
  private readonly _hammer?: HammerManager;
  private _overlayPanel: OverlayPanel;

  constructor(
    private _componentRef: ComponentRef<BaseDeviceComponent>,
    private _device: DeviceModel,
  ) {
    //console.log('-- Supervisor', _device.position, _device.x, _device.y);

    this._overlayPanel = _componentRef.instance.overlayPanel;
    this._hammer = new Hammer(this._componentRef.location.nativeElement);
    this._deviceSize = {
      w: this._componentRef.location.nativeElement.offsetWidth,
      h: this._componentRef.location.nativeElement.offsetHeight
    };

    this.initHammer();
  }

  get hammer(): HammerManager {
    return this._hammer as HammerManager;
  }

  private _moved$ = new Subject<CoordinateInterface>();

  get moved$() {
    return this._moved$.asObservable();
  }

  get device(): DeviceModel {
    return this._device;
  }

  getComponent() {
    return this._componentRef.instance;
  }

  initHammer() {
    this.hammer.add(new Hammer.Pan({ enable: false, direction: Hammer.DIRECTION_ALL }));
    this.hammer.on("pan", (event) => {
      //console.log('-- Hammer pan', event.deltaX, event.deltaY);

      if (!this._isDragging) {
        this._isDragging = true;
        this._currentPosition.x = this._device.x;
        this._currentPosition.y = this._device.y;
      }

      const position: CoordinateInterface = {
        x: MathHelper.clamp(
          MathHelper.round(this._currentPosition.x + (event.deltaX / this._scale)),
          10,
          MathHelper.round(this._mapSize.w - this._deviceSize.w - 10)
        ),
        y: MathHelper.clamp(
          MathHelper.round(this._currentPosition.y + (event.deltaY / this._scale)),
          10,
          MathHelper.round(this._mapSize.h - this._deviceSize.h - 10)
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

  switchEditMode(editMode: boolean, _mapSize: SizeInterface, _scale: number) {
    //console.log('-- Switch Edit Mode Device', editMode);

    this.hammer.get('pan').set({ enable: editMode, direction: Hammer.DIRECTION_ALL });

    if (editMode) {
      this._overlayPanel.show({ target: this._componentRef.location.nativeElement } as MouseEvent);
      this._componentRef.instance.draggable = true;
      this._scale = _scale;
      this._mapSize = _mapSize;
      //console.log('-- Map scale', _scale);


    } else {
      this._overlayPanel.hide();
      this.hammer.stop(true);
      this._componentRef.instance.draggable = false;
    }
  }
}
