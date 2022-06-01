import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { lcMessage } from 'src/app/common/error-message/common-message.constants';
import { ListValue, Treasury } from './../../model/letter-of-credit';
import { LetterOfCreditDirectives } from './../../directive/letter-of-credit-directive';
import { ActivatedRoute, Router } from '@angular/router';
import { LetterOfCreditService } from '../../service/letter-of-credit.service';
import { CommonWorkflowService } from '../../../common/workflow-service/common-workflow.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ToastrService } from 'ngx-toastr';
import { MESSAGES } from 'src/app/shared/constants/letter-of-credit/message-constants';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import * as _ from 'lodash';
import { BehaviorSubject, Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { APIConst } from 'src/app/shared/constants/letter-of-credit/letter-of-credit-api.constants';
import { ModuleNames } from '../../../common/constant/common-workflow.constants';
import { LcCommonWorkflowComponent } from '../../lc-common-workflow/lc-common-workflow.component';
import { OkDialogComponent } from 'src/app/shared/components/ok-dialog/ok-dialog.component';
import { CONFIGURATION, FormActions } from 'src/app/models/letter-of-credit/letter-of-credit';
import { EdpDataConst } from 'src/app/shared/constants/edp/edp-data.constants';
declare function SetGujarati();
declare function SetEnglish();

@Component({
    selector: 'app-lc-account-closing-request-create',
    templateUrl: './lc-account-closing-request-create.component.html',
    styleUrls: ['./lc-account-closing-request-create.component.css']
})
export class LcAccountClosingRequestCreateComponent implements OnInit {

    /**
   * Configuration for this file
   *
   *
   * @memberOf LcAccountClosingRequestCreateComponent
   */

    wfRoleIds: any;
    wfRoleCode: any;
    menuId: any;
    linkMenuId: any;
    postId: any;
    userId: any;
    lkPoOffUserId: any;
    officeId: any;
    totalAttachmentSize = 0;
    userName: string;
    @Input() isView: boolean;
    @Input() isEdit: boolean;
    @Input() subHeadHdrId;
    userPostList: any;
    departmentId: any;
    officeName: any;
    districtName: any;
    districtId: any;
    firstName: any;
    cardexno: any;
    ddoNo: any;
    currentUserData: any;
    departmentName: any;
    officeNameId: any;
    openhdrId: any;
    closeReqHdrId: any;
    lcCloseReqSdId: any;
    referenceNo: any;
    referenceDt: any;

    attachmentTypeList: any[] = [];
    // List of Circle Names
    CircleNameList: any[] = [

    ];

    // List of Bank Branch
    BankBranch_list: any[] = [

    ];

    // List of Major Head
    majorHead_list: any[] = [

    ];

    // List of Sub Major Head
    subMajorHead_list: any[] = [

    ];

    // List of Minor Head
    minorHead_list: any[] = [

    ];

    // List of Sub Head
    subHead_list: any[] = [

    ];

    // List of Detailed Head
    detailedHead_list: any[] = [

    ];

    // Table Data for Treasury LC Data
    TreasuryLCData: Treasury[] = [
        { employeeNumber: '', employeeName: '' }
    ];

    // Table Columns for Treasury Lc Data
    TreasuryLCDataColumn: string[] = [
        'srNo', 'employeeNumber', 'employeeName', 'action'
    ];

    // Table Data for Sub Treasury LC Data
    SubTreasuryLCData: Treasury[] = [
        { employeeNumber: '', employeeName: '' }
    ];

    // Table Columns for Sub Treasury Lc Data
    SubTreasuryLCDataColumn: string[] = [
        'srNo', 'employeeNumber', 'employeeName', 'action'
    ];

    // List of Attachments
    attachmentTypeCode: any[] = [

    ];


    brwoseData: any[] = [
        {
            name: undefined,
            file: undefined,
            uploadedBy: '',
            attachmentType: ''
        }
    ];
    displayedBrowseColumns = [
        'position',
        'attachmentTypeId',
        'fileName',
        'browse',
        'uploadedFileName',
        'userName',
        'action'
    ];

    // List of Head of department
    headOfDepartmentList: any[] = [

    ];

    // List Bank Name
    BankName_list: any[] = [

    ];
    // currentLang = new BehaviorSubject<string>('Eng');
    currentLang = 'Eng';
    isLangChange = false;
    subscribeParams: Subscription;
    mode: any;
    viewableExtension = ['pdf', 'jpg', 'jpeg', 'png'];
    selectedFilePreviewPdf: string;
    selectedFilePreviewImageBase64: string;
    fileBrowseIndex: number;
    selectedFileBase64: string;
    maxAttachment: number;
    constant = EdpDataConst;
    action: any;
    status: any;
    hdrId: any;
    isEditable: any;
    isInputTreasury = true;
    isInputSubTreasury = true;
    isDeleteTreasury = false;
    tabNameHdrId: any;
    isDeleteSubTreasury = false;
    showTreasuryVar = true;
    errorMessage = lcMessage;
    todayDate = new Date();
    anticipatedDateValue = new Date(2019, 1, 15);
    showRemarksVar = false;
    showDesignationVar = false;
    /**
    * Form Group Instance
    *
    * @type {FormGroup}
    * @memberOf LcAccountClosingRequestCreateComponent
    */

    lcOpeningRequestCreateForm: FormGroup;
    aGOfficeCreateForm: FormGroup;
    bankDetailsCreateForm: FormGroup;
    divisionOfficeCreateForm: FormGroup;
    OfficeNameCtrl: FormControl = new FormControl();
    budgetProvisionCtrl: FormControl = new FormControl();
    detailsOfStaffCtrl: FormControl = new FormControl();
    designationCtrl: FormControl = new FormControl();
    BankNameCtrl: FormControl = new FormControl();
    BankBranchCtrl: FormControl = new FormControl();
    CircleNameCtrl: FormControl = new FormControl();
    majorHeadCtrl: FormControl = new FormControl();
    subMajorHeadCtrl: FormControl = new FormControl();
    minorHeadCtrl: FormControl = new FormControl();
    headOfDepartmentCtrl: FormControl = new FormControl();
    subHeadCtrl: FormControl = new FormControl();
    detailedHeadCtrl: FormControl = new FormControl();
    attachmentTypeCodeCtrl: FormControl = new FormControl();
    /**
     * Mat table instance
     *
     * @type {MatTableDataSource<any>}
     * @memberOf LcAccountClosingRequestCreateComponent
     */

    TreasuryLCDataSource = new MatTableDataSource(this.TreasuryLCData);
    SubTreasuryLCDataSource = new MatTableDataSource(this.SubTreasuryLCData);
    dataSourceBrowse = new MatTableDataSource([]);


    /**
     * attachment
     *
     * @type {attachment}
     * @memberOf LcAccountClosingRequestCreateComponent
     */
    @ViewChild('attachment', { static: true }) attachment: ElementRef;
    majorheadName: any;
    submajorheadName: any;
    minorHeadName: any;
    subHeadName: any;
    detailedHeadName: any;


    /**
     * Creates an instance of LcAccountClosingRequestCreateComponent.
     * @param {FormBuilder} fb
     * @param {LetterOfCreditService} locService
     * @param {StorageService} storageService
     * @param {CommonWorkflowService} commonWorkflowService
     * @param {ToastrService} toastr
     * @param {MatDialog} dialog
     * @param {Router} router
     * @param {ActivatedRoute} activatedRoute
     *
     * @memberOf LcAccountClosingRequestCreateComponent
     */
    constructor(private fb: FormBuilder, private el: ElementRef, public dialog: MatDialog, private router: Router, private locService: LetterOfCreditService, private commonWorkflowService: CommonWorkflowService, private storageService: StorageService,
        private toastr: ToastrService, private elem: ElementRef, private activatedRoute: ActivatedRoute, public datepipe: DatePipe) { }

    /**
     * 
     * Create object to access Methods of Letter of Credit Directive
     * 
     * */
    directiveObject = new LetterOfCreditDirectives(this.router, this.dialog, this.el);

    /***********************Life cycle hooks methods start***********************************/

    /**
     * Life cycle hooks method
     *
     *
     * @memberOf LcAccountClosingRequestCreateComponent
     */
    ngOnInit() {

        this.maxAttachment = this.constant.MAX_ATTACHMENT;
        this.userName = this.storageService.get('userName');
        this.currentUserData = this.storageService.get('currentUser');
        this.userPostList = this.currentUserData['post'];
        this.userPostList = this.userPostList.filter(row => row.loginPost == true)
        const userPostList = _.head(this.userPostList)
        this.officeName = userPostList['oauthTokenPostDTO']['edpMsOfficeDto'].officeName;
        this.officeNameId = userPostList['oauthTokenPostDTO']['edpMsOfficeDto'].officeId;
        this.cardexno = userPostList['oauthTokenPostDTO']['edpMsOfficeDto'].cardexno;
        this.ddoNo = userPostList['oauthTokenPostDTO']['edpMsOfficeDto'].ddoNo;
        this.departmentId = userPostList['oauthTokenPostDTO']['edpMsOfficeDto'].departmentId;
        this.departmentName = userPostList['oauthTokenPostDTO']['edpMsOfficeDto'].deptName;
        this.districtName = userPostList['oauthTokenPostDTO']['edpMsOfficeDto'].districtName;
        this.districtId = userPostList['oauthTokenPostDTO']['edpMsOfficeDto'].districtId;


        this.getCurrentUserDetail();
        this.lcOpeningRequestCreateFormData();
        this.divisionOfficeCreateFormData();
        this.getClosingRequestData();

        this.subscribeParams = this.activatedRoute.params.subscribe(resRoute => {
            this.mode = resRoute.mode;
            this.action = resRoute.action;
            this.status = resRoute.status;
            this.closeReqHdrId = resRoute.id;
            this.isEditable = resRoute.isEditable



        })





    }

    /***********************Life cycle hooks methods end***********************************/

    /***********************Public methods start***********************************/



    /**
     * Initialize formgroup
     *
     *
     * @memberOf LcAccountClosingRequestCreateComponent
     */
    lcOpeningRequestCreateFormDataa() {
        this.lcOpeningRequestCreateForm = this.fb.group({
            officeName: [''],
            divisionOfficeAddress: [''],
            administrativeDepartment: [''],
            headOfDepartment: [''],
            treasuryOffice: [''],
            district: [''],
            cardexNo: [''],
            ddoCode: [''],
            divisionCode: [''],
            divisionName: [''],
            circleName: [''],
            circleCode: [''],
            bankName: [''],
            bankBranch: [''],
            bankCode: [''],
            agAuthorizationNo: [''],
            agAuthorizationDate: [''],
            majorHead: [''],
            subMajorHead: [''],
            minorHead: [''],
            subHead: [''],
            detailedHead: [''],


        });

    }


    lcOpeningRequestCreateFormData() {
        this.lcOpeningRequestCreateForm = this.fb.group({

            officeName: [''],
            divisionOfficeAddress: [''],
            administrativeDepartment: [''],
            headOfDepartment: [''],
            treasuryOffice: [''],
            district: [''],
            cardexNo: [''],
            ddoCode: [''],
            divisionCode: [''],
            divisionName: [''],
            circleName: [''],
            circleCode: [''],
            bankName: [''],
            bankBranch: [''],
            bankCode: [''],
            agAuthorizationNo: [''],
            agAuthorizationDate: [''],
            majorHead: [''],
            subMajorHead: [''],
            minorHead: [''],
            subHead: [''],
            detailedHead: [''],

        });
    }

    divisionOfficeCreateFormData() {
        this.divisionOfficeCreateForm = this.fb.group({
            lcClosingDate: [''],
            lcRemarks: [''],
        })

    }
    /*
    * On page Load, fetching data
    *
    **/

    getClosingRequestData() {
        console.log('get Closing request data')
        const param = {

            departmentId: this.departmentId,
            cardexNo: this.cardexno,
            ddoNo: this.ddoNo,
            officeId: this.officeNameId,
            districtId: this.districtId

        };
        console.log(param)
        this.locService.getData(param, APIConst.LC_CLOSEREQUEST.GET_LC_OPENREQ_DATA).subscribe(
            (res: any) => {
                console.log(res)
                if (res && res.result && res.status === 200) {
                    console.log(res)
                    this.openhdrId = res.result.hdrId;
                    this.lcOpeningRequestCreateForm.patchValue({ officeName: res.result.offName });
                    this.lcOpeningRequestCreateForm.patchValue({ divisionOfficeAddress: res.result.divOffAdd });
                    this.lcOpeningRequestCreateForm.patchValue({ administrativeDepartment: res.result.dptName });
                    this.headOfDepartmentList = [];
                    this.headOfDepartmentList.push({
                        name: res.result.hodName
                    })
                    console.log(this.headOfDepartmentList)
                    this.lcOpeningRequestCreateForm.patchValue({ headOfDepartment: this.headOfDepartmentList[0] });
                    this.lcOpeningRequestCreateForm.patchValue({ treasuryOffice: res.result.toOffName });
                    this.lcOpeningRequestCreateForm.patchValue({ district: res.result.disName });
                    this.lcOpeningRequestCreateForm.patchValue({ cardexNo: res.result.cardexNo });
                    this.lcOpeningRequestCreateForm.patchValue({ ddoCode: res.result.ddoNo });
                    this.lcOpeningRequestCreateForm.patchValue({ divisionCode: res.result.divCode });
                    this.lcOpeningRequestCreateForm.patchValue({ divisionName: res.result.divisionName });
                    this.CircleNameList = [];
                    this.CircleNameList.push({
                        name: res.result.circleName
                    })
                    console.log(this.CircleNameList)
                    this.lcOpeningRequestCreateForm.patchValue({ circleName: this.CircleNameList[0] });
                    this.lcOpeningRequestCreateForm.patchValue({ circleCode: res.result.circleCode });

                    this.lcOpeningRequestCreateForm.patchValue({ agAuthorizationNo: res.result.authNo });
                    res.result.authDt ? this.lcOpeningRequestCreateForm.patchValue({ agAuthorizationDate: new Date(res.result.authDt) })
                        : this.lcOpeningRequestCreateForm.get('agAuthorizationDate').patchValue('');


                    // this.lcOpeningRequestCreateForm.patchValue({ agAuthorizationDate: (res.result.authDt) ? res.result.authDt : '' });
                    this.majorHead_list = [];
                    this.majorHead_list.push({
                        name: res.result.majorHead,
                        codeName: res.result.majorHeadName
                    })
                    this.majorheadName = res.result.majorHeadName

                    console.log(this.majorHead_list)
                    this.lcOpeningRequestCreateForm.patchValue({ majorHead: this.majorHead_list[0] });

                    this.subMajorHead_list = [];
                    this.subMajorHead_list.push({
                        name: res.result.subMajor,
                        codeName: res.result.subMajorName
                    })
                    this.submajorheadName = res.result.subMajorName

                    console.log(this.subMajorHead_list)
                    this.lcOpeningRequestCreateForm.patchValue({ subMajorHead: this.subMajorHead_list[0] });

                    this.minorHead_list = [];
                    this.minorHead_list.push({
                        name: res.result.minorHead,
                        codeName: res.result.minorHeadName
                    })
                    this.minorHeadName = res.result.minorHeadName

                    console.log(this.minorHead_list)
                    this.lcOpeningRequestCreateForm.patchValue({ minorHead: this.minorHead_list[0] });

                    this.subHead_list = [];
                    this.subHead_list.push({
                        name: res.result.subHead,
                        codeName: res.result.subHeadName
                    })
                    this.subHeadName = res.result.subHeadName

                    console.log(this.subHead_list)
                    this.lcOpeningRequestCreateForm.patchValue({ subHead: this.subHead_list[0] });
                    this.detailedHead_list = [];
                    this.detailedHead_list.push({
                        name: res.result.detailHead,
                        codeName: res.result.detailHeadName
                    })
                    this.detailedHeadName = res.result.detailHeadName

                    console.log(this.detailedHead_list)
                    this.lcOpeningRequestCreateForm.patchValue({ detailedHead: this.detailedHead_list[0] });
                    this.BankName_list = [];
                    this.BankName_list.push({
                        name: res.result.bankName
                    })
                    console.log(this.BankName_list)
                    this.lcOpeningRequestCreateForm.patchValue({ bankName: this.BankName_list[0] });
                    this.BankBranch_list = [];
                    this.BankBranch_list.push({
                        name: res.result.branchName
                    })
                    console.log(this.BankBranch_list)
                    this.lcOpeningRequestCreateForm.patchValue({ bankBranch: this.BankBranch_list[0] });
                    this.lcOpeningRequestCreateForm.patchValue({ bankCode: res.result.branchCode });
                    this.lcOpeningRequestCreateForm.disable();

                    if (this.mode == 'edit' || this.mode == 'view') {
                        this.getEditViewData();
                    }


                }
            },
            err => {
                this.toastr.error(err);
            }
        );

    }


    /**
     * On click of edit from listing page
     */

    getEditViewData() {
        const param = {
            actionStatus: this.isEditable,
            hdrId: this.closeReqHdrId,
        }
        console.log(param)
        this.locService.getClosedSubmitActionDetails(param).subscribe((res: any) => {
            if (res && res.result && res.status === 200) {

                console.log(res.result)
                this.openhdrId = res.result.lcOpenRequestId;
                this.lcCloseReqSdId = res.result.closeRequestSdID;
                this.closeReqHdrId = res.result.closeRequestID;
                this.lcOpeningRequestCreateForm.patchValue({ officeName: res.result.officeName });
                this.lcOpeningRequestCreateForm.patchValue({ divisionOfficeAddress: res.result.officeAddress });
                this.lcOpeningRequestCreateForm.patchValue({ administrativeDepartment: res.result.departmentName });
                this.headOfDepartmentList = [];
                this.headOfDepartmentList.push({
                    name: res.result.hodOffice
                })
                console.log(this.headOfDepartmentList)
                this.lcOpeningRequestCreateForm.patchValue({ headOfDepartment: this.headOfDepartmentList[0] });
                this.lcOpeningRequestCreateForm.patchValue({ treasuryOffice: res.result.tooffice });
                this.lcOpeningRequestCreateForm.patchValue({ district: res.result.districtName });
                this.lcOpeningRequestCreateForm.patchValue({ cardexNo: res.result.cardexNo });
                this.lcOpeningRequestCreateForm.patchValue({ ddoCode: res.result.ddoNo });
                this.lcOpeningRequestCreateForm.patchValue({ divisionCode: res.result.divisionCode });
                this.lcOpeningRequestCreateForm.patchValue({ divisionName: res.result.divisionName });
                this.CircleNameList = [];
                this.CircleNameList.push({
                    name: res.result.circleName
                })
                console.log(this.CircleNameList)
                this.lcOpeningRequestCreateForm.patchValue({ circleName: this.CircleNameList[0] });
                this.lcOpeningRequestCreateForm.patchValue({ circleCode: res.result.circleCode });
                res.result.agAuthDt ? this.lcOpeningRequestCreateForm.patchValue({ agAuthorizationDate: new Date(res.result.agAuthDt) })
                    : this.lcOpeningRequestCreateForm.get('agAuthorizationDate').patchValue('');

                this.majorHead_list = [];
                this.majorHead_list.push({
                    name: res.result.majorhead,
                    codeName: res.result.majorheadName

                })
                this.majorheadName = res.result.majorheadName

                console.log(this.majorHead_list)
                this.lcOpeningRequestCreateForm.patchValue({ majorHead: this.majorHead_list[0] });

                this.subMajorHead_list = [];
                this.subMajorHead_list.push({
                    name: res.result.submajorhead,
                    codeName: res.result.submajorheadName

                })
                this.submajorheadName = res.result.submajorheadName

                console.log(this.subMajorHead_list)
                this.lcOpeningRequestCreateForm.patchValue({ subMajorHead: this.subMajorHead_list[0] });

                this.minorHead_list = [];
                this.minorHead_list.push({
                    name: res.result.minorHead,
                    codeName: res.result.minorHeadName

                })
                this.minorHeadName = res.result.minorHeadName

                console.log(this.minorHead_list)
                this.lcOpeningRequestCreateForm.patchValue({ minorHead: this.minorHead_list[0] });

                this.subHead_list = [];
                this.subHead_list.push({
                    name: res.result.subHead,
                    codeName: res.result.subHeadName

                })
                this.subHeadName = res.result.subHeadName

                console.log(this.subHead_list)
                this.lcOpeningRequestCreateForm.patchValue({ subHead: this.subHead_list[0] });
                this.detailedHead_list = [];
                this.detailedHead_list.push({
                    name: res.result.detailedHead,
                    codeName: res.result.detailedHeadName
                })
                this.detailedHeadName = res.result.detailedHeadName
                console.log(this.detailedHead_list)
                this.lcOpeningRequestCreateForm.patchValue({ detailedHead: this.detailedHead_list[0] });
                this.BankName_list = [];
                this.BankName_list.push({
                    name: res.result.bankName
                })
                console.log(this.BankName_list)
                this.lcOpeningRequestCreateForm.patchValue({ bankName: this.BankName_list[0] });
                this.BankBranch_list = [];
                this.BankBranch_list.push({
                    name: res.result.branchName
                })
                console.log(this.BankBranch_list)
                this.lcOpeningRequestCreateForm.patchValue({ bankBranch: this.BankBranch_list[0] });
                this.lcOpeningRequestCreateForm.patchValue({ bankCode: res.result.branchCode });

                this.divisionOfficeCreateForm.get('lcClosingDate').patchValue(new Date(res.result.lcclsoingDt));
                this.divisionOfficeCreateForm.patchValue({ lcRemarks: res.result.closureRemark });
                this.referenceDt = res.result.referenceDt,
                    this.referenceNo = res.result.referenceNo,
                    this.departmentId = res.result.departmentId,
                    this.cardexno = res.result.cardexNo,
                    this.ddoNo = res.result.ddoNo,
                    this.officeNameId = res.result.officeId;

                if (this.mode == 'view') {
                    this.lcOpeningRequestCreateForm.disable();
                    this.divisionOfficeCreateForm.disable();
                }
                else if (this.mode == 'edit') {
                    this.lcOpeningRequestCreateForm.disable();
                }

            }
        },
            err => {
                this.toastr.error(err);
            }
        );

    }

    /**
           * Call save api with submit request
           *
           * @memberof LcAccountClosingRequestCreateComponent
           */

    submit() {
        this.OnSaveAsDraft(FormActions.SUBMITTED);
    }


    /**
       * submit request
       *
       * @memberof LcAccountClosingRequestCreateComponent
       */
    openSaveAsDraftParams() {
        if (this.closeReqHdrId == undefined || NaN) {
            this.closeReqHdrId = null
        }

        if (this.lcCloseReqSdId == undefined || this.lcCloseReqSdId == NaN) {
            this.lcCloseReqSdId = null
        }

        if (this.referenceNo == undefined || this.referenceNo == NaN) {
            this.referenceNo = ""
        }


        if (this.referenceDt == undefined || this.referenceDt == NaN) {
            this.referenceDt = ""
        }

        const params = {

            lcOpenRequestId: this.openhdrId,
            lcCloseReqHdrId: this.closeReqHdrId,
            officeId: this.officeNameId,
            locAccountCloseReqSdDto: {
                lcCloseReqSdId: this.lcCloseReqSdId,
                referenceDt: this.referenceDt,
                referenceNo: this.referenceNo,
                approvalDt: this.datepipe.transform(this.divisionOfficeCreateForm.value.lcClosingDate, 'yyyy-MM-dd'),
                lcclosingDt: this.datepipe.transform(this.divisionOfficeCreateForm.value.lcClosingDate, 'yyyy-MM-dd'),
                closureRemark: this.divisionOfficeCreateForm.value.lcRemarks,
                agClosureRemark: this.divisionOfficeCreateForm.value.lcRemarks,
                lcOpenRequestId: this.openhdrId,
                lcCloseReqHdrId: this.closeReqHdrId,
                wfId: 1,
                wfRoleId: 1,
                statusId: 0


            },
            referenceDt: this.referenceDt,
            referenceNo: this.referenceNo,
            wfId: 1,
            wfRoleId: 1,
            statusId: 0,
            isEditable: null,
            approvalDt: null,
            lcclosingDt: null,
            closureRemark: null,
            agClosureRemark: null,
            wfUserReqSDDto: {
                branchId: null,
                menuId: this.linkMenuId,
                officeId: this.officeId,
                postId: this.postId,
                pouId: this.lkPoOffUserId,
                userId: this.userId,
                wfRoleIds: this.wfRoleIds


            }
        }
        return params

    }

    /**
           * Call save api with submit request
           *
           * @memberof LcAccountClosingRequestCreateComponent
           */
    OnSaveAsDraft(formAction: FormActions = FormActions.DRAFT) {
        var param = this.openSaveAsDraftParams();
        if (formAction === FormActions.DRAFT) {
            param.statusId = CONFIGURATION.DRAFT;
            param.locAccountCloseReqSdDto.statusId = CONFIGURATION.DRAFT;
        } else {
            param.statusId = CONFIGURATION.SUBMIT;
            param.locAccountCloseReqSdDto.statusId = CONFIGURATION.SUBMIT;
        }
        console.log(param)
        this.locService.getData(param, APIConst.LC_CLOSEREQUEST.SAVE_AS_DRAFT).subscribe(
            (res: any) => {
                console.log(res)
                if (res && res.result && res.status === 200) {
                    this.toastr.success(MESSAGES.DATA_SAVED_MESSAGE);
                    this.closeReqHdrId = res.result.lcCloseReqHdrId;
                    this.lcCloseReqSdId = res.result.locAccountCloseReqSdDto.lcCloseReqSdId
                    if (formAction === FormActions.SUBMITTED) {
                        this.openWfPopup();
                    }
                } else {
                    this.toastr.error(res['message']);
                }
            }, err => {
                this.toastr.error(err);
            })
    }



    /**
      * @description open work-flow popup
      */
    openWfPopup() {

        const passData = {
            hdrId: this.closeReqHdrId,
            actionStatus: 1
        };

        this.locService.getClosedSubmitActionDetails(passData).subscribe((res: any) => {
            const headerDetails = _.cloneDeep(res.result);
            const headerJson = [
                { label: 'Office Name', value: headerDetails.officeName },
                { label: 'Administrative Department', value: headerDetails.departmentName },
                { label: 'Head Of Department', value: headerDetails.hodOffice },
                { label: 'Treasury Office', value: headerDetails.tooffice },
                { label: 'District', value: headerDetails.districtName },
                { label: 'Cardex No', value: headerDetails.cardexNo },
                { label: 'DDO Code', value: headerDetails.ddoNo },
                { label: 'Division Code', value: headerDetails.divisionCode },
                { label: 'Division Name', value: headerDetails.divisionName },
                { label: 'Circle Code', value: headerDetails.circleCode },
                { label: 'Circle Name', value: headerDetails.circleName },

            ];
            const moduleInfo = {
                moduleName: ModuleNames.LetterOFCredit,
                tbudSceHdrId: 1,
                financialYearId: 1,
                trnRefNo: 1,
                departmentId: 1,
                estimationFrom: 1,
                demandId: 1,
                bpnI: 1,
                majorheadId: 1,
                isRevenueCapital: 1,
                submajorheadId: 1,
                minorheadId: 1,
                subheadId: 1,
                detailheadId: 1,
                isChargedVoted: 1,
                proposed_Amount: 1000,
                officeTypeId: 1,
                workflowId: 1,
                wfRoleId: 1,
                statusId: 1
            };
            const dialogRef = this.dialog.open(LcCommonWorkflowComponent, {
                width: '2700px',
                height: '600px',
                data: {
                    menuModuleName: 'loc',
                    headingName: 'LC Account Closing Request',
                    headerJson: headerJson,
                    trnId: this.closeReqHdrId,
                    moduleInfo: moduleInfo,
                    refNo: headerDetails.referenceNo ? headerDetails.referenceNo : '',
                    refDate: headerDetails.referenceDt ? headerDetails.referenceDt : '',
                    conditionUrl: 'loc/accCloseReq/2001',
                    isAttachmentTab: true, // for Attachment tab visible it should be true

                }
            });

            dialogRef.afterClosed().subscribe(wfData => {
                if (wfData.commonModelStatus === true) {
                    const popUpRes = wfData.data.result[0];
                    const paramsForWf = {
                        trnId: popUpRes.trnId,
                        wfId: popUpRes.wfId,
                        assignByWfRoleId: popUpRes.assignByWfRoleId,
                        trnStatus: popUpRes.trnStatus,
                        assignToWfRoleId: popUpRes.assignToWfRoleId,
                        assignByBranchId: popUpRes.assignByBranchId,
                        wfActionId: popUpRes.wfActionId,
                        assignByOfficeId: popUpRes.assignByOfficeId,
                        assignToOfficeId: popUpRes.assignToOfficeId,
                        assignToPouId: popUpRes.assignToPouId,
                        menuId: this.linkMenuId,

                    };

                    this.wfSubmitDetails(paramsForWf);
                    console.log(paramsForWf);
                }
            });
        });
    }

    /**
    * @description submit work-flow popup
    */
    wfSubmitDetails(params) {
        this.locService.locWFClosedSubmitDetails(params).subscribe(res => {
            if (res && res['status'] === 200) {
                if (!this.referenceNo) {

                    const passData = {
                        hdrId: this.closeReqHdrId,
                        actionStatus: 1
                    };
                    console.log(passData)
                    this.locService.getClosedSubmitActionDetails(passData).subscribe((resp: any) => {
                        if (resp && resp.status === 200) {
                            const headerDetails = _.cloneDeep(resp.result);

                            const dialogRef = this.dialog.open(OkDialogComponent, {
                                width: '360px',
                                data: MESSAGES.REF_NO + headerDetails.referenceNo
                            });
                            dialogRef.afterClosed().subscribe(() => {
                                this.gotoListing();
                            });
                        }
                    });
                } else {
                    this.gotoListing();
                }
            } else {
                this.toastr.error(res['message']);
            }
        });
    }

    /**
      * @description Go To Listing Page of LOC
      */
    gotoListing() {
        this.router.navigate(['/dashboard/lc/lc-closing-request-saved'], { skipLocationChange: true });
    }

    /*
    *
    *history View
    */
    historyDialogView(tabname) {
        this.tabNameHdrId = tabname + ":" + this.closeReqHdrId
        console.log(this.tabNameHdrId, 'tabname + hdr id')
        this.directiveObject.historyDialog(this.tabNameHdrId)
    }


    /**
     * Method Executed on change of Circle
     * */
    onCircle(event) {
        Object.keys(this.CircleNameList).forEach(key => {
            if (this.CircleNameList[key].value === event.value) {
                this.lcOpeningRequestCreateForm.patchValue({
                    circleCode: this.CircleNameList[key].code,
                });
            }
        });
    }
    /*
    Language Toggle
    */

    setEnglishOnFocusOut() {
        SetEnglish();
    }
    setLang() {
        if (this.currentLang === 'Guj') {
            SetEnglish();
        } else {
            SetGujarati();
        }
    }

    public toggleLanguage(): void {
        if (this.currentLang === 'Eng') {
            this.currentLang = 'Guj';
            return;
        }
        this.currentLang = 'Eng';
    }


    /**
          * @description Method to get CurrentUser Deatils.
          * @returns an object
          */

    getCurrentUserDetail() {
        this.commonWorkflowService.getCurrentUserDetail().then((res: any) => {
            if (res) {
                console.log(res);
                this.wfRoleIds = res.wfRoleId;
                this.wfRoleCode = res.wfRoleCode;
                this.linkMenuId = res.linkMenuId ? res.linkMenuId : this.menuId;
                this.postId = res.postId;
                this.userId = res.userId;
                this.lkPoOffUserId = res.lkPoOffUserId;
                this.officeId = res.officeDetail.officeId;


                this.getAttachmentList();

            }
        });
    }

    //#region common
    /**
         * @description Method to get attachment types.
         * @returns array object
         */
    getAttachmentList() {
        const param = {
            'categoryName': 'TRANSACTION',
            'menuId': this.linkMenuId,
        };
        this.commonWorkflowService.getAttachmentList(param).subscribe((res: any) => {
            if (res && res.status === 200 && res.result && (res.result.length > 0)) {
                this.attachmentTypeList = res['result'].filter(data => {
                    data.id = data['attTypeId'].id;
                    data.name = data['attTypeId'].name;
                    data.isMandatory = data['attTypeId'].isMandatory;
                    data.category = data['attTypeId'].category;
                    return data;
                });
                this.getUploadedAttachmentData();
            }
        }, (err) => {
            this.toastr.error(err);
        });
    }

    /**
      * @description Method to get user uploaded attachments.
      * @returns array object
      */
    getUploadedAttachmentData() {
        try {
            this.dataSourceBrowse = new MatTableDataSource([]);
            const param = {
                'categoryName': 'TRANSACTION',
                'menuId': this.linkMenuId,
                'trnId': this.closeReqHdrId,
                'lkPOUId': this.lkPoOffUserId
            };
            this.commonWorkflowService.getUploadedAttachmentList(param).subscribe((res: any) => {
                if (res && res.status === 200 && res.result) {
                    const resultObject = _.cloneDeep(res.result);
                    if (resultObject.length === 0) {
                        if (this.mode !== 'view') {
                            this.addNewFileRow();
                        }
                    } else {
                        let extension;
                        resultObject.filter(data => {
                            extension = data.uploadedFileName ? data.uploadedFileName.split('.').pop() : '';
                            if (this.constant.viewableExtension.indexOf(extension) !== -1) {
                                data.isView = true;
                            }
                            return data;
                        });
                        this.dataSourceBrowse.data = _.cloneDeep(resultObject);
                    }
                }
            },
                (err) => {
                    this.toastr.error(err);
                });
        } catch (error) {
            this.toastr.error(error);
        }
    }

    /**
     * @description Add row for adding attachment
     */
    addNewFileRow() {

        if (this.dataSourceBrowse && this.dataSourceBrowse.data.length > 0) {
            const data = this.dataSourceBrowse.data[this.dataSourceBrowse.data.length - 1];
            const getCurrentFileTypeInfo = this.getSelectedFileTypeData();
            if (data && data.attachmentTypeId && data.fileName && data.uploadedFileName) {
                const p_data = this.dataSourceBrowse.data;
                p_data.push({
                    attachmentId: 0,
                    attachmentTypeId: getCurrentFileTypeInfo.id,
                    attachmentTypeName: getCurrentFileTypeInfo.name,
                    file: '',
                    fileName: '',
                    uploadDirectoryPath: getCurrentFileTypeInfo.uploadDirectoryPath,
                    uploadedFileName: '',
                    fileSize: getCurrentFileTypeInfo.fileSize,
                    format: getCurrentFileTypeInfo.format,
                    menuId: getCurrentFileTypeInfo.menuId,
                    attCtegryId: getCurrentFileTypeInfo.attCtegryId,
                    userName: this.userName
                });

                this.dataSourceBrowse.data = p_data;
            } else {
                this.toastr.error(MESSAGES.ATTACHMENT.ERROR_FILL_ALL_DATA);
            }
        } else {
            const getCurrentFileTypeInfo = this.getSelectedFileTypeData();
            const tableData = [{
                attachmentId: 0,
                attachmentTypeId: getCurrentFileTypeInfo.id,
                attachmentTypeName: getCurrentFileTypeInfo.name,
                file: '',
                fileName: '',
                uploadDirectoryPath: getCurrentFileTypeInfo.uploadDirectoryPath,
                uploadedFileName: '',
                fileSize: getCurrentFileTypeInfo.fileSize,
                format: getCurrentFileTypeInfo.format,
                menuId: getCurrentFileTypeInfo.menuId,
                attCtegryId: getCurrentFileTypeInfo.attCtegryId,
                userName: this.userName
            }];
            this.dataSourceBrowse = new MatTableDataSource(tableData);
        }
    }

    /**
     * @description Get seleted attachment type
     */
    getSelectedFileTypeData(id?) {
        if (id) {
            return this.attachmentTypeList.find(ele => ele.id === id);
        } else {
            return this.attachmentTypeList[0] ? this.attachmentTypeList[0] : {};
        }
    }



    /**
    * @description Set the data on selection of file
    * @param object item
    * @param number index
    */
    onAttachmentTypeChange(item, index) {
        try {
            const getCurrentFileTypeInfo = this.getSelectedFileTypeData(item.attachmentId);
            this.dataSourceBrowse.data.forEach((data, indexTable) => {
                if (indexTable === index) {
                    data['fileName'] = '';
                    data['uploadDirectoryPath'] = getCurrentFileTypeInfo.uploadDirectoryPath;
                    data['fileSize'] = getCurrentFileTypeInfo.fileSize;
                    data['format'] = getCurrentFileTypeInfo.format;
                    data['menuId'] = getCurrentFileTypeInfo.menuId;
                    data['attCtegryId'] = getCurrentFileTypeInfo.attCtegryId;
                    data['file'] = null;
                    data['uploadedFileName'] = '';
                    data['fileExtension'] = '';
                    data['uploadedFileSize'] = 0;
                }
            });
        } catch (error) {
            this.toastr.error(error);
        }
    }

    /**
     * @description Check if it is mandatory to upload a file
     * @returns boolean flag
     */
    checkForMandatory() {
        let flag = true;
        this.dataSourceBrowse.data.forEach(obj => {
            if (obj.isMandatory === 'YES') {
                if (obj.id === 0) {
                    flag = false;
                }
            }
        });
        if (!flag) {
            this.toastr.error(MESSAGES.ATTACHMENT.PLEASE_ATTACH);
        }
        return flag;
    }

    /**
     * @description Save/Upload Attachment Details
     * @returns void
     */
    saveAttachmentTab() {
        let valid = true;
        const formData = new FormData();
        const filesArray = this.dataSourceBrowse.data.filter(item => item.attachmentId === 0 && item.file);
        if (filesArray.length === 0 && this.dataSourceBrowse.data.length !== 5) {
            this.toastr.error(MESSAGES.ATTACHMENT.ATLEAST_ONE_UPLOAD);
            valid = false;
        } else if (filesArray.length === 0 && this.dataSourceBrowse.data.length === 5) {
            this.toastr.error(MESSAGES.ATTACHMENT.ALREADY_UPLOADED);
            valid = false;
        } else {
            filesArray.forEach((element) => {
                if (!((element.file && element.file !== '') && (element.fileName && element.fileName !== '')
                    && element.attachmentTypeId)) {
                    valid = false;
                }
            });
            if (!valid) {
                this.toastr.error(MESSAGES.ATTACHMENT.ERROR_FILL_DATA);
            }
        }

        if (valid) {
            filesArray.forEach((element, index) => {
                const categoryInfo = this.attachmentTypeList.filter(ele => ele.id === element.attachmentTypeId)[0];
                formData.append('attachmentCommonDtoList[' + index + '].eventId', '');
                formData.append('attachmentCommonDtoList[' + index + '].uploadedFileSize', element.uploadedFileSize);
                formData.append('attachmentCommonDtoList[' + index + '].userName', this.userName);
                formData.append('attachmentCommonDtoList[' + index + '].attachmentTypeId', element.attachmentTypeId);
                formData.append('attachmentCommonDtoList[' + index + '].categoryId', categoryInfo.category);
                formData.append('attachmentCommonDtoList[' + index + '].fileName', element.fileName);
                formData.append('attachmentCommonDtoList[' + index + '].fileSize', element.fileSize);
                formData.append('attachmentCommonDtoList[' + index + '].format', element.fileExtension);
                formData.append('attachmentCommonDtoList[' + index + '].lkPOUId', this.lkPoOffUserId);
                formData.append('attachmentCommonDtoList[' + index + '].menuId', this.linkMenuId);
                formData.append('attachmentCommonDtoList[' + index + '].trnId', this.closeReqHdrId);
                formData.append('attachmentCommonDtoList[' + index + '].userId', this.userId);
                formData.append('attachmentCommonDtoList[' + index + '].uploadDirectoryPath',
                    element.uploadDirectoryPath);
                formData.append('attachmentCommonDtoList[' + index + '].attachment', element.file, element.file.name);
                formData.append('attachmentCommonDtoList[' + index + '].uploadedFileName', element.uploadedFileName);
            });
            this.commonWorkflowService.attachmentUpload(formData).subscribe((res: any) => {
                if (res && res.status === 200) {
                    this.toastr.success(MESSAGES.ATTACHMENT.UPLOAD_SUCCESS);
                    this.getUploadedAttachmentData();
                } else {
                    this.toastr.error(res.message);
                }
            },
                (err) => {
                    this.toastr.error(err);
                });
        }
    }

    /**
     * @description View Attachment
     * @param attachment  attachment
     */
    viewUploadedAttachment(attachment: any, event, isPreview = false) {
        try {
            const param = {
                'documentDataKey': attachment.documentId,
                'fileName': attachment.uploadedFileName
            };
            this.commonWorkflowService.viewAttachment(param).subscribe((res: any) => {
                if (res) {
                    const resultObj = res.result;
                    const imgNameArray = attachment.uploadedFileName.split('.');
                    const imgType = imgNameArray[imgNameArray.length - 1].trim();
                    let docType;
                    let isPdf = false;

                    switch (imgType) {
                        case 'pdf':
                            docType = 'application/pdf';
                            isPdf = true;
                            break;
                        case 'png':
                            docType = 'image/png';
                            break;

                        case 'jpg':
                            docType = 'image/jpg';
                            break;

                        case 'jpeg':
                        default:
                            docType = 'image/jpeg';
                            break;
                    }

                    if (isPreview === true) {
                        this.selectedFilePreviewImageBase64 = '';
                        this.selectedFilePreviewPdf = '';
                        const blobData = resultObj['fileSrc'] as string;
                        if (isPdf) {
                            this.selectedFilePreviewPdf = 'data:' + docType + ';base64,' + blobData;
                        } else {
                            this.selectedFilePreviewImageBase64 = 'data:' + docType + ';base64,' + blobData;
                        }
                        event.stopPropagation();
                    } else {
                        const byteArray = new Uint8Array(atob(resultObj['fileSrc']).split('').map(
                            char => char.charCodeAt(0)));
                        const blob = new Blob([byteArray], { type: docType });
                        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                            window.navigator.msSaveOrOpenBlob(blob, res['result']['fileName']);
                        } else {
                            const url = window.URL.createObjectURL(blob);
                            window.open(url, '_blank');
                        }
                    }

                }
            }, (err) => {
                this.toastr.error(err);
            });
        } catch (error) {
            this.toastr.error(error);
        }
    }

    /**
     * @description Download Attachment
     * @param params attachment details
     */
    downLoadUploadedAttachment(params) {
        try {
            const ID = {
                'documentDataKey': params.documentId,
                'fileName': params.uploadedFileName
            };
            this.commonWorkflowService.downloadAttachment(ID).subscribe((res: any) => {
                const url = window.URL.createObjectURL(res);
                const link = document.createElement('a');
                link.setAttribute('href', url);
                link.setAttribute('download', '' + params.uploadedFileName);
                document.body.appendChild(link);
                link.click();
                link.remove();
            },
                (err) => {
                    this.toastr.error(err);
                });
        } catch (error) {
            this.toastr.error(error);
        }
    }

    /**
     * @description Open file selector
     */
    openFileSelector(index: number) {
        this.el.nativeElement.querySelector('#fileBrowse').click();
        this.fileBrowseIndex = index;
    }

    /**
     * @description Validate File on file selection
     * @param fileSelected selected file
     */
    onFileSelection(fileSelected: any) {
        let valid = true;
        const fileExtension = fileSelected.target.files[0].name.split('.').pop().toLowerCase();
        const fileSizeInKb = fileSelected.target.files[0].size / Math.pow(1024, 1);
        const fileSupportedExtension = this.dataSourceBrowse.data[this.fileBrowseIndex].format;
        const extensionArray = fileSupportedExtension.split(',');
        if (fileSelected.target.files[0].size > EdpDataConst.MAX_FILE_SIZE_FOR_COMMON * 1024) {
            valid = false;
            // const sizeInMB = BudgetConst.MAX_FILE_SIZE_FOR_COMMON / 1024;
            this.toastr.error(MESSAGES.ATTACHMENT.ERROR_FILE_SIZE);
        } else if (extensionArray.indexOf(fileExtension) < 0) {
            valid = false;
            this.toastr.error(MESSAGES.ATTACHMENT.ERROR_EXTENSION + extensionArray);
        }
        if (valid) {
            this.totalAttachmentSize += fileSizeInKb;
            this.dataSourceBrowse.data[this.fileBrowseIndex].file = fileSelected.target.files[0];
            this.dataSourceBrowse.data[this.fileBrowseIndex].uploadedFileName = fileSelected.target.files[0].name;
            this.dataSourceBrowse.data[this.fileBrowseIndex].fileExtension = fileExtension.toLowerCase();
            this.dataSourceBrowse.data[this.fileBrowseIndex].uploadedFileSize = fileSizeInKb;
        }
        this.attachment.nativeElement.value = '';
    }

    /**
     * @description This method remove the attached file from data table.
     * @param item Array from which index is to be found
     * @param index key based on which index is to be found
     */
    removeUploadUserFile(item, index) {
        this.dataSourceBrowse.data.forEach((data, indexTable) => {
            if (indexTable === index) {
                data['file'] = null;
                data['uploadedFileName'] = '';
                data['fileExtension'] = '';
                data['uploadedFileSize'] = 0;
            }
        });
    }

    /**
     * @description Method to find array index
     * @param itemArray Array from which index is to be found
     * @param keyName key based on which index is to be found
     * @param selectedValue selected value based on which index is to be found
     * @returns array object
     */
    deleteUploadedAttachment(item, index) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '360px',
            data: MESSAGES.ATTACHMENT.DELETE_FILE
        });
        dialogRef.afterClosed().subscribe(confirmationResult => {
            if (confirmationResult === 'yes') {

                if (item && item.uploadedFileName && item.uploadedDate && item.attachmentId) {
                    const param = {
                        'attachmentId': item.attachmentId,
                        'menuId': this.linkMenuId
                    };
                    this.commonWorkflowService.attachmentDelete(param).subscribe((res: any) => {
                        if (res && res.status === 200 && res.result === true) {
                            this.toastr.success(res.message);
                            this.dataSourceBrowse.data.splice(index, 1);
                            this.dataSourceBrowse = new MatTableDataSource(this.dataSourceBrowse.data);
                            if (this.dataSourceBrowse.data.length === 0) {
                                this.getUploadedAttachmentData();
                            }
                        }
                    },
                        (err) => {
                            this.toastr.error(err);
                        });
                } else {
                    this.dataSourceBrowse.data.splice(index, 1);
                    this.dataSourceBrowse = new MatTableDataSource(this.dataSourceBrowse.data);
                }
            }
        });
    }
    //#endregion

}
