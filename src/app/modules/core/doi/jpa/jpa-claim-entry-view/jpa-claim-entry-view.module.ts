import { CommonProtoModule } from './../../../../../common/common.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { JpaClaimEntryViewComponent } from './jpa-claim-entry-view.component';

const routes: Routes = [{
  path: '',
  component: JpaClaimEntryViewComponent
}];

@NgModule({
  declarations: [JpaClaimEntryViewComponent],
  imports: [
    CommonModule,
    SharedModule,
    CommonProtoModule,
    RouterModule.forChild(routes)
  ]
})
export class JpaClaimEntryViewModule { }
