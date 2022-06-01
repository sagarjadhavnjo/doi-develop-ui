import { MaterialModule } from './../../../../../shared/material.module';
import { CommonProtoModule } from './../../../../../common/common.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { JpaClaimEntryComponent } from './jpa-claim-entry.component';

const routes: Routes = [{
  path: '',
  component: JpaClaimEntryComponent
}];

@NgModule({
  declarations: [JpaClaimEntryComponent],
  imports: [
    CommonModule,
    SharedModule,
    CommonProtoModule,
    MaterialModule,
    RouterModule.forChild(routes)
  ]
})
export class JpaClaimEntryModule { }
