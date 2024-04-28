import { inject, Injectable, WritableSignal } from '@angular/core';
import { VariableBackInterface, VariableFrontInterface, VariableModel } from '@models';
import { DataStoreStateService } from '@alkemist/ngx-data-store';
import { JeedomService } from './jeedom.service';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LoggerService } from './logger.service';
import {
  VariableAddAction,
  VariableDeleteAction,
  VariableFillAction,
  VariableGetAction,
  VariableResetAction,
  VariableState,
  VariableUpdateAction
} from '@stores';
import { Observe } from '@alkemist/ngx-state-manager';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class VariableService extends DataStoreStateService<VariableFrontInterface, VariableBackInterface> {
  @Observe(VariableState, VariableState.lastUpdated)
  protected _lastUpdatedUserItems!: WritableSignal<Date | null>;
  protected _lastUpdatedPublicItems: undefined;

  constructor(
    private jeedomService: JeedomService,
    private messageService: MessageService,
    private loggerService: LoggerService,
    userService: UserService,
  ) {
    super(
      userService,
      'variable',
      VariableState,
      null,
      VariableState.items,
      null,
      VariableFillAction,
      VariableGetAction,
      VariableAddAction,
      VariableUpdateAction,
      VariableDeleteAction,
      VariableResetAction
    );
  }

  async exist(variable: VariableModel, id?: string) {
    const data = id
      ? await this.existUpdateItem(id, variable.toUniqueFields())
      : await this.existAddItem(variable.toUniqueFields());

    if (data.response) {
      this.messageService.add({
        severity: "error",
        detail: $localize`Variable already exist.`
      });
    }

    return data.response;
  }

  async update(id: string, variable: VariableModel) {
    await this.jeedomService.saveVariable(variable.key, variable.value);

    await super.dispatchUpdate(id, variable.toStore());
    this.messageService.add({
      severity: "success",
      detail: $localize`Variable updated`
    });
  }

  async syncVariable(variable: VariableModel) {
    const response = await this.jeedomService.getVariable(variable.key);
    if (response?.value) {
      if (response.value !== variable.value) {
        variable.value = response.value;

        void super.dispatchUpdate(variable.id, variable.toStore());
      }
    } else {
      await super.dispatchDelete(variable.id);
    }
  }

  async add(variable: VariableModel) {
    const response = await this.jeedomService.getVariable(variable.key);

    if (response?.value) {
      variable.value = response.value;

      await super.dispatchAdd(variable.toStore());
      this.messageService.add({
        severity: "success",
        detail: $localize`Variable added`,
      });
      return true;
    }
    return false;
  }

  async delete(variable: VariableModel) {
    await super.dispatchDelete(variable.id);
    this.messageService.add({
      severity: "success",
      detail: $localize`Variable deleted`
    });
  }
}

export const variableGetResolver: ResolveFn<VariableFrontInterface | null> =
  async (route: ActivatedRouteSnapshot) => {
    return inject(VariableService).dispatchUserItem(route.paramMap.get('slug')!);
  };
