import { Component, OnInit, Inject, ElementRef, ViewChild, Input, Directive } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
// import { lcMessage } from 'src/app/common/error-message/common-message.constants';
import { ListValue, LcdistributionInput } from './../../model/letter-of-credit';
import { LetterOfCreditDirectives } from './../../directive/letter-of-credit-directive';
import { BehaviorSubject, Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { StorageService } from 'src/app/shared/services/storage.service';
import { APIConst } from 'src/app/shared/constants/letter-of-credit/letter-of-credit-api.constants';
import { EdpDdoOfficeService } from '../../../edp/services/edp-ddo-office.service';
import { LetterOfCreditService } from '../../service/letter-of-credit.service';
import { CommonWorkflowService } from '../../../common/workflow-service/common-workflow.service';
import { element } from 'protractor';
import { LcCommonWorkflowComponent } from '../../lc-common-workflow/lc-common-workflow.component';
import { OkDialogComponent } from 'src/app/shared/components/ok-dialog/ok-dialog.component';
import { MESSAGES, lcMessage } from 'src/app/shared/constants/letter-of-credit/message-constants';
import { DatePipe } from '@angular/common';
import * as _ from 'lodash';
import { ModuleNames } from '../../../common/constant/common-workflow.constants';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { EdpDataConst } from 'src/app/shared/constants/edp/edp-data.constants';

declare function SetGujarati();
declare function SetEnglish();


@Component({
  selector: 'app-lc-verification-to-edit',
  templateUrl: './lc-verification-to-edit.component.html',
  styleUrls: ['./lc-verification-to-edit.component.css']
})
// @Directive({
//   selector: '[appHandleGujaratiLangChange]'
// })

export class LcVerificationToEditComponent implements OnInit {


  /**
  * Configuration for this file
  *
  *
  * @memberOf LcVerificationToEditComponent
  */
  // List of entry Type
  EntryTypeList: any[] = [

  ];

  // List of Fund Type
  FundTypeList: ListValue[] = [

  ];

  // List of Budget Type
  BudgetTypeList: ListValue[] = [

  ];

  // List of Head Code
  HeadCodeList: ListValue[] = [
  ];
  // List of Attachments
  attachmentTypeCode: any[] = [

  ];
  finYear_list: any[] = [
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

  selectedFilePreviewPdf: string;
  selectedFilePreviewImageBase64: string;
  selectedFileBase64: string;
  dData: any;
  showWorkFlowAction: boolean = true;
  maxAttachment: number;
  constant = EdpDataConst;
  isEditable: any;
  totalAttachmentSize: number;
  fileBrowseIndex: number;
  fileName: any;
  StateTotalValue:number=0;
  cssTotalValue:number=0;

  @Input() isView: boolean;
  @Input() isEdit: boolean;


  // Table Data for LC Distribution
  LcdistributionInputDATA: LcdistributionInput[] = [];

  // Table Columns for LC Distribution Table
  LcdistributionInputDATAColumn: string[] = [
    'srno', 'fundType', 'classOfExpenditure', 'budgetType',
    'demandNo', 'majorHead', 'subMajorHead', 'minorHead',
    'subHead', 'detailHead', 'TypeOfEstimate', 'itemName', 'objectHead',
    'schemeNo', 'StateAmount','CSSAmount'
  ];
  currentLang: string = 'Eng';
  workFlowData = 'fromLCVerificationToEdit';
  // currentLang = 'Guj';
  divisionNameTooltip = '';
  circleNameTooltip = '';
  todayDate = Date.now();
  errorRemarks = false;
  isSearch: boolean;
  lcDistributionInputForm: FormGroup;
  errors = lcMessage;
  subscribeParams: Subscription;
  mode: any;
  action: any;
  status: any;
  hdrId: any;
  disableTabs: boolean;
  currentUserData: any;
  userPostList: any;
  refDate: any;
  refNo: any;
  ddoNo: any;
  cardexNo: any;
  circleId: any;
  wfRoleIds: any;
  wfRoleCode: any;
  linkMenuId: any;
  menuId: any = 659;
  postId: any;
  userId: any;
  lkPoOffUserId: any;
  officeId: any;
  divId: any;
  gStatus: any;
  grantId: any;
  grantOrderDate: any;
  id: any;
  raiseObjFlag: any;
  statusDesc: any;
  officeNameId: any;
  saveResult: any;
  editSaveResult: any;
  attachmentTypeList: any[] = [];
  userName: string;
  selectedTabIndex: number;
  viewableExtension = ['pdf', 'jpg', 'jpeg', 'png'];
  popupresult: any;
  submitactions: boolean = true;
  /**
    * Mat table instance
    *
    * @type {MatTableDataSource<any>}
    * @memberOf LcVerificationToEditComponent
    */

  dataSourceBrowse = new MatTableDataSource([]);
  LcdistributionInputDataSource = new MatTableDataSource<any>([]);

  /**
  * Form Group Instance
  *
  * @type {FormGroup}
  * @memberOf LcVerificationToEditComponent
  */

  EntryTypeCtrl: FormControl = new FormControl();
  FundTypeCtrl: FormControl = new FormControl();
  BudgetTypeCtrl: FormControl = new FormControl();
  HeadCodeCtrl: FormControl = new FormControl();
  finYearCtrl: FormControl = new FormControl();
  attachmentTypeCodeCtrl: FormControl = new FormControl();

  /**
    * attachment
    *
    * @type {attachment}
    * @memberOf LcVerificationToEditComponent
    */

  @ViewChild('attachment', { static: true }) attachment: ElementRef;
  balanceAmt: number = 0;
  newBalanceLcAmount: number = 0;
  balanceLcAmount: number = 0;


  /**
    * Creates an instance of LcVerificationToEditComponent.
    * @param {FormBuilder} fb
    * @param {LetterOfCreditService} locService
    * @param {StorageService} storageService
    * @param {CommonWorkflowService} commonWorkflowService
    * @param {ToastrService} toastr
    * @param {MatDialog} dialog
    * @param {Router} router
    * @param {ActivatedRoute} activatedRoute
    *
    * @memberOf LcVerificationToEditComponent
    */

  constructor(private fb: FormBuilder, private el: ElementRef, private toastr: ToastrService,
    private storageService: StorageService, private activatedRoute: ActivatedRoute,
    private edpDdoOfficeService: EdpDdoOfficeService, private locService: LetterOfCreditService,
    private commonWorkflowService: CommonWorkflowService,
    public dialog: MatDialog, private router: Router, public datepipe: DatePipe) { }


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
   * @memberOf LcVerificationToEditComponent
   */

  ngOnInit() {
    this.maxAttachment = this.constant.MAX_ATTACHMENT;
    this.currentUserData = this.storageService.get('currentUser');
    this.userName = this.storageService.get('userName');
    this.userPostList = this.currentUserData['post'];
    this.userPostList = this.userPostList.filter(row => row.loginPost == true)
    const userPostList = _.head(this.userPostList)
    this.officeNameId = userPostList['oauthTokenPostDTO']['edpMsOfficeDto'].officeId;
    console.log(this.currentUserData, "currentUserDataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
    console.log(this.userPostList)
    this.subscribeParams = this.activatedRoute.params.subscribe(resRoute => {
      this.mode = resRoute.mode;
      this.action = resRoute.mode;
      this.hdrId = resRoute.id;
      this.isEditable = resRoute.isEditable
      this.refNo = resRoute.refNo,
        this.refDate = resRoute.refDate
    })
    if (this.hdrId == undefined || this.hdrId == null || this.hdrId == 'NaN') {
      this.disableTabs = true;
    }
    if(this.refNo== null || this.refNo ==undefined || this.refNo== 'null')
    this.refNo='';
    if(this.refDate== null || this.refDate ==undefined || this.refDate== 'null')
    this.refDate='';

    this.getCurrentUserDetail()
    this.editView()
    this.lcDistributionInputFormData();

  }

  /***********************Life cycle hooks methods end***********************************/

  /***********************Public methods start***********************************/

  /**
   * Get tab Index
   * 
   * @param $event 
   * 
   */
  getTabIndex($event) {
    console.log($event.index)
    if ($event.index == 0) {
      this.submitactions = true
    }
    else {
      this.submitactions = false

    }
  }

  /**
     * Initialize formgroup
     *
     *
     * @memberOf LcVerificationToEditComponent
     */

  lcDistributionInputFormData() {
    this.lcDistributionInputForm = this.fb.group({
      lcNumber: [''],
      divisionCode: [''],
      divisionName: [''],
      lcIssueDate: [''],
      entryType: [''],
      lcValidFrom: [{ value: '', disabled: true }],
      lcValidTo: [''],
      inwardNo: [''],
      inwardDate: [''],
      circleCode: [''],
      circleCodeDescription: [''],
      partyReferenceNumber: [''],
      partyReferenceDate: [''],
      grantOrderNumber: [''],
      grantOrderDate: [''],
      newBalanceLcAmount: [''],
      balanceLcAmount: [''],
      progressiveLcAmount: [''],
      fundType: [''],
      headCode: [''],
      budgetType: [''],
      demandNo: [''],
      majorHead: [''],
      subMajorHead: [''],
      minorHead: [''],
      subHead: [''],
      schemeNo: [''],
      amount: [''],
      raiseObjectionCheckbox: [''],
      objectionRemarks: [''],
      finYear: ['']
    });
    this.lcDistributionInputForm.get('inwardDate').patchValue('');
    this.lcDistributionInputForm.get('partyReferenceDate').patchValue('');


    if (this.mode == 'view') {
      this.lcDistributionInputForm.disable();
      this.lcDistributionInputForm.get('inwardDate').setValue({ disabled: true })

    }

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
        this.menuId = res.menuId;
        this.linkMenuId = res.linkMenuId !== undefined ? res.linkMenuId : this.menuId;
        this.postId = res.postId;
        this.userId = res.userId;
        this.lkPoOffUserId = res.lkPoOffUserId;
        this.officeId = res.officeDetail.officeId;

        this.getAttachmentList();


      }
      console.log(this.linkMenuId, "linkMenuIdddddddddddddddddddddddddddddddd");

    });
  }

  /**
   * Amount Calculation
   * 
   * @returns total
   */
  totalAmount(amount) {

    let total: number = 0;
    this.LcdistributionInputDataSource.data.forEach(element => {
      total = total + element[amount]
    })
    if(amount=='stateAmount'){
        this.StateTotalValue =  total
    }
    else{
      this.cssTotalValue=total 
    }
    return total;
  }


  /**
    * @description request params for Distribution Detail Dto
    */


  distributionDtlDto() {
    const distributionDtlDto: any[] = [];
    this.LcdistributionInputDataSource.data.forEach((record: any) => {
      distributionDtlDto.push({
        amount:
          record.amount,
        budgetType:
          record.budgetType,
        classExpend:
          record.classExpend,
        curMenuId: 0,
        demandId:
          record.demandId,
        detailedHeadId:
          record.detailedHeadId,
        fundType:
          record.fundType,
        hdrId:
          record.hdrId,
        id:
          record.id,
        itemWorkName:
          record.itemWorkNameId,
        majorHeadId:
          record.majorHeadId,
        minorHeadId:
          record.minorHeadId,
        objectClass:
          record.objectClassId,
        schemeNo:
          record.schemeNo,
        statusId:
          record.statusId,
        subMajorHeadId:
          record.subMajorHeadId,
        typeOfEstimate:
          record.typeOfEstimate,
      })
    })
  }


  /**
    * @description on Click of Submit
    */


  submit() {
    this.openWfPopup()
  }


  /**
    * @description request params for SaveData
    */


  saveDataDto() {
    const param =
    {
      hdrId: this.hdrId,
      inwardDate: this.datepipe.transform(this.lcDistributionInputForm.value.inwardDate, 'yyyy-MM-dd'),
      inwardNo: this.lcDistributionInputForm.value.inwardNo,
      objRemarks: null,
      partyRefNo: this.lcDistributionInputForm.value.partyReferenceNumber,
      partyRefDate: this.datepipe.transform(this.lcDistributionInputForm.value.partyReferenceDate, 'yyyy-MM-dd'),
      raiseObjFlag: 'N',
      status: '',
      newBalAmt: 0,
      trnStatus: '',
      assignToWfRoleId: 0,
      assignByBranchId: 0,
      wfActionId: 0,
      assignByOfficeId: 0,
      assignToOfficeId: 0,
      assignToPouId: 0,
      menuId: this.linkMenuId,
      refNo:this.refNo,
     refDate:this.refDate,

      wfuserReqDto: {
        branchId: null,
        menuId: 226,
        officeId: this.officeId,
        postId: this.postId,
        pouId: this.lkPoOffUserId,
        trnId: this.hdrId,
        userId: this.userId,
        wfRoleIds: this.wfRoleIds
      }


    }
    if (this.lcDistributionInputForm.value.objectionRemarks && this.errorRemarks) {
      param.objRemarks = this.lcDistributionInputForm.value.objectionRemarks,
        param.raiseObjFlag = "Y"
    }
    return param

  }

  /**
    * @description open work-flow popup
    */


  openWfPopup() {

    const headerJson = [
      { label: 'LC Number', value: this.editSaveResult.lcNo },
      { label: 'Division code', value: this.editSaveResult.divCode },
      { label: 'Division Name', value: this.editSaveResult.divName },
      { label: 'LC Issue Date', value: this.datepipe.transform(this.editSaveResult.lcIssueDate, 'dd-MMM-yyyy') },
      { label: 'Entry Type', value: this.editSaveResult.entryType },
      { label: 'LC Valid From', value: this.datepipe.transform(this.editSaveResult.lcValidFrom, 'dd-MMM-yyyy') },
      { label: 'LC Valid Upto', value: this.datepipe.transform(this.editSaveResult.lcValidTo, 'dd-MMM-yyyy') },
      { label: 'circle code', value: this.editSaveResult.circleCode },
      { label: 'circle Name', value: this.editSaveResult.circleName },
      { label: 'Grant order Number', value: this.editSaveResult.grantOrderNo },
      { label: 'Grant Order Date', value: this.datepipe.transform(this.editSaveResult.grantOrderDate, 'dd-MMM-yyyy') },
      { label: 'Balance LC Amount', value: this.editSaveResult.balanceLcAmt.toFixed(2) },
      { label: 'New Balance LC Amount', value: this.editSaveResult.newBalanceLcAmt.toFixed(2) },

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
        headingName: 'LC Distribution',
        headerJson: headerJson,
        trnId: this.hdrId,
        moduleInfo: moduleInfo,
        refNo: this.refNo,
        refDate: this.refDate,
        conditionUrl: '',
        isAttachmentTab: true, // for Attachment tab visible it should be true

      }
    });
    dialogRef.afterClosed().subscribe(wfData => {
      if (wfData.commonModelStatus === true) {
        const popUpRes = wfData.data.result[0];
        console.log(popUpRes, 'for action in wf result')
        const paramsForWf = {
          trnId: popUpRes.trnId,
          wfId: popUpRes.wfId,
          status: popUpRes.trnStatus,
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
  }

  /**
    * @description submit work-flow popup
    */


  wfSubmitDetails(params) {
    const param = this.saveDataDto()
    param.status = params.status,
      param.trnStatus = params.trnStatus,
      param.assignToWfRoleId = params.assignToWfRoleId,
      param.assignByBranchId = params.assignByBranchId,
      param.wfActionId = params.wfActionId,
      param.assignByOfficeId = params.assignByOfficeId,
      param.assignToOfficeId = params.assignToOfficeId,
      param.assignToPouId = params.assignToPouId,
      param.newBalAmt = this.newBalanceLcAmount
    this.locService.getData(param, APIConst.LC_DISTRIBUTION.DISTRIBUTION_SUBMIT).subscribe((res: any) => {
      console.log(res, 'save result')
      if (res && res.status === 200) {
        this.toastr.success(MESSAGES.DATA_SAVED_MESSAGE);
        this.popupresult = res.result
        if (this.action == 'consolidate') {

          const dialogRef = this.dialog.open(OkDialogComponent, {
            width: '360px',
            data: MESSAGES.REF_NO + this.popupresult.refNo
          });
          dialogRef.afterClosed().subscribe(() => {
            this.gotoListing();
          });

        } else {
          this.gotoListing();
        }
      } else {
        this.toastr.error(res.message);
      }
    });
  }


  /**
      * @description Go To Listing Page of LOC
      */

  gotoListing() {
    this.router.navigate(['/dashboard/lc/lc-distribution-circle'], { skipLocationChange: true });
  }

  /**
   * @description updating remarks for objection checkbox
   * 
   */
  updateRemarks() {
    console.log(this.lcDistributionInputForm.value.raiseObjectionCheckbox)
    if (this.lcDistributionInputForm.controls['raiseObjectionCheckbox'].value) {
      this.errorRemarks = true;
    } else {
      this.errorRemarks = false;
    }
  }

  /**
   *  @description toggle the edit tabs
   * 
   * @param event 
   * 
   */
  toggleEditable(event) {
    console.log(event.checked)

    if (event.checked) {
      this.lcDistributionInputForm.get('objectionRemarks').setValidators(Validators.required)
      this.lcDistributionInputForm.get('objectionRemarks').updateValueAndValidity();

      this.errorRemarks = true;
    }
    else {
      this.lcDistributionInputForm.get('objectionRemarks').clearValidators()
      this.lcDistributionInputForm.get('objectionRemarks').updateValueAndValidity();

      this.errorRemarks = false
    }
  }

  /**
   * On click of edit from listing page
   */


  editView() {
    const params = {
      id: this.hdrId
    }
    this.locService.getData(params, APIConst.LC_DISTRIBUTION.GET_EDIT_VIEW_DETAILS).subscribe(
      (res: any) => {
        this.editSaveResult = res.result
        console.log(res)
        this.cardexNo = res.result.cardexNo
        this.ddoNo = res.result.ddoNo
        this.circleId = res.result.circleId
        this.divId = res.result.divId
        this.officeNameId = res.result.officeId
        this.gStatus = res.result.gStatus
        this.grantId = res.result.grantId
        this.grantOrderDate = res.result.grantOrderDate
        this.id = res.result.id
        this.raiseObjFlag = res.result.raiseObjFlag
        this.statusDesc = res.result.statusDesc

        this.EntryTypeList.push(
          { value: res.result.entryType, viewValue: res.result.entryType },
        )
        this.finYear_list.push(
          { value: res.result.finYear, viewValue: res.result.finYear }
        )
        this.lcDistributionInputForm.get('finYear').setValue(this.finYear_list[0].value)

        this.lcDistributionInputForm.get('entryType').setValue(this.EntryTypeList[0].value)
        this.lcDistributionInputForm.patchValue({ lcNumber: res.result.lcNo });
        this.lcDistributionInputForm.patchValue({ divisionCode: res.result.divCode });
        this.lcDistributionInputForm.patchValue({ divisionName: res.result.divName });
        this.lcDistributionInputForm.patchValue({ lcIssueDate: new Date(res.result.lcIssueDate) });

        // this.lcDistributionInputForm.patchValue({ entryType: res['result']['entryType'] });
        this.lcDistributionInputForm.patchValue({ lcValidFrom: new Date(res.result.lcValidFrom) });
        this.lcDistributionInputForm.patchValue({ lcValidTo: new Date(res.result.lcValidTo) });
        this.lcDistributionInputForm.patchValue({ inwardNo: res.result.inwardNo });
        // this.lcDistributionInputForm.patchValue({ inwardDate: new Date(res.result.inwardDate) });
        res.result.inwardDate ? this.lcDistributionInputForm.patchValue({ inwardDate: new Date(res.result.inwardDate) })
          : this.lcDistributionInputForm.get('inwardDate').patchValue('');

        this.lcDistributionInputForm.patchValue({ circleCode: res.result.circleCode });
        this.lcDistributionInputForm.patchValue({ circleCodeDescription: res.result.circleName });
        this.lcDistributionInputForm.patchValue({ partyReferenceNumber: res.result.partyRefNo });
        // this.lcDistributionInputForm.patchValue({ partyReferenceDate: new Date(res.result.partyRefDate) });

        res.result.partyRefDate ? this.lcDistributionInputForm.patchValue({ partyReferenceDate: new Date(res.result.partyRefDate) })
          : this.lcDistributionInputForm.get('partyReferenceDate').patchValue('');

        this.lcDistributionInputForm.patchValue({ grantOrderNumber: res.result.grantOrderNo });
        this.lcDistributionInputForm.patchValue({ grantOrderDate: new Date(res.result.grantOrderDate) });
        this.lcDistributionInputForm.patchValue({ newBalanceLcAmount: res.result.newBalanceLcAmt.toFixed(2) });
        this.lcDistributionInputForm.patchValue({ balanceLcAmount: res.result.balanceLcAmt.toFixed(2) });
        this.lcDistributionInputForm.patchValue({ objectionRemarks: res.result.objRemarks });
        this.newBalanceLcAmount =Number( this.lcDistributionInputForm.value.newBalanceLcAmount)
        this.balanceLcAmount = Number(this.lcDistributionInputForm.value.balanceLcAmount)
        this.balanceAmt = this.balanceLcAmount + this.newBalanceLcAmount
        if (res.result.objRemarks != '' && res.result.objRemarks != null && res.result.objRemarks != NaN &&
          res.result.objRemarks != undefined) {
          this.lcDistributionInputForm.value.raiseObjectionCheckbox = true;
          this.lcDistributionInputForm.patchValue({ raiseObjectionCheckbox: true });
          this.errorRemarks = true;
        }
        else
          this.errorRemarks = false;

        this.LcdistributionInputDataSource = new MatTableDataSource<any>(res.result.distributionDtlDto);


      })

  }
  // ----------------Toggle Eng Guj---------------------
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
        * @description Method to get attachment types.
        * @returns array object
        */
  getAttachmentList() {
    const param = {
      'categoryName': 'TRANSACTION',
      'menuId': this.linkMenuId,
    };
    this.commonWorkflowService.getAttachmentList(param).subscribe((res) => {
      if (res && res['status'] === 200 && res['result'] && (res['result'].length > 0)) {
        this.attachmentTypeList = res['result'].filter(data => {
          data.id = data['attTypeId'].id;
          data.name = data['attTypeId'].name;
          data.isMandatory = data['attTypeId'].isMandatory;
          data.category = data['attTypeId'].category;
          return data;
        });
        console.log(this.attachmentTypeList, "hdgjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj");

        // this.attachmentTypeList.push(this.attachmentTypeList[0])
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
        'trnId': this.hdrId,
        'lkPOUId': this.lkPoOffUserId
      };
      this.commonWorkflowService.getUploadedAttachmentList(param).subscribe((res) => {
        if (res && res['status'] === 200 && res['result']) {
          const resultObject = _.cloneDeep(res['result']);
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
        formData.append('attachmentCommonDtoList[' + index + '].trnId', this.hdrId);
        formData.append('attachmentCommonDtoList[' + index + '].userId', this.userId);
        formData.append('attachmentCommonDtoList[' + index + '].uploadDirectoryPath',
          element.uploadDirectoryPath);
        formData.append('attachmentCommonDtoList[' + index + '].attachment', element.file, element.file.name);
        formData.append('attachmentCommonDtoList[' + index + '].uploadedFileName', element.uploadedFileName);
      });
      this.commonWorkflowService.attachmentUpload(formData).subscribe((res) => {
        if (res && res['status'] === 200) {
          this.toastr.success(MESSAGES.ATTACHMENT.UPLOAD_SUCCESS);
          this.getUploadedAttachmentData();
        } else {
          this.toastr.error(res['message']);
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
          const resultObj = res['result'];
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
      this.commonWorkflowService.downloadAttachment(ID).subscribe((res) => {
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
          this.commonWorkflowService.attachmentDelete(param).subscribe((res) => {
            if (res && res['status'] === 200 && res['result'] === true) {
              this.toastr.success(res['message']);
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


  // ---------------------------------------------------
}
