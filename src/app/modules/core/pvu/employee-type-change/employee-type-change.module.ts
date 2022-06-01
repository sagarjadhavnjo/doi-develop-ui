import { NgModule } from '@angular/core';
import { EmployeeTypeChangeListComponent } from './employee-type-change-list/employee-type-change-list.component';
import { EmployeeTypeChangeComponent } from './employee-type-change/employee-type-change.component';
import { EmployeeTypeChnageRoutingModule } from './employee-type-change-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AttachmentEtcComponent } from './attachment-etc/attachment-etc.component';



@NgModule({
  declarations: [
    EmployeeTypeChangeComponent,
    EmployeeTypeChangeListComponent,
    AttachmentEtcComponent
  ],
  imports: [
    SharedModule,
    EmployeeTypeChnageRoutingModule
  ]
})
export class EmployeeTypeChangeModule { }
