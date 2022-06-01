import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { JpaLegalEntryComponent } from './jpa-legal-entry.component';

const routes: Routes = [
    {
     path: '', component: JpaLegalEntryComponent
    },
    {
        path: ':action',
        component: JpaLegalEntryComponent
    }
  ];

@NgModule({
  declarations: [JpaLegalEntryComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class JpaLegalEntryModule { }
