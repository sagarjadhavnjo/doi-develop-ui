import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-view-data-dialog',
  templateUrl: './view-data-dialog.component.html',
  styleUrls: ['./view-data-dialog.component.css']
})
export class ViewDataDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ViewDataDialogComponent>,
    // data should be in
    // {'lable':[],'value':[]}
    @Inject(MAT_DIALOG_DATA) public data: any) { }
  ngOnInit(): void {
    console.log(this.data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
