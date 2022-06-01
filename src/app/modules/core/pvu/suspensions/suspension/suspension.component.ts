import { MENU_ID } from './../../../../../shared/constants/pvu/pvu-message.constants';
import { CommonService } from 'src/app/modules/services/common.service';
import { EventViewPopupService } from './../../services/event-view-popup.service';
import { SaveDraftDialogComponent } from './save-draft-dialog.component';
import { ForwardDialogComponent } from './../../pvu-common/forward-dialog/forward-dialog.component';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ElementRef, ViewChild, } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { StorageService } from 'src/app/shared/services/storage.service';
import * as _ from 'lodash';
import { DatePipe } from '@angular/common';
import { Data6thModel, Data5thModel, Data7thModel, DataFixPcModel } from 'src/app/models/pvu/suspension';
import { SuspensionService } from './../services/suspension.service';
import { pvuMessage, MessageConst } from 'src/app/shared/constants/pvu/pvu-message.constants';
import { SearchEmployeeComponent } from '../../pvu-common/search-employee/search-employee.component';
import { APIConst } from 'src/app/shared/constants/pvu/pvu-api.constants';
import { AttachmentPvuComponent } from '../../pvu-common/attachment-pvu/attachment-pvu.component';
import { ViewCommentsComponent } from '../../pvu-common/view-comments/view-comments.component';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
    selector: 'app-suspension',
    templateUrl: './suspension.component.html',
    styleUrls: ['./suspension.component.css']
})
export class SuspensionComponent implements OnInit {
    payBandId: any;
    cellNameId: any;
    gradePayId: any;
    paylevelId: any;
    payScale: any;
    dialogOpen: boolean = false;
    dialogLinkMenuId: number;
    menuId: number;
    constructor(
        private fb: FormBuilder,
        private toastr: ToastrService,
        private el: ElementRef,
        public dialog: MatDialog,
        public router: Router,
        private datepipe: DatePipe,
        private storageService: StorageService,
        private activatedRoute: ActivatedRoute,
        private suspensionService: SuspensionService,
        private eventViewPopupService: EventViewPopupService,
        private commonService: CommonService
    ) { }

    public errorMessages;
    suspensionForm: FormGroup;
    date = new Date();
    endDate;
    closureDate;
    show6thPC = false;
    show7thPC = true;
    show5thPC = false;
    showFixPc = false;
    isView = false;
    empIcon = true;
    isClosure = false;
    isReinstate = false;
    isReinstateYes = false;
    isClsDate = false;
    closureGuilty = false;
    closureNotGuilty = false;
    isFinalEnd = false;
    currentPost;
    subscribeParams: Subscription;
    action;
    empId: number;
    suspensionId: number;
    officeId: number;
    employeeName: string;
    class: string;
    designation: string;
    employeeOfficeName: string;
    payBand: string;
    payBandValue: string;
    gradePay: string;
    payLevel: string;
    cellId: string;
    scale: string;
    basicPay: string;
    dateOfJoining: string;
    dateOfNextIncrement: string;
    dateOfRetirement;
    doj;
    disableLength: number;
    statusId = 0;
    trnNo;
    initiationDate;
    isSaveDraftVisible = true;
    isTabDisabled = true;
    selectedIndex: number;
    prevIndex = 0;
    payableMinDate: Date;
    transactionId;
    payCommissionList;
    suspensionReasonList;
    reinstateList;
    closureList;
    statusList;
    eventMinDate: Date;
    showDeleteBtnPayDetail = false;
    showAddButtonPayDetail = false;
    addButtonValidate = false;
    showSubmitButton = true;
    commonSubscription: Subscription[] = [];
    formValueChange = false;
    isSixMonths = true;

    @ViewChild('attachmentTab', { static: true }) attachmentTab: AttachmentPvuComponent;
    attachmentData = {
        moduleName: APIConst.SUSPENSION.SUS_PREFIX,
    };
    reasonForSuspensionCtrl: FormControl = new FormControl();
    payCommissionCtrl: FormControl = new FormControl();
    closureCtrl: FormControl = new FormControl();
    attachmentTypeCtrl: FormControl = new FormControl();

    dataSource = new MatTableDataSource;

    data5th: Data5thModel[] = [
        {
            payableFromDate: this.date, payableToDate: null , currentScale: '', currentBasicPay: '',
            payableBasicPayPerc: '50', statusId: 205, payableBasicPayAmt: '', isHighlight: false,
            id: 0
        }
    ];

    dataSource5thPC = new MatTableDataSource<Data5thModel>(this.data5th);
    displayed5thPCColumns = ['srNo', 'payableFromDate', 'payableToDate',  'currentScale', 'currentBasicPay',
        'payableBasicPayPerc', 'payableBasicPayAmt', 'Action'];

    data6th: Data6thModel[] = [
        {
            // tslint:disable-next-line:max-line-length
            payableFromDate: this.date, payableToDate: null , currentPayBand: '',
            currentPayBandValue: '', currentGradePay: '',
            payableGradePayPerc: '50',
            // tslint:disable-next-line: max-line-length
            payableGradePayAmt: '', statusId: 205, payablePayBandAmt: '', payablePayBandPerc: '50',
            isHighlight: false, id: 0
        }
    ];

    dataSource6thPC = new MatTableDataSource<Data6thModel>(this.data6th);
    displayed6thPCColumns = ['srNo', 'payableFromDate', 'payableToDate',  'currentPayBand', 'currentPayBandValue',
        'currentGradePay', 'payableGradePayPerc', 'payableGradePayAmt', 'payablePayBandPerc',
        'payablePayBandAmt', 'Action'];


    data7th: Data7thModel[] = [
        {
            // tslint:disable-next-line: max-line-length
            payableFromDate: this.date, payableToDate: null , currentPayLevel: '',
            currentCellId: '', currentBasicPay: '', payableBasicPayPerc: '50',
            payableBasicPayAmt: '', statusId: 205, isHighlight: false, id: 0
        }
    ];

    dataSource7thPC = new MatTableDataSource<Data7thModel>(this.data7th);
    displayed7thPCColumns = ['srNo', 'payableFromDate', 'payableToDate', 'currentPayLevel', 'currentCellId',
        'currentBasicPay', 'payableBasicPayPerc', 'payableBasicPayAmt', 'Action'];

    dataFix: DataFixPcModel[] = [
        {
            payableFromDate: this.date, payableToDate: null , currentBasicPay: '',
            payableBasicPayPerc: '50', statusId: 205, payableBasicPayAmt: '', isHighlight: false,
            id: 0
        }
    ];

    dataSourceFixPC = new MatTableDataSource<DataFixPcModel>(this.dataFix);
    displayedFixPcColumns = ['srNo', 'payableFromDate', 'payableToDate',  'currentBasicPay',
        'payableBasicPayPerc', 'payableBasicPayAmt', 'Action'];

    displayedBrowseColumns = ['attachmentType', 'fileName', 'browse', 'uploadedFileName', 'uploadedBy', 'action'];

    ngOnInit() {
        this.getLookUpInfo();
        const userOffice = this.storageService.get('currentUser');
        this.menuId = this.commonService.getLinkMenuId();
        if (userOffice && userOffice['post'][0]['loginPost'] !== undefined) {
            this.currentPost = userOffice['post'].filter((item) => item['loginPost'] === true);
        }
        this.errorMessages = pvuMessage;
        this.createForm();
        this.dataSource = _.cloneDeep(this.dataSource7thPC);

        this.subscribeParams = this.activatedRoute.params.subscribe(resRoute => {
            this.action = resRoute.action;
            if (this.action === 'edit' || this.action === 'view') {
                this.suspensionId = +resRoute.id;
                this.isTabDisabled = false;
                this.transactionId = true;
                this.isClosure = resRoute.closure;
                const params = { 'id': this.suspensionId };
                this.getSuspensionDetail(params);
                if (this.suspensionId) {
                    if (this.action === 'view') {
                        this.suspensionForm.disable();
                        this.isView = true;
                        this.isSaveDraftVisible = false;
                        this.showSubmitButton = false;
                    }
                } else {
                    this.router.navigate(['../new'], { relativeTo: this.activatedRoute });
                }
            }
        });
        const eventID = +this.eventViewPopupService.eventID;
        // const eventCode = this.eventViewPopupService.eventCode;
        const dialogLinkMenuId = +this.eventViewPopupService.linkMenuID;
        this.eventViewPopupService.eventID = 0;
        this.eventViewPopupService.eventCode = '';
        this.eventViewPopupService.linkMenuID = 0;
        if (eventID !== 0) {
            this.menuId = MENU_ID.SUSPENSION_CREATE;
            this.dialogOpen = true;
            this.dialogLinkMenuId = dialogLinkMenuId;
            this.action = 'view';
            this.suspensionId = eventID;
            this.isTabDisabled = false;
            this.transactionId = true;
            const params = { 'id': this.suspensionId };
            this.getSuspensionDetail(params);
            if (this.suspensionId) {
                this.suspensionForm.disable();
                this.isView = true;
                this.isSaveDraftVisible = false;
                this.showSubmitButton = false;
            }
        }
    }

    /**
     * @description Method to fetch lookupdata through service and set dropdown
     */
    getLookUpInfo() {
        this.suspensionService.getLookUpInfoData().subscribe((res) => {
            if (res && res['status'] === 200) {
                this.payCommissionList = res['result']['Dept_Pay_Commission'];
                this.suspensionReasonList = res['result']['ReasonForSuspension'];
                this.closureList = res['result']['Closure'];
                this.reinstateList = _.sortBy(res['result']['ConditionCheck'], 'lookupInfoName').reverse();
                this.statusList = res['result']['Status_id'];
                if (this.action !== 'edit' && this.action !== 'view') {
                    this.suspensionForm.controls['payCommission'].patchValue(152);
                    this.onPayCommissionChange(152);
                }
            }
        });
    }

    /**
     * @description Method to create Suspension formGroup instance and add collection of child controls
     */
    createForm() {
        this.suspensionForm = this.fb.group({
            officeName: [this.currentPost[0]['oauthTokenPostDTO']['edpMsOfficeDto']['officeName']],
            payCommission: [0, Validators.required],
            susOrderNo: ['', Validators.required],
            susOrderDate: ['', Validators.required],
            susEventDate: ['', Validators.required],
            employeeNumber: ['', [Validators.required]],
            reasonForSus: ['', Validators.required],
            susStartDate: ['', Validators.required],
            description: ['', Validators.required],
            reinstateFlagId: [0],
            susEndDate: [''],
            susClsDate: [''],
            closureId: [''],
            noOfDayInSus: [''],
            punishmentType: [''],
            closureRemarks: [''],
        });
        if (this.isClosure) {
            this.suspensionForm.controls.susEndDate.setValidators([Validators.required]);
            this.suspensionForm.controls.closureId.setValidators([Validators.required]);
            this.suspensionForm.controls.susEndDate.updateValueAndValidity();
            this.suspensionForm.controls.closureId.updateValueAndValidity();
            this.suspensionForm.controls.reinstateFlagId.patchValue(2);
        }
    }

    /**
     * @description Method invoked on Enter key or Tab key press event for employee no form control
     * @param event KeyBoardEvent
     */
    onEmployeeKeyUp(event: KeyboardEvent) {
        const self = this;
        // tslint:disable-next-line:max-line-length
        if (event) {
            if ((event['keyCode'] === 13 || event['keyCode'] === 9) &&
                this.suspensionForm.get('employeeNumber').value.length === 10) {
                event.preventDefault();
                event.stopPropagation();
                self.getEmployeeDetail();
            }
        } else {
            const employeeNo = self.suspensionForm.get('employeeNumber').value;
            if (employeeNo && employeeNo.length === 10) {
                self.getEmployeeDetail();
            }
        }
    }


    /**
     * @description Method to open SearchEmployeeComponent Dialog
     */
    openDialogEmpNo() {
        const dialogRef = this.dialog.open(SearchEmployeeComponent, {
            width: '800px',
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.suspensionForm.get('employeeNumber').patchValue(result.employeeNo);
                this.getEmployeeDetail();
            }
        });
    }

    /**
     * @description Method to fetch Employee Details through service
     */
    getEmployeeDetail() {
        if (this.suspensionForm.controls.susOrderDate.invalid || this.suspensionForm.controls.susEventDate.invalid) {
            if (this.suspensionForm.controls.susEventDate.invalid) {
                this.suspensionForm.controls.susEventDate.markAsTouched();
            }
            if (this.suspensionForm.controls.susOrderDate.invalid) {
                this.suspensionForm.controls.susOrderDate.markAsTouched();
            }
            return;
        }
        const passData = {
            'pageIndex': 0,
            'pageElement': 10,
            'jsonArr': [
                {
                    'key': 'empNo',
                    'value': Number(this.suspensionForm.get('employeeNumber').value)
                },
                {
                    'key': 'effectiveDate',
                    'value': this.convertDateFormatEmp(this.suspensionForm.controls.susEventDate.value),
                },
                {
                    'key': 'payCommission',
                    'value': Number(this.suspensionForm.get('payCommission').value)
                },
                {
                    'key': 'eventId',
                    'value': '0'
                },
                {
                    'key': 'menuId',
                    'value': this.menuId
                },
                {
                    'key' : 'isViewPage',
                    'value' : this.action === 'view'
                }
            ]
        };
        this.suspensionService.getEmpByNo(passData).
            subscribe((res) => {
                if (res && res['status'] === 200) {
                    if (res['result']) {
                        let detail: any = {};
                        if (res['result']['employee']) {
                            detail = _.cloneDeep(res['result']['employee']);
                        }
                        this.empId = detail.employeeId;
                        this.employeeName = detail.employeeName;
                        this.class = detail.employeeClass;
                        this.designation = detail.designationName;
                        this.employeeOfficeName = detail.officeName;
                        this.payLevel = detail.payLevelName;
                        this.cellId = detail.cellName;
                        this.payBand = detail.payBandName;
                        this.payBandValue = detail.payBandValue;
                        this.gradePay = detail.gradePayName;
                        this.scale = detail.payScaleName;
                        this.basicPay = detail.empBasicPay;
                        this.payScale = detail.payScale;
                        this.cellNameId = detail.cellId;
                        this.payBandId = detail.payBandId;
                        this.paylevelId = detail.payLevelId;
                        this.gradePayId = detail.gradePayId;
                        this.dateOfJoining = this.displayDateFormat(detail.dateJoining);
                        this.dateOfRetirement = this.displayDateFormat(detail.retirementDate);
                        this.dateOfNextIncrement = this.displayDateFormat(detail.dateNxtIncr);
                        this.doj = this.convertDateFormat(detail.dateJoining);
                        if (this.doj) {
                            this.onPayCommissionChange(this.suspensionForm.get('payCommission').value);
                        }
                        if (this.dateOfRetirement) {
                            let dor;
                            dor = this.dateOfRetirement.split('/');
                            dor = new Date(dor[2], Number(dor[1]) - 1, dor[0]);
                            if (dor < this.date) {
                                this.date = dor;
                                if (this.suspensionForm.get('susEventDate') &&
                                (this.suspensionForm.get('susEventDate').value
                                > dor)) {
                                    this.toastr.error('Employee Retirement Date is ' +
                                    this.dateOfRetirement);
                                  }
                            }
                        }
                        if (this.show5thPC) {
                            this.dataSource5thPC.data.forEach((elements) => {
                                if (this.action !== 'edit' && this.action !== 'view') {
                                    elements.payableFromDate = this.suspensionForm.controls.susStartDate.value;
                                }
                                this.payableMinDate = this.suspensionForm.controls.susStartDate.value;
                                this.endDate = elements.payableFromDate;
                                elements.currentScale = this.scale;
                                elements.currentBasicPay = this.basicPay;
                            });
                            this.dataSource5thPC = new MatTableDataSource(this.dataSource5thPC.data);
                        }

                        if (this.show6thPC) {
                            this.dataSource6thPC.data.forEach((elements) => {
                                if (this.action !== 'edit' && this.action !== 'view') {
                                    elements.payableFromDate = this.suspensionForm.controls.susStartDate.value;
                                }
                                this.endDate = elements.payableFromDate;
                                this.payableMinDate = this.suspensionForm.controls.susStartDate.value;
                                elements.currentPayBand = this.payBand;
                                elements.currentPayBandValue = this.payBandValue;
                                elements.currentGradePay = this.gradePay;
                            });
                            this.dataSource6thPC = new MatTableDataSource(this.dataSource6thPC.data);
                        }

                        if (this.show7thPC) {
                            this.dataSource7thPC.data.forEach((elements) => {
                                if (this.action !== 'edit' && this.action !== 'view') {
                                    elements.payableFromDate = this.suspensionForm.controls.susStartDate.value;
                                }
                                this.endDate = elements.payableFromDate;
                                this.payableMinDate = this.suspensionForm.controls.susStartDate.value;
                                elements.currentPayLevel = this.payLevel;
                                elements.currentCellId = this.cellId;
                                elements.currentBasicPay = this.basicPay;
                            });
                            this.dataSource7thPC = new MatTableDataSource(this.dataSource7thPC.data);
                        }
                        if (this.showFixPc) {
                            this.dataSourceFixPC.data.forEach((elements) => {
                                if (this.action !== 'edit' && this.action !== 'view') {
                                    elements.payableFromDate = this.suspensionForm.controls.susStartDate.value;
                                }
                                this.endDate = elements.payableFromDate;
                                this.payableMinDate = this.suspensionForm.controls.susStartDate.value;
                                elements.currentBasicPay = this.basicPay;
                            });
                            this.dataSourceFixPC = new MatTableDataSource(this.dataSourceFixPC.data);
                            this.dateOfNextIncrement = 'N/A';
                        }
                    }
                } else {
                    this.toastr.error(res['message']);
                    this.empId = 0;
                    this.employeeName = '';
                    this.class = '';
                    this.designation = '';
                    this.employeeOfficeName = '';
                    this.payLevel = '';
                    this.cellId = '';
                    this.payBand = '';
                    this.payBandValue = '';
                    this.gradePay = '';
                    this.scale = '';
                    this.basicPay = '';
                    this.dateOfJoining = '';
                    this.dateOfRetirement = '';
                    this.dateOfNextIncrement = '';
                    this.doj = '';
                    this.payScale = '';
                    this.cellNameId = '';
                    this.payBandId = '';
                    this.paylevelId = '';
                    this.gradePayId = '';
                }
            });
    }

    /**
     * @description Method to fetch Suspension Details based on params
     * @param params id of the Suspension Event
     */
    getSuspensionDetail(params) {
        const self = this;
        let detail;
        this.suspensionService.getSuspensionDetails(params).subscribe((res) => {
            if (res && res['result'] && res['status'] === 200) {
                detail = res['result'];
                if (detail !== null) {
                    this.suspensionId = detail.id;
                    this.setSuspensionDetail(detail);
                }
            } else {
                self.toastr.error(res['message']);
            }
        }, (err) => {
            self.toastr.error(err);
        });
    }

    /**
     * @description Method to set suspensionForm details
     * @param detail Suspension data obtained through service
     */
    setSuspensionDetail(detail) {
        let approvePayDetail = 0;
        if ((detail.statusId === 327 && detail.suspensionClosure === false) || detail.suspensionClosure === true) {
            this.isClosure = true;
            this.empIcon = false;
            this.endDate = this.convertDateFormat(detail.susStartDate);
            this.closureDate = this.suspensionForm.controls.susEndDate.value;
        }

        this.suspensionForm.patchValue({
            'payCommission': detail.payCommission,
            'susOrderNo': detail.susOrderNo,
            'susOrderDate': this.convertDateFormat(detail.susOrderDate),
            'susEventDate': this.convertDateFormat(detail.susEventDate),
            'employeeNumber': detail.employeeNumber,
            'reasonForSus': detail.reasonForSus,
            'susStartDate': this.convertDateFormat(detail.susStartDate),
            'description': detail.description,
            'reinstateFlagId': detail.reinstateFlagId,
            'susEndDate': detail.susEndDate,
            'susClsDate': detail.susClsDate,
            'closureId': (detail.closureId !== 0 && detail.closureId !== null &&
                detail.closureId !== undefined && detail.closureId !== '') ? detail.closureId : '',
            'noOfDayInSus': detail.noOfDayInSus,
            'punishmentType': detail.punishmentType,
            'closureRemarks': detail.closureRemarks,
        });
        if (this.isClosure) {
            this.empIcon = false;
            this.endDate = this.convertDateFormat(detail.susStartDate);
            this.closureDate = this.suspensionForm.controls.susEndDate.value;
            this.disableLength = detail.payDetailsDtos.length;
            this.onReinstate(this.suspensionForm.controls.reinstateFlagId.value);
            if (this.suspensionForm.controls.reinstateFlagId.value === 2) {
                this.isReinstateYes = true;
            }
            if (detail.reinstateFlagId === 0) {
                this.suspensionForm.get('reinstateFlagId').patchValue(2);
            }
        }
        this.empId = detail.empId;
        this.statusId = detail.statusId;
        this.isFinalEnd = detail.finalEnd;
        if (this.statusId !== 205) {
            this.isSaveDraftVisible = false;
        }
        this.trnNo = detail.trnNo;
        this.initiationDate = detail.createdDate;
        this.getEmployeeDetail();
        detail.payDetailsDtos = _.orderBy(_.cloneDeep(detail.payDetailsDtos), 'id', 'asc');
        this.dataSource5thPC = new MatTableDataSource(detail.payDetailsDtos);
        this.dataSource6thPC = new MatTableDataSource(detail.payDetailsDtos);
        this.dataSource7thPC = new MatTableDataSource(detail.payDetailsDtos);
        this.dataSourceFixPC = new MatTableDataSource(detail.payDetailsDtos);
        if (detail.payDetailsDtos.length > 0) {
            this.onPayDetailChange(detail.payDetailsDtos[detail.payDetailsDtos.length - 1].payableFromDate);
        }
        detail.payDetailsDtos.forEach((payDetail) => {
            if (payDetail.statusId) {
                if (payDetail.statusId === 327) {
                    approvePayDetail++;
                }
                if (payDetail.statusId === 205) {
                    this.showDeleteBtnPayDetail = true;
                }
            }
        });

        if (approvePayDetail === detail.payDetailsDtos.length) {
            this.showAddButtonPayDetail = true;
        }
        this.onPayCommissionSelect(detail.payCommission);
        if (this.isClosure && detail.closureId !== 0) {
            if (detail.closureId === 272) {
                this.closureGuilty = true;
            } else if (detail.closureId === 273) {
                this.closureNotGuilty = true;
            }
        }
        this.formValueChange = false;
    }

    /**
     * @description Method that sets data and template based on Pay Commission selected
     * @param pay Pay Commission value selected
     */
    onPayCommissionSelect(pay) {
        if (pay === 152) {
            this.show5thPC = false;
            this.show6thPC = false;
            this.show7thPC = true;
            this.showFixPc = false;
            this.dataSource7thPC.data.forEach((elements) => {
                if (this.action !== 'edit' && this.action !== 'view') {
                    elements.payableFromDate = this.suspensionForm.controls.susStartDate.value;
                }
                elements.currentPayLevel = this.payLevel;
                elements.currentCellId = this.cellId;
                elements.currentBasicPay = this.basicPay;
            });
            this.dataSource7thPC = new MatTableDataSource(this.dataSource7thPC.data);
            this.dataSource = _.cloneDeep(this.dataSource7thPC);
        }
        if (pay === 151) {
            this.show5thPC = false;
            this.show6thPC = true;
            this.show7thPC = false;
            this.showFixPc = false;
            this.dataSource6thPC.data.forEach((elements) => {
                if (this.action !== 'edit' && this.action !== 'view') {
                    elements.payableFromDate = this.suspensionForm.controls.susStartDate.value;
                }
                elements.currentPayBand = this.payBand;
                elements.currentPayBandValue = this.payBandValue;
                elements.currentGradePay = this.gradePay;
            });
            this.dataSource6thPC = new MatTableDataSource(this.dataSource6thPC.data);
            this.dataSource = _.cloneDeep(this.dataSource6thPC);
        }
        if (pay === 150) {
            this.show5thPC = true;
            this.show6thPC = false;
            this.show7thPC = false;
            this.showFixPc = false;
            this.dataSource5thPC.data.forEach((elements) => {
                if (this.action !== 'edit' && this.action !== 'view') {
                    elements.payableFromDate = this.suspensionForm.controls.susStartDate.value;
                }
                elements.currentScale = this.scale;
                elements.currentBasicPay = this.basicPay;
            });
            this.dataSource5thPC = new MatTableDataSource(this.dataSource5thPC.data);
            this.dataSource = _.cloneDeep(this.dataSource5thPC);
        }
        if (pay === 341) {
            this.show5thPC = false;
            this.show6thPC = false;
            this.show7thPC = false;
            this.showFixPc = true;
            this.dataSourceFixPC.data.forEach((elements) => {
                if (this.action !== 'edit' && this.action !== 'view') {
                    elements.payableFromDate = this.suspensionForm.controls.susStartDate.value;
                }
                elements.currentBasicPay = this.basicPay;
            });
            this.dataSourceFixPC = new MatTableDataSource(this.dataSourceFixPC.data);
            this.dataSource = _.cloneDeep(this.dataSourceFixPC);
        }
        const self = this;
        setTimeout(function () {
            // tslint:disable-next-line: max-line-length
            if (self.suspensionForm.get('employeeNumber').value.length === 10 && !self.suspensionForm.get('susEventDate').errors) {
                self.getEmployeeDetail();
            }
        }, 0);
        this.onPayCommissionChange(pay);
    }

    /**
     * @description Method that limits date based on Pay Commission selected
     * @param pay Pay Commission value selected
     */
    onPayCommissionChange(pay) {
        switch (pay) {
            case 152:
                this.eventMinDate = new Date(2016, 0, 1);
                break;
            case 151:
                this.eventMinDate = new Date(2006, 0, 1);
                break;
            case 150:
                this.eventMinDate = new Date(1996, 0, 1);
                break;
            case 341:
                this.eventMinDate = new Date(new Date().getFullYear() - 100, 0, 1);
                break;
        }
        if (this.doj) {
            let doj;
            doj = this.doj.split('-');
            doj = new Date(doj[0], Number(doj[1]) - 1, doj[2]);
            if (doj > this.eventMinDate) {
                this.eventMinDate = doj;
            }
        }
    }

    /**
     * @description Method invoked on Event date select
     * @param event event
     */
    onEventDateSelect(event) {
        this.suspensionForm.controls.susStartDate.patchValue(new Date(event.value.getFullYear(),
            event.value.getMonth(), event.value.getDate()));
        this.onStartDateSelect(event);
        // tslint:disable-next-line: max-line-length
        if (this.suspensionForm.get('employeeNumber').value.length === 10 && !this.suspensionForm.get('susEventDate').errors) {
            this.getEmployeeDetail();
        }
    }

    /**
     * @description Method invoked on start date select
     * @param event event value consist selected date
     */
    onStartDateSelect(event) {
        this.endDate = event.value;
        this.payableMinDate = new Date(event.value.getFullYear(),
            event.value.getMonth(), event.value.getDate());
        this.dataSource7thPC.data.forEach((element) => {
            element.payableFromDate = new Date(event.value.getFullYear(),
                event.value.getMonth(), event.value.getDate());
        });
        this.dataSource6thPC.data.forEach((element) => {
            element.payableFromDate = new Date(event.value.getFullYear(),
                event.value.getMonth(), event.value.getDate());
        });
        this.dataSource5thPC.data.forEach((element) => {
            element.payableFromDate = new Date(event.value.getFullYear(),
                event.value.getMonth(), event.value.getDate());
        });
        this.dataSourceFixPC.data.forEach((element) => {
            element.payableFromDate = new Date(event.value.getFullYear(),
                event.value.getMonth(), event.value.getDate());
        });
        this.onPayDetailChange(new Date(event.value.getFullYear(),
        event.value.getMonth(), event.value.getDate()));
        this.susDays();
    }

    /**
     * @description Method invoked on end date select
     * @param event event value consist selected date
     */
    onEndDateSelect(event) {
        this.closureDate = event.value;
        this.susDays();
        if (this.show5thPC) {
            if (this.dataSource5thPC.data.length > 0) {
                this.dataSource5thPC.data[this.dataSource5thPC.data.length - 1]['payableToDate'] = event.value;
            }
        }
        if (this.show6thPC) {
            if (this.dataSource6thPC.data.length > 0) {
                this.dataSource6thPC.data[this.dataSource6thPC.data.length - 1]['payableToDate'] = event.value;
            }
        }
        if (this.show7thPC) {
            if (this.dataSource7thPC.data.length > 0) {
                this.dataSource7thPC.data[this.dataSource7thPC.data.length - 1]['payableToDate'] = event.value;
            }
        }
        if (this.showFixPc) {
            if (this.dataSourceFixPC.data.length > 0) {
                this.dataSourceFixPC.data[this.dataSourceFixPC.data.length - 1]['payableToDate'] = event.value;
            }
        }
    }


    /**
     * @description Method to calculate No. of Suspension Days based on start date and end date
     */
    susDays() {
        if (this.suspensionForm.controls.susStartDate.value &&
            this.suspensionForm.controls.susEndDate.value !== '') {
            // tslint:disable-next-line: max-line-length
            if (this.suspensionForm.controls.susStartDate.value <= this.convertDateFormat(this.suspensionForm.controls.susEndDate.value)) {
                const startDate = new Date(this.suspensionForm.controls.susStartDate.value).getTime(),
                    diffTime: number = this.suspensionForm.controls.susEndDate.value.getTime() - startDate;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                if (!isNaN(diffDays)) {
                    this.suspensionForm.controls.noOfDayInSus.patchValue(diffDays);
                }
            }
        }
    }

    /**
     * @description Method to format date for displaying
     * @param date date to be formatted
     * @returns date string
     */
    displayDateFormat(date) {
        if (date !== '' && date !== undefined && date !== null) {
            date = new Date(date);
            return this.datepipe.transform(date, 'dd/MM/yyyy');
        }
        return '';
    }

    /**
     * @description Method to format date
     * @param date date to be formatted
     * @returns date string | null
     */
    convertDateFormat(date) {
        if (date !== '' && date !== undefined && date !== null) {
            date = new Date(date);
            return this.datepipe.transform(date, 'yyyy-MM-dd');
        }
        return '';
    }

    /**
     * @description Method to format date
     * @param date date to be formatted
     * @returns date string
     */
    convertDateFormatEmp(date) {
        if (date !== '' && date !== undefined && date !== null) {
            date = new Date(date);
            return this.datepipe.transform(date, 'yyyy/MM/dd');
        }
        return '';
    }

    /**
     * @description Method to add a 5th Pay Commission row in dataSource5thPC
     * @param index index of last row of dataSource5thPC
     */
    add5thPC(index) {
        if (this.dataSource5thPC) {
            this.isSixMonths = true;
            const data5th = _.cloneDeep(this.dataSource5thPC.data);
            if (data5th.length > 1) {
                data5th[data5th.length - 1]['payableToDate'] = this.date;
            }
            data5th.push({
                payableFromDate: this.date,
                payableToDate: null,
                currentScale: this.scale,
                currentBasicPay: Number(this.basicPay),
                payableBasicPayPerc: '50',
                payableBasicPayAmt: '',
                statusId: 205,
                id: 0
            });
            this.dataSource5thPC = new MatTableDataSource(data5th);
            const element = this.dataSource7thPC.data[index];
            this.payableMinDate = element.payableFromDate;
            this.onPayDetailChange(this.date);
            this.dataSource = _.cloneDeep(this.dataSource5thPC);

            let draftPayDetail = 0;
            this.dataSource5thPC.data.forEach((payDetail5thPC) => {
                if (payDetail5thPC.statusId) {
                    if (payDetail5thPC.statusId === 205 || payDetail5thPC.statusId === 267) {
                        draftPayDetail++;
                    }
                }
            });
            if (draftPayDetail !== this.dataSource5thPC.data.length) {
                this.showAddButtonPayDetail = false;
                this.showDeleteBtnPayDetail = true;
                this.addButtonValidate = false;
            }
        }
    }

    /**
     * @description delete a row from datasource5thPC
     * @param ID suspension id of row
     * @param index index of the selected row
     * @param trigger to know from where this function is called
     */
    delete5thPC(ID, index, trigger) {
        if (ID) {
            const param = {
                id: ID,
            };
            if (trigger === 1) {
                const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                    width: '360px',
                    data: pvuMessage.DELETE
                });
                dialogRef.afterClosed().subscribe(result => {
                    if (result === 'yes') {
                       this.delete5TableRow(param, index);
                    }
                });
            } else {
                this.delete5TableRow(param, index);
            }
        } else {
            this.dataSource5thPC.data.splice(index, 1);
            this.dataSource5thPC.data[this.dataSource5thPC.data.length - 1]['payableToDate'] = null;
            this.dataSource5thPC = new MatTableDataSource(this.dataSource5thPC.data);
            this.endDate = this.dataSource5thPC.data[this.dataSource5thPC.data.length - 1]['payableFromDate'];
            this.showDeleteBtnPayDetail = false;
            this.showAddButtonPayDetail = true;
        }
    }

    /**
     * @method delete5TableRow
     * @description Method delete required data with id
     * @param param parameter for api
     */
    delete5TableRow(param, index) {
        this.suspensionService.deletePayDetail(param).subscribe((res) => {
            if (res && res['status'] === 200) {
                if (res['message']) {
                    this.toastr.success(res['message']);
                }
                this.dataSource5thPC.data.splice(index, 1);
                this.dataSource5thPC.data[this.dataSource5thPC.data.length - 1]['payableToDate'] = null;
                this.dataSource5thPC = new MatTableDataSource(this.dataSource5thPC.data);
                this.endDate = this.dataSource5thPC.data[this.dataSource5thPC.data.length - 1]['payableFromDate'];
                this.showDeleteBtnPayDetail = false;
                this.showAddButtonPayDetail = true;
            }
        }, (err) => {
            this.toastr.error(err);
        });
    }

    /**
     * @description Method to add a 6th Pay Commission row in dataSource6thPC
     * @param index index of last row of dataSource6thPC
     */
    add6thPC(index) {
        if (this.dataSource6thPC) {
            this.isSixMonths = true;
            const dataSix = _.cloneDeep(this.dataSource6thPC.data);
            if (dataSix.length > 1) {
                dataSix[dataSix.length - 1]['payableToDate'] = this.date;
            }
            dataSix.push({
                payableFromDate: this.date,
                payableToDate: null,
                currentPayBand: this.payBand,
                currentPayBandValue: Number(this.payBandValue),
                currentGradePay: Number(this.gradePay),
                payableGradePayPerc: '50',
                payableGradePayAmt: '',
                payablePayBandPerc: '50',
                payablePayBandAmt: '',
                statusId: 205,
                id: 0
            });
            this.dataSource6thPC = new MatTableDataSource(dataSix);
            const element = this.dataSource7thPC.data[index];
            this.payableMinDate = element.payableFromDate;
            this.onPayDetailChange(this.date);
            this.dataSource = _.cloneDeep(this.dataSource6thPC);

            let draftPayDetail = 0;
            this.dataSource6thPC.data.forEach((payDetail6thPC) => {
                if (payDetail6thPC.statusId) {
                    if (payDetail6thPC.statusId === 205 || payDetail6thPC.statusId === 267) {
                        draftPayDetail++;
                    }
                }
            });
            if (draftPayDetail !== this.dataSource6thPC.data.length) {
                this.showAddButtonPayDetail = false;
                this.showDeleteBtnPayDetail = true;
                this.addButtonValidate = false;
            }
        }
    }

    /**
     * @description delete a row from datasource6thPC
     * @param ID suspension id of row
     * @param index index of the selected row
     * @param trigger to know from where this function is called
     */
    delete6thPC(ID, index, trigger) {
        if (ID) {
            const param = {
                id: ID,
            };
            if (trigger === 1) {
                const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                    width: '360px',
                    data: pvuMessage.DELETE
                });
                dialogRef.afterClosed().subscribe(result => {
                    if (result === 'yes') {
                       this.delete6TableRow(param, index);
                    }
                });
            } else {
                this.delete6TableRow(param, index);
            }
        } else {
            this.dataSource6thPC.data.splice(index, 1);
            this.dataSource6thPC.data[this.dataSource6thPC.data.length - 1]['payableToDate'] = null;
            this.dataSource6thPC = new MatTableDataSource(this.dataSource6thPC.data);
            this.endDate = this.dataSource6thPC.data[this.dataSource6thPC.data.length - 1]['payableFromDate'];
            this.showDeleteBtnPayDetail = false;
            this.showAddButtonPayDetail = true;
        }
    }

    /**
     * @method delete6TableRow
     * @description Method delete required data with id
     * @param param parameter for api
     */
    delete6TableRow(param, index) {
        this.suspensionService.deletePayDetail(param).subscribe((res) => {
            if (res && res['status'] === 200) {
                if (res['message']) {
                    this.toastr.success(res['message']);
                }
                this.dataSource6thPC.data.splice(index, 1);
                this.dataSource6thPC.data[this.dataSource6thPC.data.length - 1]['payableToDate'] = null;
                this.dataSource6thPC = new MatTableDataSource(this.dataSource6thPC.data);
                this.endDate = this.dataSource6thPC.data[this.dataSource6thPC.data.length - 1]['payableFromDate'];
                this.showDeleteBtnPayDetail = false;
                this.showAddButtonPayDetail = true;
            }
        }, (err) => {
            this.toastr.error(err);
        });
    }

    /**
     * @description Method to add a 7th Pay Commission row in dataSource7thPC
     * @param index index of last row of dataSource7thPC
     */
    add7thPC(index) {
        if (this.dataSource7thPC) {
            this.isSixMonths = true;
            const dataSeven = _.cloneDeep(this.dataSource7thPC.data);
            if (dataSeven.length > 1) {
                dataSeven[dataSeven.length - 1]['payableToDate'] = this.date;
            }
            dataSeven.push({
                payableFromDate: this.date,
                payableToDate: null,
                currentPayLevel: this.payLevel,
                currentCellId: this.cellId,
                currentBasicPay: Number(this.basicPay),
                payableBasicPayPerc: '50',
                statusId: 205,
                payableBasicPayAmt: '',
                id: 0
            });
            this.dataSource7thPC = new MatTableDataSource(dataSeven);
            const element = this.dataSource7thPC.data[index];
            this.payableMinDate = element.payableFromDate;
            this.onPayDetailChange(this.date);
            this.dataSource = _.cloneDeep(this.dataSource7thPC);
            let draftPayDetail = 0;
            this.dataSource7thPC.data.forEach((payDetail7thPC) => {
                if (payDetail7thPC.statusId) {
                    if (payDetail7thPC.statusId === 205 || payDetail7thPC.statusId === 267) {
                        draftPayDetail++;
                    }
                }
            });
            if (draftPayDetail !== this.dataSource7thPC.data.length) {
                this.showAddButtonPayDetail = false;
                this.showDeleteBtnPayDetail = true;
                this.addButtonValidate = false;
            }
        }
    }

    /**
     * @description delete a row from datasource7thPC
     * @param ID suspension id of row
     * @param index index of the selected row
     * @param trigger to know from where this function is called
     */
    delete7thPC(ID, index, trigger) {
        if (ID) {
            const param = {
                id: ID,
            };
            if (trigger === 1) {
                const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                    width: '360px',
                    data: pvuMessage.DELETE
                });
                dialogRef.afterClosed().subscribe(result => {
                    if (result === 'yes') {
                       this.delete7TableRow(param, index);
                    }
                });
            } else {
                this.delete7TableRow(param, index);
            }
        } else {
            this.dataSource7thPC.data.splice(index, 1);
            this.dataSource7thPC.data[this.dataSource7thPC.data.length - 1]['payableToDate'] = null;
            this.dataSource7thPC = new MatTableDataSource(this.dataSource7thPC.data);
            this.endDate = this.dataSource7thPC.data[this.dataSource7thPC.data.length - 1]['payableFromDate'];
            this.showDeleteBtnPayDetail = false;
            this.showAddButtonPayDetail = true;
        }
    }

    /**
     * @method delete7TableRow
     * @description Method delete required data with id
     * @param param parameter for api
     */
    delete7TableRow(param, index) {
        this.suspensionService.deletePayDetail(param).subscribe((res) => {
            if (res && res['status'] === 200) {
                if (res['message']) {
                    this.toastr.success(res['message']);
                }
                this.dataSource7thPC.data.splice(index, 1);
                this.dataSource7thPC.data[this.dataSource7thPC.data.length - 1]['payableToDate'] = null;
                this.dataSource7thPC = new MatTableDataSource(this.dataSource7thPC.data);
                this.endDate = this.dataSource7thPC.data[this.dataSource7thPC.data.length - 1]['payableFromDate'];
                this.showDeleteBtnPayDetail = false;
                this.showAddButtonPayDetail = true;
            }
        }, (err) => {
            this.toastr.error(err);
        });
    }

    /**
     * @description Method to calculate Payable Basic Pay Amount
     * @param item details for calculation
     * @returns calculated amount
     */
    calculatePayable(item) {
        let returnData = 0;
        if (item.currentBasicPay && item.payableBasicPayPerc) {
            item.payableBasicPayAmt = (Number(item.currentBasicPay) * Number(item.payableBasicPayPerc)) / 100;
            returnData = (Number(item.currentBasicPay) * Number(item.payableBasicPayPerc)) / 100;
        }
        return returnData;
    }

    /**
     * @description Method to calculate Payable Grade Pay Amount
     * @param item details for calculation
     * @returns calculated amount
     */
    calculatePayableGP(item) {
        let returnData = 0;
        if (item.currentGradePay && item.payableGradePayPerc) {
            item.payableGradePayAmt = (Number(item.currentGradePay) * Number(item.payableGradePayPerc)) / 100;
            returnData = (Number(item.currentGradePay) * Number(item.payableGradePayPerc)) / 100;
        }
        return returnData;
    }

    /**
     * @description Method to calculate Payable Pay Band Value Amount
     * @param item details for calculation
     * @returns calculated amount
     */
    calculatePayablePBV(item) {
        let returnData = 0;
        if (item.currentPayBandValue && item.payablePayBandPerc) {
            item.payablePayBandAmt = (Number(item.currentPayBandValue) * Number(item.payablePayBandPerc)) / 100;
            returnData = (Number(item.currentPayBandValue) * Number(item.payablePayBandPerc)) / 100;
        }
        return returnData;
    }

    /**
     * @description Method invoked on Reinstate radio button selection.
     * Method sets and clears validation based on Reinstate value selected
     * Modifies dataSource
     * @param value Reinstate value selected
     */
    onReinstate(value) {
        if (value === 1) {
            this.suspensionForm.controls.susEndDate.clearValidators();
            this.suspensionForm.controls.susEndDate.updateValueAndValidity();
            this.suspensionForm.controls.closureId.clearValidators();
            this.suspensionForm.controls.closureId.updateValueAndValidity();
            this.suspensionForm.controls.punishmentType.clearValidators();
            this.suspensionForm.controls.punishmentType.updateValueAndValidity();
            this.suspensionForm.controls.closureRemarks.clearValidators();
            this.suspensionForm.controls.closureRemarks.updateValueAndValidity();
            this.suspensionForm.patchValue({
                'susEndDate': '',
                'susClsDate': '',
                'closureId': '',
                'noOfDayInSus': '',
                'punishmentType': '',
                'closureRemarks': '',
            });
            this.isReinstate = true;
            this.closureGuilty = false;
            this.closureNotGuilty = false;
            this.isClsDate = false;
            this.addButtonValidate = false;
            if (this.dataSource5thPC && this.dataSource5thPC.data && this.dataSource5thPC.data.length > 0) {
                this.dataSource5thPC.data[this.dataSource5thPC.data.length - 1]['payableToDate'] = null;
            }
            if (this.dataSource6thPC && this.dataSource6thPC.data && this.dataSource6thPC.data.length > 0) {
                this.dataSource6thPC.data[this.dataSource6thPC.data.length - 1]['payableToDate'] = null;
            }
            if (this.dataSource7thPC && this.dataSource7thPC.data && this.dataSource7thPC.data.length > 0) {
                this.dataSource7thPC.data[this.dataSource7thPC.data.length - 1]['payableToDate'] = null;
            }
            if (this.dataSourceFixPC && this.dataSourceFixPC.data && this.dataSourceFixPC.data.length > 0) {
                this.dataSourceFixPC.data[this.dataSourceFixPC.data.length - 1]['payableToDate'] = null;
            }
        } else {
            let data = [];
            if (this.show5thPC) {
                if (this.dataSource5thPC.data[this.dataSource5thPC.data.length - 1].statusId !== 327) {
                    data = _.cloneDeep(this.dataSource5thPC.data);
                    data.pop();
                    if (this.dataSource5thPC.data[this.dataSource5thPC.data.length - 1].id !== 0) {
                        this.delete5thPC(this.dataSource5thPC.data[this.dataSource5thPC.data.length - 1].id,
                             this.dataSource5thPC.data.length - 1, 2);
                    }
                    this.dataSource5thPC = new MatTableDataSource(data);
                    this.showAddButtonPayDetail = true;
                    this.showDeleteBtnPayDetail = false;
                }
            }
            if (this.show6thPC) {
                if (this.dataSource6thPC.data[this.dataSource6thPC.data.length - 1].statusId !== 327) {
                    data = _.cloneDeep(this.dataSource6thPC.data);
                    data.pop();
                    if (this.dataSource6thPC.data[this.dataSource6thPC.data.length - 1].id !== 0) {
                        this.delete6thPC(this.dataSource6thPC.data[this.dataSource6thPC.data.length - 1].id,
                             this.dataSource6thPC.data.length - 1, 2);
                    }
                    this.dataSource6thPC = new MatTableDataSource(data);
                    this.showAddButtonPayDetail = true;
                    this.showDeleteBtnPayDetail = false;
                }
            }
            if (this.show7thPC) {
                if (this.dataSource7thPC.data[this.dataSource7thPC.data.length - 1].statusId !== 327) {
                    data = _.cloneDeep(this.dataSource7thPC.data);
                    data.pop();
                    if (this.dataSource7thPC.data[this.dataSource7thPC.data.length - 1].id !== 0) {
                        this.delete7thPC(this.dataSource7thPC.data[this.dataSource7thPC.data.length - 1].id,
                             this.dataSource7thPC.data.length - 1, 2);
                    }
                    this.dataSource7thPC = new MatTableDataSource(data);
                    this.showAddButtonPayDetail = true;
                    this.showDeleteBtnPayDetail = false;
                }
            }
            if (this.showFixPc) {
                if (this.dataSourceFixPC.data[this.dataSourceFixPC.data.length - 1].statusId !== 327) {
                    data = _.cloneDeep(this.dataSourceFixPC.data);
                    data.pop();
                    if (this.dataSourceFixPC.data[this.dataSourceFixPC.data.length - 1].id !== 0) {
                        this.delete7thPC(this.dataSourceFixPC.data[this.dataSourceFixPC.data.length - 1].id,
                             this.dataSourceFixPC.data.length - 1, 2);
                    }
                    this.dataSourceFixPC = new MatTableDataSource(data);
                    this.showAddButtonPayDetail = true;
                    this.showDeleteBtnPayDetail = false;
                }
            }
            this.isReinstate = false;
            this.suspensionForm.controls.susEndDate.setValidators([Validators.required]);
            this.suspensionForm.controls.susEndDate.updateValueAndValidity();
        }
        this.suspensionForm.updateValueAndValidity();
    }

    /**
     * @description Actions to be taken on closure date selection
     */

    onClosureDateSelect() {
        if (this.suspensionForm.controls.susClsDate.value !== '') {
            this.isClsDate = true;
            this.suspensionForm.controls.closureId.setValidators([Validators.required]);
            this.suspensionForm.controls.closureId.updateValueAndValidity();
        } else {
            this.isClsDate = false;
            this.suspensionForm.controls.closureId.clearValidators();
            this.suspensionForm.controls.closureId.updateValueAndValidity();
        }
        this.suspensionForm.updateValueAndValidity();
    }

    /**
     * @description Method sets and clears validation based on Closure value selected
     * and makes changes in template accordingly
     * @param event Closure value selected
     */
    showClosureDetails(event) {
        if (event.value === 272) {
            this.closureGuilty = true;
            this.closureNotGuilty = false;
            this.suspensionForm.controls.punishmentType.setValidators([Validators.required]);
            this.suspensionForm.controls.closureRemarks.setValidators(null);
            this.suspensionForm.controls.closureRemarks.patchValue('');
        } else {
            this.closureNotGuilty = true;
            this.closureGuilty = false;
            this.suspensionForm.controls.closureRemarks.setValidators([Validators.required]);
            this.suspensionForm.controls.punishmentType.setValidators(null);
            this.suspensionForm.controls.punishmentType.patchValue('');
        }
        this.suspensionForm.controls.closureRemarks.updateValueAndValidity();
        this.suspensionForm.controls.punishmentType.updateValueAndValidity();
    }

    /**
     * @description Method to find array index based on keyName
     * @param itemArray array
     * @param keyName key based on which index is to found
     * @param selectedValue selected value
     * @returns item at index
     */
    findArrayIndex(itemArray, keyName, selectedValue) {
        const selectedIndex = itemArray.findIndex(x => x[keyName] === selectedValue);
        return itemArray[selectedIndex];
    }

    /**
     * @method getPayableFromMinDate
     * @description function called to set min date to from date column for each row of pay details
     * @param i index of row
     */
    getPayableFromMinDate(i) {
        if (i < 1) {
            return this.payableMinDate;
        } else {
            if (this.show5thPC) {
                return this.getAdjacentDate(new Date(this.dataSource5thPC.data[i - 1]['payableFromDate']), '+');
            }
            if (this.show6thPC) {
                return this.getAdjacentDate(new Date(this.dataSource6thPC.data[i - 1]['payableFromDate']), '+');
            }
            if (this.show7thPC) {
                return this.getAdjacentDate(new Date(this.dataSource7thPC.data[i - 1]['payableFromDate']), '+');
            }
        }
    }

    /**
     * @method getAdjacentDate
     * @description function called to calculate date before or date after of date value passed
     * @param d passed date value
     * @param operation for identifiying purpose of function call
     */
    getAdjacentDate(d, operation) {
        if (d) {
            const oneDay = (1000 * 60 * 60 * 24);
            if (operation === '+') {
                return new Date(d.getTime() + oneDay);
            } else  if (operation === '-') {
                return new Date(d.getTime() - oneDay);
            }
        }
        return null;
    }

    /**
     * @description Method to save Suspension details through service
     */
    saveSuspension() {
        let valid = true;
        const self = this;
        if (this.suspensionForm.controls.susOrderNo.invalid || this.suspensionForm.controls.susOrderDate.invalid ||
            this.suspensionForm.controls.susEventDate.invalid || this.suspensionForm.controls.employeeNumber.invalid) {
            this.suspensionForm.controls.susOrderNo.markAsTouched();
            this.suspensionForm.controls.susOrderDate.markAsTouched();
            this.suspensionForm.controls.susEventDate.markAsTouched();
            this.suspensionForm.controls.employeeNumber.markAsTouched();
            valid = false;
        }
        if (!this.empId) {
            this.suspensionForm.controls.employeeNumber.markAsTouched();
            valid = false;
        }
        if (valid) {
            this.transactionId = true;
            this.suspensionForm.removeControl('officeName');
            const dataToSend = _.cloneDeep(this.suspensionForm.value);
            let payDetailDto;
            if (this.show6thPC) {
                payDetailDto = _.cloneDeep(this.dataSource6thPC.data);
            } else if (this.show5thPC) {
                payDetailDto = _.cloneDeep(this.dataSource5thPC.data);
            } else if (this.show7thPC) {
                payDetailDto = _.cloneDeep(this.dataSource7thPC.data);
            } else if (this.showFixPc) {
                payDetailDto = _.cloneDeep(this.dataSourceFixPC.data);
            }
            payDetailDto.forEach(element => {
                delete element.currentGrade;
                delete element.currentScale;
                delete element.currentGradePay;
                delete element.currentPayBand;
                delete element.currentPayBandValue;
                delete element.currentBasicPay;
                delete element.currentPayLevel;
                delete element.currentCellId;
                delete element.currentBasicPay;
                element['payScale'] = this.payScale;
                element['payBandId'] = this.payBandId;
                element['payBandValue'] = this.payBandValue;
                element['gradePayId'] = this.gradePayId;
                element['payLevelId'] = this.paylevelId;
                element['cellId'] = this.cellNameId;
                element['basicPay'] = this.basicPay;
                element.payableFromDate = this.convertDateFormat(element.payableFromDate);
                element['statusId'] = element.statusId;
            });
            dataToSend['payDetailsDtos'] = payDetailDto;
            dataToSend['susOrderDate'] = this.convertDateFormat(dataToSend['susOrderDate']);
            dataToSend['susEventDate'] = this.convertDateFormat(dataToSend['susEventDate']);
            dataToSend['susStartDate'] = this.convertDateFormat(dataToSend['susStartDate']);
            dataToSend['closureId'] = (dataToSend['closureId'] === 0 || dataToSend['closureId'] === '' ||
                dataToSend['closureId'] === null || dataToSend['closureId'] === undefined) ?
                0 : dataToSend['closureId'];
            dataToSend['empId'] = this.empId;
            dataToSend['formAction'] = 'DRAFT';
            dataToSend['officeId'] = this.currentPost[0]['oauthTokenPostDTO']['edpMsOfficeDto']['officeId'];
            dataToSend['statusId'] = this.statusId;
            dataToSend['id'] = this.suspensionId;
            dataToSend['trnNo'] = this.trnNo;
            dataToSend['createdDate'] = this.initiationDate;
            dataToSend['suspensionClosure'] = false;
            if (this.action === 'edit') {
                if (this.isClosure) {
                    dataToSend['suspensionClosure'] = true;
                }
            }

            this.suspensionService.saveSuspensionDetails(dataToSend).subscribe((res) => {
                if (res && res['result'] && res['status'] === 200) {
                    self.toastr.success(res['message']);
                    this.empIcon = false;
                    this.suspensionId = res['result']['id'];
                    this.initiationDate = res['result']['createdDate'];
                    this.statusId = res['result']['statusId'];
                    this.isTabDisabled = false;
                    this.formValueChange = false;
                    if (this.show6thPC) {
                        this.dataSource6thPC.data = res['result']['payDetailsDtos'];
                        this.dataSource6thPC.data.forEach((element) => {
                            element.currentPayBand = this.payBand;
                            element.currentPayBandValue = this.payBandValue;
                            element.currentGradePay = this.gradePay;
                        });
                        this.dataSource6thPC = new MatTableDataSource(this.dataSource6thPC.data);
                    } else if (this.show5thPC) {
                        this.dataSource5thPC.data = res['result']['payDetailsDtos'];
                        this.dataSource5thPC.data.forEach((element) => {
                            element.currentScale = this.scale;
                            element.currentBasicPay = this.basicPay;
                        });
                        this.dataSource5thPC = new MatTableDataSource(this.dataSource5thPC.data);
                    } else if (this.show7thPC) {
                        this.dataSource7thPC.data = res['result']['payDetailsDtos'];
                        this.dataSource7thPC.data.forEach((element) => {
                            element.currentPayLevel = this.payLevel;
                            element.currentCellId = this.cellId;
                            element.currentBasicPay = this.basicPay;
                        });
                        this.dataSource7thPC = new MatTableDataSource(this.dataSource7thPC.data);
                    } else if (this.showFixPc) {
                        this.dataSourceFixPC.data = res['result']['payDetailsDtos'];
                        this.dataSourceFixPC.data.forEach((element) => {
                            element.currentBasicPay = this.basicPay;
                        });
                        this.dataSourceFixPC = new MatTableDataSource(this.dataSourceFixPC.data);
                    }
                    if (res['result']['trnNo']) {
                        this.dialog.open(SaveDraftDialogComponent, {
                            width: '360px',
                            data: {
                                transNo: res['result']['trnNo']
                            }
                        });
                    }
                    this.trnNo = res['result']['trnNo'];
                } else {
                    self.toastr.error(res['message']);
                }
            }, (err) => {
                self.toastr.error(err);
            });
        } else {
            this.toastr.error(MessageConst.VALIDATION.TOASTR_REQUIRED);
        }
    }

    /**
     * @description Method to submit Suspension details through service and open Workflow Popup
     */
    submitSuspension() {
        let valid = true;
        const self = this;

        if (this.suspensionForm.invalid) {
            _.each(this.suspensionForm.controls, function (control) {
                if (control.status === 'INVALID') {
                    control.markAsTouched({ onlySelf: true });
                    valid = false;
                }
            });
        }
        if (!this.empId) {
            this.suspensionForm.controls.employeeNumber.markAsTouched();
            valid = false;
        }
        if (this.show6thPC) {
            this.dataSource6thPC.data.forEach(element => {
                if (!element.payablePayBandPerc || !element.payableGradePayPerc) {
                    element.isHighlight = true;
                    valid = false;
                }
            });
        } else if (this.show5thPC) {
            this.dataSource5thPC.data.forEach(element => {
                if (!element.payableBasicPayPerc) {
                    element.isHighlight = true;
                    valid = false;
                }
            });
        } else if (this.show7thPC) {
            this.dataSource7thPC.data.forEach(element => {
                if ((!element.payableBasicPayPerc) || element.payableBasicPayPerc === 0) {
                    element.isHighlight = true;
                    valid = false;
                }
            });
        } else if (this.showFixPc) {
            this.dataSourceFixPC.data.forEach(element => {
                if ((!element.payableBasicPayPerc) || element.payableBasicPayPerc === 0) {
                    element.isHighlight = true;
                    valid = false;
                }
            });
        }
        if (this.showAddButtonPayDetail && this.isReinstate) {
            valid = false;
            this.addButtonValidate = true;
        }
        if (valid) {
            this.transactionId = true;
            this.suspensionForm.removeControl('officeName');
            const dataToSend = _.cloneDeep(this.suspensionForm.value);
            let payDetailDto;
            if (this.show6thPC) {
                payDetailDto = _.cloneDeep(this.dataSource6thPC.data);
            } else if (this.show5thPC) {
                payDetailDto = _.cloneDeep(this.dataSource5thPC.data);
            } else if (this.show7thPC) {
                payDetailDto = _.cloneDeep(this.dataSource7thPC.data);
            } else if (this.showFixPc) {
                payDetailDto = _.cloneDeep(this.dataSourceFixPC.data);
            }
            payDetailDto.forEach(element => {
                delete element.currentGrade;
                delete element.currentScale;
                delete element.currentGradePay;
                delete element.currentPayBand;
                delete element.currentPayBandValue;
                delete element.currentBasicPay;
                delete element.currentPayLevel;
                delete element.currentCellId;
                delete element.currentBasicPay;
                delete element.isHighlight;
                element['payScale'] = this.payScale;
                element['payBandId'] = this.payBandId;
                element['payBandValue'] = this.payBandValue;
                element['gradePayId'] = this.gradePayId;
                element['payLevelId'] = this.paylevelId;
                element['cellId'] = this.cellNameId;
                element['basicPay'] = this.basicPay;
                element.payableFromDate = this.convertDateFormat(element.payableFromDate);
                element.payableToDate = this.convertDateFormat(element.payableToDate);
                element['statusId'] = element.statusId;
            });
            dataToSend['payDetailsDtos'] = payDetailDto;
            dataToSend['susOrderDate'] = this.convertDateFormat(dataToSend['susOrderDate']);
            dataToSend['susEventDate'] = this.convertDateFormat(dataToSend['susEventDate']);
            dataToSend['susStartDate'] = this.convertDateFormat(dataToSend['susStartDate']);
            if (!this.isReinstate) {
                dataToSend['susEndDate'] = this.convertDateFormat(dataToSend['susEndDate']);
                dataToSend['susClsDate'] = this.convertDateFormat(dataToSend['susClsDate']);
            }
            dataToSend['empId'] = this.empId;
            dataToSend['trnNo'] = this.trnNo;
            dataToSend['formAction'] = this.statusId !== 205 && this.statusId !== 0 ? 'SUBMITTED' : 'DRAFT';
            dataToSend['officeId'] = this.currentPost[0]['oauthTokenPostDTO']['edpMsOfficeDto']['officeId'];
            dataToSend['statusId'] = this.statusId;
            dataToSend['id'] = this.suspensionId;
            dataToSend['createdDate'] = this.initiationDate;
            dataToSend['suspensionClosure'] = false;
            dataToSend['finalEnd'] = this.isFinalEnd;
            if (this.action === 'edit') {
                if (this.isClosure) {
                    dataToSend['suspensionClosure'] = true;
                }
            }

            this.suspensionService.saveSuspensionDetails(dataToSend).subscribe((res) => {
                if (res && res['result'] && res['status'] === 200) {
                    self.toastr.success(res['message']);
                    if (this.statusId !== res['result']['statusId']) {
                        this.isSaveDraftVisible = false;
                    }
                    this.suspensionId = res['result']['id'];
                    this.trnNo = res['result']['trnNo'];
                    this.initiationDate = res['result']['createdDate'];
                    this.isTabDisabled = false;
                    if (this.show6thPC) {
                        this.dataSource6thPC.data = res['result']['payDetailsDtos'];
                        this.dataSource6thPC.data.forEach((elements) => {
                            elements.currentPayBand = this.payBand;
                            elements.currentPayBandValue = this.payBandValue;
                            elements.currentGradePay = this.gradePay;
                        });
                        this.dataSource6thPC = new MatTableDataSource(this.dataSource6thPC.data);
                    } else if (this.show5thPC) {
                        this.dataSource5thPC.data = res['result']['payDetailsDtos'];
                        this.dataSource5thPC.data.forEach((elements) => {
                            elements.currentScale = this.scale;
                            elements.currentBasicPay = this.basicPay;
                        });
                        this.dataSource5thPC = new MatTableDataSource(this.dataSource5thPC.data);
                    } else if (this.show7thPC) {
                        this.dataSource7thPC.data = res['result']['payDetailsDtos'];
                        this.dataSource7thPC.data.forEach((elements) => {
                            elements.currentPayLevel = this.payLevel;
                            elements.currentCellId = this.cellId;
                            elements.currentBasicPay = this.basicPay;
                        });
                        this.dataSource7thPC = new MatTableDataSource(this.dataSource7thPC.data);
                    } else if (this.showFixPc) {
                        this.dataSourceFixPC.data = res['result']['payDetailsDtos'];
                        this.dataSourceFixPC.data.forEach((elements) => {
                            elements.currentBasicPay = this.basicPay;
                        });
                        this.dataSourceFixPC = new MatTableDataSource(this.dataSourceFixPC.data);
                    }
                    this.openWorkFlowPopUp();
                } else {
                    self.toastr.error(res['message']);
                }
            }, (err) => {
                self.toastr.error(err);
            });
        } else {
            this.toastr.error(MessageConst.VALIDATION.TOASTR);
        }
    }

    /**
     * @description Method to open ViewComments Dialog
     */
    viewComments() {
        if (this.suspensionId) {
            this.dialog.open(ViewCommentsComponent, {
                width: '2700px',
                height: '600px',
                data: {
                    'empId': this.empId,
                    'trnId': this.suspensionId,
                    'event': 'SUSPENSION',
                    'trnNo': this.trnNo,
                    'initiationDate': this.initiationDate
                }
            });
        }
    }

    /**
     * to validate the percentage
     * @param event keypress event
     */
    percentKeyPress(event: any) {
        const pattern = /^[1-9]{1}\d{0,1}(\.\d{0,2})?$|^(99)(\.[0]{1,2})?$/;
        const inputChar = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        let tempstr = event.target.value;

        const start = event.target.selectionStart;
        const end = event.target.selectionEnd;
        if (Number(tempstr.substr(start, end - start)) === Number(tempstr)) {
            tempstr = '' ;
        }
        // tempstr += inputChar;
        tempstr = tempstr.substr(0, start) + inputChar + tempstr.substr(start);

        if (!pattern.test(tempstr)) {
            event.preventDefault();
            return false;
        }
    }

    /**
     * @description Method to add 2 trailing 0 decimal value
     * @param data data
     * @param key key in which decimal is to be added
     */
    decimalPoint(data, key) {
        if (isNaN(data[key]) || data[key] === '' || data[key] < 1 || data[key] > 99) {
            data[key] = '';
            data['isHighlight'] = true;
            this.toastr.error('Please enter % between 1 and 99');
        } else {
            data[key] = Number(data[key]).toFixed(2);
        }
    }

    /**
     * @description Method to track pay detail change
     */
    onPayDetailChange(value?) {
            if ( value && this.suspensionForm.get('susStartDate') &&
                    this.suspensionForm.get('susStartDate').value) {
                    if (this.dataSource5thPC && this.dataSource5thPC.data && this.dataSource5thPC.data.length > 1) {
                        this.dataSource5thPC.data[this.dataSource5thPC.data.length - 2]['payableToDate'] =
                        this.getAdjacentDate(new Date(
                            this.dataSource5thPC.data[this.dataSource5thPC.data.length - 1]['payableFromDate']), '-');
                    }
                    if (this.dataSource6thPC && this.dataSource6thPC.data && this.dataSource6thPC.data.length > 1) {
                        this.dataSource6thPC.data[this.dataSource6thPC.data.length - 2]['payableToDate'] =
                        this.getAdjacentDate(new Date(
                            this.dataSource6thPC.data[this.dataSource6thPC.data.length - 1]['payableFromDate']), '-');
                    }
                    if (this.dataSource7thPC && this.dataSource7thPC.data && this.dataSource7thPC.data.length > 1) {
                        this.dataSource7thPC.data[this.dataSource7thPC.data.length - 2]['payableToDate'] =
                        this.getAdjacentDate(new Date(
                            this.dataSource7thPC.data[this.dataSource7thPC.data.length - 1]['payableFromDate']), '-');
                    }
                    if (this.dataSourceFixPC && this.dataSourceFixPC.data && this.dataSourceFixPC.data.length > 1) {
                        this.dataSourceFixPC.data[this.dataSourceFixPC.data.length - 2]['payableToDate'] =
                        this.getAdjacentDate(new Date(
                            this.dataSourceFixPC.data[this.dataSourceFixPC.data.length - 1]['payableFromDate']), '-');
                    }
                    let days = 0;
                    const startDate = new Date(this.suspensionForm.get('susStartDate').value);
                    const selectedDate = new Date(value);
                    selectedDate.setHours(startDate.getHours());
                    switch (this.suspensionForm.get('payCommission').value) {
                        case 152:
                            // tslint:disable-next-line:max-line-length
                            days = this.getDateDifference(selectedDate , startDate) + 1;
                            break;
                        case 151:
                            // tslint:disable-next-line:max-line-length
                            days = this.getDateDifference(selectedDate , startDate) + 1;
                            break;
                        case 150:
                            // tslint:disable-next-line:max-line-length
                            days = this.getDateDifference(selectedDate , startDate) + 1;
                            break;
                        case 341:
                            // tslint:disable-next-line:max-line-length
                            days = this.getDateDifference(selectedDate , startDate) + 1;
                            break;
                    }
                    if ( days > 180) {
                        this.isSixMonths = false;
                    } else {
                        this.isSixMonths = true;
                        switch (this.suspensionForm.get('payCommission').value) {
                            case 152:
                                // tslint:disable-next-line:max-line-length
                                this.dataSource7thPC.data[this.dataSource7thPC.data.length - 1].payableBasicPayPerc = '50';
                                break;
                            case 151:
                                // tslint:disable-next-line:max-line-length
                                this.dataSource6thPC.data[this.dataSource6thPC.data.length - 1].payableGradePayPerc = '50';
                                // tslint:disable-next-line:max-line-length
                                this.dataSource6thPC.data[this.dataSource6thPC.data.length - 1].payablePayBandPerc = '50';
                                break;
                            case 150:
                                // tslint:disable-next-line:max-line-length
                                this.dataSource5thPC.data[this.dataSource5thPC.data.length - 1].payableBasicPayPerc = '50';
                                break;
                            case 341:
                                // tslint:disable-next-line:max-line-length
                                this.dataSourceFixPC.data[this.dataSourceFixPC.data.length - 1].payableBasicPayPerc = '50';
                                break;
                        }
                    }
        }
        this.formValueChange = true;
    }

    /**
     * @method getDateDifference
     * @description method return difference between two dates in days
     */
    getDateDifference(date2 , date1) {
        return Math.floor((date2 - date1) / (1000 * 60 * 60 * 24));
    }

    /**
    * @description Method to track Suspension Form detail change
    * @returns boolean value form change
    */
    getFormValueChange() {
        this.commonSubscription.push(
            this.suspensionForm.valueChanges.subscribe(res => {
                this.formValueChange = true;
            })
        );
        return this.formValueChange;
    }

    /**
     * @description Method to action on Tab change
     */
    onTabChange(tabChangeEvent) {
        // kept for future purpose
        // const self = this;
        // const formValueChange = this.getFormValueChange(),
        //     attachmentFormChange = self.attachmentTab.getAttachmentValueChange();
        // if (this.selectedIndex !== this.prevIndex) {
        //     if (attachmentFormChange || formValueChange) {
        //         const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        //             width: '360px',
        //             data: 'Your changes will be lost. Do you want to save?'
        //         });

        //         dialogRef.afterClosed().subscribe((result) => {
        //             if (result === 'yes') {
        //                 this.selectedIndex = this.prevIndex;
        //             } else {
        //                 this.prevIndex = this.selectedIndex;
        //             }
        //         });
        //     }
        // }
    }

    /**
     * @description Reset form
     */
    reset() {
        this.dialog.open(ConfirmationDialogComponent, {
            width: '360px',
            data: pvuMessage.RESET
        })
            .afterClosed().subscribe(result => {
                if (result === 'yes') {
                    this.showDeleteBtnPayDetail = false;
                    this.suspensionForm.reset();
                    this.data5th = [
                        {
                            payableFromDate: this.date, payableToDate: null, currentScale: '', currentBasicPay: '',
                            payableBasicPayPerc: '50', statusId: 205, payableBasicPayAmt: '', isHighlight: false,
                            id: 0
                        }
                    ];
                    this.dataSource5thPC = new MatTableDataSource<Data5thModel>(this.data5th);
                    this.data6th = [
                        {
                            // tslint:disable-next-line:max-line-length
                            payableFromDate: this.date, payableToDate: null, currentPayBand: '',
                            currentPayBandValue: '', currentGradePay: '',
                            payableGradePayPerc: '50',
                            // tslint:disable-next-line: max-line-length
                            payableGradePayAmt: '', statusId: 205, payablePayBandAmt: '', payablePayBandPerc: '50', isHighlight: false, id: 0
                        }
                    ];
                    this.dataSource6thPC = new MatTableDataSource<Data6thModel>(this.data6th);
                    this.data7th = [
                        {
                               // tslint:disable-next-line: max-line-length
                             payableFromDate: this.date, payableToDate: null, currentPayLevel: '',
                             currentCellId: '', currentBasicPay: '', payableBasicPayPerc: '50',
                             payableBasicPayAmt: '', statusId: 205, isHighlight: false, id: 0
                        }
                    ];
                    this.dataSource7thPC = new MatTableDataSource<Data7thModel>(this.data7th);
                    this.dataFix = [
                        {
                            payableFromDate: this.date, payableToDate: null , currentBasicPay: '',
                            payableBasicPayPerc: '50', statusId: 205, payableBasicPayAmt: '', isHighlight: false,
                            id: 0
                        }
                    ];
                    this.dataSourceFixPC = new MatTableDataSource<DataFixPcModel>(this.dataFix);
                    this.empId = 0;
                    this.employeeName = '';
                    this.class = '';
                    this.designation = '';
                    this.employeeOfficeName = '';
                    this.payLevel = '';
                    this.cellId = '';
                    this.payBand = '';
                    this.payBandValue = '';
                    this.gradePay = '';
                    this.scale = '';
                    this.basicPay = '';
                    this.dateOfJoining = '';
                    this.dateOfRetirement = '';
                    this.dateOfNextIncrement = '';
                    this.doj = '';
                    this.payScale = '';
                    this.cellNameId = '';
                    this.payBandId = '';
                    this.paylevelId = '';
                    this.gradePayId = '';
                    this.suspensionForm.controls.officeName.
                        patchValue(this.currentPost[0]['oauthTokenPostDTO']['edpMsOfficeDto']['officeName']);
                        if (this.suspensionId) {
                        this.getSuspensionDetail({ 'id': this.suspensionId });
                    }
                }
            });
    }

    /**
     * @description Navigate to listing page
     */
    goToListing() {
        this.router.navigate(['/dashboard/pvu/suspension'], { skipLocationChange: true });
    }

    /**
     * @description Navigate to Dashboard page
     */
    goToDashboard() {
        if (!this.dialogOpen) {
            this.router.navigate(['']);
        } else {
            this.dialog.closeAll();
        }
    }

    /**
     * @description Open Workflow Popup Dialog after successful submission
     */
    openWorkFlowPopUp(): void {
        // tslint:disable-next-line: no-use-before-declare
        const dialogRef = this.dialog.open(ForwardDialogComponent, {
            width: '2700px',
            height: '600px',
            data: {
                'empId': this.empId,
                'trnId': this.suspensionId,
                'event': 'SUSPENSION',
                'trnNo': this.trnNo,
                'initiationDate': this.initiationDate
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                if (this.action === 'edit') {
                    this.router.navigate(['/dashboard/pvu/suspension'], { skipLocationChange: true });
                } else {
                    this.router.navigate(['/dashboard'], { skipLocationChange: true });
                }
            }
        });
    }

    /**
     * @method onPrint
     * @description Function is called to Print the pdf
     */
    onPrint() {
        const self = this,
        params = {
            'id': self.suspensionId
        };
        this.suspensionService.printOrder(params).subscribe(res => {
            if (res) {
                const file = res['result'];
                const docType = 'application/pdf';
                const byteArray = new Uint8Array(atob(file).split('').map(char => char.charCodeAt(0)));
                const blob = new Blob([byteArray], { type: docType });
                if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                    // this.onSubmitSearch();
                    window.navigator.msSaveOrOpenBlob(blob);
                    // this.loader = false;
                } else {
                    // this.onSubmitSearch();
                    const url = window.URL.createObjectURL(blob);
                    window.open(url, '_blank');
                }
            }
        }, err => {
            this.toastr.error(err);
        });
    }

    /**
     * @description Method to add a Fix Pay Commission row in dataSourceFixPC
     * @param index index of last row of dataSourceFixPC
     */
     addFixPc(index) {
        if (this.dataSourceFixPC) {
            this.isSixMonths = true;
            const dataFixPc = _.cloneDeep(this.dataSourceFixPC.data);
            if (dataFixPc.length > 1) {
                dataFixPc[dataFixPc.length - 1]['payableToDate'] = this.date;
            }
            dataFixPc.push({
                payableFromDate: this.date,
                payableToDate: null,
                currentBasicPay: Number(this.basicPay),
                payableBasicPayPerc: '50',
                payableBasicPayAmt: '',
                statusId: 205,
                id: 0
            });
            this.dataSourceFixPC = new MatTableDataSource(dataFixPc);
            const element = this.dataSource7thPC.data[index];
            this.payableMinDate = element.payableFromDate;
            this.onPayDetailChange(this.date);
            this.dataSource = _.cloneDeep(this.dataSourceFixPC);

            let draftPayDetail = 0;
            this.dataSourceFixPC.data.forEach((payDetail5thPC) => {
                if (payDetail5thPC.statusId) {
                    if (payDetail5thPC.statusId === 205 || payDetail5thPC.statusId === 267) {
                        draftPayDetail++;
                    }
                }
            });
            if (draftPayDetail !== this.dataSourceFixPC.data.length) {
                this.showAddButtonPayDetail = false;
                this.showDeleteBtnPayDetail = true;
                this.addButtonValidate = false;
            }
        }
    }

    /**
     * @description delete a row from dataSourceFixPC
     * @param ID suspension id of row
     * @param index index of the selected row
     * @param trigger to know from where this function is called
     */
     deleteFixPc(ID, index, trigger) {
        if (ID) {
            const param = {
                id: ID,
            };
            if (trigger === 1) {
                const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                    width: '360px',
                    data: pvuMessage.DELETE
                });
                dialogRef.afterClosed().subscribe(result => {
                    if (result === 'yes') {
                       this.deleteFixPayRow(param, index);
                    }
                });
            } else {
                this.deleteFixPayRow(param, index);
            }
        } else {
            this.dataSourceFixPC.data.splice(index, 1);
            this.dataSourceFixPC.data[this.dataSourceFixPC.data.length - 1]['payableToDate'] = null;
            this.dataSourceFixPC = new MatTableDataSource(this.dataSourceFixPC.data);
            this.endDate = this.dataSourceFixPC.data[this.dataSourceFixPC.data.length - 1]['payableFromDate'];
            this.showDeleteBtnPayDetail = false;
            this.showAddButtonPayDetail = true;
        }
    }

    /**
     * @method delete5TableRow
     * @description Method delete required data with id
     * @param param parameter for api
     */
    deleteFixPayRow(param, index) {
        this.suspensionService.deletePayDetail(param).subscribe((res) => {
            if (res && res['status'] === 200) {
                if (res['message']) {
                    this.toastr.success(res['message']);
                }
                this.dataSourceFixPC.data.splice(index, 1);
                this.dataSourceFixPC.data[this.dataSourceFixPC.data.length - 1]['payableToDate'] = null;
                this.dataSourceFixPC = new MatTableDataSource(this.dataSourceFixPC.data);
                this.endDate = this.dataSourceFixPC.data[this.dataSourceFixPC.data.length - 1]['payableFromDate'];
                this.showDeleteBtnPayDetail = false;
                this.showAddButtonPayDetail = true;
            }
        }, (err) => {
            this.toastr.error(err);
        });
    }
}
