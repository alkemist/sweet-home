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
import {DeviceService} from '@services';
import {FormControl} from '@angular/forms';
import dateFormat from 'dateformat';
import {ChartData, ChartDataset, ChartOptions} from 'chart.js';
import {CHART_COLORS, DateFormats, DeviceCommandHistory} from '@models';
import {DateHelper, MathHelper, SmartMap, TypeHelper} from '@alkemist/smart-tools';
import {debounceTime} from "rxjs";

@Component({
  selector: "app-history",
  templateUrl: "./history.component.html",
  styleUrls: ["./history.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryComponent extends BaseComponent implements OnInit, OnDestroy, OnChanges {
  @Input() dates: string[] = [];
  @Input() deviceCommands: DeviceCommandHistory[] = [];
  @Output() datesChange = new EventEmitter<Date[]>()

  showCalendar = false;
  now = new Date();
  dateControl: FormControl<[Date] | [Date, Date] | null>;
  minTimeControl: FormControl<Date | null>;
  maxTimeControl: FormControl<Date | null>;

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

    this.dateControl = new FormControl<[Date] | [Date, Date] | null>(null);
    this.minTimeControl = new FormControl<Date | null>(null);
    this.maxTimeControl = new FormControl<Date | null>(null);

    this.sub = this.dateControl.valueChanges.subscribe((dates) => {
      if (dates && dates.length === 2 && dates[0] && dates[1] && this.showCalendar) {
        this.loadHistories();
        this.datesChange.emit(dates);
      }
    })

    this.sub = this.minTimeControl.valueChanges
      .pipe(
        debounceTime(2000),
      ).subscribe((date: Date | null) => {
        if (date && !this.showCalendar && this.loaded() && this.maxTimeControl.value) {
          this.loadHistories();
          //this.datesChange.emit(dates);
        }
      })

    this.sub = this.maxTimeControl.valueChanges
      .pipe(
        debounceTime(2000),
      ).subscribe((date: Date | null) => {
        if (date && !this.showCalendar && this.minTimeControl.value) {
          this.loadHistories();
          //this.datesChange.emit(dates);
        }
      })

  }

  ngOnInit() {
    if (this.dates.length > 0) {
      const dateBegin = new Date();
      dateBegin.setTime(parseInt(this.dates[0]));

      const dateEnd = new Date();
      dateEnd.setTime(parseInt(this.dates[1]));

      this.dateControl.setValue([
        DateHelper.dayStart(dateBegin),
        DateHelper.dayEnd(dateEnd)
      ]);

      this.minTimeControl.setValue(
        DateHelper.dayStart(
          TypeHelper.deepClone(
            dateBegin
          )
        )
      );

      this.maxTimeControl.setValue(
        DateHelper.dayEnd(
          TypeHelper.deepClone(
            dateEnd
          )
        )
      );
    } else {
      this.dateControl.setValue([
        DateHelper.dayStart(
          TypeHelper.deepClone(this.now
          )
        ),
        DateHelper.dayEnd(
          TypeHelper.deepClone(
            this.now
          )
        )
      ]);
      this.minTimeControl.setValue(DateHelper.dayStart(
        TypeHelper.deepClone(this.now
        )));
      this.maxTimeControl.setValue(DateHelper.dayEnd(TypeHelper.deepClone(this.now)));
    }
  }

  loadHistories() {
    let dateStart: Date | undefined;
    let dateEnd: Date | undefined | null;

    let dateStartStr: string = '';
    let dateEndStr: string = '';

    if (this.showCalendar) {
      dateStart = this.dateControl.value![0];
      dateEnd =
        this.dateControl.value!.length > 1 && this.dateControl.value![1] ?
          this.dateControl.value![1]
          : dateStart;

      dateStartStr = dateFormat(DateHelper.dayStart(dateStart), "yyyy-mm-dd HH:MM");
      dateEndStr = dateFormat(DateHelper.dayEnd(dateEnd), "yyyy-mm-dd HH:MM");
    } else {
      dateStart = this.minTimeControl.value!;
      dateEnd = this.maxTimeControl.value!;

      dateStartStr = dateFormat(dateStart, "yyyy-mm-dd HH:MM");
      dateEndStr = dateFormat(dateEnd, "yyyy-mm-dd HH:MM");
    }

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
    let dateStart: Date | undefined;
    let dateEnd: Date | undefined;

    if (this.showCalendar) {
      dateStart = new Date(this.dateControl.value![0]);
      dateEnd =
        new Date(this.dateControl.value!.length > 1 && this.dateControl.value![1] ?
          DateHelper.dayEnd(this.dateControl.value![1])
          : dateStart
        );

      dateStart.setDate(dateStart.getDate() + inc);
      dateEnd.setDate(dateEnd.getDate() + inc);
      this.dateControl.setValue([dateStart, dateEnd]);
    } else {
      dateStart = new Date(this.minTimeControl.value!);
      dateEnd = new Date(this.maxTimeControl.value!);

      dateStart.setHours(dateStart.getHours() + inc);
      dateEnd.setHours(dateEnd.getHours() + inc);

      this.minTimeControl.setValue(dateStart);
      this.maxTimeControl.setValue(dateEnd);
    }
  }

  /**
   * If is last day
   */
  disableNext() {
    if (!this.showCalendar) {
      return this.maxTimeControl.value!.getHours() === 23;
    }

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

  changeMode() {
    if (this.showCalendar) {
      const dates = this.dateControl.value;
      this.dateControl.setValue(dates);
    } else {
      this.minTimeControl.setValue(
        DateHelper.dayStart(
          TypeHelper.deepClone(
            this.dateControl.value![0])
        )
        , {emitEvent: false}
      );
      this.maxTimeControl.setValue(
        DateHelper.dayEnd(
          TypeHelper.deepClone(
            this.dateControl.value![0]
          )
        )
      );
    }
  }

  disablePrev() {
    return !this.showCalendar && this.minTimeControl.value!.getHours() === 0;
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
        `${device.deviceName} - ${device.commandName}`
        : `${device.commandName} `;

      const deviceAllValues: (number[] | undefined)[] = labels.map(date => valuesByDateAndDevice[index].get(date.key));

      const baseSerie = {
        smooth: true,
      }

      dataSets.push({
        label: `${commandName}`,
        data: deviceAllValues.map(
          dateValues => dateValues ? MathHelper.round(
            MathHelper.sum(dateValues) / dateValues.length
          ) : null,
        ),
        ...this.deviceCommands.length === 1 ? {
          borderColor: CHART_COLORS.yellow,
        } : {},
        spanGaps: true,
        ...baseSerie
      });

      if (this.deviceCommands.length === 1 && !isSameDay) {
        dataSets.push({
          label: 'Max.',
          data: deviceAllValues.map(
            dateValues => dateValues ? Math.max(...dateValues) : null,
          ),
          borderColor: CHART_COLORS.red,
          fill: false,
          borderDash: [5, 5],
          ...baseSerie
        });

        dataSets.push({
          label: 'Min.',
          data: deviceAllValues.map(
            dateValues => dateValues ? Math.min(...dateValues) : null,
          ),
          borderColor: CHART_COLORS.blue,
          fill: false,
          borderDash: [5, 5],
          ...baseSerie
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
