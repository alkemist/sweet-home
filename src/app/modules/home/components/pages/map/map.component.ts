import { DeviceModel } from '@models';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { AppService, DeviceService } from '@services';
import { MapBuilder } from '@tools';
import { BaseComponent } from '../../../../../components/base.component';
import { BehaviorSubject, delay, filter, Subject } from 'rxjs';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: [ './map.component.scss' ],
  host: {
    class: 'page-container'
  }
})
export class MapComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("container", { read: ViewContainerRef, static: true }) viewContainerRef?: ViewContainerRef;
  @ViewChild("page") pageRef?: ElementRef;
  @ViewChild("map") mapRef?: ElementRef;
  @ViewChild("plan") planRef?: ElementRef;
  devices: DeviceModel[] = [];
  mapLoading = true;
  apiLoading = false;
  builder: MapBuilder = new MapBuilder();
  switchEditModeFormControl = new FormControl<boolean>(false);
  pollingDelay = 5000;

  constructor(
    private appService: AppService,
    private deviceService: DeviceService,
  ) {
    super();

    this.sub = this.builder.ready$.pipe(filter((ready) => ready))
      .subscribe(() => {
        //console.log('-- Builder Ready');
        this.loadDevices();
      });

    this.sub = this.builder.deviceMoved$.subscribe((device) => {
      //console.log('-- Device moved', device);
      const loader = this.appService.addLoader();
      this.deviceService.update(device).then(() => {
        loader.finish();
      })
    })

    this.sub = this.appService.globalLoader.subscribe((globalLoader) => {
      this.apiLoading = globalLoader;
    })
    this.sub = this.appService.allLoaders.subscribe(_ => {
    });
  }

  @HostListener('window:resize', [ '$event' ])
  onResize() {
    this.builder.onResize();
  }

  ngOnInit() {
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
      this.mapLoading = false;
      this.builder.build(devices);

      const components = this.builder.getComponents();

      // Polling when data is resolved
      const nextCall$ = new BehaviorSubject<boolean>(true);
      const timer$ = new Subject<void>();

      this.sub = timer$
        .pipe(
          delay(this.pollingDelay)
        ).subscribe(() => {
          // console.log('-- Ready for a new call');
          nextCall$.next(true);
        });

      this.sub = nextCall$.subscribe(() => {
        const loader = this.appService.addLoader();
        this.deviceService.updateComponents(components).then(_ => {
          loader.finish();
          timer$.next();
        });
      });
    });
  }
}
