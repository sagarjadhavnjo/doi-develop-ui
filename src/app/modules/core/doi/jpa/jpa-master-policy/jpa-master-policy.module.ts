import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { JpaMasterPolicyComponent } from './jpa-master-policy.component';

const routes: Routes = [{
  path: '',
  component: JpaMasterPolicyComponent
}];

@NgModule({
  declarations: [JpaMasterPolicyComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class JpaMasterPolicyModule { }
