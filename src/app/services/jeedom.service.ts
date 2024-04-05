import { Injectable } from "@angular/core";
import { JSONRPCClient } from "json-rpc-2.0";
import { JeedomCommandResultInterface } from "@models";
import { JeedomRoomInterface } from "../models/jeedom/jeedom-room.interface";
import { LoggerService } from "./logger.service";
import { JeedomApiError, JeedomRequestError, UnknownJeedomError, UserHasNotTokenError } from "@errors";
import { environment } from "../../environments/environment";
import { JeedomStatisticInterface } from '../models/jeedom/jeedom-statistic.interface';
import { JeedomHistoryInterface } from '../models/jeedom/jeedom-history.interface';
import { DataStoreUserService } from '@alkemist/ngx-data-store';

@Injectable({
  providedIn: "root"
})
export class JeedomService {
  private api: JSONRPCClient;

  constructor(
    private userService: DataStoreUserService,
    private loggerService: LoggerService
  ) {
    const jeedomApiUrl = `${ environment["JEEDOM_HOST"] }/core/api/jeeApi.php`;

    this.api = new JSONRPCClient(async (jsonRPCRequest) => {
        return fetch(jeedomApiUrl, {
          method: "POST",
          body: JSON.stringify(jsonRPCRequest),
        }).then(async (response) => {
          if (response.status === 200) {
            return response
              .json()
              .then((jsonRPCResponse) => {
                if (jsonRPCResponse.id === 99999) {
                  this.loggerService.error(new JeedomApiError(jsonRPCResponse.error));
                }

                return this.api.receive(jsonRPCResponse);
              });
          }

          this.loggerService.error(new JeedomRequestError(response));
          return Promise.resolve();
        }).catch((e) => {
          this.loggerService.error(new UnknownJeedomError(e));
        });
      }
    );
  }

  getFullObjects(): Promise<JeedomRoomInterface[] | null> {
    return this.request("jeeObject::full") as Promise<JeedomRoomInterface[]>;
  }

  execInfoCommands(commandIds: number[]): Promise<Record<number, JeedomCommandResultInterface> | null> {
    return this.request("cmd::execCmd", { id: commandIds }) as
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

  private request(method: string, params: Record<string, any> = {}): PromiseLike<any> {
    const apikey = this.userService.getLoggedUser()!.data['jeedom'];

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
}
