import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { UserService } from '@services';
import { MenuItem } from 'primeng/api';
import { LogoutMenuItem, MenuItems } from './menuItems.data';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: [ './header.component.scss' ]
})
export class HeaderComponent implements OnInit {
  loading = true;
  title$: Observable<string>;
  menuItems: MenuItem[] = MenuItems;

  constructor(
    titleService: Title,
    private router: Router,
    private userService: UserService
  ) {
    this.title$ = router.events.pipe(
      map(() => titleService.getTitle().replace('-', '/'))
    );

    this.menuItems.push({
      ...LogoutMenuItem, command: () => {
        this.userService.logout().then(() => {
          void this.router.navigate([ '/' ]);
        });
      }
    });

    this.userService.isLoggedIn().subscribe((logged) => {
      this.loading = !logged;
    });
  }

  ngOnInit() {
  }
}
