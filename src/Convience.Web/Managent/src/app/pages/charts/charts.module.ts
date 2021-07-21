import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChartComponent } from './chart/chart.component';
import { ChartShowComponent } from './chart-show/chart-show.component';
import { AppCommonModule } from '../app-common/app-common.module';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';

import {
  NbAlertModule,
  NbButtonModule,
  NbCheckboxModule,
  NbInputModule,
  NbCardModule,
  NbSelectModule,
  NbLayoutModule,
  NbThemeModule,
  NbSidebarModule
} from "@nebular/theme";
import { NgxEchartsModule } from "ngx-echarts";
import { NbThemeService } from '@nebular/theme';
@NgModule({
  declarations: [
    ChartComponent,
    ChartShowComponent
  ],
  imports: [
    CommonModule,
    AppCommonModule,
    RouterModule.forChild([
      { path: '', pathMatch: 'full', redirectTo: 'chart' },
      { path: "chart", component: ChartShowComponent }
    ]),

    // NGZorro组件
    NzFormModule,
    NzCardModule,
    NzButtonModule,
    NzIconModule,
    NzFormModule,
    NzInputModule,

    NbAlertModule,
    NbButtonModule,
    NbCheckboxModule,
    NbInputModule,
    NbCardModule,
    NbSelectModule,
    NbLayoutModule,
    NbSidebarModule,

    NbThemeModule.forRoot({name:"default",}),

    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),

  ],
  providers:[NbThemeService],
})
export class ChartsModule { }
