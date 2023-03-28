import {
  AfterContentInit,
  AfterViewInit,
  Directive,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { CoordinateInterface, JeedomCommandResultInterface, SmartArrayModel } from '@models';
import { BaseComponent } from '../../components/base.component';
import { DeviceService } from '@services';
import { MapBuilder } from '@tools';
import { OverlayPanel } from 'primeng/overlaypanel';

@Directive()
export abstract class BaseDeviceComponent<I extends string, A extends string, P extends string> extends BaseComponent implements OnInit, AfterViewInit, AfterContentInit, OnDestroy {
  @HostBinding('class.draggable') draggable: boolean = false;
  @HostBinding('style.left') x = '0px';
  @HostBinding('style.top') y = '0px';
  @Input() name: string = '';
  @Input() actionInfoIds = new SmartArrayModel<I, number>();
  @Input() actionCommandIds = new SmartArrayModel<A, number>();
  @Output() loaded = new EventEmitter<boolean>();
  modalOpened: boolean = false;

  public constructor(
    private mapBuilder: MapBuilder,
    private deviceService: DeviceService
  ) {
    super();
  }

  @Input() _paramValues?: Record<P, number | string | null>;

  static get paramValues(): string[] {
    return [];
  }

  static get infoCommandFilters(): Record<string, Record<string, string>> {
    return {};
  }

  static get actionCommandFilters(): Record<string, Record<string, string>> {
    return {};
  }

  protected _infoCommandValues?: Record<I, number | string | null>;

  get infoCommandValues() {
    return this._infoCommandValues as Record<I, number | string | null>;
  }

  get paramValues() {
    return this._paramValues as Record<P, number | string | null>;
  }

  @ViewChild("overlayPanel") _overlayPanel?: OverlayPanel;

  get overlayPanel() {
    return this._overlayPanel as OverlayPanel;
  }

  @HostBinding('class.editMode') get isEditMode() {
    return this.mapBuilder.isEditMode();
  };

  get isDragging() {
    return this.mapBuilder.isDraggging();
  }

  ngOnInit() {
  }

  ngAfterContentInit() {
  }

  ngAfterViewInit() {
    this.loaded.emit(true);
  }

  isUserAction() {
    return !this.mapBuilder.isEditMode() && !this.mapBuilder.isDraggging()
  }

  openModal() {
    if (!this.isUserAction()) {
      return;
    }
    this.modalOpened = true;
  }

  closeModal() {
    this.modalOpened = false;
  }

  setPosition(position: CoordinateInterface) {
    // console.log(`-- [${this.name}] -- Set device position`, position);
    this.x = position.x + 'px';
    this.y = position.y + 'px';
  }

  updateInfoCommandValues(values: Record<number, JeedomCommandResultInterface>) {
    //console.log(`-- [${ this.name }] Update info command values`, values);

    this._infoCommandValues = this.actionInfoIds.reduce((result, current) => {
      result[current.key] = values[current.value]
        ? values[current.value].value
        : this.infoCommandValues[current.key];
      return result;
    }, {} as Record<I, number | string | null>);

    // console.log(`-- [${ this.name }] Updated info command values`, this.infoCommandValues);
  }

  execCommand(commandId: number, commandName: string, commandValue?: unknown) {
    return new Promise<any>(resolve => {
      const loader = this.mapBuilder.addLoader();
      this.deviceService.execAction(commandId, commandName, commandValue).then((value) => {
        console.log(`-- [${ this.name }] Exec action result`, value);
        loader.finish();
        resolve(commandValue);
      });
    })
  }

  protected execUpdateSlider(commandAction: A, commandValue: number) {
    return this.execCommand(
      this.actionCommandIds.get(commandAction),
      commandAction,
      { slider: commandValue }
    );
  }

  protected execUpdateValue(commandAction: A, commandValue: any) {
    return this.execCommand(
      this.actionCommandIds.get(commandAction),
      commandAction,
      commandValue
    );
  }

  protected execUpdate(commandAction: A) {
    return this.execCommand(
      this.actionCommandIds.get(commandAction),
      commandAction
    );
  }
}
