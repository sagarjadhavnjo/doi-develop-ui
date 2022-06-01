import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
    selector: 'app-save-draft-dialog',
    templateUrl: './save-draft-dialog.html'
})
export class SaveDraftDialogEventComponent implements OnInit {
    transactionNo: number;
    constructor(
        public dialogRef: MatDialogRef<SaveDraftDialogEventComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) { }

    /**
     * @method ngOnInit
     * @description Call when component is load and initialize the view and load data
     */
    ngOnInit() {
        this.transactionNo = this.data.transactionNo;
    }

    /**
     * @method onNoClick
     * @description Call when No or Cancel button is clicked
     */
    onNoClick(): void {
        this.dialogRef.close('no');
    }

    /**
     * @method onYesClick
     * @description Call when Yes or Ok button is clicked
     */
    onYesClick() {
        this.dialogRef.close('yes');
    }

}
