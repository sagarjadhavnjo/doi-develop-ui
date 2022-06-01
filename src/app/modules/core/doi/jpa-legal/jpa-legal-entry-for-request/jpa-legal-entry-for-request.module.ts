import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { JpaLegalEntryForRequestComponent } from './jpa-legal-entry-for-request.component';

const routes: Routes = [{
  path: '',
  component: JpaLegalEntryForRequestComponent
}];

@NgModule({
  declarations: [JpaLegalEntryForRequestComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class JpaLegalEntryForRequestModule { }
