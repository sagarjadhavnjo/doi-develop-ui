import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { DocumentMasterComponent } from './document-master.component';

const routes: Routes = [{
  path: '',
  component: DocumentMasterComponent
}];

@NgModule({
  declarations: [DocumentMasterComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  entryComponents: [
    //ConfirmationDialogComponent
],
})
export class DocumentMasterModule { }
