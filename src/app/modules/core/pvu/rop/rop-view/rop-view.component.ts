import { Component, OnInit, ElementRef } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntil, startWith, map } from 'rxjs/operators';
import { ROPService } from '../service/rop.service';
import { DatePipe } from '@angular/common';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { pvuMessage } from 'src/app/shared/constants/pvu/pvu-message.constants';

export interface HeaderElement {
    label: string;
    value: string;
}

@Component({
    selector: 'app-rop-view',
    templateUrl: './rop-view.component.html',
    styleUrls: ['./rop-view.component.css']
})
export class RopViewComponent implements OnInit {

    subscribeParams;
    eventDetails: HeaderElement[] = [];
    empCurrentDetails: HeaderElement[] = [];
    postDetails: HeaderElement[] = [];

    attachment_type_list = [
        { value: 'Supporting Document', viewValue: 'Supporting Document' },
    ];

    date = new FormControl(new Date());
    showDate: boolean = false;
    val: number;
    newDynamic: any = {};

    fileBrowseIndex: number;
    brwoseData: any[] = [{
        attachmentType: 'Supporting Document', fileName: 'pan', uploadedFileName: 'pan.jpg', uploadedBy: 'Amit Pandey'
    }];
    dataSourceBrowse = new MatTableDataSource(this.brwoseData);
    displayedBrowseColumns = ['attachmentType', 'fileName', 'uploadedFileName', 'uploadedBy', 'action'];

    eventId: number;
    isRemarksVisible: boolean;
    remarks: string;
    empId: number;
    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private toastr: ToastrService,
        private ropService: ROPService,
        public dialog: MatDialog,
    ) { }

    ngOnInit() {
        this.subscribeParams = this.activatedRoute.params.subscribe(resRoute => {
            this.eventId = +resRoute.id;
            if (this.eventId) {
                this.loadRopEventData(this.eventId);
            } else {
                this.router.navigate(['dashboard'], { relativeTo: this.activatedRoute });
            }
        });
    }

    loadRopEventData(id) {
        const param = {
            'id': id
        };
        this.ropService.getRopEventData(param).subscribe((res) => {
            if (res && res['status'] === 200 && res['result']) {
                // this.eventData = res['result'];
                this.setData(res['result']);
            } else {
                this.toastr.error(res['message']);
            }
        }, (err) => {
            this.toastr.error(err);
        });
    }

    setData(data) {
        // this.trnNo = data.trnNo;
        // this.trnDate = data.createdDate;
        let is7thPay = false;
        if (data.ropType === 413) {
            is7thPay = true;
        } else {
            is7thPay = false;
        }
        this.empId = data.empId;
        this.eventDetails = [
            { label: 'Reference Number', value: data.trnNo },
            { label: 'Reference Date', value: this.convertDate(data.createdDate) },
            { label: 'Office Name', value: data.officeName },
            { label: 'Event Order Number', value: data.orderNo },
            { label: 'Event Order Date', value: this.convertDate(data.orderDate) },
            { label: 'ROP Type', value: data.ropTypeValue },
            { label: 'Event Effective Date', value: this.convertDate(data.effectiveDate) },
        ];
        this.empCurrentDetails = [
            { label: 'Employee Number', value: data.empNo },
            { label: 'Employee Name', value: data.empName },
            { label: 'Class', value: data.className },
            { label: 'Designation', value: data.designationName },
        ];
        if (is7thPay) {
            this.empCurrentDetails.push({ label: 'Pay Level', value: data.curPayLevelValue });
        }
        this.empCurrentDetails.push({ label: 'Basic Pay', value: data.curBasicPay });
        this.empCurrentDetails.push({ label: 'Date of Joining', value: this.convertDate(data.dateOfJoining) });
        this.empCurrentDetails.push({ label: 'Date of Retirement', value: this.convertDate(data.retirmentDate) });
        this.empCurrentDetails.push({ label: 'Office Name', value: data.officeName });

        if (is7thPay) {
            this.postDetails = [
                { label: 'Pay Level', value: data.revPayLevelValue },
                { label: 'Cell Id', value: data.revCellValue },
                { label: 'Basic Pay', value: data.revBasicPay },
                { label: '7th Pay Effective Date', value: this.convertDate(data.effectiveDate) },
                { label: 'Next Increment Date', value: this.convertDate(data.revNextIncrementDate) },
            ];
            if (data.ropChange) {
                this.postDetails.push({ label: 'Reason For Change In Effective Date', value: data.ropChange });
            }
        } else {
            this.postDetails = [
                { label: 'Pay Band', value: data.revPayBandName },
                { label: 'Pay Band Value', value: data.revPayBandValue },
                { label: 'Grade Pay', value: data.revGradePayValue },
                { label: 'Basic Pay', value: data.revBasicPay },
                { label: '6th Pay Effective Date', value: this.convertDate(data.effectiveDate) },
                { label: 'Date ofNext Increment', value: this.convertDate(data.revNextIncrementDate) },
            ];
            if (data.ropChange) {
                this.postDetails.push({ label: 'Reason For Change In Effective Date', value: data.ropChange });
            }
        }

        if (data['remarks'] && data['remarks'] !== '' && data['remarks'] !== null && data['remarks'] !== undefined) {
            this.isRemarksVisible = true;
            this.remarks = data['remarks'];
        } else {
            this.isRemarksVisible = false;
            this.remarks = '';
        }
    }

    convertDate(date) {
        if (date !== 0 && date !== null && date !== undefined && date !== '') {
            const datePipe = new DatePipe('en-US');
            return datePipe.transform(date, 'dd-MM-yyyy');
        } else {
            return '';
        }
    }

    viewEmployeeDetails() {
        if (this.empId) {
            this.router.navigate(['dashboard/pvu/employee-creation', 'view', this.empId], { skipLocationChange: true });
        }
    }
    goToDashboard() {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '360px',
            data: pvuMessage.CLOSE
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                this.router.navigate(['/dashboard'], { skipLocationChange: true });
            }
        });
    }

}
