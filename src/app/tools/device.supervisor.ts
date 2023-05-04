import {ComponentRef} from '@angular/core';
import {CoordinateInterface, DeviceModel, SizeInterface} from '@models';
import {Subject} from 'rxjs';
import {MathHelper} from './math.helper';
import * as Hammer from 'hammerjs';
import {OverlayPanel} from 'primeng/overlaypanel';
import {ObjectHelper} from './object.helper';
import BaseDeviceComponent from "@base-device-component";

export class DeviceSupervisor {
  private _isDragging = false;
  private _currentPosition: CoordinateInterface = {x: 0, y: 0};
  private readonly _deviceSize: SizeInterface = {w: 0, h: 0};
  private _devicePosition: CoordinateInterface = {x: 0, y: 0};
  private _scale: number = 1;
  private readonly _hammer?: HammerManager;
  private _overlayPanel: OverlayPanel;

  constructor(
    private _componentRef: ComponentRef<BaseDeviceComponent>,
    private _device: DeviceModel,
    private _mapSize: SizeInterface,
    private _isLandscape: boolean
  ) {
    //console.log('-- Supervisor', _device.position, _device.x, _device.y);

    this._overlayPanel = _componentRef.instance.overlayPanel;
    this._hammer = new Hammer(this._componentRef.location.nativeElement);
    this._deviceSize = ObjectHelper.clone(_componentRef.instance.size);

    this.changeOrientation(_mapSize, _isLandscape);

    this.initHammer();
  }

  private _moved$ = new Subject<void>();

  get moved$() {
    return this._moved$.asObservable();
  }

  get hammer(): HammerManager {
    return this._hammer as HammerManager;
  }

  get device(): DeviceModel {
    return this._device;
  }

  getComponent() {
    return this._componentRef.instance;
  }

  changeOrientation(_mapSize: SizeInterface, isLandscape: boolean) {
    /*if (this._device.name === 'Prise couloir') {
      console.log(`-- [${ this._device.name }] Device change orientation`, isLandscape ? 'landscape' : 'portrait');
      console.log('-- Map size', this._mapSize);
    }*/

    this._isLandscape = isLandscape;
    this._mapSize = _mapSize;

    this._devicePosition = MathHelper.orientationConverterPointToMap(
      ObjectHelper.clone(this._device.position),
      this._mapSize,
      this._deviceSize,
      this._isLandscape,
    );

    /*if (this._device.name === 'Prise couloir') {
      console.log(`-- [${ this._device.name }] Original`, this._device.position);
      console.log('-- Converted', this._devicePosition);
    }*/

    this._componentRef.instance.setPosition(this._devicePosition);
  }

  initHammer() {
    this.hammer.add(new Hammer.Pan({enable: false, direction: Hammer.DIRECTION_ALL}));
    this.hammer.on("pan", (event) => {
      //console.log('-- Hammer pan', event.deltaX, event.deltaY);

      if (!this._isDragging) {
        this._isDragging = true;
        //console.log('-- Begin drag', this._devicePosition);
        this._currentPosition = ObjectHelper.clone(this._devicePosition);
      }

      let position: CoordinateInterface = {
        x: MathHelper.clamp(
          MathHelper.round(this._currentPosition.x + (event.deltaX / this._scale)),
          2,
          MathHelper.round(this._mapSize.w - this._deviceSize.w - 2)
        ),
        y: MathHelper.clamp(
          MathHelper.round(this._currentPosition.y + (event.deltaY / this._scale)),
          2,
          MathHelper.round(this._mapSize.h - this._deviceSize.h - 2)
        ),
      }

      this._componentRef.instance.setPosition(position);

      if (event.isFinal) {
        this._isDragging = false;
        this._devicePosition = position;
        this._device.position = MathHelper.orientationConverterMapToPoint(
          position,
          this._mapSize,
          this._componentRef.instance.size,
          this._isLandscape,
        );
        /*console.log(`-- [${ this._device.name }] Original : `, position);
        console.log(`-- [${ this._device.name }] Update position`, this._device.position);*/
        this._moved$.next();
      }
    });
  }

  switchEditMode(editMode: boolean, _scale: number) {
    //console.log('-- Switch Edit Mode Device', editMode);

    this.hammer.get('pan').set({enable: editMode, direction: Hammer.DIRECTION_ALL});

    if (editMode) {
      this._overlayPanel.show({target: this._componentRef.location.nativeElement} as MouseEvent);
      this._componentRef.instance.draggable = true;
      this._scale = _scale;
      //console.log('-- Map scale', _scale);


    } else {
      this._overlayPanel.hide();
      this.hammer.stop(true);
      this._componentRef.instance.draggable = false;
    }
  }
}
