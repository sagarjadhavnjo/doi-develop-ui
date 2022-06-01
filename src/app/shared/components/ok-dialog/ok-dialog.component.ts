import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
    selector: 'app-ok-dialog',
    templateUrl: './ok-dialog.component.html',
    styleUrls: ['./ok-dialog.component.css']
})
export class OkDialogComponent implements OnInit {
    flag = false;
    constructor(
        public dialogRef: MatDialogRef<OkDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
        dialogRef.disableClose = true;
    }
    ngOnInit() {
        if(this.data.flag) {
            this.flag = true;
        }
    }
    onOkClick(): void {
        this.dialogRef.close('ok');
    }

}
