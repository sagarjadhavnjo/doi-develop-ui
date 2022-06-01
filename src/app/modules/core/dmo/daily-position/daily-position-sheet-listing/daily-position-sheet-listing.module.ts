import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, Routes } from '@angular/router';
import { DailyPositionSheetListingComponent } from './daily-position-sheet-listing.component';
import { SharedModule } from 'src/app/shared/shared.module';

const route: Routes = [{
  path: '',
  component: DailyPositionSheetListingComponent
}]

@NgModule({
  declarations: [
    DailyPositionSheetListingComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(route)
  ]
})
export class DailyPositionSheetListingModule { }
