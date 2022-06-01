import { pvuMessage } from './../../../../common/error-message/common-message.constants';
import { SearchEmployeeComponent } from './../pvu-common/search-employee/search-employee.component';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'app-change-of-scale-emp-creation',
    templateUrl: './change-of-scale-emp-creation.component.html',
    styleUrls: ['./change-of-scale-emp-creation.component.css']
})
export class ChangeOfScaleEmpCreationComponent implements OnInit {
    containers = [];
    selectedIndex: number;
    tabDisable: boolean = true;
    doneHeader: boolean = false;
    currentDetails: boolean = false;
    reversionForm: FormGroup;
    currentDetailsForm: FormGroup;
    errorMessages;

    promotionFor_list: any[] = [
        { value: '1', viewValue: '7th Pay Commission' },
        { value: '2', viewValue: '6th Pay Commission' },
        { value: '3', viewValue: '5th Pay Commission' },
    ];
    type_list: any[] = [
        { value: '1', viewValue: 'Change of Scale' },
        // { value: '2', viewValue: 'Change of Scale - PVU' },
    ];
    class_list: any[] = [
        { value: '1', viewValue: 'Class I' },
        { value: '2', viewValue: 'Class II' },
        { value: '3', viewValue: 'Class III' },
        { value: '4', viewValue: 'Class IV' },
    ];
    designation_list: any[] = [
        { value: '1', viewValue: 'Teacher' },
        { value: '2', viewValue: 'Accountent' },
    ];
    payBand_list: any[] = [
        { value: '1', viewValue: 'PB-1 (5200-20200)' },
        { value: '2', viewValue: 'PB-2 (9300-34800)' },
        { value: '3', viewValue: 'PB-3 (15600-39100)' },
        { value: '4', viewValue: 'PB-4 (37400-67000)' },
        { value: '5', viewValue: '(67000-79000)' },
        { value: '6', viewValue: '(75500-80000)' },
        { value: '7', viewValue: '(80000)' },
        { value: '8', viewValue: '(90000)' },
    ];
    payLevel_list: any[] = [
        { value: '1', viewValue: 'Level 1' },
        { value: '2', viewValue: 'Level 2' },
        { value: '3', viewValue: 'Level 3' },
        { value: '4', viewValue: 'Level 4' },
        { value: '5', viewValue: 'Level 5' },
        { value: '6', viewValue: 'Level 6' },
        { value: '7', viewValue: 'Level 7' },
        { value: '8', viewValue: 'Level 8' },
        { value: '9', viewValue: 'Level 9' },
        { value: '10', viewValue: 'Level 10' },
        { value: '11', viewValue: 'Level 11' },
        { value: '12', viewValue: 'Level 12' },
        { value: '13', viewValue: 'Level 13' },
        { value: '14', viewValue: 'Level 14' },
        { value: '15', viewValue: 'Level 15' },
        { value: '16', viewValue: 'Level 16' },
        { value: '17', viewValue: 'Level 17' },
        { value: '18', viewValue: 'Level 18' },
    ];
    cellId_list: any[] = [
    ];
    gradePay_list: any[] = [
        { value: '1', viewValue: '1800' },
        { value: '2', viewValue: '2200' },
    ];
    optionAvailed_list: any[] = [
        { value: 1, viewValue: 'Yes' },
        { value: 2, viewValue: 'No' },
    ];

    optionType_list: any[] = [
        { value: 1, viewValue: 'Promotional' },
        { value: 2, viewValue: 'Isolated' },
    ];

    optionEmpType_list: any[] = [
        { value: '1', viewValue: 'GO' },
        { value: '2', viewValue: 'NGO' },
    ];

    attachment_type_list: any[] = [
        { value: 'Supporting Document', viewValue: 'Supporting Document' },
      ];


    promotionForCtrl: FormControl = new FormControl();
    typeCtrl: FormControl = new FormControl();
    payBandCtrl: FormControl = new FormControl();
    gradePayCtrl: FormControl = new FormControl();
    payLevelCtrl: FormControl = new FormControl();
    cellIdCtrl: FormControl = new FormControl();
    optionAvailedCtrl: FormControl = new FormControl();
    optionTypeCtrl: FormControl = new FormControl();
    optionEmpTypeCtrl: FormControl = new FormControl();
    attachmentTypeCtrl: FormControl = new FormControl();

    date = new FormControl(new Date());
    showDate: boolean = false;
    // showSubType: Boolean = false;

    val: number;
    newDynamic: any = {};
    // autopopulated: Boolean = false;
    showDataEmployee: boolean = false;
    showSeventhPayCommField = false;
    showFifthPayCommField: boolean = false;
    showSixthPayCommField = false;
    

    dataSource = new MatTableDataSource;
    displayedColumns = ['examName', 'examBody', 'dateOfPassing', 'status'];

    dataSourceDept = new MatTableDataSource;
    displayedDeptColumns = ['examName', 'examBody', 'dateOfPassing', 'status'];

    dataSourceLang = new MatTableDataSource;
    displayedLangColumns = ['langName', 'examBody', 'dateOfPassing', 'status'];

    fileBrowseIndex: number;
    brwoseData: any[] = [{
      name: undefined,
      file: undefined,
      attachment: 'Final Order'
    }];
    dataSourceBrowse = new MatTableDataSource(this.brwoseData);
    displayedBrowseColumns = ['attachmentType', 'fileName', 'browse', 'uploadedFileName', 'uploadedBy', 'action'];

    constructor
        (
            private fb: FormBuilder,
            private toastr: ToastrService,
            public dialog: MatDialog,
            private el: ElementRef
    ) {
        for (let startCount = 1, idValue = 1; startCount <= 40; startCount++ , idValue++) {
            const objData = {
                'value': idValue, 'viewValue': startCount.toString()
            };
            this.cellId_list.push(objData);
        }
    }

    ngOnInit() {
        this.errorMessages = pvuMessage;
        this.reversionForm = this.fb.group({
            transactionNo: [''],
            promotionFor: ['1'],
            orderNumber: [''],
            eventEffectiveDate: [''],
            officeName: [''],
            type: [''],
            employeeNumber: [''],
            employeeName: [''],
            employeeClass: [''],
            employeeDesignation: [''],
            employeeOfficeName: [''],
            employeePayLevel: [''],
            employeeCellId: [''],
            employeePayBand: [''],
            employeePayBandValue: [''],
            employeeGradePay: [''],
            employeeBasicPay: [''],
            dateOf1stHps: [''],
            dateOf2ndHps: [''],
            effectiveDate: [''],
            employeeDoj: [''],
            class: [''],
            designation: [''],
            optionAvailed: [''],
            payLevel: [''],
            cellId: [''],
            payBand: [''],
            gradePay: [''],
            empBasicPay: [''],
            payBandValue: [''],
            employeesNumber: [''],
            optionType: [''],
            optionEmpType: [''],
            dateOfNextIncrementFatch: [''],
            duration: [''],
            grade: [''],
            scale: [''],
            dateOfRetirement: ['']
        });
        this.containers.push(this.containers.length);
        // this.promotionFor = 2;
        this.promotionChange();
    }

    promotionChange() {
        const revisionFormValue = this.reversionForm.value;
        this.showSixthPayCommField = false;
        this.showSeventhPayCommField = false;
        this.showFifthPayCommField = false;
        switch (revisionFormValue.promotionFor) {
            case '1' :
                    this.showSeventhPayCommField = true;
                    break;
            case '2' :
                    this.showSixthPayCommField = true;
                    break;
            case '3' :
                this.showFifthPayCommField = true;   
                break;
        }
    }

    // tslint:disable-next-line:use-life-cycle-interface
    showEmployee() {
        this.showDataEmployee = !this.showDataEmployee;
    }
    saveEstimate(data) {

    }
    openDialogEmployeeNumber() {
        // tslint:disable-next-line: no-use-before-declare
        const dialogRef = this.dialog.open(SearchEmployeeComponent, {
            width: '800px',
        });

        dialogRef.afterClosed().subscribe(result => {
            this.reversionForm.patchValue({
                employeeNumber: '1278456976',
                employeeName: 'Amit Pandey',
                employeeClass: 'Class III',
                employeeDesignation: 'Teacher',
                employeeOfficeName: 'Office 1',
                employeePayLevel: 'Level 1',
                employeeCellId: '1',
                employeePayBand: '1S (4440-7440)',
                employeePayBandValue: '4440',
                employeeGradePay: '1300',
                employeeBasicPay: '5740',
                dateOfNextIncrementFatch: '26/11/2019',
                employeeDoj: '26/11/2019',
                // effectiveDate: '26/11/2019',
                // DateofPassing: '22/11/2019',
                // examName: 'UPSC',
            });

            const data = this.dataSource.data;
            data.push({
                examName: 'CCC+ Theory',
                examBody: 'Exam Body 1',
                dateOfPassing: '22/10/2019',
                status: 'Pass',
            });
            this.dataSource.data = data;

            const dataDept = this.dataSourceDept.data;
            dataDept.push({
                examName: 'Exam 1',
                examBody: 'Exam Body 1',
                dateOfPassing: '22/10/2019',
                status: 'Pass',
            });
            this.dataSourceDept.data = dataDept;

            const dataLang = this.dataSourceLang.data;
            dataLang.push({
                langName: 'Gujarati',
                examBody: 'Exam Body 1',
                dateOfPassing: '22/10/2019',
                status: 'Pass',
            });
            this.dataSourceLang.data = dataLang;
        });
    }
    getTabIndex(tabIndex) {
        this.selectedIndex = tabIndex;
    }
    showCurrentDetails(event) {
        if (event.value === '3') {
            this.currentDetails = true;
        } else {
            this.currentDetails = false;
        }
    }
    submitDetails() {
        this.toastr.success('Data submit successfully');
    }
    add() {
        this.containers.push(this.containers.length);
    }
    deleteRow(index) {
        this.containers.splice(index, 1);
    }
    goToDashboard() { }
    resetForm() {
        this.reversionForm.reset();
    }
    changeEvent(changeval) {
        if (changeval.value === 1) {
            this.showDate = true;
        } else {
            this.showDate = false;
        }
    }

    onFileSelection(fileSelected) {
        if (fileSelected.target && fileSelected.target.files) {
          this.dataSourceBrowse.data[this.fileBrowseIndex].file = fileSelected.target.files[0];
        }
      }
    
      openFileSelector(index) {
        this.el.nativeElement.querySelector('#fileBrowse').click();
        this.fileBrowseIndex = index;
      }

    addBrowse() {
        if (this.dataSourceBrowse) {
          const data = this.dataSourceBrowse.data[this.dataSourceBrowse.data.length - 1];
          if (data && data.file) {
            const p_data = this.dataSourceBrowse.data;
            p_data.push({
              name: undefined,
              file: undefined,
              attachment: 'Supporting Document'
            });
            this.dataSourceBrowse.data = p_data;
          } else {
            // this.toastr.error('Please fill the detail.');
          }
        }
      }

      deleteBrowse(index) {
        this.dataSourceBrowse.data.splice(index, 1);
        this.dataSourceBrowse = new MatTableDataSource(this.dataSourceBrowse.data);
      }
}

