import { Injectable } from "@angular/core";
import { JSONRPCClient, JSONRPCResponse } from "json-rpc-2.0";
import { JeedomCommandResultInterface, JeedomScenarioInterface, JeedomScenarioState, LoaderModel } from "@models";
import { JeedomRoomInterface } from "../models/jeedom/jeedom-room.interface";
import { LoggerService } from "./logger.service";
import { JeedomApiError, JeedomRequestError, UnknownJeedomError, UserHasNotTokenError } from "@errors";
import { environment } from "../../environments/environment";
import { JeedomStatisticInterface } from '../models/jeedom/jeedom-statistic.interface';
import { JeedomHistoryInterface } from '../models/jeedom/jeedom-history.interface';
import { UserService } from './user.service';
import { MapBuilder } from './map.builder';
import { JeedomScenarioModel } from '../models/jeedom/jeedom-scenario.model';

@Injectable({
  providedIn: "root"
})
export class JeedomService {
  pollingDelay = 5000;
  private jeedomApiUrl = `${ environment["JEEDOM_HOST"] }/core/api/jeeApi.php`;
  private api: JSONRPCClient;
  private pollingApi: JSONRPCClient;
  private autoincrementId = 0;

  constructor(
    private userService: UserService,
    private loggerService: LoggerService,
    private mapBuilder: MapBuilder,
  ) {

    this.api = new JSONRPCClient(async (jsonRPCRequest) => this.runQuery(jsonRPCRequest));

    this.pollingApi = new JSONRPCClient(async (jsonRPCRequest) => {
        const callLoader = this.mapBuilder.globalLoader.addLoader();
        return fetch(this.jeedomApiUrl, {
          method: "POST",
          body: JSON.stringify(jsonRPCRequest),
        }).then(async (response) => {
          return response
            .json()
            .then((jsonRPCResponse) => {
              this.nextPolling(callLoader);
              return this.checkPollingResponse(response, jsonRPCResponse);
            });
        }).catch((e) => {
          this.nextPolling(callLoader);
          this.loggerService.error(new UnknownJeedomError(e));
        });
      }
    );
  }

  runQuery(jsonRPCRequest: any): any {
    return fetch(this.jeedomApiUrl, {
      method: "POST",
      body: JSON.stringify(jsonRPCRequest),
    }).then(async (response) => {
      return response
        .json()
        .then((jsonRPCResponse) => {
          return this.checkResponse(response, jsonRPCResponse);
        });
    }).catch((e) => {
      this.loggerService.error(new UnknownJeedomError(e));
      return this.runQuery(jsonRPCRequest);
    });
  }

  getFullObjects(): Promise<JeedomRoomInterface[] | null> {
    return this.request("jeeObject::full") as Promise<JeedomRoomInterface[]>;
  }

  execPollingInfoCommands(commandIds: number[]): Promise<Record<number, JeedomCommandResultInterface> | null> {
    return this.pollingRequest("cmd::execCmd", { id: commandIds }) as
      Promise<Record<number, JeedomCommandResultInterface>>;
  }

  execHistoryCommand(commandId: number, dateStart: string = '', dateEnd: string = ''): Promise<JeedomHistoryInterface[]> {
    return this.request("cmd::getHistory", {
        id: commandId,
        startTime: dateStart,
        endTime: dateEnd
      }
    ) as Promise<JeedomHistoryInterface[]>;
  }

  execTrendCommand(commandId: number, dateStart: string = '', dateEnd: string = ''): Promise<number> {
    return this.request("cmd::getTendance", { id: commandId, dateStart, dateEnd }) as
      Promise<number>;
  }

  execStatisticCommand(commandId: number, dateStart: string = '', dateEnd: string = ''): Promise<JeedomStatisticInterface> {
    return this.request("cmd::getStatistique", { id: commandId, dateStart, dateEnd }) as
      Promise<any>;
  }

  execActionCommand(commandId: number, options?: unknown): Promise<JeedomCommandResultInterface | null> {
    return this.request("cmd::execCmd", { id: commandId, options }) as
      Promise<JeedomCommandResultInterface>;
  }

  async listScenarios(): Promise<JeedomScenarioModel[]> {
    const scenarios: JeedomScenarioInterface[] = await this.request("scenario::all", {});
    return scenarios
      .map((scenario) => new JeedomScenarioModel(scenario))
      .filter(scenario => scenario.isVisible);
  }

  setScenarioState(id: string, state: JeedomScenarioState): Promise<JeedomCommandResultInterface | null> {
    return this.request("scenario::changeState", { id, state }) as
      Promise<JeedomCommandResultInterface>;
  }

  private async request(method: string, params: Record<string, any> = {}) {
    const apikey = await this.userService.getJeedomApiKey();

    if (environment["APP_OFFLINE"]) {
      return Promise.resolve({});
    } else if (!apikey) {
      this.loggerService.error(new UserHasNotTokenError());
      throw new UserHasNotTokenError();
    }

    return this.api.request(method, {
      ...params,
      apikey
    });
  }

  private async pollingRequest(method: string, params: Record<string, any> = {}) {
    const apikey = await this.userService.getJeedomApiKey();

    if (environment["APP_OFFLINE"]) {
      return Promise.resolve({});
    } else if (!apikey) {
      this.loggerService.error(new UserHasNotTokenError());
      throw new UserHasNotTokenError();
    }

    return this.pollingApi.request(method, {
      ...params,
      apikey
    });
  }

  private checkResponse(response: Response, jsonRPCResponse: JSONRPCResponse) {
    if (response.status !== 200) {
      this.loggerService.error(new JeedomRequestError(response));
    } else if (jsonRPCResponse.id === 99999) {
      this.loggerService.error(new JeedomApiError(jsonRPCResponse.error));
    } else {
      this.autoincrementId = jsonRPCResponse.id as number;
      return this.api.receive(jsonRPCResponse);
    }

    this.autoincrementId++;
    return this.api.receive({
      jsonrpc: jsonRPCResponse.jsonrpc,
      id: this.autoincrementId,
      result: {}
    });
  }

  private checkPollingResponse(response: Response, jsonRPCResponse: JSONRPCResponse) {
    if (response.status !== 200) {
      this.loggerService.error(new JeedomRequestError(response));
    } else if (jsonRPCResponse.id === 99999) {
      this.loggerService.error(new JeedomApiError(jsonRPCResponse.error));
    } else {
      this.autoincrementId = jsonRPCResponse.id as number;
      return this.pollingApi.receive(jsonRPCResponse);
    }

    this.autoincrementId++;
    return this.pollingApi.receive({
      jsonrpc: jsonRPCResponse.jsonrpc,
      id: this.autoincrementId,
      result: {}
    });
  }

  private nextPolling(callLoader: LoaderModel) {
    callLoader.finish();
    this.mapBuilder.pollingLoader.addLoader(this.pollingDelay);
  }
}
