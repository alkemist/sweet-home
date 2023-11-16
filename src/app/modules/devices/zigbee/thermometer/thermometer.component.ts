import { Directive, signal, WritableSignal } from '@angular/core';
import { ThermometerCommandInfo, ThermometerExtendCommandInfo, ThermometerGlobalCommandInfo } from '@devices';
import { ZigbeeBatteryComponent } from '../zigbee-battery-component.directive';
import { ArrayHelper, DateHelper, MathHelper } from '@tools';
import { ThermometerCommandValues, ThermometerParameterValues } from './thermometer.interface';
import { DeviceService, MapBuilder } from '@services';
import { MessageService } from 'primeng/api';
import dateFormat from "dateformat";
import { ChartData, ChartDataset, ChartOptions } from 'chart.js';
import { FormControl } from '@angular/forms';
import { JeedomHistoryInterface } from '../../../../models/jeedom/jeedom-history.interface';
import { SmartMap } from '@alkemist/smart-tools';
import { CHART_COLORS, DateFormats } from '@models';

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
  dateControl: FormControl<[ Date ] | [ Date, Date ] | null>;
  now = new Date();
  private histories: JeedomHistoryInterface[] = [];

  public constructor(
    mapBuilder: MapBuilder,
    deviceService: DeviceService,
    messageService: MessageService,
  ) {
    super(mapBuilder, deviceService, messageService);

    this.addDeviceCommandHistory('temperature');

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

    this.dateControl = new FormControl<[ Date ] | [ Date, Date ] | null>([ this.now ]);

    this.sub = this.dateControl.valueChanges.subscribe((dates) => {
      console.log(dates);
      if (dates) {
        this.loadHistories();
      }
    })
  }

  isSameDay() {
    if (!this.dateControl.value) {
      return true;
    }

    return this.dateControl.value.length === 1 || !this.dateControl.value[1] || dateFormat(this.dateControl.value[0], DateFormats.day)
      === dateFormat(this.dateControl.value[1], DateFormats.day);
  }


  isLastDay() {
    if (!this.dateControl.value) {
      return false;
    }

    const date = this.dateControl.value.length === 1 || !this.dateControl.value[1]
      ? this.dateControl.value[0]
      : this.dateControl.value[1];
    return dateFormat(date, DateFormats.day)
      === dateFormat(new Date(), DateFormats.day);
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

    const dateStart = this.dateControl.value![0];
    const dateEnd =
      this.dateControl.value!.length > 1 && this.dateControl.value![1] ?
        this.dateControl.value![1]
        : dateStart;

    const dateStartStr = dateFormat(DateHelper.dayStart(dateStart), "yyyy-mm-dd HH:MM");
    const dateEndStr = dateFormat(DateHelper.dayEnd(dateEnd), "yyyy-mm-dd HH:MM");

    this.execHistory('temperature', dateStartStr, dateEndStr).then(histories => {
      this.histories = histories;
      this.loadChart();
      this.historyLoaded.set(true);
    });
  }

  loadChart() {
    let labels: string[] = [];
    let values: number[] = [];
    let minValues: number[] = [];
    let maxValues: number[] = [];
    const isSameDay = this.isSameDay();
    const dataSets: ChartDataset[] = [];
    const valuesByDate = new SmartMap<number[]>();

    this.histories.forEach(history => {
      const value = parseFloat(history.value);

      if (isSameDay) {
        values.push(value);
        labels.push(dateFormat(history.datetime, DateFormats.hour));
      } else {
        const date = dateFormat(history.datetime, DateFormats.day);
        const currentValues = valuesByDate.get(date) ?? [];
        currentValues.push(value);

        valuesByDate.set(date, currentValues);
        labels.push(date);
      }
    })

    if (isSameDay) {
      dataSets.push({
        label: 'Temp.',
        data: values,
        borderColor: CHART_COLORS.yellow,
      });
    } else {
      values = valuesByDate.getValues().map(
        dateValues => MathHelper.round(
          MathHelper.sum(dateValues) / dateValues.length
        )
      );

      minValues = valuesByDate.getValues().map(
        dateValues => Math.min(...dateValues)
      );

      maxValues = valuesByDate.getValues().map(
        dateValues => Math.max(...dateValues)
      );

      dataSets.push({
        label: 'Ave.',
        data: values,
        borderColor: CHART_COLORS.yellow,
      });

      dataSets.push({
        label: 'Min.',
        data: minValues,
        borderColor: CHART_COLORS.blue,
        fill: false,
        borderDash: [ 5, 5 ],
      })

      dataSets.push({
        label: 'Max.',
        data: maxValues,
        borderColor: CHART_COLORS.red,
        fill: false,
        borderDash: [ 5, 5 ],
      })
    }

    this.chartData.set({
      labels: ArrayHelper.unique(labels),
      datasets: dataSets
    });

    /*console.group('Load chart');
    console.log("dates", this.dateControl.value);
    console.log("histories", this.histories);
    console.log("format", format);
    console.log("labels", labels);
    console.log("values", values);
    console.groupEnd()*/
  }

  override updateInfoCommandValues(values: Record<ThermometerGlobalCommandInfo, string | number | boolean | null>) {
    super.updateInfoCommandValues(values);

    this.patchInfoCommandValues({
      temperature: MathHelper.round(values.temperature as number, 1),
      humidity: MathHelper.round(values.humidity as number, 0),
    } as Partial<IV>)

    // console.log(`-- [${ this.name }] Updated info command values`, this.infoCommandValues());
  }

  addDate(inc: number) {
    const dateStart = new Date(this.dateControl.value![0]);
    const dateEnd =
      new Date(this.dateControl.value!.length > 1 && this.dateControl.value![1] ?
        DateHelper.dayEnd(this.dateControl.value![1])
        : dateStart
      );

    dateStart.setDate(dateStart.getDate() + inc);
    dateEnd.setDate(dateEnd.getDate() + inc);

    this.dateControl.setValue(this.isSameDay() ? [ dateStart ] : [ dateStart, dateEnd ]);
  }
}
