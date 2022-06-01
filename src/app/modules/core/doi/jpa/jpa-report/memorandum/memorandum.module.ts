import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { MemorandumComponent } from './memorandum.component';

const routes: Routes = [{
  path: '',
  component: MemorandumComponent
}];

@NgModule({
  declarations: [MemorandumComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class MemorandumComponentModule { }
