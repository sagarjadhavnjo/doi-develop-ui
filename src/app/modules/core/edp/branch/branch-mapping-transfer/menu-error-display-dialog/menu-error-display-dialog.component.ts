import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { EDP_BRANCH } from 'src/app/shared/constants/edp/edp-data.constants';
import { msgConst } from 'src/app/shared/constants/edp/edp-msg.constants';
import { MappedBranchDialogComponent } from '../mapped-branch-dialog/mapped-branch-dialog.component';

@Component({
    selector: 'app-menu-error-display-dialog',
    templateUrl: './menu-error-display-dialog.component.html',
    styleUrls: ['./menu-error-display-dialog.component.css']
})
export class MenuErrorDisplayDialogComponent implements OnInit {
    menuErrorsDataSource = new MatTableDataSource([{ noData: msgConst.BRANCH.NO_DATA_MSG }]);
    menuErrorsColumns: string[] = EDP_BRANCH.BRANCH.MENU_ACCESS_INFO.DISPLAY_NO_DATA_ROW;
    data: {
        menuInfo: [];
        headerJson: [];
    };

    constructor(public dialogRef: MatDialogRef<MappedBranchDialogComponent>, @Inject(MAT_DIALOG_DATA) data: any) {
        this.data = data;
    }

    ngOnInit() {
        if (this.data.menuInfo && this.data.menuInfo.length) {
            this.menuErrorsColumns = EDP_BRANCH.BRANCH.MENU_ACCESS_INFO.DISPLAY_COLS_HEADER;
            this.menuErrorsDataSource = new MatTableDataSource(this.data.menuInfo);
        }
    }

    onClose(): void {
        this.dialogRef.close();
    }
}
