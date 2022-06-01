import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-submit-dialog',
  templateUrl: './submit-dialog.component.html',
  styleUrls: ['./submit-dialog.component.css']
})
export class SubmitDialogComponent implements OnInit {
  message = '';
  constructor(public dialogRef: MatDialogRef<SubmitDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    if (this.data === '') {
      this.message = 'Entries submitted successfully!';
    } else {
      this.message = this.data;
    }
  }
  // On Click of Ok button
  OnClickOk() {
    this.dialogRef.close('Ok');
  }
}
