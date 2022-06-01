import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DailyPositionSheetComponent } from './daily-position-sheet.component';

const routes: Routes = [
    {
      path: '',
      component: DailyPositionSheetComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DailyPositionRoutingModule { }
