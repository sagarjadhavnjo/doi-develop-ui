import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmDialog } from 'src/app/shared/constants/common/common-data.constants';

@Component({
  selector: 'app-sign-in-info',
  templateUrl: './sign-in-info.component.html',
  styleUrls: ['./sign-in-info.component.css']
})
export class SignInInfoComponent implements OnInit {

  dialogData: any;

    constructor(
        private dialogRef: MatDialogRef<SignInInfoComponent>,
        @Inject(MAT_DIALOG_DATA) private data
    ) {
        this.dialogData = data;
    }

    ngOnInit() {}
    onCancel(): void {
        this.dialogRef.close(ConfirmDialog.No);
    }
}
