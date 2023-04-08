import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, first, switchMap, throwError } from 'rxjs';
import { XmlHelper } from '@tools';
import { SoapError } from '@errors';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class SoapApiService {
  readonly serviceNane: string = 'AVTransport';
  readonly controlUrl: string = 'MediaRenderer/AVTransport/Control';
  readonly eventSubUrl: string = 'MediaRenderer/AVTransport/Event';

  constructor(
    protected http: HttpClient,
    protected loggerService: LoggerService,
  ) {
  }

  protected _ip: string = 'sonos-beam';

  set ip(ip: string) {
    this._ip = ip;
  }

  async action(action: string, body: any = {}) {
    const headers = new HttpHeaders({
      'SOAPAction': `"urn:schemas-upnp-org:service:${ this.serviceNane }:1#${ action }"`,
      'Content-type': 'text/xml; charset=utf8',
    });
    const envelop = this.envelop(action, {
      ...body,
      InstanceID: 0
    });
    const xmlEnvelope = XmlHelper.encodeXml(envelop);

    console.log('body', body);
    console.log('envelop', envelop);
    console.log('xmlEnvelope', xmlEnvelope);

    return new Promise<void>(resolve => {
      this.http.post(
        `${ this._ip }/${ this.controlUrl }`,
        xmlEnvelope,
        {
          headers: headers,
          responseType: 'text'
        },
      ).pipe(
        first(),
        catchError((err) => this.handleError(err)),
        switchMap(async (xmlResult) => XmlHelper.decodeXml(xmlResult)),
      ).subscribe((result) => {
        console.log('result', result);
        resolve();
      })
    });
  }

  metadata(rId: number, type: string, id: string) {
    return {
      'DIDL-Lite': {
        $: {
          'xmlns': "urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/",
          'xmlns:dc': "http://purl.org/dc/elements/1.1/",
          'xmlns:r': "urn:schemas-rinconnetworks-com:metadata-1-0/",
          'xmlns:upnp': "urn:schemas-upnp-org:metadata-1-0/upnp/"
        },
        'item': {
          $: {
            'id': `${ rId }spotify%3a${ type }%3a${ id }`,
            'restricted': 'true'
          },
          'dc:title': '',
          'upnp:class': 'object.item.audioItem.musicTrack',
          'desc': {
            $: {
              'id': 'cdudn',
              'nameSpace': "urn:schemas-rinconnetworks-com:metadata-1-0/"
            },
            _: 'SA_RINCON2311_X_#Svc2311-0-Token'
          }
        }
      }
    }
  }

  envelop(action: string, body: object) {
    const envelop: Record<string, any> = {
      's:Envelope': {
        $: {
          'xmlns:s': "http://schemas.xmlsoap.org/soap/envelope/",
          's:encodingStyle': "http://schemas.xmlsoap.org/soap/encoding/",
        },
        's:Body': {}
      },
    };
    envelop['s:Envelope']['s:Body'][`u:${ action }`] = {
      $: {
        'xmlns:u': `urn:schemas-upnp-org:service:${ this.serviceNane }:1`
      },
      ...body
    };

    return envelop;
  }

  test() {
    /*const xml = "<root>Hello xml2js!</root>";
    const xmlToJson = await parseStringPromise(xml, { trim: true });
    console.log(xmlToJson);

    const obj = { name: "Super", Surname: "Man", age: 23 };
    const jsonToXml = builder.buildObject(obj);
    console.log(jsonToXml);*/

    /*const envelope = this.envelop({
      'u:AddURIToQueue': {
        $: {
          'xmlns:u': "urn:schemas-upnp-org:service:AVTransport:1"
        },
        'EnqueuedURI': '',
        'EnqueuedURIMetaData': '',
        'DesiredFirstTrackNumberEnqueued': 0,
        'EnqueueAsNext': 1
      }
    });
    console.log(this._builder.buildObject(envelope));*/
  }

  private handleError(httpError: HttpErrorResponse) {
    const error = new SoapError(httpError);
    this.loggerService.error(error)
    return throwError(() => error);
  }
}
