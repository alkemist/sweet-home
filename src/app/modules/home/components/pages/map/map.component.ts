import { DeviceModel } from '@models';
import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { DeviceService } from '@services';
import { MapBuilder } from '@tools';
import { BaseComponent } from '../../../../../components/base.component';
import { filter } from 'rxjs';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: [ './map.component.scss' ],
  host: {
    class: 'page-container'
  }
})
export class MapComponent extends BaseComponent implements OnInit, AfterViewInit {
  @ViewChild("container", { read: ViewContainerRef, static: true }) viewContainerRef?: ViewContainerRef;
  @ViewChild("page") pageRef?: ElementRef;
  @ViewChild("map") mapRef?: ElementRef;
  @ViewChild("plan") planRef?: ElementRef;
  devices: DeviceModel[] = [];
  loading = true;
  builder: MapBuilder = new MapBuilder();
  switchEditModeFormControl = new FormControl<boolean>(false);

  constructor(private deviceService: DeviceService) {
    super();

    this.builder.ready$.pipe(filter((ready) => ready))
      .subscribe(() => {
        console.log('-- Builder Ready');

        this.loadDevices();
      })
  }

  @HostListener('window:resize', [ '$event' ])
  onResize() {
    this.builder.onResize();
  }

  override ngOnInit() {
    this.sub = this.switchEditModeFormControl.valueChanges.subscribe((switchEditMode) => {
      this.builder.switchEditMode(!!switchEditMode);
    })
  }

  async ngAfterViewInit(): Promise<void> {
    this.builder.setViewContainer(this.viewContainerRef);
    this.builder.setElements(this.pageRef as ElementRef, this.mapRef as ElementRef, this.planRef as ElementRef);
  }

  loadDevices() {
    this.deviceService.getListOrRefresh().then(devices => {
      this.devices = devices
      this.loading = false;

      this.builder.build(devices);
    });
  }
}
