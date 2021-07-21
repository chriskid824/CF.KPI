import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UriConfig } from '../configs/uri-config';

@Injectable({
  providedIn: 'root'
})
export class KpiService {

  constructor(private httpClient: HttpClient,
    private uriConstant: UriConfig) { }

  get() {
    return this.httpClient.get(this.uriConstant.KpiUri);
  }




}
