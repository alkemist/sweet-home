import { ViewContainerRef } from '@angular/core';
import { ComponentByType, DeviceModel } from '@models';
import { PanZoomAPI, PanZoomComponent, PanZoomModel } from 'ngx-panzoom';
import { Subject } from 'rxjs';

export class MapBuilder {
  private _viewContainerRef?: ViewContainerRef;
  private _panZoomAPI?: PanZoomAPI;

  constructor() {
  }

  private _ready = new Subject<boolean>();

  get ready() {
    return this._ready.asObservable();
  }

  private _panZoomComponent?: PanZoomComponent;

  get panZoomComponent(): any {
    if (!this._panZoomComponent) {
      throw new Error();
    }
    return this._panZoomComponent;
  }

  private get viewContainer(): ViewContainerRef {
    if (!this._viewContainerRef) {
      throw new Error("View Container not initialized");
    }

    return this._viewContainerRef;
  }

  private get panZoomApi(): PanZoomAPI {
    if (!this._panZoomAPI) {
      throw new Error();
    }
    return this._panZoomAPI;
  }

  setViewContainer(viewContainerRef: ViewContainerRef | undefined) {
    console.log('-- Set View Container Ref', viewContainerRef);
    this._viewContainerRef = viewContainerRef;
    this.checkStatus();
  }

  setPanZoomApi(panZoomAPI: PanZoomAPI) {
    console.log('-- Set Pan Zoom API', panZoomAPI);
    this._panZoomAPI = panZoomAPI;
    this.checkStatus();
  }

  setPanZoomComponent(panZoomComponent: PanZoomComponent | undefined) {
    console.log('-- Set Pan Zoom Component', panZoomComponent);
    this._panZoomComponent = panZoomComponent;
    this.checkStatus();
  }

  build(devices: DeviceModel[]) {
    devices.forEach((device) => {
      if (device.type) {
        this.viewContainer.createComponent(ComponentByType[device.type])
      }
    })
  }

  onModelChanged(model: PanZoomModel) {
    console.log("-- On Model Changed", model, this.panZoomComponent);

    const containerWidth = this.panZoomComponent['frameWidth'] as number;
    const containerHeight = this.panZoomComponent['frameHeight'] as number;
    const mapWidth = this.panZoomComponent['contentWidth'] * this.panZoomComponent['scale'];
    const mapHeight = this.panZoomComponent['contentHeight'] * this.panZoomComponent['scale'];
    const x = model.pan.x;
    const y = model.pan.y;

    console.log(`${ containerWidth } / ${ containerHeight } : ${ mapWidth } / ${ mapHeight } : ${ x } / ${ y }`)

    /*if (mapWidth < containerWidth && model.pan.x < 0) {
      this.panZoomApi.model.pan.x = 0;
    }
    if (mapWidth >= containerWidth && model.pan.x > 0) {
      this.panZoomApi.model.pan.x = 0;
    }
    if (mapWidth < containerWidth && (model.pan.x + mapWidth) > containerWidth) {
      this.panZoomApi.model.pan.x = containerWidth - mapWidth;
    }
    if (mapWidth >= containerWidth && (mapWidth + model.pan.x) < containerWidth) {
      this.panZoomApi.model.pan.x = containerWidth - mapWidth;
    }*/
  }

  private checkStatus() {
    if (this._viewContainerRef && this._panZoomComponent && this._panZoomAPI) {
      this._ready.next(true);
    }
  }
}
