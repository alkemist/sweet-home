import { Injectable } from '@angular/core';
import { UserService } from '@app/services/user.service';
import { JSONRPCClient } from 'json-rpc-2.0';

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

  request(method: string, params: Record<string, any> = {}) {
    return this.api.request(method, {
      ...params,
      apikey: this.userService.getUserToken()
    });
  }
}
