import { Component, OnInit, ViewEncapsulation,ViewChild,ElementRef } from '@angular/core';
import { option } from '../model/option';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { StorageService } from 'src/app/services/storage.service';
@Component({
  selector: 'ngx-chart-show',
  templateUrl: './chart-show.component.html',
  styleUrls: ['./chart-show.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ChartShowComponent implements OnInit {
  revealed=false;
  defaultDepartment:string;;
  defaultCompany:string;
  @ViewChild('.reveal-button') revealbutton: ElementRef<HTMLElement>;
  parentEventHandlerFunction(valueEmitted) {
    this.options[valueEmitted.index]=valueEmitted;
    this.options[9]=valueEmitted;
    this.revealed=!this.revealed;
    // let el: HTMLElement = this.revealbutton.nativeElement;
    // el.click();
  }
  type = [
    'bar',
    'line',
    'pie',
    'area',
    'area stack',
    'rose pie',
    'horizontal bar',
  ];
  columns = [
    'met007',
    'met008',
    'met007',
    'met007',
    'met007',
    'met007',
    'met046',
    'met047',
    'met045',
  ];
  options = [
    new option(),
    new option(),
    new option(),
    new option(),
    new option(),
    new option(),
    new option(),
    new option(),
    new option(),
    new option(),
    new option(),
    new option(),
  ];
  constructor(private httpClient:HttpClient,private _storageService: StorageService) {
    for (let i = 0; i < 10; i++) {
      this.options[i].index = i;
      this.options[i].item = i < 7 ? this.type[i] : this.type[0];
      this.options[i].column = i < 9 ? this.columns[i] : this.columns[0];
      this.options[i].company = this.defaultCompany;
      this.options[i].department = this.defaultDepartment;
    }
  }
  ngOnInit() {
    // In the ngOnInit() or in the constructor
    const el = document.getElementById('nb-global-spinner');
    if (el) {
      el.style['display'] = 'none';
    }
    this.setDepartmentOptions();

    //document.oncontextmenu =function () {return false; };
  }
  setDepartmentOptions() {
    this.httpClient
      .get<any>(
        environment.SqlServer_KPI +
          "/api/Kpi/GetUserDepartments/"+this._storageService.userId+"/null"
      )
      .subscribe((data) => {
        this.defaultDepartment = data.map((p=>p.paramId))[0];
        this.defaultCompany=this.defaultDepartment=="3100"?"3000":"1000";
        switch(this.defaultDepartment)
        {
          case "1100":
            this.columns = [
              'met047',
              'met007',
              'met047',
              'met007',
              'met047',
              'met007',
              'met047',
              'met007',
              'met047',
              'met007',
            ];
            break;
            case "1200":
              this.columns = [
                'met007',
                'met008',
                'met010',
                'met044',
                'met046',
                'met007',
                'met008',
                'met010',
                'met044',
                'met046',
              ];
              break;
              case "3100":
                this.columns = [
                  'met007',
                  'met008',
                  'met048',
                  'met012',
                  'met014',
                  'met016',
                  'met007',
                  'met008',
                  'met048',
                  'met012',
                ];
                break;
        }


        for (let i = 0; i < 10; i++) {
          var aaa=new option();
          aaa.index = i;
          aaa.item = i < 7 ? this.type[i] : this.type[0];
          aaa.column = i < 9 ? this.columns[i] : this.columns[0];
          aaa.company = this.defaultCompany;
          aaa.department = this.defaultDepartment;
          this.options[i]=aaa;
          console.info(aaa);
        }
      });
  }
  test() {}
}
