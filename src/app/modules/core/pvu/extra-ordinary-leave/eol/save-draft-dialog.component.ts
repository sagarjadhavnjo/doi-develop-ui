import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
    selector: 'app-save-draft-dialog',
    templateUrl: './save-draft-dialog.html',
    styleUrls: ['./eol.component.css']
})
export class SaveDrafDialogComponent implements OnInit {
    transNo: number;
    // empName: string;
    // designation: string;
    constructor(
        public dialogRef: MatDialogRef<SaveDrafDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) { }
    ngOnInit() {
        this.transNo = this.data.transNo;
        // this.designation = this.data.designation;
    }
    onNoClick(): void {
        this.dialogRef.close('no');
    }

    onYesClick() {
        this.dialogRef.close('yes');
    }

}
