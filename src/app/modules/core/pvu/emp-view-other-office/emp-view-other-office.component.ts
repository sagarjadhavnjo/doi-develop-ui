import { Component, OnInit, Inject } from '@angular/core';
import { EmployeeCreationService } from 'src/app/modules/services/pvu/employee-creation.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
    selector: 'app-emp-view-other-office',
    templateUrl: './emp-view-other-office.component.html',
    styleUrls: ['./emp-view-other-office.component.css']
})
export class EmpViewOtherOfficeComponent implements OnInit {

    constructor(
        private pvuService: EmployeeCreationService,
        public dialogRef: MatDialogRef<EmpViewOtherOfficeComponent>,
        @Inject(MAT_DIALOG_DATA) public data) { }

    personalDetailsJson: object = [];
    deptDetailsJson: object = [];
    ngOnInit() {
      let pan = 0;
      if (this.data && this.data['panNo'] !== '') {
        pan = this.data['panNo'];
      }
      if (pan !== 0) {
        const param = {
            'fieldValue' : pan
        };
        this.pvuService.getDuplicatePanDetail(param).subscribe((data) => {
            if (data && data['result']) {
                const empDetail = data['result'];
                this.personalDetailsJson = [
                    { label: 'Office Name', value: empDetail['officeName'] != null ? empDetail['officeName'] : '-' },
                    {
                        label: 'Employee Number',
                        value: empDetail['employeeNo'] != null ? empDetail['employeeNo'] : '-'
                    },
                    { label: 'Salutation', value: empDetail['salutation'] != null ? empDetail['salutation'] : '-' },
                    {
                        label: 'Employee Name',
                        value: empDetail['employeeName'] != null ? empDetail['employeeName'] : '-'
                    },
                    {
                        label: 'Middle/Father/Husband Name',
                        value: empDetail['middelName'] != null ? empDetail['middelName'] : '-'
                    },
                    { label: 'Surname/Last Name', value: empDetail['lastName'] != null ? empDetail['lastName'] : '-' },
                    { label: 'Gender', value: empDetail['gender'] != null ? empDetail['gender'] : '-' },
                    { label: 'Email Id', value: empDetail['emailId'] != null ? empDetail['emailId'] : '-' },
                    { label: 'Mobile No', value: empDetail['mobileNo'] != null ? empDetail['mobileNo'] : '-' },
                    { label: 'PAN number', value: empDetail['panNo'] != null ? empDetail['panNo'] : '-' }
                ];

                this.deptDetailsJson = [
                    {
                        label: 'Designation',
                        value: empDetail['designationName'] != null ? empDetail['designationName'] : '-'
                    },
                    { label: 'District', value: empDetail['districtName'] != null ? empDetail['districtName'] : '-' },
                    { label: 'Cardex No.', value: empDetail['cardexNo'] != null ? empDetail['cardexNo'] : '-' },
                    {
                        label: 'Name of Present Office',
                        value: empDetail['officeName'] != null ? empDetail['officeName'] : '-'
                    },
                    {
                        label: 'Sub Office',
                        value: empDetail['subOfficeName'] != null ? empDetail['subOfficeName'] : '-'
                    },
                    { label: 'DDO Code', value: empDetail['ddoNo'] != null ? empDetail['ddoNo'] : '-' },
                    {
                        label: 'Office Adress and Contact No.',
                        value: empDetail['officeAddress'] != null ? empDetail['officeAddress'] : '-'
                    },
                    { label: 'Class', value: empDetail['className'] != null ? empDetail['className'] : '-' },
                    { label: 'Station', value: empDetail['station'] != null ? empDetail['station'] : '-' },
                    { label: 'Taluka', value: empDetail['taluka'] != null ? empDetail['taluka'] : '-' },
                    {
                        label: 'Parent Administrative Department Name',
                        value: empDetail['parentDepartment'] != null ? empDetail['parentDepartment'] : '-'
                    },
                    {
                        label: 'Head of Department Name',
                        value: empDetail['headOfDepartment'] != null ? empDetail['headOfDepartment'] : '-'
                    },
                ];
            }
        });
      }
     }

}
