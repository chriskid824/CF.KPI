import { Component, OnInit, ViewEncapsulation, Inject } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { AgGridAngular } from "ag-grid-angular";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { KpiDialogComponent } from "../kpi-dialog/kpi-dialog.component";
import { isNgTemplate, unescapeIdentifier } from "@angular/compiler";
import { formatCurrency, formatPercent } from "@angular/common";
import { catchError, retry } from "rxjs/operators";
import { Observable, throwError } from "rxjs";
import { UserService } from 'src/app/business/system-manage/user.service';
import { StorageService } from 'src/app/services/storage.service';
class DialogData {
  paramid: string;
  paramname:string;
  columnname:string;
  data: any;
  constructor() {  }
}
export interface DetailOptions {
  getDetailRowData: any;
  detailGridOptions: any;
}

let map = new Map<string, number>();
let firstrowindex = new Map<string, number>();
@Component({
  selector: "ngx-kpi-main",
  templateUrl: "./kpi-main.component.html",
  styleUrls: ["./kpi-main.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class KpiMainComponent implements OnInit {
  checkOptionsOne = [
    { label: 'Apple', value: 'Apple', checked: true },
    { label: 'Pear', value: 'Pear' },
    { label: 'Orange', value: 'Orange' }
  ];
  checkOptionsTwo = [
    { label: 'Apple', value: 'Apple' },
    { label: 'Pear', value: 'Pear', checked: true },
    { label: 'Orange', value: 'Orange' }
  ];
  checkOptionsThree = [
    { label: 'Apple', value: 'Apple', disabled: true, checked: true },
    { label: 'Pear', value: 'Pear', disabled: true },
    { label: 'Orange', value: 'Orange' }
  ];

  log(value: object[]): void {
    console.log(value);
  }
  columnDefs;
  columnDefs2;
  columnDefsMenu;
  defaultColDef;
  autoGroupColumnDef;
  rowGroupPanelShow;
  rowData: [];
  suppressRowTransform;
  components;
  detailCellRendererParams;
  gridApi;
  columnApi;
  companys: [];
  departments: [];
  selectedCompany: string;
  selectedDepartment : string;
  show = false;
  // Using Map
  // map = new Map<string, number>();
  constructor(private httpClient: HttpClient, private dialog: MatDialog, private _storageService: StorageService,private _userService: UserService) {
    this.suppressRowTransform = true;
    // this.rowGroupPanelShow='always';
    this.defaultColDef = {
      editable: false,
      filter: "agTextColumnFilter",
      // floatingFilter: true,
      resizable: true,
      // wrapText: true,
      // autoHeight: true,
    };
    this.columnDefs = [
      {
        field: "faceitem",
        hide: true,
      },
      {
        headerName: "構面",
        field: "facename",
        enableRowGroup: true,
        chartDataType: "category",
        pinned: "left",
        rowSpan: this.rowSpan_face,
        cellClass: "show-cell",
        width: 150,
      },
      {
        field: "targetitem",
        hide: true,
      },
      {
        headerName: "目標項目",
        field: "targetname",
        enableRowGroup: true,
        chartDataType: "category",
        pinned: "left",
        rowSpan: this.rowSpan_target,
        cellClass: "show-cell",
        width: 150,
      },
      {
        field: "paramid",
        hide: true,
      },
      {
        headerName: "衡量指標項目",
        field: "paramname",
        pinned: "left",
        rowSpan: this.rowSpan_param,
        cellClass: "show-cell",
      },
      {
        headerName: "定義/計算公式",
        field: "fomular",
        minWidth: 180,
        rowSpan: this.rowSpan_param,
        cellClass: "show-cell",
      },
      {
        headerName: "單位",
        field: "unit",
        rowSpan: this.rowSpan_param,
        cellClass: "show-cell",
      },
      {
        headerName: "權重/指標",
        field: "weight",
        rowSpan: this.rowSpan_param,
        cellClass: "show-cell",
      },
      {
        headerName: "年目標值",
        field: "goalyear",
        rowSpan: this.rowSpan_param,
        cellClass: "show-cell",
      },
      {
        headerName: "月份",
        field: "valuetype",
        editable: "false",
        cellRenderer: "agGroupCellRenderer",
        chartDataType:'series'
      },
      {
        headerName: "1月",
        field: "jan",
        editable: "false",
        valueFormatter: currencyFormatter,

      },
      {
        headerName: "2月",
        field: "feb",
        editable: "false",
        valueFormatter: currencyFormatter,

      },
      {
        headerName: "3月",
        field: "mar",
        editable: "false",
        valueFormatter: currencyFormatter,

      },
      {
        headerName: "4月",
        field: "apr",
        editable: "false",
        valueFormatter: currencyFormatter,
      },
      {
        headerName: "5月",
        field: "may",
        editable: "false",
        valueFormatter: currencyFormatter,
      },
      {
        headerName: "6月",
        field: "jun",
        editable: "false",
        valueFormatter: currencyFormatter,
      },
      {
        headerName: "7月",
        field: "jul",
        editable: "false",
        valueFormatter: currencyFormatter,
      },
      {
        headerName: "8月",
        field: "aug",
        editable: "false",
        valueFormatter: currencyFormatter,
      },
      {
        headerName: "9月",
        field: "sep",
        editable: "false",
        valueFormatter: currencyFormatter,
      },
      {
        headerName: "10月",
        field: "oct",
        editable: "false",
        valueFormatter: currencyFormatter,
      },
      {
        headerName: "11月",
        field: "nov",
        editable: "false",
        valueFormatter: currencyFormatter,
      },
      {
        headerName: "12月",
        field: "dec",
        editable: "false",
        valueFormatter: currencyFormatter,
      },
      {
        headerName: "到本月累計",
        field: "total1",
        valueFormatter: (params) => {
          return (
            params.data.jan +
            params.data.feb +
            params.data.mar +
            params.data.apr +
            params.data.may +
            params.data.jun +
            params.data.jul +
            params.data.aug +
            params.data.sep +
            params.data.oct +
            params.data.nov +
            params.data.dec
          );
        },
      },
      {
        headerName: "年度累計",
        field: "total2",
        valueFormatter: (params) => {
          return (
            params.data.jan +
            params.data.feb +
            params.data.mar +
            params.data.apr +
            params.data.may +
            params.data.jun +
            params.data.jul +
            params.data.aug +
            params.data.sep +
            params.data.oct +
            params.data.nov +
            params.data.dec
          );
        },
      },
    ];
    this.autoGroupColumnDef = {
      headerName: "Consoles", // custom header name for group
      pinned: "left", // force pinned left. Does not work in columnDef
      cellRendererParams: {
        suppressCount: true, // remove number in Group Column
      },
    };
    this.components = { showCellRenderer: createShowCellRenderer() };
    this.detailCellRendererParams = function (params, res: DetailOptions) {
      res.getDetailRowData = function (params) {
        params.successCallback(params.data.data);
      };
      if (
        params.data.paramname === "訂單金額達成率_廠工處" &&
        params.data.valuetype === "實際值"
      ) {
        res.detailGridOptions = {
          columnDefs: [
            { field: "訂單編號" },
            { field: "訂單項次" },
            { field: "訂單日期" },
            { field: "訂單數量" },
            { field: "訂單台幣金額" },
          ],
          defaultColDef: { flex: 1 },
          enableCharts: "true",
          enableRangeSelection: "true",
        };
      } else if (
        params.data.paramname === "訂單金額達成率_廠工處" &&
        params.data.valuetype === "目標值"
      ) {
        res.detailGridOptions = {
          columnDefs: [{ field: "年" }, { field: "期" }, { field: "收入" }],
          defaultColDef: { flex: 1, filter: "agTextColumnFilter" },
          enableCharts: "true",
          enableRangeSelection: "true",
        };
      } else {
        res.detailGridOptions = {
          columnDefs: [
            { field: "callId" },
            { field: "direction" },
            {
              field: "duration",
              valueFormatter: "x.toLocaleString() + 's'",
            },
            { field: "switchCode" },
          ],
          defaultColDef: { flex: 1, filter: "agTextColumnFilter" },
          enableCharts: "true",
          enableRangeSelection: "true",
        };
      }
      return res;
    };
    // this.detailCellRendererParams = {
    //   detailGridOptions: {
    //     columnDefs: [
    //       { field: 'callId' },
    //       { field: 'direction' },
    //       {
    //         field: 'number',
    //         minWidth: 150,
    //       },
    //       {
    //         field: 'duration',
    //         valueFormatter: "x.toLocaleString() + 's'",
    //       },
    //       {
    //         field: 'switchCode',
    //         minWidth: 150,
    //       },
    //     ],
    //     defaultColDef: { flex: 1 },
    //   },
    //   getDetailRowData: function (params) {
    //     params.successCallback(params.data.callRecords);
    //   },
    // }
  }
  onCompanyChange(event) {
    this.httpClient
    .get<any>(environment.SqlServer_KPI + "/api/Kpi/GetUserDepartments/"+this._storageService.userId+"/"+ this.selectedCompany)
    .subscribe((data) => {
      this.departments = data;
    });
  //   this._userService.getUser(this._storageService.userName).subscribe(user => {
  //     this.httpClient
  //     .get<any>(environment.SqlServer_KPI + "/api/Kpi/GetUserDepartments/"+user['departmentId'] + this.selectedCompany)
  //     .subscribe((data) => {
  //       this.departments = data;
  //     });
  // });
  }
  onDepartmentChange(event) {
    // this.httpClient
    //   .get<any>(environment.SqlServer_KPI + "/api/Kpi/GetUserCompanys/142030/" + this.selectedDepartment)
    //   .subscribe((data) => {
    //     this.companys = data;
    //   });
  }
  search() {
    if (this.selectedDepartment == undefined) { alert('請先選擇部門'); return ; }
    this.httpClient
      .get<any>(
        environment.SqlServer_KPI + "/api/Kpi/GetKpiMain/" +
        this.selectedDepartment +
        "/" +
        new Date().getFullYear() + "/" + this.selectedCompany
      )
      .subscribe((data) => {
        map.clear();
        firstrowindex.clear();
        this.rowData = data;
        var index = -1;
        for (let row of this.rowData) {
          index++;
          if (map.has(row["faceitem"])) {
            map.set(row["faceitem"], map.get(row["faceitem"]) + 1);
          } else {
            map.set(row["faceitem"], 1);
            firstrowindex.set(row["faceitem"], index);
          }
          if (map.has(row["targetitem"])) {
            map.set(row["targetitem"], map.get(row["targetitem"]) + 1);
          } else {
            map.set(row["targetitem"], 1);
            firstrowindex.set(row["targetitem"], index);
          }
          if (map.has(row["paramid"])) {
            map.set(row["paramid"], map.get(row["paramid"]) + 1);
          } else {
            map.set(row["paramid"], 1);
            firstrowindex.set(row["paramid"], index);
          }
        }
        this.show = data.length == 0 ? true : false;
        this.gridApi;
        var allColumnIds = [];
        this.columnApi.getAllColumns().forEach(function (column) {
          allColumnIds.push(column.colId);
        });
        //this.columnApi.autoSizeColumns(allColumnIds);
      });
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;

  //   this._userService.getUser(this._storageService.userName).subscribe(user => {
  //     this.httpClient
  //     .get<any>(environment.SqlServer_KPI + "/api/Kpi/GetUserDepartments/"+user['departmentId'] + this.selectedCompany)
  //     .subscribe((data) => {
  //       this.departments = data;
  //       this.rowData = [];
  //     });
  // });

     this.httpClient
       .get<any>(environment.SqlServer_KPI + "/api/Kpi/GetUserDepartments/"+this._storageService.userId+"/" + this.selectedCompany)
       .subscribe((data) => {
         this.departments = data;
         this.rowData = [];
       });
    this.httpClient
      .get<any>(environment.SqlServer_KPI + "/api/Kpi/GetUserCompanys/"+this._storageService.userId)
      .subscribe((data) => {
        this.companys = data;
        this.rowData = [];
      });
  }
  ngOnInit(): void {}
  createChartContainer(chartRef) {
    if (currentChartRef) {
      currentChartRef.destroyChart();
    }
    var eChart = chartRef.chartElement;
    var eParent = document.querySelector("#myChart");
    eParent.appendChild(eChart);
    currentChartRef = chartRef;
  }
  public open(row) {
    var isshow = true;
    var data;
    var month=0;
    switch (row.column.colId) {
      case "jan":
        month=1;
        break;
      case "feb":
        month=2;
        break;
      case "mar":
        month=3;
        break;
      case "apr":
        month=4;
        break;
      case "may":
        month=5;
        break;
      case "jun":
        month=6;
        break;
      case "july":
        month=7;
        break;
      case "aug":
        month=8;
      case "sep":
        month=9;
        break;
      case "oct":
        month=10;
        break;
      case "nov":
        month=11;
        break;
      case "dec":
        month=12;
        break;
      case "valuetype":
        month=0;
        break;
      case "total1":
        month=0;
        break;
      case "total2":
        month=0;
        break;
      default:
        month=13;
        break;
    }
    this.httpClient
     .get<any>(environment.SqlServer_KPI + "/api/Kpi/GetLoadData/"+this.selectedDepartment+"/"+new Date().getFullYear()+"/"+row.data.paramid+"/"+month+"/"+row.data.valuetype+"/"+this.selectedCompany)
     .subscribe((data) => {
       if (data == null || data == undefined || data.length == 0) {
        isshow = false;
      }
      if (isshow) {
        var dialogData=new DialogData();
        dialogData.data=data;
        dialogData.paramid=row.data.paramid;
        dialogData.paramname=row.data.paramname;
        dialogData.columnname=row.column.userProvidedColDef.headerName;
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.minWidth = "1500px";
        dialogConfig.maxHeight = "1500px";
        dialogConfig.data = dialogData;
        this.dialog.open(KpiDialogComponent, dialogConfig);
      }
     });
    if (row.data != undefined && row.data.data != undefined) {
      switch (row.column.colId) {
        case "jan":
          data = row.data.data.jan;
          break;
        case "feb":
          data = row.data.data.feb;
          break;
        case "mar":
          data = row.data.data.mar;
          break;
        case "apr":
          data = row.data.data.apr;
          break;
        case "may":
          data = row.data.data.may;
          break;
        case "jun":
          data = row.data.data.jun;
          break;
        case "july":
          data = row.data.data.jul;
          break;
        case "aug":
          data = row.data.data.aug;
        case "sep":
          data = row.data.data.sep;
          break;
        case "oct":
          data = row.data.data.oct;
          break;
        case "nov":
          data = row.data.data.nov;
          break;
        case "dec":
          data = row.data.data.dec;
          break;
        case "valuetype":
          data = row.data.data.jan
            .concat(row.data.data.feb)
            .concat(row.data.data.mar)
            .concat(row.data.data.apr)
            .concat(row.data.data.may)
            .concat(row.data.data.jun)
            .concat(row.data.data.jul)
            .concat(row.data.data.aug)
            .concat(row.data.data.sep)
            .concat(row.data.data.oct)
            .concat(row.data.data.nov)
            .concat(row.data.data.dec);
          break;
        case "total1":
          data = row.data.data.jan
          .concat(row.data.data.feb)
          .concat(row.data.data.mar)
          .concat(row.data.data.apr)
          .concat(row.data.data.may)
          .concat(row.data.data.jun)
          .concat(row.data.data.jul)
          .concat(row.data.data.aug)
          .concat(row.data.data.sep)
          .concat(row.data.data.oct)
          .concat(row.data.data.nov)
          .concat(row.data.data.dec);
          break;
        case "total2":
          data = row.data.data.jan
          .concat(row.data.data.feb)
          .concat(row.data.data.mar)
          .concat(row.data.data.apr)
          .concat(row.data.data.may)
          .concat(row.data.data.jun)
          .concat(row.data.data.jul)
          .concat(row.data.data.aug)
          .concat(row.data.data.sep)
          .concat(row.data.data.oct)
          .concat(row.data.data.nov)
          .concat(row.data.data.dec);
          break;
        default:
          data = null;
          break;
      }
    }

  }
  public onCellValueChanged(params) {
    params.data.isnewormodify = "modify";
  }
  getContextMenuItems(params) {
    var result = [
      {
        name: "查看來源檔案",
        action: function () {
          var isshow = false;
          if (params.api.getFocusedCell().column.colId == "jan") {
            if (params.node.data != undefined) {
              opendialog(params.node.data.data, this.dialog);
            }
          }
        },
        cssClasses: ["redFont", "bold"],
      },
      "copy",
      "separator",
      "chartRange",
      "export",
    ];
    return result;
  }
  public generate() {
    this.httpClient
      .get<any>(environment.SqlServer_KPI + "/api/Kpi/GenerateKpiMain/"+this._storageService.userId+"/"
      + this.selectedDepartment + "/" + new Date().getFullYear()+"/"+ this.selectedCompany)
      .subscribe((data) => {
        alert("生成成功");
      });
  }
  public save() {
    this.httpClient
      .post<any>(environment.SqlServer_KPI+"/api/Kpi", this.rowData)
      .subscribe((data) => {
        alert("保存成功");
      });
  }
  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error("An error occurred:", error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // Return an observable with a user-facing error message.
    return throwError("Something bad happened; please try again later.");
  }
  // CallWebAPI(){
  //   let department='dep001';
  //   let year=new Date().getFullYear();
  //   //let url = environment.SqlServer_BPM+"/CF.BPM.Service/api/Utility/CallWebAPI_returnModel";
  //   let url = environment.SqlServer_BPM+"/CF.BPM.Service/api/Utility/CallWebAPI_returnModel";
  //   this.httpClient.post<any>(url, body).subscribe(res => {
  //     succ(res);
  //   },res2=>{
  //       err(res2);
  //     })
  // }
  public rowSpan_face(params) {
    if (firstrowindex.get(params.data.faceitem)==params.node.rowIndex) {
      return map.get(params.data.faceitem);
    }
    return 1;
  }
  public rowSpan_target(params) {
    if (firstrowindex.get(params.data.targetitem)==params.node.rowIndex) {
      return map.get(params.data.targetitem);
    }
    return 1;
  }
  public rowSpan_param(params) {
    if (firstrowindex.get(params.data.paramid)==params.node.rowIndex) {
      return map.get(params.data.paramid);
    }
    return 1;
  }
}
var currentChartRef;
function opendialog(params, dailog) {
  const dialogConfig = new MatDialogConfig();
  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = true;
  dialogConfig.minWidth = "600px";
  dialogConfig.maxHeight = "1000px";
  dailog.open(KpiDialogComponent, dialogConfig);
}
function lookupValue(params) {
  return params;
}
function createShowCellRenderer() {
  function ShowCellRenderer() {}
  ShowCellRenderer.prototype.init = function (params) {
    var cellBlank = params.data.goal != 100;
    if (cellBlank) {
      return null;
    }
    this.ui = document.createElement("div");
    this.ui.innerHTML =
      '<div class="show-name">' +
      params.value +
      "" +
      "</div>" +
      '<div class="show-presenter">' +
      params.value +
      "</div>";
  };
  ShowCellRenderer.prototype.getGui = function () {
    return this.ui;
  };
  return ShowCellRenderer;
}
function currencyFormatter(params) {
  if (params.value == null) return "-";
  else if (params.value == undefined) return "";
  if (params.data.valuetype == "達成率") {
    return formatPercent(params.value, "en");
  }
  return formatCurrency(params.value, "en",""); // "$" + formatNumber(params.value);
}
function formatNumber(number) {
  // this puts commas into the number eg 1000 goes to 1,000,
  // i pulled this from stack overflow, i have no idea how it works
  return Math.floor(number)
    .toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}
