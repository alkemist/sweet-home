import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  signal,
  SimpleChanges
} from '@angular/core';
import BaseComponent from '@base-component';
import { DeviceService } from '@services';
import { FormControl } from '@angular/forms';
import dateFormat from 'dateformat';
import { ChartData, ChartDataset, ChartOptions } from 'chart.js';
import { CHART_COLORS, DateFormats, DeviceCommandHistory } from '@models';
import { DateHelper, MathHelper, SmartMap } from '@alkemist/smart-tools';

@Component({
  selector: "app-history",
  templateUrl: "./history.component.html",
  styleUrls: [ "./history.component.scss" ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryComponent extends BaseComponent implements OnInit, OnDestroy, OnChanges {
  @Input() dates: string[] = [];
  @Input() deviceCommands: DeviceCommandHistory[] = [];
  @Output() datesChange = new EventEmitter<Date[]>()

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

    this.dateControl = new FormControl<[ Date ] | [ Date, Date ] | null>(null);

    this.sub = this.dateControl.valueChanges.subscribe((dates) => {
      if (dates && dates.length === 2 && dates[0] && dates[1]) {
        this.loadHistories();
        this.datesChange.emit(dates);
      }
    })

  }

  ngOnInit() {
    if (this.dates.length > 0) {
      const dateBegin = new Date();
      dateBegin.setTime(parseInt(this.dates[0]));

      const dateEnd = new Date();
      dateEnd.setTime(parseInt(this.dates[1]));

      this.dateControl.setValue([ dateBegin, dateEnd ]);
    } else {
      this.dateControl.setValue([ this.now, this.now ]);
    }
  }

  loadHistories() {
    const dateStart = this.dateControl.value![0];
    const dateEnd =
      this.dateControl.value!.length > 1 && this.dateControl.value![1] ?
        this.dateControl.value![1]
        : dateStart;

    const dateStartStr = dateFormat(DateHelper.dayStart(dateStart), "yyyy-mm-dd HH:MM");
    const dateEndStr = dateFormat(DateHelper.dayEnd(dateEnd), "yyyy-mm-dd HH:MM");

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

    this.dateControl.setValue([ dateStart, dateEnd ]);
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

  ngOnChanges(changes: SimpleChanges): void {
    if (this.loaded()) {
      this.loadHistories();
    }
  }

  private loadChart() {
    const dataSets: ChartDataset[] = [];
    const valuesByDateAndDevice: SmartMap<number[]>[] = [];
    const labelsMap = new SmartMap<string>([]);
    const isSameDay = this.isSameDay();

    this.deviceCommands.forEach((deviceCommand) => {
      const valuesByDate = new SmartMap<number[]>();

      deviceCommand.history.forEach((history) => {
        const value = parseFloat(history.value);

        const date = dateFormat(history.datetime, isSameDay ? DateFormats.hour : DateFormats.day);
        const dateKey = dateFormat(history.datetime, isSameDay ? DateFormats.hour : DateFormats.dayKey);

        const currentValues = valuesByDate.get(dateKey) ?? [];
        currentValues.push(value);

        valuesByDate.set(dateKey, currentValues);
        labelsMap.set(dateKey, date);
      });

      valuesByDateAndDevice.push(valuesByDate);
    });

    const labels = labelsMap.toKeyValues()
      .sort((kv1, kv2) => kv1.key.localeCompare(kv2.key));

    this.deviceCommands.forEach((device, index) => {
      let commandName = this.deviceCommands.length > 1 ?
        `${ device.deviceName } - ${ device.commandName }`
        : `${ device.commandName } `;

      const deviceAllValues: (number[] | undefined)[] = labels.map(date => valuesByDateAndDevice[index].get(date.key));

      dataSets.push({
        label: `${ commandName }`,
        data: deviceAllValues.map(
          dateValues => dateValues ? MathHelper.round(
            MathHelper.sum(dateValues) / dateValues.length
          ) : null,
        ),
        ...this.deviceCommands.length === 1 ? {
          borderColor: CHART_COLORS.yellow,
        } : {},
        spanGaps: true,
      });

      if (this.deviceCommands.length === 1 && !isSameDay) {
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
    })

    /*console.group('Load chart');
    console.log("dates", this.dateControl.value);
    console.log("deviceCommands", this.deviceCommands);
    console.log("labels", labels);
    console.log("dataSets", dataSets);
    console.log("valuesByDateAndDevice", valuesByDateAndDevice);
    console.groupEnd()*/

    this.chartData.set({
      labels: labels.map(label => label.value),
      datasets: dataSets
    });
  }
}
