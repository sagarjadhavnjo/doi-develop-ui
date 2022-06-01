import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
    selector: 'app-reset-dialog',
    templateUrl: './reset-clear-dialog.component.html'
})
export class ResetClearDialogPayEventComponent implements OnInit {
    transactionNo: number;
    constructor(
        public dialogRef: MatDialogRef<ResetClearDialogPayEventComponent>
    ) { }

    /**
     * @method ngOnInit
     * @description Call when component is load and initialize the view and load data
     */
    ngOnInit() {
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
