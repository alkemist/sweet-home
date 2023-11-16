import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, signal } from '@angular/core';
import BaseComponent from '@base-component';
import { DeviceService } from '@services';
import { FormControl } from '@angular/forms';
import dateFormat from 'dateformat';
import { ArrayHelper, DateHelper, MathHelper } from '@tools';
import { ChartData, ChartDataset, ChartOptions } from 'chart.js';
import { CHART_COLORS, DateFormats, DeviceCommandHistory } from '@models';
import { SmartMap } from '@alkemist/smart-tools';

@Component({
  selector: "app-history",
  templateUrl: "./history.component.html",
  styleUrls: [ "./history.component.scss" ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryComponent extends BaseComponent implements OnInit, OnDestroy {
  @Input() deviceCommands: DeviceCommandHistory[] = [];

  now = new Date();
  dateControl: FormControl<[ Date ] | [ Date, Date ] | null>;

  loaded = signal(false);
  chartOptions: ChartOptions = {};
  chartData = signal<ChartData>({
    labels: [],
    datasets: []
  })

  constructor(private deviceService: DeviceService) {
    super();

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

    this.loadHistories();
  }

  ngOnInit() {
    /*
    { value: '1', datetime: '2023-01-01 01:00', cmd_id: '' },
        { value: '4', datetime: '2023-01-01 02:00', cmd_id: '' },
        { value: '3', datetime: '2023-01-02 01:00', cmd_id: '' },
     */
  }

  loadHistories() {
    const dateStart = this.dateControl.value![0];
    const dateEnd =
      this.dateControl.value!.length > 1 && this.dateControl.value![1] ?
        this.dateControl.value![1]
        : dateStart;

    const dateStartStr = dateFormat(DateHelper.dayStart(dateStart), "yyyy-mm-dd HH:MM");
    const dateEndStr = dateFormat(DateHelper.dayEnd(dateEnd), "yyyy-mm-dd HH:MM");

    console.log("deviceCommands", this.deviceCommands);

    Promise.all(
      this.deviceCommands.map(deviceCommand => this.deviceService
        .execHistory(deviceCommand.commandId, deviceCommand.commandName, dateStartStr, dateEndStr))
    )
      .then((histories) => {
        this.deviceCommands.forEach((deviceCommand, index) => {
            if (histories[index]) {
              deviceCommand.history = histories[index]
            }
          }
        )
        this.loadChart();
        this.loaded.set(true);
      })
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

  isSameDay() {
    if (!this.dateControl.value) {
      return true;
    }

    return this.dateControl.value.length === 1 || !this.dateControl.value[1] || dateFormat(this.dateControl.value[0], DateFormats.day)
      === dateFormat(this.dateControl.value[1], DateFormats.day);
  }

  private loadChart() {
    let labels: string[] = [];
    const dataSets: ChartDataset[] = [];
    let valuesByDevice: number[][] = [];
    const valuesByDateAndDevice: SmartMap<number[]>[] = [];
    const isSameDay = this.isSameDay();

    this.deviceCommands.forEach((deviceCommand) => {
      const valuesByDate = new SmartMap<number[]>();
      const values: number[] = [];

      deviceCommand.history.forEach((history) => {
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
      });

      valuesByDateAndDevice.push(valuesByDate);
      valuesByDevice.push(values);
    });

    this.deviceCommands.forEach((device, index) => {
      let prefix = this.deviceCommands.length > 1 ? `${ device.deviceName } ` : '';

      if (isSameDay) {
        dataSets.push({
          label: `${ prefix }Temp.`,
          data: valuesByDevice[index],
          ...this.deviceCommands.length === 1 ? {
            borderColor: CHART_COLORS.yellow,
          } : {}
        });
      } else {
        const deviceAllValues: (number[] | undefined)[] = labels.map(date => valuesByDateAndDevice[index].get(date));

        dataSets.push({
          label: `${ prefix }Ave.`,
          data: deviceAllValues.map(
            dateValues => dateValues ? MathHelper.round(
              MathHelper.sum(dateValues) / dateValues.length
            ) : null,
          ),
          ...this.deviceCommands.length === 1 ? {
            borderColor: CHART_COLORS.yellow,
          } : {}
        });

        if (this.deviceCommands.length === 1) {
          dataSets.push({
            label: 'Max.',
            data: deviceAllValues.map(
              dateValues => dateValues ? Math.max(...dateValues) : null,
            ),
            borderColor: CHART_COLORS.red,
            fill: false,
            borderDash: [ 5, 5 ],
          });

          dataSets.push({
            label: 'Min.',
            data: deviceAllValues.map(
              dateValues => dateValues ? Math.min(...dateValues) : null,
            ),
            borderColor: CHART_COLORS.blue,
            fill: false,
            borderDash: [ 5, 5 ],
          });
        }
      }
    })

    /*console.group('Load chart');
    console.log("dates", this.dateControl.value);
    console.log("histories", this.histories);
    console.log("format", format);
    console.log("labels", labels);
    console.log("values", values);
    console.groupEnd()*/

    this.chartData.set({
      labels: ArrayHelper.unique(labels),
      datasets: dataSets
    });
  }
}
