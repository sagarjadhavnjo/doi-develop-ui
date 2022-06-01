import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-transaction-number-dialog',
    templateUrl: './transaction-number-dialog.component.html',
    styleUrls: ['./transaction-number-dialog.component.css']
})
export class TransactionNumberDialogComponent implements OnInit {

    trnNo: number;
    constructor(
        public dialogRef: MatDialogRef<TransactionNumberDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
    ) {
        dialogRef.disableClose = true;
    }
    ngOnInit() {
        this.trnNo = this.data.trnNo;
    }
    onNoClick(): void {
        this.dialogRef.close('no');
    }

    onYesClick() {
        this.dialogRef.close('yes');
    }


}
