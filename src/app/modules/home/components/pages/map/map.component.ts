import { DeviceModel } from '@models';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { DeviceService } from '@services';
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
  switchEditModeFormControl = new FormControl<boolean>(false);
  pollingDelay = 5000;

  constructor(
    private mapBuilder: MapBuilder,
    private deviceService: DeviceService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    super();
    this.mapBuilder.reset();

    this.sub = this.mapBuilder.ready$.pipe(filter((ready) => ready))
      .subscribe(() => {
        // console.log('-- Builder Ready');
        this.loadDevices();
      });

    this.sub = this.mapBuilder.loaded$.subscribe(() => {
      //console.log('-- Map loaded');

      this.mapLoading = false;
      const components = this.mapBuilder.getComponents();

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
        const loader = this.mapBuilder.addLoader();
        this.deviceService.updateComponents(components).then(_ => {
          loader.finish();
          timer$.next();
        });
      });
    })

    this.sub = this.mapBuilder.deviceMoved$.subscribe((device) => {
      //console.log('-- Device moved', device);
      const loader = this.mapBuilder.addLoader();
      this.deviceService.update(device).then(() => {
        loader.finish();
      })
    })

    this.sub = this.mapBuilder.globalLoader.subscribe((globalLoader) => {
      this.apiLoading = globalLoader;
    })

    this.sub = this.mapBuilder.allLoaders.subscribe(_ => {
    });
  }

  @HostListener('window:resize', [ '$event' ])
  onResize() {
    this.mapBuilder.onResize();
  }

  ngOnInit() {
    this.sub = this.switchEditModeFormControl.valueChanges.subscribe((switchEditMode) => {
      // @TODO Trouver comment afficher le nom des devices en tooltip sur le EditMode = true
      this.mapBuilder.switchEditMode(!!switchEditMode);
    })
  }

  async ngAfterViewInit(): Promise<void> {
    this.mapBuilder.setElements(this.viewContainerRef, this.pageRef as ElementRef, this.mapRef as ElementRef);

    if (this.planRef) {
      this.planRef.nativeElement.onload = (onLoadResult: Event) => {
        this.mapBuilder.setPlan(onLoadResult.target as HTMLImageElement);
      };
      this.planRef.nativeElement.src = '/assets/images/plan.svg';
    }
  }

  loadDevices() {
    this.deviceService.getListOrRefresh().then(devices => {
      this.devices = devices
      this.mapBuilder.build(devices);
      this.changeDetectorRef.detectChanges();
    });
  }
}
