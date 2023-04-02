import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppKey, LoggerService, UserService } from '@services';
import { BaseComponent } from '../../base.component';
import { combineLatest } from 'rxjs';
import { MessageService } from 'primeng/api';
import { UnknownTokenError } from '@errors';
import { SpotifyService } from '../../../services/spotify.service';
import { SonosService } from '../../../services/sonos.service';

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
    protected spotifyService: SpotifyService,
    protected sonosService: SonosService,
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
      .subscribe(async (mixedData) => {
        const [ { type }, { code } ] = mixedData as [ { type: AppKey }, { code: string } ];

        if (type && code) {
          this.updateToken(type, code).then(() => {
            // console.log(`-- [${ type }] Refresh token updated`);
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

  updateToken(type: AppKey, authorizationCode: string) {
    if (type === 'spotify') {
      return this.spotifyService.updateRefreshToken(authorizationCode)
    } else {
      return this.sonosService.updateRefreshToken(authorizationCode)
    }
  }
}
