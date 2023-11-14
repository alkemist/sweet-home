import { ChangeDetectionStrategy, Component } from "@angular/core";
import BaseDeviceComponent from "@base-device-component";

@Component({
  selector: "app-device-chromecast",
  template: "",
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceTestComponent
  extends BaseDeviceComponent {

  size = {
    w: 100,
    h: 100
  };

  updateInfoCommandValues(values: Record<any, string | number | boolean | null>) {
    console.log(`-- [${ this.name }] Updated info command values`, values, this.infoCommandValues());
  }
}
