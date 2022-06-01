import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { NoClaimComponent } from './no-claim.component';

const routes: Routes = [{
  path: '',
  component: NoClaimComponent
}];

@NgModule({
  declarations: [NoClaimComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class NoClaimComponentModule { }
