import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeTypeChangeService } from '../services/employee-type-change.service';
import { MessageConst, pvuMessage } from './../../../../../shared/constants/pvu/pvu-message.constants';
import { SearchEmployeeComponent } from '../../pvu-common/search-employee/search-employee.component';
import { ToastrService } from 'ngx-toastr';
import { cloneDeep, each } from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteService } from 'src/app/shared/services/route.service';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { StorageService } from 'src/app/shared/services/storage.service';
import { APIConst } from 'src/app/shared/constants/pvu/pvu-api.constants';
import { AttachmentEtcComponent } from '../attachment-etc/attachment-etc.component';
import { EventViewPopupService } from '../../services/event-view-popup.service';

@Component({
    selector: 'app-employee-type-change',
    templateUrl: './employee-type-change.component.html',
    styleUrls: ['./employee-type-change.component.css']
})
export class EmployeeTypeChangeComponent implements OnInit {
    // Keeps 1st tab selected by defaut
    selectedIndex: number = 0;

    // Formgroup for maintainging feild values
    empTypeChangeForm: FormGroup;

    // Formcontrol for search functionality on dropdowns
    empTypeCtrl: FormControl = new FormControl();
    yesNoCtrl: FormControl = new FormControl();

    // constant initial values
    eventMinDate = new Date(1996, 0, 1);
    todayDate = new Date();
    viewMode: boolean = false;
    isTabDisabled = false;
    showSubmitButton = true;
    attachmentData = {
        moduleName: APIConst.EMPLOYEE_TYPE_CHANGE.ATTACHMENT_PREFIX
    };

    // Constant Messages
    errorMessages = pvuMessage;
    validationMsg = MessageConst;

    // Dropdown Lists
    empPayTypeList: any = [];
    conditionList = [];

    // loaded employee detail
    empSearchedDetail: any = [];

    tpvuRegPrboId = null;
    tpvuRegPrboSdId = null;
    statusId: any;
    empNo: number;
    transactionNo = null;
    referenceDate: Date = null;
    userOffice;
    currentPost;

    @ViewChild('attachmentTab') attachmentTab: AttachmentEtcComponent;
    isSubmitted: boolean = false;
    action: string = null;
    apiCalled: boolean = false;
    dialogOpen: boolean;
    menuId: number;

    constructor(
        public fb: FormBuilder,
        private employeeTypeChangeService: EmployeeTypeChangeService,
        public dialog: MatDialog,
        private toastr: ToastrService,
        private router: Router,
        private routeService: RouteService,
        private storageService: StorageService,
        private datePipe: DatePipe,
        private activatedRoute: ActivatedRoute,
        private eventViewPopupService: EventViewPopupService
    ) {}

    ngOnInit(): void {
        const self = this;
        const userOffice = this.storageService.get('currentUser');
        if (userOffice && userOffice['post'][0]['loginPost'] !== undefined) {
            this.currentPost = userOffice['post'].filter(item => item['loginPost'] === true);
        }
        self.userOffice = self.storageService.get('userOffice');
        this.createForm();
        this.getLookupDetails();
        this.activatedRoute.params.subscribe((resRoute) => {
            this.action = resRoute.action;
            if (['view', 'edit'].includes(this.action)) {
                self.tpvuRegPrboSdId = +resRoute.id;
                if (this.tpvuRegPrboSdId) {
                    this.getSavedDetails(this.tpvuRegPrboSdId);
                }
                if (this.action === 'view') {
                    this.showSubmitButton = false;
                    this.viewMode = true;
                    this.empTypeChangeForm.disable();
                }
            }
        });
        const eventID = +this.eventViewPopupService.eventID;
        const mId = +this.eventViewPopupService.linkMenuID;
        this.eventViewPopupService.eventID = 0;
        this.eventViewPopupService.eventCode = '';
        this.eventViewPopupService.linkMenuID = 0;
        if (eventID !== 0) {
            this.dialogOpen = true;
            this.action = 'view';
            this.tpvuRegPrboSdId = eventID;
            this.menuId = mId;
            if (this.tpvuRegPrboSdId) {
                this.getSavedDetails(this.tpvuRegPrboSdId);
                this.showSubmitButton = false;
                this.viewMode = true;
                this.empTypeChangeForm.disable();
            }
        }
    }

    /**
     * /@method createForm
     * @description Creates form group
     */
    createForm() {
        const self = this;
        this.empTypeChangeForm = this.fb.group({
            officeName: [self.userOffice.officeName, Validators.required],
            eventOrderNo: [null, Validators.required],
            eventOrderDate: [null, Validators.required],
            eventEffectiveDate: [null, Validators.required],
            employeeNo: [null, Validators.required],
            empName: [null],
            class: [null],
            designation: [null],
            officeNameEmp: [null],
            curEmpType: [null],
            doj: [null],
            empPayType: [null, Validators.required],
            yesNo: [null],
            empType: [null]
        });
    }

    /**
     * /@method getLookupDetails
     * @description To get the master data of all lookup's.
     */
    getLookupDetails() {
        // TODO static list to be replaced by api call
        this.conditionList.push({ lookupInfoId: 1, lookupInfoName: 'NO' },
                                { lookupInfoId: 2, lookupInfoName: 'YES' });
        this.employeeTypeChangeService.getLookupDetails().subscribe(
            res => {
                if (res && res['result'] && res['status'] === 200) {
                    this.empPayTypeList = cloneDeep(res['result']).filter(
                        (item) => {
                            if ([160, 161].includes(item['id'])) { // id 160 for Adhoc & 161 for Probhation
                                if (item['id'] === 160) {
                                    item['viewValue'] = 'Adhoc To Regular';
                                } else if (item['id'] === 161) {
                                    item['viewValue'] = 'Probation To Regular';
                                }
                                return true;
                            }
                        }
                    );
                }
            },
            err => {
                this.toastr.error(err);
            }
        );
    }

    /**
     * @method empPayTypeChange
     * @description On Pay Type Change fuction get called
     * @param event Changed value passed by event
     */
    empPayTypeChange(event) {
        if (event && event.value === 161) {
            this.empTypeChangeForm.get('yesNo').setValue(2);
            this.empTypeChangeForm.get('yesNo').setValidators([Validators.required]);
        } else {
            this.empTypeChangeForm.get('yesNo').setValue('');
            this.empTypeChangeForm.get('yesNo').setValidators(null);
        }
        this.empTypeChangeForm.get('yesNo').updateValueAndValidity();
        this.resetEmpDetails();
    }

    /**
     * @method resetEmpDetails
     * @description reset formGroup values
     */
    resetEmpDetails() {
        this.empSearchedDetail = [];
        this.empTypeChangeForm.patchValue({
            employeeNo: null,
            empName: null,
            class: null,
            designation: null,
            officeNameEmp: null,
            doj: null,
            empType: null
        });
    }

    /**
     * /@method  openDialogEmployeeNumber
     *  @description Open employee search dialog
     */
    openDialogEmployeeNumber() {
        if (!this.empTypeChangeForm.get('empPayType').value) {
            this.toastr.error('Select value from Employee Pay Type Dropdown first');
            return false;
        }
        if (!this.validateEventEffectiveDate()) {
            return false;
        }
        const empNo = String(this.empTypeChangeForm.get('employeeNo').value);
        if (empNo.length === 10) {
            this.getEmpData(empNo);
        } else {
            const dialogRef = this.dialog.open(SearchEmployeeComponent, {
                width: '800px',
                data: {
                    hideCaseNo: true,
                    hideGpfNo: true,
                    empPayType: this.empTypeChangeForm.get('empPayType').value
                }
            });

            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    this.empTypeChangeForm.get('employeeNo').patchValue(result.employeeNo);
                    this.getEmpData(this.empTypeChangeForm.get('employeeNo').value);
                }
            });
        }
    }

    /**
     * /@method  onSubmitDetails
     *  @description called on approve click
     * @param type 'Draft' or 'Approved'
     */
    onSubmitDetails(type, attachmentTab?) {
        if (this.validateSubmitSave(type)) {
            if (type === 'Approved') {
                // TODO change submitDialog
                const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                    width: '400px',
                    height: 'auto',
                    data: pvuMessage.SUBMIT
                });
                dialogRef.afterClosed().subscribe(result => {
                    if (result === 'yes') {
                        // this.isSubmitted = true;
                        this.saveData(type);
                    } else {
                        // this.isSubmitted = false;
                    }
                });
            } else if (type === 'Draft') {
                this.saveData(type, attachmentTab);
            }
        } else {
            if (attachmentTab) {
                this.selectedIndex = 0;
            }
            return false;
        }
    }

    /**
     * @method validateSubmitSave
     * @param type 'Draft' or 'Approved'
     * @returns boolean value for is valid
     */
    validateSubmitSave(type): boolean {
        if (!this.empTypeChangeForm.valid) {
            if (type === 'Draft') {
                let draftReturn = true;
                Object.keys(this.empTypeChangeForm.controls).forEach((resCtrl) => {
                    if (['eventOrderNo', 'eventOrderDate', 'eventEffectiveDate', 'employeeNo',
                    'empPayType'].includes(resCtrl)) {
                        if (this.empTypeChangeForm.get(resCtrl).invalid) {
                            this.empTypeChangeForm.get(resCtrl).markAsTouched({ onlySelf: true });
                            draftReturn = false;
                        }
                    }
                });
                if (!draftReturn) {
                    this.toastr.error(this.validationMsg.VALIDATION.TOASTR);
                }
                return draftReturn;
            } else if (type === 'Approved') {
                each(this.empTypeChangeForm.controls, eventFormControl => {
                    if (eventFormControl.status === 'INVALID' && (type !== 'Draft'
                    && eventFormControl !== this.empTypeChangeForm.get('yesNo') || type === 'Approved')) {
                        eventFormControl.markAsTouched({ onlySelf: true });
                    }
                });
                this.toastr.error(this.validationMsg.VALIDATION.TOASTR);
                // this.isSubmitted = false;
                return false;
            }
        } else if (type === 'Approved'
        && !this.attachmentTab.checkForMandatory()
        ) {
            this.selectedIndex = 1;
            return false;
        }
        return true;
    }

    /**
     * @method saveData
     * @description to save the employee change type data
     * @param type 'Draft' Or 'Approved'
     */
    saveData(type, attachmentTab?) {
        this.isTabDisabled = true;
        if (!this.validateDoj()) {
            return true;
        }
        if (this.empSearchedDetail[0]) {
            this.empSearchedDetail[0].convEffecDate =
                    this.datePipe.transform(this.empTypeChangeForm.controls['eventEffectiveDate'].value, 'yyyy-MM-dd');
            this.empSearchedDetail[0].convOrderDate =
                    this.datePipe.transform(this.empTypeChangeForm.controls['eventOrderDate'].value, 'yyyy-MM-dd');
            this.empSearchedDetail[0].convOrderNo = this.empTypeChangeForm.controls['eventOrderNo'].value;
            this.empSearchedDetail[0].empIncEligible = this.empTypeChangeForm.controls['yesNo'].value;
        }
        const saveObj = {
            currentEmpPaytype: this.empTypeChangeForm.controls['empPayType'].value,
            empIncEligible: this.empSearchedDetail[0]?.empIncEligible,
            convOrderNo:  this.empSearchedDetail[0]?.convOrderNo,
            convEffecDate:  this.empSearchedDetail[0]?.convEffecDate + 'T00:00:00Z',
            convOrderDate:  this.empSearchedDetail[0]?.convOrderDate + 'T00:00:00Z',
            doj: this.datePipe.transform(this.empSearchedDetail[0]?.doj, 'dd/MM/yyyy'),
            desigId:  this.empSearchedDetail[0]?.desigId,
            desigName:  this.empSearchedDetail[0]?.desigName,
            className:  this.empSearchedDetail[0]?.className,
            officeId: this.empSearchedDetail[0]?.officeId,
            officeName: this.empSearchedDetail[0]?.officeName,
            empId: this.empSearchedDetail[0]?.empId,
            empNo: this.empSearchedDetail[0]?.empNo,
            transNo: this.empSearchedDetail[0]?.trnsNo,
            refDate: this.empSearchedDetail[0]?.refDate,
            empPaytype:  this.empSearchedDetail[0]?.empPayType,
            empType:  this.empSearchedDetail[0]?.empType,
            statusId: type === 'Approved' ? 327 : 205,
            status: type,
            tpvuRegPrboId: this.tpvuRegPrboId,
            tpvuRegPrboSdId: this.tpvuRegPrboSdId,
        };
        this.employeeTypeChangeService.saveDetails(saveObj).subscribe(
            res => {
                if (res && res['result'] && res['status'] === 200) {
                    if (attachmentTab) {
                        this.selectedIndex = 1;
                    }
                    const result = cloneDeep(res['result']);
                    // this.isTabDisabled = false;
                    this.tpvuRegPrboSdId = result.tpvuRegPrboSdId;
                    this.statusId = result.statusId;
                    // this.isSubmitted = this.statusId !== 205;
                    this.toastr.success(res['message']);
                    if (type === 'Approved') {
                        this.router.navigateByUrl('/', { skipLocationChange: true }).then(
                            () => this.router.navigate(['/dashboard/pvu/employee-type-change/employee-type-change'],
                                            { skipLocationChange: true }));
                    }
                } else {
                    this.selectedIndex = 0;
                    if (type === 'Approved') {
                        // this.isSubmitted = false;
                    }
                    this.toastr.error(res['message']);
                }
                this.isTabDisabled = false;
            },
            err => {
                this.selectedIndex = 0;
                this.isTabDisabled = false;
                this.toastr.error(err);
            }
        );
    }

    /**
     * @method getSavedDetails
     * @description to get the emp change type data based on primary id
     * @param Id primary id of emp change type
     */
    getSavedDetails(Id) {
        const obj = {
            id: Id,
            statusId: 205
        };
        this.employeeTypeChangeService.geteEmpChangeTypeDetails(obj).subscribe(
            res => {
                if (res && res['result'] && res['status'] === 200) {
                    const dt = cloneDeep(res['result']);
                    this.empSearchedDetail = [];
                    this.empSearchedDetail.push(dt);
                    this.transactionNo = dt.transNo;
                    this.tpvuRegPrboId = dt.tpvuRegPrboId;
                    this.tpvuRegPrboSdId = dt.tpvuRegPrboSdId;
                    this.referenceDate = dt.refDate;
                    this.statusId = dt.statusId;
                    // this.isTabDisabled = false;
                    // this.isSubmitted = this.statusId !== 205;

                    this.empTypeChangeForm.patchValue({
                        // officeName: dt.officeName,
                        eventOrderNo: dt.convOrderNo,
                        eventOrderDate: dt.convOrderDate,
                        eventEffectiveDate: dt.convEffecDate,
                        employeeNo: dt.empNo,
                        empName: dt.empName,
                        class: dt.className,
                        designation: dt.desigName,
                        officeNameEmp: dt.officeName,
                        doj: this.datePipe.transform(dt.doj, 'dd/MM/yyyy'),
                        empPayType: dt.currentEmpPaytype,
                        yesNo: dt.empIncEligible,
                        empType: dt.empTypeName
                    });
                }
            },
            err => {
                this.toastr.error(err);
            }
        );
    }

    /**
     * @method getEmpData
     * @description get emp data based on emp number
     * @param empNo Employee Number
     */
    getEmpData(empNo) {
        if (empNo && String(empNo).length !== 10 || this.apiCalled || !this.validateEventEffectiveDate()) {
            return false;
        }
        this.apiCalled = true;
        const self = this;
        const obj = {
            empNo: empNo,
            officeId: self.userOffice.officeId,
            empPaytype: this.empTypeChangeForm.controls['empPayType'].value
        };
        this.employeeTypeChangeService.getEmpDetails(obj).subscribe(
            res => {
                if (res && res['result'] && res['result'].length > 0 && res['status'] === 200) {
                    if (!this.tpvuRegPrboSdId) {
                        this.tpvuRegPrboSdId = null;
                        this.tpvuRegPrboId = null;
                        this.referenceDate = null;
                    }
                    this.empSearchedDetail = cloneDeep(res['result']);
                    if (this.validateDoj()) {
                        this.empTypeChangeForm.patchValue({
                            employeeNo: this.empSearchedDetail[0]['empNo'],
                            empName: this.empSearchedDetail[0]['empName'],
                            class: this.empSearchedDetail[0]['empClassName'],
                            designation: this.empSearchedDetail[0]['desigName'],
                            officeNameEmp: this.empSearchedDetail[0]['officeName'],
                            doj: this.datePipe.transform(this.empSearchedDetail[0]['doj'], 'dd/MM/yyyy'),
                            empType: this.empSearchedDetail[0]['empTypeName']
                        });
                    } else {
                        this.resetEmpDetails();
                    }
                } else if (res['status'] === 404) {
                    this.resetEmpDetails();
                    this.toastr.error(res['message']);
                } else {
                    this.toastr.error('Employee Details not found for selected Pay type');
                    this.resetEmpDetails();
                }
                this.apiCalled = false;
            },
            err => {
                this.apiCalled = false;
                this.toastr.error(err);
            }
        );
    }

    /**
     * @method onEffectiveDateChange
     * @description triggered when date gets change
     */
    onEffectiveDateChange() {
        if (this.empSearchedDetail[0]) {
            if (!this.validateDoj()) {
                this.empTypeChangeForm.get('eventEffectiveDate').setValue(this.empSearchedDetail[0]['convEffecDate']);
            }
        }
    }

    validateEventEffectiveDate() {
        if (!this.empTypeChangeForm.get('eventEffectiveDate').value &&
        !this.empTypeChangeForm.get('eventEffectiveDate').valid) {
            this.toastr.error('Select valid Event Effective Date');
            return false;
        }
        return true;
    }

    /**
     * @method validateDoj
     * @description to validate if Event effective date is greater or equal to joining date
     */
    validateDoj(): boolean {
        if (this.empSearchedDetail[0] &&
            this.empSearchedDetail[0]['doj'] && this.empTypeChangeForm.get('eventEffectiveDate').value) {
            const tempDoj = this.datePipe.transform(this.empSearchedDetail[0]['doj'], 'dd/MM/yyyy');
            const doj = new Date(this.empSearchedDetail[0]['doj']);
            const effectiveDate = new Date(this.empTypeChangeForm.get('eventEffectiveDate').value);
            if (effectiveDate < doj) {
                this.toastr.error('DOJ for Employee No: ' + this.empSearchedDetail[0]['empNo'] + ' is ' + tempDoj
                + ', Please select Effective date greater than or Equal to DOJ');
                return false;
            }
        } else {
            this.toastr.error('DOJ or Event Effective Date missing');
            return false;
        }
        return true;
    }

    /**
     * /@function  goToListing
     *  @description Navigate to the listing screen
     *  @returns Navigate to the listing screen
     */
    goToListing() {
        this.router.navigate(['/dashboard/pvu/employee-type-change/list'], { skipLocationChange: true });
    }

    /**
     * @method goToDashboard
     * @description to navigate back to dashboard
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
     * @method submitDetails
     * @description Function triggered by attachment tab submit button
     */
    submitDetails(fromAttachment?) {
        this.onSubmitDetails('Approved');
    }

    /**
     * @method OnListClick
     * @description Function is called to go listing
     */
    OnListClick() {
        const url = '/dashboard/pvu/employee-type-change/list';
        this.router.navigate([url], { skipLocationChange: true });
    }

    /**
     * @method onPrint
     * @description to perform print action on approved record in view mode
     */
    onPrint() {}

    /**
     * @method onTabChange
     * @description on tab change method gets called
     */
    onTabChange(event) {
        if (event && event === 1 && !this.tpvuRegPrboSdId) {
            setTimeout(() => {
                this.onSubmitDetails('Draft', true);
            }, 300);
        }
    }
}
