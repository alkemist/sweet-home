import { DeviceModel } from '@models';
import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { AppService, DeviceService } from '@services';
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

  constructor(
    private appService: AppService,
    private deviceService: DeviceService
  ) {
    super();

    this.sub = this.builder.ready$.pipe(filter((ready) => ready))
      .subscribe(() => {
        //console.log('-- Builder Ready');
        this.loadDevices();
      });
    this.sub = this.builder.deviceMoved$.subscribe((device) => {
      //console.log('-- Device moved', device);
      this.appService.beginLoading();
      this.deviceService.update(device).then(() => {
        this.appService.endLoading();
      })
    })
  }

  @HostListener('window:resize', [ '$event' ])
  onResize() {
    this.builder.onResize();
  }

  override ngOnInit() {
    this.appService.beginLoading();

    this.sub = this.switchEditModeFormControl.valueChanges.subscribe((switchEditMode) => {
      this.builder.switchEditMode(!!switchEditMode);
    })
  }

  async ngAfterViewInit(): Promise<void> {
    this.builder.setViewContainer(this.viewContainerRef);

    this.builder.setElements(this.pageRef as ElementRef, this.mapRef as ElementRef);
    if (this.planRef) {
      this.planRef.nativeElement.onload = (onLoadResult: Event) => {
        this.builder.setPlan(onLoadResult.target as HTMLImageElement);
      };
      this.planRef.nativeElement.src = '/assets/images/plan.svg';
    }
  }

  loadDevices() {
    this.deviceService.getListOrRefresh().then(devices => {
      this.devices = devices
      this.loading = false;

      this.builder.build(devices);
      this.appService.endLoading();

      // @TODO Remplacer par la mise en place du polling
      this.appService.beginLoading();
      const components = this.builder.getComponents();
      this.deviceService.updateComponents(components).then(() => {
        this.appService.endLoading();
      })
    });
  }
}
