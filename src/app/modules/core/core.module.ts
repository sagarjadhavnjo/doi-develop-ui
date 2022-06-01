import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreRoutingModule } from './core-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatSortModule } from '@angular/material/sort';




@NgModule({
  imports: [
    CommonModule,
    CoreRoutingModule,
    MatSortModule
  ],
  declarations: [DashboardComponent]
})
export class CoreModule { }
