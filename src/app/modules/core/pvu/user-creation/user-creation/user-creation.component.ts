import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteService } from 'src/app/shared/services/route.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { pvuMessage } from './../../../../../shared/constants/pvu/pvu-message.constants';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { UserCreationService } from '../service/user-creation.service';
import { DatePipe } from '@angular/common';
import { ValidationService } from 'src/app/modules/services/validatation.service';
import { UserConfirmationDialogComponent } from './user-confirmation-dialog.component';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-user-creation',
    templateUrl: './user-creation.component.html',
    styleUrls: ['./user-creation.component.css'],
    providers: [
        { provide: MatDialogRef, useValue: '' }
    ]
})
export class UserCreationComponent implements OnInit, OnDestroy {
    panMask = 'SSSSS0000S';
    mobNoMask = '0000000000';
    userCreationForm: FormGroup;
    salutationCtrl: FormControl = new FormControl();
    empDesignationCtrl: FormControl = new FormControl();
    empTypeCtrl: FormControl = new FormControl();
    currentPost: any;
    userOffice: any;
    dialogOpen: boolean;
    viewMode: boolean = true;
    errorMessages = pvuMessage;
    isSaveDraftVisible: boolean = true;
    isDisabled: boolean = false;
    btnSave: boolean = false;
    salutationList: [] = [];
    empDesignationList: [] = [];
    empPayTypeList: [] = [];
    loader: boolean = false;
    duplicatePanNo: boolean = false;
    showCaseNo: boolean = false;
    employeeDataPersonal;
    defaultDob: Date;
    minDoj: Date = new Date();
    minDob: Date = new Date(this.minDoj.getFullYear() - 100, this.minDoj.getMonth(), this.minDoj.getDate());
    maxDate = new Date();
    subscribeParams: Subscription;
    action: string;
    empId: number;
    duplicateMessage: string;
    isSubmitBtnVisible: boolean = true;
    dateOfBirth = new Date();
    formattedDateOfBirth = new Date();

    constructor(
        public fb: FormBuilder,
        private storageService: StorageService,
        private datepipe: DatePipe,
        private router: Router,
        public dialog: MatDialog,
        private routeService: RouteService,
        private toastr: ToastrService,
        private userCreationService: UserCreationService,
        private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.getLookUpInfoData();
        const self = this;
        const userOffice = this.storageService.get('currentUser');
        if (userOffice && userOffice['post'][0]['loginPost'] !== undefined) {
            this.currentPost = userOffice['post'].filter((item) => item['loginPost'] === true);
        }
        self.userOffice = self.storageService.get('userOffice');
        this.createForm();
        this.subscribeParams = this.activatedRoute.params.subscribe(resRoute => {
            this.action = resRoute.action;
            if (this.action === 'view') {
                this.empId = +resRoute.id;
                this.getUserDetail();
                this.userCreationForm.disable();
                this.isSubmitBtnVisible = false;
            }
        });
        this.router.routeReuseStrategy.shouldReuseRoute = function () {
            return false;
        };
    }

    /**
       * @method createEventForm
       * @description Function is called to initialize form group for event details
       */
    createForm() {
        const self = this;
        self.userCreationForm = self.fb.group({
            district: [self.userOffice.districtName, Validators.required],
            ddoNo: [self.userOffice.ddoNo, Validators.required],
            cardexNo: [self.userOffice.cardexno, Validators.required],
            officeName: [self.userOffice.officeName, Validators.required],
            caseNo: ['', Validators.required],
            salutationId: '',
            empFirstName: '',
            empMiddleName: '',
            empLastName: '',
            designationId: '',
            dateOfBirth: ['', Validators.required],
            mobileNo: ['', [Validators.required, ValidationService.mobileNoValidator]],
            panNo: ['', [Validators.required, ValidationService.panCardValidation]],
            empPayTypeId: new FormControl('', Validators.required),
        });
    }

    /**
     * @method getLookUpInfoData
     * @param -
     * @returns To get the lookup data
     */
    getLookUpInfoData() {
        const self = this;
        this.userCreationService.getLookupDetails().subscribe((res) => {
            if (res && res['result'] && res['status'] === 200) {
                this.salutationList = res['result'];
            }
        }, (err) => {
            this.loader = false;
            self.toastr.error(err);
        });
        this.userCreationService.getDesignation().subscribe((res) => {
            if (res && res['result'] && res['status'] === 200) {
                this.empDesignationList = res['result'];
            }
        });
        this.userCreationService.getEmpPayType().subscribe((res) => {
            if (res && res['result'] && res['status'] === 200) {
                const empPayType = [156, 157, 161];
                this.empPayTypeList = res['result'].filter((r1) => {
                    return empPayType.includes(r1.id);
                });
            }
        });
    }

    /**
     * /@function empTypeChange
     * @param event event value passed by change event
     * @description On Dropdown value change function called
     */
    empTypeChange(empPayTypeId) {
        if (this.userCreationForm.controls['empPayTypeId'].value === 156) {
            this.showCaseNo = true;
            this.userCreationForm.get('caseNo').setValidators(Validators.required);
            if (this.action !== 'view') {
                this.userCreationForm.enable();
                this.resetFormData(['caseNo']);
            }
        } else if (this.userCreationForm.controls['empPayTypeId'].value === 161) {
            this.showCaseNo = true;
            if (this.action !== 'view') {
                this.userCreationForm.enable();
                this.resetFormData(['caseNo']);
                this.userCreationForm.get('caseNo').setValidators(null);
                this.userCreationForm.get('caseNo').updateValueAndValidity();
                this.userCreationForm.get('salutationId').setValidators(Validators.required);
                this.userCreationForm.get('salutationId').updateValueAndValidity();
                this.userCreationForm.get('empFirstName').setValidators(Validators.required);
                this.userCreationForm.get('empFirstName').updateValueAndValidity();
                this.userCreationForm.get('designationId').setValidators(Validators.required);
                this.userCreationForm.get('designationId').updateValueAndValidity();
                this.userCreationForm.get('dateOfBirth').setValidators(Validators.required);
                this.userCreationForm.get('dateOfBirth').updateValueAndValidity();
            }
        } else {
            this.showCaseNo = false;
            if (this.action !== 'view') {
                this.userCreationForm.enable();
                this.resetFormData();
                this.userCreationForm.get('caseNo').setValidators(null);
                this.userCreationForm.controls.caseNo.updateValueAndValidity();
            }
        }
        this.userCreationForm.get('panNo').setValidators([Validators.required, ValidationService.panCardValidation]);
        this.userCreationForm.get('panNo').updateValueAndValidity();
        this.userCreationForm.get('mobileNo').setValidators([Validators.required, ValidationService.mobileNoValidator]);
        this.userCreationForm.get('mobileNo').updateValueAndValidity();
        this.duplicatePanNo = false;
    }

    /**
     * @description To set validation based on the DOB change
     */
    dobOnChange(data) {
        let dateObj;
        if (data.value) {
            dateObj = data.value;
        } else {
            dateObj = data;
        }

        if (!(new Date(dateObj.getFullYear() + 18, dateObj.getMonth(),
            dateObj.getDate()) <= new Date())) {
            this.toastr.error(pvuMessage.AGE_ERROR);
            this.userCreationForm.patchValue({
                dateOfBirth: ''
            });
        }
        this.dateOfBirth = this.userCreationForm.get('dateOfBirth').value;
        let val = _.cloneDeep(this.userCreationForm.get('dateOfBirth').value);
        val = this.convertDateOnly(val);
        const dateArr = val.split('-');
        if (dateArr && dateArr.length === 3) {
            this.formattedDateOfBirth = new Date(
                dateArr[0], dateArr[1], dateArr[2]
            );
        }
    }

    /**
     * @description TO  display the tooltip for dropdown field
     * @param formGroup FormGroup Name
     * @param list Dropdown List Array
     * @param formControlKey form control name key
     * @param listIdKey id key of dropdown list array
     * @param listValueKey display value key of dropdown list array
     */
    getTitleName(formGroup, list, formControlKey, listIdKey, listValueKey) {
        if (formGroup) {
            const val = formGroup.get(formControlKey).value;
            if (list && list.length > 0) {
                const data = list.filter(obj => {
                    return obj[listIdKey] === val;
                });
                if (data && data.length === 1) {
                    return data[0][listValueKey];
                }
            }
        }
        return '';
    }

    onEmployeeKeyUp(event) {
        const self = this;
        // tslint:disable-next-line: deprecation
        if (event['keyCode'] === 13 || event['keyCode'] === 9 || event['keyCode'] == 'search') { // For the Enter - 13, Tab - 9
            if (event['keyCode'] !== 'search') {
                event.preventDefault();
                event.stopPropagation();
            }
            this.resetFormData();
            self.getEmployeeDetail();
        }
    }

    getEmployeeDetail() {
        const passData = {
            empPayTypeId: this.userCreationForm.get('empPayTypeId').value,
            caseNo: this.userCreationForm.get('caseNo').value
        };
        this.userCreationService.getEmpByCaseNo(passData).subscribe((res) => {
            if (res && res['result'] && res['status'] === 200) {
                const data = res['result'];
                if (data) {
                    this.userCreationForm.patchValue({
                        ...data
                    });
                }
                const dateOfBirth = data.dateOfBirth.split('-');
                this.userCreationForm.patchValue({
                    dateOfBirth: new Date(dateOfBirth[2], dateOfBirth[1] - 1, dateOfBirth[0])
                });
                if (data) {
                    !data.salutationId ? this.userCreationForm.get('salutationId').enable() :
                        this.userCreationForm.get('salutationId').disable();
                    !data.empFirstName ? this.userCreationForm.get('empFirstName').enable() :
                        this.userCreationForm.get('empFirstName').disable();
                    !data.empMiddleName ? this.userCreationForm.get('empMiddleName').enable() :
                        this.userCreationForm.get('empMiddleName').disable();
                    !data.empLastName ? this.userCreationForm.get('empLastName').enable() :
                        this.userCreationForm.get('empLastName').disable();
                    !data.designationId ? this.userCreationForm.get('designationId').enable() :
                        this.userCreationForm.get('designationId').disable();
                    !data.dateOfBirth ? this.userCreationForm.get('dateOfBirth').enable() :
                        this.userCreationForm.get('dateOfBirth').disable();
                    !data.panNo ? this.userCreationForm.get('panNo').enable() :
                        this.userCreationForm.get('panNo').disable();
                    !data.mobileNo ? this.userCreationForm.get('mobileNo').enable() :
                        this.userCreationForm.get('mobileNo').disable();
                }
            } else {
                this.toastr.error(res['message']);
                this.resetFormData(['caseNo']);
                this.userCreationForm.enable();
            }
        });
    }

    resetFormData(additionalKeys = []) {
        ([
            'salutationId', 'empFirstName', 'empMiddleName',
            'empLastName', 'designationId', 'dateOfBirth', 'panNo', 'mobileNo'
        ].concat(additionalKeys)).forEach(key => {
            this.userCreationForm.get(key).reset();
        });
    }

    /**
     * @description To convert the date into 'yyyy/MM/dd' format
     * @param date date value
     */
    convertDateFormatEmp(date) {
        if (date !== '' && date !== undefined && date !== null) {
            date = new Date(date);
            return this.datepipe.transform(date, 'yyyy/MM/dd');
        }
        return '';
    }

    /**
     * @description To convert the date into 'yyyy-MM-dd' format
     * @param date date value
     */
    convertDateOnly(date) {
        if (date !== '' && date !== undefined && date !== null) {
            date = new Date(date);
            return this.datepipe.transform(date, 'yyyy-MM-dd').toString();
        }
        return '';
    }

    /**
     * @method submitDetails
     * @description Function is called to submit event details
     */
    onSubmitDetails() {
        let valid = true;
        if (this.userCreationForm.invalid) {
            _.each(this.userCreationForm.controls, function (control) {
                if (control.status === 'INVALID') {
                    control.markAsTouched({ onlySelf: true });
                    valid = false;
                }
            });
        } else {
            let dataToSend = {};
            dataToSend = this.requestData(dataToSend);
            const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                width: '360px',
                data: pvuMessage.CLOSE
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result === 'yes') {
                    this.userCreationService.onSubmitData(dataToSend).subscribe(res => {
                        if (res && res['result'] && res['status'] === 200) {
                            res['result']['empMiddleName'] =
                                res['result']['empMiddleName'] ? ' ' + res['result']['empMiddleName'] : '';
                            res['result']['empLastName'] =
                                res['result']['empLastName'] ? ' ' + res['result']['empLastName'] : '';
                            const dialogRef1 = this.dialog.open(UserConfirmationDialogComponent, {
                                width: '360px',
                                data: {
                                    empNo: res['result']['employeeNo'],
                                    empName: res['result']['salutation'] + ' '
                                        + res['result']['empFirstName']
                                        + res['result']['empMiddleName']
                                        + res['result']['empLastName'],
                                    designation: res['result']['designation']
                                }
                            });
                            dialogRef1.afterClosed().subscribe(result1 => {
                                if (result1 === 'yes') {
                                    this.router.navigateByUrl('/', { skipLocationChange: true })
                                        .then(() => this.router.navigate(['/dashboard/pvu/user-creation/user-creation'],
                                            { skipLocationChange: true }));
                                }
                            });
                        } else {
                            this.toastr.error(res['message']);
                        }
                    }, (err) => {
                        this.toastr.error(err);
                    });
                }
            });
        }
    }

    requestData(dataToSend) {
        const self = this;
        const formData = this.userCreationForm.getRawValue();
        const param = {
            empPayTypeId: formData.empPayTypeId,
            caseNo: formData.caseNo ? formData.caseNo : null,
            salutationId: formData.salutationId,
            empFirstName: formData.empFirstName,
            empMiddleName: formData.empMiddleName ? formData.empMiddleName : null,
            empLastName: formData.empLastName ? formData.empLastName : null,
            designationId: formData.designationId,
            dateOfBirth: this.convertDateFormat(formData.dateOfBirth),
            panNo: formData.panNo.toUpperCase(),
            mobileNo: Number(formData.mobileNo)
        };
        return param;
    }

    /**
     * /@function getIncrementDetail
     * @description To Fetch all Lookup and Summary data
     * @param id Increment Transaction Id
     * @returns Fetch all Lookup and Summary data for the transaction
     */
    getUserDetail() {
        const self = this;
        this.userCreationService.getUserDetail({ id: this.empId }).subscribe(res => {
            if (res && res['result']) {
                const data = res['result'];
                this.userCreationForm.patchValue({
                    ...data
                });
                this.showCaseNo = data.empPayTypeId !== 157; // For hiding caseNo for fixPay -> 157
                if (data.dateOfBirth) {
                    let dateOfBirth = data.dateOfBirth;
                    if (dateOfBirth.indexOf('T') !== -1) {
                        dateOfBirth = dateOfBirth.split('T')[0].split('-');
                    } else {
                        dateOfBirth = dateOfBirth.split('-');
                    }
                    self.userCreationForm.patchValue({
                        dateOfBirth: new Date(dateOfBirth[2], Number(dateOfBirth[1]) - 1, dateOfBirth[0])
                    });
                }
            }
        },
            err => {
                self.toastr.error(err);
            }
        );
    }

    /**
     * /@function convertDateFormat
     * @description Convert the date object in the yyyy-MM-dd format
     * @param date Date object
     * @returns Convert date in the yyyy-MM-dd format
     */
    convertDateFormat(date, format?) {
        if (date !== '' && date !== undefined && date != null) {
            date = new Date(date);
            return this.datepipe.transform(date, format ? format : 'dd-MM-yyyy');
        }
        return '';
    }

    /**
     * /@function  goToListing
     *  @description Navigate to the listing screen
     *  @param -
     *  @returns Navigate to the listing screen
     */
    goToListing() {
        this.router.navigate(['/dashboard/pvu/user-creation/list'], { skipLocationChange: true });
    }

    /**
     * Navigate to the dashboard
     */
    goToDashboard() {
        if (!this.dialogOpen) {
            const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                width: '360px',
                data: pvuMessage.CLOSE
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result === 'yes') {
                    const url: string = this.routeService.getPreviousUrl();
                    this.router.navigate([url.toString()], { skipLocationChange: true });
                }
            });
        } else {
            this.dialog.closeAll();
        }
    }

    /**
     * @method  decimalKeyPress
     * @description To allow decimal with only two decimal point
     * @param event keypress event data
     */
    decimalKeyPress(event: any) {
        const pattern = /^\d+(\.\d{0,2})?$/;
        const inputChar = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        let tempstr = event.target.value;
        tempstr += inputChar;

        if (!pattern.test(tempstr)) {
            event.preventDefault();
            return false;
        }
    }

    /**
     * @method  convertUppercase
     * @description to convert into uppercase
     * @param data data
     */
    convertUppercase(data) {
        if (data.target.value) {
            this.duplicateMessage = null;
            data.target.value = data.target.value.toUpperCase();
        }
        return data;
    }

    /**
     * @method  checkDuplicatePAN
     * @description To check the PAN No duplication
     * @param event pan no event data
     */
    checkDuplicatePAN(event) {
        if (event.target.value) {
            const isPanOld = true;
            if (isPanOld) {
                const param = { panNo: event.target.value };
                this.userCreationService.checkDuplicatePAN(param).subscribe((data) => {
                    if (data && data['status'] === 400) {
                        this.duplicatePanNo = true;
                        this.duplicateMessage = data['message'];
                    } else {
                        this.duplicatePanNo = false;
                        this.duplicateMessage = null;
                    }
                }, (err) => {
                    this.toastr.error(err);
                });
            }
        }
    }

    ngOnDestroy(): void {
    }

}
