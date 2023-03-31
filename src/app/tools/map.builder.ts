import { ElementRef, Injectable, ViewContainerRef } from '@angular/core';
import { CoordinateInterface, DeviceModel, DeviceTypeEnum, SizeInterface } from '@models';
import * as Hammer from 'hammerjs';
import { BehaviorSubject, Subject } from 'rxjs';
import { DocumentHelper } from './document.helper';
import { MathHelper } from './math.helper';
import { DeviceSupervisor } from './device.supervisor';
import { SmartMapModel } from '../models/smart-map.model';
import { BaseDeviceComponent } from '../modules/devices/base-device.component';
import { SmartLoaderModel } from '../models/smart-loader.model';
import { ObjectHelper } from './object.helper';
import { DeviceService } from '@services';
import { MessageService } from 'primeng/api';
import {
  DeviceChromecastComponent,
  DeviceOnOffPlugLidlComponent,
  DeviceSonosComponent,
  DeviceThermostatAqaraComponent,
  DeviceThermostatMoesComponent
} from '@devices';

@Injectable({
  providedIn: 'root'
})
export class MapBuilder {
  private _loaderManager = new SmartLoaderModel('queries');

  private _viewContainerRef?: ViewContainerRef;
  private _containerSize: SizeInterface = { w: 0, h: 0 };
  private _mapSize: SizeInterface = { w: 0, h: 0 };
  private _currentScale: number = 1;
  private _scale: number = 1;
  private _scaleMin: number = 1;
  private _scaleMax: number = 1;
  private _range: CoordinateInterface = { x: 0, y: 0 };
  private _rangeMin: CoordinateInterface = { x: 0, y: 0 };
  private _rangeMax: CoordinateInterface = { x: 0, y: 0 };
  private _currentMapPosition: CoordinateInterface = { x: 0, y: 0 };
  private _mapPosition: CoordinateInterface = { x: 0, y: 0 };
  private _traversableElements: Element[] = [];
  private _supervisors = new SmartMapModel<string, DeviceSupervisor>();
  private _hammerEnabled = true;
  private _isEditMode = false;
  private _isDragging = false;

  constructor() {
  }

  private _deviceUpdated$ = new Subject<void>();

  get deviceUpdated$() {
    return this._deviceUpdated$.asObservable();
  }

  get globalLoader$() {
    return this._loaderManager.globalLoader$;
  }

  get allLoaders$() {
    return this._loaderManager.allLoaders$;
  }

  private _deviceMoved$ = new Subject<DeviceModel>();

  get deviceMoved$() {
    return this._deviceMoved$.asObservable();
  }

  private _ready$ = new BehaviorSubject<boolean>(false);

  get ready$() {
    return this._ready$.asObservable();
  }

  private _loaded$ = new Subject<boolean>();

  get loaded$() {
    return this._loaded$.asObservable();
  }

  private _hammer?: HammerManager;

  private get hammer(): HammerManager {
    return this._hammer as HammerManager;
  }

  private _pageElement?: HTMLElement;

  private get pageElement(): HTMLElement {
    return this._pageElement as HTMLElement;
  }

  private _mapElement?: HTMLElement;

  private get mapElement(): HTMLElement {
    return this._mapElement as HTMLElement;
  }

  private get viewContainer(): ViewContainerRef {
    return this._viewContainerRef as ViewContainerRef;
  }

  addUpdate() {
    this._deviceUpdated$.next();
  }

  reset() {
    this._loaderManager = new SmartLoaderModel('queries');

    this._viewContainerRef = undefined;
    this._mapElement = undefined;
    this._pageElement = undefined;
    this._hammer = undefined;
    this._containerSize = { w: 0, h: 0 };
    this._mapSize = { w: 0, h: 0 };
    this._currentScale = 1;
    this._scale = 1;
    this._scaleMin = 1;
    this._scaleMax = 1;
    this._range = { x: 0, y: 0 };
    this._rangeMin = { x: 0, y: 0 };
    this._rangeMax = { x: 0, y: 0 };
    this._currentMapPosition = { x: 0, y: 0 };
    this._mapPosition = { x: 0, y: 0 };
    this._traversableElements = [];
    this._supervisors = new SmartMapModel<string, DeviceSupervisor>();
    this._hammerEnabled = true;
    this._isEditMode = false;
    this._isDragging = false;

    this._ready$.next(false);
    this._loaded$.next(false);
  }

  isEditMode() {
    return this._isEditMode;
  }

  isDraggging() {
    return this._isDragging;
  }

  enableHammer(enable: boolean) {
    this._hammerEnabled = enable;
    this.hammer.get('pinch').set({ enable });
    this.hammer.get('pan').set({ enable, direction: Hammer.DIRECTION_ALL });
  }

  addLoader() {
    return this._loaderManager.addLoader();
  }

  build(devices: DeviceModel[]) {
    devices.forEach((device) => {
      if (device.type) {
        const componentRef = this.viewContainer.createComponent(ComponentClassByType[device.type]);
        const componentInstance = componentRef.instance;
        componentInstance.setPosition(device.position);
        componentInstance.name = device.name;
        componentInstance.actionInfoIds = device.infoCommandIds;
        componentInstance.actionCommandIds = device.actionCommandIds;
        componentInstance.configurationValues = device.configurationValues;
        componentInstance.parameterValues = device.parameterValues.toRecord();

        componentInstance.loaded.subscribe(() => {
          const supervisor = new DeviceSupervisor(componentRef, ObjectHelper.clone(device));

          supervisor.moved$.subscribe(() => {
            this._deviceMoved$.next(supervisor.device);
          });

          this._supervisors.set(device.id, supervisor);
          this.checkDevicesStatus(devices.length);
        });
      }
    })
  }

  getComponents(): BaseDeviceComponent[] {
    return this._supervisors.toArray().map((supervisor) => supervisor.getComponent());
  }

  switchEditMode(editMode: boolean) {
    //console.log('-- Switch Edit Mode');

    this.enableHammer(!editMode)
    this._isEditMode = editMode;

    this._supervisors
      .forEach((supervisor) => supervisor.switchEditMode(
        editMode,
        this._mapSize,
        this._scale
      ));
  }

  onResize() {
    //console.log('-- Resize')

    this.updateSize();
    this.updateRange();
    this.updateCurrentPosition(this._mapPosition)
    this.updateMap(this._currentMapPosition.x, this._currentMapPosition.y, this._scale);
  }

  updateCurrentPosition(position: CoordinateInterface) {
    this._currentMapPosition.x = MathHelper.clamp(position.x, this._rangeMin.x, this._rangeMax.x);
    this._currentMapPosition.y = MathHelper.clamp(position.y, this._rangeMin.y, this._rangeMax.y);
    //console.log('Update current position', this._currentMapPosition);
  }

  setElements(viewContainerRef: ViewContainerRef | undefined, pageRef: ElementRef, mapRef: ElementRef) {
    //console.log('-- Set Elements');

    this._viewContainerRef = viewContainerRef;
    this._pageElement = pageRef.nativeElement;
    this._mapElement = mapRef.nativeElement;
    this.checkPageStatus();
  }

  updateSize() {
    this._containerSize.w = this.pageElement.offsetWidth;
    this._containerSize.h = this.pageElement.offsetHeight;

    const minScale = Math.min(
      MathHelper.round(this._containerSize.w / this._mapSize.w),
      MathHelper.round(this._containerSize.h / this._mapSize.h)
    );
    this._scale = this._currentScale = this._scaleMin = MathHelper.floor(minScale);
    this._scaleMax = this._scaleMin + 1;

    /*console.log('-- Container size', this._containerSize.w, this._containerSize.h);
    console.log('-- Plan size', this._mapSize.w, this._mapSize.h);
    console.log('-- Min scale', this._scaleMin);*/
  }

  updateRange() {
    this._range.x = Math.max(0, MathHelper.round(this._mapSize.w * this._currentScale) - this._containerSize.w);
    this._range.y = Math.max(0, MathHelper.round(this._mapSize.h * this._currentScale) - this._containerSize.h);

    this._rangeMax.x = MathHelper.round(this._range.x / 2);
    this._rangeMin.x = MathHelper.round(0 - this._rangeMax.x);

    this._rangeMax.y = MathHelper.round(this._range.y / 2);
    this._rangeMin.y = MathHelper.round(0 - this._rangeMax.y);

    /*console.log('-- Range', this._range);
    console.log('-- Range min', this._rangeMin);
    console.log('-- Range max', this._rangeMax);*/
  }

  updateMap(x: number, y: number, scale: number) {
    //console.log('-- Update map', x, y, scale);

    this.mapElement.style.transform =
      'translateX(' + x + 'px) translateY(' + y + 'px) translateZ(0px) scale(' + scale + ',' + scale + ')';
  }

  initHammer() {
    this._hammer = new Hammer(this.pageElement);
    this.hammer.get('pinch').set({ enable: true });
    this.hammer.get('pan').set({ enable: true, direction: Hammer.DIRECTION_ALL });

    this.hammer.on('pan', (event) => {
      //console.log('-- Hammer pan', event.deltaX, event.deltaY)
      this._isDragging = true;

      this.updateCurrentPosition({
        x: MathHelper.round(this._mapPosition.x + event.deltaX),
        y: MathHelper.round(this._mapPosition.y + event.deltaY)
      });

      this.updateMap(this._currentMapPosition.x, this._currentMapPosition.y, this._scale);
    });

    this.hammer.on('pinch pinchmove', (event) => {
      //console.log('-- Hammer pinch')
      this._isDragging = true;

      this._currentScale = MathHelper.clamp(
        MathHelper.round(this._scale * event.scale),
        this._scaleMin, this._scaleMax
      );

      this.updateCurrentPosition({
        x: MathHelper.round(this._mapPosition.x + event.deltaX),
        y: MathHelper.round(this._mapPosition.y + event.deltaY)
      });

      this.updateRange();
      this.updateMap(this._currentMapPosition.x, this._currentMapPosition.y, this._currentScale);
    });

    this.hammer.on('panend pancancel pinchend pinchcancel', () => {
      //console.log('-- Hammer end')
      this.updateValues();

      setTimeout(() => {
        this._isDragging = false;
      }, 200)
    });
  }

  getDevices(): DeviceModel[] {
    return [ ...this._supervisors.values() ].map((supervisor) => supervisor.device);
  }

  setPlan(target: HTMLImageElement) {
    this._mapSize.w = target.naturalWidth;
    this._mapSize.h = target.naturalHeight;

    this.checkPageStatus();
  }

  private checkDevicesStatus(devicesCount: number) {
    // console.log('-- Check devices status', this._supervisors.size, devicesCount)

    if (this._supervisors.size === devicesCount) {
      this._loaded$.next(true);

      this.updateTraversableElements();
    }
  }

  private checkPageStatus() {
    if (this._viewContainerRef && this._mapSize.w && this._mapSize.h) {
      this.onResize();
      this.initHammer();
      this.pageElement.addEventListener('wheel', (e) => {
        if (!this._hammerEnabled) {
          return;
        }

        const event = e as WheelEventCustom;
        //console.log('-- Wheel', event.wheelDelta);

        this._currentScale =
          MathHelper.clamp(this._scale + (event.wheelDelta / 800), this._scaleMin, this._scaleMax);

        this.updateCurrentPosition(this._currentMapPosition);
        this.updateValues();
        this.updateRange();

        this.updateMap(this._currentMapPosition.x, this._currentMapPosition.y, this._scale);
      }, false);

      this._ready$.next(true);
    }
  }

  private updateTraversableElements() {
    this._traversableElements = DocumentHelper.getTraverseChildren(this.pageElement);

    const callback: (e: MouseEvent) => void = (e) => {
      const event = e as MouseEventCustom;
      const element = event.toElement || event.relatedTarget;
      if (!!~this._traversableElements.indexOf(element)) {
        return;
      }

      // console.log('-- Out of container', element);
      if (this._hammer) {
        this.hammer.stop(true);
        this.updateValues();
        this._isDragging = false;
      }
    };
    this.pageElement.addEventListener('mouseout', callback, true);
  }

  private updateValues() {
    /*console.log('-- Update values')
    console.log('--- Scale ', this._scale, this._currentScale);
    console.log('--- X ', this._mapPosition.x, this._currentMapPosition.x);
    console.log('--- Y ', this._mapPosition.y, this._currentMapPosition.y);*/

    this._scale = this._currentScale;
    this._mapPosition.x = this._currentMapPosition.x;
    this._mapPosition.y = this._currentMapPosition.y;
  }
}

interface WheelEventCustom extends WheelEvent {
  wheelDelta: number;
}

interface MouseEventCustom extends MouseEvent {
  toElement: Element;
  relatedTarget: Element;
}

type ComponentConstructor = (new (mP: MapBuilder, dS: DeviceService, mS: MessageService) => BaseDeviceComponent);

export const ComponentClassByType: Record<DeviceTypeEnum, ComponentConstructor> = {
  [DeviceTypeEnum.ThermostatAqara]: DeviceThermostatAqaraComponent,
  [DeviceTypeEnum.ThermostatMoes]: DeviceThermostatMoesComponent,
  [DeviceTypeEnum.PlugLidl]: DeviceOnOffPlugLidlComponent,
  [DeviceTypeEnum.Chromecast]: DeviceChromecastComponent,
  [DeviceTypeEnum.Sonos]: DeviceSonosComponent,
}
