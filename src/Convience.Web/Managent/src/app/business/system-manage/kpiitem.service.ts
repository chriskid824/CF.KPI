import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UriConfig } from '../../configs/uri-config';

@Injectable({
  providedIn: 'root'
})
export class KpiitemService {

  constructor(private httpClient: HttpClient,
    private uriConstant: UriConfig) { }

  get() {
    return this.httpClient.get(this.uriConstant.KpiItemUri);
  }

  delete(id) {
    return this.httpClient.delete(`${this.uriConstant.KpiItemUri}?id=${id}`);
  }

  updateGroupItem(item) {
    return this.httpClient.put(this.uriConstant.KpiItemUri+"/GroupItemDetail", item);
  }
  updateIndicator(item) {
    return this.httpClient.put(this.uriConstant.KpiItemUri+"/IndicatorDetail", item);
  }
  add(item) {
    return this.httpClient.post(this.uriConstant.KpiItemUri, item);
  }
}
