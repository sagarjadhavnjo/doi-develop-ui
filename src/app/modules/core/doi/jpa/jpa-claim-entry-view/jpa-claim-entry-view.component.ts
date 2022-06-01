
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { jpaMessage } from 'src/app/common/error-message/common-message.constants';
import { BehaviorSubject } from 'rxjs';
import { ListValue } from 'src/app/models/doi/doiModel';
import { JpaQueryDialogComponent } from '../jpa-query-dialog/jpa-query-dialog.component';
import { JpaRejectionQueryDialogComponent } from '../jpa-rejection-query-dialog/jpa-rejection-query-dialog.component';
import { JpaUtilityService } from './../../service/jpa-utility.service';
declare function SetGujarati();

const  Element_Data: any[] = [];
//   {
//     query: 'પોલીસ ફરીયાદ / FIR',
//     status: 'Resolved', resolvedOn: '14-Apr-2021', querName: '', updateBy: 'Mr. Rakesh Patel', disp: false,
//   },
//   {
//     query: 'પોલીસ ચાર્જશીટની પ્રમાણિત નકલ',
//     status: 'Resolved', resolvedOn: '14-Apr-2021', querName: '', updateBy: 'Mr. Rakesh Patel', disp: false,
//   },
//   {
//     query: 'પોલીસ અકસ્માત મોત રજીસ્ટરની નોંધ.',
//     status: 'Resolved', resolvedOn: '14-Apr-2021', querName: '', updateBy: 'Mr. Rakesh Patel', disp: false,
//   },
//   {
//     query: 'પોલીસ સ્થળપંચનામુ',
//     status: 'Not Resolved', resolvedOn: '-', querName: '', updateBy: 'Mr. Rakesh Patel', disp: false,
//   },
//   {
//     query: 'પોલીસ ઇન્કવેસ્ટ પંચનામુ.',
//     status: 'Resolved', resolvedOn: '14-Apr-2021', querName: '', updateBy: 'Mr. Rakesh Patel', disp: false,
//   },
//   {
//     query: 'પોસ્ટમોર્ટમ રિપોર્ટની વાંચી શકાય તેવી બધા જ પાનાઓની નકલો.',
//     status: 'Resolved', resolvedOn: '14-Apr-2021', querName: '', updateBy: 'Mr. Rakesh Patel', disp: false,
//   },
//   {
//     query: 'વિશેરા રિપોર્ટ બાદનો મૃત્યુના ચોક્કસ કારણ સાથેનો ફાઇનલ પી.એમ.રિપોર્ટ.',
//     status: 'Not Resolved', resolvedOn: '-', querName: '', updateBy: 'Mr. Rakesh Patel', disp: false,
//   },
//   {
//     query: 'પોલીસ તપાસનો સબ ડિવિઝનલ મેજીસ્ટ્રેટને રજૂ થયેલ આખરી અહેવાલ.',
//     status: 'Resolved', resolvedOn: '14-Apr-2021', querName: '', updateBy: 'Mr. Rakesh Patel', disp: false,
//   },
//   {
//     query: 'અક્સ્માત મોત મંજુર કરતો સબ ડિવિઝનલ મેજીસ્ટ્રેટનો હુકમ રજૂ કરવો.',
//     status: 'Not Resolved', resolvedOn: '-', querName: '', updateBy: 'Mr. Rakesh Patel', disp: false,
//   },
//   {
//     query: 'અપંગતા બાબતે સરકારી હોસ્પિટલના સિવિલ સર્જનનું કાયમી સંપૂર્ણ',
//     status: 'Resolved', resolvedOn: '14-Apr-2021', querName: '', updateBy: 'Mr. Rakesh Patel', disp: false,
//   },
//   {
//     query: 'તબીબી સારવારના પેપર્સ.',
//     status: 'Resolved', resolvedOn: '14-Apr-2021', querName: '', updateBy: 'Mr. Rakesh Patel', disp: false,
//   },
//   {
//     query: 'અપંગતા વાળો ફોટો.',
//     status: 'Resolved', resolvedOn: '14-Apr-2021', querName: '', updateBy: 'Mr. Rakesh Patel', disp: false,
//   },
// ]
@Component({
  selector: 'app-jpa-claim-entry-view',
  templateUrl: './jpa-claim-entry-view.component.html',
  styleUrls: ['./jpa-claim-entry-view.component.css']
})
export class JpaClaimEntryViewComponent implements OnInit {
  selectedindex: number;
  // Form Group
  jpaClaimEntry: FormGroup;
  // DAte
  todayDate = Date.now();
  maxDate = new Date();
  // Form Contrl
  talukaCtrl: FormControl = new FormControl();
  bankCtrl: FormControl = new FormControl();
  bankbranchCtrl: FormControl = new FormControl();
  districtCtrl: FormControl = new FormControl();
  adisabledDiedCtrl: FormControl = new FormControl();
  PersonDisabllityCtrl: FormControl = new FormControl();
  maritalStatusCtrl: FormControl = new FormControl();
  villageCtrl: FormControl = new FormControl();
  genderCtrl: FormControl = new FormControl();
  causeofLossCtrl: FormControl = new FormControl();
  driveVEhicleCtrl: FormControl = new FormControl();
  schemeTypeCtrl: FormControl = new FormControl();
  relationPersonCtrl: FormControl = new FormControl();
  farmerCtrl: FormControl = new FormControl();
  surveyorNameCtrl: FormControl = new FormControl();
  aadharAvailCtrl: FormControl = new FormControl();

  // List
  surveyorNameList: ListValue[] = [];
  //   { value: '1', viewValue: 'Mr. Abhishek Gupta' },
  // ];
  schemeType_list: ListValue[] = [];
  //   { value: '1', viewValue: 'Registered Farmer' },
  //   { value: '2', viewValue: 'ITI Students ' },
  //   { value: '3', viewValue: 'Unorganised Landless Labours' },
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
  aadharAvail_list: ListValue[] = [];
  //   {
  //   value: '1', viewValue: 'Yes'
  // },
  // { value: '2', viewValue: 'No' },
  // ];
  talukaNameList: any[];
  talukaNameaddList: any[];
  talukaNamenodalList: any[];
  farmer_list: ListValue[] = [];
  //   { value: '1', viewValue: 'Deceased person himself' },
  //   { value: '2', viewValue: 'Deceased Person Father' },
  //   { value: '3', viewValue: 'Deceased Person Mother' },
  //   { value: '4', viewValue: 'DecDeceased Person Wife' },
  //   { value: '5', viewValue: 'Deceased Person Husband' },
  //   { value: '6', viewValue: 'None of above' }
  // ];
  driveVEhicle_List: ListValue[] = [];
  //   { value: '1', viewValue: 'Yes' },
  //   { value: '2', viewValue: 'No' },
  // ];
  deac_list: ListValue[] = [];
  //   {
  //   value: '1', viewValue: 'Death'
  // },
  // { value: '2', viewValue: 'Disabled' },
  // ];

  genderList: ListValue[] = [];
  //   {
  //   value: '1', viewValue: 'Male'
  // },
  // { value: '2', viewValue: 'Female' },
  // ];

  maritalStatus_list: ListValue[] = [];
  //   {
  //   value: '1', viewValue: 'Married '
  // },
  // { value: '2', viewValue: 'Unmarried ' },
  // { value: '3', viewValue: 'Widow ' },
  // { value: '4', viewValue: ' Widower' },

  // ];

  villageList: ListValue[] = [];
  //   {
  //   value: '1', viewValue: 'Sanand '
  // },
  // { value: '2', viewValue: 'Dholka ' },
  // { value: '3', viewValue: 'Bavala ' },
  // { value: '4', viewValue: 'Detroj' },
  // ];

  causeofLoss_List: ListValue[] = [];
  //   {
  //   value: '1', viewValue: 'Cause of Loss '
  // },
  // { value: '2', viewValue: 'Burn ' },
  // { value: '3', viewValue: 'Drowning ' },
  // { value: '4', viewValue: ' Electric Shock ' },
  // { value: '5', viewValue: 'Fall Down ' },
  // { value: '6', viewValue: 'Head Injury  ' },
  // { value: '7', viewValue: 'Lighting Accident  ' },
  // { value: '8', viewValue: ' Murder' },
  // { value: '9', viewValue: ' Natural Death ' },
  // { value: '10', viewValue: 'Other   ' },
  // { value: '11', viewValue: 'Other Injury' },
  // { value: '12', viewValue: 'Poisoning  ' },
  // { value: '12', viewValue: 'Poisoning Bites  ' },
  // { value: '14', viewValue: 'Snake Bite ' },
  // { value: '15', viewValue: 'Suicide' },
  // { value: '16', viewValue: 'Train Accident ' },
  // { value: '17', viewValue: 'Vehicle Accident' },

  // ];
  relationPerson_List: ListValue[] = [];
  //   {
  //   value: '1', viewValue: 'SeIf(પોતે) '
  // },
  // { value: '2', viewValue: 'Husband(પતિ) ' },
  // { value: '3', viewValue: 'Wife(પત્નિ) ' },
  // { value: '4', viewValue: ' Father(પિતા )  ' },
  // { value: '5', viewValue: 'Mother(માતા) ' },
  // { value: '6', viewValue: 'Son(પુત્ર )  ' },
  // { value: '7', viewValue: 'Daughter(પુત્રિ)   ' },
  // { value: '8', viewValue: ' Grandson(પૌત્ર)' },
  // { value: '9', viewValue: ' Granddaughter (પૌત્રિ) ' },
  // { value: '10', viewValue: 'Sister (Depends on benifishory or window or unmerrid)(બહેન)  ' },
  // { value: '11', viewValue: 'Other (other as per declared by law)(અનય કાય્દા ધ્વારા જાહેર કરેલ)  ' },



  // ];
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
  PersonDisabllity_list: ListValue[] = [];
  //   {
  //   value: '1', viewValue: '50% Disability'
  // },
  // { value: '2', viewValue: '100% Disability' },
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
  recomnded_list: ListValue[] = [];
  //   { value: '1', viewValue: 'Recommonded to Query ' },
  //   { value: '2', viewValue: 'Recommonded for Reopen' },
  //   { value: '3', viewValue: 'Send For Payment' },
  //   { value: '4', viewValue: 'Recommonded for Rejection' },
  //   { value: '5', viewValue: 'Recommonded for Settlement' },
  //   { value: '6', viewValue: 'Recommonded For Investigation' },
  //   { value: '7', viewValue: 'Legal' },

  // ];
  querName_List: ListValue[] = [];
  //   { value: '1', viewValue: 'પોલીસ ફરીયાદ / FIR' },
  //   { value: '2', viewValue: 'પોલીસ ચાર્જશીટની પ્રમાણિત નકલ' },
  //   { value: '3', viewValue: 'પોલીસ અકસ્માત મોત રજીસ્ટરની નોંધ.' },
  //   { value: '4', viewValue: 'પોલીસ સ્થળપંચનામુ' },
  //   { value: '5', viewValue: 'પોલીસ ઇન્કવેસ્ટ પંચનામુ.' },
  //   { value: '6', viewValue: 'પોસ્ટમોર્ટમ રિપોર્ટની વાંચી શકાય તેવી બધા જ પાનાઓની નકલો.' },
  //   { value: '7', viewValue: 'વિશેરા રિપોર્ટ બાદનો મૃત્યુના ચોક્કસ કારણ સાથેનો ફાઇનલ પી.એમ.રિપોર્ટ.' },
  //   { value: '8', viewValue: 'પોલીસ તપાસનો સબ ડિવિઝનલ મેજીસ્ટ્રેટને રજૂ થયેલ આખરી અહેવાલ.' },
  //   { value: '9', viewValue: 'તબીબી સારવારના પેપર્સ.' },
  //   { value: '10', viewValue: 'અપંગતા બાબતે સરકારી હોસ્પિટલના સિવિલ સર્જનનું કાયમી સંપૂર્ણ' },

  // ];
  attachmentTypeCode: any[] = [];
  //   { value: '01', viewValue: 'Supporting Document' },
  //   { value: '02', viewValue: 'Sanction Order' },
  //   { value: '03', viewValue: 'Others' },
  //   { type: 'view' }
  // ];
  attachmentObj: any[] = [];
  //   {
  //     type: 'stamp-view',
  //     attachmentType: 'Surprise Verification Report',
  //   },
  // ];

  errorMessage;
  isTokentable: boolean = false;
  liceno: boolean = false;
  iscauseToken: boolean = false;
  schemeNo: boolean = false;



  recomndedCtrl: FormControl = new FormControl();
  dataSource = new MatTableDataSource<any>(Element_Data);
  displayedColumns: any[] = [
    'srno',
    'query',
    'status',
    'resolvedOn',
    'updateBy',
  ];


  constructor(private router: Router, public dialog: MatDialog,
    private fb: FormBuilder,private jpaUtilityService: JpaUtilityService) { }

  ngOnInit() {
    this.errorMessage = jpaMessage;

    this.jpaClaimEntry = this.fb.group({
      clID: [{ value: '53624', disabled: true }],
      clDate: [{ value: new Date(), disabled: true }],
      disabledDied: [''],
      aadharAvail: [''],
      PersonDisabllity: [''],
      nameOfApplicant: [''],
      adharNo: [''],
      fatherName: [''],
      motherName: [''],
      maritalStatus: [''],
      commAdd: [''],
      district: [''],
      taluka: [''],
      pincode: [''],
      village: [''],
      gender: [''],
      dateOfBirth: [''],
      dateOfAccident: [''],
      dateOfisability: [''],
      ageOnDeath: [''],
      placeofAccident: [''],
      causeofLoss: [''],
      driveVEhicle: [''],
      licenseNo: [''],
      fullName: [''],
      farmer: [''],
      applicantNo: [''],
      applicantADD: [''],
      permAdd: [''],
      relationPerson: [''],
      pincodeadd: [''],
      districtadd: [''],
      talukaadd: [''],
      villageadd: [''],
      banName: [''],
      bankBranch: [''],
      bankAccount: [''],
      nameOfApp: [''],
      bankIFSC: [''],
      mobileNo: [''],
      mobileNoAlt: [''],
      email: [''],
      inwardDate: [''],
      inwardNo: [''],
      dateOfDisability: [''],
      claimAmount: [''],
      nodalDistrict: [''],
      nodalTaluka: [''],
      nodalOffice: [''],
      nodalEmail: [''],
      ploicyNo: [''],
      schemeType: [''],
      recomnded: [''],
      surveyorName: [''],
      intPerc: [''],
      amont: [''],
      appFrom: [''],
      remarks: [''],
    });
    this.setFormData();
  }

  // on submit form control
  oncauseofLoss(index) {
    if (index.value === '16') {
      this.iscauseToken = true;
    } else {
      this.iscauseToken = false;
    }
  }

  onSelect(index) {
    if (index.value === '2') {
      this.isTokentable = true;
    } else {
      this.isTokentable = false;
    }
  }
  onLicon(index) {
    if (index.value === '1') {
      this.liceno = true;
    } else {
      this.liceno = false;
    }
  }
  onSelectScheme(index) {
    if (index.value === '1' || index.value === '5') {
      this.schemeNo = true;
    } else {
      this.schemeNo = false;
    }

  }
  // Add record
  addRow() {
    const p_data = this.dataSource.data;
    p_data.push({
      disp: true
    });
    this.dataSource.data = p_data;
  }
  // onSelectrecomanded(index) {
  //   if (index.value === '1') {
  //     const dialogRef = this.dialog.open(JpaQueryDialogComponent, {
  //       width: '1000px',
  //       height: '500px'

  //     });
  //   } else {
  //     this.liceno = false;
  //   }
  //   if (index.value === '4') {
  //     const dialogRef = this.dialog.open(JpaRejectionQueryDialogComponent, {
  //       width: '1000px',
  //       height: '500px'

  //     });
  //   }

  // }

  onSelectBank(index) {
    this.jpaClaimEntry.patchValue({
      bankIFSC: ['ICIC89456'],
    });
  }
  onClick(event) {
    this.jpaClaimEntry.patchValue({
      fullName: ['J K Mehta'],
      farmer: '1',
      applicantNo: ['5263'],
      applicantADD: ['Gandhinagar'],
      relationPerson: '1',
      pincodeadd: ['524421'],
      districtadd: '01',
      talukaadd: '01',
      villageadd: '1',
      banName: '1',
      bankBranch: '1',
      bankAccount: ['454541531531435'],
      nameOfApp: ['M B Patel'],
      bankIFSC: ['ICIC89456'],
      mobileNo: ['4854654165'],
    });
  }
  ageOnYear(event) {
    this.jpaClaimEntry.patchValue({
      ageOnDeath: '52',
    });
  }
  onClickNodal(event) {
    this.jpaClaimEntry.patchValue({
      inwardDate: new Date('10-Jul-2019'),
      inwardNo: ['20541'],

      claimAmount: ['100000'],
      nodalOffice: ['Ahmedabad'],
      ploicyNo: ['4854531531'],
      nodalDistrict: '00',
      nodalTaluka: '01',
      schemeType: '2',
      recomnded: '2'
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

    if (districtadd !== '' && districtadd != null) {
      this.talukaNameaddList = this.taluka_list.filter(
        searchBy => searchBy.districtadd.toLowerCase() === districtadd.toLowerCase());
    }
    const nodalDistrict = this.jpaClaimEntry.value.nodalDistrict;

    if (nodalDistrict !== '' && nodalDistrict != null) {
      this.talukaNamenodalList = this.taluka_list.filter(
        searchBy => searchBy.nodalDistrict.toLowerCase() === nodalDistrict.toLowerCase());
    }
  }
  // Navigation Route
  navigate() {
    this.router.navigate(['./dashboard/doi/jpa/jpa-pending-approval-listing']);
  }
  onFileSelection(event) { }
  gotoListing() { }
  goToDashboard() { }

  onSubmit() {
    if (this.jpaClaimEntry.controls.recomnded.value !== '') {
      if (this.jpaClaimEntry.controls.recomnded.value === '1') {
        const dialogRef = this.dialog.open(JpaQueryDialogComponent, {
          width: '1000px',
          height: '500px',
          disableClose: true

        });
      } else {
        this.liceno = false;
      }

      if (this.jpaClaimEntry.controls.recomnded.value === '4') {
        const dialogRef = this.dialog.open(JpaRejectionQueryDialogComponent, {
          width: '1000px',
          height: '500px',
          disableClose: true

        });
      }
    }
  }

  onEdit() {
    this.jpaUtilityService.isEdit = true;
    this.router.navigate(['./dashboard/doi/jpa/jpa-claim-entry-edit']);
  }

  print() {
    window.print();
  }
  private setFormData() {
      let payload: any = this.jpaUtilityService.getSelectedJpaApprovedData();
      this.jpaClaimEntry.patchValue({
        "disabledDied": payload.personTypeId ? payload.personTypeId.toString() : 0 ,
         "PersonDisabllity": payload.disableTypeId ? payload.disableTypeId.toString() : 0,
         "aadharAvail": payload.isAdharAvaliable,
         "nameOfApplicant":payload.personName,
         "adharNo": payload.aadharNum,
         "fatherName": payload.fatherHusbName,
         "motherName": payload.motherWifeName,
         "maritalStatus": payload.maritalTypeId ?  payload.maritalTypeId.toString(): 0,
         "district":  payload.districtId ? payload.districtId.toString() : 0,
         "taluka": payload.talukaId ? payload.talukaId.toString(): 0,
         "village":payload.villageId ? payload.villageId.toString() : 0,
         "gender": payload.genderId ? payload.genderId.toString() : 0,
         "dateOfBirth": new Date(payload.dobDt.split(' ')[0]),
         "dateOfAccident": new Date(payload.accidentDt.split(' ')[0]),
         "dateOfDisability": new Date(payload.deathDisableDt.split(' ')[0]),
         "ageOnDeath": payload.ageOnDeath,
         "placeofAccident": payload.accidentPlace,
         "causeofLoss": payload.lossCauseId ? payload.lossCauseId.toString() : 0,
      
         "fullName":payload.applicantName ,
         "applicantNo":payload.applAadharNum ,
         "applicantADD": payload.communicateAddr ,
         "permAdd": payload.applicantAddr ,
         "relationPerson": payload.applRelationId ? payload.applRelationId.toString() : 0 ,
         "districtadd": payload.appDistrictId ? payload.appDistrictId.toString() : 0 ,
         "talukaadd": payload.appTalukaId ? payload.appTalukaId.toString() : 0 ,
         "villageadd": payload.appVillageId ? payload.appVillageId.toString() : 0 ,
         "pincodeadd": payload.appPincode ,
         "banName": payload.appBankId ? payload.appBankId.toString() : 0 ,
         "bankBranch": payload.appBranchId ? payload.appBranchId.toString() : 0 ,
         "nameOfApp": payload.appBankName,
         "bankAccount": payload.appBankAccountNo ,
         "bankIFSC": payload.bankIfscCode ,
         "mobileNo": payload.appMobileNo,
         "mobileNoAlt": payload.appMobileNoAlt ,
         "email": payload.appEmail ,
      
         "nodalDistrict":payload.nodalDistrictId ? payload.nodalDistrictId.toString() : 0,
         "nodalTaluka": payload.nodalTalukaId ? payload.nodalTalukaId.toString() : 0,
         "schemeType":payload.schemeId,
         "nodalOffice":payload.nodalOfficer,
         "nodalEmail":  payload.nodalEmailAddress,
         "ploicyNo":payload.policyNum,
         "claimAmount":payload.claimAmount ,
         "inwardNo":payload.inwardNumber ,
         "inwardDate":payload.inwrdDate,
        })
  }
}
