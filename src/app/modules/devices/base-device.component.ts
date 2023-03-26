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
export abstract class BaseDeviceComponent extends BaseComponent implements OnInit, AfterViewInit, AfterContentInit, OnDestroy {
  @HostBinding('class.draggable') draggable: boolean = false;
  @HostBinding('style.left') x = '0px';
  @HostBinding('style.top') y = '0px';
  @Input() name: string = '';
  @Input() actionInfoIds = new SmartArrayModel<string, number>();
  @Input() actionCommandIds = new SmartArrayModel<string, number>();
  @Output() loaded = new EventEmitter<boolean>();
  infoCommandValues: Record<string, unknown> = {};
  modalOpened: boolean = false;

  public constructor(
    private mapBuilder: MapBuilder,
    private deviceService: DeviceService
  ) {
    super();
  }

  static get infoCommandFilters(): Record<string, Record<string, string>> {
    return {};
  }

  static get actionCommandFilters(): Record<string, Record<string, string>> {
    return {};
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

    this.infoCommandValues = this.actionInfoIds.reduce((result, current) => {
      result[current.key] = values[current.value]
        ? values[current.value].value
        : this.infoCommandValues[current.key];
      return result;
    }, {} as Record<string, unknown>);

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
}
