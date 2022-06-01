import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { doiMessage } from 'src/app/common/error-message/common-message.constants';
import { ListValue, PartyMasterBankDetails, TalukaList1 } from 'src/app/models/doi/doiModel';

@Component({
  selector: 'app-surveyor-master',
  templateUrl: './surveyor-master.component.html',
  styleUrls: ['./surveyor-master.component.css']
})
export class SurveyorMasterComponent implements OnInit {

  todayDate = new Date();
  errorMessage = doiMessage;
  surveyorMasterForm: FormGroup;
  surveyorRecordsForm: FormGroup;

  districtCtrl: FormControl = new FormControl();
  talukaCtrl: FormControl = new FormControl();
  bankNameCtrl: FormControl = new FormControl();
  branchNameCtrl: FormControl = new FormControl();
  paymentPreferedCtrl: FormControl = new FormControl();


  districtList: ListValue[] = [];
  //   { value: '00', viewValue: 'Ahmedabad' },
  //   { value: '01', viewValue: 'Amreli' },
  //   { value: '02', viewValue: 'Anand' },
  //   { value: '03', viewValue: 'Aravalli' },
  //   { value: '04', viewValue: 'Banaskantha' },
  //   { value: '05', viewValue: 'Bharuch' },
  //   { value: '06', viewValue: 'Bhavnagar' },
  // ];
  taluka_list: TalukaList1[] = [];
  //   { value: '01', district: '00', districtadd: '00', nodalDistrict: '00', viewValue: 'City East' },
  //   { value: '02', district: '00', districtadd: '00', nodalDistrict: '00', viewValue: 'City West' },
  //   { value: '03', district: '00', districtadd: '00', nodalDistrict: '00', viewValue: 'Bavla' },
  //   { value: '04', district: '00', districtadd: '00', nodalDistrict: '00', viewValue: 'Daskroi' },
  //   { value: '05', district: '00', districtadd: '00', nodalDistrict: '00', viewValue: 'Detroj-Rampura' },
  //   { value: '06', district: '00', districtadd: '00', nodalDistrict: '00', viewValue: 'Dhandhuka' },
  //   { value: '07', district: '00', districtadd: '00', nodalDistrict: '00', viewValue: 'Dholera' },
  //   { value: '08', district: '00', districtadd: '00', nodalDistrict: '00', viewValue: 'Dholka' },
  //   { value: '09', district: '00', districtadd: '00', nodalDistrict: '00', viewValue: 'Mandal' },
  //   { value: '10', district: '00', districtadd: '00', nodalDistrict: '00', viewValue: 'Sanand' },
  //   { value: '11', district: '00', districtadd: '00', nodalDistrict: '00', viewValue: 'Viramgam' },
  //   { value: '01', district: '01', districtadd: '01', nodalDistrict: '01', viewValue: 'Amreli' },
  //   { value: '02', district: '01', districtadd: '01', nodalDistrict: '01', viewValue: 'Babra' },
  //   { value: '03', district: '01', districtadd: '01', nodalDistrict: '01', viewValue: 'Bagasara' },
  //   { value: '04', district: '01', districtadd: '01', nodalDistrict: '01', viewValue: 'Dhari' },
  //   { value: '05', district: '01', districtadd: '01', nodalDistrict: '01', viewValue: 'Jafrabad' },
  //   { value: '06', district: '01', districtadd: '01', nodalDistrict: '01', viewValue: 'Khambha' },
  //   { value: '07', district: '01', districtadd: '01', nodalDistrict: '01', viewValue: 'Kunkavav vadia' },
  //   { value: '08', district: '01', districtadd: '01', nodalDistrict: '01', viewValue: 'Lathi' },
  //   { value: '09', district: '01', districtadd: '01', nodalDistrict: '01', viewValue: 'Lilia' },
  //   { value: '10', district: '01', districtadd: '01', nodalDistrict: '01', viewValue: 'Rajula' },
  //   { value: '11', district: '01', districtadd: '01', nodalDistrict: '00', viewValue: 'Savarkundla' },
  //   { value: '01', district: '02', districtadd: '02', nodalDistrict: '02', viewValue: 'Anand' },
  //   { value: '02', district: '02', districtadd: '02', nodalDistrict: '02', viewValue: 'Anklav' },
  //   { value: '03', district: '02', districtadd: '02', nodalDistrict: '02', viewValue: 'Borsad' },
  //   { value: '04', district: '02', districtadd: '02', nodalDistrict: '02', viewValue: 'Khambhat' },
  //   { value: '05', district: '02', districtadd: '02', nodalDistrict: '02', viewValue: 'Petlad' },
  //   { value: '06', district: '02', districtadd: '02', nodalDistrict: '02', viewValue: 'Sojitra' },
  //   { value: '07', district: '02', districtadd: '02', nodalDistrict: '02', viewValue: 'Tarapur' },
  //   { value: '08', district: '02', districtadd: '02', nodalDistrict: '02', viewValue: 'Umreth' },
  //   { value: '01', district: '03', districtadd: '03', nodalDistrict: '03', viewValue: 'Bayad' },
  //   { value: '02', district: '03', districtadd: '03', nodalDistrict: '03', viewValue: 'Bhiloda' },
  //   { value: '03', district: '03', districtadd: '03', nodalDistrict: '03', viewValue: 'Dhansura' },
  //   { value: '04', district: '03', districtadd: '03', nodalDistrict: '03', viewValue: 'Malpur' },
  //   { value: '05', district: '03', districtadd: '03', nodalDistrict: '03', viewValue: 'Meghraj' },
  //   { value: '06', district: '03', districtadd: '03', nodalDistrict: '03', viewValue: 'Modasa' },
  //   { value: '01', district: '04', districtadd: '04', nodalDistrict: '04', viewValue: 'Amirgadh' },
  //   { value: '02', district: '04', districtadd: '04', nodalDistrict: '04', viewValue: 'Bhabhar' },
  //   { value: '03', district: '04', districtadd: '04', nodalDistrict: '04', viewValue: 'Danta' },
  //   { value: '04', district: '04', districtadd: '04', nodalDistrict: '04', viewValue: 'Dantiwada' },
  //   { value: '05', district: '04', districtadd: '04', nodalDistrict: '04', viewValue: 'Deesa' },
  //   { value: '06', district: '04', districtadd: '04', nodalDistrict: '04', viewValue: 'Deodar' },
  //   { value: '07', district: '05', districtadd: '05', nodalDistrict: '05', viewValue: 'Dhanera' },
  //   { value: '08', district: '04', districtadd: '04', nodalDistrict: '04', viewValue: 'Kankrej' },
  //   { value: '09', district: '06', districtadd: '06', nodalDistrict: '06', viewValue: 'Lakhani' },
  //   { value: '10', district: '04', districtadd: '04', nodalDistrict: '04', viewValue: 'Palanpur' },


  // ];
  talukaNameList: ListValue[];

  branchNameList: ListValue[] = [];
  //   { value: '1', viewValue: 'Ahmedabad' },
  //   { value: '2', viewValue: 'Dahod' },
  //   { value: '3', viewValue: 'Gandhinagar' },
  // ];

  bankNameList: ListValue[] = [];
  //   { value: '1', viewValue: 'Bank of Baroda' },
  //   { value: '2', viewValue: 'Bank of India' },
  //   { value: '3', viewValue: 'Canara Bank' },
  //   { value: '4', viewValue: ' Central Bank of India' },
  //   { value: '5', viewValue: 'Indian Bank' },
  //   { value: '6', viewValue: 'Indian Overseas Bank' },
  //   { value: '7', viewValue: 'Punjab National Bank' },
  //   { value: '8', viewValue: ' State Bank of India' },
  //   { value: '9', viewValue: ' Union Bank of India' },
  //   { value: '10', viewValue: 'Axis Bank' },
  //   { value: '11', viewValue: 'HDFC Bank' },
  //   { value: '12', viewValue: 'ICICI Bank' },
  //   { value: '13', viewValue: 'IDBI Bank' },
  //   { value: '14', viewValue: 'IDFC First Bank' },
  //   { value: '15', viewValue: ' IndusInd Bank' },
  //   { value: '16', viewValue: 'Jammu & Kashmir Bank ' },
  //   { value: '17', viewValue: 'Karnataka Bank' },
  //   { value: '18', viewValue: 'Karur Vysya Bank' },
  //   { value: '19', viewValue: ' South Indian Bank' },
  //   { value: '20', viewValue: ' Tamilnad Mercantile Bank' },
  //   { value: '20', viewValue: 'Axis Bank' },
  //   { value: '21', viewValue: 'Yes Bank' },
  // ];

  paymentPreferedList: ListValue[] = [];
  //   { value: '1', viewValue: 'Cash' },
  //   { value: '2', viewValue: 'Cheque' },
  // ];

  attachmentTypeCode: ListValue[] = [];
  //   { value: '1', viewValue: 'Supporting Document' },
  //   { value: '2', viewValue: 'Sanction Order' },
  //   { value: '3', viewValue: 'License Certificate Copy*' },
  //   { value: '4', viewValue: 'Others' },
  // ];

  displayedColumns2: string[] = [
    'bankName',
    'branchName',
    'ifscCode',
    'accountNo',
    'paymentPrefered',
    'action',
  ];
  elementData2: PartyMasterBankDetails[] = [
    {
      bankName: '',
      branchName: '',
      ifscCode: '',
      accountNo: '',
      paymentPrefered: '',
    }
  ];
  dataSourceBankDetails = new MatTableDataSource<PartyMasterBankDetails>(this.elementData2);

  // Allotment Details Tab Data
  displayedColumns: string[] = [
    'srno',
    'brNo',
    'clNo',
    'clDate',
    'clAmt',
    'allotDate',
    'surveryorClaStat',
    'surveryorReportSub',
    'surveryorClaimAmt',
    'surveryorFee',
    'action',
  ];
  elementData: any[] = [];
  //   {
  //     brNo: 'Ahmedabad',
  //     clNo: '35486',
  //     clDate: '14-Apr-2021',
  //     clAmt: '1000.00',
  //     allotDate: '14-Apr-2021',
  //     surveryorClaStat: 'Pending',
  //     surveryorReportSub: 'No',
  //     surveryorClaimAmt: '5000.00',
  //     surveryorFee: '1000.00',
  //   },
  //   {
  //     brNo: 'Ahmedabad',
  //     clNo: '35486',
  //     clDate: '13-Apr-2021',
  //     clAmt: '2000.00',
  //     allotDate: '14-Apr-2021',
  //     surveryorClaStat: 'Approve',
  //     surveryorReportSub: 'No',
  //     surveryorClaimAmt: '5000.00',
  //     surveryorFee: '1000.00',
  //   },
  // ];
  dataSource = new MatTableDataSource<any>(this.elementData);
  constructor(private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.surveyorMasterForm = this.fb.group({
      surveyorName: [''],
      surveyorFirmName: [''],
      partyAddress: [''],
      district: [''],
      taluka: [''],
      city: [''],
      pinCode: [''],
      contactNo: [''],
      email: [''],
      adharNo: [''],
      panCard: [''],
      licNo: ['SLA-000001'],
    });

    this.surveyorRecordsForm = this.fb.group({
      appointmentDetails: [''],
      surveyDetails: [''],
      surveyReports: [''],
    });
  }

  // select taluka on basis of district
  selectDistrict() {
    const district = this.surveyorMasterForm.value.district;
    if (district !== '' && district != null) {
      this.talukaNameList = this.taluka_list.filter(
        searchBy => searchBy.district.toLowerCase() === district.toLowerCase());
    }
    const districtadd = this.surveyorMasterForm.value.districtadd;

  }

  addBankDetails() {
    const data = this.dataSourceBankDetails.data;
    data.push({
      bankName: '',
      branchName: '',
      ifscCode: '',
      accountNo: '',
      paymentPrefered: '',
    });

    this.dataSourceBankDetails.data = data;
  }

  deleteColumn(dataSource, index) {
    dataSource.data.splice(index, 1);
    dataSource.data = dataSource.data;
  }

  onSubmit() { }

  onReset() {
    this.surveyorMasterForm.reset();
  }

  goToListing() {
    this.router.navigate(['./doi/surveyor-master-listing']);
  }

  onClose() { }

}
