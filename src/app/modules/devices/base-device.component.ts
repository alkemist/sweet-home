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
  signal,
  ViewChild,
  WritableSignal
} from "@angular/core";
import { CoordinateInterface, JeedomCommandResultInterface, SizeInterface, SmartArrayModel } from "@models";
import { DeviceService, MapBuilder } from "@services";
import { OverlayPanel } from "primeng/overlaypanel";
import { UndefinedVarError } from "@errors";
import { MessageService } from "primeng/api";
import BaseComponent from "@base-component";

@Directive()
export default abstract class BaseDeviceComponent<
  IE extends string = string, AE extends string = string,
  I extends string = IE, A extends string = AE, C extends string = string,
  IV extends Record<I, string | number | boolean | null> = Record<I, string | number | boolean | null>,
  P extends string = string,
  PV extends Record<P, string | number | boolean | null> = Record<P, string | number | boolean | null>,
> extends BaseComponent implements OnInit, AfterViewInit, AfterContentInit, OnDestroy {
  abstract size: SizeInterface;

  @HostBinding("class.draggable") draggable: boolean = false;
  @HostBinding("style.left") x = "0px";
  @HostBinding("style.top") y = "0px";
  @Input() name: string = "";
  @Input() actionInfoIds = new SmartArrayModel<I, number>();
  @Input() actionCommandIds = new SmartArrayModel<A, number>();
  @Input() configurationValues = new SmartArrayModel<C, string>();
  @Output() loaded = new EventEmitter<boolean>();
  modalOpened: boolean = false;
  initialized$ = signal<boolean>(false);
  protected infoCommandValues: WritableSignal<IV> = signal<IV>({} as IV);
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

  get isConfigMode() {
    return this.mapBuilder.isConfigMode();
  };

  get isDragging() {
    return this.mapBuilder.isDraggging();
  }

  get infoCommandSignalValues(): IV {
    return this.infoCommandValues();
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
    //console.log(`-- [${this.name}] -- Set device position`, position);
    this.x = position.x + "px";
    this.y = position.y + "px";
  }

  updateGlobalInfoCommandValues(values: Record<number, JeedomCommandResultInterface>) {
    if (!this.initialized$()) {
      this.initialized$.set(true);
    }
    //console.log(`-- [${this.name}] Update info command values`, values, this.initialized);
    const currentInfoCommandValues = this.infoCommandValues();

    const infoCommandValues: Record<I, string | number | boolean | null> = this.actionInfoIds.reduce((result, current) => {
      result[current.key as I] = (values[current.value]
        ? values[current.value].value
        : currentInfoCommandValues[current.key] ?? null);
      return result;
    }, {} as Record<I, string | number | boolean | null>);

    //console.log(`-- [${ this.name }] Updated info command values`, this.infoCommandValues());

    this.infoCommandValues.set(infoCommandValues as IV);
    this.updateInfoCommandValues(infoCommandValues as IV);
  }

  abstract updateInfoCommandValues(values: IV): void

  protected execUpdateSlider(commandAction: A, commandValue: number) {
    return this.execUpdateValue(
      commandAction,
      { slider: commandValue }
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
      //console.log(`-- [${this.name}][${commandName}] Exec action`, commandValue ? "with" : "", commandValue ?? "");

      this.deviceService.execCommand(commandId, commandName, commandValue).then((_) => {
        //console.log(`-- [${this.name}][${commandName}] Exec action result`, value);

        loader.finish();
        this.mapBuilder.addUpdate();
        resolve(commandValue);
      }).catch((e) => {
        console.log(`-- [${ this.name }][${ commandName }] Exec action error`, e);
        reject(e);
      });
    });
  }

  protected updateInfoCommandValue(key: I, value: any) {
    this.infoCommandValues.set({
      ...this.infoCommandValues(),
      [key]: value,
    })
  }

  protected patchInfoCommandValues(values: Partial<IV>) {
    this.infoCommandValues.set(
      {
        ...this.infoCommandSignalValues,
        ...values
      }
    )
  }

  protected async execHistory(commandInfo: I, dateStart: string, dateEnd: string) {
    return this.deviceService.execHistory(this.actionInfoIds.get(commandInfo), commandInfo, dateStart, dateEnd);
  }
}
