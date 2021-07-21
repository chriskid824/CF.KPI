import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { KpiMainComponent } from './kpi-main/kpi-main.component';
import { KpiDialogComponent } from './kpi-dialog/kpi-dialog.component';
import { AppCommonModule } from '../app-common/app-common.module';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule} from 'ng-zorro-antd/table';

import {MatDialogModule} from "@angular/material/dialog";
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
// import {
//   NbAccordionModule,
//   NbButtonModule,
//   NbCardModule,
//   NbListModule,
//   NbRouteTabsetModule,
//   NbStepperModule,
//   NbTabsetModule, NbUserModule,
// } from '@nebular/theme';
// import { NbMenuModule, NbSidebarModule,NbLayoutModule,NbInputModule,NbAutocompleteModule,NbSelectModule } from '@nebular/theme';
import { AgGridModule } from 'ag-grid-angular';
import 'ag-grid-enterprise'
@NgModule({
  declarations: [
    KpiMainComponent,
    KpiDialogComponent,
  ],
  imports: [
    CommonModule,
    AppCommonModule,
    RouterModule.forChild([
      { path: '', pathMatch: 'full', redirectTo: 'kpi-config' },
      { path: "kpimain", component: KpiMainComponent },
    ]),

    // NGZorro组件
    NzFormModule,
    NzCardModule,
    NzButtonModule,
    NzIconModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzTableModule,
    MatDialogModule,
    NzTimePickerModule,
    // NbAccordionModule,
    // NbButtonModule,
    // NbCardModule,
    // NbListModule,
    // NbRouteTabsetModule,
    // NbStepperModule,
    // NbTabsetModule, NbUserModule,
    // NbMenuModule, NbSidebarModule,NbLayoutModule,NbInputModule,NbAutocompleteModule,NbSelectModule,
    AgGridModule.withComponents([]),
  ]
})
export class KpiModule { }
