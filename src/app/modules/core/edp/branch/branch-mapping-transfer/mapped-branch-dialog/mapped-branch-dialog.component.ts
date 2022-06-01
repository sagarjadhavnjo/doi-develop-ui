import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { EDP_BRANCH } from 'src/app/shared/constants/edp/edp-data.constants';
import { msgConst } from 'src/app/shared/constants/edp/edp-msg.constants';

@Component({
    selector: 'app-mapped-branch-dialog',
    templateUrl: './mapped-branch-dialog.component.html',
    styleUrls: ['./mapped-branch-dialog.component.css']
})
export class MappedBranchDialogComponent implements OnInit {
    mappedBranchDataSource = new MatTableDataSource([{ noData: msgConst.BRANCH.NO_DATA_MSG }]);
    mappedBranchColumns: string[] = EDP_BRANCH.BRANCH.MAPPING_INFO.DISPLAY_NO_DATA_ROW;
    data: {
        branches: [];
        headerJson: [];
    };

    constructor(public dialogRef: MatDialogRef<MappedBranchDialogComponent>, @Inject(MAT_DIALOG_DATA) data: any) {
        this.data = data;
    }

    ngOnInit() {
        if (this.data.branches.length) {
            this.mappedBranchColumns = EDP_BRANCH.BRANCH.MAPPING_INFO.DISPLAY_COLS_HEADER;
            this.mappedBranchDataSource = new MatTableDataSource(this.data.branches);
        }
    }

    onClose(): void {
        this.dialogRef.close();
    }
}
