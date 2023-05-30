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
} from "@angular/core";
import {CoordinateInterface, JeedomCommandResultInterface, SizeInterface, SmartArrayModel} from "@models";
import {DeviceService, MapBuilder} from "@services";
import {OverlayPanel} from "primeng/overlaypanel";
import {UndefinedVarError} from "@errors";
import {MessageService} from "primeng/api";
import BaseComponent from "@base-component";
import {CompareUtils} from "json-compare-engine/src/compare-utils";

@Directive()
export default abstract class BaseDeviceComponent<
  IE extends string = string, AE extends string = string,
  IV extends Record<IE, string | number | boolean | null> = Record<IE, string | number | boolean | null>,
  I extends string = IE, A extends string = AE, C extends string = string,
  P extends string = string,
  PV extends Record<P, string | number | boolean | null> = Record<P, string | number | boolean | null>,
> extends BaseComponent implements OnInit, AfterViewInit, AfterContentInit, OnDestroy {
  abstract size: SizeInterface;

  @HostBinding("class.draggable") draggable: boolean = false;
  @HostBinding("style.left") x = "0px";
  @HostBinding("style.top") y = "0px";
  @Input() name: string = "";
  @Input() actionInfoIds = new SmartArrayModel<IE, number>();
  @Input() actionCommandIds = new SmartArrayModel<A, number>();
  @Input() configurationValues = new SmartArrayModel<C, string>();
  @Output() loaded = new EventEmitter<boolean>();
  modalOpened: boolean = false;
  initialized: boolean = false;
  protected infoCommandValues: IV = {} as IV;
  protected parameterValues: PV = {} as PV;

  public constructor(
    private mapBuilder: MapBuilder,
    private deviceService: DeviceService,
    protected messageService: MessageService,
  ) {
    super();
  }

  @ViewChild("overlayPanel") _overlayPanel?: OverlayPanel;

  get overlayPanel() {
    if (!this._overlayPanel) {
      throw new UndefinedVarError("overlayPanel");
    }

    return this._overlayPanel;
  }

  @HostBinding("style.width") get w() {
    return this.size.w + "px";
  };

  @HostBinding("style.height") get h() {
    return this.size.h + "px";
  };

  @HostBinding("class.editMode") get isEditMode() {
    return this.mapBuilder.isEditMode();
  };

  get isDragging() {
    return this.mapBuilder.isDraggging();
  }

  setParameterValues(values: Record<P, string | undefined>): void {
    this.parameterValues = values as PV;
  }

  ngOnInit() {
  }

  ngAfterContentInit() {
  }

  ngAfterViewInit() {
    this.loaded.emit(true);
  }

  isUserAction() {
    return !this.mapBuilder.isEditMode() && !this.mapBuilder.isDraggging();
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
    this.x = position.x + "px";
    this.y = position.y + "px";
  }

  updateGlobalInfoCommandValues(values: Record<number, JeedomCommandResultInterface>) {
    if (!this.initialized) {
      this.initialized = true;
    }

    //console.log(`-- [${ this.name }] Update info command values`, values);

    const infoCommandValues: Record<IE, string | number | boolean | null> = this.actionInfoIds.reduce((result, current) => {
      result[current.key as IE] = (values[current.value]
        ? values[current.value].value
        : this.infoCommandValues[current.key] ?? null);
      return result;
    }, {} as Record<IE, string | number | boolean | null>);

    //console.log(`-- [${ this.name }] Updated info command values`, this.infoCommandValues);

    this.infoCommandValues = CompareUtils.deepClone(infoCommandValues as IV);
    this.updateInfoCommandValues(infoCommandValues);
  }

  abstract updateInfoCommandValues(values: Record<IE, string | number | boolean | null>): void

  protected execUpdateSlider(commandAction: A, commandValue: number) {
    return this.execUpdateValue(
      commandAction,
      {slider: commandValue}
    );
  }

  protected execUpdateValue(commandAction: A, commandValue?: any) {
    return this.execCommand(
      this.actionCommandIds.get(commandAction),
      commandAction,
      commandValue
    );
  }

  protected execCommand(commandId: number, commandName: string, commandValue?: unknown) {
    return new Promise<any>((resolve, reject) => {
      const loader = this.mapBuilder.addLoader();
      console.log(`-- [${this.name}][${commandName}] Exec action`, commandValue ? "with" : "", commandValue ?? "");

      this.deviceService.execCommand(commandId, commandName, commandValue).then((value) => {
        console.log(`-- [${this.name}][${commandName}] Exec action result`, value);

        loader.finish();
        this.mapBuilder.addUpdate();
        resolve(commandValue);
      }).catch((e) => {
        console.log(`-- [${this.name}][${commandName}] Exec action error`, e);
        reject(e);
      });
    });
  }
}
