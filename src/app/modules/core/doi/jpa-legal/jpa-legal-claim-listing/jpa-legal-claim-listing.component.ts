import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ListValue } from 'src/app/models/doi/doiModel';
import { APIConst } from 'src/app/shared/constants/doi/doi-api.constants';
import { DoiService } from '../../service/doi.service';
import { JpaUtilityService } from '../../service/jpa-utility.service';

@Component({
  selector: 'app-jpa-legal-claim-listing',
  templateUrl: './jpa-legal-claim-listing.component.html',
  styleUrls: ['./jpa-legal-claim-listing.component.css']
})
export class JpaLegalClaimListingComponent implements OnInit {
  totalRecords: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;

  todayDate = new Date();
  // Form Group
  jpaLegalClaim: FormGroup;
  // Control
  districtCtrl: FormControl = new FormControl();
  schemeTypeCtrl: FormControl = new FormControl();
  typeOfYearCtrl: FormControl = new FormControl();
  typeMonthCtrl: FormControl = new FormControl();
  adisabledDiedCtrl: FormControl = new FormControl();
  // List
  deac_list: ListValue[] = [];
  //   {
  //   value: '1', viewValue: 'Died'
  // },
  // { value: '2', viewValue: 'Disabled' },
  // ];
  schemeType_list: ListValue[] = [];
  //   {
  //     value: '1', viewValue: 'Registered Farmer'
  //   },
  //   { value: '2', viewValue: 'ITI Students ' },
  //   { value: '3', viewValue: 'Unorganised Landless Labours    ' },
  //   { value: '4', viewValue: ' Secondary and Higher Secondary Student ' },
  //   { value: '5', viewValue: ' Nominee of Registered Farmer  ' },
  //   { value: '6', viewValue: '  Primary School Student ' },
  //   { value: '7', viewValue: 'Safai Kamdar' },
  //   { value: '8', viewValue: 'Orphan Widows  ' },
  //   { value: '9', viewValue: 'Sports Hostel Trainees  ' },
  //   { value: '10', viewValue: ' Hira Udhyog Workers' },
  //   { value: '11', viewValue: ' Handicapped Person ' },
  //   { value: '12', viewValue: 'Police Personnel DYSP and above ' },
  //   { value: '13', viewValue: 'Police Personnel PI and PSI and PSO ' },
  //   { value: '14', viewValue: 'Police Personnel Head Constable and Constable    ' },
  //   { value: '16', viewValue: 'Police Personnel ATS and Bomb Squad  ' },
  //   { value: '17', viewValue: 'Police Personnel CM Security and Chetak Commando' },
  //   { value: '18', viewValue: 'All Jail Guards ' },
  //   { value: '19', viewValue: 'All uniformed employee of Jail Dept Other than Jail Guards' },
  //   { value: '20', viewValue: 'Pilgrim of Kailash Mansarovar' },
  //   { value: '21', viewValue: 'Pilgrim of Amarnath' },
  //   { value: '22', viewValue: 'Participants of Adventurous Activities' },
  //   { value: '23', viewValue: 'Shahid Veer Kinarivbrala College Student' },
  //   { value: '0', viewValue: 'Shahid Veer Kinarivbrala College Student' },
  // ];

  districtList: ListValue[] = [];
  //   { value: '00', viewValue: 'Ahmedabad' },
  //   { value: '1', viewValue: 'Amreli' },
  //   { value: '2', viewValue: 'Anand' },
  //   { value: '3', viewValue: 'Aravalli' },
  //   { value: '04', viewValue: 'Banaskantha' },
  //   { value: '05', viewValue: 'Bharuch' },
  //   { value: '06', viewValue: 'Bhavnagar' },
  // ];

  
  talukaList: ListValue[] = [];
  //   { value: '0', viewValue: 'Ahmedabad' },
  //   { value: '1', viewValue: 'Amreli' },
  //   { value: '2', viewValue: 'Anand' },
  //   { value: '3', viewValue: 'Aravalli' },
  //   { value: '4', viewValue: 'Banaskantha' },
  //   { value: '5', viewValue: 'Bharuch' },
  //   { value: '06', viewValue: 'Bhavnagar' },
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

  Element_Data: any[] = [];


  //   {
  //     srno: '1',
  //     claimId: '141	',
  //     policyNo: '	DOI/JPA/48/P/2019-20/000001',
  //     scheme: 'NOMINEE OF REGISTERED FARMER',
  //     des: 'Died',
  //     DecPersonName: 'PRAJAPATI AMBALAL MAGANBHAI',
  //     applicantName: 'PRAJAPATI MANJULABEN',
  //     district: 'VADODARA',
  //     taluka: 'KARJAN',
  //     claimEnterDate: '	21-Apr-2019',
  //     createModeON: '22-Apr-2018 12:22pm',
  //     modifyModeON: '22-Jun-2018 12:22pm',
  //     status: 'PENDING FOR ACCEPT',
  //     action: ''
  //   },
  //   {
  //     srno: '2',
  //     claimId: '271',
  //     policyNo: 'DOI/JPA/48/P/2019-20/000001',
  //     scheme: 'NOMINEE OF REGISTERED FARMER',
  //     des: 'Disabled',
  //     DecPersonName: 'ARCHITBHAI ARVINDBHAI GAYAKVAD',
  //     applicantName: 'SANKUBEN ARVINDBHAI GAYAKVAD',
  //     district: 'THE DANGS',
  //     taluka: 'AHWA',
  //     claimEnterDate: '4-Mar-2019',

  //     createModeON: '5-Apr-2018 12:22pm',
  //     modifyModeON: '6-Jun-2018 12:22pm',
  //     status: 'PENDING FOR ACCEPT',
  //     action: ''
  //   },
  //   {
  //     srno: '3',
  //     claimId: '285',
  //     policyNo: 'DOI/JPA/48/P/2019-20/000001	',
  //     scheme: 'NOMINEE OF REGISTERED FARMER',
  //     des: 'Died',
  //     DecPersonName: '	THAKOR HIRAJI P	',
  //     applicantName: 'PRAVINBHAI CHAUHAN',
  //     district: '	GANDHINAGAR	',
  //     taluka: 'DEHGAM',
  //     claimEnterDate: '	5-Aug-2019',

  //     createModeON: '22-Apr-2018 12:22pm',
  //     modifyModeON: '23-Jun-2018 12:22pm',
  //     status: 'PENDING FOR ACCEPT',
  //     action: ''
  //   },
  //   {
  //     srno: '4',
  //     claimId: '849',
  //     policyNo: '	DOI/JPA/48/P/2019-20/000001',
  //     scheme: '	UNORGANISED LANDLESS LABOURS	',
  //     des: 'Disabled',
  //     DecPersonName: 'SANDHAVANI IKBALBHAI HASAMBHAI	',
  //     applicantName: 'SADHAVANI HASMBHAI',
  //     district: '	JAMNAGAR	',
  //     taluka: 'JAMNAGAR CITY',
  //     claimEnterDate: '	6-Dec-2019',

  //     createModeON: '22-Apr-2018 12:22pm',
  //     modifyModeON: '2-Jun-2018 12:22pm',
  //     status: 'PENDING FOR ACCEPT',
  //     action: ''
  //   },
  //   {
  //     srno: '5',
  //     claimId: '901	',
  //     policyNo: 'DOI/JPA/48/P/2019-20/000001',
  //     scheme: '	NOMINEE OF REGISTERED FARMER',
  //     des: 'Died',
  //     DecPersonName: '	PARMAR BHARATBHAI MAYABHAI	',
  //     applicantName: 'PARAMAR MAYABHAI LAGHARBHAI',
  //     district: '	SURENDRANAGAR	',
  //     taluka: 'MULI	',
  //     claimEnterDate: '8-Jul-2019',
  //     createModeON: '12-Apr-2018 12:22pm',
  //     modifyModeON: '27-Jun-2018 12:22pm',
  //     status: 'PENDING FOR ACCEPT',
  //     action: ''
  //   },
  //   {
  //     srno: '6',
  //     claimId: '915',
  //     policyNo: '	DOI/JPA/48/P/2018-19/000001	',
  //     scheme: 'UNORGANISED LANDLESS LABOURS',
  //     des: 'Disabled',
  //     DecPersonName: '	SAMBAI VIRJI KOLI',
  //     applicantName: '	KOLI RAMESH	',
  //     district: 'KACHCHH',
  //     taluka: '	BHUJ',
  //     claimEnterDate: '9-Aug-2019',
  //     createModeON: '16-Apr-2018 12:22pm',
  //     modifyModeON: '26-Jun-2018 12:22pm',
  //     status: 'PENDING FOR ACCEPT',
  //     action: ''
  //   },
  //   {
  //     srno: '7',
  //     claimId: '1042	',
  //     policyNo: 'DOI/JPA/48/P/2019-20/000001',
  //     scheme: '	UNORGANISED LANDLESS LABOURS',
  //     des: 'Died',
  //     DecPersonName: '	DEEPAK RATILAL SURTI',
  //     applicantName: '	MAHYAVANSHI RATILAL BABUBHAI',
  //     district: '	VALSAD	',
  //     taluka: 'UMBERGAON	',
  //     claimEnterDate: '22-Sep-2019',
  //     createModeON: '6-Apr-2018 12:22pm',
  //     modifyModeON: '8-Jun-2018 12:22pm',
  //     status: 'PENDING FOR ACCEPT',
  //     action: ''
  //   },
  //   {
  //     srno: '8',
  //     claimId: '1043	',
  //     policyNo: 'DOI/JPA/48/P/2018-19/000001',
  //     scheme: '	UNORGANISED LANDLESS LABOURS	',
  //     des: 'Disabled',
  //     DecPersonName: 'VASAVA SANDIPKUMAR',
  //     applicantName: '	VASAVA RAMJIBHAI',
  //     district: '	SURAT	',
  //     taluka: 'UMARPADA	',
  //     claimEnterDate: '22-Nov-2019',
  //     createModeON: '15-Apr-2018 12:22pm',
  //     modifyModeON: '12-Jun-2018 12:22pm',
  //     status: 'PENDING FOR ACCEPT',
  //     action: ''
  //   },
  //   {
  //     srno: '9',
  //     claimId: '1147',
  //     policyNo: '	DOI/JPA/48/P/2019-20/000001	',
  //     scheme: 'REGISTERED FARMER	',
  //     des: 'Died',
  //     DecPersonName: 'RATHVA BUDDHILALBHAI',
  //     applicantName: '	RATHVA DAMNIBEN',
  //     district: '	CHHOTAUDEPUR	',
  //     taluka: 'BODELI',
  //     claimEnterDate: '2-Dec-2019',
  //     createModeON: '10-Apr-2018 12:22pm',
  //     modifyModeON: '9-Jun-2018 12:22pm',
  //     status: 'PENDING FOR ACCEPT',
  //     action: ''
  //   },
  //   {
  //     srno: '10',
  //     claimId: '1153	',
  //     policyNo: 'DOI/JPA/48/P/2019-20/000001',
  //     scheme: '	SHAHID VEER KINARIWALA COLLEGE STUDENT	',
  //     des: 'Disabled',
  //     DecPersonName: 'PATEL MANSIBEN DILIPBHAI	',
  //     applicantName: 'PATEL DILIPBHAI	',
  //     district: 'BHARUCH',
  //     taluka: '	HANSOT',
  //     claimEnterDate: '3-Dec-2019',
  //     createModeON: '8-Apr-2018 12:22pm',
  //     modifyModeON: '7-Jun-2018 12:22pm',
  //     status: 'PENDING FOR ACCEPT',
  //     action: ''
  //   },


  // ];

  displayedColumns: any[] = [
    'srno',
    // 'claimId',
    // 'policyNo',
    'schemeName',
    'des',
    'DecPersonName',
    'applicantName',
    'district',
    'taluka',
    'claimEnterDate',
    'createModeON',
    'modifyModeON',
    'status',
    'action'

  ];

  dataSource = new MatTableDataSource<any>(this.Element_Data);

  constructor(private router: Router, public dialog: MatDialog, private fb: FormBuilder,
    private workflowService: DoiService, private datePipe: DatePipe,  private jpaUtilityService: JpaUtilityService) { }

  ngOnInit() {
    this.jpaLegalClaim = this.fb.group({
      district: [''],
      month: [''],
      year: [''],
      fromDate: [''],
      endDate: [''],
      schemeType: [''],
      disabledDied: ['']
    });
    this.searchDisplay();
    this.getDistrictList();
    this.getDeceasedDetailsList();
    this.getMonthsList();
    this.getSchemeMasterList();
    this.getYearList();
  }

  // Navigation Route
  navigate(element) {
    this.jpaUtilityService.setSelectedJpaApprovedData(element);
    this.router.navigate(['./dashboard/doi/jpa-legal-entry']);
  }

  fetchAllLegalEntries(payload) {    
    this.workflowService.getData(payload,APIConst.DOI_JPA_LEGAL_CLAIM_LISTING)
    .subscribe((resp:any) => {
      if (resp && resp.result && resp.status === 200) {
        const data = resp && resp.result ? resp.result : null;
        const { size, totalElement, result, totalPage } = data;
        this.totalRecords = totalElement;
        this.pageSize = size;
        this.Element_Data = resp.result.result;
        this.dataSource = new MatTableDataSource<any>(this.listingData(this.Element_Data));
      }
      
    });
  }
  listingData(result:any[]) {
    let Element_Data: any = [];
   let count :number = 1;
   result.forEach(element => {
     let districtValue = this.districtList.filter(x => x.value == (''+element.districtId));
     let  districtValue1 = districtValue.length <= 0 ? '': districtValue[0].viewValue;
     let schemeValue = this.schemeType_list.filter(x => x.value == (''+element.schemeId));
     let  schemeView = schemeValue.length <= 0 ? '': schemeValue[0].viewValue;
     let talukaList = this.talukaList.filter(x => x.value == (''+element.talukaId));
     let  taluka = talukaList.length <= 0 ? '': talukaList[0].viewValue;
     let dis = this.deac_list.filter(x => x.value == (''+element.personTypeId));
     let  disVal = dis.length <= 0 ? '': dis[0].viewValue;
     const data = {
        srno: count++,
        claimId:  element.claimNumber,
        ploicyNo: element.policyNum,
        scheme:schemeView,
        des: disVal,
        DecPersonName: element.disabledDiedName,
        applicantName: element.applicantName,
        district:districtValue1,
        taluka: taluka,
        claimEnterDate: element.claimEntryDate,
        createModeON: element.createdDate, 
        modifyModeON: element.updatedDate,
        status:element.claimStatus,
        action: '',
        legalDtlsId:element.legalDtlsId,
        legalEntryId : element.legalEntryId,
    }
      
     Element_Data.push(data);
   });
   return Element_Data;
 }
  dateFormatter(date:string, pattern: string) {
    let  date1 = new Date(date);
    return this.datePipe.transform(date, pattern);
   }

   searchDisplay() {
    console.log(this.jpaLegalClaim);
    const opt: any = [{}];
    let map = new Map<string, string>();
    let cnt = 0;
    if(this.jpaLegalClaim.value.district !== '' && this.jpaLegalClaim.value.district !==null) {
      
      opt[cnt++]= {'key':'districtId', 'value':this.jpaLegalClaim.value.district };
    }
    if(this.jpaLegalClaim.value.month !== '' && this.jpaLegalClaim.value.month !==null) {
    
      opt[cnt++]= {'key':'claimMonthId', 'value':this.jpaLegalClaim.value.month };
    }
    if(this.jpaLegalClaim.value.year !== '' && this.jpaLegalClaim.value.year !==null) {
   
      opt[cnt++]= {'key':'claimYearId', 'value':this.jpaLegalClaim.value.year };
    }
    if(this.jpaLegalClaim.value.disabledDied !== '' && this.jpaLegalClaim.value.disabledDied !==null) {
      
      opt[cnt++]= {'key':'personTypeId', 'value':this.jpaLegalClaim.value.disabledDied };
    }
    if(this.jpaLegalClaim.value.fromDate !== '' && this.jpaLegalClaim.value.fromDate !==null && this.jpaLegalClaim.value.fromDate !==undefined) {
     
      let date = this.dateFormatter(this.jpaLegalClaim.value.fromDate,"dd/MM/yyyy");
      opt[cnt++]= {'key':'createdDate', 'value':date, 'operation':'>='};
    }
    if(this.jpaLegalClaim.value.endDate !== '' && this.jpaLegalClaim.value.endDate !==null  && this.jpaLegalClaim.value.endDate !==undefined) {
    
      let date = this.dateFormatter(this.jpaLegalClaim.value.endDate,"dd/MM/yyyy");
      opt[cnt++]= {'key':'createdDate', 'value':date,'operation':'<=' };
    }
    if(this.jpaLegalClaim.value.schemeType !== '' && this.jpaLegalClaim.value.schemeType !== null){
      opt[cnt++]= {'key':'schemeId', 'value':this.jpaLegalClaim.value.schemeType };
    }
    opt[cnt++]= {'key':'activeStatus', 'value': "1" };
    const passData = {
      pageIndex: 0,
      // pageElement: this.pageElements,
      pageElement: 10,

       sortByColumn: 'schemeId',
       sortOrder: 'asc',
       
       jsonArr: opt
     
  }
  this.fetchAllLegalEntries(passData);   
  }

  viewRecord(element) {
    this.jpaUtilityService.setSelectedJpaApprovedData(element);
    this.router.navigate(['./dashboard/doi/jpa-legal-entry']);
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

  getSchemeMasterList() {
    this.workflowService.getDataWithoutParams(APIConst.DOI_MASTER_SCHEME_POLICY_DROPDOWN).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          this.schemeType_list = resp.result;
        }
      }
    );
  }

  getDeceasedDetailsList() {
    const params = {
      "name":"JPA_LE_DECE_PER"
    };
    this.workflowService.getDataPost(params, APIConst.COMMON_DROPDOWN_WITH_NAME).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          resp.result.forEach(element => {
            let data = new ListValue();
            data.value = element.id;
            data.viewValue = element.name;
            this.deac_list.push(data);
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
    this.workflowService.getDataPost(params, APIConst.COMMON_DROPDOWN_WITH_NAME).subscribe(
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

  Reset(){
    let data = [];
    this.dataSource = new MatTableDataSource<any>(data);
  }

  onPaginateChange(event) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    const opt: any = [];
    let map = new Map<string, string>();
    let cnt = 0;

    if(this.jpaLegalClaim.value.district !== '' && this.jpaLegalClaim.value.district !==null) {
      
      opt[cnt++]= {'key':'districtId', 'value':this.jpaLegalClaim.value.district };
    }
    if(this.jpaLegalClaim.value.month !== '' && this.jpaLegalClaim.value.month !==null) {
    
      opt[cnt++]= {'key':'claimMonthId', 'value':this.jpaLegalClaim.value.month };
    }
    if(this.jpaLegalClaim.value.year !== '' && this.jpaLegalClaim.value.year !==null) {
   
      opt[cnt++]= {'key':'claimYearId', 'value':this.jpaLegalClaim.value.year };
    }
    if(this.jpaLegalClaim.value.disabledDied !== '' && this.jpaLegalClaim.value.disabledDied !==null) {
      
      opt[cnt++]= {'key':'personTypeId', 'value':this.jpaLegalClaim.value.disabledDied };
    }
    if(this.jpaLegalClaim.value.fromDate !== '' && this.jpaLegalClaim.value.fromDate !==null && this.jpaLegalClaim.value.fromDate !==undefined) {
     
      let date = this.dateFormatter(this.jpaLegalClaim.value.fromDate,"dd/MM/yyyy");
      opt[cnt++]= {'key':'createdDate', 'value':date, 'operation':'>='};
    }
    if(this.jpaLegalClaim.value.endDate !== '' && this.jpaLegalClaim.value.endDate !==null  && this.jpaLegalClaim.value.endDate !==undefined) {
    
      let date = this.dateFormatter(this.jpaLegalClaim.value.endDate,"dd/MM/yyyy");
      opt[cnt++]= {'key':'createdDate', 'value':date,'operation':'<=' };
    }
    if(this.jpaLegalClaim.value.schemeType !== '' && this.jpaLegalClaim.value.schemeType !== null){
      opt[cnt++]= {'key':'schemeId', 'value':this.jpaLegalClaim.value.schemeType };
    }

    const passData = {
      pageIndex: this.pageIndex,
      pageElement: this.pageSize,
      sortByColumn: 'schemeId',
      sortOrder: 'asc',
      jsonArr: opt
    }

    this.fetchAllLegalEntries(passData);
  }
}
