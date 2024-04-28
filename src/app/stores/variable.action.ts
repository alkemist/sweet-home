import { VariableBackInterface } from '@models';
import { StateAction } from '@alkemist/ngx-state-manager';

export class VariableFillAction extends StateAction<VariableBackInterface[]> {
  static override readonly key = "Fill";

  constructor(public payload: VariableBackInterface[]) {
    super();
  }
}

export class VariableGetAction extends StateAction<VariableBackInterface> {
  static override readonly key = "Variable_Get";

  constructor(public payload: VariableBackInterface) {
    super();
  }
}

export class VariableAddAction extends StateAction<VariableBackInterface> {
  static override readonly key = "Variable_Add";

  constructor(public payload: VariableBackInterface) {
    super();
  }
}

export class VariableUpdateAction extends StateAction<VariableBackInterface> {
  static override readonly key = "Variable_Update";

  constructor(public payload: VariableBackInterface) {
    super();
  }
}

export class VariableDeleteAction extends StateAction<VariableBackInterface> {
  static override readonly key = "Variable_Delete";

  constructor(public payload: VariableBackInterface) {
    super();
  }
}

export class VariableResetAction extends StateAction<void> {
  static override readonly key = "Variable_Reset";

  constructor(public payload: void) {
    super();
  }
}
