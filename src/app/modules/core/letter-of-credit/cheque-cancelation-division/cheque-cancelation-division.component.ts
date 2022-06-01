import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { lcMessage } from 'src/app/common/error-message/common-message.constants';
import { ActivatedRoute, Router } from '@angular/router';
import { ChequeCancellation } from './../model/letter-of-credit';
import { LetterOfCreditDirectives } from './../directive/letter-of-credit-directive';
import { MatTableDataSource } from '@angular/material/table';
import { APIConst } from 'src/app/shared/constants/letter-of-credit/letter-of-credit-api.constants';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { LetterOfCreditService } from '../service/letter-of-credit.service';
import { CommonWorkflowService } from '../../common/workflow-service/common-workflow.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
declare function SetGujarati();
declare function SetEnglish();
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { CONFIGURATION, FormActions, LcSaveRequest, chequeCancelSdDto } from 'src/app/models/letter-of-credit/letter-of-credit';
import { ModuleNames } from '../../common/constant/common-workflow.constants';
import { MESSAGES } from 'src/app/shared/constants/letter-of-credit/message-constants';
import { OkDialogComponent } from 'src/app/shared/components/ok-dialog/ok-dialog.component';
import { LcCommonWorkflowComponent } from '../lc-common-workflow/lc-common-workflow.component';
import { EdpDataConst } from 'src/app/shared/constants/edp/edp-data.constants';


@Component({
  selector: 'app-cheque-cancelation-division',
  templateUrl: './cheque-cancelation-division.component.html',
  styleUrls: ['./cheque-cancelation-division.component.css']
})
export class ChequeCancelationDivisionComponent implements OnInit {



  // Table Column for Cheque Cancellation Table
  ChequeCancellationDataColumn: string[] = [
    'srno', 'fund', 'classOfExpenditure', 'budgetType', 'demandNo', 'majorHead', 'subMajorHead', 'minorHead', 'subHead', 'detailHead', 'typeOfEstimate', 'itemName',
    'objectHead', 'schemeNo', 'expenditureAmount', 'headwiseCancelChequeAmount'
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
  attachmentTypeCodeCtrl: FormControl = new FormControl();

  /**
    * pagination view child reference
    *
    * @type {attachment}
    * @memberof GTR5ToGTR6CreateComponent
    */

  @ViewChild('attachment', { static: true }) attachment: ElementRef;



  /**
     * Configuration for this file
     *
     *
     * @memberOf ChequeCancelationDivisionComponent
     */


  ChequeCancellationData: any[] = [];
  todayDate = new Date();
  errorChequeNumber = false;
  errorMessage = lcMessage;
  currentLang = 'Eng';
  subscribeParams: Subscription;
  mode: any;
  action: any;
  status: any;
  hdrId: any;
  sdCheckCancelId: any;
  bankId: any;
  lcAdvicePrepId: any;
  toOrSubToId: any;
  sdId: any;
  cardexNo: any;
  ddoNo: any;
  divId: any;
  isEditable: any;
  linkMenuId: any;
  wfRoleIds: any;
  wfRoleCode: any;
  menuId: any;
  officeId: any;
  postId: any;
  lkPoOffUserId: any;
  userId: any;
  refNo: any;
  refDate: any;
  chequeDate: any;
  cancellationTableDate: any[] = [];
  attachmentTypeList: any[] = [];
  fileBrowseIndex: number;
  constant = EdpDataConst;
  userName: any;
  selectedFilePreviewImageBase64: string;
  selectedFilePreviewPdf: string;
  totalAttachmentSize = 0;
  isView: boolean = false
  maxAttachment: number;

  /**
     * Form Group Instance
     *
     * @type {FormGroup}
     * @memberOf ChequeCancelationDivisionComponent
     */

  chequeCancellationForm: FormGroup;
  /**
   * Mat table instance
   *
   * @type {MatTableDataSource<any>}
   * @memberOf ChequeCancelationDivisionComponent
   */
  ChequeCancellationDataSource = new MatTableDataSource<any>(this.ChequeCancellationData);
  dataSourceBrowse = new MatTableDataSource([]);

  selectedIndex = 0;
  selectedTab = 0;
  isTreasuryFlag: boolean;
  currentUserData: any;
  userPostList: any;

  /**
    * Creates an instance of ChequeCancelationDivisionComponent.
    * @param {FormBuilder} fb
    * @param {LetterOfCreditService} locService
    * @param {StorageService} storageService
    * @param {CommonWorkflowService} commonWorkflowService
    * @param {ToastrService} toastr
    * @param {MatDialog} dialog
    * @param {Router} router
    * @param {ActivatedRoute} activatedRoute
    *
    * @memberOf ChequeCancelationDivisionComponent
    */

  constructor(private fb: FormBuilder, private el: ElementRef, public dialog: MatDialog, private router: Router, private locService: LetterOfCreditService, private commonWorkflowService: CommonWorkflowService, private storageService: StorageService,
    private toastr: ToastrService, private elem: ElementRef, private activatedRoute: ActivatedRoute, public datepipe: DatePipe) { }

  /** 
   * Create object to access Methods of Letter of Credit Directive
   * */
  directiveObject = new LetterOfCreditDirectives(this.router, this.dialog, this.el);

  /***********************Life cycle hooks methods start***********************************/


  /**
   * Life cycle hooks method
   *
   *
   * @memberOf ChequeCancelationDivisionComponent
   */

  ngOnInit() {
    this.currentUserData = this.storageService.get('currentUser');
    this.userPostList = this.currentUserData['post'];
    this.userPostList = this.userPostList.filter(row => row.loginPost == true)
    const userPostList = _.head(this.userPostList)



    this.subscribeParams = this.activatedRoute.params.subscribe(resRoute => {
      this.mode = resRoute.mode;
      this.action = resRoute.action;
      this.status = resRoute.status;
      this.hdrId = resRoute.id;
      this.isEditable = resRoute.isEditable;
    });
    this.maxAttachment = this.constant.MAX_ATTACHMENT;
    this.getCurrentUserDetail();
    this.userName = this.storageService.get('userName');
    this.chequeCancellationFormData();
    if (this.mode == 'edit') {
      this.chequeCancellationEditData();
    }
    if (userPostList['oauthTokenPostDTO']['edpMsOfficeDto'].isTreasury == 2) {
      this.isTreasuryFlag = true;
    } else
      this.isTreasuryFlag = false;


  }

  /***********************Life cycle hooks methods end***********************************/

  /***********************Public methods start***********************************/

  /**
   * Initialize formgroup
   *
   *
   * @memberOf ChequeCancelationDivisionComponent
   */

  chequeCancellationFormData() {
    this.chequeCancellationForm = this.fb.group({
      chequeNumber: [''],
      divisionCode: [''],
      chequeAmount: [''],
      chequeDate: [''],
      inFavourOf: [''],
      adviceNo: [''],
      reason: [''],
      classOfExpenditure: [''],
      fund: [''],
      budgetType: [''],
      schemeNo: [''],
      demandNo: [''],
      majorHead: [''],
      subMajorHead: [''],
      minorHead: [''],
      subHead: [''],
      detailHead: [''],
      typeOfEstimate: [''],
      itemName: [''],
      objectHead: [''],
      expenditureAmount: [''],
      headwiseCancelChequeAmount: ['']
    });
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
  /**
       * Call On Click of Search Icon
       *
       *
       * @memberOf ChequeCancelationDivisionComponent
       */
  searchChequeNumber() {
    if (this.chequeCancellationForm.controls['chequeNumber'].value != '') {
      this.chequeCancellationForm.patchValue({
        chequeNumber: this.chequeCancellationForm.controls['chequeNumber'].value,
      })
      const params = {
        chequeNO: this.chequeCancellationForm.controls['chequeNumber'].value,
      }
      console.log(params)
      this.locService.getData(params, APIConst.LC_CHEQUE_CANCEL.GET_CHEQUECANCEL_DATA).subscribe(
        (res: any) => {
          console.log(res, 'check cancellation search response')
          if (res && res.result && res.status === 200) {
            res.result.chequeDtlList.forEach(element => {
              if ((element.chargedVoted).toLowerCase() === 'c')
                element.chargedVoted = 'Charged'
              else if ((element.chargedVoted).toLowerCase() === 'v')
                element.chargedVoted = 'Voted'

            });
            this.chequeCancellationForm.patchValue({ divisionCode: res.result.divCode });
            this.chequeCancellationForm.patchValue({ chequeAmount: Number(res.result.chequeAmt).toFixed(2) });
            this.chequeCancellationForm.patchValue({
              chequeDate: (res.result.chequeDate) ? this.datepipe.transform(res.result.chequeDate, 'dd-MMM-yyyy')
                : res.result.chequeDate
            });
            this.chequeCancellationForm.patchValue({ inFavourOf: res.result.inFavour });
            this.chequeCancellationForm.patchValue({ adviceNo: res.result.adviceNo });
            this.lcAdvicePrepId = res.result.hdrId;
            this.bankId = res.result.bankId;
            this.cardexNo = res.result.cardexNo;
            this.ddoNo = res.result.ddoNo;
            this.divId = res.result.divId;
            this.chequeDate = res.result.chequeDate
            this.cancellationTableDate = _.cloneDeep(res.result.chequeDtlList);
            this.ChequeCancellationDataSource = new MatTableDataSource(res.result.chequeDtlList);


          }
          else {
            this.toastr.error(res.message);
          }
        })
    }
  }


  /**
       * Call save api with submit request
       *
       * @memberof ChequeCancelationDivisionComponent
       */
  submit() {
    this.saveChequeCancellation(FormActions.SUBMITTED);
  }


  /**
   * Call save api with Save request
   * 
   * @param formAction = FormActions.DRAFT
   * 
   *  @memberof ChequeCancelationDivisionComponent
   */

  saveChequeCancellation(formAction: FormActions = FormActions.DRAFT) {

    let total = this.totalHeadWiseAmount();

    if (Number(this.chequeCancellationForm.controls['chequeAmount'].value) == Number(total)) {
      const request = this.getLcChequeCancelData();
      request.formAction = formAction;
      if (formAction === FormActions.DRAFT) {
        request.statusId = CONFIGURATION.DRAFT;

      } else {
        request.statusId = CONFIGURATION.SUBMIT;

      }
      console.log(request)
      this.locService.saveLCChequeCancel(request).subscribe(
        (res: any) => {
          if (res && res.status === 200 && res.result !== null) {
            console.log(res)
            this.toastr.success(MESSAGES.DATA_SAVED_MESSAGE);
            this.hdrId = res.result.hdrId;
            this.lcAdvicePrepId = res.result.lcAdviceid;

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
      this.toastr.error(MESSAGES.CALCULATION_AMT);
    }

  }


  /**
   *
   * Get request to save 
   * @return {*}
   * @memberof ChequeCancelationDivisionComponent 
   */


  getLcChequeCancelData() {


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


      approvalDate: new Date(),
      bankID: this.bankId,
      chequeAmt: Number(this.chequeCancellationForm.value.chequeAmount),
      chequeDate: this.chequeDate,
      chequeNo: this.chequeCancellationForm.controls['chequeNumber'].value,
      divId: this.divId,
      formAction: '',
      hdrId: this.hdrId,
      inFavour: this.chequeCancellationForm.value.inFavourOf,
      lcAdviceid: this.lcAdvicePrepId,
      reason: this.chequeCancellationForm.value.reason,
      refDate: this.refDate,
      refNo: this.refNo,
      statusId: 0,
      wfId: 1,
      wfRoleId: 1,
      chequeCancelSdDto: this.chequeCancelSdDto(),
      wfUserReqDto: {
        branchId: null,
        menuId: this.linkMenuId,
        officeId: this.officeId,
        postId: this.postId,
        pouId: this.lkPoOffUserId,
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
  private chequeCancelSdDto() {
    const chequeCancelSdDto: chequeCancelSdDto[] = [];


    this.ChequeCancellationDataSource.data.forEach((res: any) => {

      if ((this.hdrId == NaN) || (this.hdrId == undefined)) {
        this.hdrId = null
      }

      if ((res.id == NaN) || (res.id == undefined)) {
        res.id = null
      }
      chequeCancelSdDto.push({

        adviceId: res.lcAdviceId,
        hdrId: this.hdrId,
        headCancelChqAmt: Number(res.hdCnclChqAmt),
        headWiseId: res.lcAdviceHeadwiseId,
        id: res.id,
        wfId: 1,
        wfRoleId: 1
      });

    })

    return chequeCancelSdDto;
  }

  /**
   * @description open work-flow popup
   */
  openWfPopup() {

    const passData = {
      id: this.hdrId
    };

    this.locService.getCheqCancelHeaderData(passData).subscribe((resp: any) => {

      const headerDetails = _.cloneDeep(resp.result);
      const headerJson = [
        { label: 'Cheque No', value: (headerDetails.chequeNo) ? headerDetails.chequeNo : '' },
        { label: 'Cheque Amount', value: headerDetails.chequeAmt ? Number(headerDetails.chequeAmt).toFixed(2) : '' },
        { label: 'Cheque Date', value: (headerDetails.chequeDate) ? this.datepipe.transform(headerDetails.chequeDate, 'dd-MMM-yyyy') : headerDetails.chequeDate },
        { label: 'In Favour of', value: headerDetails.inFavourOf ? headerDetails.inFavourOf : '' },
        { label: 'Advice No', value: headerDetails.adviceNo ? headerDetails.adviceNo : '' },
        { label: 'Advice Date', value: (headerDetails.adviceDate) ? this.datepipe.transform(headerDetails.adviceDate, 'dd-MMM-yyyy') : headerDetails.adviceDate },
        { label: 'Division Code', value: headerDetails.divisionCode ? headerDetails.divisionCode : '' },
        { label: 'Division Name', value: headerDetails.divisionName ? headerDetails.divisionName : '' },
        { label: 'Drawing Officer', value: headerDetails.drawingOfficeName ? headerDetails.drawingOfficeName : '' },
        { label: 'Cheque Cancellation Amount', value: headerDetails.chequeCancelAmt ? headerDetails.chequeCancelAmt : '' },

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
          headingName: 'LC Cheque Cancellation',
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
    this.locService.locChequeCancelWFSubmitDetails(params).subscribe((res: any) => {
      if (res && res.status === 200) {
        if (!this.refNo) {

          const passData = {

            id: this.hdrId
          };
          this.locService.getCheqCancelHeaderData(passData).subscribe((resp: any) => {
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
   * @description Go To Listing Page of cheque cancellation
   */
  gotoListing() {
    this.router.navigate(['/dashboard/lc/lc-cheque-cancelation-division-listing'], { skipLocationChange: true });
  }




  /**
   * call on Edit icon from listing page 
   * 
   * 
   * 
   * @memberof ChequeCancelationDivisionComponent 
   */

  chequeCancellationEditData() {
    const params = {
      actionStatus: this.isEditable,
      hdrId: this.hdrId,
      headWiseId: 0
    }
    console.log(params)
    this.locService.getData(params, APIConst.LC_CHEQUE_CANCEL.EDITVIEW_CHEQUECANCEL).subscribe(
      (res: any) => {
        console.log(res, 'check cancellation edit view api response')
        if (res && res.result && res.status === 200) {
          res.result.chequeDtlList.forEach(element => {
            if ((element.chargedVoted).toLowerCase() === 'c')
              element.chargedVoted = 'Charged'
            else if ((element.chargedVoted).toLowerCase() === 'v')
              element.chargedVoted = 'Voted'

          });
          this.chequeCancellationForm.patchValue({ divisionCode: res.result.divCode });
          this.chequeCancellationForm.patchValue({ chequeAmount: Number(res.result.chequeAmt).toFixed(2) });
          this.chequeCancellationForm.patchValue({
            chequeDate: (res.result.chequeDate) ? this.datepipe.transform(res.result.chequeDate, 'dd-MMM-yyyy')
              : res.result.chequeDate
          });
          this.chequeCancellationForm.patchValue({ inFavourOf: res.result.inFavour });
          this.chequeCancellationForm.patchValue({ adviceNo: res.result.adviceNo });
          this.chequeCancellationForm.patchValue({ chequeNumber: res.result.chequeNO });
          this.chequeCancellationForm.patchValue({ reason: res.result.reason });
          this.refNo = res.result.refNo;
          this.refDate = (res.result.refNoDate) ? (res.result.refNoDate) : '';
          this.bankId = res.result.bankID
          this.hdrId = res.result.hdrId
          this.divId = res.result.divId
          this.lcAdvicePrepId = res.result.lcAdviceId,
            this.chequeDate = res.result.chequeDate
          this.cancellationTableDate = _.cloneDeep(res.result.chequeDtlList);
          this.ChequeCancellationDataSource = new MatTableDataSource(this.cancellationTableDate);


        }
      })
  }


  /**
 *
 * Get totalHeadWiseAmount Calculation
 * @return {*}
 * @memberof LcChequebookActivateInactivateComponent 
 */

  totalHeadWiseAmount(): number {
    let amount = 0;
    // tslint:disable-next-line:no-shadowed-variable
    this.ChequeCancellationDataSource.data.forEach(element => {
      amount = amount + Number(element.hdCnclChqAmt);
    });
    return amount;
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

  getTabIndex($event) {
    this.selectedIndex = $event.index;
    this.selectedTab = $event.index
    const temp = this.selectedIndex;
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


  // ---------------------------------------------------


}


