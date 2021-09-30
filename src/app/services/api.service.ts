import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParameterCodec, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  apiRootUrl = 'https://api.github.com/'

  constructor(private httpClient: HttpClient) {}

  get(url: string, paramsObj?: { [key: string]: any }, headersObj?: { [key: string]: any }): Observable<any> {
    let headers = new HttpHeaders();
    if (headersObj) {
      for (let header in headersObj) {
        headers = headers.append(header, headersObj[header]);
      }
    } else {
      headers = headers.append('Content-Type', 'application/json');
      headers = headers.append('Accept', 'application/json');
    }
    let params = new HttpParams({ encoder: new CustomEncoder() });
    if (paramsObj) {
      for (let param in paramsObj) {
        params = params.append(param, paramsObj[param]);
      }
    }
    return this.httpClient.get(`${this.apiRootUrl}${url}`, { headers, params });
  }
}

class CustomEncoder implements HttpParameterCodec {
  encodeKey(key: string): string {
    return encodeURIComponent(key);
  }

  encodeValue(value: string): string {
    return encodeURIComponent(value);
  }

  decodeKey(key: string): string {
    return decodeURIComponent(key);
  }

  decodeValue(value: string): string {
    return decodeURIComponent(value);
  }
}
