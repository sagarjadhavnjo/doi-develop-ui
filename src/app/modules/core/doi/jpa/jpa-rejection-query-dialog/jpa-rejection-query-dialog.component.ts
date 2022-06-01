import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-jpa-rejection-query-dialog',
  templateUrl: './jpa-rejection-query-dialog.component.html',
  styleUrls: ['./jpa-rejection-query-dialog.component.css']
})
export class JpaRejectionQueryDialogComponent implements OnInit {

  otherShow = false;
  isLangChange = false;
  theCheckbox = false;
  hasFocusSet: number;
  currentLang = new BehaviorSubject<string>('Eng');
  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<JpaRejectionQueryDialogComponent>
  ) { }
  other(event) {
    if (event.checked) {
      this.otherShow = true;
    }
    else {
      this.otherShow = false;
    }
  }
  onNoClick(): void {
    this.dialogRef.close('no');
  }


  ngOnInit() {
  }

}
