import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UriConfig } from '../../configs/uri-config';

@Injectable({
  providedIn: 'root'
})
export class KpiService {

  constructor(private httpClient: HttpClient,
    private uriConstant: UriConfig) { }

  get() {
    return this.httpClient.get(this.uriConstant.KpiUri);
  }

  delete(id) {
    return this.httpClient.delete(`${this.uriConstant.KpiUri}?id=${id}`);
  }

  update(kpi) {
    return this.httpClient.patch(this.uriConstant.KpiUri, kpi);
  }

  add(kpi) {
    return this.httpClient.post(this.uriConstant.KpiUri, kpi);
  }
}
