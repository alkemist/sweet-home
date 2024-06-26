import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AppKey, LoggerService, SonosService, SpotifyService, UserService } from "@services";
import { combineLatest } from "rxjs";
import { MessageService } from "primeng/api";
import BaseComponent from "@base-component";
import { UnknownTokenError } from "@errors";
import { DataStoreConfigurationProvider } from '@alkemist/ngx-data-store';

@Component({
  selector: "app-authorize",
  templateUrl: "./authorize.component.html",
  styleUrls: [ "./authorize.component.scss" ],
  host: {
    class: "page-container"
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorizeComponent extends BaseComponent implements OnInit, OnDestroy {
  constructor(
    private userService: UserService,
    private configuration: DataStoreConfigurationProvider,
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
            void this.router.navigate([ this.configuration.front_logged_path ]);
          });
        } else {
          this.messageService.add({
            severity: "error",
            detail: $localize`Unknown type or token`
          });
          this.loggerService.error(new UnknownTokenError(mixedData[0], mixedData[1]));
        }
      });
  }

  updateToken(type: AppKey, authorizationCode: string) {
    if (type === "spotify") {
      //return this.spotifyService.updateRefreshToken(authorizationCode);
    } else if (type === "sonos") {
      //return this.sonosService.updateRefreshToken(authorizationCode);
    } else if (type === "google") {
      this.userService.setToken(authorizationCode);
      return Promise.resolve({});
    }

    return Promise.reject();
  }
}
