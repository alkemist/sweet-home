import {
  ChangeDetectionStrategy,
  Component,
  effect,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
  WritableSignal
} from "@angular/core";
import BaseComponent from "@base-component";
import { VariableBackInterface, VariableModel } from '@models';
import { VariableService } from '../../../../../services/variable.service';
import { Table } from 'primeng/table';
import { Observe } from '@alkemist/ngx-state-manager';
import { VariableState } from '@stores';
import { StringHelper, TypeHelper } from '@alkemist/smart-tools';
import { ConfirmationService } from 'primeng/api';


@Component({
  templateUrl: "./variables.component.html",
  styleUrls: [ "./variables.component.scss" ],
  host: {
    class: "page-container"
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VariablesComponent extends BaseComponent implements OnInit, OnDestroy {
  @ViewChild('dt', { static: false }) table?: Table;

  clonedVariables: { [s: string]: VariableModel } = {};
  maxRows = 100;
  editingIndex: number | null = null;

  @Observe(VariableState, VariableState.items)
  protected _items!: WritableSignal<VariableBackInterface[]>;
  protected variables = signal<VariableModel[]>([]);

  constructor(
    private confirmationService: ConfirmationService,
    private variableService: VariableService,
  ) {
    super();

    effect(() => {
      this.variables.set(this._items().map(_item => new VariableModel(_item)));
    }, { allowSignalWrites: true });
  }

  get loaded() {
    return this.variableService.userItemsLoaded;
  }

  ngOnInit() {

  }

  onRowEditInit(variable: VariableModel) {
    this.editingIndex = this.variables().findIndex((_variable) => variable.id === _variable.id);
    this.clonedVariables[variable.id] = TypeHelper.deepClone(variable);
  }

  async onRowEditSave(variable: VariableModel) {
    if (!await this.variableService.exist(
      variable,
      variable.id
    )) {
      void this.save(variable);
    } else {
      this.cancel()
    }
  }

  async save(variable: VariableModel) {
    variable.slug = StringHelper.slugify(variable.name);

    if (variable.id) {
      await this.variableService.update(variable.id, variable);
      delete this.clonedVariables[variable.id];
      this.editingIndex = null;
    } else {
      if (await this.variableService.add(variable)) {
        this.table?.sortSingle();
        this.editingIndex = null;
      } else {
        this.cancel();
      }
    }
  }

  async reload() {
    await this.variableService.dispatchUserItemsFill();
    this.variables.set(this._items().map(_item => {
      const variable = new VariableModel(_item);
      void this.variableService.syncVariable(variable);
      return variable;
    }));
  }

  onRowEditCancel(variable: VariableModel, index: number) {
    if (variable.id) {
      this.variables.set(
        this.variables().map(
          (_variable, _index) => _index === index
            ? this.clonedVariables[variable.id as string]
            : _variable
        )
      )
      this.editingIndex = null;
    } else {
      this.cancel();
    }
  }

  remove(variable: VariableModel) {
    this.confirmationService.confirm({
      key: "variable",
      message: $localize`Are you sure you want to remove variable ?`,
      accept: () => {
        void this.variableService.delete(variable);
      }
    });
  }

  add() {
    const variable = new VariableModel({
      id: '',
      key: '',
      name: '',
      value: '',
    });
    this.editingIndex = this.variables().length;

    this.variables().push(variable);
    this.table?.initRowEdit(variable);
  }

  cancel() {
    this.variables.set(this.variables().filter((variable, index) => index !== this.editingIndex));

    this.editingIndex = null;
  }
}
