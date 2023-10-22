export namespace Device {
  /*export interface StateInterface extends ValueRecord {
    all: DeviceStoredInterface[];
    lastUpdated: Date | null;
  }

  export class Fill extends FillDocuments<DeviceStoredInterface> {
    static readonly log: string = '[Device] Filled';

    constructor(public override payload: DeviceStoredInterface[]) {
      super(payload);
    }
  }

  export class Add extends AddDocument<DeviceStoredInterface> {
    static readonly log: string = '[Device] Added';

    constructor(public override payload: DeviceStoredInterface) {
      super(payload);
    }
  }

  export class Update extends UpdateDocument<DeviceStoredInterface> {
    static readonly log: string = '[Device] Added';

    constructor(public override payload: DeviceStoredInterface) {
      super(payload);
    }
  }

  export class Remove extends RemoveDocument<HasIdInterface> {
    static readonly log: string = '[Device] Removed';

    constructor(public override payload: HasIdInterface) {
      super(payload);
    }
  }

  export class Invalide extends InvalideDocuments<DeviceStoredInterface> {
    static readonly log: string = '[Device] Invalided';

    constructor(public payload: void) {
      super();
    }
  }

  @State({
    class: StateModel,
    name: 'device',
    defaults: <StateInterface>{
      all: [],
      lastUpdated: null,
    },
    showLog: true,
    enableLocalStorage: true
  })
  export class StateModel {
    @Select('lastUpdated')
    static lastUpdated(state: StateInterface): Date | null {
      return state.lastUpdated;
    }

    @Select('all')
    static all(state: StateInterface): DeviceStoredInterface[] {
      return state.all;
    }

    @Action(Fill)
    fill({
           setState
         }: StateContext<StateInterface>, { payload }: FillDevices) {
      setState({
        all: payload,
        lastUpdated: environment["APP_OFFLINE"] ? null : new Date()
      });
    }

    @Action(Invalide)
    invalidate({
                 setState
               }: StateContext<StateInterface>, {}: FillDevices) {
      setState({
        all: [],
        lastUpdated: null
      });
    }

    @Action(Add)
    add({ addItem }: StateContext<StateInterface>, { payload }: AddDevice) {
      addItem('all', payload);
    }

    @Action(Remove)
    remove({ removeItem }: StateContext<StateInterface>, { payload }: RemoveDevice) {
      removeItem<DeviceStoredInterface>('all', item => item.id === payload.id);
    }

    @Action(Update)
    update({
             patchItem
           }: StateContext<StateInterface>, { payload }: UpdateDevice) {
      patchItem<DeviceStoredInterface>('all', item => item.id === payload.id, payload)
    }
  }*/
}
