import {ChangeDetectionStrategy, Component} from "@angular/core";
import {DeviceThermometerComponent} from "../thermometer.component";
import {ThermometerParamValue} from '../../../index';
import {
  ThermometerHeimanCommandInfo,
  ThermometerHeimanExtendCommandInfo,
  ThermometerHeimanGlobalCommandInfo,
  ThermometerHeimanParamValue
} from './thermometer.type';
import {ThermometerHeimanCommandValues, ThermometerParameterValues} from './thermometer.interface';
import {MathHelper} from '@alkemist/smart-tools';


@Component({
  selector: "app-device-thermometer-Heiman",
  templateUrl: "../thermometer.component.html",
  styleUrls: [
    "../../../base-device.component.scss",
    "../../zigbee.component.scss",
    "../thermometer.component.scss",
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceThermometerHeimanComponent extends DeviceThermometerComponent<
  ThermometerHeimanExtendCommandInfo,
  ThermometerHeimanCommandValues,
  ThermometerHeimanCommandInfo,
  ThermometerHeimanParamValue,
  ThermometerParameterValues
> {
  override ngOnInit() {
    //this.addDeviceCommandHistory('co2');
    this.addDeviceCommandHistory('temperature');
  }


  override setParameterValues(values: Record<ThermometerParamValue, string | undefined>) {
    super.setParameterValues(values);
    this.parameterValues.co2 = parseInt(values.co2 ?? '0') === 1;
  };

  override updateInfoCommandValues(values: Record<ThermometerHeimanGlobalCommandInfo, string | number | boolean | null>) {
    super.updateInfoCommandValues(values);

    this.updateInfoCommandValue('co2', MathHelper.round(values['co2'] as number, 0))

    // console.log(`-- [${ this.name }] Updated info command values`, this.infoCommandValues()());
  }
}
