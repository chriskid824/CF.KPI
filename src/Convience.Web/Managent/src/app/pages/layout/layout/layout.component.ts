import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AccountService } from 'src/app/business/account.service';
import { StorageService } from 'src/app/services/storage.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.less']
})
export class LayoutComponent implements OnInit {

  // 菜單數據
  public menuTree = [
    {
      canOperate: 'dashaboard', routerLink: '/dashboard', iconType: 'dot-chart', firstBreadcrumb: '首頁', lastBreadcrumb: '', name: '首頁',
      children: [

      ]
    },
    {
      canOperate: 'kpi', routerLink: '', iconType: 'setting', firstBreadcrumb: '', lastBreadcrumb: '', name: 'KPI',
      children: [
        { canOperate: 'kpimain', routerLink: '/kpi/kpimain', iconType: 'user', firstBreadcrumb: 'KPI', lastBreadcrumb: 'Kpi資料', name: 'Kpi資料', },
        { canOperate: 'chart', routerLink: '/chart/chart', iconType: 'user', firstBreadcrumb: '首頁', lastBreadcrumb: '圖表', name: '圖表',target:"blank" },
        // { canOperate: 'kpi-main-modify', routerLink: '/kpi/kpi-main-modify', iconType: 'idcard', firstBreadcrumb: 'KPI', lastBreadcrumb: 'Kpi修改', name: 'Kpi修改', },
        // { canOperate: 'kpi-config', routerLink: '/kpi/kpi-config', iconType: 'idcard', firstBreadcrumb: 'KPI', lastBreadcrumb: 'Kpi測試', name: 'Kpi測試', },
      ]
    },
    {
      canOperate: 'systemmanage', routerLink: '', iconType: 'setting', firstBreadcrumb: '', lastBreadcrumb: '', name: '系统管理',
      children: [
        { canOperate: 'userManage', routerLink: '/system/user', iconType: 'user', firstBreadcrumb: '系统管理', lastBreadcrumb: '用户管理', name: '用户管理', },
        { canOperate: 'roleManage', routerLink: '/system/role', iconType: 'idcard', firstBreadcrumb: '系统管理', lastBreadcrumb: '角色管理', name: '角色管理', },
        { canOperate: 'menuManage', routerLink: '/system/menu', iconType: 'menu', firstBreadcrumb: '系统管理', lastBreadcrumb: '菜單管理', name: '菜單管理', },
        { canOperate: 'kpiitemManage', routerLink: '/system/kpi', iconType: 'menu', firstBreadcrumb: '系统管理', lastBreadcrumb: '績效指標管理', name: '績效指標管理', },
      ]
    },
    {
      canOperate: 'groupmanage', routerLink: '', iconType: 'team', firstBreadcrumb: '', lastBreadcrumb: '', name: '組織管理',
      children: [
        { canOperate: 'positionManage', routerLink: '/group/position', iconType: 'credit-card', firstBreadcrumb: '組織管理', lastBreadcrumb: '職位管理', name: '職位管理', },
        { canOperate: 'departmentManage', routerLink: '/group/department', iconType: 'apartment', firstBreadcrumb: '組織管理', lastBreadcrumb: '部門管理', name: '部門管理', },
      ]
    },
    // {
    //   canOperate: 'workflow', routerLink: '', iconType: 'fork', firstBreadcrumb: '', lastBreadcrumb: '', name: '工作流',
    //   children: [
    //     { canOperate: 'myWorkflow', routerLink: '/workflow/myFlow', iconType: 'credit-card', firstBreadcrumb: '組織管理', lastBreadcrumb: '我創建的', name: '我創建的', },
    //     { canOperate: 'handledWorkflow', routerLink: '/workflow/handledFlow', iconType: 'highlight', firstBreadcrumb: '組織管理', lastBreadcrumb: '我處理的', name: '我處理的', },
    //     { canOperate: 'workflowManage', routerLink: '/workflow/workflowManage', iconType: 'reconciliation', firstBreadcrumb: '組織管理', lastBreadcrumb: '工作流管理', name: '工作流管理', },
    //   ]
    // },
    // {
    //   canOperate: 'contentmanage', routerLink: '', iconType: 'book', firstBreadcrumb: '', lastBreadcrumb: '', name: '内容管理',
    //   children: [
    //     { canOperate: 'articleManage', routerLink: '/content/article', iconType: 'align-left', firstBreadcrumb: '内容管理', lastBreadcrumb: '文章管理', name: '文章管理', },
    //     { canOperate: 'fileManage', routerLink: '/content/file', iconType: 'file', firstBreadcrumb: '内容管理', lastBreadcrumb: '文件管理', name: '文件管理', },
    //     { canOperate: 'dicManage', routerLink: '/content/dic', iconType: 'book', firstBreadcrumb: '内容管理', lastBreadcrumb: '字典管理', name: '字典管理', },
    //   ]
    // },
    {
      canOperate: 'logmanage', routerLink: '', iconType: 'container', firstBreadcrumb: '', lastBreadcrumb: '', name: '日志管理',
      children: [
        { canOperate: 'operatelog', routerLink: '/log/operate', iconType: 'edit', firstBreadcrumb: '日志管理', lastBreadcrumb: '操作日志', name: '操作日志', },
        { canOperate: 'loginlog', routerLink: '/log/login', iconType: 'login', firstBreadcrumb: '日志管理', lastBreadcrumb: '登錄日志', name: '登錄日志', },
      ]
    },
    // {
    //   canOperate: 'systemtool', routerLink: '', iconType: 'tool', firstBreadcrumb: '', lastBreadcrumb: '', name: '系统工具',
    //   children: [
    //     { canOperate: 'code', routerLink: '/tool/code', iconType: 'fund-view', firstBreadcrumb: '系统工具', lastBreadcrumb: '代碼生成', name: '代碼生成', },
    //     { canOperate: 'swagger', routerLink: '/tool/swagger', iconType: 'api', firstBreadcrumb: '系统工具', lastBreadcrumb: 'Swagger', name: 'Swagger', },
    //   ]
    // },
  ];

  // 面包渣數據
  public breadcrumbInfo: string[] = ['首頁'];
  public isCollapsed;
  public name;
  public avatar;

  // tag
  public tags: Array<any> = [];

  // 侧边按鈕栏或标题按鈕栏
  public isSideMenu = true;

  @ViewChild('editPwdTitleTpl', { static: true })
  editPwdTitleTpl;

  @ViewChild('editPwdContentTpl', { static: true })
  editPwdContentTpl;

  modifyForm: FormGroup;

  isLoading: boolean;

  modalRef: NzModalRef;

  equalValidator = (control: FormControl): { [key: string]: any } | null => {
    const newPassword = this.modifyForm?.get('newPassword').value;
    const confirmPassword = control.value;
    return newPassword === confirmPassword ? null : { 'notEqual': true };
  };

  constructor(
    private _storageService: StorageService,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _modalService: NzModalService,
    private _messageService: NzMessageService,
    private _accountService: AccountService) { }

  ngOnInit() {
    this.name = this._storageService.Name;
    this.avatar = this._storageService.Avatar;

    // this._signalRService.addReceiveMessageHandler("newMsg", (value) => {
    //   console.log(value);
    // });
    // this._signalRService.start();
  }

  logout() {
    this._storageService.removeUserToken();
    this._router.navigate(['/account/login']);
  }

  setBreadcrumb(first: string, ...rest: string[]) {
    this.breadcrumbInfo = [];
    this.breadcrumbInfo.push(first);
    rest.forEach(element => {
      this.breadcrumbInfo.push(element);
    });
  }

  // 移除tag
  handleClose(removedTag: {}): void {
    this.tags = this.tags.filter(tag => tag.name !== removedTag);
  }

  navigateTo(key) {

    // 找到对应的數據
    let findElement: any = this.menuTree.find(e => e.canOperate == key);
    if (!findElement) {
      for (const element of this.menuTree) {
        if (element.children.length > 0) {
          findElement = element.children.find(e => e.canOperate == key);
          if (findElement) break;
        }
      }
    }

    // 設置面包渣导航
    this.breadcrumbInfo = [];
    this.breadcrumbInfo.push(findElement.firstBreadcrumb);
    if (findElement.lastBreadcrumb) {
      this.breadcrumbInfo.push(findElement.lastBreadcrumb);
    }

    // 添加tag
    this.handleClose(findElement.name);
    this.tags.push({ name: findElement.name, route: findElement.routerLink });

  }

  // 导航到指定路由
  navigate(tag) {
    this._router.navigate([tag.route]);
  }

  getImgUrl(name) {
    return `/assets/avatars/${name}.png`;
  }

  modifyPwd() {
    this.modifyForm = this._formBuilder.group({
      // key: value,validators,asyncvalidators,updateOn
      userName: [{ value: this._storageService.userName, disabled: true }],
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required, this.equalValidator]]
    });
    this.modalRef = this._modalService.create({
      nzTitle: this.editPwdTitleTpl,
      nzContent: this.editPwdContentTpl,
      nzFooter: null,
      nzMaskClosable: false
    });
  }

  submitForm() {
    for (const i in this.modifyForm.controls) {
      this.modifyForm.controls[i].markAsDirty();
      this.modifyForm.controls[i].updateValueAndValidity();
    }
    if (this.modifyForm.valid) {
      this.isLoading = true;
      this._accountService.modifyPassword(this.modifyForm.controls['oldPassword'].value, this.modifyForm.controls['newPassword'].value)
        .subscribe(
          result => {
            this.modifyForm.reset();
            this._messageService.success("密碼修改成功！");
            this.modalRef.close();
          },
          error => {
            this.isLoading = false;
          },
          () => {
            this.isLoading = false;
          }
        )

    }
  }
}
