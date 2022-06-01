import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { doiMessage } from 'src/app/common/error-message/common-message.constants';
import { ListValue } from 'src/app/models/common-grant';
import { APIConst } from 'src/app/shared/constants/doi/doi-api.constants';
import { DoiService } from '../../service/doi.service';


@Component({
  selector: 'app-hba-policy-entry',
  templateUrl: './hba-policy-entry.component.html',
  styleUrls: ['./hba-policy-entry.component.css']
})
export class HbaPolicyEntryComponent implements OnInit {
  referenceNoToken = false;
  isTokentable = false;
  isTokentableone = false;
  isTokentabletwo = false
  isTokentablePol = false;
  isTokentableOPEN = false;
  todayDate = new Date();
  errorMessage = doiMessage;
  hbaPolicyEntryForm: FormGroup;

  policyTypeCtrl: FormControl = new FormControl();
  buildingTypeUseCtrl: FormControl = new FormControl();
  wallCtrl: FormControl = new FormControl();
  ceilingCtrl: FormControl = new FormControl();
  paymentModeCtrl: FormControl = new FormControl();
  bankNameCtrl: FormControl = new FormControl();
  branchNameCtrl: FormControl = new FormControl();
  policyNoCtrl: FormControl = new FormControl();
  propNoCtrl: FormControl = new FormControl();
  districtCtrl: FormControl = new FormControl();
  talukaCtrl: FormControl = new FormControl();
  villageCtrl: FormControl = new FormControl();
  terrorismCtrl: FormControl = new FormControl();
  eQuakeCtrl: FormControl = new FormControl();
  bankCtrl: FormControl = new FormControl();
  bankbranchCtrl: FormControl = new FormControl();
  paymentModetrl: FormControl = new FormControl();

  policyTypeList: ListValue[] = [];
  //   { value: '1', viewValue: 'New' },
  //   { value: '2', viewValue: 'Renewal' },
  //   { value: '3', viewValue: 'Endorsement' },
  // ];

  buildingTypeUseList: ListValue[] = [];
  //   { value: '1', viewValue: 'Yes' },
  //   { value: '2', viewValue: 'No' },
  // ];

  wallList: ListValue[] = [];
  //   { value: '1', viewValue: 'Yes' },
  //   { value: '2', viewValue: 'No' },
  // ];

  ceilingList: ListValue[] = [];
  //   { value: '1', viewValue: 'Yes' },
  //   { value: '2', viewValue: 'No' },
  // ];

  paymentModeList: ListValue[] = [];
  //   { value: '1', viewValue: 'Cheque' },
  //   { value: '2', viewValue: 'Cash' },
  // ];
  terrorism_list: ListValue[] = [];
  //   { value: '1', viewValue: 'Yes ' },
  //   { value: '2', viewValue: 'No' },
  // ];
  eQuake_list: ListValue[] = [];
  //   { value: '1', viewValue: 'Yes ' },
  //   { value: '2', viewValue: 'No' },
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

  branchNameList: ListValue[] = [];
  //   { value: '1', viewValue: 'Ahmedabad' },
  //   { value: '2', viewValue: 'Dahod' },
  //   { value: '3', viewValue: 'Gandhinagar' },
  // ];
  paymentMode_list: ListValue[] = [];
  //   { value: '1', viewValue: 'Cheque' },
  //   { value: '2', viewValue: 'Demand Draft' },
  //   { value: '3', viewValue: 'Treasury' },
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

  policyNoList: ListValue[] = []
  //   { value: '1', viewValue: 'OC-19-2201-4090-00000004' },
  //   { value: '2', viewValue: 'OC-19-2201-4090-00000078' },
  // ];
  villageList: ListValue[] = [];
  //   {
  //   value: '1', viewValue: 'Sanand '
  // },
  // { value: '2', viewValue: 'Dholka ' },
  // { value: '3', viewValue: 'Bavala ' },
  // { value: '4', viewValue: 'Detroj' },
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

  constructor(private fb: FormBuilder, private workflowService: DoiService) { }

  ngOnInit() {
    this.hbaPolicyEntryForm = this.fb.group({
      policyType: [{ value: '', disabled: true }],
      referenceNo: [{ value: '', disabled: true }],
      policyNo: [''],
      polNo: [''],
      policyDate: [''],
      endorsementNo: [''],
      propNo: [{ value: '', disabled: true }],
      propDate: [{ value: '', disabled: true }],
      insuredName: [''],
      aadharCardNo: [''],
      insuredHouseAddress: [''],
      buildingTypeUse: [''],
      wall: [''],
      ceiling: [''],
      endOfPolicyDate: [''],

      terrorism: [{ value: '1', disabled: true }],
      sumInsuredTerror: [{ value: '', disabled: true }],
      termTerror: [{ value: '', disabled: true }],
      rateTerror: [{ value: '', disabled: true }],
      insuranceTerror: [{ value: '', disabled: true }],

      eQuake: [{ value: '1', disabled: true }],
      sumInsuredeQuake: [{ value: '', disabled: true }],
      termeQuake: [{ value: '', disabled: true }],
      rateeQuake: [{ value: '', disabled: true }],
      insuranceeQuake: [{ value: '', disabled: true }],

      other: [{ value: '', disabled: true }],
      sumInsuredOther: [{ value: '', disabled: true }],
      termeOther: [{ value: '', disabled: true }],
      rateOther: [{ value: '', disabled: true }],
      insuranceOther: [{ value: '', disabled: true }],

      employeNo: [{ value: '', disabled: true }],
      employeeName: [{ value: '', disabled: true }],
      employeeDesignation: [{ value: '', disabled: true }],
      employeeDept: [{ value: '', disabled: true }],
      empAdd: [{ value: '', disabled: true }],
      empDepAdd: [{ value: '', disabled: true }],
      homeInsured: [{ value: '', disabled: true }],
      surInsured: [{ value: '', disabled: true }],
      district: [{ value: '', disabled: true }],
      taluka: [{ value: '', disabled: true }],
      village: [{ value: '', disabled: true }],
      pincode: [{ value: '', disabled: true }],
      adharNo: [{ value: '', disabled: true }],
      mobileNo: [{ value: '', disabled: true }],
      emailId: [{ value: '', disabled: true }],

      sumInsured: [{ value: '', disabled: true }],
      term: [{ value: '', disabled: true }],
      rate: [{ value: '', disabled: true }],
      insurance: [{ value: '', disabled: true }],
      receiptNo: [{ value: '', disabled: true }],
      receiptDate: [{ value: '', disabled: true }],
      challanNo: [{ value: '', disabled: true }],
      challanDate: [{ value: '', disabled: true }],
      challaAmount: [{ value: '', disabled: true }],
      discpPerc: [{ value: '', disabled: true }],
      discAmt: [{ value: '', disabled: true }],
      loadAmt: [{ value: '', disabled: true }],
      totAddPre: [{ value: '', disabled: true }],
      totPre: [{ value: '', disabled: true }],
      gstPerc: [{ value: '', disabled: true }],
      gstAmt: [{ value: '', disabled: true }],
      payPre: [{ value: '', disabled: true }],
      paymentMode: [{ value: '', disabled: true }],
      dateCheque: [{ value: '', disabled: true }],
      ddZNo: [{ value: '', disabled: true }],
      banName: [{ value: '', disabled: true }],
      bankBranch: [{ value: '', disabled: true }],
    });
    this.hbaPolicyEntryForm.disable();
    this.hbaPolicyEntryForm.controls['policyType'].enable();
    this.hbaPolicyEntryForm.controls['referenceNo'].enable();

    this.getBuildingTypeUseList();
    this.getCeilingList();
    this.getPaymentModeList();
    this.getTerrorismList();
    this.geteQuakList();
    this.getpolicyTypeList();
    this.getwallList();
  }

  onPaymentMode(index) {
    if (index === '3') {
      this.isTokentablePol = true;
    } else {
      this.isTokentablePol = false;
    }
    if (index === '2' || index === '1') {
      this.isTokentableOPEN = true;
    } else {
      this.isTokentableOPEN = false;
    }
  }

  onSelectingPolicyType(event) {
    if (event) {
      this.hbaPolicyEntryForm.reset();
      this.hbaPolicyEntryForm.patchValue({
        policyType: event.value,
      });
    }
  }

  onReferenceNo(event) {
    // if (event) {
    //   if (this.hbaPolicyEntryForm.controls['policyType'].value === '3') {
    //     let value = event.target.value;
    //     this.hbaPolicyEntryForm.reset();
    //     this.hbaPolicyEntryForm.enable();
    //     this.hbaPolicyEntryForm.patchValue({
    //       policyType: '3',
    //       endOfPolicyDate: [{ value: new Date(), disabled: true }],
    //       referenceNo: value
    //     });
    //   } else if (this.hbaPolicyEntryForm.controls['policyType'].value !== '3') {
    //     this.hbaPolicyEntryForm.patchValue({
    //       policyNo: '1',
    //       policyDate: new Date('01/03/2019'),
    //       riskCovered: 'Fire',
    //       sumInsured: '500000',
    //       insuredName: 'Gujarat State Electricity Corporation',
    //       aadharCardNo: '12345678910',
    //       mobileNo: '123456789101',
    //       insuredHouseAddress: 'Ukai',
    //       buildingTypeUse: '1',
    //       wall: '1',
    //       ceiling: '1',
    //       endOfPolicyDate: new Date(),
    //       employeeNo: '8956457676',
    //       employeeName: 'Mr. Abhishek Gupta',
    //       designation: '',
    //       officeName: 'Gujarat State Electricity Corporation',
    //       officeAddress: 'Gandhingar',
    //       challanNo: '457',
    //       challanDate: new Date('02/01/2020'),
    //       sumInsuredPremium: '7677',
    //       loanAmount: '7766868',
    //       loanAccountNo: '56466767868',
    //       termOfInsurance: '5',
    //       insurancePremium: '98889880',
    //       paymentMode: '1',
    //       ddChequeDate: new Date('03/01/2020'),
    //       bankName: '1',
    //       branchName: '1',
    //     });
    //   }
    // }

  }
  patchFields() {
    this.hbaPolicyEntryForm.patchValue({
      referenceNo: '5634',
      policyNo: '1',
      polNo: '1',
      policyDate: new Date('03/01/2020'),
      endorsementNo: '',
      propNo: '1',
      propDate: new Date('03/01/2020'),
      insuredName: 'Gujarat State Electricity Corporation',
      aadharCardNo: '12345678910',
      insuredHouseAddress: 'Ukai',
      buildingTypeUse: '1',
      wall: '1',
      ceiling: '1',
      endOfPolicyDate: new Date(),
      terrorism: '1',
      sumInsuredTerror: '15.00',
      termTerror: '2',
      rateTerror: '10',
      insuranceTerror: '',

      eQuake: '1',
      sumInsuredeQuake: '15.00',
      termeQuake: '2',
      rateeQuake: '10',
      insuranceeQuake: '',

      other: '',
      sumInsuredOther: '',
      termeOther: '',
      rateOther: '',
      insuranceOther: '',

      employeNo: '25645',
      employeeName: 'Mr. Rakesh Patel',
      employeeDesignation: 'Officer',
      employeeDept: 'Department',
      empAdd: 'Gujarat State Electricity Corporation',
      empDepAdd: 'Gujarat State Electricity Corporation',
      homeInsured: '120',
      surInsured: '2564',
      district: '01',
      taluka: '00',
      village: '1',
      pincode: '356565',
      adharNo: '256545652565',
      mobileNo: '6658978544',
      emailId: 'rpat@gmail.com',

      sumInsured: '15.00',
      term: '2',
      rate: '10',
      insurance: '',
      receiptNo: '5623',
      receiptDate: new Date('03/01/2020'),
      challanNo: '457',
      challanDate: new Date('03/01/2020'),
      challaAmount: '',
      discpPerc: '2',
      discAmt: '',
      loadAmt: '152.00',
      totAddPre: '',
      totPre: '',
      gstPerc: '2',
      gstAmt: '',
      payPre: '',
      paymentMode: '1',
      dateCheque: new Date('03/01/2020'),
      ddZNo: '23564',
      banName: '1',
      bankBranch: '1',
    });

    this.setFieldVal();
    this.onPaymentMode(this.hbaPolicyEntryForm.controls.paymentMode.value);

  }

  onSubmit() {

  }
  onReset() { }
  onClose() { }
  ontoken(index) {
    if (index.value === '3') {
      this.isTokentable = true;
      this.referenceNoToken = false;
    } else {
      this.isTokentable = false;

    }
    if (index.value === '2') {
      this.isTokentableone = true;
      this.referenceNoToken = false;
    } else {
      this.isTokentableone = false;
    }
    if (index.value === '1') {
      this.isTokentabletwo = true;

    } else {
      this.isTokentabletwo = false;
    }

  }
  // On selection
  onPolicytoken(index) {
    if (index.value === '3') {
      this.isTokentablePol = true;
      this.hbaPolicyEntryForm.patchValue({
        challanNo: '1856',
        challanDate: new Date('07/18/2020'),
        challaAmount: '10000.00'
      });
    } else {
      this.isTokentablePol = false;
    }
    if (index.value === '2' || index.value === '1') {
      this.isTokentableOPEN = true;
      this.hbaPolicyEntryForm.patchValue({
        receiptNo: '11246254',
        receiptDate: new Date('07/17/2020'),
      });

    } else {
      this.isTokentableOPEN = false;
    }
  }

  decimalFixedTwo(event) {
    if (event.target.value) {
      event.target.value = parseFloat(event.target.value).toFixed(2);
      console.log(event.target.value);

    } else {
      event.target.value = parseFloat('0').toFixed(2);
    }
  }

  setFieldVal() {

    // Set Insurance Premium TERRORISM
    this.hbaPolicyEntryForm.controls.insuranceTerror.setValue(((this.hbaPolicyEntryForm.controls.sumInsuredTerror.value) *
      (this.hbaPolicyEntryForm.controls.termTerror.value) * (this.hbaPolicyEntryForm.controls.rateTerror.value) / 1000).toFixed(2));

    // Set Insurance Premium Earthquake
    this.hbaPolicyEntryForm.controls.insuranceeQuake.setValue(((this.hbaPolicyEntryForm.controls.sumInsuredeQuake.value) *
      (this.hbaPolicyEntryForm.controls.termeQuake.value) * (this.hbaPolicyEntryForm.controls.rateeQuake.value) / 1000).toFixed(2));

    // Set Insurance Premium Other
    this.hbaPolicyEntryForm.controls.insuranceOther.setValue(((this.hbaPolicyEntryForm.controls.sumInsuredOther.value) *
      (this.hbaPolicyEntryForm.controls.termeOther.value) * (this.hbaPolicyEntryForm.controls.rateOther.value) / 1000).toFixed(2));

    // Set Insurance Premium
    this.hbaPolicyEntryForm.controls.insurance.setValue(((this.hbaPolicyEntryForm.controls.sumInsured.value) *
      (this.hbaPolicyEntryForm.controls.term.value) * (this.hbaPolicyEntryForm.controls.rate.value) / 1000).toFixed(2));

    // Set Discount Amount
    this.hbaPolicyEntryForm.controls.discAmt.setValue((Number(this.hbaPolicyEntryForm.controls.insurance.value *
      this.hbaPolicyEntryForm.controls.discpPerc.value) / 100).toFixed(2));

    // Set Total Add-on Premium
    this.hbaPolicyEntryForm.controls.totAddPre.setValue((Number(this.hbaPolicyEntryForm.controls.insuranceTerror.value) +
      Number(this.hbaPolicyEntryForm.controls.insuranceeQuake.value) +
      Number(this.hbaPolicyEntryForm.controls.insuranceOther.value)).toFixed(2));

    // Set Total Premium
    this.hbaPolicyEntryForm.controls.totPre.setValue((Number(this.hbaPolicyEntryForm.controls.insurance.value) -
      Number(this.hbaPolicyEntryForm.controls.discAmt.value) + Number(this.hbaPolicyEntryForm.controls.loadAmt.value)
      + Number(this.hbaPolicyEntryForm.controls.totAddPre.value)).toFixed(2));

    // Set GST Amount
    this.hbaPolicyEntryForm.controls.gstAmt.setValue(((Number(this.hbaPolicyEntryForm.controls.gstPerc.value) *
      Number(this.hbaPolicyEntryForm.controls.totPre.value)) / 100).toFixed(2));

    // Set Payable Premium
    this.hbaPolicyEntryForm.controls.payPre.setValue((Number(this.hbaPolicyEntryForm.controls.totPre.value) +
      Number(this.hbaPolicyEntryForm.controls.gstAmt.value)).toFixed(2));

  }

  selectDistrict(){

    
  }

  getBuildingTypeUseList() {
    const params = {
      "name":"HBA_PROP_TYPE_OF_BUILDING_USE"
    };
    this.workflowService.getDataPost(params, APIConst.COMMON_DROPDOWN_WITH_NAME).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          resp.result.forEach(element => {
            let data = new ListValue();
            data.value = element.id;
            data.viewValue = element.name;
            this.buildingTypeUseList.push(data);
          });
        }
      },
      err => {
  
      }
    );
  } 

  getpolicyTypeList() {
    const params = {
      "name":"HBA_POLI_POLICY_TYPE"
    };
    this.workflowService.getDataPost(params, APIConst.COMMON_DROPDOWN_WITH_NAME).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          resp.result.forEach(element => {
            let data = new ListValue();
            data.value = element.id;
            data.viewValue = element.name;
            this.policyTypeList.push(data);
          });
        }
      },
      err => {
  
      }
    );
  } 

  getwallList() {
    const params = {
      "name":"HBA_PROP_WALL"
    };
    this.workflowService.getDataPost(params, APIConst.COMMON_DROPDOWN_WITH_NAME).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          resp.result.forEach(element => {
            let data = new ListValue();
            data.value = element.id;
            data.viewValue = element.name;
            this.wallList.push(data);
          });
        }
      },
      err => {
  
      }
    );
  }

  getCeilingList() {
    const params = {
      "name":"HBA_PROP_CELLING"
    };
    this.workflowService.getDataPost(params, APIConst.COMMON_DROPDOWN_WITH_NAME).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          resp.result.forEach(element => {
            let data = new ListValue();
            data.value = element.id;
            data.viewValue = element.name;
            this.ceilingList.push(data);
          });
        }
      },
      err => {
  
      }
    );
  }

  getTerrorismList() {
    const params = {
      "name":"HBA_PROP_TERRORISM"
    };
    this.workflowService.getDataPost(params, APIConst.COMMON_DROPDOWN_WITH_NAME).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          resp.result.forEach(element => {
            let data = new ListValue();
            data.value = element.id;
            data.viewValue = element.name;
            this.terrorism_list.push(data);
          });
        }
      },
      err => {
  
      }
    );
  }

  geteQuakList() {
    const params = {
      "name":"HBA_PROP_EARTHQUICK"
    };
    this.workflowService.getDataPost(params, APIConst.COMMON_DROPDOWN_WITH_NAME).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          resp.result.forEach(element => {
            let data = new ListValue();
            data.value = element.id;
            data.viewValue = element.name;
            this.eQuake_list.push(data);
          });
        }
      },
      err => {
  
      }
    );
  }

  getPaymentModeList() {
    const params = {
      "name":"HBA_PROP_PAYMENT_MODE"
    };
    this.workflowService.getDataPost(params, APIConst.COMMON_DROPDOWN_WITH_NAME).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          resp.result.forEach(element => {
            let data = new ListValue();
            data.value = element.id;
            data.viewValue = element.name;
            this.paymentMode_list.push(data);
          });
        }
      },
      err => {
  
      }
    );
  }
}


