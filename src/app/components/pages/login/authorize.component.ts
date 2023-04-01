import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '@services';
import { BaseComponent } from '../../base.component';

@Component({
  selector: 'app-authorize',
  templateUrl: './authorize.component.html',
  styleUrls: [ './authorize.component.scss' ],
  host: {
    class: 'page-container'
  }
})
export class AuthorizeComponent extends BaseComponent implements OnInit, OnDestroy {
  constructor(private userService: UserService, private route: ActivatedRoute, private router: Router) {
    super();
  }

  ngOnInit(): void {
    this.sub = this.route.queryParams
      .subscribe((params) => {
        if (params['code']) {
          this.userService.editCode(params['code']).then(() => {
            void this.router.navigate([ '../', 'home' ], { relativeTo: this.route })
          })
        } else {
          //void this.router.navigate([ '../' ], { relativeTo: this.route })
        }
      })
  }
}
