import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
declare function SetGujarati();

const ELEMENT_DATA: any[] = [
  {
    lines: '',
  },
];
@Component({
  selector: 'app-jpa-query-dialog',
  templateUrl: './jpa-query-dialog.component.html',
  styleUrls: ['./jpa-query-dialog.component.css']
})
export class JpaQueryDialogComponent implements OnInit {




  otherShow = false;
  isLangChange = false;
  theCheckbox = false;
  hasFocusSet: number;
  currentLang = new BehaviorSubject<string>('Eng');
  displayedCols = ['lines', 'action'];

  dataSourceLines = new MatTableDataSource(ELEMENT_DATA);
  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<JpaQueryDialogComponent>
  ) { }
  ngOnInit() {
  }
  vitocancel(): void {
    this.dialogRef.close();
  }
  print() {
    setTimeout(() => {
      this.dialogRef.close();
      this.router.navigate(['/treasury-bill/vitoReport']);
    }, 0);
  }
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


  setGujaratiDefault() {
    SetGujarati();
    this.currentLang.next('Guj');

  }
  // delete record
  deleteRow(index) {
    this.dataSourceLines.data.splice(index, 1);
    this.dataSourceLines = new MatTableDataSource(
      this.dataSourceLines.data
    );
  }
  // Add record
  addDetails() {
    const p_data = this.dataSourceLines.data;
    p_data.push({
      line: ''
    });
    this.dataSourceLines.data = p_data;
  }
}
