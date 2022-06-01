// import { CommonService } from './../../../modules/services/common.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { element } from 'protractor';

const HISTORY_DATA: any[] = [
  { officeName: 'Finance Department', postType: 'Primary Post', postName: 'Deputy Director'},
  { officeName: 'General Administration', postType: 'Secondary Post', postName: 'Deputy Section Officer'},
  { officeName: 'General Administration', postType: 'Secondary Post', postName: 'Account Officer'},
  { officeName: 'Ports & Transport', postType: 'Secondary Post', postName: 'Deputy Manager'},
  { officeName: 'Ports & Transport', postType: 'Secondary Post', postName: 'Section Officer'},
  { officeName: 'Information & Broadcasting', postType: 'Secondary Post', postName: 'Account Officer'},
];

@Component({
  selector: 'app-switch-role-dialog',
  templateUrl: './switch-role-dialog.html'
})

export class SwitchRoleDialogComponent implements OnInit {

  switchUserDataSource = new MatTableDataSource(HISTORY_DATA);
  historyColumns: string[] = [
    'officeName', 'postName', 'postType', 'switchRole'
  ];

  constructor(public dialogRef: MatDialogRef<SwitchRoleDialogComponent>) { }
  calcPer: number;
  ngOnInit() {
  }

  onCancel(): void {
      this.dialogRef.close('cancel');
  }

  calculatePer(): void {
      this.dialogRef.close(this.calcPer);
  }

  onUserPostChecked(element) {
    this.switchUserDataSource.data.forEach(el => {
      el.checked = false;
    });
    element.checked = true;
  }
}
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class AppHeaderComponent implements OnInit {
  @Output() menuToggle = new EventEmitter(null);
  // public edited = false;

  constructor(
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
  }

  switchRoleModel() {
    const dialogRef = this.dialog.open(SwitchRoleDialogComponent, {
        width: '780px'
    });
    dialogRef.afterClosed().subscribe(result => {
        // if (result !== 'cancel' && result !== '') {
        //     this.grantdataSource.data.forEach(function (data) {
        //         if (data['availableGrant'] !== '') {
        //             data['grantToBeRelease'] = Number(Number(data['availableGrant']) * (result / 100)).toFixed(2);
        //         }
        //     });
        // }
    });
}

  logout () {
    // this.commonService.logout();
  }

   // menuDisplay($event) {
  //  // debugger;
  //   this.menuToggle.emit($event);
  // }
}
