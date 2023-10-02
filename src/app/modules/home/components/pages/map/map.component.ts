import {DeviceModel, SmartLoaderModel} from "@models";
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostListener,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewContainerRef
} from "@angular/core";
import {DeviceService, MapBuilder, SonosService, SpotifyService} from "@services";
import {BehaviorSubject, filter} from "rxjs";
import {FormControl} from "@angular/forms";
import {Router} from "@angular/router";
import BaseComponent from "@base-component";

@Component({
    selector: "app-map",
    templateUrl: "./map.component.html",
    styleUrls: ["./map.component.scss"],
    host: {
        class: "page-container"
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild("container", {read: ViewContainerRef, static: true}) viewContainerRef?: ViewContainerRef;
    @ViewChild("page") pageRef?: ElementRef;
    @ViewChild("map") mapRef?: ElementRef;
    @ViewChild("plan") planRef?: ElementRef;
    devices: DeviceModel[] = [];
    mapLoading = true;
    planLoading = false;
    apiLoading = false;
    switchEditModeFormControl = new FormControl<boolean>(false);
    pollingDelay = 5000;
    isLandscape?: boolean;
    private pollingLoader = new SmartLoaderModel("polling");

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
                this.loadDevices();
            });

        this.sub = this.mapBuilder.loaded$.pipe(filter((loaded) => loaded)).subscribe(() => {
            this.mapLoading = false;
            const components = this.mapBuilder.getComponents();

            // Polling when data is resolved
            const nextCall$ = new BehaviorSubject<boolean>(true);

            this.sub = this.mapBuilder.globalLoader$.subscribe((globalLoader) => {
                this.apiLoading = globalLoader;
            });

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
                });
            // On a besoin de s'inscrire à l'évènement pour qu'il puisse fonctionner
            this.sub = this.pollingLoader.allLoaders$.subscribe(_ => _);

            this.sub = nextCall$
                .subscribe(async () => {
                    const callLoader = this.mapBuilder.addLoader();
                    this.deviceService.updateComponents(components).then(() => {
                        callLoader.finish();
                        this.pollingLoader.addLoader(this.pollingDelay);
                    });
                });
        });

        this.sub = this.mapBuilder.deviceMoved$.subscribe((_) => {
            this.changeDetectorRef.detectChanges();
        });

        this.sub = this.mapBuilder.deviceMoveFinished$.subscribe((device) => {
            //console.log('-- Device moved', device);
            const loader = this.mapBuilder.addLoader();
            this.deviceService.update(device).then(() => {
                loader.finish();
            });
        });

        this.sub = this.mapBuilder.deviceUpdated$.subscribe(_ => {
            //console.log('-- Device updated');
            this.pollingLoader.addLoader(this.pollingDelay);
        });

        //void this.spotifyService.test();
        //void this.sonosService.test1();
        //void this.sonosService.test2();
    }

    @HostListener("window:resize", ["$event"])
    onResize() {
        this.loadPlan();
        this.switchEditModeFormControl.setValue(false, {emitEvent: false});
    }

    ngOnInit() {
        this.sub = this.switchEditModeFormControl.valueChanges.subscribe((switchEditMode) => {
            this.mapBuilder.switchEditMode(!!switchEditMode);
        });
    }

    async ngAfterViewInit(): Promise<void> {
        this.mapBuilder.setAllElements(this.viewContainerRef, this.pageRef as ElementRef, this.mapRef as ElementRef);

        if (this.planRef) {
            this.planRef.nativeElement.onload = (onLoadResult: Event) => {
                this.planLoading = false;
                /*console.log('-- Image loaded',
                    this.planRef?.nativeElement.naturalWidth,
                    (onLoadResult.target as HTMLImageElement)?.naturalWidth
                );*/
                this.mapBuilder.setPlan(onLoadResult.target as HTMLImageElement, this.mapLoading);
            };
            this.loadPlan();
        }
    }

    loadPlan() {
        const isLandscape = this.pageRef?.nativeElement.offsetWidth > this.pageRef?.nativeElement.offsetHeight;

        if (this.planRef && isLandscape !== this.isLandscape) {
            this.isLandscape = this.mapBuilder.isLandscape;

            this.planLoading = true;
            this.planRef.nativeElement.src = `/assets/images/${isLandscape ? "plan-landscape.svg" : "plan.svg"}`;
            this.isLandscape = isLandscape;
            this.changeDetectorRef.detectChanges();
        } else if (!this.planLoading) {
            this.mapBuilder.onResize();
        }
    }

    override ngOnDestroy() {
        super.ngOnDestroy();

        this.mapBuilder.reset();
    }

    loadDevices() {
        this.deviceService.getListOrRefresh().then(devices => {
            this.devices = devices;
            this.mapBuilder.build(devices);
            this.changeDetectorRef.detectChanges();
        });
    }
}
