import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-warning-message',
  templateUrl: './warning-message.component.html',
  styleUrls: ['./warning-message.component.css']
})
export class WarningMessageComponent implements OnInit {
  dateNow: Date;
  effectiveDate: Date;

  constructor(
    private router: Router,
    private dialogRef: MatDialog,
    private dailog: MatDialogRef<WarningMessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit() {
    this.dateNow = this.data.authorizeDate;
    this.effectiveDate = this.data.effectiveDate;
  }

  goToDashboard() {
    this.router.navigate(['/dashboard'], { skipLocationChange: true });
  }

  onClose() {
    this.dailog.close();
    this.dialogRef.closeAll();
  }

}
