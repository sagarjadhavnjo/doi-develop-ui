import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { ListValue, JPAPendingApprovalListing, JPAPendingSendForPayment, MasterEntry } from 'src/app/models/doi/doiModel';
import { DoiDirectives } from 'src/app/modules/core/common/directive/doi';
import { JpaClaimsEntryBase, JpaClaimsEntry } from './../../../../../models/doi/doiModel';
import { JpaUtilityService } from './../../service/jpa-utility.service';
import { DoiService } from './../../service/doi.service';
import { APIConst } from 'src/app/shared/constants/doi/doi-api.constants';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-jpa-send-for-payment-listing',
  templateUrl: './jpa-send-for-payment-listing.component.html',
  styleUrls: ['./jpa-send-for-payment-listing.component.css']
})
export class JpaSendForPaymentListingComponent implements OnInit {


  todayDate = new Date();
  // Form Group
  jpaClaimEntry: FormGroup;
  // Control
  districtCtrl: FormControl = new FormControl();
  schemeTypeCtrl: FormControl = new FormControl();
  typeOfYearCtrl: FormControl = new FormControl();
  typeMonthCtrl: FormControl = new FormControl();
  // List
  schemeType_list: ListValue[] = [];
  districtList: ListValue[] = [];
  //   { value: '0', viewValue: 'Ahmedabad' },
  //   { value: '1', viewValue: 'Amreli' },
  //   { value: '2', viewValue: 'Anand' },
  //   { value: '3', viewValue: 'Aravalli' },
  //   { value: '4', viewValue: 'Banaskantha' },
  //   { value: '5', viewValue: 'Bharuch' },
  //   { value: '6', viewValue: 'Bhavnagar' },
  // ];

  year_list: ListValue[] = [];
  //   { value: '1', viewValue: '2009' },
  //   { value: '2', viewValue: '2010' },
  //   { value: '3', viewValue: '2011' },
  //   { value: '4', viewValue: '2012' },
  //   { value: '5', viewValue: '2013' },
  //   { value: '6', viewValue: '2014' },
  //   { value: '7', viewValue: '2015' },
  //   { value: '8', viewValue: '2016' },
  //   { value: '9', viewValue: '2017' },
  //   { value: '10', viewValue: '2018' },
  //   { value: '11', viewValue: '2019' },
  //   { value: '12', viewValue: '2020' },
  // ];
  month_list: ListValue[] = [];
  //   { value: '1', viewValue: 'Jan' },
  //   { value: '2', viewValue: 'Feb' },
  //   { value: '3', viewValue: 'Mar' },
  //   { value: '4', viewValue: 'Apr' },
  //   { value: '5', viewValue: 'May' },
  //   { value: '6', viewValue: 'Jun' },
  //   { value: '7', viewValue: 'Jul' },
  //   { value: '8', viewValue: 'Aug' },
  //   { value: '9', viewValue: 'Sep' },
  //   { value: '10', viewValue: 'Oct' },
  //   { value: '11', viewValue: 'Nov' },
  //   { value: '12', viewValue: 'Dec' },

  // ];
  // Table Source

  ELEMENT_DATA: any[] = [];

  displayedColumns: string[] = [
    'select',
    'srno',
    'claimId',
    'policyNo',
    'scheme',
    'DecPersonName',
    'applicantName',
    'district',
    'taluka',
    'inwardNo',
    'createModeON',
    'modifyModeON',
    'status',
    'action'

  ];

  dataSource = new MatTableDataSource<any>(this.ELEMENT_DATA);
  selection = new SelectionModel<any>(true, []);
  constructor(private router: Router, public dialog: MatDialog, private fb: FormBuilder, private datePipe: DatePipe,
    private workFlowService: DoiService, private jpaUtilityService: JpaUtilityService) { }
  directiveObject = new DoiDirectives(this.router, this.dialog);

  totalRecords: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;

  ngOnInit() {
    this.jpaClaimEntry = this.fb.group({
      district: [''],
      month: [''],
      year: [''],
      fromDate: [''],
      endDate: [''],
      schemeType: ['']
    });

    this.onSearchClicked();

    this.getMasterSchemeListing(new MasterEntry());
    this.getDistrictList();
    this.getMonthsList();
    this.getYearList();
  }

  onPaginateChange(event) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    const opt: any = [{}];
    let map = new Map<string, string>();
    let cnt = 0;
    opt[cnt++] = { 'key': 'claimStatus', 'value': APIConst.JPA_CLAIM_SEND_FOR_PAYMENT_APPLICATION };

    if (this.jpaClaimEntry.controls.district.value !== '' && this.jpaClaimEntry.controls.district.value !== null) {
      opt[cnt++] = { 'key': 'districtId', 'value': this.jpaClaimEntry.controls.district.value };
    } if (this.jpaClaimEntry.controls.schemeType.value !== '' && this.jpaClaimEntry.controls.schemeType.value !== null) {
      opt[cnt++] = { 'key': 'schemeId', 'value': this.jpaClaimEntry.controls.schemeType.value };
    } if (this.jpaClaimEntry.controls.month.value !== '' && this.jpaClaimEntry.controls.month.value !== null) {
      opt[cnt++] = { 'key': 'claimMonthId', 'value': this.jpaClaimEntry.controls.month.value };
    } if (this.jpaClaimEntry.controls.year.value !== '' && this.jpaClaimEntry.controls.year.value !== null) {
      opt[cnt++] = { 'key': 'claimYearId', 'value': this.jpaClaimEntry.controls.year.value };
    } 
    if (this.jpaClaimEntry.controls.fromDate.value !== '' && this.jpaClaimEntry.controls.fromDate.value !== null) {
      let createdDate = this.dateFormatter(this.jpaClaimEntry.controls.fromDate.value, "dd/MM/yyyy");
      opt[cnt++] = { 'key': 'createdDate', 'value': createdDate, 'operation': '>=' };
    } if (this.jpaClaimEntry.controls.endDate.value !== '' && this.jpaClaimEntry.controls.endDate.value !== null) {
      let createdDate = this.dateFormatter(this.jpaClaimEntry.controls.endDate.value, "dd/MM/yyyy");
      opt[cnt++] = { 'key': 'createdDate', 'value': createdDate, 'operation': '<=' };
    }

    const passData = {
      pageIndex: this.pageIndex,
      pageElement: this.pageSize,
      sortByColumn: 'schemeId',
      sortOrder: 'asc',
      jsonArr: opt
    }
    this.getData(passData);
  }

  dateFormatter(date: string, pattern: string) {
    let date1 = new Date(date);
    return this.datePipe.transform(date, pattern);
  }

  public onSearchClicked() {
    
    const opt: any = [{}];
    let map = new Map<string, string>();
    let cnt = 0;
    opt[cnt++] = { 'key': 'claimStatus', 'value': APIConst.JPA_CLAIM_SEND_FOR_PAYMENT_APPLICATION };

    if (this.jpaClaimEntry.controls.district.value !== '' && this.jpaClaimEntry.controls.district.value !== null) {
      opt[cnt++] = { 'key': 'districtId', 'value': this.jpaClaimEntry.controls.district.value };
    } if (this.jpaClaimEntry.controls.schemeType.value !== '' && this.jpaClaimEntry.controls.schemeType.value !== null) {
      opt[cnt++] = { 'key': 'schemeId', 'value': this.jpaClaimEntry.controls.schemeType.value };
    } if (this.jpaClaimEntry.controls.month.value !== '' && this.jpaClaimEntry.controls.month.value !== null) {
      opt[cnt++] = { 'key': 'claimMonthId', 'value': this.jpaClaimEntry.controls.month.value };
    } if (this.jpaClaimEntry.controls.year.value !== '' && this.jpaClaimEntry.controls.year.value !== null) {
      opt[cnt++] = { 'key': 'claimYearId', 'value': this.jpaClaimEntry.controls.year.value };
    } if (this.jpaClaimEntry.controls.fromDate.value !== '' && this.jpaClaimEntry.controls.fromDate.value !== null) {
      let createdDate = this.dateFormatter(this.jpaClaimEntry.controls.fromDate.value, "dd/MM/yyyy");
      opt[cnt++] = { 'key': 'createdDate', 'value': createdDate, 'operation': '>=' };
    } if (this.jpaClaimEntry.controls.endDate.value !== '' && this.jpaClaimEntry.controls.endDate.value !== null) {
      let createdDate = this.dateFormatter(this.jpaClaimEntry.controls.endDate.value, "dd/MM/yyyy");
      opt[cnt++] = { 'key': 'createdDate', 'value': createdDate, 'operation': '<=' };
    }

    const passData = {
      pageIndex: 0,
      pageElement: 10,
      sortByColumn: 'schemeId',
      sortOrder: 'asc',
      jsonArr: opt
    }

    this.getData(passData);

  }

  public getData(payload) {
    this.workFlowService.getData(payload, APIConst.JPA_CLAIM_LISTING).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          const data = resp && resp.result ? resp.result : null;
          const { size, totalElement, result, totalPage } = data;
          this.totalRecords = totalElement;
          this.pageSize = size;
          this.ELEMENT_DATA = resp.result.result;
          this.dataSource.data = this.ELEMENT_DATA;
        }
        
        this.clearForm();
      },
      err => {
        this.clearForm();
      }
    );
  }

  public getDistrict(id: number): string {
    if (id) {
      let data = this.districtList.filter(x => x.value == id.toString())[0];
      return data ? data.viewValue : '';
    }
  }

public getTaluka(id: number): string {
  return '';
}

  private clearForm() {
    this.jpaClaimEntry.reset();
  }

  private getMasterSchemeListing(payload: MasterEntry) {
    this.workFlowService.getDataWithHeadersWithoutParams(APIConst.DOI_JPA_MASTER_SCHEME_DROPDOWN_LISTING).subscribe(
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

  // Navigation Route
  navigate(element: any) {
    this.jpaUtilityService.isEdit = true;
    this.jpaUtilityService.setSelectedJpaApprovedData(element);
    this.router.navigate(['./dashboard/doi/jpa/jpa-claim-entry-view']);
  }

  claimNoteLinkClicked(element: any) {
    this.jpaUtilityService.setSelectedJpaApprovedData(element);
    this.router.navigate(['./dashboard/doi/jpa/claim-note']);
  }

  memorandumLinkClicked(element: any) {
    this.jpaUtilityService.setSelectedJpaApprovedData(element);
    this.router.navigate(['./dashboard/doi/jpa/memorandum']);
  }
  getDistrictList() {
    this.workFlowService.getDataWithoutParams(APIConst.JPA_DOI_GET_DISTRICT_LIST_GUJRAT).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          resp.result.forEach(element => {
            let data = new ListValue();
            data.value = element.value;
            data.viewValue = element.viewValue;
            this.districtList.push(data);
          });
        }
      },
      err => {

      }
    );
  }

  getMonthsList() {
    const params = {
      "name":"JPA_LEG_MONTH"
    };
    this.workFlowService.getDataPost(params, APIConst.COMMON_DROPDOWN_WITH_NAME).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          resp.result.forEach(element => {
            let data = new ListValue();
            data.value = element.id;
            data.viewValue = element.name;
            this.month_list.push(data);
          });
        }
      },
      err => {

      }
    );
  }

  getYearList() {
    this.workFlowService.getDataWithoutParams(APIConst.DOI_YEAR_LIST_DROPDOWN).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          this.year_list = resp.result;
        }
      },
      err => {

      }
    );
  }

}