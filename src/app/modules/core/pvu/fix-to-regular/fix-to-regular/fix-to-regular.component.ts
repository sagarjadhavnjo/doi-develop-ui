import { DatePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from 'src/app/shared/services/storage.service';
import { FixToRegularService } from '../service/fix-to-regular.service';
import { pvuMessage } from './../../../../../shared/constants/pvu/pvu-message.constants';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { RouteService } from 'src/app/shared/services/route.service';
import { SearchEmployeeComponent } from '../../pvu-common/search-employee/search-employee.component';
import { FifthCommitionPayComponent } from '../fifth-commition-pay/fifth-commition-pay.component';
import { SixCommitionPayComponent } from '../six-commition-pay/six-commition-pay.component';
import { SevenCommitionPayComponent } from '../seven-commition-pay/seven-commition-pay.component';
import { FixtoRegular, FixtoRegularDto } from '../models/fix-to-regular.model';
import { AttachmentEtcComponent } from '../../employee-type-change/attachment-etc/attachment-etc.component';
import { APIConst } from 'src/app/shared/constants/pvu/pvu-api.constants';
import { TransactionMessageDialogComponent } from 'src/app/modules/non-auth/login/transaction-message-dialog/transaction-message-dialog.component';
import { OkDialogComponent } from 'src/app/shared/components/ok-dialog/ok-dialog.component';
import { EventViewPopupService } from '../../services/event-view-popup.service';

@Component({
    selector: 'app-fix-to-regular',
    templateUrl: './fix-to-regular.component.html',
    styleUrls: ['./fix-to-regular.component.css']
})
export class FixToRegularComponent implements OnInit, AfterViewInit {
    fixToRegularForm: FormGroup;
    eventMinDate = new Date(1998, 0, 1);
    todayDate = new Date();
    currentPost: any;
    userOffice: any;
    errorMessages = pvuMessage;
    transactionNumber: string;
    transactionDate: Date;
    showSaveasDraft: boolean = false;
    employeeDetail: any;
    dialogOpen: boolean;
    isSaveDraftVisible: boolean = true;
    isDisabled: boolean = false;
    btnSave: boolean = false;
    fifthMin: number = 0;
    fifthMax: number = 0;
    isFifth: boolean = false;
    payCommissionList: [] = [];
    payCommIdCtrl: FormControl = new FormControl();
    action: string;
    fixPay: number = 0;
    isSubmitted: number = 0;
    isFifthPC: boolean = false;
    isSixthPC: boolean = true;
    isSeventhPC: boolean = true;
    resetPaybandVal: boolean = false;
    @ViewChild(FifthCommitionPayComponent) fifthCommitionPayComponent: FifthCommitionPayComponent;
    @ViewChild(SixCommitionPayComponent) sixCommitionPayComponent: SixCommitionPayComponent;
    @ViewChild(SevenCommitionPayComponent) sevenCommitionPayComponent: SevenCommitionPayComponent;
    @ViewChild('attachmentTab') attachmentTab: AttachmentEtcComponent;
    attachmentData = {
        moduleName: APIConst.EMPLOYEE_TYPE_CHANGE.ATTACHMENT_PREFIX
    };
    selectedIndex: number = 0;
    currentId: any;
    isFileUploaded: boolean = false;
    validationMessage: any;

    constructor(
        public fb: FormBuilder,
        private storageService: StorageService,
        private fixToRegularService: FixToRegularService,
        private datepipe: DatePipe,
        public dialog: MatDialog,
        private toastr: ToastrService,
        private router: Router,
        private cd: ChangeDetectorRef,
        private activatedRoute: ActivatedRoute,
        private eventViewPopupService: EventViewPopupService
    ) { }

    ngOnInit(): void {
        const userOffice = this.storageService.get('currentUser');
        if (userOffice && userOffice['post'][0]['loginPost'] !== undefined) {
            this.currentPost = userOffice['post'].filter(item => item['loginPost'] === true);
        }
        this.userOffice = this.storageService.get('userOffice');
        this.createForm();
        this.getAllCommission();

        this.activatedRoute.params.subscribe(routeParam => {
            this.action = routeParam.action;
            this.isSubmitted = routeParam.isSubmitted ? Number(routeParam.isSubmitted) : 0;
            this.currentId = routeParam.id;

            if (this.action === 'view') {
                this.fixToRegularForm.disable();
            }
            if (this.currentId) {
                this.getFixToRegularData(this.currentId, this.action);
            }
        });

        // below functionality is for view action from event tab
        const eventID = +this.eventViewPopupService.eventID;
        this.eventViewPopupService.eventID = 0;
        this.eventViewPopupService.eventCode = '';
        if (eventID !== 0) {
            this.dialogOpen = true;
            this.action = 'view';
            this.currentId = eventID;
            if (this.currentId) {
                this.fixToRegularForm.disable();
                this.isSubmitted = 1;
                this.getFixToRegularData(this.currentId, this.action);
            }
        }
    }

    isFileUploadedAction(value: boolean) {
        this.isFileUploaded = value;
    }

    ngAfterViewInit(): void {
        this.fixToRegularForm.addControl('form7pc', this.sevenCommitionPayComponent.form7pc);
        this.sevenCommitionPayComponent.form7pc.setParent(this.fixToRegularForm);
        this.fixToRegularForm.addControl('form6pc', this.sixCommitionPayComponent.form6pc);
        this.sixCommitionPayComponent.form6pc.setParent(this.fixToRegularForm);
    }

    /**
     * @method createEventForm
     * @description Function is called to initialize form group for event details
     */
    createForm() {
        this.fixToRegularForm = this.fb.group({
            id: [],
            fyId: [],
            officeName: [this.userOffice.officeName, Validators.required],
            eventOrderNo: ['', Validators.required],
            eventOrderDate: ['', Validators.required],
            eventEffectiveDate: [null, Validators.required],
            employeeNo: ['', Validators.required],
            empName: ['', Validators.required],
            class: [''],
            designation: [''],
            empBasicPay: [''],
            dateJoining: [''],
            departmentCategoryName: [''],
            curEmpType: [''],
            empType: [''],
            empId: [''],
            ofcName: ['']
        });
    }

    get id() {
        return this.fixToRegularForm.get('id').value;
    }
    get getEventEffectiveDate() {
        return this.fixToRegularForm.get('eventEffectiveDate').value;
    }

    get EmoloyeeNo() {
        return this.fixToRegularForm.get('employeeNo').value;
    }

    get payLevelId() {
        return this.sevenCommitionPayComponent && this.sevenCommitionPayComponent.form7pc
            ? this.sevenCommitionPayComponent.form7pc.get('payLevelId').value
            : 0;
    }
    /**
     * @method getAllCommission
     * @description Function is called to get commission list
     */
    getAllCommission() {
        this.fixToRegularService.getAllCommissions().subscribe(
            res => {
                if (res['status'] === 200 && res['result']) {
                    this.payCommissionList = _.cloneDeep(res['result']['Dept_Pay_Commission']);
                } else {
                    this.toastr.error(res['message']);
                }
            },
            err => {
                this.toastr.error(err);
            }
        );
    }

    resetPaybandEvent(value: boolean) {
        this.resetPaybandVal = value;
    }
    /**
     * @method onEffectiveDateChange
     * @description Function is called on effective date change and sets minimum date
     * @param event Changed effective date
     */
    onEffectiveDateChange(value) {
        if (value) {
            if (this.fixToRegularForm.get('employeeNo').value) {
                this.getEmployeeDetail(false);
            }
            this.setElements(value);
        }
    }

    setElements(dateValue) {
        const effDateYear = new Date(dateValue).getFullYear();
        if (effDateYear <= 2005) {
            this.isFifthPC = true;
            this.isSixthPC = false;
            this.isSeventhPC = false;
            this.cd.detectChanges();
            this.fixToRegularForm.removeControl('form5pc');
            this.fixToRegularForm.removeControl('form6pc');
            this.fixToRegularForm.removeControl('form7pc');
            this.fixToRegularForm.addControl('form5pc', this.fifthCommitionPayComponent.form5pc);
            this.fixToRegularForm.get('form5pc').updateValueAndValidity();
            this.fifthCommitionPayComponent.form5pc.setParent(this.fixToRegularForm);
        } else if (effDateYear >= 2006 && effDateYear < 2016) {
            this.isFifthPC = false;
            this.isSixthPC = true;
            this.isSeventhPC = false;
            this.cd.detectChanges();
            this.fixToRegularForm.removeControl('form5pc');
            this.fixToRegularForm.removeControl('form6pc');
            this.fixToRegularForm.removeControl('form7pc');
            this.fixToRegularForm.addControl('form6pc', this.sixCommitionPayComponent.form6pc);
            this.fixToRegularForm.get('form6pc').updateValueAndValidity();
            this.sixCommitionPayComponent.form6pc.setParent(this.fixToRegularForm);
        } else {
            this.isFifthPC = false;
            this.isSixthPC = true;
            this.isSeventhPC = true;
            this.cd.detectChanges();
            this.fixToRegularForm.removeControl('form5pc');
            this.fixToRegularForm.removeControl('form6pc');
            this.fixToRegularForm.removeControl('form7pc');
            this.fixToRegularForm.addControl('form6pc', this.sixCommitionPayComponent.form6pc);
            this.fixToRegularForm.get('form6pc').updateValueAndValidity();
            this.sixCommitionPayComponent.form6pc.setParent(this.fixToRegularForm);
            this.fixToRegularForm.addControl('form7pc', this.sevenCommitionPayComponent.form7pc);
            this.fixToRegularForm.get('form7pc').updateValueAndValidity();
            this.sevenCommitionPayComponent.form7pc.setParent(this.fixToRegularForm);
        }
    }
    onEmployeeKeyUp(event: KeyboardEvent) {
        if (event['keyCode'] === 13 || event['keyCode'] === 9) {
            this.resetPaybandVal = true;
            // For the Enter - 13, Tab - 9
            event.preventDefault();
            event.stopPropagation();
            this.getEmployeeDetail();
        }
    }

    getEmployeeDetail(reset = true): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.fixToRegularForm.get('employeeNo').value.toString().length !== 10) {
                reject('reject');
            }
            const passData = {
                pageIndex: 0,
                pageElement: 10,
                jsonArr: [
                    {
                        key: 'empNo',
                        value: Number(this.fixToRegularForm.get('employeeNo').value)
                    },
                    {
                        key: 'effectiveDate',
                        value: this.convertDateFormatEmp(this.fixToRegularForm.get('eventEffectiveDate').value)
                    },
                    {
                        key: 'eventId',
                        value: 2
                    },
                    {
                        key: 'payCommission',
                        value: 0
                    },
                    {
                        key: 'isSubmitted',
                        value: this.isSubmitted
                    },
                    {
                        key: 'action',
                        value: this.action
                    }
                ]
            };

            if (reset) {
                if (this.fixToRegularForm.get('form5pc')) {
                    this.fixToRegularForm.get('form5pc').patchValue({
                        payScaleId: '',
                        basicPay: ''
                    });
                }

                if (this.fixToRegularForm.get('form6pc')) {
                    this.fixToRegularForm.get('form6pc').patchValue({
                        payBandId: '',
                        gradePayId: '',
                        payBandValue: '',
                        basicPay: ''
                    });
                }

                if (this.fixToRegularForm.get('form7pc')) {
                    this.fixToRegularForm.get('form7pc').patchValue({
                        payLevelId: 0,
                        cellId: '',
                        cellPID: '',
                        basicPay: ''
                    });
                }
            }

            this.fixToRegularService.getEmpByNo(passData).subscribe(res => {
                if (res && res['result'] && res['status'] === 200) {
                    if (res['result']['employee']) {
                        this.fixPay = res['result']['fixPay'] ? res['result']['fixPay'] : 0;
                        res['result']['employee'].empBasicPay = this.fixPay;
                        this.employeeDetail = res['result']['employee'];
                        this.cd.detectChanges();
                        this.fixToRegularForm.patchValue({
                            employeeNo: this.employeeDetail.employeeNo,
                            empName: this.employeeDetail.employeeName,
                            class: this.employeeDetail.employeeClass,
                            designation: this.employeeDetail.designationName,
                            ofcName: this.employeeDetail.officeName,
                            empBasicPay: this.fixPay,
                            dateJoining: this.fixToRegularService.changeDateFormat(this.employeeDetail.dateJoining),
                            departmentCategoryName: this.employeeDetail.departmentCategoryName,
                            empId: this.employeeDetail.employeeId
                        });
                        resolve('done');
                    }
                } else {
                    this.fixToRegularForm.patchValue({
                        empName: null,
                        class: null,
                        designation: null,
                        ofcName: null,
                        empBasicPay: null,
                        dateJoining: null,
                        departmentCategoryName: null,
                        empId: null
                    });
                    this.toastr.error(res['message']);
                    reject(res['message']);
                }
            });
        });
    }

    /**
     * @method onTabChange
     * @description on tab change method gets called
     */
    onTabChange(event) {
        console.log(event);
    }

    convertDateFormatEmp(date) {
        if (date !== '' && date !== undefined && date !== null) {
            date = new Date(date);
            return this.datepipe.transform(date, 'yyyy/MM/dd');
        }
        return null;
    }

    /**
     * @method openSearchEmployeeDialog
     * @description Function is called if search icon is click, This help in searchng employee from other parameters
     */
    openDialogEmployeeNumber() {
        if (this.action === 'view') {
            return;
        }
        const dialogRef = this.dialog.open(SearchEmployeeComponent, {
            width: '800px',
            data: {
                hideCaseNo: true,
                hideGpfNo: true
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.fixToRegularForm.get('employeeNo').patchValue(result.employeeNo);
                this.getEmployeeDetail();
            }
        });
    }

    /**
     * @method saveDetails
     * @description Function is called when save as draft is clicked and it further emits so event details can be saved
     */
    saveDetails(skipValidation = false) {
        console.log(this.fixToRegularForm.controls);
        if (this.fixToRegularForm.valid) {
            const formData: any = this.fixToRegularForm.value;
            formData.action = 'DRAFT';
            const finalObj = this.convertFixToRegPayDto(formData);
            this.fixToRegularService.saveFixToPay(finalObj).subscribe(res => {
                if (res && res['status'] === 200 && res['result']) {
                    this.currentId = res['result']['fixRegDsId'];
                    this.action = 'edit';
                    this.fixToRegularForm.patchValue({
                        id: res['result']['fixRegDsId'],
                        fyId: res['result']['fyId']
                    });
                    if (!skipValidation) {
                        this.toastr.success(res['message']);
                    }
                }
            });
        } else {
            this.toastr.error('Please fill all the Valid details');
        }
    }
    convertFixToRegPayDto(formData: any): FixtoRegularDto {
        const commonData: any = {
            action: formData.action,
            empId: formData.empId,
            id: formData.id,
            fyId: formData.fyId,
            officeId: this.userOffice.officeId,
            officeName: formData.officeName,
            eventOrderNumber: formData.eventOrderNo,
            eventOrderDate: formData.eventOrderDate,
            eventEffectiveDate: formData.eventEffectiveDate,
            empPayType: this.employeeDetail.empType
        };

        let source;
        if (formData.form5pc) {
            source = {
                ...commonData,
                ...formData.form5pc
            };
        }
        if (formData.form6pc) {
            source = {
                ...commonData,
                ...formData.form6pc
            };
        }
        if (formData.form7pc) {
            commonData.basicPayComm6 = formData.form6pc.basicPay;
            commonData.nxtIncrDate6 = formData.form6pc.dateOfNxtInc;
            source = {
                ...commonData,
                ...formData.form6pc,
                ...formData.form7pc
            };
        }

        console.log(source);

        return new FixtoRegularDto(source);
    }

    /**
     * @method submitDetails
     * @description Function is called to submit event details
     */
    onSubmitDetails() {
        if (this.fixToRegularForm.valid && this.isFileUploaded) {
            if (!this.dialogOpen) {
                const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                    width: '360px',
                    data: pvuMessage.CLOSE
                });
                dialogRef.afterClosed().subscribe(result => {
                    if (result === 'yes') {
                        const formData: any = this.fixToRegularForm.value;
                        formData.action = 'SUBMITTED';
                        const finalObj = this.convertFixToRegPayDto(formData);
                        this.fixToRegularService.saveFixToPay(finalObj).subscribe(res => {
                            if (res && res['status'] === 200 && res['result']) {
                                this.toastr.success(res['message']);
                                this.openTransactionMessageDialog(res['result']);
                            } else if (res && res['status'] === 409) {
                                this.toastr.error(res['message']);
                            } else {
                                this.toastr.error(res['message']);
                            }
                        });
                    }
                });
            } else {
                this.dialog.closeAll();
            }
        } else if (!this.isFileUploaded) {
            this.saveDetails(true);
            this.toastr.error('Please upload at least one attachment.');
            this.selectedIndex = 1;
        } else {
            this.toastr.error('Please fill all the Valid details');
        }
    }

    openTransactionMessageDialog(refereceObj) {
        const dialogRef = this.dialog.open(OkDialogComponent, {
            width: '400px',
            data:
                'Fix pay to regular conversion <br/>' +
                'Refrence No:' +
                refereceObj['trnNo'] +
                '<br/>' +
                'Refrence Date:' +
                this.fixToRegularService.changeDateFormat(refereceObj['refDate']) +
                '<br/>' +
                'Employee No: ' +
                this.EmoloyeeNo
        });

        dialogRef.afterClosed().subscribe(result => {
            this.reloadComponent();
        });
    }

    /**
     * @method viewComments
     * @description Function is called to see all remarks till date
     */
    viewComments() { }

    /**
     * /@function  goToListing
     *  @description Navigate to the listing screen
     *  @param -
     *  @returns Navigate to the listing screen
     */
    goToListing() {
        this.router.navigate(['/dashboard/pvu/fix-to-regular/list'], { skipLocationChange: true });
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
                    // const url: string = this.routeService.getPreviousUrl();
                    const url = 'dashboard';
                    this.router.navigate([url], { skipLocationChange: true });
                }
            });
        } else {
            this.dialog.closeAll();
        }
    }

    submitAction() {
        this.onSubmitDetails();
    }

    getFixToRegularData(id, action) {
        const params = {
            id: id
        };
        this.resetPaybandVal = false;
        this.fixToRegularService.getFixToRegular(params).subscribe(
            res => {
                if (res && res['status'] === 200) {
                    this.fixToRegularForm.patchValue({
                        employeeNo: res['result'].employeeNo,
                        eventEffectiveDate: new Date(res['result'].convEffDate)
                    });
                    this.getEmployeeDetail().then(Empres => {
                        console.log('employee details ', this.employeeDetail);
                        this.setElements(res['result'].convEffDate);
                        this.cd.detectChanges();
                        const resultData: FixtoRegular = new FixtoRegular(res['result']);
                        if (resultData.sevenPc && resultData.sevenPc.benEffDate) {
                            resultData.sevenPc.dateOfNxtInc = this.sevenCommitionPayComponent.setNextIncrDate(
                                res['result'].convEffDate
                            );

                            resultData.sevenPc.benEffDate = this.fixToRegularService.changeDateFormat(
                                res['result'].convEffDate
                            );
                        }

                        if (resultData.sixthPc && resultData.sixthPc.benEffDate) {
                            resultData.sixthPc.dateOfNxtInc = this.sixCommitionPayComponent.setNextIncrementDate(
                                res['result'].convEffDate
                            );
                            resultData.sixthPc.benEffDate = this.fixToRegularService.changeDateFormat(
                                res['result'].convEffDate
                            );
                        }
                        if (resultData.fifthPc && resultData.fifthPc.benEffDate) {
                            resultData.fifthPc.dateOfNxtInc = this.fifthCommitionPayComponent.setNextIncrDate(
                                res['result'].convEffDate
                            );
                            resultData.fifthPc.benEffDate = this.fixToRegularService.changeDateFormat(
                                res['result'].convEffDate
                            );
                        }
                        this.fixToRegularForm.patchValue({
                            id: resultData.id,
                            eventOrderNo: resultData.eventOrderNumber,
                            eventOrderDate: new Date(resultData.eventOrderDate)
                        });
                        if (this.isFifthPC) {
                            this.fixToRegularForm.get('form5pc').patchValue(resultData.fifthPc);
                            if (action === 'view') {
                                this.fifthCommitionPayComponent.form5pc.disable();
                            }
                            this.fifthCommitionPayComponent.onPayScaleChange(resultData.fifthPc.payScaleId);
                        }

                        if (this.isSixthPC) {
                            this.fixToRegularForm.get('form6pc').patchValue(resultData.sixthPc);
                            if (action === 'view') {
                                this.sixCommitionPayComponent.form6pc.disable();
                            }
                            this.sixCommitionPayComponent.onPayBandChange(resultData.sixthPc.payBandId);
                        }

                        if (this.isSeventhPC) {
                            this.fixToRegularForm.get('form7pc').patchValue(resultData.sevenPc);
                            if (action === 'view') {
                                this.sevenCommitionPayComponent.form7pc.disable();
                            }
                            this.sevenCommitionPayComponent.onPayLevelChange(resultData.sevenPc.payLevelId);
                        }
                    });
                }
            },
            err => {
                this.toastr.error('Invalid request');
            }
        );
    }

    resetForm() {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '360px',
            data: pvuMessage.RESET
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                if (this.fixToRegularForm.get('id').value) {
                    this.getFixToRegularData(this.currentId, this.action);
                } else {
                    this.reloadComponent();
                }
            }
        });
    }

    reloadComponent() {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['dashboard/pvu/fix-to-regular/new'], { skipLocationChange: true });
    }
}
