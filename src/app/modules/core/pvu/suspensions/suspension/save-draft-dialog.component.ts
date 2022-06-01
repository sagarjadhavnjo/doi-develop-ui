import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
    selector: 'app-save-draft-dialog',
    templateUrl: './save-draft-dialog.html',
    styleUrls: ['./suspension.component.css']
})
export class SaveDraftDialogComponent implements OnInit {
    transNo: number;
    constructor(
        public dialogRef: MatDialogRef<SaveDraftDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) { }
    ngOnInit() {
        this.transNo = this.data.transNo;
    }
    onNoClick(): void {
        this.dialogRef.close('no');
    }

    onYesClick() {
        this.dialogRef.close('yes');
    }

}
