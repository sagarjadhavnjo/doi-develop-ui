import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-document-dialog',
  templateUrl: './document-dialog.component.html',
  styleUrls: ['./document-dialog.component.css']
})
export class DocumentDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DocumentDialogComponent>) { }

  ngOnInit() {
  }
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
