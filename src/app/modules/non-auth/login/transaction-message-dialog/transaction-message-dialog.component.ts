import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmDialog } from '../../../../shared/constants/common/common-data.constants';

@Component({
    selector: 'app-transaction-message-dialog',
    templateUrl: './transaction-message-dialog.component.html',
    styleUrls: ['./transaction-message-dialog.component.css']
})
export class TransactionMessageDialogComponent implements OnInit {
    dialogData: any;

    constructor(
        private dialogRef: MatDialogRef<TransactionMessageDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data
    ) {
        this.dialogData = data;
    }

    ngOnInit() {}
    onCancel(): void {
        this.dialogRef.close(ConfirmDialog.No);
    }
}
