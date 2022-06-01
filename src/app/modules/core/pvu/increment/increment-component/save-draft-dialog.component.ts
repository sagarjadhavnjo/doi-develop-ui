import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
    selector: 'app-save-draft-dialog',
    templateUrl: './save-draft-dialog.html',
    styleUrls: ['./increment.component.css']
})
export class SaveDraftDialogComponent implements OnInit {
    transactionNo: number;
    // empName: string;
    // designation: string;
    constructor(
        public dialogRef: MatDialogRef<SaveDraftDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) { }
    ngOnInit() {
        this.transactionNo = this.data.transactionNo;
        // this.empName = this.data.empName;
        // this.designation = this.data.designation;
    }
    onNoClick(): void {
        this.dialogRef.close('no');
    }

    onYesClick() {
        this.dialogRef.close('yes');
    }

}
