import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { lcMessage } from 'src/app/common/error-message/common-message.constants';
import { ChequeToChequeEffect } from './../model/letter-of-credit';
import { LetterOfCreditDirectives } from './../directive/letter-of-credit-directive';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { LetterOfCreditService } from '../service/letter-of-credit.service';
import { CommonWorkflowService } from '../../common/workflow-service/common-workflow.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { MESSAGES } from 'src/app/shared/constants/letter-of-credit/message-constants';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import * as _ from 'lodash';
import { APIConst } from 'src/app/shared/constants/letter-of-credit/letter-of-credit-api.constants';
import { GenerateChequeNoDialog, PrintChequeDialog } from '../lc-advice-received/lc-advice-received.component';
import { CONFIGURATION, FormActions, LocAdvcPrepCheqPaySdDto } from 'src/app/models/letter-of-credit/letter-of-credit';
import { ModuleNames } from '../../common/constant/common-workflow.constants';
import { LcCommonWorkflowComponent } from '../lc-common-workflow/lc-common-workflow.component';
import { OkDialogComponent } from 'src/app/shared/components/ok-dialog/ok-dialog.component';
import { DatePipe } from '@angular/common';
import { EdpDataConst } from 'src/app/shared/constants/edp/edp-data.constants';

@Component({
  selector: 'app-cheque-to-cheque-effect-division',
  templateUrl: './cheque-to-cheque-effect-division.component.html',
  styleUrls: ['./cheque-to-cheque-effect-division.component.css']
})

export class ChequeToChequeEffectDivisionComponent implements OnInit {

  // Table Data for Table Cheque To Cheque Effect
  ChequeToChequeEffectData: ChequeToChequeEffect[] = [
  ];

  // Table Columns for Table Cheque to cheque Effect
  ChequeToChequeEffectDataColumn: string[] = [
    'chequeDate', 'chequeNumber', 'chequeAmount', 'partyName', 'action'
  ];


  maxAttachment: number;
  firstName: any;
  todayDate = new Date();
  isEntered: boolean;
  startcheqseries: any;
  endcheqseries: any;
  nextchqseriesstart: any;
  cheqendnum: any;
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
  currentLang = 'Eng';
  generateFields: boolean = true;
  lastChequeNumberUsed = '';
  newChequeNumber = '';
  chequeToChequeEffectForm: FormGroup;
  ChequeToChequeEffectDataSource = new MatTableDataSource<ChequeToChequeEffect>(this.ChequeToChequeEffectData)
  errorMessage = lcMessage;
  subscribeParams: Subscription;
  mode: any;
  action: any;
  status: any;
  hdrId: any;
  checkEffectSdId: any;
  isEditable: any;
  linkMenuId: any;
  menuId: any;
  officeId: any;
  postId: any;
  lkPoOffUserId: any;
  userId: any;
  lcAdviceid: any;
  chequeDate:any
  bankId: any;
  cardexNo: any;
  isView: boolean = false
  ddoNo: any;
  divId: any;
  districtId: any;
  deptId: any;
  refNo: any;
  refDate: any;
  wfRoleIds: any;
  wfRoleCode: any;
  attachmentTypeList: any[] = [];
  fileBrowseIndex: number;
  constant = EdpDataConst;
  userName: any;
  selectedFilePreviewImageBase64: string;
  selectedFilePreviewPdf: string;
  totalAttachmentSize = 0;

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
  selectedIndex = 0;
  selectedTab = 0;
  attachmentTypeCodeCtrl: FormControl = new FormControl();
  @ViewChild('attachment', { static: true }) attachment: ElementRef;
  constructor(private fb: FormBuilder, private el: ElementRef, public dialog: MatDialog, private router: Router, private activatedRoute: ActivatedRoute, private locService: LetterOfCreditService, private commonWorkflowService: CommonWorkflowService, private storageService: StorageService,
    private toastr: ToastrService, public datepipe: DatePipe,) { }

  // Create object to access Methods of Letter of Credit Directive
  directiveObject = new LetterOfCreditDirectives(this.router, this.dialog, this.el);

  ngOnInit() {
    this.subscribeParams = this.activatedRoute.params.subscribe(resRoute => {
      this.mode = resRoute.mode;
      this.action = resRoute.action;
      this.status = resRoute.status;
      this.hdrId = resRoute.id;
      this.isEditable = resRoute.isEditable;
    });
    this.getCurrentUserDetail();
    this.maxAttachment = this.constant.MAX_ATTACHMENT;
    this.userName = this.storageService.get('userName');
    this.firstName = this.userName.split(' ')[1];
    this.chequeToChequeEffectFormData();

    if (this.mode == 'edit') {
      this.chequeToChequeEditView();
    }
  }

  /**
    * @description Get Current User Details
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



  onPrintCheque(): void {

    // tslint:disable-next-line: no-use-before-declare
    const dialogRef = this.dialog.open(PrintChequeDialog, {
      width: '1000px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Print Cheque Dialog Closed');
    });

  }

  submit() {

    this.saveAsDraft(FormActions.SUBMITTED);

  }

  saveAsDraft(formAction: FormActions = FormActions.DRAFT) {

    let userEnterFields = true, generateFields = true;

    this.ChequeToChequeEffectDataSource.data.forEach(element => {
      if (!element.partyName || !element.chequeAmnt) {
        userEnterFields = false;
      }
      if (!element.chequeNo || !element.chequeDate) {
        generateFields = false;
      }
    })
    if (userEnterFields && generateFields) {
      this.saveChequeToChequeEffect(formAction);

    }
    else if (!generateFields) {
      this.toastr.error('Cheque Series Not Availble for All Records, Please Delete Remaining Records')
    }
    else if (!userEnterFields) {
      this.toastr.error(MESSAGES.ATTACHMENT.ERROR_FILL_DATA)
    }


  }

  /**
    * Call save api
    *
    * @param {FormActions} [formAction=FormActions.DRAFT]
    * @memberof LcChequebookActivateInactivateComponent
    */
  saveChequeToChequeEffect(formAction: FormActions = FormActions.DRAFT) {

    let total = this.totalChequeAmount();

    if (Number(this.chequeToChequeEffectForm.controls['chequeAmount'].value) == Number(total)) {
      const request = this.dtoList();
      if (formAction === FormActions.DRAFT) {
        request.statusId = CONFIGURATION.DRAFT;

      } else {
        request.statusId = CONFIGURATION.SUBMIT;

      }
      console.log(request, 'save request for chequetocheque effect');
      this.locService.saveChequeToChequeEffect(request).subscribe(
        (res: any) => {
          console.log(res, 'Save Details')
          if (res && res.status === 200 && res.result !== null) {
            this.toastr.success(res.message);
            res.result.chequeTochequeSdDto.forEach(element => {
              element.isGenerateChequeNo = true;
              element.isDelete = false;
              element.chequeNo = element.chequeNo
              element.chequeAmnt = (element.chequeAmt) ? element.chequeAmt : element.chequeAmt
              element.chequeDate = (element.chequeDate) ? (element.chequeDate) : element.chequeDate
              element.chequeDate = new Date(element.chequeDate)


            });
            this.ChequeToChequeEffectDataSource = new MatTableDataSource(res.result.chequeTochequeSdDto);
            this.hdrId = res.result.id;
            this.lcAdviceid = res.result.lcAdviceid;

            if (formAction === FormActions.SUBMITTED) {
              this.openWfPopup();
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
    else {
      this.toastr.error(MESSAGES.CALCULATION_CHEQUE_AMT);
    }

  }




  /**
*
* Get totalHeadWiseAmount Calculation
* @return {*}
* @memberof LcChequebookActivateInactivateComponent 
*/

  totalChequeAmount(): number {
    let amount = 0;
    // tslint:disable-next-line:no-shadowed-variable
    this.ChequeToChequeEffectDataSource.data.forEach(element => {
      amount = amount + Number(element.chequeAmnt);
    });
    return amount;
  }



  chequeToChequeEditView() {
    const params = {

      hdrId: this.hdrId,
      actionStatus: this.isEditable
    }
    this.locService.getData(params, APIConst.LC_CHEQUE_TO_CHEQUE_EFFECT.EDITVIEW_CHEQUECANCEL).subscribe((res: any) => {
      console.log("chequeEpayment");
      if (res && res.status === 200 && (res.result) != null) {

        this.chequeToChequeEffectForm.patchValue({ divisionCode: res.result.divCode });
        this.chequeToChequeEffectForm.patchValue({ chequeAmount: Number(res.result.chequeAmt).toFixed(2) });
        
        this.chequeToChequeEffectForm.patchValue({ chequeDate: (res.result.chequeDate) ? this.datepipe.transform(res.result.chequeDate, 'dd-MMM-yyyy')
        : res.result.chequeDate });
        this.chequeToChequeEffectForm.patchValue({ partyName: res.result.partyName });
        this.chequeToChequeEffectForm.patchValue({ adviceNo: res.result.adviceNo });
        this.chequeToChequeEffectForm.patchValue({ missingChequeNumber: res.result.chequeNO });
        this.chequeToChequeEffectForm.patchValue({ reason: res.result.remarks });
        if ((this.wfRoleIds != 1)) {

          this.ChequeToChequeEffectDataColumn = [
            'chequeDate',
            'chequeNumber',
            'chequeAmount',
            'partyName'
          ];

        }
        this.lcAdviceid = res.result.lcAdviceId;
        this.bankId = res.result.bankId;
        this.cardexNo = res.result.cardexNo;
        this.ddoNo = res.result.ddoNo;
        this.divId = res.result.divId;
        this.districtId = res.result.districtId;
        this.deptId = res.result.deptId,
          this.hdrId = res.result.hdrId,
          this.refNo = res.result.refNo;
          this.chequeDate = res.result.chequeDate
        this.refDate = (res.result.refDate) ? (res.result.refDate) : '';
        res.result.chqList.forEach(value => {
          value.isGenerateChequeNo = true;
          value.isDelete = false;
          console.log(value.chequeDate)
         
          value.chequeDate = new Date(value.chequeDate)
          value.chequeNo = value.chequeNo
        })

        this.ChequeToChequeEffectDataSource = new MatTableDataSource(res.result.chqList);
        this.lastChequeNumberUsed = res.result.chequeSrchData.nextChqDtl.lastChqNo;
        this.newChequeNumber = res.result.chequeSrchData.nextChqDtl.newChqNo;
        this.start = res.result.chequeSrchData.nextChqDtl.newChqNo
        this.end = res.result.chequeSrchData.nextChqDtl.chqSeriesEnd
        this.nextChqSeries = res.result.chequeSrchData.nextChqDtl.nextChqSeries;
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
        if (this.ChequeToChequeEffectDataSource.data.length == 0)
          this.addChequeRow()

      }
      else {
        this.toastr.error(res.message);
      }
    });
  }


  deleteRow(element, index) {


    if (element.id == null || element.id == undefined || element.id == NaN) {
      console.log('delete ChequeData')
      this.spliceExistingDataOnDelete(element, index);
    }
    else {
      this.locService.deleteChequetocheque(element.id).subscribe(
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


    this.ChequeToChequeEffectDataSource.data.splice(index, 1);
    this.ChequeToChequeEffectDataSource = new MatTableDataSource(this.ChequeToChequeEffectDataSource.data);
    if (this.ChequeToChequeEffectDataSource.data.length == 0)
      this.addChequeRow()



  }

  /**
   * @description open work-flow popup
   */
  openWfPopup() {

    const passData = {
      id: this.hdrId
    };

    this.locService.getCheqEffectHeaderData(passData).subscribe((resp: any) => {

      const headerDetails = _.cloneDeep(resp.result);
      const headerJson = [
        { label: 'Missing Cheque No', value: (headerDetails.missingChequeNo) ? headerDetails.missingChequeNo : '' },
        { label: 'Cheque No', value: (headerDetails.chequeNo) ? headerDetails.chequeNo : '' },
        { label: 'Cheque Amount', value: headerDetails.chequeAmt ? Number(headerDetails.chequeAmt).toFixed(2) : '' },
        { label: 'Cheque Date', value: headerDetails.chequeDate ? (this.datepipe.transform(headerDetails.chequeDate, 'dd-MMM-yyyy HH:mm')) : '' },
        { label: 'In Favour of', value: headerDetails.inFavourOf ? headerDetails.inFavourOf : '' },
        { label: 'Advice No', value: headerDetails.adviceNo ? headerDetails.adviceNo : '' },
        { label: 'Advice Date', value: headerDetails.adviceDate ? (this.datepipe.transform(headerDetails.adviceDate, 'dd-MMM-yyyy HH:mm')) : '' },
        { label: 'Division Code', value: headerDetails.divisionCode ? headerDetails.divisionCode : '' },
        { label: 'Division Name', value: headerDetails.divisionName ? headerDetails.divisionName : '' },
        { label: 'Drawing Officer', value: headerDetails.drawingOfficeName ? headerDetails.drawingOfficeName : '' },

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
          headingName: 'LC Cheque to Cheque Effect',
          headerJson: headerJson,
          trnId: this.hdrId,
          moduleInfo: moduleInfo,
          refNo: headerDetails.refNo ? headerDetails.refNo : '',
          refDate: headerDetails.refDate ? headerDetails.refDate : '',
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
            isAg: true,
            isTo: true,
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
    this.locService.locChequeEffectWFSubmitDetails(params).subscribe((res: any) => {
      if (res && res.status === 200) {
        if (!this.refNo) {

          const passData = {

            id: this.hdrId
          };
          this.locService.getCheqEffectHeaderData(passData).subscribe((resp: any) => {
            if (resp && resp.status === 200) {
              const headerDetails = _.cloneDeep(resp.result);
              console.log(headerDetails)
              const dialogRef = this.dialog.open(OkDialogComponent, {
                width: '360px',
                data: MESSAGES.REF_NO + headerDetails.refNo
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
        this.toastr.error(res.message);
      }
    });
  }

  /**
  *
  * Get selected ChequeBook dtl list
  * @private
  * @return {*}
  * @memberof LcChequebookActivateInactivateComponent
  */


  dtoList() {


    if ((this.hdrId == NaN) || (this.hdrId == undefined)) {
      this.hdrId = null
    }

    if (this.refNo == undefined || this.refNo == NaN) {
      this.refNo = ""
    }


    if (this.refDate == undefined || this.refDate == NaN) {
      this.refDate = ""
    }

    const params = {

      id: this.hdrId,
      lcAdviceid: this.lcAdviceid,
      missingChequeNo: this.chequeToChequeEffectForm.controls['missingChequeNumber'].value,
      reason: this.chequeToChequeEffectForm.value.reason,
      referanceDate: this.refDate,
      referanceNumber: this.refNo,
      statusId: 0,
      wfId: 1,
      wfRoleId: 1,
      missingChequeAmt: Number(this.chequeToChequeEffectForm.value.chequeAmount),
      missingChequeDate: this.chequeDate,
      chequeTochequeSdDto: this.chequeTochequeSdDto(),
      wfUserReqDto: {
        branchId: null,
        menuId: this.linkMenuId,
        officeId: this.officeId,
        postId: this.postId,
        pouId: this.lkPoOffUserId,
        trnId: this.hdrId,
        userId: this.userId,
        wfRoleIds: this.wfRoleIds,
      }
    }
    return params;

  }

  /**
 *
 * Get chequeCancelSdDto
 * @private
 * @return {*}
 * @memberof ChequeCancelationDivisionComponent
 */
  private chequeTochequeSdDto() {
    const chequeTochequeSdDto: any[] = [];


    this.ChequeToChequeEffectDataSource.data.forEach((res: any) => {

      if ((this.hdrId == NaN) || (this.hdrId == undefined)) {
        this.hdrId = null
      }

      if ((res.id == NaN) || (res.id == undefined)) {
        res.id = null
      }
      chequeTochequeSdDto.push({

        hdrId: this.hdrId,
        id: res.id,
        chequeAmt: res.chequeAmnt,
        chequeDate: res.chequeDate,
        chequeNo: res.chequeNo,
        partyName: res.partyName,
        statusId: 0,
        wfId: 1,
        wfRoleId: 1
      });

    })

    return chequeTochequeSdDto;
  }

  gotoListing() {
    this.router.navigate(['/dashboard/lc/lc-cheque-to-cheque-effect-listing'], { skipLocationChange: true });
  }
  chequeToChequeEffectFormData() {
    this.chequeToChequeEffectForm = this.fb.group({
      missingChequeNumber: [''],
      divisionCode: [''],
      chequeAmount: [''],
      chequeDate: [''],
      partyName: [''],
      adviceNo: [''],
      reason: [''],
      chequeDateTable: [''],
      chequeNumberTable: [''],
      chequeAmountTable: [''],
      partyNameTable: ['']
    });
  }

  getTabIndex($event) {
    this.selectedIndex = $event.index;
    this.selectedTab = $event.index
    const temp = this.selectedIndex;
  }


  /**
        * Call On Click of Search Icon
        *
        *
        * @memberOf ChequeCancelationDivisionComponent
        */
  searchChequeNumber() {
    if (this.chequeToChequeEffectForm.controls['missingChequeNumber'].value != '') {
      this.chequeToChequeEffectForm.patchValue({
        missingChequeNumber: this.chequeToChequeEffectForm.controls['missingChequeNumber'].value,
      })
      const params = {
        missingChequeNo: this.chequeToChequeEffectForm.controls['missingChequeNumber'].value,
      }
      console.log(params)
      this.locService.getData(params, APIConst.LC_CHEQUE_TO_CHEQUE_EFFECT.GET_CHEQUEEFFECT_DATA).subscribe(
        (res: any) => {
          console.log(res, 'Cheque to Cheque Effect search response')
          if (res && res.result && res.status === 200) {
            this.chequeToChequeEffectForm.patchValue({ divisionCode: res.result.divCode });
            this.chequeToChequeEffectForm.patchValue({ chequeAmount: Number(res.result.chequeAmt).toFixed(2) });
            this.chequeToChequeEffectForm.patchValue({ chequeDate: (res.result.chequeDate) ? this.datepipe.transform(res.result.chequeDate, 'dd-MMM-yyyy')
            : res.result.chequeDate });
           
            this.chequeToChequeEffectForm.patchValue({ partyName: res.result.partyName });
            this.chequeToChequeEffectForm.patchValue({ adviceNo: res.result.adviceNo });
            this.lcAdviceid = res.result.lcAdviceId;
            this.chequeDate = res.result.chequeDate,
            this.bankId = res.result.bankId;
            this.cardexNo = res.result.cardexNo;
            this.ddoNo = res.result.ddoNo;
            this.divId = res.result.divId;
            this.districtId = res.result.districtId;
            this.deptId = res.result.deptId,
              //this.officeId = res.result.officeId;
              this.lastChequeNumberUsed = res.result.nextChqDtl.lastChqNo;
            this.newChequeNumber = res.result.nextChqDtl.newChqNo;
            this.start = res.result.nextChqDtl.newChqNo
            this.end = res.result.nextChqDtl.chqSeriesEnd
            this.nextChqSeries = res.result.nextChqDtl.nextChqSeries;
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
            if (this.ChequeToChequeEffectDataSource.data.length == 0)
              this.addChequeRow()


          }
          else {
            this.toastr.error(res.message);
          }
        })
    }
  }

  // Method to show table data on click on Search button
  search() {
    event.preventDefault();
    if (this.chequeToChequeEffectForm.controls['missingChequeNumber'].value != '') {
      this.chequeToChequeEffectForm.patchValue({
        chequeDateTable: new Date(2019, 4, 10),
        chequeNumberTable: 'AFR007-100098'
      });
    }
  }


  /** 
  * @description Method to Add Check series
  * 
  * 
  * */

  onChequeSeriesAdd(element) {
    if (this.ChequeToChequeEffectDataSource.data.length < 10) {
      if (element.partyName && element.chequeAmnt) {
        this.addChequeRow();
      }
    }
    else {
      this.toastr.error('Only 10 Records Per Transaction is Allowed!')

    }

  }

  addChequeRow() {
    const p_data = this.ChequeToChequeEffectDataSource.data;
    p_data.push({
      partyName: '',
      chequeDate: '',
      chequeNo: '',
      chequeAmnt: '',
      isGenerateChequeNo: false,
      isDelete: true,
    });
    this.ChequeToChequeEffectDataSource.data = p_data;

  }



  validateCheqfields() {
    this.isEntered = true;
    this.ChequeToChequeEffectDataSource.data.forEach(element => {
      if (element.partyName == null || element.partyName == undefined || element.partyName == '' ||
        element.chequeAmnt == null || element.chequeAmnt == undefined || element.chequeAmnt == '') {
        this.isEntered = false;
      }
    })
    if (this.isEntered) {
      this.onGenerateChequeNo();
    }
    else {
      this.toastr.error("please enter partyName and CheqAmount values");
    }
  }
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


  generateCheque() {
    this.ChequeToChequeEffectDataSource.data.forEach(item => {
      if (!item.isGenerateChequeNo) {
        if (this.endcheq >= this.calculate) {
          item.chequeNo = this.code + '-' + this.calculate
          item.chequeDate = this.todayDate,

            this.calculate = this.calculate + 1
          item.isGenerateChequeNo = true;
          item.isDelete = false;



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
              item.isDelete = false;
            }

          }
        }
      }
    })
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
   * @description Open file selector
   */
  openFileSelector(index: number) {
    this.el.nativeElement.querySelector('#fileBrowse').click();
    this.fileBrowseIndex = index;
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
              window.navigator.msSaveOrOpenBlob(blob, res.result.fileName);
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

  public toggleLanguage(): void {​​​​​​​​
  if (this.currentLang === 'Eng') {​​​​​​​​
  this.currentLang = 'Guj';
  return;
      }​​​​​​​​
  this.currentLang = 'Eng';
    }​​​​​​​​
  
  

  // ---------------------------------------------------
}
