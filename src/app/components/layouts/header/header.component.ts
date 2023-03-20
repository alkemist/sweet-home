import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { DeviceService, UserService } from '@services';
import { MenuItem } from 'primeng/api';
import { DataModelMenuItems, LogoutMenuItem, MenuItems } from './menuItems.data';
import { BaseComponent } from '../../base.component';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: [ './header.component.scss' ]
})
export class HeaderComponent extends BaseComponent implements OnInit {
  loading = true;
  logged = false;
  title$: Observable<string>;
  menuItems: MenuItem[] = MenuItems;
  services: Record<string, any> = {}

  constructor(
    titleService: Title,
    private router: Router,
    private userService: UserService,
    private deviceService: DeviceService,
  ) {
    super();

    this.services['device'] = this.deviceService;

    this.title$ = router.events.pipe(
      map(() => titleService.getTitle().replaceAll('-', '/'))
    );

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
