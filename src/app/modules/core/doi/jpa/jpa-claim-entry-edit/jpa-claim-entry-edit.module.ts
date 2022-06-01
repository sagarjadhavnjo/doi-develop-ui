import { CommonProtoModule } from './../../../../../common/common.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { JpaClaimEntryEditComponent } from './jpa-claim-entry-edit.component';

const routes: Routes = [{
  path: '',
  component: JpaClaimEntryEditComponent
}];

@NgModule({
  declarations: [JpaClaimEntryEditComponent],
  imports: [
    CommonModule,
    SharedModule,
    CommonProtoModule,
    RouterModule.forChild(routes)
  ]
})
export class JpaClaimEntryEditModule { }
