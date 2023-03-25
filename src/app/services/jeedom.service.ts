import { Injectable } from '@angular/core';
import { JSONRPCClient } from 'json-rpc-2.0';
import { UserService } from './user.service';
import { JeedomCommandResultInterface } from '../models/jeedom-command-result.interface';
import { JeedomRoomInterface } from '../models/jeedom-room.interface';
import { UnknownJeedomError } from '../errors/unknown-jeedom.error';
import { LoggerService } from './logger.service';

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

    this.api = new JSONRPCClient((jsonRPCRequest) =>
      fetch(jeedomApiUrl, {
        method: "POST",
        body: JSON.stringify(jsonRPCRequest),
      }).then((response) => {
        if (response.status === 200) {
          // Use client.receive when you received a JSON-RPC response.
          return response
            .json()
            .then((jsonRPCResponse) => this.api.receive(jsonRPCResponse));
        } else {
          this.loggerService.error(new UnknownJeedomError(response.statusText));
          return Promise.resolve();
        }
      })
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

  private request(method: string, params: Record<string, any> = {}) {
    const apikey = this.userService.getUserToken();
    if (!apikey) {
      return Promise.resolve();
    }

    return this.api.request(method, {
      ...params,
      apikey
    });
  }
}
