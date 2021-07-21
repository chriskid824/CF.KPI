import { Component, OnInit, TemplateRef } from '@angular/core';
import { ViewItemTree } from '../model/ViewItemTree';
import { GroupItemDetail } from '../model/GroupItemDetail';
import { IndicatorDetail } from '../model/IndicatorDetail';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { KpiitemService } from 'src/app/business/system-manage/kpiitem.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzTreeNodeOptions, NzTreeNode, NzFormatEmitEvent } from 'ng-zorro-antd/tree';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { environment } from "../../../../environments/environment";

@Component({
  selector: 'app-kpi-manage',
  templateUrl: './kpi-manage.component.html',
  styleUrls: ['./kpi-manage.component.less']
})
export class KpiManageComponent implements OnInit {

  nodes: NzTreeNodeOptions[] = [];

  selectedNode: NzTreeNode;

  selectedNodeData: ViewItemTree;

  editForm: FormGroup = new FormGroup({});

  data: ViewItemTree[] = [];

  displayData: ViewItemTree[] = [];

  editedMenu: ViewItemTree = {};

  modalRef: NzModalRef;

  departments: [];
  selectedDepartment : string;

  constructor(
    private _modalService: NzModalService,
    private _formBuilder: FormBuilder,
    private _kpiItemService: KpiitemService,
    private _messageService: NzMessageService,
    private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.httpClient
       .get<any>(environment.SqlServer_KPI + "/api/Kpi/GetUserDepartments/142030/null")
       .subscribe((data) => {
         this.departments = data;
         if(this.departments.length>1)
         {
           console.info(data[0].paramId);
          this.selectedDepartment=  data.length < 1 ? null : data[0].paramId;
         }
         this.initNodes();
       });
  }

  initNodes() {
    let nodes: NzTreeNodeOptions[] = [{ title: '績效指標管理', key: null, icon: 'global', expanded: true, children: [] }];
    this.getDepartment().subscribe((result: any) => {
      this.data = result;
      this.makeNodes(null, nodes[0], this.data);
      this.nodes = nodes;
      this.displayData = this.data.filter(menu => menu.paramid == this.selectedNode?.key);
    });
  }
  onDepartmentChange(event) {
    this.initNodes();

  }
  getDepartment(){
    return this.httpClient.get<any>(environment.SqlServer_KPI + "/api/Kpi/GetItemTree/" + this.selectedDepartment);
  }
  makeNodes(upId, node, items: ViewItemTree[]) {
    var ms = items.filter(item => item.parentid == upId);
    console.info(ms);
    ms.forEach(item => {
      let data = { title: item.paramvalue, key: item.paramid, icon: this.menuIcon(item.paramname), children: [], isLeaf: item.paramname == '衡量指標項目',expanded: true };
      this.makeNodes(item.paramid, data, items);
      node.children.push(data);
    });
  }

  add(title: TemplateRef<{}>, content: TemplateRef<{}>) {
    // if (this.selectedNode) {
    //   let selectMenu: Menu = this.data.find(menu => menu.id.toString() == this.selectedNode?.key);
    //   if (selectMenu && (selectMenu.type == 2 || selectMenu.type == 3)) {
    //     this._messageService.warning("按鈕和鏈結類型节点无法添加子元素！");
    //     return;
    //   }
    // }
    // this.editedMenu = new Menu();
    // this.editForm = this._formBuilder.group({
    //   upMenu: [this.selectedNode?.key],
    //   name: [null, [Validators.required, Validators.maxLength(10)]],
    //   identification: [null],
    //   permission: [null],
    //   type: [0],
    //   route: [null],
    //   sort: [null, [Validators.required]]
    // });
    // this.modalRef = this._modalService.create({
    //   nzTitle: title,
    //   nzContent: content,
    //   nzFooter: null,
    //   nzMaskClosable: false,
    // });
  }

  edit(title: TemplateRef<{}>, content: TemplateRef<{}>, item: ViewItemTree) {
     this.editedMenu = item;
     console.log(item);
     this.editForm = this._formBuilder.group({
      parentid: [{ value: item.parentid, disabled: true }],
       //upMenu: [Number(menu.upId)],
       paramvalue: [item.paramvalue, [Validators.required, Validators.maxLength(50)]],
      //  identification: [menu.identification],
      //  permission: [menu.permission],
      paramname: [item.paramname],
       fomular: [item.fomular],
       unit: [item.unit],
       weight: [item.weight],
       goalyear: [item.goalyear],
      //  route: [menu.route],
       sort: [item.sort],
       enable: [item.enable]
      //  , [Validators.required]
     });
     this.modalRef = this._modalService.create({
       nzTitle: title,
       nzContent: content,
       nzFooter: null,
       nzMaskClosable: false,
     });
  }

  submitEdit() {
     for (const i in this.editForm.controls) {
       this.editForm.controls[i].markAsDirty();
       this.editForm.controls[i].updateValueAndValidity();
     }
     if (this.editForm.valid) {
       let item = new GroupItemDetail();
      //  item.paramid = this.editForm.value["paramid"];
       item.department = this.data[0].department;
       item.nickname = this.editForm.value["paramvalue"];
       item.parentid = this.editForm.value["parentid"];
       item.enable =  !!this.editForm.value["enable"];
       if (this.editedMenu.paramid) {
        item.paramid = this.editedMenu.paramid;
         this._kpiItemService.updateGroupItem(item).subscribe(result => {
           this._messageService.success("修改成功！");
           //this.initNodes();
           this.modalRef.close();
         });
       }
      //  else {
      //    this._menuService.add(item).subscribe(result => {
      //      this._messageService.success("添加成功！");
      //      this.initNodes();
      //      this.modalRef.close();
      //    });
      //  }
     }
  }

  submitEdit2() {
    for (const i in this.editForm.controls) {
      this.editForm.controls[i].markAsDirty();
      this.editForm.controls[i].updateValueAndValidity();
    }
    if (this.editForm.valid) {
      let item = new IndicatorDetail();
      // item.paramid = this.editForm.value["paramid"];
      item.department = this.data[0].department;
      item.nickname = this.editForm.value["paramvalue"];
      item.parentid = this.editForm.value["parentid"];
      item.enable = !!this.editForm.value["enable"];
      item.fomular = this.editForm.value["fomular"];
      item.unit = this.editForm.value["unit"];
      item.weight = this.editForm.value["weight"];
      item.goalyear = this.editForm.value["goalyear"];
      item.sort = this.editForm.value["sort"];
      if (this.editedMenu.paramid) {
       item.paramid = this.editedMenu.paramid;
        this._kpiItemService.updateIndicator(item).subscribe(result => {
          this._messageService.success("修改成功！");
          //this.initNodes();
          this.modalRef.close();
        });
      }
    }
 }

  cancelEdit() {
    this.modalRef.close();
  }

  remove(id: string) {
    // this._modalService.confirm({
    //   nzTitle: '是否删除该菜單?',
    //   nzContent: '删除菜單會导致相关用户的權限无法使用，請谨慎操作！',
    //   nzOnOk: () =>
    //     this._menuService.delete(id).subscribe(result => {
    //       this.initNodes();
    //       this._messageService.success("删除成功！");
    //     })
    // });
  }

  getUpperMenuBySelect() {
    var key = this.selectedNode?.key;
    var selectedMeun = this.data.find(item => item.paramid.toString() == key);
    return selectedMeun?.paramvalue;
  }

  getUpperMenuById(key) {
    var selectedMeun = this.data.find(item => item.paramid.toString() == key);
    return selectedMeun?.paramvalue;
  }

  treeClick(event: NzFormatEmitEvent) {
    this.selectedNode = event.keys.length > 0 ? event.node : null;
    this.displayData = this.data.filter(item => item.parentid == this.selectedNode?.key);
    this.selectedNodeData=this.data.filter(item => item.paramid == this.selectedNode?.key)[0];
    console.info(this.selectedNodeData);
  }

  menuIcon(type) {
    var result = '';
    switch (type) {
      case '構面':
        result = 'menu';
        break;
      case '目標項目':
        result = 'plus-square';
        break;
      case '衡量指標項目':
        result = 'link';
        break;
      default:
        result = 'appstore';
        break;
    }
    return result;
  }

}
