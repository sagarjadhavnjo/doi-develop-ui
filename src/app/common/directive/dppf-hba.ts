import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
//import { WorkflowDppfHbaComponent } from 'src/app/dppf-hba/workflow-dppf-hba/workflow-dppf-hba.component';

export class DPPFHbaDirectives {


    constructor(private dialog: MatDialog) { }

    selection = new SelectionModel<any>(true, []);
    // Methods for Checkbox Selection Starts
    masterToggle(dataSourceData) {
        this.isAllSelected(dataSourceData)
            ? this.selection.clear()
            : dataSourceData.forEach(row =>
                this.selection.select(row)
            );
    }

    isAllSelected(dataSourceData) {
        const numSelected = this.selection.selected.length;
        const numRows = dataSourceData.length;
        return numSelected === numRows;
    }

    checkboxLabel(dataSourceData, row?: any): string {
        if (!row) {
            return `${this.isAllSelected(dataSourceData) ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'
            } row ${row.position + 1}`;
    }

    /*commentGrantDetails(): void {
        const dialogRef = this.dialog.open(WorkflowDppfHbaComponent, {
            width: '500px',
        }); 
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
        });
    } */



}
