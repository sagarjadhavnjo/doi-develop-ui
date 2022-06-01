
import { CommonDirective } from './../directive/validation.directive';
import { ActivatedRoute, Router } from '@angular/router';
import { LetterOfCreditDirectives } from './../directive/letter-of-credit-directive';
import { Component, OnInit, Inject, ViewChild, ElementRef, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, throwMatDialogContentAlreadyAttachedError } from '@angular/material/dialog';
// import { lcMessage } from 'src/app/common/error-message/common-message.constants';
import { ListValue, AdviceReceipt, Deduction, DeductionLCAdvice, DialogData, LcAdvPreparationsaveRequest, wfUserReqSDDto, locAdvcSdDto, adviceReceiveNonEmployee, employeeDetails } from './../model/letter-of-credit';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { StorageService } from 'src/app/shared/services/storage.service';
import { EdpDdoOfficeService } from '../../edp/services/edp-ddo-office.service';
import * as _ from 'lodash';
import { ModuleNames } from '../../common/constant/common-workflow.constants';
import { LcCommonWorkflowComponent } from '../lc-common-workflow/lc-common-workflow.component';
import { LetterOfCreditService } from '../service/letter-of-credit.service';
import { APIConst } from 'src/app/shared/constants/letter-of-credit/letter-of-credit-api.constants';
import { CommonWorkflowService } from '../../common/workflow-service/common-workflow.service';
import { MESSAGES, lcMessage } from 'src/app/shared/constants/letter-of-credit/message-constants';
import { OkDialogComponent } from 'src/app/shared/components/ok-dialog/ok-dialog.component';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { Subscription } from 'rxjs';
import { CONFIGURATION, FormActions, LocAdvcPrepCheqPaySdDto } from 'src/app/models/letter-of-credit/letter-of-credit';
import { DatePipe } from '@angular/common';
import { NumberToWordsPipe } from 'src/app/common/pipes/number-to-words.pipe';
import { EdpDataConst } from 'src/app/shared/constants/edp/edp-data.constants';


@Component({
  selector: 'app-lc-advice-received',
  templateUrl: './lc-advice-received.component.html',
  styleUrls: ['./lc-advice-received.component.css'],
  animations: [
    trigger('expandRow', [
      state('collapsed, void', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      transition('expanded <=> void', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ]),
  ]
})
export class LcAdviceReceivedComponent implements OnInit {

  @Input() isView: boolean;
  @Input() isEdit: boolean;
  todayDate = new Date();
  month = this.todayDate.getMonth()
  tabDisable: Boolean = true;
  selectedIndex: number = 0;

  // List of Month
  userName: any;
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
  cardexno: any;
  ddoNo: any;
  divisionOfficeAddress: any;
  officeNameId: any;
  statusFlag: Boolean = false;
  divisionOffice: any;
  drawingOfficer: any;
  postList1: any;
  maxAttachment: number;
  constant = EdpDataConst;
  mode: any;
  action: any;
  status: any;
  hdrId: any;
  bankId: any;
  toOrSubToId: any;
  sdId: any;
  epaySdId: any;
  isEditable: any;
  referenceNo: any;
  referenceDt: any;
  subscribeParams: Subscription;
  dataSourceBrowse = new MatTableDataSource([]);
  viewableExtension = ['pdf', 'jpg', 'jpeg', 'png'];
  selectedFilePreviewPdf: string;
  selectedFilePreviewImageBase64: string;
  fileBrowseIndex: number;
  selectedFileBase64: string;
  attachmentTypeList: any[] = [];
  totalAttachmentSize = 0;
  nextChqSeriesList: any[] = [];
  headingName: any;
  MonthList: any[] = [
    { value: '1', viewValue: 'January', backEndFormat: (+new Date().getMonth() + 1).toString() },
    { value: '2', viewValue: 'February', backEndFormat: (+new Date().getMonth() + 1).toString() },
    { value: '3', viewValue: 'March', backEndFormat: (+new Date().getMonth() + 1).toString() },
    { value: '4', viewValue: 'April', backEndFormat: (+new Date().getMonth() + 1).toString() },
    { value: '5', viewValue: 'May', backEndFormat: (+new Date().getMonth() + 1).toString() },
    { value: '6', viewValue: 'June', backEndFormat: (+new Date().getMonth() + 1).toString() },
    { value: '7', viewValue: 'July', backEndFormat: (+new Date().getMonth() + 1).toString() },
    { value: '8', viewValue: 'August', backEndFormat: (+new Date().getMonth() + 1).toString() },
    { value: '9', viewValue: 'Sepetember', backEndFormat: (+new Date().getMonth() + 1).toString() },
    { value: '10', viewValue: 'October', backEndFormat: (+new Date().getMonth() + 1).toString() },
    { value: '11', viewValue: 'November', backEndFormat: (+new Date().getMonth() + 1).toString() },
    { value: '12', viewValue: 'December', backEndFormat: (+new Date().getMonth() + 1).toString() }
  ];
  selectedTab: number = 0

  // List of Payment Type
  PaymentTypeList: any[] = [

  ];
  @ViewChild('attachment', { static: true }) attachment: ElementRef;
  // Table data for Advice Receipt Table
  LcAdviceReceiptDATA: AdviceReceipt[] = [];

  // Table Column for Advice Receipt Table
  LcAdviceReceiptDATAColumn: string[] = [
    'srno', 'chequeDate', 'chequeNo', 'partyName', 'chequeAmount', 'action'
  ];

  // Table Data for Advice Receipt ePayment Table
  LcAdviceReceiptEPaymentDATA: any[] = [
  ];

  // Table Column for Advice Receipt ePayment Table
  LcAdviceReceiptEPaymentDATAColumn: string[] = [
    'srno', 'partyName', 'bankAccountNumber', 'IFSCCode', 'epaymentAmount', 'action'
  ];

  // List of Advices
  AdviceTypeList: any[] = [];

  // List of Exemptions
  ExemptionTypeList: any[] = [
    { value: '1', viewValue: 'Exempted' },
    { value: '2', viewValue: 'Non-Exempted' }
  ];

  // List of Estimation Type
  typeOfEstimationList: any[] = [];

  // List of Item Name
  itemNameList: any[] = [];

  // Table data for Details Posting Table
  DetailPostingData: any[] = [];

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
    'lcNumber',
    'search',
    'action'
  ];

  // List of Expenditure Classes
  ClassOfExpenditureList: any[] = [];

  // List of Fund Type
  FundList: any[] = [];

  // List Expenditure type
  TypeOfExpenditureList: any[] = [];

  // List of Budget Type
  BudgetTypeList: any[] = [];

  // List of Demand Number
  DemandNoList: any[] = [];

  // List of Major Head
  MajorHeadList: any[] = [];


  // List of Sub Major Head
  SubMajorHeadList: any[] = [];

  // List of Minor Head
  MinorHeadList: any[] = [];

  // List of Sub Head
  SubHeadList: any[] = [];

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
  // List of Detail Class
  DetailClassList: any[] = [];

  // List of Object Classes
  ObjectClassList: any[] = [];

  // List of Attachments
  attachmentTypeCode: any[] = [];

  // List of Numbers
  LcNumberList: any[] = [
    { value: '', viewValue: '' },
  ];
  specificBudgetTypeList = [
    { value: 1, viewValue: "State" },
    { value: 2, viewValue: "CSS" }
  ];


  // Table Columns for Deduction Table
  DeductionDataColumn: string[] = [
    'professionlTax', 'laborClass', 'forAllMH', 'incomeTax', 'surcharge', 'gpfClassIV',
    'cpf', 'rentOfBldg', 'govtInsuranceFund', 'insuranceFund',
    'securityDeposit', 'establishmentCharges', 'machinaryCharges'
  ];


  // List of Cheyque type
  checkType: any[] = [];
  divisionNameTooltip = 'Dy. Con. Of Forest Training Centre, Gandhinagar';
  departmentTooltip = 'Forest Department';
  treasuryOfficeTooltip = 'District Treasury Office, Gandhinagar';
  divisionOfficeTooltip = 'Dy. Con. Of Forest Training Centre, Gandhinagar';
  drawingOfficerTooltip = 'Deputy Conservator,  Dy. Con. Of Forest Training Centre, Gandhinagar';
  lastChequeNumberUsed = '';
  newChequeNumber = '';
  budgetTypeDisabled = false;
  demandDisabled = false;
  isInputEdpCode = true;
  map = {};
  ePaymentList: any[] = [];
  isDelete = false;
  chequeNo = 100052;
  openingBalance = 0;
  newBalance = 0;
  showChequeTable = false;
  showEpaymentTable = false;
  isSearch: boolean;
  errors = lcMessage;
  errorMessage = lcMessage
  expandedElement = null;
  tempData;
  LcAdvicePrepList: any;
  budgetHeadCode: string;
  budgetHeadMap = {};
  maxAvailableAmount: number = 0;
  maxtableAvailableAmount: number = 0;
  value: number;
  itemHideFlag: boolean;
  itemId: any;
  startcheqseries: any;
  endcheqseries: any;
  nextchqseriesstart: any;
  isEntered: boolean;
  cheqendnum: any;
  sdDeductionId: any;
  nextChqSeries: any;
  endcheq: any;
  calculate: any;
  code: string;
  usedseries: any;
  canuseseries: any;
  startcheq: any;
  nextStart: any;
  nextEnd: any;
  nextcode: any;
  start: string;
  end: string;
  workFlowData = 'fromLcAdvicePreparation';
  demandCtrl: FormControl = new FormControl();
  majorHeadCtrl: FormControl = new FormControl();
  subMajorHeadCtrl: FormControl = new FormControl();
  minorHeadCtrl: FormControl = new FormControl();
  subHeadCtrl: FormControl = new FormControl();
  detailHeadCtrl: FormControl = new FormControl();
  chargedVotedCtrl: FormControl = new FormControl();
  fundTypeCtrl: FormControl = new FormControl();
  budgetTypeCtrl: FormControl = new FormControl();
  specificbudgetTypeCtrl: FormControl = new FormControl();
  lcAdviceReceivedForm: FormGroup;
  lcAdviceReceivedForm1: FormGroup;
  lcPostingDetails: FormGroup;
  deductionDetailsForm: FormGroup;
  MonthCtrl: FormControl = new FormControl();
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
  itemNameCTRL: FormControl = new FormControl();
  typeOfEstimationCTRL: FormControl = new FormControl();
  chequeTypeCheck: FormControl = new FormControl();
  attachmentTypeCodeCtrl: FormControl = new FormControl();
  schemeNo: FormControl = new FormControl();
  LcAdviceReceiptDataSource = new MatTableDataSource<AdviceReceipt>(this.LcAdviceReceiptDATA);
  LcAdviceReceiptEPaymentDataSource = new MatTableDataSource<any>(this.LcAdviceReceiptEPaymentDATA);
  DetailPostingDataSource = new MatTableDataSource<any>(this.DetailPostingData);
  listingUrl: any;
  selectedTabIndex: number = 0;
  chequeEpaymentsavedFlag: boolean = false;
  publicAccoutFlag: boolean = false;
  inWordsVariable: any = '';
  budgetDisable: Boolean = false;
  constructor(private el: ElementRef,
    private fb: FormBuilder,
    public dialog: MatDialog,
    public router: Router,
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
    if (this.headingName == null || this.headingName == undefined || this.headingName == '')
      this.headingName = 'LC Advice Preparation'

    this.lcAdviceReceivedFormData();
    this.lcAdviceReceivedFormData1();
    this.lcPostingDetailsFormData()
    this.deductionDetailsFormData();
    if (this.mode == 'edit') {
      this.getEditViewData();
    }
    this.getAdviceTypeList();
    this.getLCAdviceChequetypelistDropdown();
    this.getFundTypeList();
    this.getBudgetTypeList();
    this.getChargeVotedList();
    //  this.postingDetailsSaveAndProcess();
    this.userName = this.storageService.get('userName');
    this.currentUserData = this.storageService.get('currentUser');
    this.userPostList = this.currentUserData['post'];
    this.userPostList = this.userPostList.filter(row => row.loginPost == true)
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

    this.lcPostingDetails.patchValue({ ddoNumber: this.ddoNo });

    console.log(this.department);
    console.log(this.district);
    console.log(this.divisionOffice);
    console.log(this.drawingOfficer);
    console.log((+new Date().getMonth() + 1).toString());
    this.getCurrentUserDetail();
    this.maxAttachment = this.constant.MAX_ATTACHMENT;
    this.firstName = this.userName.split(' ')[1];
    this.getLcAdviceDetails();
    this.getOpenindAndNewBalanceAmt();

  }
  private getAdviceTypeList() {

    this.locService.getAdviceTypeList().subscribe((res: any) => {
      console.log(res)
      if (res && res.result && res.status === 200) {
        this.AdviceTypeList = _.orderBy(_.cloneDeep(res.result), 'adviceDesc', 'asc');


      }
    })
  }

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
      classOfExpenditure: [''],
      fund: [''],
      typeOfExpenditure: [''],
      budgetType: ['1'],
      demandNo: [''],
      majorHead: [''],
      subMajorHead: [''],
      minorHead: [''],
      subHead: [''],
      detailClass: [''],
      typeOfEstimation: ['1'],
      objectClass: [''],
      lcNumber: [''],
    });

  }
  lcAdviceReceivedFormData1() {
    this.lcAdviceReceivedForm1 = this.fb.group({
      demand: [''],
      majorHead: [''],
      subMajorHead: [''],
      minorHead: [''],
      subHead: [''],
      detailHead: [''],
      chargedVoted: [''],
      budgetType: [''],
      specificbudgetType: [''],
      fundType: [''],
      typeOfEstimation: [''],
      itemName: [''],
      objectClass: [''],
      headwiseAmount: [''],
      lcNumber: [''],
      expenditureAmount: [''],
      // item: ([]),
    })
  }
  decimalKeyPress(event: any) {
    const pattern = /^\d+(\.\d{0,2})?$/;
    const inputChar = String.fromCharCode(
      !event.charCode ? event.which : event.charCode
    );
    let tempstr = event.target.value;
    tempstr += inputChar;

    if (!pattern.test(tempstr)) {
      event.preventDefault();
      return false;
    }

  }

  deductionDetailsFormData() {
    this.deductionDetailsForm = this.fb.group({
      professionlTax: [''],
      laborClass: [''],
      allMh: [''],
      surCharge: [''],
      gpfClass: [''],
      cpf: [''],
      buildingRent: [''],
      governmentInsurance: [''],
      insuranceFund: [''],
      securityDeposit: [''],
      establishmentCharges: [''],
      machineryCharges: [''],
      incomeTax: [''],
      deductionTotal: ['']
    });
  }

  lcPostingDetailsFormData() {
    this.lcPostingDetails = this.fb.group({
      adviceType: [''],
      exemption: [{ value: '2', disabled: true }],
      ddoNumber: ['']
    })
    this.lcPostingDetails.patchValue({ ddoNumber: this.ddoNo });

  }


  generateCheque() {
    this.LcAdviceReceiptDataSource.data.forEach(item => {
      if (!item.isGenerateChequeNo) {
        if (this.endcheq >= this.calculate) {
          item.chequeNo = this.code + '-' + this.calculate
          item.chequeDate = this.todayDate,

            this.calculate = this.calculate + 1
          item.isGenerateChequeNo = true;

        }
        else {
          if (this.canuseseries > 0) {
            if (this.usedseries <= this.canuseseries) {
              this.startcheq = this.nextStart
              this.endcheq = this.nextEnd
              this.usedseries = this.usedseries + 1
              this.canuseseries = this.nextChqSeries.length - 1
              this.code = this.nextcode
              if (this.usedseries <= this.canuseseries) {
                this.nextcode = (this.nextChqSeries[this.usedseries].chqSerStart).split("-")[0]
                this.nextStart = Number((this.nextChqSeries[this.usedseries].chqSerStart).split("-")[1])
                this.nextEnd = Number((this.nextChqSeries[this.usedseries].chqSeriesEnd).split("-")[1])
              }
              this.calculate = this.startcheq
              item.chequeNo = this.code + '-' + this.calculate
              item.chequeDate = this.todayDate,
                this.calculate = this.calculate + 1
              item.isGenerateChequeNo = true;
            }

          }
        }
      }
    })
  }


  validateValue(event: number, type, element) {
    if (type == 'form') {
      if (event > this.maxAvailableAmount) {
        this.value = this.maxAvailableAmount;
        event = this.maxAvailableAmount
        this.lcAdviceReceivedForm1.get('expenditureAmount').reset();
        this.lcAdviceReceivedForm1.patchValue({ expenditureAmount: this.maxAvailableAmount });
        this.value = this.maxAvailableAmount;

      } else {
        this.value = event;
      }
    }
    else if (type == 'table') {
      if (event > element.availableAmount) {
        element.expenditureAmount = element.availableAmount
      }
      else {
        element.expenditureAmount = event
      }
    }
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


  getOpenindAndNewBalanceAmt() {
    const params = {
      cardexNo: this.cardexno,
      ddoNo: this.ddoNo,
      departmentId: this.departmentId,
      districtId: this.districtId,
      officeId: this.officeNameId
    }
    this.locService.getData(params, APIConst.LC_ADVICEPREPARATION.GET_OPENING_AND_NEWBALANCE_AMOUNT).subscribe((res: any) => {
      console.log(res, 'balance lc and opening amount')
      const list = _.head(res.result)
      if (list) {
        this.newBalance = list.newBalanceAmount,
          this.openingBalance = list.openingBalanceAmount
      }
    })
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
        this.toOrSubToId = (res.result.tresSubTresId) ? res.result.tresSubTresId : res.result.toOrSubToId;
        //this.toOrSubToId = res.result.toOrSubToId;
        console.log(res.result.toOrSubToId, 'myyyy doubttttttttttttttttttttttttttttttttt')
        this.lcAdviceReceivedForm.patchValue({ department: this.department });
        this.lcAdviceReceivedForm.patchValue({ district: this.district });
        this.lcAdviceReceivedForm.patchValue({ divisionOffice: this.divisionOffice });
        this.lcAdviceReceivedForm.patchValue({ drawingOfficer: this.drawingOfficer });
        this.lcAdviceReceivedForm.patchValue({ adviceDate: res.result.adviceDate });
        this.lcAdviceReceivedForm.patchValue({ divisionCode: res.result.divCode });
        this.lcAdviceReceivedForm.patchValue({ divisionName: res.result.divName });
        this.lcAdviceReceivedForm.patchValue({ bank: res.result.bankName });
        this.lcAdviceReceivedForm.patchValue({ treasuryOffice: res.result.tresSubTresName });
        this.lcAdviceReceivedForm.get('lcValidFrom').patchValue(new Date(res.result.lcValidfrom));
        this.lcAdviceReceivedForm.get('adviceDate').patchValue(new Date(res.result.adviceDate ? res.result.adviceDate : ''));

        this.PaymentTypeList = res.result.paymentType;
        this.PaymentTypeList = _.orderBy(_.cloneDeep(res.result.paymentType), 'name', 'asc');

        if (this.PaymentTypeList.length == 1) {
          this.lcAdviceReceivedForm.get('paymentType').setValue(this.PaymentTypeList[0].id);
        }
        else if (this.mode != 'edit' && this.mode != 'view') {
          this.PaymentTypeList.forEach(value => {
            if (value.id == 943) {
              this.lcAdviceReceivedForm.get('paymentType').setValue(value.id);
            }
          })
          this.MonthList.forEach(month => {
            if (month.value == (this.month + 1))
              this.lcAdviceReceivedForm.patchValue({ month: month.viewValue });

          })


          //943
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
        //this.toOrSubToId = res.result.tresSubTresId;
        this.toOrSubToId = res.result.toOrSubToId;

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

        this.officeNameId = res.result.officeId
        this.districtId = res.result.districtId
        this.departmentId = res.result.deptId
        this.cardexno = res.result.cardexNo
        this.ddoNo = res.result.ddoNo
        this.getOpenindAndNewBalanceAmt();
        this.referenceDt = (res.result.refDate) ? res.result.refDate : ""
        this.referenceNo = res.result.refNo ? res.result.refNo : ""
        this.lcAdviceReceivedForm.patchValue({ month: res.result.adviceMonth });
        this.PaymentTypeList.forEach(key => {
          if (key.id == res['result'].paymentTypeId) {
            this.lcAdviceReceivedForm.get('paymentType').setValue(key.id);
            this.showChequeEpayment(key.id)

          }
        });
        if (this.mode == 'view') {
          this.lcAdviceReceivedForm.disable();

        }
      }
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
  saveLcAdvPr(formAction = FormActions.DRAFT) {
    this.showChequeEpayment(this.lcAdviceReceivedForm.value.paymentType)
    const lcAdvPreparationsaveRequest = this.getSaveDataParams();
    if (formAction === FormActions.DRAFT) {
      lcAdvPreparationsaveRequest.statusId = CONFIGURATION.DRAFT;

    } else {
      lcAdvPreparationsaveRequest.statusId = CONFIGURATION.SUBMIT;

    }
    console.log(lcAdvPreparationsaveRequest)
    this.locService.LcAdvicePrepSave(lcAdvPreparationsaveRequest).subscribe(
      (res: any) => {
        if (res && res.status === 200 && res.result !== null) {
          this.toastr.success(MESSAGES.DATA_SAVED_MESSAGE);
          this.tabChangeOnSave(1)

          this.hdrId = res.result.id,
            this.sdId = res.result.locAdvcSdDto.sdId;

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
    if (this.hdrId == undefined || this.hdrId == NaN) {
      this.hdrId = null;
    }
    if (this.sdId == undefined || this.sdId == NaN) {
      this.sdId = null;
    }

    if (this.referenceNo == undefined || this.referenceNo == NaN) {
      this.referenceNo = ""
    }


    if (this.referenceDt == undefined || this.referenceNo == NaN) {
      this.referenceDt = ""
    }


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
      referenceDt: this.referenceDt,
      referenceNo: this.referenceNo,
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
      *
      * Get workFlowSaveData
      * @private
      * @return {*}
      * @memberof LcAdviceReceivedComponent
      */

  private wfUserReqSDDto() {
    const wfUserReqSDDto: wfUserReqSDDto[] = [];
    wfUserReqSDDto.push({
      branchId: null,
      menuId: this.menuId,
      officeId: this.officeId,
      postId: this.postId,
      pouId: this.lkPoOffUserId,
      userId: this.userId,
      wfRoleIds: this.wfRoleIds
    })

    return wfUserReqSDDto;
  }



  /**
   * Submit PopUp
   */
  submit() {

    this.deductionSave(FormActions.SUBMITTED)

  }




  deductionSave(formAction = FormActions.DRAFT) {

    let total = Number(this.directiveObject.totalexpenditureAmount(this.DetailPostingDataSource.data)) - Number(this.deductionDetailsForm.controls.deductionTotal.value);

    if (Number(total) >= 0) {
      const params = this.getDeductionFormDataParams();
      console.log(params)
      this.locService.getData(params, APIConst.LC_ADVICEPREPARATION.GET_DEDUCTION_SAVEDATA).subscribe(
        (res: any) => {
          console.log(res, 'Deduction Save')
          if (res && res.status === 200 && res.result !== null) {
            this.sdDeductionId = res.result.id
            this.toastr.success(MESSAGES.DATA_SAVED_MESSAGE);
            if (formAction === FormActions.SUBMITTED) {
              this.openWfPopup();
            }

          }
        })
    }

    else {
      this.toastr.error(MESSAGES.DEDUCTION_VALIDATION);
    }
  }

  getDeductionEditData() {
    const params = {
      actionStatus: this.isEditable,
      hdrId: this.hdrId,

    }
    console.log(params, 'deduction details edit view api input params')
    this.locService.getData(params, APIConst.LC_ADVICEPREPARATION.GET_DEDUCTION_DETAIL_EDIT_VIEW_DATA).subscribe(
      (res: any) => {
        if (res && res.status === 200 && res.result !== null) {
          this.hdrId = res.result.locAdviceHrdId;
          this.sdDeductionId = res.result.id;
          this.deductionDetailsForm.patchValue({ professionlTax: res.result.ptAmt ? res.result.ptAmt : 0.00 });
          this.deductionDetailsForm.patchValue({ laborClass: res.result.labourAmt ? res.result.labourAmt : 0.00 });
          this.deductionDetailsForm.patchValue({ allMh: res.result.forAllMhAmt ? res.result.forAllMhAmt : 0.00 });
          this.deductionDetailsForm.patchValue({ surCharge: res.result.surchargeAmt ? res.result.surchargeAmt : 0.00 });
          this.deductionDetailsForm.patchValue({ gpfClass: res.result.gpfClass4Amt ? res.result.gpfClass4Amt : 0.00 });
          this.deductionDetailsForm.patchValue({ cpf: res.result.cpfAmt ? res.result.cpfAmt : 0.00 });
          this.deductionDetailsForm.patchValue({ buildingRent: res.result.buildingRentAmt ? res.result.buildingRentAmt : 0.00 });
          this.deductionDetailsForm.patchValue({ governmentInsurance: res.result.govtInsuFundAmt ? res.result.govtInsuFundAmt : 0.00 });
          this.deductionDetailsForm.patchValue({ insuranceFund: res.result.insuranceFundAmt ? res.result.insuranceFundAmt : 0.00 });
          this.deductionDetailsForm.patchValue({ securityDeposit: res.result.securityDepositAmt ? res.result.securityDepositAmt : 0.00 });
          this.deductionDetailsForm.patchValue({ establishmentCharges: res.result.estdChargeAmt ? res.result.estdChargeAmt : 0.00 });
          this.deductionDetailsForm.patchValue({ machineryCharges: res.result.machineryChargeAmt ? res.result.machineryChargeAmt : 0.00 });
          this.deductionDetailsForm.patchValue({ incomeTax: res.result.itAmt ? res.result.itAmt : 0.00 });
          this.totalDeductionAmount();
        }
      })

  }

  getDeductionFormDataParams() {

    if (this.sdDeductionId == undefined || this.sdDeductionId == NaN) {
      this.sdDeductionId = null;
    }

    const params = {
      buildingRentAmt: Number(this.deductionDetailsForm.controls.buildingRent.value),
      cpfAmt: Number(this.deductionDetailsForm.controls.cpf.value),
      estdChargeAmt: Number(this.deductionDetailsForm.controls.establishmentCharges.value),
      forAllMhAmt: Number(this.deductionDetailsForm.controls.allMh.value),
      govtInsuFundAmt: Number(this.deductionDetailsForm.controls.governmentInsurance.value),
      gpfClass4Amt: Number(this.deductionDetailsForm.controls.gpfClass.value),
      id: this.sdDeductionId,
      insuranceFundAmt: Number(this.deductionDetailsForm.controls.insuranceFund.value),
      itAmt: Number(this.deductionDetailsForm.controls.incomeTax.value),
      labourAmt: Number(this.deductionDetailsForm.controls.laborClass.value),
      locAdviceHrdId: this.hdrId,
      machineryChargeAmt: Number(this.deductionDetailsForm.controls.machineryCharges.value),
      ptAmt: Number(this.deductionDetailsForm.controls.professionlTax.value),
      securityDepositAmt: Number(this.deductionDetailsForm.controls.securityDeposit.value),
      surchargeAmt: Number(this.deductionDetailsForm.controls.surCharge.value),
      curMenuId: this.menuId,
      formAction: null,
      closingBalance: (this.closingBalance()) ? this.closingBalance() : 0,
      netTotal: (this.netTotal()) ? this.netTotal() : 0,
      grossAmount: this.directiveObject.totalexpenditureAmount(this.DetailPostingDataSource.data),
      deductionTotal: this.deductionDetailsForm.controls.deductionTotal.value,
      openingBalance: this.openingBalance ? this.openingBalance : 0,
      newBalance: this.newBalance ? this.newBalance : 0

    }
    return params

  }



  resetDeductionForm() {
    if (this.sdDeductionId !== null && this.sdDeductionId !== undefined && this.sdDeductionId !== NaN) {
      this.getDeductionEditData()
    }
    else {
      this.deductionDetailsForm.reset()
    }
  }


  OnSaveAsDraft(formAction: FormActions = FormActions.DRAFT) {
    if (formAction === FormActions.SUBMITTED) {
      this.openWfPopup();
    }
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
        { label: 'Treasury Office', value: headerDetails.treasuryOffice },
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
          headingName: 'LC Advice Preparation',
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

            //isNew: 1
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
    this.locService.getAdvPrepWFSubmitDetails(params).subscribe(res => {
      if (res && res['status'] === 200) {
        if (!this.referenceNo) {

          const passData = {
            id: this.hdrId,

          };
          console.log(passData)
          this.locService.getAdvPrepHeaderData(passData).subscribe((resp: any) => {
            if (resp && resp.status === 200) {
              const headerDetails = _.cloneDeep(resp.result);

              const dialogRef = this.dialog.open(OkDialogComponent, {
                width: '360px',
                data: MESSAGES.REF_NO + headerDetails.referanceNumber
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
    if (this.listingUrl == undefined || this.listingUrl == null || this.listingUrl == '')
      this.router.navigate(['/dashboard/lc/lc-saved-advice'], { skipLocationChange: false });
    else {
      this.router.navigate([this.listingUrl], { skipLocationChange: false });

    }
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
    this.commonWorkflowService.getAttachmentList(param).subscribe((res) => {
      if (res && res['status'] === 200 && res['result'] && (res['result'].length > 0)) {
        this.attachmentTypeList = res['result'].filter(data => {
          data.id = data['attTypeId'].id;
          data.name = data['attTypeId'].name;
          data.isMandatory = data['attTypeId'].isMandatory;
          data.category = data['attTypeId'].category;
          return data;
        });
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

  netTotal() {
    let netTotal = Number(this.directiveObject.totalexpenditureAmount(this.DetailPostingDataSource.data)) - Number(this.deductionDetailsForm.controls.deductionTotal.value);
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
  closingBalance() {
    let netTotal = Number(this.openingBalance + this.newBalance) - Number(this.directiveObject.totalexpenditureAmount(this.DetailPostingDataSource.data));
    return parseFloat('' + netTotal).toFixed(2);

  }

  /** 
  * @description Method to show epayment and chequedetails
  * 
  * 
  * */
  showChequeEpayment(value) {
    console.log(value, ' show cheque epayment value is 944 or else')
    if (value === 944) {
      console.log('944')
      this.showChequeTable = true;
      this.showEpaymentTable = false;
      this.expandedElement = null;
      this.getLcAdviceChequebookData();
      if (this.mode == 'edit') {
        this.getEpaymentEditData();
      }

    } else {
      console.log('else')
      this.showChequeTable = false;
      this.showEpaymentTable = true;
      if (this.mode == 'edit') {
        this.getEpaymentEditData();
      }
      this.getLCAdviceChequetypelistDropdown();

    }

  }


  /** 
   * @description Method to get epayment Edit data
   * 
   * 
   * */

  getEpaymentEditData(value?) {

    const params = {

      id: this.hdrId,
      actionStatus: this.isEditable
    }
    this.locService.getData(params, APIConst.LC_ADVICEPREPARATION.GET_ADVICEPREP_EPAY_EDIT).subscribe((res: any) => {
      console.log("chequeEpayment");
      if (res && res.status === 200 && (res.result) != null && (res.result).length > 0) {
        this.chequeEpaymentsavedFlag = true;

        res.result.forEach(value => {
          value.isGenerateChequeNo = true;
          console.log(value.chequeDate)
          value.chequeDate = new Date(value.chequeDate)
        })
        if (this.showChequeTable)
          this.LcAdviceReceiptDataSource = new MatTableDataSource(res.result);

        else if (this.showEpaymentTable)
          this.LcAdviceReceiptEPaymentDataSource = new MatTableDataSource(res.result);

      }
    });
  }

  /** 
     * @description Method to get ChequeBookData
     * 
     * 
     * */

  getLcAdviceChequebookData() {
    const params = {
      departmentId: this.departmentId,
      districtId: this.districtId,
      cardexNo: this.cardexno,
      officeId: this.officeNameId,
      ddoNo: this.ddoNo

    }

    this.locService.getData(params, APIConst.LC_ADVICEPREPARATION.GET_ADVICEPREP_CHEQUEBOOK_DATA).subscribe((res: any) => {

      if (res && res.status === 200 && (res.result) != null) {
        this.lastChequeNumberUsed = res.result.lastChqNo;
        this.newChequeNumber = res.result.newChqNo;
        this.start = res.result.newChqNo
        this.end = res.result.chqSeriesEnd
        this.nextChqSeries = res.result.nextChqSeries;
        this.code = this.start.split("-")[0]
        this.startcheq = Number(this.start.split("-")[1])
        this.endcheq = Number(this.end.split("-")[1])
        this.usedseries = 0
        if (this.nextChqSeries.length > 0) {
          this.canuseseries = this.nextChqSeries.length - 1
          this.nextcode = (this.nextChqSeries[this.usedseries].chqSerStart).split("-")[0]
          this.nextStart = Number((this.nextChqSeries[this.usedseries].chqSerStart).split("-")[1])
          this.nextEnd = Number((this.nextChqSeries[this.usedseries].chqSeriesEnd).split("-")[1])
        }
        else {
          this.canuseseries = 0
        }
        this.calculate = Number(this.startcheq)
        if (this.LcAdviceReceiptDataSource.data.length == 0)
          this.addChequeRow()


      }
    });


  }

  /** 
   * @description Method to Add Check series
   * 
   * 
   * */

  onChequeSeriesAdd(element) {
    if (this.LcAdviceReceiptDataSource.data.length < 10) {
      if (element.vendorName && element.chequeAmount) {
        this.addChequeRow();
      }
      else {
        this.toastr.error(MESSAGES.ATTACHMENT.ERROR_FILL_DATA)
      }
    }
    else {
      this.toastr.error('Only 10 Records Per Transaction is Allowed!')

    }

  }



  /** 
   * @description Method to delete Epayment record
   * 
   * 
   * */

  deleteEPaymentRow(element, index) {


    if (element.sdId == null || element.sdId == undefined || element.sdId == NaN) {
      console.log('delete from ui for secondtab')
      this.spliceExistingDataOnDelete(element, index);
    }
    else {
      this.locService.deleteEpaymentRow(element.sdId).subscribe(
        (res: any) => {
          console.log(res.constructor, 'delete api result of second tab')
          if ((res && res.status === 200))
            this.toastr.success(res.message);

          this.spliceExistingDataOnDelete(element, index);
        });
    }
  }

  /** 
  * @description Method to splice existing data
  * 
  * 
  * */

  spliceExistingDataOnDelete(element, index) {

    if (this.showChequeTable) {
      this.LcAdviceReceiptDataSource.data.splice(index, 1);
      this.LcAdviceReceiptDataSource = new MatTableDataSource(this.LcAdviceReceiptDataSource.data);
      if (this.LcAdviceReceiptDataSource.data.length == 0)
        this.addChequeRow()

    }
    this.LcAdviceReceiptEPaymentDataSource.data.splice(index, 1);
    delete this.map[element.codeCheck]
    console.log(this.map)
    this.LcAdviceReceiptEPaymentDataSource = new MatTableDataSource(
      this.LcAdviceReceiptEPaymentDataSource.data
    );
  }


  /** 
  * @descriptionn get request params from form
  * 
  * 
  * */

  getFormDataParams() {

    const params = {
      adviceTypeId: this.lcPostingDetails.value.adviceType || 0,
      budgetType: this.lcAdviceReceivedForm1.value.budgetType ? this.lcAdviceReceivedForm1.value.budgetType.id : 0,
      chargedVoted: this.lcAdviceReceivedForm1.value.chargedVoted ? this.lcAdviceReceivedForm1.value.chargedVoted.code : '',
      ddoNo: this.lcPostingDetails.value.ddoNumber || '',
      demandId: this.lcAdviceReceivedForm1.value.demand ? this.lcAdviceReceivedForm1.value.demand.id : 0,
      detailHeadId: this.lcAdviceReceivedForm1.value.detailHead ? this.lcAdviceReceivedForm1.value.detailHead.id : 0,
      estimateType: this.lcAdviceReceivedForm1.value.typeOfEstimation ? this.lcAdviceReceivedForm1.value.typeOfEstimation.name : '',
      exemptType: "string",
      fundType: this.lcAdviceReceivedForm1.value.fundType ? this.lcAdviceReceivedForm1.value.fundType.name : '',
      itemId: this.lcAdviceReceivedForm1.value.itemName ? this.lcAdviceReceivedForm1.value.itemName.id : 0,
      lcNo: "string",
      majorheadId: this.lcAdviceReceivedForm1.value.majorHead ? this.lcAdviceReceivedForm1.value.majorHead.id : 0,
      minorheadId: this.lcAdviceReceivedForm1.value.minorHead ? this.lcAdviceReceivedForm1.value.minorHead.id : 0,
      objectClassId: this.lcAdviceReceivedForm1.value.objectClass ? this.lcAdviceReceivedForm1.value.objectClass.id : 0,
      schemeName: "string",
      subheadId: this.lcAdviceReceivedForm1.value.subHead ? this.lcAdviceReceivedForm1.value.subHead.id : 0,
      submajorheadId: this.lcAdviceReceivedForm1.value.subMajorHead ? this.lcAdviceReceivedForm1.value.subMajorHead.id : 0,
      specificBudgetType: this.lcAdviceReceivedForm1.value.specificbudgetType.viewValue || ''

    }
    return params

  }

  /** 
  * @description Method to fetch fund type list
  * 
  * 
  * */

  getFundTypeList() {
    const params = this.getFormDataParams()
    this.locService.getData(params, APIConst.LC_ADVICEPREPARATION.GET_FUNDTYPE_LIST).subscribe(
      (res: any) => {
        console.log(res, 'fund type list')
        if (res && res.status === 200 && res.result.length > 0) {
          this.FundList = res.result;
          this.FundList = _.orderBy(_.cloneDeep(res.result), 'name', 'asc');


        }
      })

  }

  /** 
  * @description Method to fetch chargedvoted list
  * 
  * 
  * */


  getChargeVotedList() {
    const params = this.getFormDataParams()
    this.locService.getData(params, APIConst.LC_ADVICEPREPARATION.GET_CHARGE_VOTED_LIST).subscribe(
      (res: any) => {
        console.log(res, 'charge voted list')
        if (res && res.status === 200 && res.result.length > 0) {
          res.result.forEach(value => {
            if ((value.name).toLowerCase() == 'charged')
              value.code = 'C'
            else if ((value.name).toLowerCase() == 'voted')
              value.code = 'V'
          })
          this.ClassOfExpenditureList = _.orderBy(_.cloneDeep(res.result), 'name', 'asc');

        }

      })
  }
  budgetChange() {
    this.lcAdviceReceivedForm1.get('specificbudgetType').reset()
    this.lcAdviceReceivedForm1.get('demand').reset();
    this.lcAdviceReceivedForm1.get('majorHead').reset();
    this.lcAdviceReceivedForm1.get('subMajorHead').reset();
    this.lcAdviceReceivedForm1.get('minorHead').reset();
    this.lcAdviceReceivedForm1.get('subHead').reset();
    this.lcAdviceReceivedForm1.get('detailHead').reset();
    this.lcAdviceReceivedForm1.get('typeOfEstimation').reset();
    this.lcAdviceReceivedForm1.get('itemName').reset();
    this.lcAdviceReceivedForm1.get('objectClass').reset();


    console.log(this.lcAdviceReceivedForm1.value.budgetType.name);
    if (this.lcAdviceReceivedForm1.value.budgetType.name == "100% Centrally Sponsored Scheme"
      || this.lcAdviceReceivedForm1.value.budgetType.id == 624) {
      this.lcAdviceReceivedForm1.get('specificbudgetType').setValue(this.specificBudgetTypeList[1])
      // this.lcAdviceReceivedForm1.patchValue({ specificBudgetType: this.specificBudgetTypeList[1] });
      this.budgetDisable = true;
      this.getDemandList()
    } else if (this.lcAdviceReceivedForm1.value.budgetType.name == "100% State Sponsored Scheme"
      || this.lcAdviceReceivedForm1.value.budgetType.id == 623) {
      this.lcAdviceReceivedForm1.get('specificbudgetType').setValue(this.specificBudgetTypeList[0])

      //this.lcAdviceReceivedForm1.patchValue({ specificBudgetType: this.specificBudgetTypeList[0]});
      this.budgetDisable = true;
      this.getDemandList()

    } else {
      this.budgetDisable = false;
    }
  }


  /** 
 * @description Method to fetch budgetType list
 * 
 * 
 * */


  getBudgetTypeList() {
    let list: any[] = []
    const params = this.getFormDataParams()
    this.locService.getData(params, APIConst.LC_ADVICEPREPARATION.GET_BUDGET_TYPE_LIST).subscribe(
      (res: any) => {
        console.log(res, 'budgetType list')
        if (res && res.status === 200 && res.result.length > 0) {
          this.BudgetTypeList = _.orderBy(_.cloneDeep(res.result), 'name', 'asc');

        }

      })

  }

  /** 
* @description Method to fetch demand list
* 
* 
* */


  getDemandList() {
    if (this.lcAdviceReceivedForm1.value.fundType.id == 1638 ||
      this.lcAdviceReceivedForm1.value.fundType.name == 'Public Account') {
      this.getMajorHeadList()
      this.publicAccoutFlag = true;
    }
    else
      this.publicAccoutFlag = false;

    if (this.lcAdviceReceivedForm1.value.budgetType.id &&
      this.lcAdviceReceivedForm1.value.chargedVoted.id && this.lcAdviceReceivedForm1.value.fundType.id) {
      this.lcAdviceReceivedForm1.get('demand').reset();
      this.lcAdviceReceivedForm1.get('majorHead').reset();
      this.lcAdviceReceivedForm1.get('subMajorHead').reset();
      this.lcAdviceReceivedForm1.get('minorHead').reset();
      this.lcAdviceReceivedForm1.get('subHead').reset();
      this.lcAdviceReceivedForm1.get('detailHead').reset();
      this.lcAdviceReceivedForm1.get('typeOfEstimation').reset();
      this.lcAdviceReceivedForm1.get('itemName').reset();
      this.lcAdviceReceivedForm1.get('objectClass').reset();

      this.DemandNoList = [];
      this.MajorHeadList = [];
      this.SubMajorHeadList = [];
      this.MinorHeadList = [];
      this.SubHeadList = [];
      this.DetailClassList = [];
      this.typeOfEstimationList = [];
      this.itemNameList = [];
      this.ObjectClassList = [];
      this.resetLcFields()

      const params = this.getFormDataParams()
      this.locService.getData(params, APIConst.LC_ADVICEPREPARATION.GET_DEMAND_LIST).subscribe(
        (res: any) => {
          console.log(res, 'demand list')
          if (res && res.status === 200 && res.result.length > 0) {
            this.DemandNoList = res['result'];
            if (res.result.length === 1) {
              this.lcAdviceReceivedForm1.get('demand').setValue(res['result'][0]);
              this.getMajorHeadList();
            }

          }

        })
    }
  }
  formDecimalPoint($event) {
    console.log($event)
    console.log($event.target.value)
    if ($event.target.value != null && $event.target.value != undefined
      && $event.target.value != '' && $event.target.value != NaN)
      $event.target.value = parseFloat($event.target.value).toFixed(2);
    else
      $event.target.value = 0
    $event.target.value = parseFloat($event.target.value).toFixed(2);

  }

  /** 
 * @description Method to fetch MajorHead list
 * 
 * 
 * */


  getMajorHeadList() {
    this.lcAdviceReceivedForm1.get('majorHead').reset();
    this.lcAdviceReceivedForm1.get('subMajorHead').reset();
    this.lcAdviceReceivedForm1.get('minorHead').reset();
    this.lcAdviceReceivedForm1.get('subHead').reset();
    this.lcAdviceReceivedForm1.get('detailHead').reset();
    this.lcAdviceReceivedForm1.get('typeOfEstimation').reset();
    this.lcAdviceReceivedForm1.get('itemName').reset();
    this.lcAdviceReceivedForm1.get('objectClass').reset();

    this.MajorHeadList = [];
    this.SubMajorHeadList = [];
    this.MinorHeadList = [];
    this.SubHeadList = [];
    this.DetailClassList = [];
    this.typeOfEstimationList = [];
    this.itemNameList = [];
    this.ObjectClassList = [];
    this.resetLcFields()

    const params = this.getFormDataParams()
    this.locService.getData(params, APIConst.LC_ADVICEPREPARATION.GET_MAJOR_HEAD_LIST).subscribe(
      (res: any) => {
        console.log(res, 'majorhead list')
        if (res && res.status === 200 && res.result.length > 0) {
          this.MajorHeadList = res['result'];

          if (res.result.length === 1) {
            this.lcAdviceReceivedForm1.get('majorHead').setValue(res['result'][0]);
            this.getSubMajorHeadList();
          }

        }

      })
  }

  /** 
 * @description Method to fetch subMajorHead list
 * 
 * 
 * */

  getSubMajorHeadList() {
    this.lcAdviceReceivedForm1.get('subMajorHead').reset();
    this.lcAdviceReceivedForm1.get('minorHead').reset();
    this.lcAdviceReceivedForm1.get('subHead').reset();
    this.lcAdviceReceivedForm1.get('detailHead').reset();
    this.lcAdviceReceivedForm1.get('typeOfEstimation').reset();
    this.lcAdviceReceivedForm1.get('itemName').reset();
    this.lcAdviceReceivedForm1.get('objectClass').reset();

    this.SubMajorHeadList = [];
    this.MinorHeadList = [];
    this.SubHeadList = [];
    this.DetailClassList = [];
    this.typeOfEstimationList = [];
    this.itemNameList = [];
    this.ObjectClassList = [];
    this.resetLcFields()

    const params = this.getFormDataParams()
    this.locService.getData(params, APIConst.LC_ADVICEPREPARATION.GET_SUB_MAJOR_HEAD_LIST).subscribe(
      (res: any) => {
        console.log(res, 'submajor head list')
        if (res && res.status === 200 && res.result.length > 0) {
          this.SubMajorHeadList = res.result;

          if (res.result.length === 1) {
            this.lcAdviceReceivedForm1.get('subMajorHead').setValue(res['result'][0]);
            this.getMinorHeadList();
          }

        }

      })
  }

  /** 
* @description Method to fetch Minorhead list
* 
* 
* */

  getMinorHeadList() {
    this.lcAdviceReceivedForm1.get('minorHead').reset();
    this.lcAdviceReceivedForm1.get('subHead').reset();
    this.lcAdviceReceivedForm1.get('detailHead').reset();
    this.lcAdviceReceivedForm1.get('typeOfEstimation').reset();
    this.lcAdviceReceivedForm1.get('itemName').reset();
    this.lcAdviceReceivedForm1.get('objectClass').reset();

    this.MinorHeadList = [];
    this.SubHeadList = [];
    this.DetailClassList = [];
    this.typeOfEstimationList = [];
    this.itemNameList = [];
    this.ObjectClassList = [];
    this.resetLcFields()

    const params = this.getFormDataParams()
    this.locService.getData(params, APIConst.LC_ADVICEPREPARATION.GET_MINOR_HEAD_LIST).subscribe(
      (res: any) => {
        console.log(res, 'minor head list')
        if (res && res.status === 200 && res.result.length > 0) {
          this.MinorHeadList = res.result;
          if (res.result.length === 1) {
            this.lcAdviceReceivedForm1.get('minorHead').setValue(res['result'][0]);
            this.getSubheadList();
          }

        }

      })
  }


  /** 
* @description Method to fetch subHead list
* 
* 
* */

  getSubheadList() {
    this.lcAdviceReceivedForm1.get('subHead').reset();
    this.lcAdviceReceivedForm1.get('detailHead').reset();
    this.lcAdviceReceivedForm1.get('typeOfEstimation').reset();
    this.lcAdviceReceivedForm1.get('itemName').reset();
    this.lcAdviceReceivedForm1.get('objectClass').reset();

    this.SubHeadList = [];
    this.DetailClassList = [];
    this.typeOfEstimationList = [];
    this.itemNameList = [];
    this.ObjectClassList = [];
    this.resetLcFields()

    const params = this.getFormDataParams()
    this.locService.getData(params, APIConst.LC_ADVICEPREPARATION.GET_SUB_HEAD_LIST).subscribe(
      (res: any) => {
        console.log(res, 'sub head list')
        if (res && res.status === 200 && res.result.length > 0) {
          this.SubHeadList = res.result;


          if (res.result.length === 1) {
            this.lcAdviceReceivedForm1.get('subHead').setValue(res['result'][0]);
            this.getDetailHeadList();
          }
        }

      })
  }


  /** 
* @description Method to fetch detailedHead list
* 
* 
* */

  getDetailHeadList() {
    this.lcAdviceReceivedForm1.get('detailHead').reset();
    this.lcAdviceReceivedForm1.get('typeOfEstimation').reset();
    this.lcAdviceReceivedForm1.get('itemName').reset();
    this.lcAdviceReceivedForm1.get('objectClass').reset();

    this.DetailClassList = [];
    this.typeOfEstimationList = [];
    this.itemNameList = [];
    this.ObjectClassList = [];
    this.resetLcFields()

    const params = this.getFormDataParams()
    this.locService.getData(params, APIConst.LC_ADVICEPREPARATION.GET_DETAIL_HEAD_LIST).subscribe(
      (res: any) => {
        console.log(res, 'detail head list')
        if (res && res.status === 200 && res.result.length > 0) {
          this.DetailClassList = res.result;

          if (res.result.length === 1) {
            this.lcAdviceReceivedForm1.get('detailHead').setValue(res['result'][0]);
            this.getBudgetEstimateTypeList();
          }

        }

      })

  }



  /** 
* @description Method to fetch BudgetEstimateType list
* 
* 
* */

  getBudgetEstimateTypeList() {
    this.lcAdviceReceivedForm1.get('typeOfEstimation').reset();
    this.lcAdviceReceivedForm1.get('itemName').reset();
    this.lcAdviceReceivedForm1.get('objectClass').reset();

    this.typeOfEstimationList = [];
    this.itemNameList = [];
    this.ObjectClassList = [];
    this.resetLcFields()

    const params = this.getFormDataParams()
    this.locService.getData(params, APIConst.LC_ADVICEPREPARATION.GET_BUDGET_ESTIMATE_TYPE_LIST).subscribe(
      (res: any) => {
        console.log(res, 'budget estimate type list')
        if (res && res.status === 200 && res.result.length > 0) {
          this.typeOfEstimationList = res.result;

          if (res.result.length === 1) {
            this.lcAdviceReceivedForm1.get('typeOfEstimation').setValue(res['result'][0]);
            this.getItemList();
          }

        }

      })
  }


  /** 
   * @description Method to fetch item list
   * 
   * 
   * */

  getItemList() {
    this.lcAdviceReceivedForm1.get('objectClass').reset();
    this.itemNameList = [];
    this.ObjectClassList = [];
    this.resetLcFields()

    const params = this.getFormDataParams()
    if (this.lcAdviceReceivedForm1.value.typeOfEstimation.name == "Standing Charges Estimates - Form B & G-i-A") {
      this.itemHideFlag = true;
      this.itemId = null;
      this.getObjectClassList();
    }
    else {
      this.itemHideFlag = false;
      this.itemId = (this.lcAdviceReceivedForm1.value.itemName) ? this.lcAdviceReceivedForm1.value.itemName.id : 0
      this.locService.getData(params, APIConst.LC_ADVICEPREPARATION.GET_ITEM_LIST).subscribe(
        (res: any) => {
          console.log(res, 'item list')
          if (res && res.status === 200 && res.result.length > 0) {
            this.itemNameList = res.result;
            if (res.result.length === 1) {
              this.lcAdviceReceivedForm1.get('itemName').setValue(res['result'][0]);
              this.getObjectClassList();
            }

          }

        })

    }

  }


  /** 
* @description Method to fetch objectClass list
* 
* 
* */
  getObjectClassList() {
    if (this.lcAdviceReceivedForm1.value.typeOfEstimation.name == "Standing Charges Estimates - Form B & G-i-A") {
      this.itemId = null
    }
    else {
      this.itemId = (this.lcAdviceReceivedForm1.value.itemName) ? this.lcAdviceReceivedForm1.value.itemName.id : 0
    }
    this.resetLcFields()

    const params = this.getFormDataParams()
    this.locService.getData(params, APIConst.LC_ADVICEPREPARATION.GET_OBJECT_CLASS_LIST).subscribe(
      res => {
        console.log(res, 'object class list')
        if (res && res['status'] === 200 && res['result'].length > 0) {
          this.ObjectClassList = res['result'];
          if (res['result'].length === 1) {
            this.lcAdviceReceivedForm1.get('objectClass').setValue(res['result'][0]);
          }

        }

      })
  }


  /** 
* @description Method to reset the data
* 
* 
* */

  resetLcFields() {
    this.lcAdviceReceivedForm1.get('lcNumber').reset();
    this.lcAdviceReceivedForm1.get('headwiseAmount').reset();
    this.lcAdviceReceivedForm1.get('expenditureAmount').reset();

  }

  getEditViewData() {
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
          this.getDeductionEditData();

          res.result.forEach(element => {
            if (element.fundType == 'Public Account') {
              this.budgetHeadCode = element.fundType + ":" + element.majorHeadName + ":" + element.subMajorHeadName + ":" +
                element.minorHeadName + ":" + element.subHeadName + ":" + element.detailHeadName
            }
            else {
              // instead of budgetType name ...new column should be replaced amountType budgetTypeName
              this.budgetHeadCode = element.fundType + ":" + element.classExpend + ":" + element.amountType + ":" +
                element.demandCode + ":" + element.majorHeadName + ":" + element.subMajorHeadName + ":" +
                element.minorHeadName + ":" + element.subHeadName + ":" + element.detailHeadName + ":" +
                element.typeOfEstimate + ":"
              console.log(this.budgetHeadCode)
              if (element.typeOfEstimate == "Standing Charges Estimates - Form B & G-i-A") {
                this.budgetHeadCode = this.budgetHeadCode + ":" + element.objectClass
                element.budgetHeadCode = this.budgetHeadCode
              }
              else {
                this.budgetHeadCode = this.budgetHeadCode + element.itemWorkName + ":" + element.objectClass
                element.budgetHeadCode = this.budgetHeadCode
              }
            }
            if (this.budgetHeadMap[this.budgetHeadCode] == null || this.budgetHeadMap[this.budgetHeadCode] == undefined) {
              this.budgetHeadMap[this.budgetHeadCode] = this.budgetHeadCode
            }

          })
          console.log(res.result)
          console.log(res.result[0]['ddoNo'])
          this.lcPostingDetails.patchValue({ ddoNumber: res.result[0]['ddoNo'] });

          this.DetailPostingDataSource = new MatTableDataSource(res.result);
        }
      })
  }
  postingDetailsSaveAndProcess() {
    var updateFlag = true;
    const params = [];
    this.DetailPostingDataSource.data.forEach(value => {
      if (value.expenditureAmount === '') {
        updateFlag = false;
      }
    })
    if (updateFlag) {
      this.DetailPostingDataSource.data.forEach(value => {
        params.push({
          id: value.id,
          expenditureAmt: value.expenditureAmount,
          headwiseAvailableAmt: value.availableAmount,
          lcNo: value.lcNumber
        })
      })
    }
    else {
      this.toastr.error('Please Fill out all Fields to Proceed')
    }


    this.locService.getData(params, APIConst.LC_ADVICEPREPARATION.POSTING_DETAILS_SAVE_AND_PROCESS).subscribe((res: any) => {
      console.log(res)
      if (res && res.status === 200) {
        this.toastr.success(MESSAGES.UPDATE_SUCCESS)
        // this.selectedTabIndex=3;
        // this.tabChangeOnSave(3)
        this.DetailPostingDataSource = new MatTableDataSource<any>(res.result);
        // this.tabChangeOnSave(3)
        setTimeout(() => {

          this.tabChangeOnSave(3)
        })

      }

    })


  }
  getOnAddData() {
    if (this.lcAdviceReceivedForm1.value.fundType.id == 1638 ||
      this.lcAdviceReceivedForm1.value.fundType.name == 'Public Account') {
      this.budgetHeadCode = this.lcAdviceReceivedForm1.value.fundType.name + ":" +
        this.lcAdviceReceivedForm1.value.majorHead.code + ":" +
        this.lcAdviceReceivedForm1.value.subMajorHead.code + ":" + this.lcAdviceReceivedForm1.value.minorHead.code + ":" +
        this.lcAdviceReceivedForm1.value.subHead.code + ":" + this.lcAdviceReceivedForm1.value.detailHead.code
    }
    else {
      this.budgetHeadCode = this.lcAdviceReceivedForm1.value.fundType.name + ":" +
        this.lcAdviceReceivedForm1.value.chargedVoted.name + ":" +
        // this.lcAdviceReceivedForm1.value.budgetType.name + ":" +
        this.lcAdviceReceivedForm1.value.specificbudgetType.viewValue + ":" +
        this.lcAdviceReceivedForm1.value.demand.code + ":" + this.lcAdviceReceivedForm1.value.majorHead.code + ":" +
        this.lcAdviceReceivedForm1.value.subMajorHead.code + ":" + this.lcAdviceReceivedForm1.value.minorHead.code + ":" +
        this.lcAdviceReceivedForm1.value.subHead.code + ":" + this.lcAdviceReceivedForm1.value.detailHead.code

      if (this.lcAdviceReceivedForm1.value.typeOfEstimation.name == "Standing Charges Estimates - Form B & G-i-A") {
        this.budgetHeadCode += ":" + this.lcAdviceReceivedForm1.value.typeOfEstimation.name + ":" +
          this.lcAdviceReceivedForm1.value.objectClass.code
        this.itemHideFlag = true;
      }
      else {
        this.budgetHeadCode += ":" + this.lcAdviceReceivedForm1.value.typeOfEstimation.name + ":" +
          this.lcAdviceReceivedForm1.value.itemName.code + ":" +
          this.lcAdviceReceivedForm1.value.objectClass.code
        this.itemHideFlag = false

      }
    }
    console.log(this.budgetHeadCode)
    console.log(this.budgetHeadMap[this.budgetHeadCode])
    if (this.budgetHeadMap[this.budgetHeadCode] == null || this.budgetHeadMap[this.budgetHeadCode] == undefined) {


      const passData = {
        // pageIndex: 0,//this.customPageIndex,
        // pageElement: 10,//this.pageElements,
        jsonArr: this.getFilterParams()
      };

      // const params=  this.getFilterParams() 
      console.log(passData, 'detail posting table data input params')
      this.locService.getData(passData, APIConst.LC_ADVICEPREPARATION.GET_POSTING_DETAILS_TABLE_LIST).subscribe(
        (res: any) => {
          console.log(res, 'detail posting table data result output')
          if (res && res['status'] === 200) {
            console.log(res['result'])
            if (res.result.result[0].hdrId != 0) {
              res.result.result[0].budgetHeadCode = this.budgetHeadCode
              this.budgetHeadMap[this.budgetHeadCode] = this.budgetHeadCode
              const p_data = this.DetailPostingDataSource.data;
              p_data.push(res.result.result[0])
              this.DetailPostingDataSource.data = p_data;
              console.log(this.DetailPostingDataSource.data)
              this.DetailPostingDataSource = new MatTableDataSource<any>(this.DetailPostingDataSource.data);
            }
          }
        })
    }
    else {
      this.toastr.error('The Combination Already Added, Please Add Unique Combination')
    }
  }

  getFilterParams() {
    const returnArray = [
      {
        key: "hdrId",
        value: this.hdrId
      },
      {
        key: "chargedVoted",
        value: this.lcAdviceReceivedForm1.value.chargedVoted ? this.lcAdviceReceivedForm1.value.chargedVoted.id : 0
      },
      {
        key: "demandId",
        value: this.lcAdviceReceivedForm1.value.demand ? this.lcAdviceReceivedForm1.value.demand.id : 0
      },
      {
        key: "majorHeadId",
        value: this.lcAdviceReceivedForm1.value.majorHead ? this.lcAdviceReceivedForm1.value.majorHead.id : 0
      },
      {
        key: "minorheadId",
        value: this.lcAdviceReceivedForm1.value.minorHead ? this.lcAdviceReceivedForm1.value.minorHead.id : 0
      },
      {
        key: "subheadId",
        value: this.lcAdviceReceivedForm1.value.subHead ? this.lcAdviceReceivedForm1.value.subHead.id : 0
      },
      {
        key: "submajorheadId",
        value: this.lcAdviceReceivedForm1.value.subMajorHead ? this.lcAdviceReceivedForm1.value.subMajorHead.id : 0
      },
      {
        key: "fundType",
        value: this.lcAdviceReceivedForm1.value.fundType ? this.lcAdviceReceivedForm1.value.fundType.id : 0
      },
      {
        key: "detailheadId",
        value: this.lcAdviceReceivedForm1.value.detailHead ? this.lcAdviceReceivedForm1.value.detailHead.id : 0
      },
      {
        key: "estimateTypeId",
        value: this.lcAdviceReceivedForm1.value.typeOfEstimation ? this.lcAdviceReceivedForm1.value.typeOfEstimation.id : 0
      },
      {
        key: "itemId",
        value: this.itemId || 0
      },
      {
        key: "objectClassId",
        value: this.lcAdviceReceivedForm1.value.objectClass ? this.lcAdviceReceivedForm1.value.objectClass.id : 0
      },
      {
        key: "budgetTypeId",
        value: this.lcAdviceReceivedForm1.value.budgetType ? this.lcAdviceReceivedForm1.value.budgetType.id : 0
      },
      {
        key: "exemptType",
        value: "non-exempt"
      },
      {
        key: "adviceTypeId",
        value: this.lcPostingDetails.value.adviceType || 0
      },
      {
        key: "ddoNo",
        value: this.lcPostingDetails.value.ddoNumber || 0
      },
      {
        key: "createdUpdatedBy",
        value: (this.lkPoOffUserId) ? this.lkPoOffUserId : 1//lkPOUId
      },
      {
        key: "createdUpdatedByPost",
        value: (this.postId) ? this.postId : 1//postId
      },
      {
        key: "lcNo",
        value: this.lcAdviceReceivedForm1.value.lcNumber || ''
      },
      {
        key: "expenditureAmnt",
        value: this.lcAdviceReceivedForm1.value.expenditureAmount || 0
      },
      {
        key: "headWiseAmnt",
        value: this.lcAdviceReceivedForm1.value.headwiseAmount || 0
      },
      {
        key: "specificBudgetType",
        value: this.lcAdviceReceivedForm1.value.specificbudgetType.viewValue || 0

      }

    ]

    return returnArray

  }
  validateCheqfields() {
    let isEntered = true, isValueZero = false
    this.LcAdviceReceiptDataSource.data.forEach(element => {
      if (element.vendorName === null || element.vendorName === undefined || element.vendorName === '' ||
        element.chequeAmount === null || element.chequeAmount === undefined || element.chequeAmount === '') {
        isEntered = false;
      }
      if (Number(element.chequeAmount) < 1)
        isValueZero = true;

    })
    if (isEntered && !isValueZero) {
      this.onGenerateChequeNo();
    }
    else if (!isEntered) {
      this.toastr.error("please enter partyName and CheqAmount values");
    }
    else if (isValueZero)
      this.toastr.error("Cheque Amount should be greater than or equal to One ");

  }
  addChequeRow() {
    const p_data = this.LcAdviceReceiptDataSource.data;
    p_data.push({
      chequeDate: null,
      chequeNo: '',
      vendorName: '',
      chequeAmount: '',
      isGenerateChequeNo: false,
    });
    this.LcAdviceReceiptDataSource.data = p_data;

  }
  deleteRow(index) {
    this.LcAdviceReceiptDataSource.data.splice(index, 1);
    this.LcAdviceReceiptDataSource = new MatTableDataSource(
      this.LcAdviceReceiptDataSource.data
    );
  }



  // Method to add row in ePayment Table
  addEPaymentRow() {
    const p_data = this.LcAdviceReceiptEPaymentDataSource.data;
    this.isInputEdpCode = false;
    this.isDelete = true;
    p_data.push({
      partyName: '',
      bankAccountNumber: '',
      IFSCCode: '',
      epaymentAmount: '0.00',
    });
    this.LcAdviceReceiptEPaymentDataSource.data = p_data;
  }


  // Method to delete row from Detail Posting Table
  deleteDetailsPostingRow(index, element) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '360px',
      data: MESSAGES.ATTACHMENT.DELETE_FILE
    });
    dialogRef.afterClosed().subscribe(confirmationResult => {
      if (confirmationResult === 'yes') {

        const params = {
          id: element.id
        }
        this.locService.getData(params, APIConst.LC_ADVICEPREPARATION.POSTING_DETAILS_DELETE).subscribe((res: any) => {
          console.log(res, 'delete apii')
          if (res && res.status == 200) {
            let i = 0;
            this.DetailPostingDataSource.data.splice(index, 1);
            this.DetailPostingDataSource.data.forEach(item => {
              item.index = i++;
            });
            delete this.budgetHeadMap[element.budgetHeadCode];
            this.DetailPostingDataSource = new MatTableDataSource(this.DetailPostingDataSource.data);
          }
        })

      }
    })
  }
  // Method to open map e-Payment dialog box
  mapEPayment(element) {
    console.log(element)
    if (this.showEpaymentTable) {

      const DATA = {
        tabledata: this.LcAdviceReceiptEPaymentDataSource.data,
        expenditureAmount: element.expenditureAmount,
        mode: this.mode,
        hdrId: this.hdrId,
        isEditable: 1
      }
      // tslint:disable-next-line: no-use-before-declare
      const dialogRef = this.dialog.open(MapEPaymentComponent, {
        width: '1000px',
        data: DATA,
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
        if (result && result.status == 200) {
          this.isEditable = 1;
          this.getEpaymentEditData()
        }
      });
    }
  }

  // Method to open Search Authorize Treasury dialog Box
  searchAuthorizeTreasury(element, type) {
    let DATA
    if (type == 'form') {
      DATA = {
        demandId: this.lcAdviceReceivedForm1.value.demand ? this.lcAdviceReceivedForm1.value.demand.id : 0,
        detailHeadId: this.lcAdviceReceivedForm1.value.detailHead ? this.lcAdviceReceivedForm1.value.detailHead.id : 0,
        estimateType: this.lcAdviceReceivedForm1.value.typeOfEstimation ? this.lcAdviceReceivedForm1.value.typeOfEstimation.name : null,
        itemId: this.lcAdviceReceivedForm1.value.itemName ? this.lcAdviceReceivedForm1.value.itemName.id : 0,
        majorheadId: this.lcAdviceReceivedForm1.value.majorHead ? this.lcAdviceReceivedForm1.value.majorHead.id : 0,
        minorheadId: this.lcAdviceReceivedForm1.value.minorHead ? this.lcAdviceReceivedForm1.value.minorHead.id : 0,
        objectClassId: this.lcAdviceReceivedForm1.value.objectClass ? this.lcAdviceReceivedForm1.value.objectClass.id : 0,
        subheadId: this.lcAdviceReceivedForm1.value.subHead ? this.lcAdviceReceivedForm1.value.subHead.id : 0,
        submajorheadId: this.lcAdviceReceivedForm1.value.subMajorHead ? this.lcAdviceReceivedForm1.value.subMajorHead.id : 0,
        budgetType: this.lcAdviceReceivedForm1.value.budgetType ? this.lcAdviceReceivedForm1.value.budgetType.id : 0,
        chargedVoted: this.lcAdviceReceivedForm1.value.chargedVoted ? this.lcAdviceReceivedForm1.value.chargedVoted.code : null,
        fundType: this.lcAdviceReceivedForm1.value.fundType ? this.lcAdviceReceivedForm1.value.fundType.name : null,
        ddoNo: this.ddoNo,
        specificBudgetType: this.lcAdviceReceivedForm1.value.specificbudgetType.viewValue || null,
        estimateTypeId: this.lcAdviceReceivedForm1.value.typeOfEstimation ? this.lcAdviceReceivedForm1.value.typeOfEstimation.id : 0,
        chargedVotedId: this.lcAdviceReceivedForm1.value.chargedVoted ? this.lcAdviceReceivedForm1.value.chargedVoted.id : null,
        fundTypeId: this.lcAdviceReceivedForm1.value.fundType ? this.lcAdviceReceivedForm1.value.fundType.id : null,




      }
    }
    else {
      DATA = {
        demandId: element.demandId,
        detailHeadId: element.detailHeadId,
        estimateType: element.typeOfEstimate,
        fundType: element.fundType,
        itemId: element.itemId,
        majorheadId: element.majorHeadId,
        minorheadId: element.minorHeadId,
        objectClassId: element.objectClassId,
        subheadId: element.subHeadId,
        submajorheadId: element.subMajorHeadId,
        budgetType: element.budgetTypeId,
        chargedVoted: (element.classExpend == 'Charged') ? 'C' : 'V',
        ddoNo: element.ddoNo,
        specificBudgetType: element.amountType,
        estimateTypeId: element.typeOfEstimateId,
        chargedVotedId: element.classExpendId,
        fundTypeId: element.fundTypeId


      }

    }
    // tslint:disable-next-line: no-use-before-declare
    const dialogRef = this.dialog.open(LcNumberDialogComponent, {
      width: '1000px',
      data: DATA,

    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (type == 'form') {
          let ststecssAmount
          (this.lcAdviceReceivedForm1.value.specificbudgetType.viewValue == 'State') ? (ststecssAmount = result[0].stateAmount) : (ststecssAmount = result[0].amount)
          this.lcAdviceReceivedForm1.patchValue({ headwiseAmount: ststecssAmount });
          this.lcAdviceReceivedForm1.get('expenditureAmount').reset();
          this.maxAvailableAmount = ststecssAmount
          this.lcAdviceReceivedForm1.patchValue({ lcNumber: result[0].lcOrderNo });
        }
        else {
          let ststecssAmount
          (element.amountType == 'State') ? (ststecssAmount = result[0].stateAmount) : (ststecssAmount = result[0].amount)
          element.lcNumber = result[0].lcOrderNo;
          element.availableAmount = ststecssAmount;
          element.expenditureAmount = null
        }
      }
    });
  }

  // Method to Calculate Total Deduction Amount
  totalDeductionAmount() {
    let deductionAmount = 0;

    deductionAmount =
      Number(this.deductionDetailsForm.controls.professionlTax.value) +
      Number(this.deductionDetailsForm.controls.laborClass.value) +
      Number(this.deductionDetailsForm.controls.allMh.value) +
      Number(this.deductionDetailsForm.controls.incomeTax.value) +
      Number(this.deductionDetailsForm.controls.surCharge.value) +
      Number(this.deductionDetailsForm.controls.gpfClass.value) +
      Number(this.deductionDetailsForm.controls.cpf.value) +
      Number(this.deductionDetailsForm.controls.buildingRent.value) +
      Number(this.deductionDetailsForm.controls.governmentInsurance.value) +
      Number(this.deductionDetailsForm.controls.insuranceFund.value) +
      Number(this.deductionDetailsForm.controls.securityDeposit.value) +
      Number(this.deductionDetailsForm.controls.establishmentCharges.value) +
      Number(this.deductionDetailsForm.controls.machineryCharges.value)

    this.deductionDetailsForm.controls.deductionTotal.patchValue(parseFloat('' + deductionAmount).toFixed(2));
  }

  // Method to Calculate total of Opening Balance and New Balance
  lcBalance() {
    return this.openingBalance + this.newBalance;
  }

  // Method to open Dialgbox of Advice Received
  checkDialog(event?: boolean, checkListTypeId?: any): void {
    if (checkListTypeId !== 1740) {
      console.log(checkListTypeId);
      // tslint:disable-next-line: no-use-before-declare
      const dialogRef = this.dialog.open(adviceReceiedDialogCheckList, {
        width: '1000px',
        data: {
          checkListTypeId: checkListTypeId,
          officeId: this.officeNameId,
          mode: this.mode,
          tableData: this.LcAdviceReceiptEPaymentDataSource.data,
          statusFlag: this.statusFlag,
        }

      });

      dialogRef.afterClosed().subscribe(result => {

        if (result) {
          let flag = true;
          const p_data = this.LcAdviceReceiptEPaymentDataSource.data;
          this.isInputEdpCode = false;
          this.isDelete = true;
          result.forEach(item => {
            let codeCheck = item.accNo + ":" + item.ifscCode;
            console.log(this.map);
            if ((this.map[codeCheck] === null || this.map[codeCheck] === undefined) && (item.codeCheck === null || item.codeCheck === undefined)) {
              p_data.push(item);
              this.map[codeCheck] = item
              item.codeCheck = codeCheck
              flag = false;
            }
          });
          if (flag) {
            this.toastr.error(" Combination already exists, please select the unique record ");
          }
          this.LcAdviceReceiptEPaymentDataSource.data = p_data;
          // this.tempData = this.LcAdviceReceiptEPaymentDataSource.data;
          // this.expandDataSource = new MatTableDataSource<Deduction>(this.tempData);
        }
      });
    } else {

      console.log(checkListTypeId);
      // tslint:disable-next-line: no-use-before-declare
      const dialogRef = this.dialog.open(AdviceReceivedEmployeeDialog, {
        width: '1000px',
        data: {
          checkListTypeId: checkListTypeId,
          officeId: this.officeNameId,
          mode: this.mode,
          tableData: this.LcAdviceReceiptEPaymentDataSource.data,
          statusFlag: this.statusFlag,

        }

      });

      dialogRef.afterClosed().subscribe(result => {
        const p_data = this.LcAdviceReceiptEPaymentDataSource.data;
        this.isInputEdpCode = false;
        this.isDelete = true;
        if (result) {
          let flag = true;

          result.forEach(item => {

            item.vendorName = item.empName;
            let codeCheck = item.accNo + ":" + item.ifscCode;
            console.log(this.map);
            if ((this.map[codeCheck] === null || this.map[codeCheck] === undefined) && (item.codeCheck === null || item.codeCheck === undefined)) {
              p_data.push(item);
              this.map[codeCheck] = item
              item.codeCheck = codeCheck
              flag = false
            }

          });
          if (flag) {
            this.toastr.error(" Combination already exists, please select the unique record ");
          }
        }
        this.LcAdviceReceiptEPaymentDataSource.data = p_data;
      });
    }
  }




  /**
      * Call save api
      *
      * @param {FormActions} [formAction=FormActions.DRAFT]
      * @memberof LcChequebookActivateInactivateComponent
      */
  saveEpaymentDetails(formAction: FormActions = FormActions.DRAFT) {
    const request = this.dtoList();
    this.locService.saveEpaymentDetails(request).subscribe(
      (res: any) => {
        if (res && res.status === 200 && res.result !== null) {
          this.toastr.success(MESSAGES.DATA_SAVED_MESSAGE);
          this.chequeEpaymentsavedFlag = true;
          this.statusFlag = true;
          setTimeout(() => {

            this.tabChangeOnSave(2)
          })
          this.ePaymentList = res.result
          if (this.showChequeTable) {
            res.result.forEach(element => {
              element.isGenerateChequeNo = true;
              element.chequeNo = element.chequeNo
              element.chequeAmount = (element.chequeAmnt) ? element.chequeAmnt : element.chequeAmount
              element.chequeDate = (element.chequeDt) ? (element.chequeDt) : element.chequeDate
              element.chequeDate = new Date(element.chequeDate)


            });
            this.LcAdviceReceiptDataSource = new MatTableDataSource(res.result);
          }
          else if (this.showEpaymentTable) {
            this.LcAdviceReceiptEPaymentDataSource = new MatTableDataSource(res.result);
          }

        } else {
          this.toastr.error(res.message);
        }
      },
      err => {
        this.toastr.error(err);
      }
    );
  }
  saveChequeDetails() {
    let userEnterFields = true, generateFields = true;

    this.LcAdviceReceiptDataSource.data.forEach(element => {
      if (!element.vendorName || !element.chequeAmount) {
        userEnterFields = false;
      }
      if (!element.chequeNo || !element.chequeDate) {
        generateFields = false;
      }
    })
    if (userEnterFields && generateFields) {
      this.saveEpaymentDetails();

    }
    else if (!generateFields) {
      this.toastr.error('Cheque Series Not Availble for All Records, Please Delete Remaining Records')
    }
    else if (!userEnterFields) {
      this.toastr.error(MESSAGES.ATTACHMENT.ERROR_FILL_DATA)
    }

  }
  totalEPaymentAmount(): number {
    let amount = 0;
    this.LcAdviceReceiptEPaymentDataSource.data.forEach((element, index) => {
      amount = amount + Number(element.epayAmnt);
    });
    return amount;

  }

  /**
     *
     * Get selected ChequeBook dtl list
     * @private
     * @return {*}
     * @memberof LcChequebookActivateInactivateComponent
     */
  private dtoList() {
    const dtoList: LocAdvcPrepCheqPaySdDto[] = [];

    if (this.showChequeTable) {
      this.LcAdviceReceiptDataSource.data.forEach((result: any) => {

        dtoList.push({

          // advcmonth: this.lcAdviceReceivedForm.value.month,
          adviceHdrId: this.hdrId,//mandatory
          accNo: null,
          chequeAmnt: result.chequeAmount,//----
          chequeDt: result.chequeDate,//=----
          chequeNo: result.chequeNo,//------
          epayAmnt: null,
          ifscCode: null,
          vendorName: result.vendorName,//-------
          // paymentType: this.lcAdviceReceivedForm.value.paymentType,//man
          sdId: (result.sdId) ? result.sdId : null,// this.epaySdId,
          statusId: 204,
          wfId: 1,
          wfRoleId: 1,
        });
      });
    }
    else if (this.showEpaymentTable) {

      this.LcAdviceReceiptEPaymentDataSource.data.forEach((result: any) => {

        dtoList.push({

          // advcmonth: this.lcAdviceReceivedForm.value.month,
          adviceHdrId: this.hdrId,//mandatory
          accNo: result.accNo,
          chequeAmnt: 0,//----
          chequeDt: null,//=----
          chequeNo: null,//------
          epayAmnt: result.epayAmnt,
          ifscCode: result.ifscCode,
          vendorName: result.vendorName,//-------
          // paymentType: this.lcAdviceReceivedForm.value.paymentType,//man
          sdId: (result.sdId) ? result.sdId : null,// this.epaySdId,
          statusId: 204,
          wfId: 1,
          wfRoleId: 1,
        });

      });
    }

    return dtoList;
  }

  // Method to Open Print Cheque Dialog
  onPrintCheque(): void {

    // tslint:disable-next-line: no-use-before-declare
    const dialogRef = this.dialog.open(PrintChequeDialog, {
      width: '1000px',
      data:
      {
        table: this.LcAdviceReceiptDataSource.data,
        id: this.hdrId,
        isEditable: this.isEditable
      }

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Print Cheque Dialog Closed');
    });
  }
  // generate cheque no.

  onGenerateChequeNo() {
    // tslint:disable-next-line: no-use-before-declare
    const dialogRef = this.dialog.open(GenerateChequeNoDialog, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'generateChequeNo') {
        this.generateCheque();
      } else {
      }
    });
  }

  // get tab index
  getTabIndex($event) {
    this.selectedTabIndex = $event;
  }
  /**
  * Tab Change
  *
  *
  * @memberOf LcAdviceReceivedComponent
  */


  tabChangeOnSave(index: number): void {
    setTimeout(() => {
      this.selectedTabIndex = index;
    })
  }
  reset() {
    this.lcAdviceReceivedForm1.reset();
    this.lcAdviceReceivedFormData1();

  }

  getLCAdviceChequetypelistDropdown() {
    this.locService.getLCAdviceChequetypelistDropdown().subscribe(
      (res: any) => {
        console.log(res);
        if (res && res.status === 200 && res.result.length > 0) {
          this.checkType = _.orderBy(_.cloneDeep(res.result), 'name', 'asc');

        }
      },
      err => {
        this.toastr.error(err['message']);
      }
    );
  }



}

/* Select LC Number */
@Component({
  selector: 'app-lc-number-dialog',
  templateUrl: 'lc-number-dialog.html',
  styleUrls: ['./lc-advice-received.component.css']
})

export class LcNumberDialogComponent implements OnInit {

  // Table Columns for LC Number Table
  LcNumberDataCoumn: string[] = [
    'lcOrderNo', 'demandNo', 'majorHead', 'amount'
  ];
  dialogData: any[] = [];

  dialogDataSource = new MatTableDataSource<any>(this.dialogData);

  isSearch: boolean;
  lcNumberForm: FormGroup;
  LcNumberDataSource = new MatTableDataSource<any>([]);
  userPostList: any
  currentUserData: any
  ddoNo: any
  paramsData: DialogData;
  amountType: any;
  map = {}
  constructor(
    public dialogRef: MatDialogRef<LcNumberDialogComponent>, private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any, private locService: LetterOfCreditService,
    private storageService: StorageService,

  ) {
    this.paramsData = data;
    this.amountType = this.data.specificBudgetType
  }

  ngOnInit(): void {
    this.lcNumberFormData();
    this.getLcSearchData();
  }
  getLcSearchData() {

    console.log(this.paramsData, ' detail posting lc search api input params')
    this.locService.getData(this.paramsData, APIConst.LC_ADVICEPREPARATION.GET_POSTING_DETAILS_LC_SEARCH).subscribe(
      (res: any) => {
        let lcnumberResult = res.result
        if (res.status == 200) {
          this.locService.getData(this.paramsData, APIConst.LC_ADVICEPREPARATION.LC_USED_AMOUNT_API).subscribe(
            (res: any) => {
              if (res.status == 200 && res.result.length > 0) {
                this.map = {}
                res.result.forEach(element => {
                  let key = element.lcNumber + ':' + element.amountType
                  this.map[key] = element.amount
                });
                lcnumberResult.forEach(data => {
                  let stateKey = data.lcNumber + ':' + 'State'
                  let CSSKey = data.lcNumber + ':' + 'CSS'
                  data.stateAmount = data.stateAmount - (this.map[stateKey] ? this.map[stateKey] : 0)
                  data.amount = data.amount - (this.map[CSSKey] ? this.map[CSSKey] : 0)

                });
              }
            })



          this.LcNumberDataSource = new MatTableDataSource<any>(lcnumberResult);
        }
      })
  }
  // Initialize Form Field
  lcNumberFormData() {
    this.lcNumberForm = this.fb.group({
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  onClickLCNo() {
    this.dialogRef.close(this.LcNumberDataSource.data);
  }
  onLcOrderNo(e) {
    this.dialogDataSource.data.push({
      lcOrderNo: e.lcNumber,
      stateAmount: e.stateAmount,
      amount: e.amount,
    });
    this.dialogRef.close(this.dialogDataSource.data);
  }
}

/* MAP Empayment Details Number */
@Component({
  selector: 'app-map-epayment-dialog',
  templateUrl: 'map-epayment-dialog.html',
  styleUrls: ['./lc-advice-received.component.css']
})

/** this is 2nd Tab chequetype/E-payment */


export class MapEPaymentComponent implements OnInit {

  tableData;
  // MapLcAdviceReceiptEPaymentDATAColumn: string[] = [
  //   'srno', 'partyName', 'bankAccountNumber', 'IFSCCode', 'epaymentAmount', 'action'
  // ];

  attachmentTypeCode: any[] = [];
  MapLcAdviceReceiptEPaymentDATAColumn: string[] = [
    'partyName', 'bankAccountNumber', 'IFSCCode', 'epaymentAmount'
  ];
  MapLcAdviceReceiptEPaymentDataSource = new MatTableDataSource<any>([]);
  //new MatTableDataSource<any>(this.LcAdviceReceiptEPaymentDATA);

  UnmapLcAdviceReceiptEPaymentDataSource = new MatTableDataSource<any>([]);
  UnmapLcAdviceReceiptEPaymentDATAColumn: string[] = [
    'partyName', 'bankAccountNumber', 'IFSCCode', 'epaymentAmount'
  ];

  expandDataColumn: string[] = [
    'partyName',
    'bankAccountNumber',
    'IFSCCode',
    'epaymentAmount',
  ];

  expandData: any[] = [];

  expandDataSource = new MatTableDataSource<Deduction>(this.expandData);
  expenditureAmt: any;
  dialogdata: any;
  mode: any;
  hdrId: any;
  isEditable: any

  constructor(
    public dialogRef: MatDialogRef<MapEPaymentComponent>,
    private el: ElementRef,
    private fb: FormBuilder,
    public dialog: MatDialog,
    public router: Router,
    private toastr: ToastrService,
    private storageService: StorageService,
    private activatedRoute: ActivatedRoute,
    private edpDdoOfficeService: EdpDdoOfficeService,
    private locService: LetterOfCreditService,
    private commonWorkflowService: CommonWorkflowService,
    //   @Inject(MAT_DIALOG_DATA) public data: DialogData,

    // ) {
    //   this.tableData = data;


    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // this.dialogdata=data
    this.expenditureAmt = data.expenditureAmount;
    this.mode = data.mode
    this.tableData = data.tabledata
    this.hdrId = data.hdrId
    this.isEditable = data.isEditable


    console.log(data, this.expenditureAmt, this.tableData, this.mode)

    console.log(data, this.expenditureAmt, this.tableData)
    if (this.tableData.length > 0) {
      this.expandData = this.tableData;
      this.expandDataSource = new MatTableDataSource<Deduction>(this.expandData);
    } else {
      this.expandDataSource = new MatTableDataSource<Deduction>(this.expandData);
    }


  }

  ngOnInit() {
    this.getMapData();
  }
  getMapData() {
    const params = {
      actionStatus: this.isEditable,
      hdrId: this.hdrId,
      headWiseId: 0
    }
    console.log(params, ' detai; posting map api input parameters')
    this.locService.getData(params, APIConst.LC_ADVICEPREPARATION.GET_POSTING_DETAILS_MAPDATA).subscribe
      (res => {
        console.log(res, ' detail posting map api result output')
        if (res['status'] == 200) {
          this.MapLcAdviceReceiptEPaymentDataSource = new MatTableDataSource<any>(res['result']);
        }
      })
  }
  ExpenditureAmtValidation(epaymentAmount) {
    let total: number = 0
    this.MapLcAdviceReceiptEPaymentDataSource.data.forEach(value => {
      total = total + Number(value[epaymentAmount])
    })

    this.MapLcAdviceReceiptEPaymentDataSource.data.forEach(value => {
      this.eachItemValidation(value, total)
    })
  }
  eachItemValidation(element, amount) {
    if (this.expenditureAmt < amount) {
      element['stateWrongValue'] = true;
    }
    else {
      element['stateWrongValue'] = false;
    }
  }
  decimalKeyPress(event: any) {
    const pattern = /^\d+(\.\d{0,2})?$/;
    const inputChar = String.fromCharCode(
      !event.charCode ? event.which : event.charCode
    );
    let tempstr = event.target.value;
    tempstr += inputChar;

    if (!pattern.test(tempstr)) {
      event.preventDefault();
      return false;
    }

  }
  decimalPoint(data, key) {
    if (data[key]) {
      data[key] = Number(data[key]).toFixed(2);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onUpdateClick(): void {
    this.dialogRef.close(this.expandDataSource.data);
  }
  onMapClick() {
    let toasterFlag = false;
    this.MapLcAdviceReceiptEPaymentDataSource.data.forEach(value => {
      if (value.stateWrongValue) {
        toasterFlag = true
      }
    })
    if (toasterFlag) {
      this.toastr.error('E-Payment is grater than Expenditure Amount');
    } else {
      this.onMapUpdate()

    }

  }
  onMapUpdate() {
    const params = [];
    this.MapLcAdviceReceiptEPaymentDataSource.data.forEach(value => {
      params.push(
        {
          epayAmnt: value.partyAmt,
          sdId: value.id
        })
    })
    this.locService.getData(params, APIConst.LC_ADVICEPREPARATION.POSTING_DETAILS_MAP_UPDATE).subscribe((res: any) => {
      console.log(res, 'map update api')
      if (res && res.status == 200) {
        this.onMapNoClick(res)

        this.toastr.success(MESSAGES.UPDATE_SUCCESS)
      }
    })
  }
  onMapNoClick(result) {
    this.dialogRef.close(result);
  }

  getLCAdviceChequetypelistDropdown() {
    this.locService.getLCAdviceChequetypelistDropdown().subscribe(
      res => {
        //const resValue = this.checkSucessApiResponse(res);
        console.log(res);
      },
      err => {
        this.toastr.error(err['message']);
      }
    );
  }

}




/**  Ended 2 Tab chequetype/E-payment  */

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-adviceReceivedDialogCheckList',
  templateUrl: 'adviceReceivedDialogCheckList.html',
  styleUrls: ['./lc-advice-received.component.css']
})
// tslint:disable-next-line: component-class-suffix
export class adviceReceiedDialogCheckList {

  // Table Data for For finding Cheque Details

  ELEMENT_DATA: adviceReceiveNonEmployee[] = [];
  LcAdviceReceiptEPaymentDATA: any[] = [
  ];


  ifscSame: Boolean;
  selectedParty = [];
  filterElement_Data: any[];
  smartSearch: FormGroup;
  dataSource = new MatTableDataSource<any>(this.ELEMENT_DATA);
  checkTypeNameCtrl: FormControl = new FormControl();
  @ViewChild(MatSort) sort: MatSort;

  // List of Check Type
  checkTypeNameList: any[] = [];
  selection = new SelectionModel<any>(true, []);
  designationList: any[] = [];
  employeeTypeList: any[] = [];
  nonEmployeeList: any[]
  map = {}
  error_message = 'Please enter valid format of PAN No. in format Like :  AAAAA1111A';
  isIFSCValid: boolean;
  chequeTypeCheck: FormControl = new FormControl();
  lcAdviceReceivedFormPaymentDetails: FormGroup;
  LcAdviceReceiptEPaymentDataSource = new MatTableDataSource<any>(this.LcAdviceReceiptEPaymentDATA);
  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    public router: Router,
    private el: ElementRef,
    public dialogRef: MatDialogRef<adviceReceiedDialogCheckList>,
    @Inject(MAT_DIALOG_DATA) public data: any, private toastr: ToastrService,
    private storageService: StorageService,
    private activatedRoute: ActivatedRoute,
    private edpDdoOfficeService: EdpDdoOfficeService,
    private locService: LetterOfCreditService,
    private commonWorkflowService: CommonWorkflowService,) { }

  // Create object to access Methods of Letter of Credit Directive
  directiveObject = new LetterOfCreditDirectives(this.router, this.dialog, this.el);

  // Table Colums for Finding Cheque Details Table
  displayedColumns: string[] = [
    'select',
    'partyName',
    'checkType',
    'bankAccountNumber',
    'IFSCCode',
    'bankBranchName',
    'panNo',
    'rateOfIncomeTax',
    'mobileNo'];

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnInit(): void {
    this.dataSource.sort = this.sort;
    this.smartSearch = this.fb.group({
      vendorName: [''],
      checkTypeName: [''],
      accountNoName: [''],
      ifscCode: [''],
      branchName: [''],
      panNoName: ['', Validators.pattern(/^([A-Z]){5}([0-9]){4}([A-Z]){1}?$/)],
      rateOfIncomeTax: [''],
      mobileNoName: ['']
    });

    this.dialogDropDown();
    this.onSearch();
  }


  dialogDropDown() {
    const params = {
      chqListTypeId: this.data.checkListTypeId,
      office: this.data.officeId,
    }
    console.log(params);
    this.locService.getData(params, APIConst.LC_ADVICEPREPARATION.PAYMENTDETAILS_DROPDOWN).subscribe((res: any) => {
      if (res && res.result && res.status === 200) {
        this.checkTypeNameList = res.result.chqTypeList;
      }
    })
  }



  onSearch() {

    if ((this.data.checkListTypeId != null) && (this.smartSearch.value.checkTypeName == "")) {

      const params = {
        officeId: this.data.officeId,
        bankAccNo: this.smartSearch.value.accountNoName || '',
        bankBranchName: this.smartSearch.value.branchName || '',
        chqListTypeId: this.data.checkListTypeId,
        designationId: 0,
        empName: '',
        empNo: 0,
        empType: '',
        gpfNo: '',
        ifscCode: this.smartSearch.value.ifscCode || '',
        incomeTaxRate: this.smartSearch.value.rateOfIncomeTax || 0,
        mobileNo: this.smartSearch.value.mobileNoName || 0,
        panNo: this.smartSearch.value.panNoName || '',
        vendorName: this.smartSearch.value.vendorName || ''

      }

      console.log(params);
      this.locService.getAdvPrepNonEmployeeList(params).subscribe((res: any) => {

        if (res && res['result'] && res['status'] === 200) {
          this.nonEmployeeList = _.cloneDeep(res['result']['dtlList']);
          if (this.data.mode == 'edit' || this.data.statusFlag) {
            this.data.tableData.forEach(element => {
              this.nonEmployeeList.forEach(record => {
                if (record.accNo == element.accNo && record.ifscCode == element.ifscCode) {
                  this.directiveObject.selection.select(record)

                  let codeCheck = record.accNo + ":" + record.ifscCode;
                  console.log(this.map);
                  if (this.map[codeCheck] === null || this.map[codeCheck] === undefined) {
                    record.codeCheck = codeCheck
                    this.map[codeCheck] = record;

                  }
                }


              });
            });

          }
          this.dataSource = new MatTableDataSource(this.nonEmployeeList)
        }
      })
    }

    else {

      const params = {
        officeId: this.data.officeId,
        bankAccNo: this.smartSearch.value.accountNoName || '',
        bankBranchName: this.smartSearch.value.branchName || '',
        chqListTypeId: this.smartSearch.value.checkTypeName ? this.smartSearch.value.checkTypeName : this.data.checkListTypeId, designationId: 0,
        empName: '',
        empNo: 0,
        empType: '',
        gpfNo: '',
        ifscCode: this.smartSearch.value.ifscCode || '',
        incomeTaxRate: this.smartSearch.value.rateOfIncomeTax || 0,
        mobileNo: this.smartSearch.value.mobileNoName || 0,
        panNo: this.smartSearch.value.panNoName || '',
        vendorName: this.smartSearch.value.vendorName || ''

      }

      console.log(params);
      this.locService.getAdvPrepNonEmployeeList(params).subscribe((res: any) => {

        if (res && res['result'] && res['status'] === 200) {
          this.nonEmployeeList = _.cloneDeep(res['result']['dtlList']);
          if (this.data.mode == 'edit' || this.data.statusFlag) {
            this.data.tableData.forEach(element => {
              this.nonEmployeeList.forEach(record => {
                if (record.accNo == element.accNo && record.ifscCode == element.ifscCode) {
                  this.directiveObject.selection.select(record);
                  let codeCheck = record.accNo + ":" + record.ifscCode;
                  console.log(this.map);
                  if (this.map[codeCheck] === null || this.map[codeCheck] === undefined) {
                    record.codeCheck = codeCheck
                    this.map[codeCheck] = record;

                  }

                }


              });
            });

          }

          this.dataSource = new MatTableDataSource(this.nonEmployeeList)
        }
      })

    }

  }


  checkIfsc() {
    const formVal = this.smartSearch.value;
    if (formVal.ifscCode !== '' && formVal.ifscCode != null) {
      this.filterElement_Data = this.nonEmployeeList.filter(
        searchByifscCode => searchByifscCode.ifscCode.toLowerCase() === formVal.ifscCode.toLowerCase());

      if (this.filterElement_Data.length !== 0) {
        this.isIFSCValid = true;
      } else {
        this.isIFSCValid = false;
      }
    }
  }

  get fc() {
    return this.smartSearch.controls;
  }

  clearForm() {
    this.smartSearch.reset();
    this.onSearch();
  }

  onAddAdvice(): void {
    this.dataSource.data.forEach(item => {
      if (this.directiveObject.selection.isSelected(item)) {
        this.selectedParty.push(item);
      }

    });
    if (this.directiveObject.selection.selected.length > 0) {
      this.dialogRef.close(this.selectedParty);
    }
    else {
      this.toastr.error(MESSAGES.SELECT_VALIDATION)
    }
  }
  onClose(): void {
    this.dialogRef.close();
  }
}


/** AdviceReceivedEmployeeDialog start */
@Component({
  // tslint:disable-next-line: component-selector
  templateUrl: 'advice-received-employee-dialog.html'
})
// tslint:disable-next-line: component-class-suffix
export class AdviceReceivedEmployeeDialog implements OnInit {

  selectionData: any[] = [];
  employeeTypeList: any[] = [];
  designationList: any[] = [];
  employeeList: any[] = [];
  elementData1: employeeDetails[] = [];
  // Table Data for Advice Receipt ePayment Table
  LcAdviceReceiptEPaymentDATA: any[] = [
  ];
  selectedParty: any[] = [];

  isIfscCodeValid: boolean;
  filterElementData: any[];
  map = {}
  smartSearch: FormGroup;
  dataSource = new MatTableDataSource<any>(this.elementData1);
  selection = new SelectionModel<any>(true, []);
  displayedColumns: string[] = [
    'select',
    'employeeNumber',
    'gpfNumber',
    'employeeName',
    'designation',
    'employeeType',
    'bankAccountNo',
    'ifscCode',
    'bankBranchName'];
  employeeTypeCtrl: FormControl = new FormControl();
  designationCtrl: FormControl = new FormControl();
  @ViewChild(MatSort) sort: MatSort;
  LcAdviceReceiptEPaymentDataSource = new MatTableDataSource<any>(this.LcAdviceReceiptEPaymentDATA);
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AdviceReceivedEmployeeDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any, private route: Router, private storageService: StorageService,
    private activatedRoute: ActivatedRoute,
    private edpDdoOfficeService: EdpDdoOfficeService,
    private locService: LetterOfCreditService,
    private commonWorkflowService: CommonWorkflowService,
    public dialog: MatDialog,
    public router: Router,
    private el: ElementRef, private toastr: ToastrService) { }

  directiveObject = new LetterOfCreditDirectives(this.router, this.dialog, this.el);

  ngOnInit(): void {
    this.dataSource.sort = this.sort;
    this.smartSearch = this.fb.group({

      employeeNumber: [''],
      gpfNumber: [''],
      employeeName: [''],
      designation: [''],
      employeeType: [''],
      accountNo: [''],
      ifscCode: [''],
      branchName: ['']
    });
    this.dialogDropDown();
    this.onSearch();
  }


  dialogDropDown() {
    const params = {
      chqListTypeId: this.data.checkListTypeId,
      office: this.data.officeId,
    }
    console.log(params);
    this.locService.getData(params, APIConst.LC_ADVICEPREPARATION.PAYMENTDETAILS_DROPDOWN).subscribe((res: any) => {
      if (res && res.result && res.status === 200) {
        this.employeeTypeList = res.result.empTypeList;
        this.designationList = res.result.designationList;
      }
    })
  }


  onSearch() {

    const params = {
      officeId: this.data.officeId,
      bankAccNo: this.smartSearch.value.accountNo || '',
      bankBranchName: this.smartSearch.value.branchName || '',
      chqListTypeId: this.data.checkListTypeId,
      designationId: this.smartSearch.value.designation || 0,
      empName: this.smartSearch.value.employeeName || '',
      empNo: this.smartSearch.value.employeeNumber || 0,
      empType: this.smartSearch.value.employeeType || '',
      gpfNo: this.smartSearch.value.gpfNumber || '',
      ifscCode: this.smartSearch.value.ifscCode || '',
      incomeTaxRate: this.smartSearch.value.rateOfIncomeTax || 0,
      mobileNo: this.smartSearch.value.mobileNoName || 0,
      panNo: this.smartSearch.value.panNoName || '',
      vendorName: this.smartSearch.value.vendorName || ''


    }

    console.log(params);
    this.locService.getAdvPrepNonEmployeeList(params).subscribe((res: any) => {

      if (res && res['result'] && res['status'] === 200) {
        this.employeeList = _.cloneDeep(res['result']['empDtlList']);
        if (this.data.mode == 'edit' || this.data.statusFlag) {
          this.data.tableData.forEach(element => {
            this.employeeList.forEach(record => {
              if (record.accNo == element.accNo && record.ifscCode == element.ifscCode) {
                this.directiveObject.selection.select(record);
                let codeCheck = record.accNo + ":" + record.ifscCode;
                console.log(this.map);
                if (this.map[codeCheck] === null || this.map[codeCheck] === undefined) {
                  record.codeCheck = codeCheck
                  this.map[codeCheck] = record;

                }

              }


            });
          });

        }
        this.dataSource = new MatTableDataSource(this.employeeList)
      }
    })




  }
  // on checking the checkbox
  onCheck(event, row) {
    if (event.checked) {
      if (this.selectionData.filter(e => e['accNo'] === row
      ['accNo']).length === 0) {
        if (this.data.mode == 'edit') {
          let codeCheck = row.accNo + ":" + row.ifscCode;
          row.codeCheck = codeCheck
          this.selectionData.push(row);

        }

        else {
          this.selectionData.push(row);
        }
      }
    } else {
      this.selectionData.splice(this.selectionData.findIndex(e => e['accNo'] === row
      ['accNo'], 1));
    }
  }


  onAddAdvice(): void {
    this.dataSource.data.forEach(item => {

      if (this.directiveObject.selection.isSelected(item)) {
        this.selectedParty.push(item);
      }
    });

    if (this.directiveObject.selection.selected.length > 0) {
      this.dialogRef.close(this.selectedParty);
    }
    else {
      this.toastr.error(MESSAGES.SELECT_VALIDATION)
    }

  }
  onClose(): void {
    this.dialogRef.close();
  }

  // check is ifsc valid
  checkIfsc() {
    const formVal = this.smartSearch.value;
    if (formVal.ifscCode !== '' && formVal.ifscCode != null) {
      this.filterElementData = this.employeeList.filter(
        searchByifscCode => searchByifscCode.ifscCode.toLowerCase() === formVal.ifscCode.toLowerCase());

      if (this.filterElementData.length !== 0) {
        this.isIfscCodeValid = true;
      } else {
        this.isIfscCodeValid = false;
      }
    }
  }

  // return control
  get fc() {
    return this.smartSearch.controls;
  }

  // reet the form
  clearForm() {
    this.smartSearch.reset();
    this.onSearch();
  }

  // close the pop-up
  onNoClick(): void {
    this.dialogRef.close();
  }

  // add to bill
  addToAdvice() {
    this.dialogRef.close(this.selectionData);
  }

}
/** AdviceReceivedEmployeeDialog end */

// Print Cheque Dialog Starts
@Component({
  templateUrl: './print-cheque-dialog.html',
})
// tslint:disable-next-line: component-class-suffix
export class PrintChequeDialog implements OnInit {

  // Table Data for printCheque


  LcAdviceReceiptDATA: AdviceReceipt[] = [];

  // Table Coulmn for printCheque
  printChequeColumn: string[] = [
    'select', 'chequeDate', 'chequeNo', 'partyName', 'chequeAmount', 'action'
  ];
  printChequeDataSource = new MatTableDataSource();
  // Directive
  directiveObj = new CommonDirective();


  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<PrintChequeDialog>,
    private locService: LetterOfCreditService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    console.log(this.directiveObj);
    console.log(this.data, "liuyiouuuuuu");
    const params = {
      id: this.data.id,
      actionStatus: this.data.isEditable
    }
    this.locService.getData(params, APIConst.LC_ADVICEPREPARATION.GET_ADVICEPREP_EPAY_EDIT).subscribe((res: any) => {
      console.log("chequeEpayment");
      if (res && res.status === 200 && (res.result) != null && (res.result).length > 0) {
        res.result.forEach(value => {
          value.chequeDate = new Date(value.chequeDate)
        })
        this.printChequeDataSource = new MatTableDataSource(res.result)
      }
    });
  }
  /**
     * Print method
     * @param element 
     */
  onDownloadprintClick(element) {
    const hdrId = this.data.hdrId;
    // const hdrId = 2;
    const params = {
      id: element.sdId
    }


    this.locService.adviceCheqEpaymentPrint(params).subscribe((res: any) => {
      if (res.status === 200) {
        this.locService.getPDF(res, null, this.toastr);
      } else {
        this.toastr.error(res.message);
      }
    });
  }


  // on no
  onClose() {
    this.dialogRef.close();
  }

}
// Print Cheque Dialog Ends

// Generate Cheque No Starts
@Component({
  templateUrl: './generate-cheque-no-dialog.html',
})
// tslint:disable-next-line: component-class-suffix
export class GenerateChequeNoDialog implements OnInit {
  generateChequeNoForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<GenerateChequeNoDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit(): void {
    this.generateChequeNoForm = this.fb.group({});
  }
  // on no
  onNo() {
    this.dialogRef.close('No');
  }

  // on yes
  onYes() {
    this.dialogRef.close('generateChequeNo');
  }
}
// Generate Cheque No Ends
