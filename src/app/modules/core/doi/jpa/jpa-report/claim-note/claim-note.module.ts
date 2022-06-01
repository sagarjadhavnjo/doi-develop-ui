import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { ClaimNoteComponent } from './claim-note.component';

const routes: Routes = [{
  path: '',
  component: ClaimNoteComponent
}];

@NgModule({
  declarations: [ClaimNoteComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class ClaimNoteComponentModule { }
