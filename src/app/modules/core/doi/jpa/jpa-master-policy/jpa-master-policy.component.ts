  import { APIConst } from 'src/app/shared/constants/doi/doi-api.constants';
import { DoiService } from './../../service/doi.service';
import { JpaMasterPolicy, JpaMasterPolicyBase } from './jpa-master-policy.model';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MasterPolicy, ListValue, MasterEntry } from 'src/app/models/doi/doiModel';
import { CommonListing } from 'src/app/modules/core/common/model/common-listing';
import { jpaMessage } from 'src/app/common/error-message/common-message.constants';
import { DoiDirectives } from 'src/app/modules/core/common/directive/doi';
import { BehaviorSubject } from 'rxjs';
import { JpaUtilityService } from '../../service/jpa-utility.service';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { msgConst } from 'src/app/shared/constants/edp/edp-msg.constants';
import { DatePipe } from '@angular/common'
import { ToastrService } from 'ngx-toastr';

declare function SetEnglish();
declare function SetGujarati();


@Component({
  selector: 'app-jpa-master-policy',
  templateUrl: './jpa-master-policy.component.html',
  styleUrls: ['./jpa-master-policy.component.css']
})
export class JpaMasterPolicyComponent implements OnInit {
  totalRecords: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;

  currentLang = new BehaviorSubject<string>('Eng');
  isLangChange = false;
  hasFocusSet: number;
  referenceNoToken = false;
  isTokentable = false;
  isTokentableone = false;
  selectedIndex: number;
  isTokentabletwo = false;
  showPolicyNumber: boolean = true;
  disableSubmit: boolean = false;
  // Form Group
  jpaClaimEntry: FormGroup;
  // Variable
  errorMessage = jpaMessage;
  // DAte
  todayDate = Date.now();
  maxDate = new Date();
  // control
  schemeTypeCtrl: FormControl = new FormControl();
  policyTypeCtrl: FormControl = new FormControl();
  StatusCtrl: FormControl = new FormControl();
  typeMonthCtrl: FormControl = new FormControl();
  typeOfYearCtrl: FormControl = new FormControl();
  // List
  schemeType_list: ListValue[] = [];
  // Table Source
  policyTypeList: CommonListing[] = [];

  // List of Status
  StatusList: ListValue[] = [];
  year_list: ListValue[] = [];
  month_list: ListValue[] = [];
  Element_Data: JpaMasterPolicy[] = [];
  cacheRecords: JpaMasterPolicy[] = [];
  referneceNumber: string;

  displayedColumns: any[] = [
    'srno',
    'plocyNo',
    'scheme',
    'startDate',
    'endDate',
    'numberofBenificiaries',
    'premiumAmount',
    'death',
    'fiftyDiablity',
    'hundredDisablity',
    'createdOn',
    'updatedOn',
    'status',
    'action'

  ];

  displayedColumns2: any[] = [
    'srno',
    'plocyNo',
    'scheme',
    'startDate',
    'endDate',
    'numberofBenificiaries',
    'premiumAmount',
    'death',
    'fiftyDiablity',
    'hundredDisablity',

    // 'status',
    'action'

  ];

  dataSource = new MatTableDataSource<any>(this.Element_Data);
  newDataSource = new MatTableDataSource<any>(this.Element_Data);
  isEdit: boolean = false;
  selectedPolicyId: number;
  errorMessages = msgConst;

  constructor(private el: ElementRef, public dialog: MatDialog, private router: Router,
    private fb: FormBuilder, private workflowService: DoiService, private utilityService: JpaUtilityService,
    private toastr: ToastrService, private datepipe: DatePipe) { }
  directiveObject = new DoiDirectives(this.router, this.dialog);

  ngOnInit() {
    this.jpaClaimEntry = this.fb.group({
      startDate: [''],
      endDate: [''],
      ploicyNo: [''],
      schemeType: [''],
      status: [''],
      numberOfBenificiaries: [''],
      premiumAmount: [''],
      ClaimAmountonDeath: [''],
      fiftyDisablity: [''],
      hunDisablity: [''],
      policyType: "1",
      referenceNo: [''],
      endorsementSrNo: [''],
      month: [''],
      year: [''],
      reason: [''],
      policyTypeL: [''],
      numberOfBenificiariesL: [''],
      schemeTypeL: ['']
    });
    this.referneceNumber = this.utilityService.getNewPolicyNumber();
    this.onSearchClicked();
    this.getMasterSchemeListing(new MasterEntry());
    this.getPolicyTypesList();
    this.getPolicyStatusList();
    this.getYearList();
    this.getMonthList();
    this.jpaClaimEntry.get('policyType').disable();
    this.isTokentabletwo = false;
    this.isTokentable = false;
  }

  // Navigation Route
  navigate() {
    this.router.navigate(['./doi/jpa/jpa-claim-entry-view']);
  }
  ontoken(index) {
    if (index.value === '3') {
      this.isTokentable = true;
      this.referenceNoToken = false;
      this.jpaClaimEntry.controls.startDate.reset();
    } else {
      this.isTokentable = false;

    }
    if (index.value === '2') {
      this.isTokentableone = true;
      this.referenceNoToken = false;
      this.jpaClaimEntry.controls.startDate.setValue(new Date());
    } else {
      this.isTokentableone = false;
    }
    if (index.value === '1') {
      this.isTokentabletwo = true;
      this.jpaClaimEntry.controls.startDate.reset();

    } else {
      this.isTokentabletwo = false;
    }

  }
  // get tab index
  getTabIndex(tabIndex) {
    this.selectedIndex = tabIndex;
  }

  goToDashboard() {
    const proceedMessage = this.errorMessages.CONFIRMATION_DIALOG.CONFIRMATION;
    // tslint:disable-next-line: no-use-before-declare
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '360px',
      data: proceedMessage
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        this.router.navigate(['/dashboard'], { skipLocationChange: true });
      }
    });
  }

  goToNext() {
    // this.selectedIndex = tabIndex;
    this.selectedIndex = 1;
    this.reset();

    let startDate = new Date();
    var year = startDate.getFullYear();
    var month = startDate.getMonth();
    var day = startDate.getDate();
    let endDate = new Date(year + 1, month, day - 1);

    this.jpaClaimEntry.patchValue({
      'policyType': "1",
      'startDate': startDate,
      'endDate': endDate
    });
    this.isTokentabletwo = false;
    this.isTokentable = false;
    this.jpaClaimEntry.get('policyType').disable();

    this.newDataSource.data =[];
  }
  gePrevIndex() {
    {
      this.selectedIndex = 0;
    }
  }
  // Eng Guj functions starts
  setEnglishOnFocusOut(event) {
    SetEnglish();
    this.jpaClaimEntry.patchValue({
      "reason": event.srcElement.value
    });
  }
  setGujaratiDefault() {
    if (!this.isLangChange) {
      SetGujarati();
      this.currentLang.next('Eng');
    }
  }
  toggleLanguage() {
    this.isLangChange = true;
    const elements = this.el.nativeElement.querySelectorAll('.hasfocus')[0];
    if (elements != undefined) {
      if (this.currentLang.value == 'Guj') {
        SetEnglish();
        this.currentLang.next('Eng');
      } else {
        SetGujarati();
        this.currentLang.next('Guj');
      }
      elements.focus();
    }
  }

  public onSearchClicked() {
    const opt: any = [];
    let map = new Map<string, string>();
    let cnt = 0;

    if (this.jpaClaimEntry.controls.policyTypeL.value !== '' && this.jpaClaimEntry.controls.policyTypeL.value !== null) {
      opt[cnt++] = { 'key': 'policyTypeId', 'value': this.jpaClaimEntry.controls.policyTypeL.value };
    } if (this.jpaClaimEntry.controls.ploicyNo.value !== '' && this.jpaClaimEntry.controls.ploicyNo.value !== null) {
      opt[cnt++] = { 'key': 'policyNo', 'value': this.jpaClaimEntry.controls.ploicyNo.value };
    } if (this.jpaClaimEntry.controls.numberOfBenificiariesL.value !== '' && this.jpaClaimEntry.controls.numberOfBenificiariesL.value !== null) {
      opt[cnt++] = { 'key': 'beneficiaryNum', 'value': this.jpaClaimEntry.controls.numberOfBenificiariesL.value };
    } if (this.jpaClaimEntry.controls.schemeTypeL.value !== '' && this.jpaClaimEntry.controls.schemeTypeL.value !== null) {
      opt[cnt++] = { 'key': 'schemeName', 'value': this.jpaClaimEntry.controls.schemeTypeL.value };
    } if (this.jpaClaimEntry.controls.status.value !== '' && this.jpaClaimEntry.controls.status.value !== null) {
      opt[cnt++] = { 'key': 'policyStatusId', 'value': this.jpaClaimEntry.controls.status.value };
    }

    const passData = {
      pageIndex: 0,
      pageElement: 10,
      sortByColumn: 'policyId',
      sortOrder: 'asc',
      jsonArr: opt
    }
    this.getMasterPolicyListingData(passData);
  }
  validateForm() {
    Object.keys(this.jpaClaimEntry.controls).forEach((field) => {
      const control = this.jpaClaimEntry.get(field);
      control.markAsTouched({ onlySelf: true });
    });
  }

  public addRecord() {
    this.validateForm();
    if (!this.jpaClaimEntry.valid) {
      return;
    }
    let payload: JpaMasterPolicy = new JpaMasterPolicy();
    payload.schemeId = this.jpaClaimEntry.controls.schemeType.value;
    payload.policyNum = this.jpaClaimEntry.controls.ploicyNo.value;
    //payload.referenceNo = this.jpaClaimEntry.controls.referenceNo.value;
    payload.policyTypeId = this.jpaClaimEntry.controls.policyType.value;
    payload.policyStartDate = this.jpaClaimEntry.controls.startDate.value.toJSON().replace('T', ' ').replace('.', ' ').replace('Z', '');
    payload.policyEndDate = this.jpaClaimEntry.controls.endDate.value.toJSON().replace('T', ' ').replace('.', ' ').replace('Z', '');
    payload.beneficiaryNum = this.jpaClaimEntry.controls.numberOfBenificiaries.value;
    payload.premiumAmount = this.jpaClaimEntry.controls.premiumAmount.value;
    payload.deathClaimAmt = this.jpaClaimEntry.controls.ClaimAmountonDeath.value;
    payload.disable50ClaimAmt = this.jpaClaimEntry.controls.fiftyDisablity.value;
    payload.disable100ClaimAmt = this.jpaClaimEntry.controls.hunDisablity.value;
    payload.endrRenewReason = this.jpaClaimEntry.controls.reason.value;
    payload.schemeName = this.getDropdowntxt(this.jpaClaimEntry.controls.schemeType.value, this.schemeType_list);
    payload.referenceDate = new Date().toJSON().replace('T', ' ').replace('.', ' ').replace('Z', '');
    if (this.isEdit) {
      payload.policyId = this.selectedPolicyId;
      payload.endorsementSrNo = this.jpaClaimEntry.controls.endorsementSrNo.value;
    }
    this.cacheRecords.push(payload);
    if(payload.policyId){
      this.Element_Data = this.Element_Data.filter(x => x.policyId != payload.policyId);
    }
    this.Element_Data.push(payload);
    this.dataSource.data = this.Element_Data;
    this.newDataSource.data = this.cacheRecords;
    this.reset();
  }

  public saveRecord() {
    if (this.cacheRecords.length > 0) {
        this.addUpdatePolicyData(this.cacheRecords);

    }
    this.cacheRecords = [];
    this.reset();
  }

  public onDeleteClicked(element: JpaMasterPolicy) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '360px',
      data: msgConst.CONFIRMATION_DIALOG.DELETE
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        this.Element_Data = this.Element_Data.filter(x => x.policyId != element.policyId);
        this.workflowService.deleteDocument(APIConst.JPA_SCHEME_MASTER_POLICY_DELETE, element.policyId).subscribe((resp) => {
          this.dataSource = new MatTableDataSource(this.Element_Data);
        },
          error => {

          }
        )
      }
    });
  }

  public onEditClicked(element: JpaMasterPolicy) {
    this.goToNext();
    this.isTokentabletwo = false;
    this.isTokentable = true;
    if (element) {
      this.jpaClaimEntry.patchValue({
        'schemeType': element.schemeId,
        'ploicyNo': element.policyNum,
        'referenceNo': element.referenceNo,
        'policyType': "3",
        'startDate': new Date(element.policyStartDate.split(' ')[0]),
        'endDate': new Date(element.policyEndDate.split(' ')[0]),
        'numberOfBenificiaries': element.beneficiaryNum,
        'premiumAmount': element.premiumAmount,
        'ClaimAmountonDeath': element.deathClaimAmt,
        'fiftyDisablity': element.disable50ClaimAmt,
        'hunDisablity': element.disable100ClaimAmt,
        'reason': element.endrRenewReason
      });
      this.isEdit = true;
      this.selectedPolicyId = element.policyId
      this.referneceNumber = element.referenceNo;
      this.showPolicyNumber = true;
      this.disableSubmit = false;
      this.enableAllFields();
      this.jpaClaimEntry.get('policyType').disable();
      this.jpaClaimEntry.get('endDate').disable();
      this.jpaClaimEntry.get('startDate').disable();
      this.jpaClaimEntry.get('ploicyNo').disable();
    }
  }

  public onRenewalClicked(element: JpaMasterPolicy) {
    this.goToNext();
    this.isTokentabletwo = false;
    this.isTokentable = true;
    let startDate, endDate;
    let previousEndDate = new Date(element.policyEndDate.split(' ')[0]);
    if (previousEndDate < new Date()) {
      startDate = new Date();
      var year = startDate.getFullYear();
      var month = startDate.getMonth();
      var day = startDate.getDate();
      endDate = new Date(year + 1, month, day - 1);
    } else {
      startDate = previousEndDate;
      var year = startDate.getFullYear();
      var month = startDate.getMonth();
      var day = startDate.getDate();
      startDate = new Date(year, month, day + 1);
      endDate = new Date(year + 1, month, day);
    }

    if (element) {
      this.jpaClaimEntry.patchValue({
        'schemeType': element.schemeId,
        'endorsementSrNo': element.endorsementSrNo,
        'ploicyNo': element.policyNum,
        'referenceNo': element.referenceNo,
        'policyType': "2",
        'startDate': startDate,
        'endDate': endDate,
        'numberOfBenificiaries': element.beneficiaryNum,
        'premiumAmount': element.premiumAmount,
        'ClaimAmountonDeath': element.deathClaimAmt,
        'fiftyDisablity': element.disable50ClaimAmt,
        'hunDisablity': element.disable100ClaimAmt,
        'reason': element.endrRenewReason
      });
      this.isEdit = true;
      this.selectedPolicyId = element.policyId
      this.referneceNumber = element.referenceNo;
      this.showPolicyNumber = true;
      this.disableSubmit = false;
      this.disableAllFields();
      this.jpaClaimEntry.get('endDate').enable();
      this.jpaClaimEntry.get('startDate').enable();
      this.jpaClaimEntry.get('numberOfBenificiaries').enable();
      this.jpaClaimEntry.get('premiumAmount').enable();
    }
  }

  public onViewClicked(element: JpaMasterPolicy) {
    this.goToNext();
    this.isTokentabletwo = false;
    this.isTokentable = true;
    if (element) {
      this.jpaClaimEntry.patchValue({
        'schemeType': element.schemeId,
        'endorsementSrNo': element.endorsementSrNo,
        'ploicyNo': element.policyNum,
        'referenceNo': element.referenceNo,
        'policyType': element.policyTypeId.toString(),
        'startDate': new Date(element.policyStartDate.split(' ')[0]),
        'endDate': new Date(element.policyEndDate.split(' ')[0]),
        'numberOfBenificiaries': element.beneficiaryNum,
        'premiumAmount': element.premiumAmount,
        'ClaimAmountonDeath': element.deathClaimAmt,
        'fiftyDisablity': element.disable50ClaimAmt,
        'hunDisablity': element.disable100ClaimAmt,
        'reason': element.endrRenewReason
      });
      this.isEdit = true;
      this.selectedPolicyId = element.policyId
      this.referneceNumber = element.referenceNo;
      this.showPolicyNumber = true;
      this.disableSubmit = true;
      this.disableAllFields();
    }
  }

  public reset() {
    this.jpaClaimEntry.reset();
    Object.keys(this.jpaClaimEntry.controls).forEach(key => {
      this.jpaClaimEntry.get(key).setErrors(null);
    });
    this.showPolicyNumber = false;
    this.disableSubmit = false;
    this.enableAllFields();
    let startDate = new Date();
    var year = startDate.getFullYear();
    var month = startDate.getMonth();
    var day = startDate.getDate();
    let endDate = new Date(year + 1, month, day - 1);
    this.jpaClaimEntry.get("policyType").setValue("1");
    this.jpaClaimEntry.get("startDate").setValue(startDate);
    this.jpaClaimEntry.get("endDate").setValue(endDate);
    this.isTokentabletwo = false;
    this.isTokentable = false;
    this.jpaClaimEntry.get('policyType').disable();
  }

  private addUpdatePolicyData(param: JpaMasterPolicy[]) {
    this.workflowService.saveDocumentsData(APIConst.JPA_SCHEME_MASTER_POLICY_ENTRY, param)
      .subscribe((data: any) => {
        if (data && data.result && data.status === 200) {
          this.toastr.success(data.message);
          this.Element_Data = data.result;
          this.newDataSource.data = this.Element_Data;
          this.isEdit = false;
          this.referneceNumber = this.utilityService.getNewPolicyNumber();
          this.selectedPolicyId = -999;
          this.jpaClaimEntry.reset();
        }
      }, (err) => {
        this.toastr.error(err);
        this.isEdit = false;
        this.referneceNumber = this.utilityService.getNewPolicyNumber();
        this.selectedPolicyId = -999;
        this.jpaClaimEntry.reset();
      });
  }

  private getMasterPolicyListingData(param) {
    this.workflowService.getDataPost(param, APIConst.JPA_SCHEME_MASTER_POLICY_LISTING).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          const data = resp && resp.result ? resp.result : null;
          const { size, totalElement, result, totalPage } = data;
          this.totalRecords = totalElement;
          this.pageSize = size;
          this.Element_Data = resp.result.result;
          this.dataSource.data = this.Element_Data;
        }
      },
      err => {

      }
    );
  }

  private getDropdowntxt(id: number, data: ListValue[]): string {
    let retVal: string = '';
    retVal = data.filter(x => x.value == id.toString())[0].viewValue
    return retVal;
  }

  private getMasterSchemeListing(payload: MasterEntry) {
    this.workflowService.getDataWithHeadersWithoutParams(APIConst.DOI_JPA_MASTER_SCHEME_DROPDOWN_LISTING).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          resp.result.forEach(element => {
            let data = new ListValue();
            data.value = element.schemeId;
            data.viewValue = element.schemeName;
            this.schemeType_list.push(data);
          });
        }
      },
      err => {

      }
    );
  }

  getPolicyTypesList() {
    this.workflowService.getDataWithoutParams(APIConst.DOI_POLICY_TYPES_DROPDOWN).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          this.policyTypeList = resp.result;
        }
      },
      err => {

      }
    );
  }

  getPolicyStatusList() {
    this.workflowService.getDataWithoutParams(APIConst.DOI_POLICY_STATUS_DROPDOWN).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          this.StatusList = resp.result;
        }
      },
      err => {

      }
    );
  }

  getYearList() {
    this.workflowService.getDataWithoutParams(APIConst.DOI_YEAR_LIST_DROPDOWN).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          this.year_list = resp.result;
        }
      },
      err => {

      }
    );
  }

  getMonthList() {
    this.workflowService.getDataWithoutParams(APIConst.DOI_MONTH_LIST_DROPDOWN).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          this.month_list = resp.result;
        }
      },
      err => {

      }
    );
  }

  private disableAllFields() {
    this.jpaClaimEntry.get('reason').disable();
    this.jpaClaimEntry.get('hunDisablity').disable();
    this.jpaClaimEntry.get('fiftyDisablity').disable();
    this.jpaClaimEntry.get('ClaimAmountonDeath').disable();
    this.jpaClaimEntry.get('premiumAmount').disable();
    this.jpaClaimEntry.get('numberOfBenificiaries').disable();
    this.jpaClaimEntry.get('endDate').disable();
    this.jpaClaimEntry.get('startDate').disable();
    this.jpaClaimEntry.get('policyType').disable();
    this.jpaClaimEntry.get('referenceNo').disable();
    this.jpaClaimEntry.get('ploicyNo').disable();
    this.jpaClaimEntry.get('endorsementSrNo').disable();
    this.jpaClaimEntry.get('schemeType').disable();
  }

  private enableAllFields() {
    this.jpaClaimEntry.get('reason').enable();
    this.jpaClaimEntry.get('hunDisablity').enable();
    this.jpaClaimEntry.get('fiftyDisablity').enable();
    this.jpaClaimEntry.get('ClaimAmountonDeath').enable();
    this.jpaClaimEntry.get('premiumAmount').enable();
    this.jpaClaimEntry.get('numberOfBenificiaries').enable();
    this.jpaClaimEntry.get('endDate').enable();
    this.jpaClaimEntry.get('startDate').enable();
    this.jpaClaimEntry.get('policyType').enable();
    this.jpaClaimEntry.get('referenceNo').enable();
    this.jpaClaimEntry.get('ploicyNo').enable();
    this.jpaClaimEntry.get('endorsementSrNo').enable();
    this.jpaClaimEntry.get('schemeType').enable();
  }

  onPaginateChange(event) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    const opt: any = [];
    let map = new Map<string, string>();
    let cnt = 0;

    if (this.jpaClaimEntry.controls.policyTypeL.value !== '' && this.jpaClaimEntry.controls.policyTypeL.value !== null) {
      opt[cnt++] = { 'key': 'policyTypeId', 'value': this.jpaClaimEntry.controls.policyTypeL.value };
    } if (this.jpaClaimEntry.controls.ploicyNo.value !== '' && this.jpaClaimEntry.controls.ploicyNo.value !== null) {
      opt[cnt++] = { 'key': 'policyNo', 'value': this.jpaClaimEntry.controls.ploicyNo.value };
    } if (this.jpaClaimEntry.controls.numberOfBenificiariesL.value !== '' && this.jpaClaimEntry.controls.numberOfBenificiariesL.value !== null) {
      opt[cnt++] = { 'key': 'beneficiaryNum', 'value': this.jpaClaimEntry.controls.numberOfBenificiariesL.value };
    } if (this.jpaClaimEntry.controls.schemeTypeL.value !== '' && this.jpaClaimEntry.controls.schemeTypeL.value !== null) {
      opt[cnt++] = { 'key': 'schemeName', 'value': this.jpaClaimEntry.controls.schemeTypeL.value };
    } if (this.jpaClaimEntry.controls.status.value !== '' && this.jpaClaimEntry.controls.status.value !== null) {
      opt[cnt++] = { 'key': 'policyStatusId', 'value': this.jpaClaimEntry.controls.status.value };
    }

    const passData = {
      pageIndex: this.pageIndex,
      pageElement: this.pageSize,
      sortByColumn: 'policyId',
      sortOrder: 'asc',
      jsonArr: opt
    }

    this.getMasterPolicyListingData(passData);
  }

}  