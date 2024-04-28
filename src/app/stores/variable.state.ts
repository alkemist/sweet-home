import { Action, Select, State, StateContext } from '@alkemist/ngx-state-manager';
import {
  VariableAddAction,
  VariableDeleteAction,
  VariableFillAction,
  VariableGetAction,
  VariableResetAction,
  VariableUpdateAction
} from './variable.action';
import { DocumentFrontInterface, DocumentState, DocumentStateInterface } from '@alkemist/ngx-data-store';
import { VariableFrontInterface } from '@models';
import { environment } from '../../environments/environment';

interface VariableStateInterface extends DocumentStateInterface<VariableFrontInterface> {
}

@State({
  name: 'Variable',
  class: VariableState,
  defaults: <VariableStateInterface>{
    userItems: [] as VariableFrontInterface[],
    lastUpdatedUserItems: null,
    item: null,
  },
  showLog: environment['APP_DEBUG'],
  enableLocalStorage: true,
  determineArrayIndexFn: () => 'id',
})
export class VariableState extends DocumentState<VariableFrontInterface> {
  @Select('lastUpdatedUserItems')
  static lastUpdated<T extends DocumentFrontInterface>(state: DocumentStateInterface<T>) {
    return DocumentState.lastUpdatedUserItems<T>(state);
  }

  @Select('userItems')
  static items<T extends DocumentFrontInterface>(state: DocumentStateInterface<T>): T[] {
    return DocumentState.userItems(state);
  }

  @Select('item')
  static override item<T extends DocumentFrontInterface>(state: DocumentStateInterface<T>): T | null {
    return DocumentState.item(state);
  }

  @Action(VariableFillAction)
  fill(context: StateContext<VariableStateInterface>, payload: VariableFrontInterface[]) {
    super.fillUserItems(context, payload);
  }

  @Action(VariableGetAction)
  override get(context: StateContext<VariableStateInterface>, payload: VariableFrontInterface) {
    super.get(context, payload);
  }

  @Action(VariableAddAction)
  override add(context: StateContext<VariableStateInterface>, payload: VariableFrontInterface) {
    super.add(context, payload);
  }

  @Action(VariableUpdateAction)
  override update(context: StateContext<VariableStateInterface>, payload: VariableFrontInterface) {
    super.update(context, payload);
  }

  @Action(VariableDeleteAction)
  override remove(context: StateContext<VariableStateInterface>, payload: VariableFrontInterface) {
    super.remove(context, payload);
  }

  @Action(VariableResetAction)
  override reset(context: StateContext<VariableStateInterface>, payload: void) {
    super.reset(context, payload);
  }
}
