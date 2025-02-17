import {ChangeDetectionStrategy, Component, OnDestroy} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {filter, first, map, Subject} from "rxjs";
import {Title} from "@angular/platform-browser";
import {AppService, DeviceService, LoggerService, MapBuilder, UserService} from "@services";
import {MenuItem} from "primeng/api";
import {DataModelMenuItems, LogoutMenuItem, MenuItems} from "./menuItems.data";
import {default as NoSleep} from "nosleep.js";
import {NoSleepError} from "@errors";
import BaseComponent from "@base-component";
import {toSignal} from "@angular/core/rxjs-interop";
import {DataStoreStateService} from '@alkemist/ngx-data-store';


@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent extends BaseComponent implements OnDestroy {
  logged = this.userService.loggedUser;
  title;
  menuItems: MenuItem[] = [...MenuItems];
  services: Record<string, any> = {};
  noSleep = new NoSleep();
  appIsVisible$ = new Subject<boolean>();

  constructor(
    titleService: Title,
    private router: Router,
    private route: ActivatedRoute,
    private appService: AppService,
    private userService: UserService,
    private deviceService: DeviceService,
    private loggerService: LoggerService,
    private mapBuilder: MapBuilder,
  ) {
    super();

    this.services["device"] = this.deviceService;
    void this.userService.getLoggedUser();

    this.title = toSignal(router.events.pipe(
      //filter(event => event instanceof NavigationEnd)
      map(_ => appService.getTitle().replaceAll("-", "/"))
    ));

    const enableNoSleep = () => {
      document.removeEventListener('click', enableNoSleep, false);
      this.appIsVisible$.next(document.visibilityState === "visible");
    }
    document.addEventListener('click', enableNoSleep, false);

    document.addEventListener("visibilitychange", _ => {
      //console.log('-- Visbility change', document.visibilityState)
      this.appIsVisible$.next(document.visibilityState === "visible");
    });

    this.mapBuilder.loaded$.subscribe((ready) => {
      if (ready && !this.noSleep.isEnabled) {
        //console.log('-- Wake lock activation')
        /*if (document.visibilityState === "visible") {
          //console.log('-- App is visible, we active wake lock')
          void this.noSleep.enable().catch((e) => {
            this.loggerService.error(new NoSleepError(e));
          });
        } else {*/
        //console.log('-- App hidded, wait for visible')
        this.appIsVisible$.asObservable().pipe(
          filter(isVisible => isVisible),
          first()
        ).subscribe(() => {
          console.log('-- App visible again, we active wake lock')
          void this.noSleep.enable().catch((e) => {
            this.loggerService.error(new NoSleepError(e));
          });
        });
        //}
      } else if (!ready && this.noSleep.isEnabled) {
        this.noSleep.disable();
      }
    });

    DataModelMenuItems.forEach((menuItem) => {
      this.menuItems.push({
        ...menuItem, items: [
          {
            label: $localize`List`,
            icon: "pi pi-list",
            routerLink: menuItem.listRouterLink,
          },
          {
            label: $localize`Add`,
            icon: "pi pi-plus",
            routerLink: menuItem.addRouterLink,
          },
          {
            label: $localize`Invalid store`,
            icon: "pi pi-refresh",
            command: () => {
              void (this.services[menuItem.service] as DataStoreStateService<any>).dispatchUserItemsFill();
            }
          }
        ],
      });
    });

    this.menuItems.push(
      {
        label: $localize`Scenarios`,
        icon: "pi pi-ticket",
        routerLink: '/home/scenarios',
      },
      {
        label: $localize`Variables`,
        icon: 'pi pi-box',
        routerLink: '/home/variables',
      }
    );

    this.menuItems.push({
      separator: true
    });

    this.menuItems.push({
      ...LogoutMenuItem, command: () => {
        void this.userService.logout();
      }
    });
  }
}
