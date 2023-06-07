import {ChangeDetectionStrategy, Component, OnInit} from "@angular/core";
import {SwUpdate} from "@angular/service-worker";
import {WorkerService} from "@services";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {

  constructor(
    private swUpdate: SwUpdate,
    private workerService: WorkerService
  ) {
  }

  ngOnInit() {
    if (this.swUpdate.isEnabled) {
      /*this.swUpdate.versionUpdates.subscribe(() => {
        if(confirm("New version available. Load New Version?")) {
          window.location.reload();
        }
      });*/
    }
  }
}

