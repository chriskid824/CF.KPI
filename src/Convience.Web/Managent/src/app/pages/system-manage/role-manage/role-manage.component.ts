import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Role } from '../model/role';
import { RoleService } from 'src/app/business/system-manage/role.service';
import { Menu } from '../model/menu';
import { MenuService } from 'src/app/business/system-manage/menu.service';
import { Department } from '../../group-manage/model/department';
import { DepartmentService } from 'src/app/business/group-manage/department.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { NzTreeSelectComponent } from 'ng-zorro-antd/tree-select';

@Component({
  selector: 'app-role-manage',
  templateUrl: './role-manage.component.html',
  styleUrls: ['./role-manage.component.less']
})
export class RoleManageComponent implements OnInit {

  @ViewChild('menuTree', { static: false }) menuTree: NzTreeSelectComponent;
  @ViewChild('departmentTree', { static: false }) departmentTree: NzTreeSelectComponent;

  searchForm: FormGroup = new FormGroup({});
  editForm: FormGroup = new FormGroup({});

  nodes: NzTreeNodeOptions[] = [];

  nodes_department: NzTreeNodeOptions[] = [];

  tplModal: NzModalRef;

  data: Role[] = [];
  data_department:Department[]=[];

  editedRole: Role = new Role();

  page: number = 1;
  size: number = 10;
  total: number = 0;

  searchString = null;

  constructor(
    private _formBuilder: FormBuilder,
    private _modalService: NzModalService,
    private _roleService: RoleService,
    private _menuService: MenuService,
    private _departmentService: DepartmentService,
    private _messageService: NzMessageService) { }

  ngOnInit(): void {
    this.searchForm = this._formBuilder.group({
      roleName: [""]
    });
    this.refresh();
    this.initNodes();
  }

  refresh() {
    this._roleService.getRoles(this.searchString, this.page, this.size)
      .subscribe((result: any) => { this.data = result['data']; this.total = result['count']; });
  }

  initNodes() {
    let nodes: NzTreeNodeOptions[] = [];
    this._menuService.get().subscribe((result: any) => {
      this.makeNodes(null, nodes, result);
      this.nodes = nodes;
    });
    let nodes_department: NzTreeNodeOptions[] = [];
    this._departmentService.getAll().subscribe((result: any) => {
      this.data_department = result;
      this.makeNodes_department(null, nodes_department, this.data_department);
      this.nodes_department = nodes_department;
      console.info(this.nodes_department);
    });
  }

  makeNodes(upId, node, menus: Menu[]) {
    var ms = menus.filter(menu => menu.upId == upId);
    ms.forEach(menu => {
      let data = { title: menu.name, key: menu.id.toString(), children: [], isLeaf: menu.type == 2 || menu.type == 3 };
      this.makeNodes(menu.id, data.children, menus);
      node.push(data);
    });
  }
  makeNodes_department(upId, node, departments: Department[]) {
    var ms = departments.filter(department => department.upId == upId);
      ms.forEach(department => {
        let data = { title: department.name, key: department.id, children: [], isLeaf: department.upId != null };
        this.makeNodes_department(department.id, data.children, departments);
        node.push(data);
      });
  }
  submitSearch() {
    this.searchString = this.searchForm.value["roleName"];
    this.refresh();
  }

  addRole(title: TemplateRef<{}>, content: TemplateRef<{}>) {
    this.editedRole = new Role();
    this.editForm = this._formBuilder.group({
      roleName: [this.editedRole.name, [Validators.required, Validators.maxLength(15)]],
      remark: [this.editedRole.remark, [Validators.maxLength(30)]],
      departments:[[]],
      menus: [[]]
    });
    this.tplModal = this._modalService.create({
      nzTitle: title,
      nzContent: content,
      nzFooter: null,
    });
  }

  editRole(title: TemplateRef<{}>, content: TemplateRef<{}>, role: Role) {
    this._roleService.getRole(role.id).subscribe(reuslt => {
      this.editedRole = reuslt;
      this.editForm = this._formBuilder.group({
        roleName: [this.editedRole.name, [Validators.required, Validators.maxLength(15)]],
        remark: [this.editedRole.remark, [Validators.maxLength(30)]],
        departments: [this.editedRole.departments?.split(',')],
        menus: [this.editedRole.menus?.split(',')]
      });
      console.info(this.editForm);
      this.tplModal = this._modalService.create({
        nzTitle: title,
        nzContent: content,
        nzFooter: null,
      });

    });
  }

  removeRole(roleName: string) {
    this._modalService.confirm({
      nzTitle: '是否删除该角色?',
      nzContent: null,
      nzOnOk: () =>
        this._roleService.deleteRole(roleName).subscribe(result => {
          this.refresh();
          this._messageService.success("删除成功！");
        })
    });
  }

  submitEdit() {
    for (const i in this.editForm.controls) {
      this.editForm.controls[i].markAsDirty();
      this.editForm.controls[i].updateValueAndValidity();
    }
    if (this.editForm.valid) {
      this.editedRole.name = this.editForm.value['roleName'];
      this.editedRole.remark = this.editForm.value['remark'];
      this.editedRole.departments = this.editForm.value['departments'].join(',');
      this.editedRole.menus = this.editForm.value['menus'].join(',');
      if (this.editedRole.id) {
        this._roleService.updateRole(this.editedRole)
          .subscribe(result => {
            this.refresh(); this.tplModal.close();
            this._messageService.success("更新成功！");
          });
      } else {
        this._roleService.addRole(this.editedRole)
          .subscribe(result => {
            this.refresh(); this.tplModal.close();
            this._messageService.success("添加成功！");
          });
      }
    }
  }
  cancelEdit() {
    this.tplModal.close();
  }

  pageChange() {
    this.refresh();
  }

  sizeChange() {
    this.page = 1;
    this.refresh();
  }


}
