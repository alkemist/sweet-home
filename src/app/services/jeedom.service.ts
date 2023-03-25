import { Injectable } from '@angular/core';
import { JSONRPCClient } from 'json-rpc-2.0';
import { UserService } from './user.service';
import { JeedomCommandResultInterface } from '../models/jeedom-command-result.interface';
import { JeedomRoomInterface } from '../models/jeedom-room.interface';

@Injectable({
  providedIn: 'root'
})
export class JeedomService {
  private api: JSONRPCClient;

  constructor(private userService: UserService) {
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
          return Promise.reject(new Error(response.statusText));
        }
      })
    );
  }

  getFullObjects(): Promise<JeedomRoomInterface[]> {
    return this.request("jeeObject::full") as Promise<JeedomRoomInterface[]>;
  }

  execInfoCommands(commandIds: number[]): Promise<Record<number, JeedomCommandResultInterface>> {
    return this.request("cmd::execCmd", { id: commandIds }) as
      Promise<Record<number, JeedomCommandResultInterface>>;
  }

  execActionCommand(commandId: number, options: unknown): Promise<JeedomCommandResultInterface> {
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
