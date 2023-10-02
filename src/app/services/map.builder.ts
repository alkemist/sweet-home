import {ElementRef, Injectable, Type, ViewContainerRef} from '@angular/core';
import {
    CoordinateInterface,
    DeviceCategoryEnum,
    DeviceModel,
    DeviceTypeEnum,
    SizeInterface,
    SmartLoaderModel,
    SmartMapModel
} from '@models';
import 'hammerjs';
import {BehaviorSubject, Subject, Subscription} from 'rxjs';
import {DeviceSupervisor, DocumentHelper, MathHelper} from '@tools';
import {LoggerService} from './index';
import {
    DeviceChromecastComponent,
    DeviceOnOffLidlComponent,
    DeviceOnOffMoesComponent,
    DeviceSonosComponent,
    DeviceThermometerAqaraComponent,
    DeviceThermostatAqaraComponent,
    DeviceThermostatMoesComponent
} from '@devices';
import {UnexpectedError} from '@errors';
import BaseDeviceComponent from "@base-device-component";
import {TypeHelper} from "@alkemist/smart-tools";

@Injectable({
    providedIn: 'root'
})
export class MapBuilder {
    private _loaderManager = new SmartLoaderModel('queries');

    private _viewContainerRef?: ViewContainerRef;
    private _containerSize: SizeInterface = {w: 0, h: 0};
    private _mapSize: SizeInterface = {w: 0, h: 0};
    private _currentScale: number = 1;
    private _scale: number = 1;
    private _scaleMin: number = 1;
    private _scaleMax: number = 1;
    private _range: CoordinateInterface = {x: 0, y: 0};
    private _rangeMin: CoordinateInterface = {x: 0, y: 0};
    private _rangeMax: CoordinateInterface = {x: 0, y: 0};
    private _currentMapPosition: CoordinateInterface = {x: 0, y: 0};
    private _mapPosition: CoordinateInterface = {x: 0, y: 0};
    private _traversableElements: Element[] = [];
    private _supervisors = new SmartMapModel<string, DeviceSupervisor>();
    private _hammerEnabled = true;
    private _isEditMode = false;
    private _isDragging = false;
    private _planElement?: HTMLImageElement;

    constructor(protected loggerService: LoggerService) {
    }

    private _isLandscape?: boolean;

    get isLandscape() {
        return this._isLandscape as boolean;
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
        this._containerSize = {w: 0, h: 0};
        this._mapSize = {w: 0, h: 0};
        this._currentScale = 1;
        this._scale = 1;
        this._scaleMin = 1;
        this._scaleMax = 1;
        this._range = {x: 0, y: 0};
        this._rangeMin = {x: 0, y: 0};
        this._rangeMax = {x: 0, y: 0};
        this._currentMapPosition = {x: 0, y: 0};
        this._mapPosition = {x: 0, y: 0};
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
        this.hammer.get('pinch').set({enable});
        this.hammer.get('pan').set({enable, direction: Hammer.DIRECTION_ALL});
    }

    changeOrientation() {
        const isLandscape = this.pageElement.offsetWidth > this.pageElement.offsetHeight;

        if (this._isLandscape !== undefined && this._isLandscape !== isLandscape) {
            this._supervisors
                .forEach((supervisor) => supervisor.changeOrientation(
                    this._mapSize,
                    isLandscape
                ));
        }
        this._isLandscape = isLandscape;
    }

    addLoader() {
        return this._loaderManager.addLoader();
    }

    build(devices: DeviceModel[]) {
        const subscribe = new Subscription();

        devices.forEach((device) => {
            if (!device.category || !device.type) {
                throw this.loggerService.error(new UnexpectedError("Device without category or type", device))
            }

            const componentConstructor = ComponentClassByType[device.category][device.type];
            if (!componentConstructor) {
                throw this.loggerService.error(new UnexpectedError("Unknown component constructor", device))
            }

            const componentRef = this.viewContainer.createComponent(componentConstructor);
            const componentInstance = componentRef.instance;

            componentInstance.setPosition(MathHelper.orientationConverterPointToMap(
                device.position,
                this._mapSize,
                componentInstance.size,
                this.isLandscape,
            ));

            componentInstance.name = device.name;
            componentInstance.actionInfoIds = device.infoCommandIds;
            componentInstance.actionCommandIds = device.actionCommandIds;
            componentInstance.configurationValues = device.configurationValues;
            componentInstance.setParameterValues(device.parameterValues.toRecord());

            subscribe.add(
                componentInstance.loaded.subscribe(() => {
                    const supervisor = new DeviceSupervisor(
                        componentRef,
                        TypeHelper.deepClone(device),
                        this._mapSize,
                        this.isLandscape
                    );

                    supervisor.moved$.subscribe(() => {
                        this._deviceMoved$.next(supervisor.device);
                    });

                    this._supervisors.set(device.id, supervisor);
                    this.checkDevicesStatus(devices.length);
                })
            );
        })

        this.checkDevicesStatus(devices.length);
    }

    getComponents(): BaseDeviceComponent[] {
        return this._supervisors.toArray().map((supervisor) => supervisor.getComponent());
    }

    switchEditMode(editMode: boolean) {
        this.enableHammer(!editMode)
        this._isEditMode = editMode;

        this._supervisors
            .forEach((supervisor) => supervisor.switchEditMode(
                editMode,
                this._scale
            ));
    }

    onResize() {
        this.updateSize();
        this.updateRange();
        this.updateCurrentPosition(this._mapPosition)
        this.updateMap(this._currentMapPosition.x, this._currentMapPosition.y, this._scale);
        this.changeOrientation();

        if (this._ready$.value && this._isEditMode) {
            this.switchEditMode(false);
        }
    }

    updateCurrentPosition(position: CoordinateInterface) {
        this._currentMapPosition.x = MathHelper.clamp(position.x, this._rangeMin.x, this._rangeMax.x);
        this._currentMapPosition.y = MathHelper.clamp(position.y, this._rangeMin.y, this._rangeMax.y);
    }

    setAllElements(viewContainerRef: ViewContainerRef | undefined, pageRef: ElementRef, mapRef: ElementRef) {
        this._viewContainerRef = viewContainerRef;

        this.setHtmlElements(pageRef, mapRef);
        this.checkPageStatus();
    }

    setHtmlElements(pageRef: ElementRef, mapRef: ElementRef) {
        this._pageElement = pageRef.nativeElement;
        this._mapElement = mapRef.nativeElement;
    }

    updateSize() {
        this._containerSize.w = this.pageElement.offsetWidth;
        this._containerSize.h = this.pageElement.offsetHeight;

        const minScale = Math.min(
            (this._containerSize.w * 100 / this._mapSize.w) / 100,
            (this._containerSize.h * 100 / this._mapSize.h) / 100
        );
        this._scale = this._currentScale = this._scaleMin = MathHelper.floor(minScale);
        this._scaleMax = this._scaleMin + 1;
    }

    updateRange() {
        this._range.x = Math.max(0, MathHelper.round(this._mapSize.w * this._currentScale) - this._containerSize.w);
        this._range.y = Math.max(0, MathHelper.round(this._mapSize.h * this._currentScale) - this._containerSize.h);

        this._rangeMax.x = MathHelper.round(this._range.x / 2);
        this._rangeMin.x = MathHelper.round(0 - this._rangeMax.x);

        this._rangeMax.y = MathHelper.round(this._range.y / 2);
        this._rangeMin.y = MathHelper.round(0 - this._rangeMax.y);
    }

    updateMap(x: number, y: number, scale: number) {
        this.mapElement.style.transform =
            'translateX(' + x + 'px) translateY(' + y + 'px) translateZ(0px) scale(' + scale + ',' + scale + ')';
    }

    initHammer() {
        console.log('init hammer')
        this._hammer = new Hammer(this.pageElement);
        this.hammer.get('pinch').set({enable: true});
        this.hammer.get('pan').set({enable: true, direction: Hammer.DIRECTION_ALL});

        this.hammer.on('pan', (event) => {
            this._isDragging = true;

            console.log('[pan]', event.deltaY, event.deltaY);

            this.updateCurrentPosition({
                x: MathHelper.round(this._mapPosition.x + event.deltaX),
                y: MathHelper.round(this._mapPosition.y + event.deltaY)
            });

            this.updateMap(this._currentMapPosition.x, this._currentMapPosition.y, this._scale);
        });

        this.hammer.on('pinch pinchmove', (event) => {
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
            console.log('[panend]');
            this.updateValues();

            setTimeout(() => {
                this._isDragging = false;
            }, 200)
        });
    }

    setPlan(planElement: HTMLImageElement, firstLoading: boolean) {
        this._planElement = planElement;
        this._mapSize.w = planElement.naturalWidth;
        this._mapSize.h = planElement.naturalHeight;

        if (firstLoading) {
            this.checkPageStatus();
        } else {
            this.onResize();
        }
    }

    private checkDevicesStatus(devicesCount: number) {
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

export const ComponentClassByType: Record<DeviceCategoryEnum, Partial<Record<DeviceTypeEnum, Type<BaseDeviceComponent>>>> = {
    [DeviceCategoryEnum.Thermostat]: {
        [DeviceTypeEnum.Aqara]: DeviceThermostatAqaraComponent,
        [DeviceTypeEnum.Moes]: DeviceThermostatMoesComponent,
    },
    [DeviceCategoryEnum.Thermometer]: {
        [DeviceTypeEnum.Aqara]: DeviceThermometerAqaraComponent,
    },
    [DeviceCategoryEnum.OnOff]: {
        [DeviceTypeEnum.Lidl]: DeviceOnOffLidlComponent,
        [DeviceTypeEnum.Moes]: DeviceOnOffMoesComponent,
    },
    [DeviceCategoryEnum.Multimedia]: {
        [DeviceTypeEnum.Chromecast]: DeviceChromecastComponent,
        [DeviceTypeEnum.Sonos]: DeviceSonosComponent,
    }
}
