import { Directive } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'; 

import { WorkflowDetailsTppComponent } from 'src/app/modules/core/tpp/workflow-details-tpp/workflow-details-tpp.component';
import { WorkflowComponent } from 'src/app/modules/core/tpp/workflow/workflow/workflow.component';

@Directive({
  selector: '[appTpp]'
})
export class TppDirective {

  constructor(private dialog: MatDialog) { }

  // opens workflow dialog
  workflowDetails() {
    const dialogRef = this.dialog.open(WorkflowComponent, {
      width: '1200px',
      height: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
