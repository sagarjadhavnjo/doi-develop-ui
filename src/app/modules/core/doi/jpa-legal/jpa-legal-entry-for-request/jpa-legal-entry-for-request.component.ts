import { Component, OnInit, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table'
import { MatDialog } from '@angular/material/dialog'
import { jpaMessage } from 'src/app/common/error-message/common-message.constants';
import { ToastrService } from 'ngx-toastr';
import { ListValue, LEgalEntryRequest } from 'src/app/models/doi/doiModel';
import { DoiService } from '../../service/doi.service';
import { APIConst } from 'src/app/shared/constants/doi/doi-api.constants';
import { DatePipe } from '@angular/common';
import { JpaUtilityService } from '../../service/jpa-utility.service';
import { timeStamp } from 'console';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { msgConst } from 'src/app/shared/constants/edp/edp-msg.constants';
@Component({
  selector: 'app-jpa-legal-entry-for-request',
  templateUrl: './jpa-legal-entry-for-request.component.html',
  styleUrls: ['./jpa-legal-entry-for-request.component.css']
})
export class JpaLegalEntryForRequestComponent implements OnInit {


  todayDate = new Date();
  // Form Group
  jpaLegalEntry: FormGroup;
  // List
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
  // ];
  courtDetails_list: ListValue[] = [];
  //   { value: '1', viewValue: 'Forum' },
  //   { value: '2', viewValue: 'State Commission' },
  //   { value: '3', viewValue: 'National Commission' },


  // ];
  districtList: ListValue[] = [];
  //   { value: '0', viewValue: 'Ahmedabad' },
  //   { value: '01', viewValue: 'Amreli' },
  //   { value: '02', viewValue: 'Anand' },
  //   { value: '03', viewValue: 'Aravalli' },
  //   { value: '04', viewValue: 'Banaskantha' },
  //   { value: '05', viewValue: 'Bharuch' },
  //   { value: '45', viewValue: 'Bhavnagar' },
  // ];
  attachmentTypeCode: any[] = [];
  //   { value: '01', viewValue: 'Supporting Document' },
  //   { value: '02', viewValue: 'Sanction Order' },
  //   { value: '03', viewValue: 'Others' },
  //   // { type: 'view' }
  // ];

  // control
  districtCtrl: FormControl = new FormControl();
  schemeTypeCtrl: FormControl = new FormControl();
  errorMessage: any;
  courtDetailsCtrl: FormControl = new FormControl();
  // Table Source

  Element_Data: LEgalEntryRequest[] = [];

  displayedColumns: any[] = [
    'srno',
    'courtCaseNo',
    'courtCaseDate',
    'claimId',
    'ploicyNo',
    'district',
    'applicantName',
    'nameofDeceasedPerson',
    'dateOfAci',
    'action'

  ];
  // Table Source
  dataSource = new MatTableDataSource<any>(this.Element_Data);


  constructor(private router: Router, private el: ElementRef,
    public dialog: MatDialog, private fb: FormBuilder, private toastr: ToastrService,
    private workflowService : DoiService,private datePipe: DatePipe, private jpaUtilityService: JpaUtilityService) { }

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
      courtCaseDate: [''],
      policyNo: [''],
      courtDetails: [''],
      courtDesc: [''],
      nameOfDese: [''],
      dateAcc: [''],
      detailOfQuery: ['']
    });

    //this.fetchListingData();
    this.getDistrictList();
  }
  // NAvigation

  navigate() {
      //this.jpaUtilityService.setSelectedJpaApprovedData(element);
      this.router.navigate(['./dashboard/doi/jpa-legal-entry-for-request-listing']);
  }

  Add(){
    let count :number = 1;
    if(this.jpaLegalEntry.valid){
      let data=[];
      if (this.dataSource.data.length > 0) {
        this.dataSource.data.forEach(element => {
          element.srno =count;
          data.push(element);
          count = count + 1;
        });
        
      }
    let newData = {
      srno : count,
      courtCaseNo : this.jpaLegalEntry.controls.caseNo.value,
      applicantName : this.jpaLegalEntry.controls.applicantName.value,
      claimId : this.jpaLegalEntry.controls.claimNo.value,
      courtCaseDate : this.dateFormatter(this.jpaLegalEntry.controls.courtCaseDate.value, "dd/MM/yyyy"),
      nameofDeceasedPerson : this.jpaLegalEntry.controls.nameOfDese.value,
      district : this.jpaLegalEntry.controls.district.value,
      ploicyNo :  this.jpaLegalEntry.controls.policyNo.value,
      dateOfAci : this.dateFormatter(this.jpaLegalEntry.controls.dateOfAccident.value, "dd/MM/yyyy")
    }

    data.push(newData);
    this.dataSource = new MatTableDataSource<any>(data);
  }
}

Reset(){
  let data =[];
  this.dataSource = new MatTableDataSource<any>(data);
}

public DeleteRecord(element: any) {
  const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    width: '360px',
    data: msgConst.CONFIRMATION_DIALOG.DELETE
  });
  dialogRef.afterClosed().subscribe(result => {
    if (result === 'yes') {
      let count=1;
      let data=[];
      // if (element.schemeId == null) {
        var index = this.dataSource.data.indexOf(element);
        if (index !== -1) {
          this.dataSource.data.splice(index, 1);

          if (this.dataSource.data.length > 0) {
            this.dataSource.data.forEach(element => {
              element.srno =count;
              data.push(element);
              count = count + 1;
            });
            this.dataSource = new MatTableDataSource<any>(data);
          }else{
            this.dataSource = new MatTableDataSource<any>([]);
          }
          //this.dataSource.data =this.dataSource.data;
        // }
        // var index1 = this.Element_Data.indexOf(element);
        // if (index1 !== -1) {
        //   this.Element_Data.splice(index, 1);
        // }
        // this.dataSource.data = this.Element_Data;
      }
    }
  });
}

  saveData() {
    if (this.jpaLegalEntry.valid && this.dataSource.data.length > 0) {
      let date = this.dateFormatter(this.jpaLegalEntry.controls.courtCaseDate.value, 'dd-MMM-yyyy');
      const payLoad = {
        'claimNumber': this.jpaLegalEntry.controls.claimNo.value,
        'courtCaseNo': this.jpaLegalEntry.controls.caseNo.value,
        'applicantName': this.jpaLegalEntry.controls.applicantName.value,
        'accidentDeathDt': this.dateFormatter(this.jpaLegalEntry.controls.dateOfAccident.value, 'dd-MMM-yyyy'),
        'districtId': this.jpaLegalEntry.controls.district.value,
        'deadPersonName': this.jpaLegalEntry.controls.nameOfDese.value,
        'courtCaseDt': this.dateFormatter(this.jpaLegalEntry.controls.courtCaseDate.value, 'dd-MMM-yyyy'),
        'policyNum': this.jpaLegalEntry.controls.policyNo.value,
        'legalDtlsId': 1,
        'legalEntryId': 11,
        'commissionType': 'Extrenal'
      }

      this.workflowService.getDataPost(payLoad, APIConst.DOI_JPA_LEGAL_ENTRY_FOR_REQUEST).subscribe((data : any) => {
        if (data.status === 200) {
          this.toastr.success(data.message);
        }
      });
    } else {
      this.toastr.warning("Please fill mandatory fields..");
    }
  }
  dateFormatter(date:string, pattern: string) {
    let  date1 = new Date(date);
    return this.datePipe.transform(date, pattern);
   }

   fetchListingData() {
    
     let payLoad;
     const passData = {
      pageIndex: 0,
      // pageElement: this.pageElements,
      pageElement: 3,

       sortByColumn: 'doiJpaLegalEntry.inwardNo',
       sortOrder: 'asc',
       jsonArr: [{
        'key':'activeStatus',
        'value': '1'
      }]
     
  }
     this.workflowService.getDataWithoutParams(APIConst.DOI_JPA_LEGAL_ENTRY_FOR_REQUEST_LISTING)
     .subscribe((data:any) => {
      this.dataSource = new MatTableDataSource<any>(this.listingData(data.result.result));
     });
   }

   listingData(result:any[]) {
    let Element_Data: Array<LEgalEntryRequest> = [];
    let count :number = 1;
    result.forEach(element => {
      let el = new LEgalEntryRequest();
      el.srno= ""+count++;
      
      let districtValue = this.districtList.filter(x => x.value == (''+element.districtId));
      let  districtValue1 = districtValue.length < 0 ? '': districtValue[0].viewValue;
      el.courtCaseNo = element.courtCaseNo;
      el.applicantName = element.applicantName,
      el.claimId = element.claimNumber,
      el.courtCaseDate = this.dateFormatter(element.courtCaseDt, "dd/MM/yyyy"),
      el.courtDecision = element.courtDecision,
      el.courtDetail = element.courtDetails,
      el.nameofDeceasedPerson = element.deadPersonName,
      el.district = districtValue1,
      el.ploicyNo =  element.policyNum,
      el.detailofQuery = element.queryDetails,
      el.scheme = element.schemeName,
      el.legalDtlsId=element.legalDtlsId,
      el.legalEntryId = element.legalEntryId,
      el.dateOfAci = this.dateFormatter(element.accidentDeathDt,"dd/MM/yyyy"),
      Element_Data.push(el);
    });
    return Element_Data;
  }
  
  editRecord(element) {
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
  
}
