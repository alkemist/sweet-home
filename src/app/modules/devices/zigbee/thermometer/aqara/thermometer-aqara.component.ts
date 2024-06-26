import { ChangeDetectionStrategy, Component } from "@angular/core";
import { DeviceThermometerComponent } from "../thermometer.component";
import { ThermometerParamValue } from '../../../index';
import {
  ThermometerAqaraCommandInfo,
  ThermometerAqaraExtendCommandInfo,
  ThermometerAqaraGlobalCommandInfo,
  ThermometerAqaraParamValue
} from './thermometer.type';
import { ThermometerAqaraCommandValues, ThermometerParameterValues } from './thermometer.interface';
import { MathHelper } from '@alkemist/smart-tools';


@Component({
  selector: "app-device-thermometer-heiman",
  templateUrl: "../thermometer.component.html",
  styleUrls: [
    "../../../base-device.component.scss",
    "../../zigbee.component.scss",
    "../thermometer.component.scss",
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceThermometerAqaraComponent extends DeviceThermometerComponent<
  ThermometerAqaraExtendCommandInfo,
  ThermometerAqaraCommandValues,
  ThermometerAqaraCommandInfo,
  ThermometerAqaraParamValue,
  ThermometerParameterValues
> {
  override setParameterValues(values: Record<ThermometerParamValue, string | undefined>) {
    super.setParameterValues(values);
    this.parameterValues.pression = parseInt(values.pression ?? '0') === 1;
  };

  override updateInfoCommandValues(values: Record<ThermometerAqaraGlobalCommandInfo, string | number | boolean | null>) {
    super.updateInfoCommandValues(values);

    this.updateInfoCommandValue('pression', MathHelper.round(values['pression'] as number, 0))

    // console.log(`-- [${ this.name }] Updated info command values`, this.infoCommandValues()());
  }
}
