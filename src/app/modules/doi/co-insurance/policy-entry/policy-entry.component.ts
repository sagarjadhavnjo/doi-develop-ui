import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import { MatDialog} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { doiMessage } from 'src/app/common/error-message/common-message.constants';
import { ListValue } from 'src/app/models/common-listing';
import { UploadProvisionComponent } from './upload-provision/upload-provision.component';

@Component({
  selector: 'app-policy-entry',
  templateUrl: './policy-entry.component.html',
  styleUrls: ['./policy-entry.component.css']
})
export class PolicyEntryComponent implements OnInit {
  isTokentable: Boolean = false;
  todayDate = new Date();
  policyEntryForm: FormGroup;
  errorMessage = doiMessage;
  isTokentableOPEN = false;
  riShare = '5'
  policyTypeCtrl: FormControl = new FormControl();
  leaderNameCtrl: FormControl = new FormControl();
  leaderAddressCtrl: FormControl = new FormControl();
  leaderPolicyNoCtrl: FormControl = new FormControl();
  facTreatyCtrl: FormControl = new FormControl();
  districtCtrl: FormControl = new FormControl();
  talukaCtrl: FormControl = new FormControl();
  riRequiredCtrl: FormControl = new FormControl();
  paymentReceivedThroughCtrl: FormControl = new FormControl();
  subtypeCtrl: FormControl = new FormControl();
  remarksDiffCtrl: FormControl = new FormControl();
  paymentModetrl: FormControl = new FormControl();
  treasuryNameCtrl: FormControl = new FormControl();
  bankCtrl: FormControl = new FormControl();
  bankbranchCtrl: FormControl = new FormControl();
  selectedIndex = 0;
  treasuryName_list: ListValue[] = [
    { value: '1', viewValue: 'District Treasury Office, Gandhinagar' }
  ];

  paymentMode_list: ListValue[] = [
    { value: '1', viewValue: 'Cheque' },
    { value: '2', viewValue: 'Demand Draft' },
    { value: '3', viewValue: 'Treasury' },
  ];
  bankbranch_list: ListValue[] = [
    { value: '1', viewValue: 'AXIS BOTAD [GJ] ' },
    { value: '2', viewValue: 'BOB ARM,AHMEDABAD' },
    { value: '3', viewValue: 'BOI MID CORPORATE' },
    { value: '4', viewValue: ' FEDERAL BANK VASNA IYAVA' },
    { value: '5', viewValue: 'HDFC Bavla' },
    { value: '6', viewValue: 'ICICI Ambawadi' },
    { value: '7', viewValue: 'IDFC Prahladnagar' },
    { value: '8', viewValue: ' KOTAK MAHINDRA PRAHALADNAGAR BRANCH' },
    { value: '9', viewValue: ' PNB Ahmedabad Vanijya Bhavan' },
    { value: '10', viewValue: 'PNB Ahmedabad Vanijya Bhavan' },
    { value: '11', viewValue: 'SBI AKHBARNAGAR CHAR RASTA, AHMEDABAD' },
  ];
  bank_list: ListValue[] = [
    { value: '1', viewValue: 'Bank of Baroda    ' },
    { value: '2', viewValue: 'Bank of India' },
    { value: '3', viewValue: 'Canara Bank' },
    { value: '4', viewValue: ' Central Bank of India' },
    { value: '5', viewValue: 'Indian Bank' },
    { value: '6', viewValue: 'Indian Overseas Bank' },
    { value: '7', viewValue: 'Punjab National Bank' },
    { value: '8', viewValue: ' State Bank of India' },
    { value: '9', viewValue: ' Union Bank of India' },
    { value: '10', viewValue: 'Axis Bank' },
    { value: '11', viewValue: 'HDFC Bank' },
    { value: '12', viewValue: 'ICICI Bank' },
    { value: '13', viewValue: 'IDBI Bank' },
    { value: '14', viewValue: 'IDFC First Bank' },
    { value: '15', viewValue: ' IndusInd Bank' },
    { value: '16', viewValue: 'Jammu & Kashmir Bank ' },
    { value: '17', viewValue: 'Karnataka Bank' },
    { value: '18', viewValue: 'Karur Vysya Bank' },
    { value: '19', viewValue: ' South Indian Bank' },
    { value: '20', viewValue: ' Tamilnad Mercantile Bank' },
    { value: '20', viewValue: 'Axis Bank' },
    { value: '21', viewValue: 'Yes Bank' },
  ];

  policyTypeList: ListValue[] = [
    { value: '1', viewValue: 'Fire' },
    { value: '2', viewValue: 'Marine' },
    { value: '3', viewValue: 'Miscellanous' },
    { value: '4', viewValue: 'IAR(Industrial All Risk Policy)' }
  ];
  leaderNameList: ListValue[] = [
    { value: '1', viewValue: 'Bajaj Allianz Co. Pvt. Ltd.' },
    { value: '2', viewValue: 'New ABC Plant' }
  ];
  leaderAddressList: ListValue[] = [
    { value: '1', viewValue: 'Ahmedabad' },
    { value: '2', viewValue: 'Gandhinagar' },
  ];
  leaderPolicyNoList: ListValue[] = [
    { value: '1', viewValue: 'OC-19-2201-4090-00000001' },
    { value: '2', viewValue: 'OC-19-2201-4090-00000034' },
  ];
  facTreatyList: ListValue[] = [
    { value: '1', viewValue: 'Yes' },
    { value: '2', viewValue: 'No' },
  ];
  districtList: ListValue[] = [
    { value: '00', viewValue: 'Ahmedabad' },
    { value: '01', viewValue: 'Amreli' },
    { value: '02', viewValue: 'Anand' },
    { value: '03', viewValue: 'Aravalli' },
    { value: '04', viewValue: 'Banaskantha' },
    { value: '05', viewValue: 'Bharuch' },
    { value: '06', viewValue: 'Bhavnagar' },
  ];
  taluka_list: any[] = [
    { value: '01', district: '00', districtadd: '00', nodalDistrict: '00', viewValue: 'City East' },
    { value: '02', district: '00', districtadd: '00', nodalDistrict: '00', viewValue: 'City West' },
    { value: '03', district: '00', districtadd: '00', nodalDistrict: '00', viewValue: 'Bavla' },
    { value: '04', district: '00', districtadd: '00', nodalDistrict: '00', viewValue: 'Daskroi' },
    { value: '05', district: '00', districtadd: '00', nodalDistrict: '00', viewValue: 'Detroj-Rampura' },
    { value: '06', district: '00', districtadd: '00', nodalDistrict: '00', viewValue: 'Dhandhuka' },
    { value: '07', district: '00', districtadd: '00', nodalDistrict: '00', viewValue: 'Dholera' },
    { value: '08', district: '00', districtadd: '00', nodalDistrict: '00', viewValue: 'Dholka' },
    { value: '09', district: '00', districtadd: '00', nodalDistrict: '00', viewValue: 'Mandal' },
    { value: '10', district: '00', districtadd: '00', nodalDistrict: '00', viewValue: 'Sanand' },
    { value: '11', district: '00', districtadd: '00', nodalDistrict: '00', viewValue: 'Viramgam' },
    { value: '01', district: '01', districtadd: '01', nodalDistrict: '01', viewValue: 'Amreli' },
    { value: '02', district: '01', districtadd: '01', nodalDistrict: '01', viewValue: 'Babra' },
    { value: '03', district: '01', districtadd: '01', nodalDistrict: '01', viewValue: 'Bagasara' },
    { value: '04', district: '01', districtadd: '01', nodalDistrict: '01', viewValue: 'Dhari' },
    { value: '05', district: '01', districtadd: '01', nodalDistrict: '01', viewValue: 'Jafrabad' },
    { value: '06', district: '01', districtadd: '01', nodalDistrict: '01', viewValue: 'Khambha' },
    { value: '07', district: '01', districtadd: '01', nodalDistrict: '01', viewValue: 'Kunkavav vadia' },
    { value: '08', district: '01', districtadd: '01', nodalDistrict: '01', viewValue: 'Lathi' },
    { value: '09', district: '01', districtadd: '01', nodalDistrict: '01', viewValue: 'Lilia' },
    { value: '10', district: '01', districtadd: '01', nodalDistrict: '01', viewValue: 'Rajula' },
    { value: '11', district: '01', districtadd: '01', nodalDistrict: '00', viewValue: 'Savarkundla' },
    { value: '01', district: '02', districtadd: '02', nodalDistrict: '02', viewValue: 'Anand' },
    { value: '02', district: '02', districtadd: '02', nodalDistrict: '02', viewValue: 'Anklav' },
    { value: '03', district: '02', districtadd: '02', nodalDistrict: '02', viewValue: 'Borsad' },
    { value: '04', district: '02', districtadd: '02', nodalDistrict: '02', viewValue: 'Khambhat' },
    { value: '05', district: '02', districtadd: '02', nodalDistrict: '02', viewValue: 'Petlad' },
    { value: '06', district: '02', districtadd: '02', nodalDistrict: '02', viewValue: 'Sojitra' },
    { value: '07', district: '02', districtadd: '02', nodalDistrict: '02', viewValue: 'Tarapur' },
    { value: '08', district: '02', districtadd: '02', nodalDistrict: '02', viewValue: 'Umreth' },
    { value: '01', district: '03', districtadd: '03', nodalDistrict: '03', viewValue: 'Bayad' },
    { value: '02', district: '03', districtadd: '03', nodalDistrict: '03', viewValue: 'Bhiloda' },
    { value: '03', district: '03', districtadd: '03', nodalDistrict: '03', viewValue: 'Dhansura' },
    { value: '04', district: '03', districtadd: '03', nodalDistrict: '03', viewValue: 'Malpur' },
    { value: '05', district: '03', districtadd: '03', nodalDistrict: '03', viewValue: 'Meghraj' },
    { value: '06', district: '03', districtadd: '03', nodalDistrict: '03', viewValue: 'Modasa' },
    { value: '01', district: '04', districtadd: '04', nodalDistrict: '04', viewValue: 'Amirgadh' },
    { value: '02', district: '04', districtadd: '04', nodalDistrict: '04', viewValue: 'Bhabhar' },
    { value: '03', district: '04', districtadd: '04', nodalDistrict: '04', viewValue: 'Danta' },
    { value: '04', district: '04', districtadd: '04', nodalDistrict: '04', viewValue: 'Dantiwada' },
    { value: '05', district: '04', districtadd: '04', nodalDistrict: '04', viewValue: 'Deesa' },
    { value: '06', district: '04', districtadd: '04', nodalDistrict: '04', viewValue: 'Deodar' },
    { value: '07', district: '05', districtadd: '05', nodalDistrict: '05', viewValue: 'Dhanera' },
    { value: '08', district: '04', districtadd: '04', nodalDistrict: '04', viewValue: 'Kankrej' },
    { value: '09', district: '06', districtadd: '06', nodalDistrict: '06', viewValue: 'Lakhani' },
    { value: '10', district: '04', districtadd: '04', nodalDistrict: '04', viewValue: 'Palanpur' },


  ];
  talukaNameList: any[];
  riRequiredList: ListValue[] = [
    { value: '1', viewValue: 'Yes' },
    { value: '2', viewValue: 'No' },
  ];
  paymentReceivedThroughList: ListValue[] = [
    { value: '1', viewValue: 'Cash' },
    { value: '2', viewValue: 'Cheque' },
  ];

  paymentModeList: ListValue[] = [
    { value: '1', viewValue: 'Cheque' },
    { value: '2', viewValue: 'Adjustment' },
  ];

  remarksDiffList: ListValue[] = [
    { value: '1', viewValue: 'Agency Commission' },
    { value: '2', viewValue: 'Excess Payment' },
    { value: '3', viewValue: 'Outstanding Payment' },
    { value: '4', viewValue: 'Claim Adjusted' },
    { value: '5', viewValue: 'Others' },
  ];

  attachmentTypeCode: ListValue[] = [
    { value: '01', viewValue: 'Supporting Document' },
    { value: '02', viewValue: 'Sanction Order' },
    { value: '03', viewValue: 'Others' },
  ];

  displayedColumns1: string[] = [
    'riName',
    'riAddress',
    'riShare',
    'premiumAmount',
    // 'resPayment',
    'paymentMode',
    'cheUtr',
    'paymentReceivedOn',
    // 'paymentReceivedThrough',
    // 'challanNo',
    // 'challanDate',
    // 'action',
  ];
  displayedColumns: string[] = [
    'riskType',
    'riskDetals',
    // 'basicSumInsured',
    'regSumInsured',
    'treSumInsured',
    // 'terrorisumPool',
    'regPremium',
    'trePremium',
    'totalSi',
    'premium',
    'remarks',
    // 'action',
  ];
  displayedColumnsList: string[] = [
    'position',
    'riskType',
    'riskDetals',
    'regSumInsured',
    'treSumInsured',
    'regPremium',
    'trePremium',
    'totalSi',
    'premium',
    'remarks',
    'insName',
    'insAdd',
    'district',
    'taluka',
    'city',
    'pincode',
    'fac',
    'gifPerc',
    'gifRegSI',
    'gifTerrorSI',
    'gifRegPrem',
    'gifTerrorPrem',
    'gicPerc',
    'gicRegSI',
    'gicTerrorSI',
    'gicRegPrem',
    'gicTerrorPrem',
    'riCompName',
    'riAdd',
    'riPerc',
    'riPremAcc',
    'payMode',
    'cheNo',
    'payDate',
  ];
  elementData: any[] = [
    {
      riName: '',
      riAddress: '',
      riShare: '',
      paymentMode: '',
      cheUtr: '',
      paymentReceivedOn: '',
      paymentReceivedThrough: '',
      challanNo: '',
      challanDate: '',
    }
  ];
  elementDataRisk: any[] = [
    {
      riskType: '',
      riskDetals: '',
      remarks: '',
      basicSumInsured: '',
      regSumInsured: '',
      treSumInsured: '',
      terrorisumPool: '',
      regPremium: '',
      trePremium: '',
      totalSi: '',
      premium: '',
    }
  ];
  elementDataList: any[] = [
    {
      position: '1', riskType: 'Fire', riskDetals: 'Anand', regSumInsured: '1000.00', treSumInsured: '1000.00',
      regPremium: '1000.00', trePremium: '1000.00', totalSi: '2000.00', premium: '2000.00', remarks: '',
      insName: 'Pratik', insAdd: 'Anand', district: 'Anand', taluka: 'Anand', city: 'Anand', pincode: '356565', fac: 'FAC',
      gifPerc: '25', gifRegSI: '250.00', gifTerrorSI: '25.00', gifRegPrem: '287.50', gifTerrorPrem: '2.50',
      gicPerc: '5', gicRegSI: '12.50', gicTerrorSI: '0.00', gicRegPrem: '14.37', gicTerrorPrem: '0.00',
      riCompName: 'SBI', riAdd: 'Anand', riPerc: '5', riPremAcc: '1000.00', payMode: 'Cheque', cheNo: '25635', payDate: '14-Apr-2020',
    },
    {
      position: '2', riskType: 'Fire', riskDetals: 'Nadiad', regSumInsured: '1000.00', treSumInsured: '1000.00',
      regPremium: '1000.00', trePremium: '1000.00', totalSi: '2000.00', premium: '2000.00', remarks: '',
      insName: 'Anand', insAdd: 'Nadiad', district: 'Nadiad', taluka: 'Nadiad', city: 'Nadiad', pincode: '353633', fac: 'FAC',
      gifPerc: '25', gifRegSI: '250.00', gifTerrorSI: '25.00', gifRegPrem: '287.50', gifTerrorPrem: '2.50',
      gicPerc: '5', gicRegSI: '12.50', gicTerrorSI: '0.00', gicRegPrem: '14.37', gicTerrorPrem: '0.00',
      riCompName: 'SBI', riAdd: 'Nadiad', riPerc: '5', riPremAcc: '1000.00', payMode: 'Cheque', cheNo: '25635', payDate: '14-Apr-2020',
    },
  ];
  dataSource = new MatTableDataSource<any>(this.elementData);
  dataSourceRisk = new MatTableDataSource<any>(this.elementDataRisk);
  dataSource1 = new MatTableDataSource<any>(this.elementData);
  dataSourceList = new MatTableDataSource<any>(this.elementDataList);
  constructor(private fb: FormBuilder, private router: Router, private dialog: MatDialog) { }

  ngOnInit() {
    this.policyEntryForm = this.fb.group({
      policyNo: ['DOI/48/P/2019-20/000001'],
      policyType: [''],
      leaderName: [''],
      leaderAddres: [''],
      leaderPolicyNo: [''],
      policyIssueDate: [''],
      policyStartDate: [''],
      policyEndDate: [''],
      facTreaty: [''],
      insuredName: [''],
      insuredAddress: [''],
      district: [''],
      taluka: [''],
      city: [''],
      pincode: [''],
      riskType: [''],
      riskDetals: [''],
      remarks: [''],
      basicSumInsured: [''],
      terrorisumPool: [''],
      totalSi: [{ value: '', disabled: true }],
      premium: [''],
      riRequired: [''],
      ourShare: [''],
      ourShareSi: [''],
      ourSharePremium: [''],
      ourShareTerrorSi: [''],
      ourShareTerrorPremium: [''],
      gicShare: [''],
      gicShareSi: [''],
      gicShareTerrorSi: [''],
      gicSharePremium: [''],
      gicShareTerrorPremium: [''],
      other: [''],
      otherShare: [''],
      otherShareSi: [''],
      otherShareTerrorSi: [''],
      otherSharePremium: [''],
      otherShareTerrorPremium: [''],
      agentCommission: [''],
      // challanNo: [{ value: '4567', disabled: true }],
      // challanDate: [''],
      policyDate: [{ value: new Date('03/31/2019'), disabled: true }],
      riName: [''],
      riAddress: [''],
      riShare: [''],
      premiumAmount: [{ value: '', disabled: true }],
      paymentReceivedOn: [''],
      paymentReceivedThrough: [''],
      challanNoRi: [''],
      challanDateRi: [''],
      treSumInsured: [''],
      regSumInsured: [''],
      trePremium: [''],
      regPremium: [''],
      diffAmount: [''],
      challanAmount: [''],
      subtype: [''],
      totAmount: [''],
      remarksDiff: [''],
      paymentMode: [''],
      dateCheque: [''],
      ddZNo: [''],
      banName: [''],
      treasuryName: [''],
      bankBranch: [''],
      challanDate1: [''],
      challanNo: [{ value: '12345', disabled: true }],
      chaAmount: [''],
      challanDate: [{ value: new Date('05/11/2019'), disabled: true }],
      paymentDate: [{ value: new Date('05/10/2019'), disabled: true }],
      
    });
  }

  calculateTotalSi() {
    let value = 0;
    value = Number(this.policyEntryForm.controls['basicSumInsured'].value) + Number(this.policyEntryForm.controls['terrorisumPool'].value);
    return value;
  }

  calculateOurShareSi() {
    let value = 0;
    let per = 0;
    per = (this.calculateTotalSi() / 100) * (Number(this.policyEntryForm.value.ourShare));
    return per;
    return value;
  }

  calculateOurSharePremium() {
    let value = 0;
    value = (Number(this.policyEntryForm.value.premium) / 100) * (Number(this.policyEntryForm.value.ourShare));
    return value;
  }

  challancalculateOurSharePremium() {
    let value = 0;
    value = (Number(this.policyEntryForm.value.challanAmount)) - (this.calculateOurSharePremium());
    return value;
  }
  // select taluka on basis of district
  selectDistrict() {
    const district = this.policyEntryForm.value.district;
    if (district !== '' && district != null) {
      this.talukaNameList = this.taluka_list.filter(
        searchBy => searchBy.district.toLowerCase() === district.toLowerCase());
    }
  }

  addColumn() {
    const data = this.dataSource.data;
    data.push({
      riName: '',
      riAddress: '',
      riShare: '',
      paymentReceivedOn: '',
      paymentReceivedThrough: '',
      challanNo: '',
      challanDate: '',
    });
    this.dataSource.data = this.dataSource.data;
  }

  deleteColumn(index) {
    this.dataSource.data.splice(index, 1);
    this.dataSource.data = this.dataSource.data;
  }

  addColumnRisk() {
    const data = this.dataSourceRisk.data;
    data.push({
      riskType: '',
      riskDetals: '',
      remarks: '',
      basicSumInsured: '',
      regSumInsured: '',
      treSumInsured: '',
      terrorisumPool: '',
      regPremium: '',
      trePremium: '',
      totalSi: '',
      premium: '',
    });
    this.dataSourceRisk.data = this.dataSourceRisk.data;
  }

  deleteColumnRisk(index) {
    this.dataSourceRisk.data.splice(index, 1);
    this.dataSourceRisk.data = this.dataSourceRisk.data;
  }
  setValuesTable(element) {
    element.totalSi = Number(element.regSumInsured) + Number(element.treSumInsured);
    element.premium = Number(element.regPremium) + Number(element.trePremium);
  }


  setFieldVal() {
    const gifPerc = Number(this.policyEntryForm.controls.ourShare.value) / 100;
    const gicPerc = Number(this.policyEntryForm.controls.gicShare.value) / 100;
    const otherPerc = Number(this.policyEntryForm.controls.otherShare.value) / 100;

    this.policyEntryForm.controls.ourShareSi.patchValue(gifPerc * Number(this.elementDataRisk[0].regSumInsured));
    this.policyEntryForm.controls.ourShareTerrorSi.patchValue(gifPerc * Number(this.elementDataRisk[0].treSumInsured));
    this.policyEntryForm.controls.ourSharePremium.patchValue(gifPerc * Number(this.elementDataRisk[0].regPremium));
    this.policyEntryForm.controls.ourShareTerrorPremium.patchValue(gifPerc * Number(this.elementDataRisk[0].trePremium));

    this.policyEntryForm.controls.gicShareSi.patchValue(gicPerc * Number(this.policyEntryForm.controls.ourShareSi.value));
    this.policyEntryForm.controls.gicShareTerrorSi.patchValue(gicPerc * Number(this.policyEntryForm.controls.ourShareTerrorSi.value));
    this.policyEntryForm.controls.gicSharePremium.patchValue(gicPerc * Number(this.policyEntryForm.controls.ourSharePremium.value));
    this.policyEntryForm.controls.gicShareTerrorPremium.patchValue(gicPerc * Number(this.policyEntryForm.controls.ourShareTerrorPremium.value));

    this.policyEntryForm.controls.otherShareSi.patchValue(otherPerc * Number(this.elementDataRisk[0].regSumInsured));
    this.policyEntryForm.controls.otherShareTerrorSi.patchValue(otherPerc * Number(this.elementDataRisk[0].treSumInsured));
    this.policyEntryForm.controls.otherSharePremium.patchValue(otherPerc * Number(this.elementDataRisk[0].regPremium));
    this.policyEntryForm.controls.otherShareTerrorPremium.patchValue(otherPerc * Number(this.elementDataRisk[0].trePremium));


    this.policyEntryForm.controls.totAmount.patchValue(Number(this.elementDataRisk[0].premium));

    this.policyEntryForm.controls.diffAmount.patchValue(Number(this.elementDataRisk[0].premium)
      - Number(this.policyEntryForm.controls.challanAmount.value));

  }

  calculateRiPremiumAmount(element) {
    if (element.riName === 'GIC') {
      let value = 0;
      value = (Number(this.riShare) / 100) * Number(this.calculateOurSharePremium());
      return value;
    } else {
      let value = 0;
      value = (Number(element.riShare) / 100) * Number(this.policyEntryForm.controls['premium'].value);
      return value;
    }
  }

  onRiNameEnter(element) {
    if (element.riName === 'GIC') {
      return element.riShare = '5%'
    }
  }

  onAdd() { }

  onSubmit() { }

  onReset() {
    this.policyEntryForm.reset();
  }

  goToListing() {
    this.router.navigate([]);
  }

  getTabIndex(tabIndex) {
    this.selectedIndex = tabIndex;
  }
  goToNextTab() {
    this.selectedIndex++;
  }


  onClose() { }
  // ontoken(index) {

  //   if (index.value) {
  //     this.isTokentable = true;
  //   } else {
  //     this.isTokentable = false;
  //   }
  // }
  ontoken(index) {

    if (index.value === '1') {
      this.isTokentable = true;
    } else {
      this.isTokentable = false;
    }
  }
  ontoken1(index) {
    if (index.value === '3') {
      this.isTokentable = true;
      this.policyEntryForm.patchValue({
        challanNo: '1856',
        challanDate: new Date('07/18/2020'),
        challaAmount: '10000.00'
      });
    } else {
      this.isTokentable = false;
    }
    if (index.value === '2' || index.value === '1') {
      this.isTokentableOPEN = true;
      this.policyEntryForm.patchValue({
        receiptNo: '11246254',
        receiptDate: new Date('07/17/2020'),
      });

    } else {
      this.isTokentableOPEN = false;
    }
  }

  // Upload Provision
  uploadClick() {
    const dialogRef = this.dialog.open(UploadProvisionComponent, {
      width: '1200px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.selectedIndex++;
    });

  }

}
