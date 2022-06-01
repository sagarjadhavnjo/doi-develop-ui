import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PostTransferService } from 'src/app/modules/core/edp/services/post-transfer.service';
import * as _ from 'lodash';
import { Officedata } from 'src/app/modules/core/edp/model/post-transfer-model';
@Component({
    selector: 'app-search-dialog',
    templateUrl: './search-dialog.component.html',
    styleUrls: ['./search-dialog.component.css']
})
export class SearchDialogComponent implements OnInit {

    officeDetailForm: FormGroup;
    browseData: Officedata[] = [];
    dataSource = new MatTableDataSource(this.browseData);
    displayedColumns: string[] = ['id', 'ddoNo', 'cardexNo', 'officeName', 'status'];
    displayedColumnsFooter: string[] = ['id'];
    constructor(
        private fb: FormBuilder,
        public dialog: MatDialog,
        private postTransferService: PostTransferService,
        private toastr: ToastrService,
        public dialogRef: MatDialogRef<SearchDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngOnInit() {
        this.officeDetailForm = this.fb.group({
            ddoNo: [''],
            cardexNo: [''],
            officeName: ['']
        });
    }

    searchOfficeFormDetails() {
        const param = {
            districtId: this.data.district,
            ddoNo: this.officeDetailForm.controls.ddoNo.dirty ? this.officeDetailForm.controls.ddoNo.value : '',
            // tslint:disable-next-line: max-line-length
            cardexNo: this.officeDetailForm.controls.cardexNo.dirty ? Number(this.officeDetailForm.controls.cardexNo.value) : -1,
            // tslint:disable-next-line: max-line-length
            officeName: this.officeDetailForm.controls.officeName.dirty ? this.officeDetailForm.controls.officeName.value : ''
        };
        this.postTransferService.getDistrictOfficeDetails(param).subscribe((res: any) => {
            if (res && res.result && res.status === 200) {
                this.browseData = res.result;
                this.dataSource = new MatTableDataSource(this.browseData);
            } else {
                this.dataSource = new MatTableDataSource([]);
                this.toastr.error(res.message);
             }
        }, (err) => {
            this.toastr.error(err);
        });
    }
    clearForm() {
        this.officeDetailForm.reset();
    }
    onNoClick(): void {
        this.dialogRef.close('no');
    }
}
