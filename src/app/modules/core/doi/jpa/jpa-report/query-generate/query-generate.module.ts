import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { QueryGenerateComponent } from './query-generate.component';

const routes: Routes = [{
  path: '',
  component: QueryGenerateComponent
}];

@NgModule({
  declarations: [QueryGenerateComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class QueryGenerateComponentModule { }
