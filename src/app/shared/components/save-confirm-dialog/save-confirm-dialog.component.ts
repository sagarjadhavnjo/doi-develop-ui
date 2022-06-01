import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
    selector: 'app-save-confirm-dialog',
    templateUrl: './save-confirm-dialog.component.html',
    styleUrls: ['./save-confirm-dialog.component.css']
})
export class SaveConfirmDialogComponent implements OnInit {
    constructor(
        public dialogRef: MatDialogRef<SaveConfirmDialogComponent>
    ) { }

    selectedIndex: number;

    ngOnInit() { }

    onCancel() {
        this.closeDialog('no');
    }

    onyes() {
        this.closeDialog('yes');
    }

    closeDialog(popup: 'no' | 'yes') {
        this.dialogRef.close(popup);
    }

}
