import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ListValue, BankBranch } from 'src/app/models/doi/doiModel';


@Component({
  selector: 'app-jpa-master-from-bank-branch',
  templateUrl: './jpa-master-from-bank-branch.component.html',
  styleUrls: ['./jpa-master-from-bank-branch.component.css']
})
export class JpaMasterFromBankBranchComponent implements OnInit {
  // DAte
  todayDate = Date.now();
  maxDate = new Date();
  bank_list: ListValue[] = [];
  //   { value: '1', viewValue: 'Bank of Baroda    ' },
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
  bankbranch_list: ListValue[] = [];
  //   { value: '1', viewValue: 'AXIS BOTAD [GJ] ' },
  //   { value: '2', viewValue: 'BOB ARM,AHMEDABAD' },
  //   { value: '3', viewValue: 'BOI MID CORPORATE' },
  //   { value: '4', viewValue: ' FEDERAL BANK VASNA IYAVA' },
  //   { value: '5', viewValue: 'HDFC Bavla' },
  //   { value: '6', viewValue: 'ICICI Ambawadi' },
  //   { value: '7', viewValue: 'IDFC Prahladnagar' },
  //   { value: '8', viewValue: ' KOTAK MAHINDRA PRAHALADNAGAR BRANCH' },
  //   { value: '9', viewValue: ' PNB Ahmedabad Vanijya Bhavan' },
  //   { value: '10', viewValue: 'PNB Ahmedabad Vanijya Bhavan' },
  //   { value: '11', viewValue: 'SBI AKHBARNAGAR CHAR RASTA, AHMEDABAD' },
  // ];
  // Form Group
  jpaClaimEntry: FormGroup;
  // Control
  districtCtrl: FormControl = new FormControl();
  bankCtrl: FormControl = new FormControl();
  bankbranchCtrl: FormControl = new FormControl();
  // Contrl
  talukaCtrl: FormControl = new FormControl();
  // List
  taluka_list: any[] = [];
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
  districtList: ListValue[] = [];
  //   { value: '00', viewValue: 'Ahmedabad' },
  //   { value: '01', viewValue: 'Amreli' },
  //   { value: '02', viewValue: 'Anand' },
  //   { value: '03', viewValue: 'Aravalli' },
  //   { value: '04', viewValue: 'Banaskantha' },
  //   { value: '05', viewValue: 'Bharuch' },
  //   { value: '06', viewValue: 'Bhavnagar' },

  // ];
  talukaNameList: any[];

  // Table Source

  Element_Data: BankBranch[] = [];


  //   {
  //     srno: '1',
  //     bankName: 'AXIS	',
  //     branchName: '	AXIS BOTAD [GJ]',
  //     ifscCode: 'UTIB0001091',
  //     district: 'AHMEDABAD',
  //     taluka: 'Bavla',
  //     action: ''
  //   },
  //   {
  //     srno: '2',
  //     bankName: 'BANK OF BARODA	',
  //     branchName: '	BOB ARM,AHMEDABAD',
  //     ifscCode: 'BARB0ARMAHM',
  //     district: 'AHMEDABAD',
  //     taluka: 'Dholka',
  //     action: ''
  //   },
  //   {
  //     srno: '3',
  //     bankName: 'BANK OF INDIA	',
  //     branchName: '	BOI MID CORPORATE',
  //     ifscCode: 'BKID0002050',
  //     district: 'AHMEDABAD',
  //     taluka: 'Ahmadabad City (East)',
  //     action: ''
  //   },
  //   {
  //     srno: '4',
  //     bankName: 'Federal Bank',
  //     branchName: '	FEDERAL BANK VASNA IYAVA	',
  //     ifscCode: 'FDRL0002181',
  //     district: '	AHMEDABAD	',
  //     taluka: 'Sanand',

  //     action: ''
  //   },
  //   {
  //     srno: '5',
  //     bankName: 'HDFCAHMEDABAD',
  //     branchName: '	HDFC Bavla	',
  //     ifscCode: 'HDFC0000956',
  //     district: '	AHMEDABAD	',
  //     taluka: 'Bavla',

  //     action: ''
  //   },
  //   {
  //     srno: '6',
  //     bankName: 'ICICI',
  //     branchName: '	ICICI Ambawadi	',
  //     ifscCode: 'ICIC0000024',
  //     district: '	Detroj	',
  //     taluka: 'Sanand',

  //     action: ''
  //   },
  //   {
  //     srno: '7',
  //     bankName: 'IDBI		',
  //     branchName: '	IDBI JNP Satellite		',
  //     ifscCode: 'IBKL0000179',
  //     district: '	AHMEDABAD	',
  //     taluka: '	Ahmadabad City (East)',

  //     action: ''
  //   },
  //   {
  //     srno: '8',
  //     bankName: 'IDFC',
  //     branchName: '	IDFC Prahladnagar	',
  //     ifscCode: 'IDFB0040302',
  //     district: '	AHMEDABAD	',
  //     taluka: 'Mandal',

  //     action: ''
  //   },
  //   {
  //     srno: '9',
  //     bankName: 'INDUSIND BANK	',
  //     branchName: '	Ahmedabad-CG ROAD		',
  //     ifscCode: 'INDB0000667',
  //     district: '	AHMEDABAD	',
  //     taluka: 'Daskroi',

  //     action: ''
  //   },
  //   {
  //     srno: '10',
  //     bankName: 'KOTAK MAHINDRA BANK LTD.		',
  //     branchName: '	KOTAK MAHINDRA PRAHALADNAGAR BRANCH	',
  //     ifscCode: 'KKBK0002560',
  //     district: '	AHMEDABAD	',
  //     taluka: 'Sabarmati',

  //     action: ''
  //   },
  //   {
  //     srno: '11',
  //     bankName: 'PUNJAB NATIONAL BANK',
  //     branchName: '	PNB Ahmedabad Vanijya Bhavan		',
  //     ifscCode: 'PUNB0196000',
  //     district: '	AHMEDABAD	',
  //     taluka: 'Sanand',

  //     action: ''
  //   }
  //   ,
  //   {
  //     srno: '12',
  //     bankName: 'STATE BANK OF INDIA',
  //     branchName: '	SBI AKHBARNAGAR CHAR RASTA, AHMEDABAD	',
  //     ifscCode: 'SBIN0060470',
  //     district: '	AHMEDABAD	',
  //     taluka: 'Mandal',

  //     action: ''
  //   },




  // ];

  displayedColumns: any[] = [
    'srno',
    'bankName',
    'district',
    'taluka',
    'branchName',
    'ifscCode',
    'action'

  ];

  dataSource = new MatTableDataSource<any>(this.Element_Data);

  constructor(private router: Router, public dialog: MatDialog, private fb: FormBuilder,) { }

  ngOnInit() {
    this.jpaClaimEntry = this.fb.group({
      banName: [''],
      bankBranch: [''],
      bankIFSC: [''],
      district: [''],
      taluka: ['']
    });
  }
  // select taluka on basis of district
  selectDistrict() {
    const district = this.jpaClaimEntry.value.district;
    if (district !== '' && district != null) {
      this.talukaNameList = this.taluka_list.filter(
        searchBy => searchBy.district.toLowerCase() === district.toLowerCase());
    }
    const districtadd = this.jpaClaimEntry.value.districtadd;

  }
  // Navigation Route
  navigate() {
    this.router.navigate(['./doi/jpa/jpa-claim-entry-view']);
  }
}
