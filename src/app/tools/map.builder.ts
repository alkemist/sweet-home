import { ElementRef, ViewContainerRef } from '@angular/core';
import { ComponentByType, DeviceModel } from '@models';
import * as Hammer from 'hammerjs';
import { BehaviorSubject } from 'rxjs';
import { DocumentHelper } from './document.helper';

interface WheelEventCustom extends WheelEvent {
  wheelDelta: number;
}

interface MouseEventCustom extends MouseEvent {
  toElement: Element;
}

export class MapBuilder {
  private _viewContainerRef?: ViewContainerRef;
  private _containerWidth: number = 0;
  private _containerHeight: number = 0;
  private _currentScale: number = 1;
  private _scale: number = 1;
  private _scaleMin: number = 0.4;
  private _scaleMax: number = 3;
  private rangeX: number = 0;
  private rangeY: number = 0;
  private rangeMaxX: number = 0;
  private rangeMinX: number = 0;
  private rangeMaxY: number = 0;
  private rangeMinY: number = 0;
  private mapX: number = 0;
  private mapY: number = 0;
  private currentMapX: number = 0;
  private currentMapY: number = 0;
  private traversableElements: Element[] = [];

  constructor(private mapWidth: number, private mapHeight: number) {
    // @TODO Calculer le scale min/max en fonction de la taille d'écran
    // @TODO Refactoriser
    // @TODO Réarranger variables
    // @TODO Ajouter évenement onResize de la fenètre
  }

  private _ready = new BehaviorSubject<boolean>(false);

  get ready() {
    return this._ready.asObservable();
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
        this.viewContainer.createComponent(ComponentByType[device.type])
      }
    })

    this.updateTraversableElements();
  }

  onResize() {
    this.updateSize();
    this.updateRange();

    this.currentMapX = this.clamp(this.mapX, this.rangeMinX, this.rangeMaxX);
    this.currentMapY = this.clamp(this.mapY, this.rangeMinY, this.rangeMaxY);

    this.updateMap(this.currentMapX, this.currentMapY, this._scale);
  }

  setElements(pageRef: ElementRef, mapRef: ElementRef) {
    //console.log('-- Set Elements');
    this._pageElement = pageRef.nativeElement;
    this._mapElement = mapRef.nativeElement;

    this.onResize();
    this.rangeX = Math.max(0, this.mapWidth - this._containerWidth);
    this.rangeY = Math.max(0, this.mapHeight - this._containerHeight);

    this.pageElement.addEventListener('wheel', (e) => {
      const event = e as WheelEventCustom;
      //console.log('-- Wheel', event.wheelDelta);

      this._scale = this._currentScale = this.clamp(this._scale + (event.wheelDelta / 800), this._scaleMin, this._scaleMax);

      this.updateRange();

      this.mapX = this.currentMapX = this.clamp(this.currentMapX, this.rangeMinX, this.rangeMaxX);
      this.mapY = this.currentMapY = this.clamp(this.currentMapY, this.rangeMinY, this.rangeMaxY);

      this.updateMap(this.currentMapX, this.currentMapY, this._scale);
    }, false);

    this.initHammer();
  }

  updateSize() {
    this._containerWidth = this.pageElement.offsetWidth;
    this._containerHeight = this.pageElement.offsetHeight;
    //console.log('-- Size', this._containerWidth, this._containerHeight);
  }

  updateRange() {
    this.rangeX = Math.max(0, Math.round(this.mapWidth * this._currentScale) - this._containerWidth);
    this.rangeY = Math.max(0, Math.round(this.mapHeight * this._currentScale) - this._containerHeight);

    this.rangeMaxX = Math.round(this.rangeX / 2);
    this.rangeMinX = 0 - this.rangeMaxX;

    this.rangeMaxY = Math.round(this.rangeY / 2);
    this.rangeMinY = 0 - this.rangeMaxY;

    /*console.log('-- Range', this.rangeX, this.rangeY);
    console.log('-- Range max', this.rangeMaxX, this.rangeMaxY);
    console.log('-- Range min', this.rangeMinX, this.rangeMinY);*/
  }

  clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(min, value), max);
  }

  updateMap(x: number, y: number, scale: number) {
    //console.log('-- Map', x, y, scale);

    this.mapElement.style.transform =
      'translateX(' + x + 'px) translateY(' + y + 'px) translateZ(0px) scale(' + scale + ',' + scale + ')';
  }

  initHammer() {
    this._hammer = new Hammer(this.pageElement);
    this.hammer.get('pinch').set({ enable: true });
    this.hammer.get('pan').set({ enable: true, direction: Hammer.DIRECTION_ALL });

    this.hammer.on('pan', (event) => {
      //console.log('-- Hammer pan')

      this.currentMapX = this.clamp(this.mapX + event.deltaX, this.rangeMinX, this.rangeMaxX);
      this.currentMapY = this.clamp(this.mapY + event.deltaY, this.rangeMinY, this.rangeMaxY);

      this.updateMap(this.currentMapX, this.currentMapY, this._scale);
    });

    this.hammer.on('pinch pinchmove', (event) => {
      //console.log('-- Hammer pinch')

      this._currentScale = this.clamp(this._scale * event.scale, this._scaleMin, this._scaleMax)
      this.updateRange();
      this.currentMapX = this.clamp(this.mapX + event.deltaX, this.rangeMinX, this.rangeMaxX);
      this.currentMapY = this.clamp(this.mapY + event.deltaY, this.rangeMinY, this.rangeMaxY);
      this.updateMap(this.currentMapX, this.currentMapY, this._currentScale);
    });

    this.hammer.on('panend pancancel pinchend pinchcancel', () => {
      //console.log('-- Hammer end')

      this.updateValues();
    });
  }

  private checkStatus() {
    if (this._viewContainerRef) {
      this._ready.next(true);
    }
  }

  private updateTraversableElements() {
    this.traversableElements = DocumentHelper.getTraverseChildren(this.pageElement);

    this.pageElement.addEventListener('mouseout', (e) => {
      const event = e as MouseEventCustom;
      const element = event.toElement || event.relatedTarget;
      if (!!~this.traversableElements.indexOf(element)) {
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
    console.log('--- X ', this.mapX, this.currentMapX);
    console.log('--- Y ', this.mapY, this.currentMapY);*/

    this._scale = this._currentScale;
    this.mapX = this.currentMapX;
    this.mapY = this.currentMapY;
  }
}
