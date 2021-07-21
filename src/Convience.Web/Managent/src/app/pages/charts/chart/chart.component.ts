import { Component, OnInit, Input,EventEmitter,Output,OnChanges, SimpleChanges } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { StorageService } from 'src/app/services/storage.service';
import { Router } from "@angular/router";
import { environment } from "../../../../environments/environment";
import { option } from '../model/option';
@Component({
  selector: "ngx-chart",
  templateUrl: "./chart.component.html",
  styleUrls: ["./chart.component.scss"],
})
export class ChartComponent implements OnInit,OnChanges {
@Output()
buttonClicked:EventEmitter<option>=new EventEmitter<option>();
  @Input() inputOption: option;
  ouputOption=new option();
  selectedItem = "line";
  selectedColumn = "met007";
  selectedCompany = "3000";
  selectedDepartment = "3100";
  options: any;
  columnoptions;
  departments;
  companys;
  sourcedata: any;
  route;
  constructor(private httpClient: HttpClient, public router: Router,private _storageService: StorageService) {
    this.route = this.router;
  }
  ngOnInit(): void {
    this.ouputOption.index=this.inputOption==undefined?0:this.inputOption.index;
    this.selectedItem = this.inputOption == undefined ? "line" : this.inputOption.item;


    this.setDepartmentOptions();
    this.setColumnOptions();
    this.setData();
    this.httpClient
      .get<any>(environment.SqlServer_KPI + "/api/Kpi/GetUserCompanys/"+this._storageService.userId)
      .subscribe((data) => {
        this.companys = data;
      });
  }
  clickButton=()=>{
    this.ouputOption.item=this.selectedItem;
    this.ouputOption.column=this.selectedColumn;
    this.ouputOption.department=this.selectedDepartment;
    this.ouputOption.company=this.selectedCompany;
    this.buttonClicked.emit(this.ouputOption);
  }
  onCompanyChange(event) {
    this.setDepartmentOptions();
    this.setData();
  }
  onDepartmentChange(department) {
    this.setColumnOptions();
    this.setData();
  }
  ngOnSelectChanges(event): void {
    this.setData();
  }
  ngOnChanges(changes: SimpleChanges) {
    this.selectedItem=this.inputOption.item;
    this.selectedColumn=this.inputOption.column;
    this.selectedCompany=this.inputOption.company;
    this.selectedDepartment=this.inputOption.department;
    console.info(this.inputOption);
    this.setColumnOptions();
    this.setData();
  }
  setDepartmentOptions() {
    this.httpClient
      .get<any>(
        environment.SqlServer_KPI +
          "/api/Kpi/GetUserDepartments/"+this._storageService.userId+"/" +
          this.selectedCompany
      )
      .subscribe((data) => {
        this.departments = data;
      });
  }
  setColumnOptions() {
    console.info(this.selectedDepartment);
    this.httpClient
      .get<any>(environment.SqlServer_KPI + "/api/Kpi/GetChartColumn/"+this.selectedDepartment+"/"+this.selectedCompany)
      .subscribe((data) => {
        this.columnoptions = data;
      });
  }
  setData() {
    var xAxisData = [];
    var items = ["目標值", "實際值"];
    var series = [];
    var route = this.router;
    this.httpClient
      .get<any>(
        environment.SqlServer_KPI +
          "/api/Chart/GetChartData/" +
          this.selectedColumn +
          "/" +
          this.selectedDepartment +
          "/" +
          this.selectedCompany
      )
      .subscribe((data) => {
        xAxisData = data
          .map((item) => item.month)
          .filter((value, index, self) => self.indexOf(value) === index);
        for (let item of items) {
          let seriesdata = [];
          for (let x of xAxisData) {
            if (item === "目標值") {
              if (
                data.find((p) => p.month === x && p.subitem == "sub001") !=
                undefined
              ) {
                seriesdata.push(
                  data.find((p) => p.month === x && p.subitem == "sub001").value
                );
              }
            } else if (item === "實際值") {
              if (
                data.find((p) => p.month === x && p.subitem == "sub002") !=
                undefined
              ) {
                seriesdata.push(
                  data.find((p) => p.month === x && p.subitem == "sub002").value
                );
              }
            }
          }
          // 這裡改了線的type設定
          switch (this.selectedItem) {
            case "area":
              series.push({
                name: item,
                type: "line",
                data: seriesdata,
                areaStyle: { normal: {} },
                animationDelay: (idx) => idx * 10,
              });
              break;
            case "area stack":
              series.push({
                name: item,
                type: "line",
                stack: "counts",
                data: seriesdata,
                areaStyle: { normal: {} },
                animationDelay: (idx) => idx * 10,
              });
              break;
            case "horizontal bar":
              series.push({
                name: item,
                type: "bar",
                data: seriesdata,
                animationDelay: (idx) => idx * 10,
              });
              break;
              break;
            case "rose pie":
              series.push({
                name: item,
                type: "pie",
                roseType: "area",
                data: seriesdata,
                animationDelay: (idx) => idx * 10,
              });
              break;
            case "radar":
              series.push({
                name: item,
                type: "radar",
                data: seriesdata,
                animationDelay: (idx) => idx * 10,
              });
              break;
            default:
              series.push({
                name: item,
                type: this.selectedItem,
                data: seriesdata,
                animationDelay: (idx) => idx * 10,
              });
              break;
          }
        }
        switch (this.selectedItem) {
          case "pie":
            this.options = {
              legend: {
                data: items, //公司名稱
                align: "left",
              },
              tooltip: {},

              series: series,
              animationEasing: "elasticOut",
              animationDelayUpdate: (idx) => idx * 5,
              grid: {
                left: "3%",
                right: "4%",
                bottom: "3%",
                containLabel: true,
              },
            };
            break;
          case "rose pie":
            this.options = {
              legend: {
                data: items, //公司名稱
                align: "left",
              },
              tooltip: {},

              series: series,
              animationEasing: "elasticOut",
              animationDelayUpdate: (idx) => idx * 5,
              grid: {
                left: "3%",
                right: "4%",
                bottom: "3%",
                containLabel: true,
              },
            };
            break;
          case "horizontal bar":
            this.options = {
              legend: {
                data: items, //公司名稱
                align: "left",
              },
              tooltip: {
                trigger: "axis",
                axisPointer: {
                  type: "cross",
                  label: {
                    backgroundColor: "#6a7985",
                  },
                },
              },
              xAxis: {
                type: "value",
                silent: false,
                splitLine: {
                  show: false,
                },
              },
              yAxis: { type: "category", data: xAxisData },
              series: series,
              animationEasing: "elasticOut",
              animationDelayUpdate: (idx) => idx * 5,
              grid: {
                left: "3%",
                right: "4%",
                bottom: "3%",
                containLabel: true,
              },
            };
            break;
          case "radar":
            this.options = {
              legend: {
                data: items, //公司名稱
                align: "left",
              },
              tooltip: {},
              radar: {
                indicator: [
                  { name: "1月", max: 6500 },
                  { name: "2月", max: 16000 },
                  { name: "3月", max: 30000 },
                  { name: "4月", max: 38000 },
                ],
              },
              series: series,
              animationEasing: "elasticOut",
              animationDelayUpdate: (idx) => idx * 5,
              grid: {
                left: "3%",
                right: "4%",
                bottom: "3%",
                containLabel: true,
              },
            };
            break;
          default:
            this.options = {
              legend: {
                data: items, //公司名稱
                align: "left",
              },
              tooltip: {
                trigger: "axis",
                axisPointer: {
                  type: "cross",
                  label: {
                    backgroundColor: "#6a7985",
                  },
                },
              },
              xAxis: {
                data: xAxisData,
                silent: false,
                splitLine: {
                  show: false,
                },
              },
              yAxis: {},
              series: series,
              animationEasing: "elasticOut",
              animationDelayUpdate: (idx) => idx * 5,
              grid: {
                left: "3%",
                right: "4%",
                bottom: "3%",
                containLabel: true,
              },
            };
            break;
        }
        var selectcolumnname=this.columnoptions.filter(p=>p.paramId==this.selectedColumn).map((item)=>item.paramValue);
        this.options.title = {
          text: selectcolumnname,
        };
        this.options.toolbox = {
          show: true,
          feature: {
            myTool1: {
              show: true,
              title: "圖表縮放",
              icon: "path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891",
              onclick:this.clickButton
              //function () {
                // route.parent.paramMap.subscribe((params) => {
                //   console.info(params);
                //   if (params.has("accountid")) {
                //     //this.'accountid'= params.get('accountid');
                //     //params.set
                //   }
                // });
              //},
            },
            dataZoom: {
              yAxisIndex: "none",
            },
            dataView: { readOnly: false },
            // magicType: { type: ["line", "bar"] },
            restore: {},
            saveAsImage: {},
          },
        };
      });
  }
}
