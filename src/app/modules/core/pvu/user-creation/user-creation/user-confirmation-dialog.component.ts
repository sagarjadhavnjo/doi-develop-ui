import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
    selector: 'app-employee-confirmation-dialog',
    templateUrl: './employee-confirmation-dialog.html',
    styleUrls: ['./employee-confirmation-dialog.css']
})
export class UserConfirmationDialogComponent implements OnInit {
    empNo: number;
    empName: string;
    designation: string;
    constructor(
        public dialogRef: MatDialogRef<UserConfirmationDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
        dialogRef.disableClose = true;
     }
    ngOnInit() {
        this.empNo = this.data.empNo;
        this.empName = this.data.empName;
        this.designation = this.data.designation;
    }
    onNoClick(): void {
        this.dialogRef.close('no');
    }

    onYesClick() {
        this.dialogRef.close('yes');
    }

}
