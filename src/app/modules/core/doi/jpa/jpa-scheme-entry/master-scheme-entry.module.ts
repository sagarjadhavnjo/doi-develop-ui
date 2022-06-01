import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { MasterSchemeEntryComponent } from './master-scheme-entry.component';

const routes: Routes = [{
  path: '',
  component: MasterSchemeEntryComponent
}];

@NgModule({
  declarations: [MasterSchemeEntryComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class MasterSchemeEntryModule { }
