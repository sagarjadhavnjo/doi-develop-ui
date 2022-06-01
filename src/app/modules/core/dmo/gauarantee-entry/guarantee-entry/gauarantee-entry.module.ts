import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { GuaranteeEntryComponent } from './guarantee-entry.component';

const routes: Routes = [{
  path: '',
  component: GuaranteeEntryComponent
}];

@NgModule({
  declarations: [GuaranteeEntryComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class GauaranteeEntryModule { }
