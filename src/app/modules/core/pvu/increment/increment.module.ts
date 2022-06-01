import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncrementComponent, ExcludeDialogComponent } from './increment-component/increment.component';
import { IncrementListComponent } from './increment-list/increment-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { IncrementRoutingModule } from './increment-routing.module';
import { IncrementListService } from './services/increment-list.service';
import {
    IncrementNewComponentComponent,
    ExcludeNewDialogComponent, InEligibleEmpListComponent, successFailureCountPopupComponent
} from './increment-new-component/increment-new-component.component';
import { IncrementNewListComponent } from './increment-new-list/increment-new-list.component';
import { IncrementNewListService } from './services/increment-new-list.service';

@NgModule({
    declarations: [
        // Old Increment ************ */
        IncrementComponent,
        IncrementListComponent,
        ExcludeDialogComponent,
        /*************************** */
        // New Increment **************/
        IncrementNewComponentComponent,
        IncrementNewListComponent,
        ExcludeNewDialogComponent,
        InEligibleEmpListComponent,
        successFailureCountPopupComponent
        /*************************** */
    ],
    imports: [
        CommonModule,
        SharedModule,
        IncrementRoutingModule
    ],
    entryComponents: [
        // Old Increment ******* */
        ExcludeDialogComponent,
        /********************** */
        // New Increment ******* */
        ExcludeNewDialogComponent,
        InEligibleEmpListComponent,
        successFailureCountPopupComponent
    ],
    /********************** */
    providers: [
        // Old Increment ****** */
        IncrementListService,
        /********************** */
        // New Increment ****** */
        IncrementNewListService
        /********************** */
    ]
})
export class IncrementModule { }
