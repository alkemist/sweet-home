import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RoutesRecognized } from '@angular/router';
import { map, Observable } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { AppService, DeviceService, UserService } from '@services';
import { MenuItem } from 'primeng/api';
import { DataModelMenuItems, LogoutMenuItem, MenuItems } from './menuItems.data';
import { BaseComponent } from '../../base.component';
import { default as NoSleep } from 'nosleep.js';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: [ './header.component.scss' ]
})
export class HeaderComponent extends BaseComponent implements OnDestroy {
  loading = true;
  logged = false;
  title$: Observable<string>;
  menuItems: MenuItem[] = MenuItems;
  services: Record<string, any> = {}
  noSleep = new NoSleep();

  constructor(
    titleService: Title,
    private router: Router,
    private route: ActivatedRoute,
    private appService: AppService,
    private userService: UserService,
    private deviceService: DeviceService,
  ) {
    super();

    this.services['device'] = this.deviceService;

    this.title$ = router.events.pipe(
      //filter(event => event instanceof NavigationEnd)
      map(_ => titleService.getTitle().replaceAll('-', '/'))
    );

    this.sub = this.router.events.subscribe((route: any) => {
      if (route instanceof RoutesRecognized) {
        let routeData = route.state.root.firstChild?.data as Record<string, any>;
        // Submodule route data
        if (Object.keys(routeData).length === 0) {
          routeData = route.state.root.children[0].children[0].data;
        }

        if (routeData && routeData['noSleep'] && routeData['noSleep'] === true) {
          if (!this.noSleep.isEnabled) {
            void this.noSleep.enable();
          }
        } else if (this.noSleep.isEnabled) {
          this.noSleep.disable();
        }
      }
    });

    DataModelMenuItems.forEach((menuItem) => {
      this.menuItems.push({
        ...menuItem, items: [
          {
            label: $localize`List`,
            icon: 'pi pi-list',
            routerLink: menuItem.listRouterLink,
          },
          {
            label: $localize`Add`,
            icon: 'pi pi-plus',
            routerLink: menuItem.addRouterLink,
          },
          {
            label: $localize`Invalid store`,
            icon: 'pi pi-refresh',
            command: () => {
              this.services[menuItem.service].invalidStoredData();
              window.location.reload();
            }
          }
        ],
      });
    })

    this.menuItems.push({
      separator: true
    });

    this.menuItems.push({
      ...LogoutMenuItem, command: () => {
        this.userService.logout().then(async () => {
          await this.userService.logout();
          void this.router.navigate([ '../login' ]);
        });
      }
    });

    this.userService.isLoggedIn().subscribe((logged) => {
      this.logged = logged;
      this.loading = false;
    });
  }
}
