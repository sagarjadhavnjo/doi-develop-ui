import { Component, OnInit, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ListValue, NotActivateInLC, ActivatedChequeInLC } from './../../model/letter-of-credit';
import { LetterOfCreditDirectives } from './../../directive/letter-of-credit-directive';
import { MatTableDataSource } from '@angular/material/table';
import { LetterOfCreditService } from '../../service/letter-of-credit.service';
import { APIConst } from 'src/app/shared/constants/letter-of-credit/letter-of-credit-api.constants';
import { CommonWorkflowService } from '../../../common/workflow-service/common-workflow.service';
import { MESSAGES } from 'src/app/shared/constants/letter-of-credit/message-constants';
import { OkDialogComponent } from 'src/app/shared/components/ok-dialog/ok-dialog.component';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Subscription } from 'rxjs';
import { EventListenerFocusTrapInertStrategy } from '@angular/cdk/a11y';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';


@Component({
  selector: 'app-lc-chequebook-listing-view',
  templateUrl: './lc-chequebook-listing-view.component.html',
  styleUrls: ['./lc-chequebook-listing-view.component.css']
})
export class LcChequebookListingViewComponent implements OnInit {

    /**
     * Configuration for this file
     *
     *
     * @memberOf LcChequebookListingViewComponent
     */



  // List of cheque Type
  ChequeTypeList: any[] = [
  
  ];

  // List of Request Type
  RequestTypeList: any[] = [
   
  ];

  // Data for Not Activated in LC Table
  NotActivateInLCData: any[] = [
    
  ];

  // Table Columns for Table Not Activated in LC
  NotActivateInLCDataColumn: string[] = [
    'srno', 'issueDate', 'startingChequeSeries', 'endingChequeSeries'
  ];

  // Data for Activated Cheque in LC Table
  ActivatedChequeInLCData: any[] = [

  ];

  // Table Columns for Table Activated Cheque in LC
  ActivatedChequeInLCDataColumn: string[] = [
     'srno', 'activatedDate', 'startingChequeSeries', 'endingChequeSeries'
  ];

  // Data for Table Inactivated Cheque in LC
  InactivatedChequeInLCData: any[] = [

  ];

  // Table Columns for Table Inactivated Cheque in LC
  InactivatedChequeInLCDataColumn: string[] = [
    'srno', 'inactivateDate', 'activatedDate', 'startingChequeSeries', 'endingChequeSeries'
  ];

  todayDate = Date.now();
  divisionCode = "AFR007"
  divisionName = "Dy. Con. Of Forest Training Center, Gandhinagar";
  bankName = "State Bank Of India, Main Branch, Gandhinagar";
  bankAccountNo = "12345678912340";
  optionActivated = true;
  optionInactivated = false;
  isSearch: boolean;
  showTableVar = false;
  status: any;
  action: any;
  subscribeParams: any;
  hdrId: number;
  mode: any;
  isEditable: any;
  actionStatus: any;
  showTablewar: boolean;
  divisionId: number;
  bankId: any;
  inActivatedRecordsOnEdit: any;
  ChequeListRecordsOnEdit: any;
  reqTypeName: any;
  chequeTypeName: any;
  refNo: any;
  refDate: any;
   /**
    * Form Group Instance
    *
    * @type {FormGroup}
    * @memberOf LcChequebookListingViewComponent
    */

  lcChequeBookActivateInactivateEditForm: FormGroup;
  ChequeTypeCTRL: FormControl = new FormControl();
  RequestTypeCTRL: FormControl = new FormControl();
   /**
     * Mat table instance
     *
     * @type {MatTableDataSource<any>}
     * @memberOf LcChequebookListingViewComponent
     */

  NotActivateInLCDataSource = new MatTableDataSource<any>([]);
  ActivatedChequeInLCDataSource = new MatTableDataSource<any>([]);
  InactivatedChequeInLCDataSource = new MatTableDataSource<any>([]);

   /**
      * Creates an instance of LcChequebookListingViewComponent.
      * @param {FormBuilder} fb
      * @param {LetterOfCreditService} locService
      * @param {StorageService} storageService
      * @param {CommonWorkflowService} commonWorkflowService
      * @param {ToastrService} toastr
      * @param {MatDialog} dialog
      * @param {Router} router
      * @param {ActivatedRoute} activatedRoute
      *
      * @memberOf LcChequebookListingViewComponent
      */
  constructor(private fb: FormBuilder, private el: ElementRef, public dialog: MatDialog, private router: Router,
    private activatedRoute: ActivatedRoute, private toastr: ToastrService, private storageService: StorageService,
    private locService: LetterOfCreditService, private commonWorkflowService: CommonWorkflowService,
  ) { }

 /**
   * Create object to access Methods of Letter of Credit Directive
   */
  directiveObject = new LetterOfCreditDirectives(this.router, this.dialog, this.el);

   /***********************Life cycle hooks methods start***********************************/

  /**
   * Life cycle hooks method
   *
   *
   * @memberOf LcChequebookListingViewComponent
   */

  ngOnInit() {
    this.lcChequeBookActivateInactivateEditFormData();
    this.subscribeParams = this.activatedRoute.params.subscribe(resRoute => {
      console.log(resRoute, "resroute");
      this.mode = resRoute.mode;
      console.log(this.mode, "mode route");
      this.action = resRoute.action;
      this.status = resRoute.status;
      this.hdrId = +resRoute.id;
      console.log(this.hdrId, "header id ..................");
      this.isEditable = resRoute.isEditable;

      console.log(this.subscribeParams, "subscribeparams");
    });


    this.lcChequeBookActivateInactivateview();

  }

 /***********************Life cycle hooks methods end***********************************/

  /***********************Public methods start***********************************/



  /**
   * Initialize formgroup
   *
   *
   * @memberOf LcChequebookListingViewComponent
   */
  lcChequeBookActivateInactivateEditFormData() {
    this.lcChequeBookActivateInactivateEditForm = this.fb.group({
      divisionCode: [''],
      divisionName: [''],
      bankName: [''],
      bankAccountNo: [''],
      chequeType: ['2'],
      requestType: ['1']
    })
  }


    /**
      * Call Generate Action 
      *
      * 
      * @memberof LcChequebookListingViewComponent
      */

  showTable() {
    if (this.lcChequeBookActivateInactivateEditForm.controls['requestType'].value == '1') {
      this.optionActivated = true;
      this.optionInactivated = false;
    } else {
      this.optionActivated = false;
      this.optionInactivated = true;
    }
  }


  /**
      * Call View api
      *
      * 
      * @memberof LcChequebookListingViewComponent
      */

  lcChequeBookActivateInactivateview() {
    const params = {
      hdrId: this.hdrId,
      actionStatus: this.isEditable

    }
    console.log(params, " lcchequebook activeinactive reqparams")
    this.locService.getData(params, APIConst.CHECKBOOK_ACTIVE_INACTIVE.GET_EDIT_VIEW_DATA).subscribe((res: any) => {

      console.log(res, "view and edit api called");
      if ((res && res.status === 200)) {
        console.log(res['result']);
        this.toastr.success(res['message']);
        this.lcChequeBookActivateInactivateEditForm.patchValue({ divisionCode: res.result.divCode });
        this.lcChequeBookActivateInactivateEditForm.patchValue({ divisionName: res.result.divName });
        this.lcChequeBookActivateInactivateEditForm.patchValue({ bankName: res.result.bankName });
        this.lcChequeBookActivateInactivateEditForm.patchValue({ bankAccountNo: res.result.bankAccNo });
        this.ChequeTypeList.push({
          value: 1, viewValue: res.result.chequeTypeName
        })
        this.lcChequeBookActivateInactivateEditForm.controls.chequeType.setValue(this.ChequeTypeList[0].value);
        this.RequestTypeList.push({

          value: 1, viewValue: res.result.reqTypeName
        })
        this.lcChequeBookActivateInactivateEditForm.controls.requestType.setValue(this.RequestTypeList[0].value);

        this.divisionId = res.result.divId;
        this.bankId = res.result.bankId;
        this.refNo = res.result.refNo;
        this.refDate = res.result.refDate;
        this.inActivatedRecordsOnEdit = res.result.chequeViewEditSdDto.locInActiveList
        this.NotActivateInLCData = res.result.chequeViewEditSdDto.chqInvInActiveList;
        this.ChequeListRecordsOnEdit = res.result.chequeViewEditSdDto.locActiveList

        if (this.ChequeListRecordsOnEdit.length > 0) {
          this.optionActivated = false;
          this.optionInactivated = true;
        }
        else {
          this.optionActivated = true;
          this.optionInactivated = false;
        }
        this.ActivatedChequeInLCDataSource = new MatTableDataSource(this.ChequeListRecordsOnEdit)
        this.NotActivateInLCDataSource = new MatTableDataSource(this.NotActivateInLCData)
        this.InactivatedChequeInLCDataSource = new MatTableDataSource(this.inActivatedRecordsOnEdit)

      }

    });

  }

    /**
      * @description Print
  */

  printComponent(cmp) {

    window.print();

  }


}


