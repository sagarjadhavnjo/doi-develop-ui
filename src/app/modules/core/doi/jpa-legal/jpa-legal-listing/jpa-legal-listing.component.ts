import { Component, OnInit, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table'
import { MatDialog } from '@angular/material/dialog'
import { jpaMessage } from 'src/app/common/error-message/common-message.constants';
import { ToastrService } from 'ngx-toastr';
import { ListValue, AttachmentData, JpaLegal, MasterEntry } from 'src/app/models/doi/doiModel';
import { DoiService } from '../../service/doi.service';
import { APIConst } from 'src/app/shared/constants/doi/doi-api.constants';
import { DatePipe } from '@angular/common';
import { stringify } from 'querystring';
import { element } from 'protractor';
import { JpaUtilityService } from '../../service/jpa-utility.service';

@Component({
  selector: 'app-jpa-legal-listing',
  templateUrl: './jpa-legal-listing.component.html',
  styleUrls: ['./jpa-legal-listing.component.css']
})

export class JpaLegalListingComponent implements OnInit {
  totalRecords: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;

  todayDate = new Date();
  // Form Group
  jpaLegalEntry: FormGroup;
  // List
  schemeType_list: ListValue[] = [];
    
  districtList: ListValue[] = [];
   
  attachmentTypeCode: any[] = [];
  //   { value: '01', viewValue: 'Supporting Document' },
  //   { value: '02', viewValue: 'Sanction Order' },
  //   { value: '03', viewValue: 'Others' },
  //   // { type: 'view' }
  // ];
  orderStatusList: ListValue[] = [];
  //   { value: '1', viewValue: 'Pending' },
  //   { value: '2', viewValue: 'Opened' },
  // ];
  courtDetails_list: ListValue[] = [];
  //   { value: '1', viewValue: 'District Commission' },
  //   { value: '2', viewValue: 'State Commission' },
  //   { value: '3', viewValue: 'National Commission' },

  // ];

  // control
  districtCtrl: FormControl = new FormControl();
  schemeTypeCtrl: FormControl = new FormControl();
  errorMessage: any;

  courtDetailsCtrl: FormControl = new FormControl();
  // Table Source

  Element_Data: any[] = [];

  //   {
  //     srno: '1',
  //     district: 'Ahmedabad',
  //     inwardNo: '	1234',
  //     inwardDate: '	16/11/2019',
  //     courtCaseNo: '	624387',
  //     courtCaseDate: '	25/10/2019',
  //     courtDetail: '	Forum',
  //     claimId: '	JPA/KK/1004455',
  //     policyNo: '	DOI/JPA/KK/10000',
  //     scheme: '	Khatedar Khedut	',
  //     applicantName: 'Maganbhai Chhanabhai Patel	',
  //     nameofDeceasedPerson: 'Chhanabhai Jinabhai Patel',
  //     detailofQuery: '	Duplicate Claim',
  //     dateOfAci: '26/04/2019',
  //     courtDecision: 'Pending Case	 ',
  //     createModeON: '22-Apr-2018 12:22PM',
  //     modifyModeON: '12-Jun-2018 01:22PM',
  //     status: 'Approved',
  //     action: '',
  //   },
  //   {
  //     srno: '2',
  //     district: 'Gandhinagar	',
  //     inwardNo: '	2345',
  //     inwardDate: '		15/11/2019	',
  //     courtCaseNo: '	548368',
  //     courtCaseDate: '	1/11/2019	',
  //     courtDetail: '	Forum',
  //     claimId: '		JPA/RF/1003455	',
  //     policyNo: '	DOI/JPA/RF/10000',
  //     scheme: '		Register Farmer		',
  //     applicantName: 'Hiralal Ravjibhai Patel	',
  //     detailofQuery: 'Duplicate Claim	',
  //     nameofDeceasedPerson: 'Ravjibhai Lalbhai Patel',
  //     dateOfAci: '		10/2/2019',
  //     courtDecision: 'Pending Case	 ',
  //     status: 'Approved',
  //     action: '',
  //     createModeON: '22-Apr-2018 12:22PM',
  //     modifyModeON: '12-Jun-2018 01:22PM',
  //   },
  //   {
  //     srno: '3',
  //     district: 'Rajkot',
  //     inwardNo: '		3456',
  //     inwardDate: '		14/11/2019	',
  //     courtCaseNo: '	553876',
  //     courtCaseDate: '	30/10/2019',
  //     courtDetail: '	Forum',
  //     claimId: '	JPA/S/1008765',
  //     policyNo: '		DOI/JPA/S/10000	',
  //     scheme: '	Sharmik		',
  //     applicantName: 'Ramilaben Giribhai Dongra		',
  //     detailofQuery: '	Not Having Required Document',
  //     nameofDeceasedPerson: 'Giribhai Gogabhai Dongra	',
  //     dateOfAci: '12/2/2019		',
  //     courtDecision: 'Pending Case	 ',
  //     status: 'Pending',
  //     createModeON: '22-Apr-2018 12:22PM',
  //     modifyModeON: '22-Jun-2018 01:22PM',
  //     action: '',
  //   },
  //   {
  //     srno: '4',
  //     district: 'Bhavnagar',
  //     inwardNo: '		4567',
  //     inwardDate: '		13/11/2019',
  //     courtCaseNo: '		369978	',
  //     courtCaseDate: '28/10/2019',
  //     courtDetail: '		State Commission',
  //     claimId: '		JPA/UOL/1000345	',
  //     policyNo: '	DOI/JPA/UOL/10000',
  //     scheme: '		Unorganized Labour		',
  //     applicantName: 'Rambhai Ratanbhai Parmar	',
  //     detailofQuery: 'Not Having Required Document',
  //     nameofDeceasedPerson: '	Ratanbhai Ravjibhai Parmar',
  //     dateOfAci: '13/08/2019',
  //     courtDecision: 'Forum Decision favour on DOI',
  //     status: 'Pending',
  //     createModeON: '22-Apr-2018 12:22PM',
  //     modifyModeON: '22-Jun-2018 01:22PM',
  //     action: '',
  //   },
  //   {
  //     srno: '5',
  //     district: '	Jamnagar',
  //     inwardNo: '	5678',
  //     inwardDate: '	12/11/2019',
  //     courtCaseNo: '	357698',
  //     courtCaseDate: '	24/10/2019',
  //     courtDetail: '	National Commission',
  //     claimId: '	JPA/S/1008746',
  //     policyNo: '	DOI/JPA/S/10000',
  //     scheme: '	Shramik',
  //     applicantName: '	Lavajibhai lalbhai Dabhi	',
  //     detailofQuery: '	Forum and State Commission Decision Favour on ',
  //     nameofDeceasedPerson: 'lalbhai ramanbhai DabhiDOI',
  //     dateOfAci: '8/1/2019	',
  //     courtDecision: 'Forum and State Commission Decision Favour on DOI ',
  //     createModeON: '22-Apr-2018 12:22PM',
  //     modifyModeON: '22-Jun-2018 01:22PM',
  //     status: 'Pending',
  //     action: '',
  //   },



  // ];
  displayedColumns: any[] = [
    'srno',
    'district',
    'inwardNo',
    'inwardDate',
    'courtCaseNo',
    'courtCaseDate',
    'courtDetail',
    'claimId',
    'policyNo',
    'scheme',
    'applicantName',

    'nameofDeceasedPerson',
    'dateOfAci',
    'detailofQuery',
    'courtDecision',
    'createModeON',
    'modifyModeON',
    'status',
    'action'

  ];

  dataSource = new MatTableDataSource<any>(this.Element_Data);

  constructor(private router: Router, private el: ElementRef,
    public dialog: MatDialog, private fb: FormBuilder, private toastr: ToastrService,
    private workflowService: DoiService, private datePipe: DatePipe, private jpaUtilityService: JpaUtilityService) { }

  ngOnInit() {
    this.errorMessage = jpaMessage;

    this.jpaLegalEntry = this.fb.group({
      inwardNo: [''],
      inwardDate: [''],
      caseNo: [''],
      applicantName: [''],
      claimNo: [''],
      dateOfAccident: [''],
      schemeType: [''],
      district: [''],
      courtDetails: ['']
    });

    this.searchDisplay();
    this.getDistrictList();
    this.getMasterSchemeListing(new MasterEntry());
    this.getCourtDetailsList();
  }
  getDistrictList() {
    this.workflowService.getDataWithoutParams(APIConst.JPA_DOI_GET_DISTRICT_LIST_GUJRAT).subscribe(
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
  
  getCourtDetailsList() {
    const params = {
      "name":"JPA_LE_COURT_DETAILS"
    };
    this.workflowService.getDataPost(params, APIConst.COMMON_DROPDOWN_WITH_NAME).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          resp.result.forEach(element => {
            let data = new ListValue();
            data.value = element.id;
            data.viewValue = element.name;
            this.courtDetails_list.push(data);
          });
        }
      },
      err => {

      }
    );
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

  fetchAllLegalEntries(payload) {
    this.workflowService.getDataPost(payload, APIConst.DOI_JPA_LEGAL_ENTRY_LISTING)
    .subscribe((resp:any) => {
      console.log("Legal data " + resp);
      if (resp !==undefined && resp.status ===200 ) {

      const data = resp && resp.result ? resp.result : null;
      const { size, totalElement, result, totalPage } = data;
      this.totalRecords = totalElement;
      this.pageSize = size;
      this.Element_Data = resp.result.result;
      this.dataSource = new MatTableDataSource<any>(this.listingData(this.Element_Data));
      }
    });
  }

  onPaginateChange(event) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    const opt: any = [];
    let map = new Map<string, string>();
    let cnt = 0;

    if (this.jpaLegalEntry.value.inwardDate !== '' && this.jpaLegalEntry.value.inwardDate !== null) {
      map.set('doiJpaLegalEntry.inwardDt', this.dateFormatter(this.jpaLegalEntry.value.inwardDate, "dd/MM/yyyy"));
    }
    if (this.jpaLegalEntry.value.inwardNo !== '' && this.jpaLegalEntry.value.inwardNo !== null) {
      map.set('doiJpaLegalEntry.inwardNo', this.jpaLegalEntry.value.inwardNo);
    }
    if (this.jpaLegalEntry.value.caseNo !== '' && this.jpaLegalEntry.value.caseNo !== null) {
      map.set('courtCaseNo', this.jpaLegalEntry.value.caseNo);
    }
    if (this.jpaLegalEntry.value.applicantName !== '' && this.jpaLegalEntry.value.applicantName !== null) {
      map.set('applicantName', this.jpaLegalEntry.value.applicantName);
    }
    if (this.jpaLegalEntry.value.claimNo !== '' && this.jpaLegalEntry.value.claimNo !== null) {
      map.set('claimNumber', this.jpaLegalEntry.value.claimNo);
    }
    if (this.jpaLegalEntry.value.dateOfAccident !== '' && this.jpaLegalEntry.value.dateOfAccident !== null) {
      map.set('accidentDeathDt', this.dateFormatter(this.jpaLegalEntry.value.dateOfAccident, "dd/MM/yyyy"));
    }
    if (this.jpaLegalEntry.value.schemeType !== '' && this.jpaLegalEntry.value.schemeType !== null) {
      map.set('schemeType', this.jpaLegalEntry.value.schemeType);
    }
    if (this.jpaLegalEntry.value.district !== '' && this.jpaLegalEntry.value.district !== null) {
      map.set('districtId', this.jpaLegalEntry.value.district);
    }
    if (this.jpaLegalEntry.value.courtDetails !== '' && this.jpaLegalEntry.value.courtDetails !== null) {
      map.set('courtTypeId', this.jpaLegalEntry.value.courtDetails);
    }

    let arr: any = [];
    let i = 0;
    map.forEach((key, value) => {
      arr[i++] = { 'key': value, 'value': key };

    })
    arr[i++] = { 'key': 'activeStatus', 'value': "1" };
    const passData = {
      pageIndex: this.pageIndex,
      pageElement: this.pageSize,

      sortByColumn: 'doiJpaLegalEntry.inwardNo',
      sortOrder: 'asc',
      jsonArr: arr

    }

    this.fetchAllLegalEntries(passData);
  }

  listingData(result:any[]) {
    let data :Array<any> =[];
    let count :number = 1;
    result.forEach(element => {
      let tmp = new JpaLegal();
      let districtValue = this.districtList.filter(x => x.value+'' == (''+element.districtId));
      let  districtValue1 = districtValue.length <= 0 ? '': districtValue[0].viewValue;
      let orderStatusIdVal = this.orderStatusList.filter(x => x.value+'' == (''+element.orderStatusId));
      let  orderStatusId = orderStatusIdVal.length <= 0 ? '': orderStatusIdVal[0].viewValue;

      orderStatusId
      const mapped = {
      srno:""+count++,
      applicantName : element.applicantName,
      claimId : element.claimNumber,
      courtCaseDate : this.dateFormatter(element.courtCaseDt, "dd/MM/yyyy"),
      courtDecision : element.courtDecision,
      courtDetails : element.courtDetails,
      courtTypeId : element.courtTypeId,
      courtCaseNo: element.courtCaseNo,
      nameofDeceasedPerson : element.deadPersonName,
      district : districtValue1,
      inwardDate : element.inwardDt,
      inwardNo : element.inwardNo,
      orderStatus : element.orderStatus,
      orderStatusId : element.orderStatusId,
      policyNo : element.policyNum,
      detailofQuery : element.queryDetails,
      schemeId : element.schemeId,
      status : orderStatusId,
      legalEntryId: element.legalEntryId,
      legalDtlsId: element.legalDtlsId,
      dateOfAci : this.dateFormatter(element.accidentDeathDt,"dd/MM/yyyy"),
      createModeON : this.dateFormatter(element.createdDate, "dd-MM-yyyy hh:mm"),
      modifyModeON : this.dateFormatter(element.updatedDate, "dd-MM-yyyy hh:mm"),
     
      }
      
      
      data.push(mapped);
    });
    return data;
  }
  navigate(element) {
    this.jpaUtilityService.setSelectedJpaApprovedData(element);
    this.router.navigate(['./dashboard/doi/jpa-legal-entry']);
  }

  dateFormatter(date:string, pattern: string) {
    if(date !== undefined) {
      try {
      return this.datePipe.transform(new Date(date), pattern);
      } catch(Exception ) {
        console.log(Exception);
      }
    }
  }

  searchDisplay() {
    console.log(this.jpaLegalEntry);
    let map = new Map<string, string>();
    if (this.jpaLegalEntry.value.inwardDate !== '' && this.jpaLegalEntry.value.inwardDate !== null) {
      map.set('doiJpaLegalEntry.inwardDt', this.dateFormatter(this.jpaLegalEntry.value.inwardDate, "dd/MM/yyyy"));
    }
    if (this.jpaLegalEntry.value.inwardNo !== '' && this.jpaLegalEntry.value.inwardNo !== null) {
      map.set('doiJpaLegalEntry.inwardNo', this.jpaLegalEntry.value.inwardNo);
    }
    if (this.jpaLegalEntry.value.caseNo !== '' && this.jpaLegalEntry.value.caseNo !== null) {
      map.set('courtCaseNo', this.jpaLegalEntry.value.caseNo);
    }
    if (this.jpaLegalEntry.value.applicantName !== '' && this.jpaLegalEntry.value.applicantName !== null) {
      map.set('applicantName', this.jpaLegalEntry.value.applicantName);
    }
    if (this.jpaLegalEntry.value.claimNo !== '' && this.jpaLegalEntry.value.claimNo !== null) {
      map.set('claimNumber', this.jpaLegalEntry.value.claimNo);
    }
    if (this.jpaLegalEntry.value.dateOfAccident !== '' && this.jpaLegalEntry.value.dateOfAccident !== null) {
      map.set('accidentDeathDt', this.dateFormatter(this.jpaLegalEntry.value.dateOfAccident, "dd/MM/yyyy"));
    }
    if (this.jpaLegalEntry.value.schemeType !== '' && this.jpaLegalEntry.value.schemeType !== null) {
      map.set('schemeType', this.jpaLegalEntry.value.schemeType);
    }
    if (this.jpaLegalEntry.value.district !== '' && this.jpaLegalEntry.value.district !== null) {
      map.set('districtId', this.jpaLegalEntry.value.district);
    }
    if (this.jpaLegalEntry.value.courtDetails !== '' && this.jpaLegalEntry.value.courtDetails !== null) {
      map.set('courtTypeId', this.jpaLegalEntry.value.courtDetails);
    }
    let arr: any = [];
    let i = 0;
    map.forEach((key, value) => {
      arr[i++] = { 'key': value, 'value': key };

    })
    arr[i++] = { 'key': 'activeStatus', 'value': "1" };
    const passData = {
      pageIndex: 0,
      // pageElement: this.pageElements,
      pageElement: 10,

      sortByColumn: 'doiJpaLegalEntry.inwardNo',
      sortOrder: 'asc',
      jsonArr: arr

    }

    this.fetchAllLegalEntries(passData);
  }

  onEditClick(element) {
    console.log(element);
  }

  Reset(){
    let data =[];
    this.dataSource = new MatTableDataSource<any>(data);
  }
}

