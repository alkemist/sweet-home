import { Directive, signal, WritableSignal } from '@angular/core';
import { ThermometerCommandInfo, ThermometerExtendCommandInfo, ThermometerGlobalCommandInfo } from '@devices';
import { ZigbeeBatteryComponent } from '../zigbee-battery-component.directive';
import { DateHelper, MathHelper } from '@tools';
import { ThermometerCommandValues, ThermometerParameterValues } from './thermometer.interface';
import { DeviceService, MapBuilder } from '@services';
import { MessageService } from 'primeng/api';
import dateFormat from "dateformat";
import { ChartData, ChartOptions } from 'chart.js';
import { FormControl } from '@angular/forms';
import { JeedomHistoryInterface } from '../../../../models/jeedom/jeedom-history.interface';

@Directive()
export abstract class DeviceThermometerComponent<
  IE extends ThermometerExtendCommandInfo = ThermometerExtendCommandInfo,
  IV extends ThermometerCommandValues = ThermometerCommandValues,
  I extends string = string,
  P extends string = string,
  PV extends ThermometerParameterValues = ThermometerParameterValues,
>
  extends ZigbeeBatteryComponent<
    IE,
    never,
    IV,
    I | ThermometerCommandInfo,
    never,
    never,
    P,
    PV
  > {
  size = {
    w: 120,
    h: 80,
  }

  zooms = [
    { label: 'day', value: 'dd/mm' },
    { label: 'hour', value: 'H:MM' },
  ]
  zoomControl = new FormControl<string[]>(this.zooms.map(zoom => zoom.value));
  historyLoaded = signal(false);
  chartOptions: ChartOptions = {};
  chartData = signal<ChartData>({
    labels: [],
    datasets: []
  })
  override infoCommandValues: WritableSignal<IV> = signal<IV>({
    ...super.infoCommandSignalValues,
    temperature: 0,
    humidity: 0,
    pression: 0,
  });
  dateControl: FormControl<[ Date, Date ] | null>;
  now = new Date();
  private histories: JeedomHistoryInterface[] = [];

  public constructor(
    mapBuilder: MapBuilder,
    deviceService: DeviceService,
    messageService: MessageService,
  ) {
    super(mapBuilder, deviceService, messageService);

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.chartOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
          }
        }
      }
    }

    this.dateControl = new FormControl<[ Date, Date ]>([ this.now, this.now ]);

    this.sub = this.zoomControl.valueChanges.subscribe((zoom) => {
      this.loadChart();
    })

    this.sub = this.dateControl.valueChanges.subscribe((dates) => {
      if (dates && dates[0] && dates[1]) {
        this.loadHistories();
      }
    })
  }

  override async openModal() {
    if (!this.isUserAction()) {
      return;
    }

    this.loadHistories();
    this.modalOpened = true;
  }

  loadHistories() {
    this.historyLoaded.set(false);
    const dateStart = dateFormat(DateHelper.dayStart(this.dateControl.value![0]), "yyyy-mm-dd HH:MM");
    const dateEnd = dateFormat(DateHelper.dayEnd(this.dateControl.value![1]), "yyyy-mm-dd HH:MM");

    this.execHistory('temperature', dateStart, dateEnd).then(histories => {
      this.histories = histories;
      this.loadChart();
      this.historyLoaded.set(true);
    });
  }

  loadChart() {
    const labels: string[] = [];
    const values: number[] = [];

    this.histories.forEach(history => {
      labels.push(dateFormat(history.datetime, this.zoomControl.value?.join(' ')!));
      values.push(parseFloat(history.value));
    })

    this.chartData.set({
      labels,
      datasets: [ {
        label: 'Température',
        data: values,
      } ]
    });

    console.group('Load chart');
    console.log("dates", this.dateControl.value);
    console.log("histories", this.histories);
    console.log("format", this.zoomControl.value);
    console.log("labels", labels);
    console.log("values", values);
    console.groupEnd()
  }

  override updateInfoCommandValues(values: Record<ThermometerGlobalCommandInfo, string | number | boolean | null>) {
    super.updateInfoCommandValues(values);

    this.infoCommandValues.set({
      ...this.infoCommandValues(),
      temperature: MathHelper.round(values.temperature as number, 1),
      humidity: MathHelper.round(values.humidity as number, 0),
    })

    // console.log(`-- [${ this.name }] Updated info command values`, this.infoCommandValues());
  }
}
