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
import { UndefinedVarError } from '../../errors/undefined-var.error';

@Directive()
export abstract class BaseDeviceComponent<
  IE extends string = string, AE extends string = string,
  I extends string = IE, A extends string = AE,
  P extends string = string
> extends BaseComponent implements OnInit, AfterViewInit, AfterContentInit, OnDestroy {

  @HostBinding('class.draggable') draggable: boolean = false;
  @HostBinding('style.left') x = '0px';
  @HostBinding('style.top') y = '0px';
  @Input() name: string = '';
  @Input() actionInfoIds = new SmartArrayModel<IE, number>();
  @Input() actionCommandIds = new SmartArrayModel<A, number>();
  @Output() loaded = new EventEmitter<boolean>();
  modalOpened: boolean = false;
  @Input() paramValues: Partial<Record<P, string | number | boolean | null>> = {};
  protected infoCommandValues: Partial<Record<IE, string | number | boolean | null>> = {};

  public constructor(
    private mapBuilder: MapBuilder,
    private deviceService: DeviceService
  ) {
    super();
  }

  @ViewChild("overlayPanel") _overlayPanel?: OverlayPanel;

  get overlayPanel() {
    if (!this._overlayPanel) {
      throw new UndefinedVarError('overlayPanel');
    }

    return this._overlayPanel;
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

    const infoCommandValues: Partial<Record<IE, string | number | boolean | null>> = {};
    this.infoCommandValues = this.actionInfoIds.reduce((result, current) => {
      result[current.key] = values[current.value]
        ? values[current.value].value
        : this.infoCommandValues[current.key] ?? null;
      return result;
    }, infoCommandValues);

    // console.log(`-- [${ this.name }] Updated info command values`, this.infoCommandValues);
  }

  protected execUpdateValue(commandAction: A, commandValue?: any) {
    return this.execCommand(
      this.actionCommandIds.get(commandAction),
      commandAction,
      commandValue
    );
  }

  protected execUpdateSlider(commandAction: A, commandValue: number) {
    return this.execUpdateValue(
      commandAction,
      { slider: commandValue }
    );
  }

  private execCommand(commandId: number, commandName: string, commandValue?: unknown) {
    return new Promise<any>(resolve => {
      const loader = this.mapBuilder.addLoader();
      // console.log(`-- [${ this.name }][${ commandName }] Exec action`, commandValue);
      this.deviceService.execCommand(commandId, commandName, commandValue).then((value) => {
        console.log(`-- [${ this.name }][${ commandName }] Exec action result`, value);
        loader.finish();
        resolve(commandValue);
      });
    })
  }
}
