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
import { BehaviorSubject, filter } from 'rxjs';
import { FormControl } from '@angular/forms';
import { SmartLoaderModel } from '../../../../../models/smart-loader.model';
import { SpotifyService } from '../../../../../services/spotify.service';
import { Router } from '@angular/router';
import { SonosService } from '../../../../../services/sonos.service';

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
  private pollingLoader = new SmartLoaderModel('polling');

  constructor(
    private router: Router,
    private mapBuilder: MapBuilder,
    private deviceService: DeviceService,
    private spotifyService: SpotifyService,
    private sonosService: SonosService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    super();
    this.mapBuilder.reset();

    this.sub = this.mapBuilder.ready$.pipe(filter((ready) => ready))
      .subscribe(() => {
        // console.log('-- Builder Ready');
        this.loadDevices();
      });

    this.sub = this.mapBuilder.loaded$.pipe(filter((loaded) => loaded)).subscribe(() => {
      // console.log('-- Map loaded');

      this.mapLoading = false;
      const components = this.mapBuilder.getComponents();

      // Polling when data is resolved
      const nextCall$ = new BehaviorSubject<boolean>(true);

      this.sub = this.mapBuilder.globalLoader$.subscribe((globalLoader) => {
        this.apiLoading = globalLoader;
      })
      // On a besoin de s'inscrire à l'évènement pour qu'il puisse fonctionner
      this.sub = this.mapBuilder.allLoaders$.subscribe(_ => _);

      this.sub = this.pollingLoader.globalLoader$
        .pipe(
          // On attend que tous les loaders ont terminés
          filter((next) => !next),
        )
        .subscribe(_ => {
          //console.log('-- Ready for a new call');
          nextCall$.next(true);
        })
      // On a besoin de s'inscrire à l'évènement pour qu'il puisse fonctionner
      this.sub = this.pollingLoader.allLoaders$.subscribe(_ => _);

      this.sub = nextCall$
        .subscribe(async () => {
          const callLoader = this.mapBuilder.addLoader();
          this.deviceService.updateComponents(components).then(() => {
            callLoader.finish();
            // console.log('-- Call received and wait');
            //this.timer$.next();
            this.pollingLoader.addLoader(this.pollingDelay);
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

    this.sub = this.mapBuilder.deviceUpdated$.subscribe(_ => {
      console.log('-- Device updated');
      this.pollingLoader.addLoader(this.pollingDelay);
    })

    /*this.spotifyService.buildGetQuery(`users/${ process.env['SPOTIFY_USER_ID'] }/playlists`)
      .then((result) => console.log('result spotify', result))

    this.sonosService.buildGetQuery('households')
      .then((result) => console.log('result sonos', result));*/

  }

  @HostListener('window:resize', [ '$event' ])
  onResize() {
    this.mapBuilder.onResize();
  }

  ngOnInit() {
    this.sub = this.switchEditModeFormControl.valueChanges.subscribe((switchEditMode) => {
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

  override ngOnDestroy() {
    super.ngOnDestroy();

    this.mapBuilder.reset();
  }

  loadDevices() {
    this.deviceService.getListOrRefresh().then(devices => {
      this.devices = devices
      this.mapBuilder.build(devices);
      this.changeDetectorRef.detectChanges();
    });
  }
}
