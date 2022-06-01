import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-already-exist-dialog',
  templateUrl: './already-exist-dialog.component.html',
  styleUrls: ['./already-exist-dialog.component.css']
})
export class AlreadyExistDialogComponent implements OnInit {

  message: string;

  constructor(
    private dailogRef: MatDialogRef<AlreadyExistDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data
  ) { }

  ngOnInit() {
    this.message = this.data;
  }

  onNoClick(ele) {
    this.dailogRef.close(ele);
  }

}
