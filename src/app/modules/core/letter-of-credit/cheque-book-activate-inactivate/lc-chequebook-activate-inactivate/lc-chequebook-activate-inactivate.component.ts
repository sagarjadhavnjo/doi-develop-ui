import { Component, OnInit, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { LetterOfCreditDirectives } from './../../directive/letter-of-credit-directive';
import { ModuleNames } from '../../../common/constant/common-workflow.constants';
import { LcCommonWorkflowComponent } from '../../lc-common-workflow/lc-common-workflow.component';
import { LetterOfCreditService } from '../../service/letter-of-credit.service';
import { APIConst } from 'src/app/shared/constants/letter-of-credit/letter-of-credit-api.constants';
import { CommonWorkflowService } from '../../../common/workflow-service/common-workflow.service';
import { ToastrService } from 'ngx-toastr';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';
import { MESSAGES } from 'src/app/shared/constants/letter-of-credit/message-constants';
import { OkDialogComponent } from 'src/app/shared/components/ok-dialog/ok-dialog.component';
import { InactivatedChequeInLC, ActivatedChequeInLC, NotActivateInLC, ListValue, LcSaveRequest, ChequeBookSdDto, wfUserReqDto, FormActions, CONFIGURATION } from 'src/app/models/letter-of-credit/letter-of-credit';
import { SelectionModel } from '@angular/cdk/collections';


@Component({
  selector: 'app-lc-chequebook-activate-inactivate',
  templateUrl: './lc-chequebook-activate-inactivate.component.html',
  styleUrls: ['./lc-chequebook-activate-inactivate.component.css']
})

export class LcChequebookActivateInactivateComponent implements OnInit {



  // Display Data for Not Activated In LC Table
  NotActivateInLCData: any[] = [

  ];

  // Data Column for Not Activated In LC Table
  NotActivateInLCDataColumn: string[] = [
    'select', 'srno', 'issueDate', 'startingChequeSeries', 'endingChequeSeries'
  ];

  // Display Data for Activated Cheque In LC Table
  ActivatedChequeInLCData: any[] = [

  ];

  // Data Column for Activated In LC Table
  ActivatedChequeInLCDataColumn: string[] = [
    'select', 'srno', 'activatedDate', 'startingChequeSeries', 'endingChequeSeries'
  ];

  // Display Data for Inactivated Cheque In LC Table
  InactivatedChequeInLCData: any[] = [

  ];

  // Data Column for Inactivated In LC Table
  InactivatedChequeInLCDataColumn: string[] = [
    'select', 'srno', 'inactivateDate', 'activatedDate', 'startingChequeSeries', 'endingChequeSeries'
  ];



  /**
     * Configuration for this file
     *
     *
     * @memberOf LcChequebookActivateInactivateComponent
     */


  workFlowData = 'fromLcChequebookActivateInactivate';
  todayDate = Date.now();
  divisionCodeValue = 'AFR007';
  divisionName = 'Dy. Con. Of Forest Training Center, Gandhinagar';
  bankName = 'State Bank Of India, Main Branch, Gandhinagar';
  bankAccountNo = '12345678912340';
  showTableVar = false;
  optionActivated = false;
  optionInactivated = false;
  isSearch: boolean;
  userPostList: any;
  currentUserData: any;
  departmentName: any;
  deptId: any;
  officeName: any;
  officeId: any;
  cardexNo: any;
  ddoNo: any;
  officeNameId: any;
  wfRoleIds: any;
  wfRoleCode: any;
  menuId: any;
  linkMenuId: any;
  postId: any;
  userId: any;
  lkPoOffUserId: any;
  attachmentTypeList: any[] = [];
  ChequeTypeList: any[] = [];
  RequestTypeList: any[] = [];
  refNo: any;
  refDate: any;
  ActivatedList: any[];
  InactivatedList: any[];
  ChequeList: any[];
  reqTypeId: number;
  getdetailsdisabled: boolean = false;
  hdrId: any;
  chequeBookSdDto: any[];
  subscribeParams: Subscription;
  mode: any;
  action: any;
  status: any;
  isEditable: any;
  avtiverecordsonedit: any;
  creatorflag: boolean = false;
  pushrecord: boolean;
  ChequeListRecordsOnEdit: any;
  inActivatedRecordsOnEdit: any;
  chequeBookList: any;
  divisionId: number;
  bankId: any;
  CheckbookSelectedList: any[] = [];
  alldataStartSeriesList: any;
  startseries: any;
  selectedSeriesMap = {};
  nonSelectedSeriesMap = {};
  selectionvalidation: boolean = false;
  selection = new SelectionModel<any>(true, []);

  /**
    * Form Group Instance
    *
    * @type {FormGroup}
    * @memberOf LcChequebookActivateInactivateComponent
    */

  lcChequeBookActivateInactivateForm: FormGroup;
  ChequeTypeCTRL: FormControl = new FormControl();
  RequestTypeCTRL: FormControl = new FormControl();
  /**
     * Mat table instance
     *
     * @type {MatTableDataSource<any>}
     * @memberOf LcChequebookActivateInactivateComponent
     */

  NotActivateInLCDataSource = new MatTableDataSource([]);
  ActivatedChequeInLCDataSource = new MatTableDataSource([]);
  InactivatedChequeInLCDataSource = new MatTableDataSource([]);



  /**
      * Creates an instance of LcChequebookActivateInactivateComponent.
      * @param {FormBuilder} fb
      * @param {LetterOfCreditService} locService
      * @param {StorageService} storageService
      * @param {CommonWorkflowService} commonWorkflowService
      * @param {ToastrService} toastr
      * @param {MatDialog} dialog
      * @param {Router} router
      * @param {ActivatedRoute} activatedRoute
      *
      * @memberOf LcChequebookActivateInactivateComponent
      */
  constructor(private fb: FormBuilder, private el: ElementRef, public dialog: MatDialog, private router: Router,
    private toastr: ToastrService, private storageService: StorageService, private activatedRoute: ActivatedRoute,
    private locService: LetterOfCreditService, private commonWorkflowService: CommonWorkflowService) { }

  /**
   * Create object to access Methods of Letter of Credit Directive
   */
  directiveObject = new LetterOfCreditDirectives(this.router, this.dialog, this.el);

  /***********************Life cycle hooks methods start***********************************/

  /**
   * Life cycle hooks method
   *
   *
   * @memberOf LcChequebookActivateInactivateComponent
   */

  ngOnInit() {
    this.subscribeParams = this.activatedRoute.params.subscribe(resRoute => {
      this.mode = resRoute.mode;
      this.action = resRoute.action;
      this.status = resRoute.status;
      this.hdrId = resRoute.id;
      this.isEditable = resRoute.isEditable
    })
    this.lcChequeBookActivateInactivateFormData();
    this.currentUserData = this.storageService.get('currentUser');
    this.userPostList = this.currentUserData['post'];
    this.userPostList = this.userPostList.filter(row => row.loginPost == true)
    const userPostList =  _.head(this.userPostList)

    this.officeNameId = userPostList['oauthTokenPostDTO']['edpMsOfficeDto'].officeId;
    this.cardexNo = userPostList['oauthTokenPostDTO']['edpMsOfficeDto'].cardexno;
    this.ddoNo = userPostList['oauthTokenPostDTO']['edpMsOfficeDto'].ddoNo;
    this.deptId = userPostList['oauthTokenPostDTO']['edpMsOfficeDto'].departmentId
    this.getCurrentUserDetail();
    this.getCheckBookLoadData();
  }

  /***********************Life cycle hooks methods end***********************************/

  /***********************Public methods start***********************************/



  /**
   * Initialize formgroup
   *
   *
   * @memberOf LcChequebookActivateInactivateComponent
   */
  lcChequeBookActivateInactivateFormData() {
    this.lcChequeBookActivateInactivateForm = this.fb.group({
      divisionCode: [''],
      chequeType: [''],
      requestType: [''],
      divisionName: [''],
      bankName: [''],
      bankAccountNo: ['']
    });
  }



  /**
      * Call On Click of Listing Button
      *
      *
      * @memberOf LcChequebookActivateInactivateComponent
      */
  ListForm() {
    this.router.navigate(['/lc/lc-chequebook-listing']);
  }



  /**
    * @description open work-flow popup
    */
  openWfPopup() {

    const passData = {
      id: this.hdrId
    };

    this.locService.getSubmitActionChequeDetails(passData).subscribe((res: any) => {
      const headerDetails = _.cloneDeep(res.result);
      const headerJson = [
        { label: 'Division Code', value: headerDetails.divCode },
        { label: 'Division Name', value: headerDetails.divName },
        { label: 'Bank Name', value: headerDetails.bankName },
        { label: 'Bank Account No', value: headerDetails.bankAccNo },
        { label: 'Cheque Type', value: headerDetails.chequeType },
        { label: 'Type of Request', value: headerDetails.reqType },

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
          headingName: 'LC Cheque Book Details',
          headerJson: headerJson,
          trnId: this.hdrId,
          moduleInfo: moduleInfo,
          refNo: headerDetails.refNo ? headerDetails.refNo : '',
          refDate: headerDetails.refDate ? headerDetails.refDate : '',
          conditionUrl: 'loc/chequeActInact/2001',
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
            assignToOfficeId:popUpRes.assignToOfficeId,
            assignToPouId:popUpRes.assignToPouId,
            menuId:this.linkMenuId,

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
    this.locService.locChequeWFSubmitDetails(params).subscribe((res: any) => {
      if (res && res.status === 200) {
        if (!this.refNo) {

          const passData = {

            id: this.hdrId
          };
          this.locService.getSubmitActionChequeDetails(passData).subscribe((resp: any) => {
            if (resp && resp.status === 200) {
              const headerDetails = _.cloneDeep(resp.result);
              this.refDate = headerDetails.refDate

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
   * @description Go To Listing Page of LOC
   */
  gotoListing() {
    this.router.navigate(['/dashboard/lc/lc-chequebook-listing'], { skipLocationChange: true });
  }


  /**
  * @description Print
  */


  printComponent(cmp) {

    window.print();

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

      }
    });
  }

   /**
     * @description Method to get attachment types.
     * @returns array object
     */

  getAttachmentTypes() {
    const param = {
      'categoryName': 'Transaction',
      'menuId': this.linkMenuId,
    };
    this.commonWorkflowService.getAttachmentList(param).subscribe((res) => {
      console.log(res);
      if (res && res['status'] === 200 && res['result'] && (res['result'].length > 0)) {
        console.log(' attachmentTypeList -' + JSON.stringify(res['result']));
        this.attachmentTypeList = res['result'].filter(data => {
          data.id = data['attTypeId'].id;
          data.name = data['attTypeId'].name;
          data.isMandatory = data['attTypeId'].isMandatory;
          data.category = data['attTypeId'].category;
          return data;
        });
        console.log(this.attachmentTypeList);

      }
    }, (err) => {
      this.toastr.error(err);
    });
  }

  /**
    * call on click of Generate button
    *
    *
    * @memberOf LcChequebookActivateInactivateComponent
    */


  getCheckBookLoadData() {
    console.log('get checkbookloaddata first api method');
    const params = {
      "deptId": this.deptId,
      "officeNameId": this.officeNameId,
      "cardexNo": this.cardexNo,
      "ddoNo": this.ddoNo

    }

    console.log(params);

    this.locService.getData(params, APIConst.CHECKBOOK_ACTIVE_INACTIVE.GET_CHEQUEBOOK_DATA).subscribe(
      (res: any) => {
        console.log(res, "CHECKING")
        if (res && res.result && res.status === 200) {
          console.log(res['result']);
          this.toastr.success(res.message);
          this.lcChequeBookActivateInactivateForm.patchValue({ divisionCode: res.result.divCode });
          this.lcChequeBookActivateInactivateForm.patchValue({ divisionName: res.result.divName });
          this.lcChequeBookActivateInactivateForm.patchValue({ bankName: res.result.bankName });
          this.lcChequeBookActivateInactivateForm.patchValue({ bankAccountNo: res.result.bankAccNo });
          this.divisionId = res.result.divId;
          this.bankId = res.result.bankId;


          if (this.ChequeTypeList.length == 1) {
            this.lcChequeBookActivateInactivateForm.controls.chequeType.setValue(this.ChequeTypeList[0].id);

          }
          this.ChequeTypeList = _.orderBy(_.cloneDeep(res.result.chequeTypeList), 'name', 'asc');
          this.RequestTypeList = _.orderBy(_.cloneDeep(res.result.reqTypeList), 'name', 'asc');

          if (this.RequestTypeList.length == 1) {
            this.lcChequeBookActivateInactivateForm.controls.requestType.setValue(this.RequestTypeList[0].id);

          }
          if (this.mode == 'edit') {
            this.edit();
          }

        }
      },
      err => {
        this.toastr.error(err);
      }
    );

  }


  /**
      * Call Edit api
      *
      * 
      * @memberof LcChequebookActivateInactivateComponent
      */


  edit() {
    const params = {
      actionStatus: this.isEditable,
      hdrId: this.hdrId
    }
    this.locService.getData(params, APIConst.CHECKBOOK_ACTIVE_INACTIVE.GET_EDIT_VIEW_DATA).subscribe(
      (res: any) => {
        console.log(res, 'result of edit');
        if (res && res.result && res.status === 200) {
          this.lcChequeBookActivateInactivateForm.disable();


          this.lcChequeBookActivateInactivateForm.patchValue({ divisionCode: res.result.divCode });
          this.lcChequeBookActivateInactivateForm.patchValue({ divisionName: res.result.divName });
          this.lcChequeBookActivateInactivateForm.patchValue({ bankName: res.result.bankName });
          this.lcChequeBookActivateInactivateForm.patchValue({ bankAccountNo: res.result.bankAccNo });
          this.divisionId = res.result.divId;
          this.bankId = res.result.bankBranchId;
          this.refNo = res.result.refNo;
          this.refDate = res.result.refDate;

          this.avtiverecordsonedit = res.result.chequeViewEditSdDto.locActiveList
          this.inActivatedRecordsOnEdit = res.result.chequeViewEditSdDto.locInActiveList
          this.ChequeListRecordsOnEdit = res.result.chequeViewEditSdDto.chqInvInActiveList
          this.ChequeTypeList.forEach(chequeType => {
            if (chequeType.id == res.result.chequeTypeId) {
              this.lcChequeBookActivateInactivateForm.controls.chequeType.setValue(chequeType.id);
            }
          })
          this.RequestTypeList.forEach(reqType => {
            if (reqType.id == res.result.reqTypeId) {
              this.lcChequeBookActivateInactivateForm.controls.requestType.setValue(reqType.id);
            }
          })
          this.showTable()
        }

      })

  }


  /**
      * Call Generate Action 
      *
      * 
      * @memberof LcChequebookActivateInactivateComponent
      */


  showTable() {
    this.ActivatedChequeInLCDataSource.data.forEach(row => this.selection.deselect(row));
    this.InactivatedChequeInLCDataSource.data.forEach(row => this.selection.deselect(row));
    this.NotActivateInLCDataSource.data.forEach(row => this.selection.deselect(row));

    this.ActivatedList = [];
    this.InactivatedList = [];
    this.ChequeList = [];

    this.ActivatedChequeInLCDataSource = new MatTableDataSource([])
    this.NotActivateInLCDataSource = new MatTableDataSource([])
    this.InactivatedChequeInLCDataSource = new MatTableDataSource([])

    const params = {
      "divId": this.divisionId,
      "bankAccNo": this.lcChequeBookActivateInactivateForm.value.bankAccountNo,
      "bankId": this.bankId,
      "reqTypeId": this.lcChequeBookActivateInactivateForm.value.requestType,
      "chequeTypeId": this.lcChequeBookActivateInactivateForm.value.chequeType
    }

    this.locService.getData(params, APIConst.CHECKBOOK_ACTIVE_INACTIVE.GET_CHEQUEBOOK_LIST_DATA).subscribe(
      (res: any) => {

        console.log(res, "CHECKING CHECKBOOKLISTDATA");
        if (res && res.result && res.status === 200) {
          if (params.reqTypeId == 1261) {
            this.ActivatedList = res.result.locActiveList;
            this.showTableVar = true;
            this.optionInactivated = true;
            this.optionActivated = false;
            if (this.mode === 'edit') {
              if ((this.status).toLowerCase() !='draft') {
                this.ActivatedChequeInLCDataSource = new MatTableDataSource(this.avtiverecordsonedit)
                this.ActivatedChequeInLCDataSource.data.forEach(row => this.selection.select(row));

              }
              else {
                this.avtiverecordsonedit.forEach(record => {
                  this.pushrecord = true;
                  this.ActivatedList.forEach(element => {
                    if (record.activeDate == element.activeDate && record.startSeries == element.startSeries && record.endSeries == element.endSeries) {
                      this.pushrecord = false;
                      element.id = record.id
                      this.selection.select(element)
                    }
                  });
                  if (this.pushrecord) {
                    this.ActivatedList.push(record)
                    this.selection.select(record)
                  }

                });
                this.ActivatedChequeInLCDataSource = new MatTableDataSource(this.ActivatedList)

              }
            }
            else {
              this.ActivatedChequeInLCDataSource = new MatTableDataSource(this.ActivatedList)



            }
          }

          else {

            this.InactivatedList = res.result.locInActiveList;
            this.ChequeList = res.result.chqInvInActiveList
            this.optionActivated = true;
            this.optionInactivated = false;

            this.showTableVar = true;
            if (this.mode === 'edit') {
              if ((this.status).toLowerCase() !='draft') {
                this.NotActivateInLCDataSource = new MatTableDataSource(this.ChequeListRecordsOnEdit)
                this.InactivatedChequeInLCDataSource = new MatTableDataSource(this.inActivatedRecordsOnEdit)

                this.NotActivateInLCDataSource.data.forEach(row => this.selection.select(row));
                this.InactivatedChequeInLCDataSource.data.forEach(row => this.selection.select(row));

              }
              else {
                this.inActivatedRecordsOnEdit.forEach(record => {
                  this.pushrecord = true;
                  this.InactivatedList.forEach(element => {
                    if (record.startSeries == element.startSeries && record.endSeries == element.endSeries
                      && record.issueDate == element.issueDate) {
                      this.pushrecord = false;
                      element.id = record.id
                      this.selection.select(element)
                    }
                  });
                  if (this.pushrecord) {
                    this.InactivatedList.push(record)
                    this.selection.select(record)
                  }
                });

                this.ChequeListRecordsOnEdit.forEach(record => {
                  this.pushrecord = true;
                  this.ChequeList.forEach(element => {
                    if (record.startSeries == element.startSeries && record.endSeries == element.endSeries
                      && record.inactiveDate == element.inActiveDate && record.activeDate == element.activeDate) {
                      this.pushrecord = false;
                      element.id = record.id
                      this.selection.select(element)
                    }
                  });
                  if (this.pushrecord) {
                    this.ChequeList.push(record)
                    this.selection.select(record)
                  }
                });

                this.NotActivateInLCDataSource = new MatTableDataSource(this.ChequeList)
                this.InactivatedChequeInLCDataSource = new MatTableDataSource(this.InactivatedList)

              }
            }
            else {
              this.NotActivateInLCDataSource = new MatTableDataSource(this.ChequeList)
              this.InactivatedChequeInLCDataSource = new MatTableDataSource(this.InactivatedList)



            }

          }

        }
      },

      err => {
        this.toastr.error(err);
      }

    );
  }


  /**
    * Call on click of Reset Button
    *
    *
    * @memberOf LcChequebookActivateInactivateComponent
    */

  checkbookactiveinactivereset() {
    this.lcChequeBookActivateInactivateForm.reset();
    this.lcChequeBookActivateInactivateFormData();
    this.getCheckBookLoadData();
    this.ActivatedChequeInLCDataSource = new MatTableDataSource([])
    this.NotActivateInLCDataSource = new MatTableDataSource([])
    this.InactivatedChequeInLCDataSource = new MatTableDataSource([])


  }


  /**
       * Call save api with submit request
       *
       * @memberof LcChequebookActivateInactivateComponent
       */
  onSubmit() {
    if ((this.selection.selected.length < 1)) {
      this.toastr.error(MESSAGES.ATTACHMENT.ATLEAST_ONE_UPLOAD);
    }
    else {
    this.validation(FormActions.SUBMITTED);
    }

  }

  /**
   * Call save api with draft request
   *
   * @memberof LcChequebookActivateInactivateComponent
   */
  onSaveAsDraft() {

    if ((this.selection.selected.length < 1)) {
      this.toastr.error(MESSAGES.ATTACHMENT.ATLEAST_ONE_UPLOAD);
    }
    else {

      this.validation(FormActions.DRAFT)
    }

  }

  /**
  * Call save api validation
  *
  * @memberof LcChequebookActivateInactivateComponent
  */

  validation(formAction: FormActions = FormActions.DRAFT) {
  if(this.optionActivated){
    this.CheckbookSelectedList = [];
    this.selectedSeriesMap = new Map()
    this.nonSelectedSeriesMap = new Map()
    for (const [key, value] of Object.entries(this.selectedSeriesMap)) {
      delete this.selectedSeriesMap[key];

    }
    for (const [key1, value1] of Object.entries(this.nonSelectedSeriesMap)) {
      delete this.nonSelectedSeriesMap[key1];
    }
    this.selectedSeriesMap = new Map()
    this.nonSelectedSeriesMap = new Map()

    this.selection.selected.forEach((record: any) => {
      this.startseries = record.startSeries.split('-')[1];
      if (this.selectedSeriesMap[this.startseries] == undefined || this.selectedSeriesMap[this.startseries] == null)
        this.selectedSeriesMap[this.startseries] = this.startseries
    })

    if (this.InactivatedChequeInLCDataSource.data.length > 0) {

      this.InactivatedChequeInLCDataSource.data.forEach((value: any) => {
        this.startseries = value.startSeries.split('-')[1];
        if (this.selectedSeriesMap[this.startseries] != this.startseries)
          this.nonSelectedSeriesMap[this.startseries] = this.startseries
      })
    }

    if (this.NotActivateInLCDataSource.data.length > 0) {
      this.NotActivateInLCDataSource.data.forEach((value: any) => {
        this.startseries = value.startSeries.split('-')[1];
        if (this.selectedSeriesMap[this.startseries] != this.startseries)
          this.nonSelectedSeriesMap[this.startseries] = this.startseries

      })
    }
   console.log(this.selectedSeriesMap, 'seleced')
    console.log(this.nonSelectedSeriesMap, 'non selected')
    this.selectionvalidation=false;
    for (const [key, value] of Object.entries(this.selectedSeriesMap)) {
      for (const [key1, value1] of Object.entries(this.nonSelectedSeriesMap)) {
        if (value > value1) {
          this.selectionvalidation = true;
        }
      }
    }
    if (this.selectionvalidation) {
      this.toastr.error('Please select lower cheque series before selecting the higher cheque series !')
    }
    else {
      this.callSaveOrSubmit(formAction);
    }

  }
  else{
    this.callSaveOrSubmit(formAction);

  }

  }


  /**
      * Call save api
      *
      * @param {FormActions} [formAction=FormActions.DRAFT]
      * @memberof LcChequebookActivateInactivateComponent
      */
  callSaveOrSubmit(formAction: FormActions = FormActions.DRAFT) {
    const request = this.getLcChequeData();
    request.formAction = formAction;
    if (formAction === FormActions.DRAFT) {
      request.statusId = CONFIGURATION.DRAFT;
    } else {
      request.statusId = CONFIGURATION.SUBMIT;
    }

    this.locService.saveLCChequeActiveInactive(request).subscribe(
      (res: any) => {
        if (res && res.status === 200 && res.result !== null) {
          this.toastr.success(MESSAGES.DATA_SAVED_MESSAGE);
          this.hdrId = res['result'].id,
            this.chequeBookList = res['result']['chequeBookSdDto']
          this.iDinsertion();
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
  /**
      * Call Id Insertion
      *
      *
      * @memberof LcChequebookActivateInactivateComponent
      */
  iDinsertion() {
    this.ActivatedList.forEach(record => {
      this.pushrecord = true;
      this.chequeBookList.forEach(element => {
        if (record.activeDate == element.activeDate && record.startSeries == element.startSeries && record.endSeries == element.endSeries) {
          this.pushrecord = false;
          record.id = element.id;
        }
      });
      if (this.pushrecord)
        record.id = null;


    });

  };
  /**
    *
    * Get request to save 
    * @return {*}
    * @memberof LcChequebookActivateInactivateComponent 
    */
  getLcChequeData() {
    const formValues = this.lcChequeBookActivateInactivateForm.getRawValue();

    if ((this.hdrId == NaN) || (this.hdrId == undefined)) {
      this.hdrId = null
    }
    const request: LcSaveRequest = {
      chequeTypeId: this.lcChequeBookActivateInactivateForm.value.chequeType,
      divId: this.divisionId,
      bankBranchId: this.bankId,
      bankAccNo: this.lcChequeBookActivateInactivateForm.value.bankAccountNo,
      reqTypeId: this.lcChequeBookActivateInactivateForm.value.requestType,
      statusId: 0,
      wfId: 1,
      wfRoleId: 1,
      id: this.hdrId,
      refNo:(this.refNo) ? this.refNo : '',
      refDate: this.refDate ? this.refDate :'',
      chequeBookSdDto: this.chequeBookSdD(),
      wfUserReqDto: this.wfUserReqDto(),

      formAction: null,

    };

    return request;
  }

  /**
    *
    * Get selected ChequeBook dtl list
    * @private
    * @return {*}
    * @memberof LcChequebookActivateInactivateComponent
    */
  private chequeBookSdD() {
    const chequeBookSdDto: ChequeBookSdDto[] = [];

    this.selection.selected.forEach((chk: any) => {

      if ((chk.id == NaN) || (chk.id == undefined)) {
        chk.id = null
      }

      if ((this.hdrId == NaN) || (this.hdrId == undefined)) {
        this.hdrId = null
      }

      chequeBookSdDto.push({
        startSeries: chk.startSeries,
        endSeries: chk.endSeries,
        issueDate: chk.issueDate,
        isActive: this.optionActivated ? "Y" :"N" ,//"Y",
        activeDate: chk.activeDate,
        inactiveDate: chk.inActiveDate,
        wfId: 1,
        wfRoleId: 1,
        id: chk.id,
        hdrId: this.hdrId

      });
    })
      ;

    return chequeBookSdDto;
  }

  /**
    *
    * Get wfUserRequestDTO
    * @private
    * @return {*}
    * @memberof LcChequebookActivateInactivateComponent
    */


  private wfUserReqDto() {
    const wfUserReqDto: wfUserReqDto[] = [];
    wfUserReqDto.push({
      menuId: this.linkMenuId,
      userId: this.userId,
      postId: this.postId,
      pouId: this.lkPoOffUserId,
      officeId: this.officeId,
      branchId: null,
      wfActionConfigId: 1
    })

    return wfUserReqDto;
  }

  /**
     * @description function is called for checkbox toggling
     * add and remove row based on checkbox selection
     */
  masterToggle() {
    console.log(this.ActivatedChequeInLCDataSource.data)
    this.isAllSelected() ?
      this.selection.clear() :
      this.ActivatedChequeInLCDataSource.data.forEach(row => this.selection.select(row));
  }

  /**
     * @description function is called for checkbox toggling
     * add and remove row based on checkbox selection/deselection
     */

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} `;
  }

  /**
    * @description function is called for checkbox toggling
    * add and remove row based on checkbox selection or either select All
    */

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.ActivatedChequeInLCDataSource.data.length;
    return numSelected === numRows;
  }

  /**
   * @description function is called for checkbox toggling
   * add and remove row based on checkbox selection
   */

  masterToggle1() {
    this.isAllSelected1() ?
      this.selection.clear() :
      this.NotActivateInLCDataSource.data.forEach(row => this.selection.select(row));
  }

  /**
    * @description function is called for checkbox toggling
    * add and remove row based on checkbox selection
    */

  checkboxLabel1(row?: any): string {
    if (!row) {
      return `${this.isAllSelected1() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} `;
  }

  /**
    * @description function is called for checkbox toggling
    * add and remove row based on checkbox selection/all select
    */

  isAllSelected1() {
    const numSelected = this.selection.selected.length;
    const numRows = this.NotActivateInLCDataSource.data.length;
    return numSelected === numRows;
  }


  /**
      * @description function is called for checkbox toggling
      * add and remove row based on checkbox selection
      */

  masterToggle2() {
    this.isAllSelected2() ?
      this.selection.clear() :
      this.InactivatedChequeInLCDataSource.data.forEach(row => this.selection.select(row));
  }


  /**
    * @description function is called for checkbox toggling
    * add and remove row based on checkbox selection/deslection
    */


  checkboxLabel2(row?: any): string {
    if (!row) {
      return `${this.isAllSelected2() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} `;
  }

  /**
    * @description function is called for checkbox toggling
    * add and remove row based on checkbox selection/all select
    */

  isAllSelected2() {
    const numSelected = this.selection.selected.length;
    const numRows = this.InactivatedChequeInLCDataSource.data.length;
    return numSelected === numRows;
  }

}


