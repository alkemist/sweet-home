import { HttpHeaders } from '@angular/common/http';

export abstract class ApiHelper {
  static buildHeaders(tokenType: string, accessToken: string, contentType?: string, isCors = false) {
    const headers: Record<string, string> = {
      'Authorization': `${ tokenType } ${ accessToken }`
    }

    if (contentType) {
      headers['Content-Type'] = contentType;
    }
    if (isCors) {
      headers['Access-Control-Allow-Origin'] = '*';
      // headers['Access-Control-Request-Method'] = 'POST, GET, OPTIONS';
      headers['Access-Control-Allow-Headers']
        = 'Origin, X-Requested-With, Content-Type, Accept, cache-control, pragma, expires';
      headers['Charset'] = 'utf-8';
    }

    return new HttpHeaders(headers);
  }
}
