import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EDPDialogResult } from 'src/app/shared/constants/edp/edp-data.constants';

@Component({
    selector: 'app-message-branch-dialog',
    templateUrl: './message-branch-dialog.component.html',
    styleUrls: ['./message-branch-dialog.component.css']
})
export class MessageBranchDialogComponent implements OnInit {
    constructor(public dialogRef: MatDialogRef<MessageBranchDialogComponent>, @Inject(MAT_DIALOG_DATA) public data) {}
    message: string;
    ngOnInit() {
        this.message = this.data.message;
    }

    onNoClick(): void {
        this.dialogRef.close(EDPDialogResult.NO);
    }
}
