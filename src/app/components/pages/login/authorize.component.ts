import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppKey, LoggerService, UserService } from '@services';
import { BaseComponent } from '../../base.component';
import { combineLatest } from 'rxjs';
import { MessageService } from 'primeng/api';
import { UnknownTokenError } from '@errors';

@Component({
  selector: 'app-authorize',
  templateUrl: './authorize.component.html',
  styleUrls: [ './authorize.component.scss' ],
  host: {
    class: 'page-container'
  }
})
export class AuthorizeComponent extends BaseComponent implements OnInit, OnDestroy {
  constructor(
    private userService: UserService,
    private loggerService: LoggerService,
    protected messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.sub = combineLatest([
      this.route.params,
      this.route.queryParams,
    ])
      .subscribe((mixedData) => {
        const [ { type }, { code } ] = mixedData as [ { type: AppKey }, { code: string } ];

        if (type && code) {
          this.userService.updateCode(type, code).then(() => {
            void this.router.navigate([ '../../', 'home' ], { relativeTo: this.route })
          })
        } else {
          this.messageService.add({
            severity: 'error',
            detail: $localize`Unknown type or token`
          });
          this.loggerService.error(new UnknownTokenError(type))
        }
      })
  }
}
