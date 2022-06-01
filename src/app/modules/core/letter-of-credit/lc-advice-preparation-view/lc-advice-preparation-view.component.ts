import { LetterOfCreditDirectives } from './../directive/letter-of-credit-directive';
import { Component, OnInit, ViewChild, ElementRef, Directive } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { MESSAGES, lcMessage } from 'src/app/shared/constants/letter-of-credit/message-constants';
import { ListValue, AdviceReceipt, LcAdviceReceiptEPayment, DeductionView } from './../model/letter-of-credit';
import { MapEPaymentComponent, LcNumberDialogComponent } from '../lc-advice-received/lc-advice-received.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { StorageService } from 'src/app/shared/services/storage.service';
import { EdpDdoOfficeService } from '../../edp/services/edp-ddo-office.service';
import { LetterOfCreditService } from '../service/letter-of-credit.service';
import { CommonWorkflowService } from '../../common/workflow-service/common-workflow.service';
import { Subscription } from 'rxjs';
import { APIConst } from 'src/app/shared/constants/letter-of-credit/letter-of-credit-api.constants';
import { LcCommonWorkflowComponent } from '../lc-common-workflow/lc-common-workflow.component';
import { ModuleNames } from '../../common/constant/common-workflow.constants';
import { DatePipe } from '@angular/common';
import * as _ from 'lodash';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { NumberToWordsPipe } from 'src/app/common/pipes/number-to-words.pipe';
import { EdpDataConst } from 'src/app/shared/constants/edp/edp-data.constants';

declare function SetGujarati();
declare function SetEnglish();

@Component({
  selector: 'app-lc-advice-preparation-view',
  templateUrl: './lc-advice-preparation-view.component.html',
  styleUrls: ['./lc-advice-preparation-view.component.css']
})
// @Directive({
//   selector: '[appHandleGujaratiLangChange]'
// })

export class LcAdvicePreparationViewComponent implements OnInit {

  todayDate = new Date();

  // List of Month
  MonthList: ListValue[] = [
    { value: '1', viewValue: 'January' },
    { value: '2', viewValue: 'February' },
    { value: '3', viewValue: 'March' },
    { value: '4', viewValue: 'April' },
    { value: '5', viewValue: 'May' },
    { value: '6', viewValue: 'June' },
    { value: '7', viewValue: 'July' },
    { value: '8', viewValue: 'August' },
    { value: '9', viewValue: 'Sepetember' },
    { value: '10', viewValue: 'October' },
    { value: '11', viewValue: 'November' },
    { value: '12', viewValue: 'December' }
  ];

  // List of Payment Type
  PaymentTypeList: any[] = [

  ];

  // Table data for Advice Receipt Table
  LcAdviceReceiptDATA: AdviceReceipt[] = [

  ];

  // Table Column for Advice Receipt Table
  LcAdviceReceiptDATAColumn: string[] = [
    'chequeDate', 'chequeNo', 'partyName', 'chequeAmount'
  ];

  // Table Data for Advice Receipt ePayment Table
  LcAdviceReceiptEPaymentDATA: LcAdviceReceiptEPayment[] = [

  ];

  // Table Column for Advice Receipt ePayment Table
  LcAdviceReceiptEPaymentDATAColumn: string[] = [
    'partyName', 'bankAccountNumber', 'IFSCCode', 'epaymentAmount'
  ];

  // List of Advices
  AdviceTypeList: any[] = [ ];

  // List of Exemptions
  ExemptionTypeList: ListValue[] = [
    { value: '1', viewValue: 'Exempted' },
    { value: '2', viewValue: 'Non-Exempted' }
  ];

  // List of Attachments
  attachmentTypeCode: any[] = [
    { type: 'stamp-view', attachmentType: 'Supporting Document' },
  ];

  // Table Columns for Detail Posting Table
  DetailPostingColumn: string[] = [
    'fund',
    'classOfExpenditure',
    'budgetType',
    'demandNo',
    'majorHead',
    'subMajorHead',
    'minorHead',
    'subHead',
    'detailClass',
    'typeOfEstimation',
    'itemName',
    'objectClass',
    'schemeNo',
    'mapEpayment',
    'expenditureAmount',
    'headwiseAvailableAmount',
    'lcNumber'
  ];

  // List of Numbers
  LcNumberList: ListValue[] = [
    { value: '', viewValue: '' },
  ];

  // Table data for Deduction table
  DeductionData: DeductionView[] = [

  ];

  // Table Columns for Deduction Table
  DeductionDataColumn: string[] = [
    'professionlTax', 'laborClass', 'forAllMH', 'incomeTax', 'surcharge', 'gpfClassIV', 'cpf',
    'rentOfBldg', 'govtInsuranceFund', 'insuranceFund',
    'securityDeposit', 'establishmentCharges', 'machinaryCharges'
  ];

  // List of Cheyque type
  checkType: ListValue[] = [
    { value: '1', viewValue: 'Beneficiary' },
    { value: '2', viewValue: 'Contractor' },
    { value: '3', viewValue: 'Grant In Aid' },
    { value: '4', viewValue: 'GST TDS' },
    { value: '5', viewValue: 'Scholarship' },
    { value: '6', viewValue: 'Service Provider' },
    { value: '7', viewValue: 'Supplier' },
  ];
  currentLang = 'Eng';
  divisionNameTooltip = 'Dy. Con. Of Forest Training Centre, Gandhinagar';
  departmentTooltip = 'Forest Department';
  treasuryOfficeTooltip = 'District Treasury Office, Gandhinagar';
  divisionOfficeTooltip = 'Dy. Con. Of Forest Training Centre, Gandhinagar';
  drawingOfficerTooltip = 'Deputy Conservator,  Dy. Con. Of Forest Training Centre, Gandhinagar';
  budgetTypeDisabled = false;
  itemNameDisabled = false;
  chequeNo = 100001;
  openingBalance = 0;
  newBalance = 0;
  showChequeTable = false;
  showEpaymentTable = false;
  errorRemarks = false;
  isSearch: boolean;
  lcAdviceReceivedForm: FormGroup;
  MonthCtrl: FormControl = new FormControl();
  attachmentTypeCodeCtrl: FormControl = new FormControl();
  PaymentTypeCtrl: FormControl = new FormControl();
  AdviceTypeCtrl: FormControl = new FormControl();
  ExemptionTypeCtrl: FormControl = new FormControl();
  ClassOFExpenditureCTRL: FormControl = new FormControl();
  FundCTRL: FormControl = new FormControl();
  TypeOfExpenditureCTRL: FormControl = new FormControl();
  BudgetTypeCTRL: FormControl = new FormControl();
  DemandNoCTRL: FormControl = new FormControl();
  MajorHeadCTRL: FormControl = new FormControl();
  SubMajorHeadCTRL: FormControl = new FormControl();
  MinorHeadCTRL: FormControl = new FormControl();
  SubHeadCTRL: FormControl = new FormControl();
  DetailClassCTRL: FormControl = new FormControl();
  ObjectClassCTRL: FormControl = new FormControl();
  LcNumberCTRL: FormControl = new FormControl();
  checkTypeCtrl: FormControl = new FormControl();
  typeOfEstimationCTRL: FormControl = new FormControl();
  selection = new SelectionModel<any>(true, []);
  LcAdviceReceiptDataSource = new MatTableDataSource<AdviceReceipt>(this.LcAdviceReceiptDATA);
  LcAdviceReceiptEPaymentDataSource = new MatTableDataSource<any>(this.LcAdviceReceiptEPaymentDATA);
  DetailPostingDataSource = new MatTableDataSource<any>([]);
  DeductionDataSource = new MatTableDataSource<any>(this.DeductionData);
  errors = lcMessage;
  subscribeParams: Subscription;
  mode: any;
  action: any;
  status: any;
  hdrId: any;
  bankId: any;
  toOrSubToId: any;
  isEditable: any;
  userName: any;
  cardexno: any;
  ddoNo: any;
  divisionOfficeAddress: any;
  officeNameId: any;
  divisionOffice: any;
  drawingOfficer: any;
  postList1: any;
  currentUserData: any;
  wfRoleIds: any;
  wfRoleCode: any;
  menuId: any;
  linkMenuId: any;
  postId: any;
  userId: any;
  divisionId: any;
  lkPoOffUserId: any;
  department: any;
  userPostList: any;
  departmentId: any;
  officeName: any;
  officeId: any;
  district: any;
  districtId: any;
  firstName: any;
  deductionList: any[]
  listingUrl: any;
  refNo: any;
  refDate: string;
  attachmentTypeList: any[] = [];
  viewableExtension = ['pdf', 'jpg', 'jpeg', 'png'];
  selectedFilePreviewPdf: string;
  selectedFilePreviewImageBase64: string;
  selectedFileBase64: string;
  dData: any;
  showWorkFlowAction: boolean = true;
  maxAttachment: number;
  constant = EdpDataConst;
  fileBrowseIndex: number;
  totalAttachmentSize: number;
  inWordsVariable: any = '';

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

  dataSourceBrowse = new MatTableDataSource([]);
  headingName: any;

  constructor(private fb: FormBuilder, private el: ElementRef, public dialog: MatDialog, private router: Router,
    private toastr: ToastrService,
    private storageService: StorageService,
    private activatedRoute: ActivatedRoute,
    private edpDdoOfficeService: EdpDdoOfficeService,
    private locService: LetterOfCreditService,
    private commonWorkflowService: CommonWorkflowService,
    public datepipe: DatePipe,
  ) { }

  // Create object to access Methods of Letter of Credit Directive
  directiveObject = new LetterOfCreditDirectives(this.router, this.dialog, this.el);
  @ViewChild('attachment', { static: true }) attachment: ElementRef;

  ngOnInit() {

    this.subscribeParams = this.activatedRoute.params.subscribe(resRoute => {
      this.mode = resRoute.mode;
      this.action = resRoute.action;
      this.status = resRoute.status;
      this.hdrId = resRoute.id;
      this.isEditable = resRoute.isEditable;
      this.listingUrl = resRoute.listingUrl
      this.headingName = resRoute.headingName
    });

    this.userName = this.storageService.get('userName');
    this.currentUserData = this.storageService.get('currentUser');
    this.userPostList = this.currentUserData['post'];
    this.userPostList = this.userPostList.filter(row => row.loginPost== true)
    const userPostList = _.head(this.userPostList)
    this.postList1 = userPostList
    if (userPostList) {
      console.log(userPostList)
      this.departmentId = userPostList['oauthTokenPostDTO']['edpMsOfficeDto'].departmentId;
      this.department = userPostList['oauthTokenPostDTO']['edpMsOfficeDto'].deptName;
      this.divisionOffice = userPostList['oauthTokenPostDTO']['edpMsOfficeDto'].officeName;
      this.drawingOfficer = userPostList['oauthTokenPostDTO']['edpMsOfficeDto'].officeName;
      this.divisionOfficeAddress = userPostList['oauthTokenPostDTO']['edpMsOfficeDto'].addrLine1;
      this.officeNameId = userPostList['oauthTokenPostDTO']['edpMsOfficeDto'].officeId;
      this.district = userPostList['oauthTokenPostDTO']['edpMsOfficeDto'].districtName;
      this.districtId = userPostList['oauthTokenPostDTO']['edpMsOfficeDto'].districtId;
      this.cardexno = userPostList['oauthTokenPostDTO']['edpMsOfficeDto'].cardexno;
      this.ddoNo = userPostList['oauthTokenPostDTO']['edpMsOfficeDto'].ddoNo;

    }

    this.firstName = this.userName.split(' ')[1];
    this.maxAttachment = this.constant.MAX_ATTACHMENT;
    this.lcAdviceReceivedFormData();
    this.getLcAdviceDetails();
    this.getPostingDetailsViewData();
    this.getDeductionViewData();
    this.getCurrentUserDetail()
  }
  private getPostingDetailsViewData() {
    const params = {
      actionStatus: this.isEditable,
      hdrId: this.hdrId,
      headWiseId: 0
    }
    console.log(params, 'detail posting edit view api input params')
    this.locService.getData(params, APIConst.LC_ADVICEPREPARATION.GET_POSTING_DETAILS_EDIT_VIEW_DATA).subscribe(
      (res: any) => {
        console.log(res, 'posting details edit view api result output')
        if (res && res.status === 200 && (res.result) != null && (res.result).length > 0) {
          res.result.forEach(element => {
          })
          console.log(res.result)
          console.log(res.result[0]['ddoNo'])
          this.lcAdviceReceivedForm.patchValue({ ddoNumber: res.result[0]['ddoNo'] });

          this.DetailPostingDataSource = new MatTableDataSource(res.result);
        }
      })
  }


  /**
  *  Get login details and set to local configuration variables
  *
  * @private
  *
  * @memberOf LcAdviceReceivedComponent
  */
  private getCurrentUserDetail() {
    this.commonWorkflowService.getCurrentUserDetail().then((res: any) => {
      console.log(res, 'current user details')
      if (res) {
        this.wfRoleIds = res.wfRoleId;
        this.wfRoleCode = res.wfRoleCode;
        this.menuId = res.menuId
        this.linkMenuId = res.linkMenuId ? res.linkMenuId : this.menuId;
        this.postId = res.postId;
        this.userId = res.userId;
        this.lkPoOffUserId = res.lkPoOffUserId;
        this.officeId = res.officeDetail.officeId;
        this.getAttachmentList();

      }
    });
  }

  /**
   * get LcAdvice preparation values
   *
   *
   * @memberOf LcAdviceReceivedComponent
   */

  private getLcAdviceDetails() {
    const params = {
      departmentId: this.departmentId,
      districtId: this.districtId,
      cardexNo: this.cardexno,
      officeId: this.officeNameId,
      ddoNo: this.ddoNo
    }
    this.locService.getData(params, APIConst.LC_ADVICEPREPARATION.GET_ADVICE_DTL).subscribe((res: any) => {

      if (res && res.result && res.status === 200) {
        this.divisionId = res.result.divId;
        this.bankId = res.result.bankId;
        this.toOrSubToId = res.result.tresSubTresId;
        this.lcAdviceReceivedForm.patchValue({ department: this.department });
        this.lcAdviceReceivedForm.patchValue({ district: this.district });
        this.lcAdviceReceivedForm.patchValue({ divisionOffice: this.divisionOffice });
        this.lcAdviceReceivedForm.patchValue({ drawingOfficer: this.drawingOfficer });
        this.lcAdviceReceivedForm.patchValue({ adviceDate : res.result.adviceDate ? res.result.adviceDate : ''});
        this.lcAdviceReceivedForm.patchValue({ divisionCode: res.result.divCode });
        this.lcAdviceReceivedForm.patchValue({ divisionName: res.result.divName });
        this.lcAdviceReceivedForm.patchValue({ bank: res.result.bankName });
        this.lcAdviceReceivedForm.patchValue({ treasuryOffice: res.result.tresSubTresName });
        this.lcAdviceReceivedForm.patchValue({ lcValidFrom: res.result.lcValidfrom });
        this.PaymentTypeList = res.result.paymentType;
        if (this.PaymentTypeList.length == 1) {
          this.lcAdviceReceivedForm.get('paymentType').setValue(this.PaymentTypeList[0].id);
        }
        if (this.mode == 'edit' || this.mode == 'view') {
          this.getLcAdvicePreparationEdit();
        }
              }
    },
      err => {
        this.toastr.error(err);
      }
    );
  }

  /**
  * getLcAdvicePreparationEdit
  *
  * @private
  *
  * @memberOf LcAdviceReceivedComponent
  */


  private getLcAdvicePreparationEdit() {
    const param = {
      actionStatus: this.isEditable,
      hdrId: this.hdrId
    };
    this.locService.getData(param, APIConst.LC_ADVICEPREPARATION.GET_ADVICEPREP_EDIT).subscribe((res: any) => {
      if (res && res.status === 200 && (res.result) != null) {
        this.hdrId = res.result.hdrId;
        this.bankId = res.result.bankId;
        this.toOrSubToId = res.result.tresSubTresId;
        this.lcAdviceReceivedForm.patchValue({ adviceNumber: res.result.adviceNo });
        this.lcAdviceReceivedForm.patchValue({ adviceDate: res.result.adviceDate });
        this.lcAdviceReceivedForm.patchValue({ divisionCode: res.result.divCode });
        this.lcAdviceReceivedForm.patchValue({ divisionName: res.result.divName });
        this.lcAdviceReceivedForm.patchValue({ department: res.result.deptName });
        this.lcAdviceReceivedForm.patchValue({ district: res.result.districtName });
        this.lcAdviceReceivedForm.patchValue({ treasuryOffice: res.result.toOrSubToName });
        this.lcAdviceReceivedForm.patchValue({ divisionOffice: res.result.officeName });
        this.lcAdviceReceivedForm.patchValue({ drawingOfficer: res.result.drawingOfficeName });
        this.lcAdviceReceivedForm.patchValue({ bank: res.result.bankName });
        this.lcAdviceReceivedForm.get('lcValidFrom').patchValue(new Date(res.result.lcValidFromDate));
        this.lcAdviceReceivedForm.get('adviceDate').patchValue(new Date(res.result.adviceDate ? res.result.adviceDate : ''));
        this.lcAdviceReceivedForm.patchValue({ objectionRemarks: res.result.raiseObjectionRemarks });

        this.officeNameId = res.result.officeId
        this.districtId = res.result.districtId
        this.departmentId = res.result.deptId
        this.cardexno = res.result.cardexNo
        this.ddoNo = res.result.ddoNo
        this.refNo = res.result.refNo
        this.openingBalance=res.result.openBlnc
        this.newBalance=res.result.newLcBlnc

        this.refDate = (res.result.refDate) ? res.result.refDate : ""
        if (res.result.raiseObjectionRemarks != '' && res.result.raiseObjectionRemarks != null && res.result.raiseObjectionRemarks != NaN &&
          res.result.raiseObjectionRemarks != undefined) {
          this.lcAdviceReceivedForm.value.raiseObjectionCheckbox = true;
          this.lcAdviceReceivedForm.patchValue({ raiseObjectionCheckbox: true });
          this.errorRemarks = true;
        }
        else
          this.errorRemarks = false;

       //this.lcAdviceReceivedForm.patchValue({ lcValidFrom: res.result.lcValidFromDate });
        this.lcAdviceReceivedForm.patchValue({ month: res.result.adviceMonth });
        this.PaymentTypeList.forEach(key => {
          if (key.id == res['result'].paymentTypeId) {
            this.lcAdviceReceivedForm.get('paymentType').setValue(key.id);
            if (key.id === 944) {
              console.log('944')
              this.showChequeTable = true;
              this.showEpaymentTable = false;
              this.getEpaymentEditData();

            }
            else {
              this.showChequeTable = false;
              this.showEpaymentTable = true;
              this.getEpaymentEditData();

            }
          }
        });
        if (this.mode == 'view') {
          this.lcAdviceReceivedForm.disable();

        }
      }
    });
  }

  getEpaymentEditData() {

    const params = {

      id: this.hdrId,
      actionStatus: this.isEditable
    }
    this.locService.getData(params, APIConst.LC_ADVICEPREPARATION.GET_ADVICEPREP_EPAY_EDIT).subscribe((res: any) => {
      console.log("chequeEpayment");
      if (res && res.status === 200 && (res.result) != null && (res.result).length > 0) {
        if (this.showChequeTable)
          this.LcAdviceReceiptDataSource = new MatTableDataSource(res.result);
        else if (this.showEpaymentTable)
          this.LcAdviceReceiptEPaymentDataSource = new MatTableDataSource(res.result);

      }
    });
  }


  getDeductionViewData() {
    const params = {
      actionStatus: this.isEditable,
      hdrId: this.hdrId,

    }
    console.log(params, 'deduction details edit view api input params')
    this.locService.getData(params, APIConst.LC_ADVICEPREPARATION.GET_DEDUCTION_DETAIL_EDIT_VIEW_DATA).subscribe(
      (res: any) => {
        if (res && res.status === 200 && res.result !== null) {


          const p_data = this.DeductionDataSource.data;

          p_data.push({
            ptAmt: res.result.ptAmt ? res.result.ptAmt : 0,
            labourAmt: res.result.labourAmt ? res.result.labourAmt : 0,
            forAllMhAmt: res.result.forAllMhAmt ? res.result.forAllMhAmt : 0,
            itAmt: res.result.itAmt ? res.result.itAmt : 0,
            surchargeAmt: res.result.surchargeAmt ? res.result.surchargeAmt : 0,
            gpfClass4Amt: res.result.gpfClass4Amt ? res.result.gpfClass4Amt : 0,
            cpfAmt: res.result.cpfAmt ? res.result.cpfAmt : 0,
            buildingRentAmt: res.result.buildingRentAmt ? res.result.buildingRentAmt : 0,
            govtInsuFundAmt: res.result.govtInsuFundAmt? res.result.govtInsuFundAmt : 0,
            insuranceFundAmt: res.result.insuranceFundAmt ? res.result.insuranceFundAmt : 0,
            securityDepositAmt: res.result.securityDepositAmt ? res.result.securityDepositAmt : 0,
            estdChargeAmt: res.result.estdChargeAmt ? res.result.estdChargeAmt : 0,
            machineryChargeAmt: res.result.machineryChargeAmt ? res.result.machineryChargeAmt : 0,
          });

          this.DeductionDataSource.data = p_data;
          console.log(this.DeductionDataSource.data)
          this.DeductionDataSource = new MatTableDataSource<any>(this.DeductionDataSource.data);
        }
      })

  }




  // Initialize Form Fields
  lcAdviceReceivedFormData() {
    this.lcAdviceReceivedForm = this.fb.group({
      adviceNumber: [''],
      adviceDate: [''],
      divisionCode: [''],
      divisionName: [''],
      department: [''],
      district: [''],
      treasuryOffice: [''],
      divisionOffice: [''],
      drawingOfficer: [''],
      bank: [''],
      lcValidFrom: [''],

      month: [''],
      paymentType: [''],
      adviceType: [''],
      exemption: ['1'],
      ddoNumber: [{ value: '', disabled: true }],
      classOfExpenditure: ['1'],
      fund: ['3'],
      typeOfExpenditure: ['1'],
      budgetType: ['1'],
      schemeNo: ['1'],
      demandNo: ['1'],
      majorHead: ['1'],
      subMajorHead: ['1'],
      minorHead: ['1'],
      subHead: ['1'],
      detailClass: ['1'],
      typeOfEstimation: ['1'],
      objectClass: ['2'],
      lcNumber: [''],
      chequeTypeCheck: [''],
      raiseObjectionCheckbox: [''],
      objectionRemarks: ['']
      // chequeDate: new FormControl(new Date(2020,6,18)),
    });
  }

  /**
    * Save LCAdvice Preparation
    *
    * @private
    * @param {any} [formAction=FormActions.DRAFT]
    *
    * @memberOf LcAdviceReceivedComponent
    */
  saveLcAdvPr(value) {
    // saveLcAdvPr(value) {
    const lcAdvPreparationsaveRequest = this.getSaveDataParams();
    console.log(lcAdvPreparationsaveRequest, 'params')
    if (this.lcAdviceReceivedForm.value.objectionRemarks) {
      lcAdvPreparationsaveRequest.raiseObjectionRemarks = this.lcAdviceReceivedForm.value.objectionRemarks,
        lcAdvPreparationsaveRequest.raiseObjectionFlag = "Y"
    }

    console.log(lcAdvPreparationsaveRequest)
    this.locService.LcAdvicePrepSave(lcAdvPreparationsaveRequest).subscribe(
      (res: any) => {
        if (res && res.status === 200 && res.result !== null) {
          this.toastr.success(res.message);
          if (value == 'Submit') {
            this.openWfPopup();
          }

          // this.hdrId = res.result.id,
          //   this.sdId = res.result.locAdvcSdDto.sdId;

        } else {
          this.toastr.error(res.message);
        }
      },
      err => {
        this.toastr.error(err);
      }
    );
  }


  /**
    * 
    *
   Get request to save 
    * @return {*}
    * @memberOf LcAdviceReceivedComponent
    */

  getSaveDataParams() {


    const params = {
      adviceDate: this.lcAdviceReceivedForm.value.adviceDate,
      adviceNo: this.lcAdviceReceivedForm.value.adviceNumber,
      cardexNo: this.cardexno,
      ddoNo: this.ddoNo,
      deptId: this.departmentId,
      districtId: this.districtId,
      divCode: this.lcAdviceReceivedForm.value.divisionCode,
      bankId: this.bankId,
      divId: this.divisionId,
      drawingOfficeId: this.officeNameId,
      id: this.hdrId,
      toOrSubToId: this.toOrSubToId,
      lcValidFromDate: this.lcAdviceReceivedForm.value.lcValidFrom,
      advcmonth: this.lcAdviceReceivedForm.value.month,
      paymentTypeId: this.lcAdviceReceivedForm.value.paymentType,
      officeId: this.officeNameId,
      referenceDt: this.refDate,
      referenceNo: this.refNo,
      raiseObjectionFlag: 'N',
      raiseObjectionRemarks: null,
      statusId: 0,

      wfId: 1,
      wfRoleId: 1,
      wfUserReqSdDto: {
        branchId: null,
        menuId: this.menuId,
        officeId: this.officeId,
        postId: this.postId,
        pouId: this.lkPoOffUserId,
        userId: this.userId,
        wfRoleIds: this.wfRoleIds
      }


    }


    return params;
  }

  /**
       * @description open work-flow popup
       */
  openWfPopup() {

    const passData = {
      id: this.hdrId,

    };

    this.locService.getAdvPrepHeaderData(passData).subscribe((res: any) => {
      const headerDetails = _.cloneDeep(res.result);
      const headerJson = [
        { label: 'Advice No', value: headerDetails.adviceNo },
        {
          label: 'Advice Date',
          value: headerDetails.adviceDate ? (this.datepipe.transform(headerDetails.adviceDate, 'dd-MMM-yyyy HH:mm')) : ""
        },
        { label: 'Division Code', value: headerDetails.divisionCode },
        { label: 'Division Name', value: headerDetails.divisionName },
        { label: 'Treasury Office', value: headerDetails.divisionName },
        { label: 'Drawing Officer', value: headerDetails.drawingOfficer },
        { label: 'Expenditure Total', value: (this.directiveObject.totalexpenditureAmount(this.DetailPostingDataSource.data).toFixed(2)) },
        { label: 'Net Total', value: this.netTotal() },
        { label: 'LC Balance', value: this.lcBalance() },

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
          headingName: this.headingName,
          headerJson: headerJson,
          trnId: this.hdrId,
          moduleInfo: moduleInfo,
          refNo: headerDetails.referanceNumber ? headerDetails.referanceNumber : '',
          refDate: headerDetails.referanceDate ? headerDetails.referanceDate : '',
          conditionUrl: '',
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
          this.toastr.success(MESSAGES.DATA_SAVED_MESSAGE)
          // if(this.menuId== 377 || this.headingName=='LC Advice Authorization'){
          // this.notificationApi(paramsForWf)
          // }
          // else{
            this.gotoListing();
         // }
        }
      });
    });
  }
  notificationApi(paramsForWf){
    this.locService.getData(paramsForWf,APIConst.LC_ADVICEPREPARATION.NOTIFICATION_DATA).subscribe(res => {

    })
    this.gotoListing();
  }
  /**
  * @description submit work-flow popup
  */
    showChequeEpayment() {
    if (this.lcAdviceReceivedForm.controls['paymentType'].value === '1') {
      this.showChequeTable = true;
      this.showEpaymentTable = false;
    } else {
      this.showChequeTable = false;
      this.showEpaymentTable = true;
    }
  }


  totalEPaymentAmount(): number {
    let amount = 0;
    this.LcAdviceReceiptEPaymentDataSource.data.forEach((element, index) => {
      amount = amount + Number(element.epayAmnt);
    });
    return amount;

  }

  checkFund() {
    if (this.lcAdviceReceivedForm.controls['fund'].value == '5') {
      this.budgetTypeDisabled = true;
      this.lcAdviceReceivedForm.controls['budgetType'].setValue('');
      this.lcAdviceReceivedForm.controls['demandNo'].setValue('1');
      this.lcAdviceReceivedForm.controls['schemeNo'].setValue('');
    } else {
      this.budgetTypeDisabled = false;
      this.lcAdviceReceivedForm.controls['demandNo'].setValue('');
    }
  }

  checkEstimate() {
    if (this.lcAdviceReceivedForm.controls['typeOfEstimation'].value == '1') {
      this.itemNameDisabled = true;
    } else {
      this.itemNameDisabled = false;
    }
  }

  mapEPayment(element) {
    this.showEpaymentTable = true;
    if (this.showEpaymentTable) {

      const DATA = {
        tabledata: this.LcAdviceReceiptEPaymentDataSource.data,
        expenditureAmount: element.expenditureAmount,
        mode: 'view',
        hdrId: this.hdrId,
        isEditable: this.isEditable


      }
      // tslint:disable-next-line: no-use-before-declare
      const dialogRef = this.dialog.open(MapEPaymentComponent, {
        width: '1000px',
        data: DATA,
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
      });
    }
  }

  searchAuthorizeTreasury() {
    const dialogRef = this.dialog.open(LcNumberDialogComponent, {
      width: '1000px'
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }



  totalDeductionAmount(): number {
    let deductionAmount = 0;
    this.DeductionDataSource.data.forEach((element) => {
      deductionAmount = Number(deductionAmount) + Number(element.ptAmt) + Number(element.labourAmt) + Number(element.forAllMhAmt) + Number(element.itAmt) +
        Number(element.surchargeAmt) + Number(element.gpfClass4Amt) + Number(element.cpfAmt) + Number(element.buildingRentAmt) + Number(element.govtInsuFundAmt) +
        Number(element.insuranceFundAmt) + Number(element.securityDepositAmt) + Number(element.estdChargeAmt) + Number(element.machineryChargeAmt);
    });
    return deductionAmount;
  }

  totalexpenditureAmount(): number {
    let expenditureAmt = 0;
    this.DetailPostingDataSource.data.forEach((element) => {
      expenditureAmt = Number(expenditureAmt) + Number(element.expenditureAmount);
    });
    return expenditureAmt;

  }



  netTotal() {
    let netTotal = Number(this.totalexpenditureAmount()) - Number(this.totalDeductionAmount());
    let value = new NumberToWordsPipe().transform(netTotal, 'decimal');
    value = value.trim()
    var res = value.split(' ', 1)[0]

    if (res.toLowerCase() == 'only')
      this.inWordsVariable = ''

    else if (res !== '' && res != undefined && res.toLowerCase() == 'and')
      this.inWordsVariable = value.substr(value.indexOf(" ") + 1);
    else
      this.inWordsVariable = value

    return parseFloat('' + netTotal).toFixed(2);
  }

  lcBalance() {
    return this.openingBalance + this.newBalance;
  }
  /**
  * @description Go To Listing Page of LOC
  */
  gotoListing() {
    if (this.listingUrl == undefined || this.listingUrl == null || this.listingUrl == '')
      this.router.navigate(['/dashboard/lc/lc-saved-advice'], { skipLocationChange: false });
    else {
      this.router.navigate([this.listingUrl], { skipLocationChange: false });

    }
  }
  /* *  @description toggle the edit tabs
   * 
   * @param event 
   * 
   */
  toggleEditable(event) {
    console.log(event.checked)

    if (event.checked) {
      this.errorRemarks = true;
      this.lcAdviceReceivedForm.get('objectionRemarks').setValidators(Validators.required)
      this.lcAdviceReceivedForm.get('objectionRemarks').updateValueAndValidity();

    }
    else {
      this.lcAdviceReceivedForm.get('objectionRemarks').clearValidators()
      this.lcAdviceReceivedForm.get('objectionRemarks').updateValueAndValidity();

      this.errorRemarks = false
    }
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
      categoryName: 'TRANSACTION',
      menuId: this.linkMenuId
    };
    this.commonWorkflowService.getAttachmentList(param).subscribe(
      (res: any) => {
        if (res && res.status === 200 && res.result && res.result.length > 0) {
          this.attachmentTypeList = res.result.filter(data => {
            data.id = data['attTypeId'].id;
            data.name = data['attTypeId'].name;
            data.isMandatory = data['attTypeId'].isMandatory;
            data.category = data['attTypeId'].category;
            return data;
          });

          this.getUploadedAttachmentData();
        }
      },
      err => {
        this.toastr.error(err);
      }
    );
  }

  /**
   * @description Method to get user uploaded attachments.
   * @returns array object
   */
  getUploadedAttachmentData() {
    try {
      this.dataSourceBrowse = new MatTableDataSource([]);
      const param = {
        categoryName: 'TRANSACTION',
        menuId: this.linkMenuId,
        trnId: this.hdrId,
        lkPOUId: this.lkPoOffUserId
      };
      this.commonWorkflowService.getUploadedAttachmentList(param).subscribe(
        (res: any) => {
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
        err => {
          this.toastr.error(err);
        }
      );
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
      const tableData = [
        {
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
        }
      ];
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
      filesArray.forEach(element => {
        if (
          !(
            element.file &&
            element.file !== '' &&
            element.fileName &&
            element.fileName !== '' &&
            element.attachmentTypeId
          )
        ) {
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
        formData.append(
          'attachmentCommonDtoList[' + index + '].uploadDirectoryPath',
          element.uploadDirectoryPath
        );
        formData.append('attachmentCommonDtoList[' + index + '].attachment', element.file, element.file.name);
        formData.append('attachmentCommonDtoList[' + index + '].uploadedFileName', element.uploadedFileName);
      });
      this.commonWorkflowService.attachmentUpload(formData).subscribe(
        (res: any) => {
          if (res && res.status === 200) {
            this.toastr.success(MESSAGES.ATTACHMENT.UPLOAD_SUCCESS);
            this.getUploadedAttachmentData();
          } else {
            this.toastr.error(res.message);
          }
        },
        err => {
          this.toastr.error(err);
        }
      );
    }
  }

  /**
   * @description View Attachment
   * @param attachment  attachment
   */
  viewUploadedAttachment(attachment: any, event, isPreview = false) {
    try {
      const param = {
        documentDataKey: attachment.documentId,
        fileName: attachment.uploadedFileName
      };
      this.commonWorkflowService.viewAttachment(param).subscribe(
        (res: any) => {
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
              const byteArray = new Uint8Array(
                atob(resultObj['fileSrc'])
                  .split('')
                  .map(char => char.charCodeAt(0))
              );
              const blob = new Blob([byteArray], { type: docType });
              if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(blob, res['result']['fileName']);
              } else {
                const url = window.URL.createObjectURL(blob);
                window.open(url, '_blank');
              }
            }
          }
        },
        err => {
          this.toastr.error(err);
        }
      );
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
        documentDataKey: params.documentId,
        fileName: params.uploadedFileName
      };
      this.commonWorkflowService.downloadAttachment(ID).subscribe(
        res => {
          const url = window.URL.createObjectURL(res);
          const link = document.createElement('a');
          link.setAttribute('href', url);
          link.setAttribute('download', '' + params.uploadedFileName);
          document.body.appendChild(link);
          link.click();
          link.remove();
        },
        err => {
          this.toastr.error(err);
        }
      );
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
    const fileExtension = fileSelected.target.files[0].name
      .split('.')
      .pop()
      .toLowerCase();
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
            attachmentId: item.attachmentId,
            menuId: this.linkMenuId
          };
          this.commonWorkflowService.attachmentDelete(param).subscribe(
            (res: any) => {
              if (res && res.status === 200 && res.result === true) {
                this.toastr.success(res.message);
                this.dataSourceBrowse.data.splice(index, 1);
                this.dataSourceBrowse = new MatTableDataSource(this.dataSourceBrowse.data);
                if (this.dataSourceBrowse.data.length === 0) {
                  this.getUploadedAttachmentData();
                }
              }
            },
            err => {
              this.toastr.error(err);
            }
          );
        } else {
          this.dataSourceBrowse.data.splice(index, 1);
          this.dataSourceBrowse = new MatTableDataSource(this.dataSourceBrowse.data);
        }
      }
    });
  }

  /**
* @description Method  is know the result status for all apis
* @params result fetched from th backend 
 
*/

  checkSucessApiResponse(res: any) {
    if (res && res.status === 200 && res.result.length > 0) {
      return 1;
    } else if (res && res.status === 200 && (res.result == null || res.result.length == 0)) {
      res['message'] = 'No Record Found';
      return 2;
    } else if (res && res.status !== 200) {
      return 3;
    }
  }
  /**
* @description Method  is to fetch list of majorheads  for details for AG tab
 
*/
}
