import { Injectable } from '@angular/core';
import { JSONRPCClient } from 'json-rpc-2.0';
import { UserService } from './user.service';
import { JeedomCommandResultInterface } from '@models';
import { JeedomRoomInterface } from '../models/jeedom-room.interface';
import { LoggerService } from './logger.service';
import { JeedomApiError } from '../errors/jeedom-api.error';
import { WrongApiKeyError } from '@errors';
import { UnknownJeedomError } from '../errors/unknown-jeedom.error';

@Injectable({
  providedIn: 'root'
})
export class JeedomService {
  private api: JSONRPCClient;

  constructor(
    private userService: UserService,
    private loggerService: LoggerService
  ) {
    const jeedomApiUrl = `${ process.env['JEEDOM_HOST'] }/core/api/jeeApi.php`;

    this.api = new JSONRPCClient((jsonRPCRequest) => {
        return fetch(jeedomApiUrl, {
          method: "POST",
          body: JSON.stringify(jsonRPCRequest),
        }).then((response) => {
          if (response.status === 200) {
            // Use client.receive when you received a JSON-RPC response.
            return response
              .json()
              .then((jsonRPCResponse) => this.api.receive(jsonRPCResponse));
          }

          this.loggerService.error(new JeedomApiError(response));
          return Promise.resolve();
        }).catch((e) => {
          this.loggerService.error(new UnknownJeedomError(e));
          console.info('/!\ CATCH fetch')
          throw e;
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

  execActionCommand(commandId: number, options?: unknown): Promise<JeedomCommandResultInterface | null> {
    return this.request("cmd::execCmd", { id: commandId, options }) as
      Promise<JeedomCommandResultInterface>;
  }

  private request(method: string, params: Record<string, any> = {}): PromiseLike<any> {
    const apikey = this.userService.getUserToken();
    if (!apikey) {
      this.loggerService.error(new WrongApiKeyError());
      return Promise.resolve();
    }

    return this.api.request(method, {
      ...params,
      apikey
    });
  }
}
