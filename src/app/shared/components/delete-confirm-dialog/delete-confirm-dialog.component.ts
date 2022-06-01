import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-delete-confirm-dialog',
    templateUrl: './delete-confirm-dialog.component.html',
    styleUrls: ['./delete-confirm-dialog.component.css']
})
export class DeleteConfirmDialogComponent implements OnInit {

    constructor(
        public dialogRef: MatDialogRef<DeleteConfirmDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) { }
    ngOnInit() { }
    onNoClick(): void {
        this.dialogRef.close('no');
    }
    onYesClick() {
        this.dialogRef.close('yes');
    }
}
