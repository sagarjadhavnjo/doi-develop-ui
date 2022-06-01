
import { MatDialog} from '@angular/material/dialog';
import { GiWorkflowDetailsComponent } from 'src/app/modules/core/group-insurance/gi-workflow-details/gi-workflow-details.component';
export class GroupInsuranceDirective {

    constructor(private dialog: MatDialog) { }

     // EA Workflow Popup
    workflowDetails() {
        const dialogRef = this.dialog.open(GiWorkflowDetailsComponent, {
            width: '1200px'
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
        });
    }

}
