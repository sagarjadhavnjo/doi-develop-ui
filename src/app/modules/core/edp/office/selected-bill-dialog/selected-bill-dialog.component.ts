import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-selected-bill-dialog',
    templateUrl: './selected-bill-dialog.html',
    styleUrls: ['./selected-bill-dialog.css']
})

export class SelectedBillDialogComponent implements OnInit {
    constructor(
        public dialogRef: MatDialogRef<SelectedBillDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) { }
    ngOnInit() { }
    onCancel(): void {
        this.dialogRef.close('no');
    }
}
