import { ElementRef, ViewContainerRef } from '@angular/core';
import { ComponentByType, CoordinateInterface, DeviceModel, SizeInterface } from '@models';
import * as Hammer from 'hammerjs';
import { BehaviorSubject, Subject } from 'rxjs';
import { DocumentHelper } from './document.helper';
import { MathHelper } from './math.helper';
import { DeviceSupervisor } from './device.supervisor';
import { ObjectHelper } from './object.helper';

interface WheelEventCustom extends WheelEvent {
  wheelDelta: number;
}

interface MouseEventCustom extends MouseEvent {
  toElement: Element;
}

export class MapBuilder {
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
  private _supervisors = new Map<string, DeviceSupervisor>();

  constructor() {
  }

  private _editMode$ = new BehaviorSubject<boolean>(false);

  get editMode$() {
    return this._editMode$.asObservable();
  }

  private _deviceMoved$ = new Subject<DeviceModel>();

  get deviceMoved$() {
    return this._deviceMoved$.asObservable();
  }

  private _ready$ = new BehaviorSubject<boolean>(false);

  get ready$() {
    return this._ready$.asObservable();
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

  setViewContainer(viewContainerRef: ViewContainerRef | undefined) {
    //console.log('-- Set View Container Ref', viewContainerRef);
    this._viewContainerRef = viewContainerRef;
    this.checkStatus();
  }

  build(devices: DeviceModel[]) {
    devices.forEach((device) => {
      if (device.type) {
        const componentRef = this.viewContainer.createComponent(ComponentByType[device.type]);
        componentRef.instance.setPosition(device.position);

        //console.log('-- Build device', device);
        const supervisor = new DeviceSupervisor(componentRef, ObjectHelper.clone(device));

        supervisor.moved$.subscribe(() => {
          this._deviceMoved$.next(supervisor.device);
        });

        this._supervisors.set(device.id, supervisor);
      }
    })

    this.updateTraversableElements();
  }

  switchEditMode(editMode: boolean) {
    this._editMode$.next(editMode);
    //console.log('-- Switch Edit Mode');

    this.hammer.get('pinch').set({ enable: !editMode });
    this.hammer.get('pan').set({ enable: !editMode, direction: Hammer.DIRECTION_ALL });

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

  setElements(pageRef: ElementRef, mapRef: ElementRef) {
    //console.log('-- Set Elements');
    this._pageElement = pageRef.nativeElement;
    this._mapElement = mapRef.nativeElement;
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

      this.updateCurrentPosition({
        x: MathHelper.round(this._mapPosition.x + event.deltaX),
        y: MathHelper.round(this._mapPosition.y + event.deltaY)
      });

      this.updateMap(this._currentMapPosition.x, this._currentMapPosition.y, this._scale);
    });

    this.hammer.on('pinch pinchmove', (event) => {
      //console.log('-- Hammer pinch')

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
    });
  }

  getDevices(): DeviceModel[] {
    return [ ...this._supervisors.values() ].map((supervisor) => supervisor.device);
  }

  setPlan(target: HTMLImageElement) {
    this._mapSize.w = target.naturalWidth;
    this._mapSize.h = target.naturalHeight;

    this.checkStatus();
  }

  private checkStatus() {
    if (this._viewContainerRef && this._mapSize.w && this._mapSize.h) {
      this._ready$.next(true);

      this.onResize();
      this.initHammer();
      this.pageElement.addEventListener('wheel', (e) => {
        if (this._editMode$.value) {
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
    }
  }

  private updateTraversableElements() {
    this._traversableElements = DocumentHelper.getTraverseChildren(this.pageElement);

    this.pageElement.addEventListener('mouseout', (e) => {
      const event = e as MouseEventCustom;
      const element = event.toElement || event.relatedTarget;
      if (!!~this._traversableElements.indexOf(element)) {
        return;
      }

      //console.log('-- Out of container');
      if (this._hammer) {
        this.hammer.stop(true);
        this.updateValues();
      }
    }, true);
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
