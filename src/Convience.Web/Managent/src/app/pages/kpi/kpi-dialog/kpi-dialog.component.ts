import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";

@Component({
  selector: "ngx-kpi-dialog",
  templateUrl: "./kpi-dialog.component.html",
  styleUrls: ["./kpi-dialog.component.scss"],
})
export class KpiDialogComponent implements OnInit {
  columnDefs: any;
  defaultColDef;
  rowData: [];
  rowGroupPanelShow;
  sideBar;
  Title;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    var defs=[];
    this.rowGroupPanelShow='always';
    Object.keys(data.data[0]).forEach(function (key) {
      //console.warn( this.columnDefs);
      defs.push({ field: key });
      //this.columnDefs.push({ field: key },);
      //var value=data[0][key];
      //console.log(key + ' : ', value);
    });
    this.columnDefs=defs;
    this.defaultColDef = {
      editable: true,
      filter: "agTextColumnFilter",
      allowedAggFuncs: ['sum', 'min', 'max'],
      enableValue: true,
      enableRowGroup: true,
      enablePivot: true,
      // floatingFilter: true,
      resizable: true,
    };
    this.rowData = this.data.data;
    this.Title=this.data.paramname+" - "+this.data.columnname;
    this.sideBar = {
      toolPanels: [
        {
          id: 'columns',
          labelDefault: 'Columns',
          labelKey: 'columns',
          iconKey: 'columns',
          toolPanel: 'agColumnsToolPanel',
        },
        {
          id: 'filters',
          labelDefault: 'Filters',
          labelKey: 'filters',
          iconKey: 'filter',
          toolPanel: 'agFiltersToolPanel',
        },
      ],
      defaultToolPanel: 'columns',
      hiddenByDefault: false,
    };
    //console.warn(this.data.keys);
  }
  onGridReady(params) {
    params.api.closeToolPanel();
  }
  ngOnInit(): void {}
}
