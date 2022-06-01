import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
// import { element } from '@angular/core/src/render3/instructions';
// import { element } from "@angular/core/src/render3";
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DoiDirectives } from 'src/app/common/directive/doi';
import { doiMessage } from 'src/app/common/error-message/common-message.constants';
import { ListValue } from 'src/app/models/common-listing';
import { CoInsuranceClaimDetails, CoInsuranceNetGifLiability, CoInsuranceReInsurer } from 'src/app/models/doiModel';

@Component({
  selector: 'app-co-insurance-claim-entry',
  templateUrl: './co-insurance-claim-entry.component.html',
  styleUrls: ['./co-insurance-claim-entry.component.css']
})
export class CoInsuranceClaimEntryComponent implements OnInit {

  todayDate = new Date();
  claimEntryForm: FormGroup;
  errorMessage = doiMessage;
  claimAmountValue = 5000000;
  premiumShareValue = 0;
  gifShareAmount;

  policyTypeCtrl: FormControl = new FormControl();
  doiResponsibilityCtrl: FormControl = new FormControl();
  receivedClaimFromCtrl: FormControl = new FormControl();
  receivedClaimNoteCtrl: FormControl = new FormControl();
  surveyorReportReceivedCtrl: FormControl = new FormControl();
  claimIUnderInvestigationCtrl: FormControl = new FormControl();
  thirdPartyClaimReceivedCtrl: FormControl = new FormControl();
  intimationThroughCtrl: FormControl = new FormControl();
  nameCtrl: FormControl = new FormControl();
  claimFromCtrl: FormControl = new FormControl();

  policyTypeList: ListValue[] = [
    { value: '1', viewValue: 'Fire' },
    { value: '2', viewValue: 'Marine' },
    { value: '3', viewValue: 'Miscellanous' },
    { value: '4', viewValue: 'IAR(Industrial All Risk Policy)' }
  ];
  doiResponsibilityList: ListValue[] = [
    { value: '1', viewValue: 'Yes' },
    { value: '2', viewValue: 'No' },
  ];
  receivedClaimFromList: ListValue[] = [
    { value: '1', viewValue: 'Yes' },
    { value: '2', viewValue: 'No' },
  ];
  receivedClaimNoteList: ListValue[] = [
    { value: '1', viewValue: 'Yes' },
    { value: '2', viewValue: 'No' },
  ];
  surveyorReportReceivedList: ListValue[] = [
    { value: '1', viewValue: 'Yes' },
    { value: '2', viewValue: 'No' },
  ];
  claimIUnderInvestigationList: ListValue[] = [
    { value: '1', viewValue: 'Yes' },
    { value: '2', viewValue: 'No' },
  ];
  thirdPartyClaimReceivedList: ListValue[] = [
    { value: '1', viewValue: 'Yes' },
    { value: '2', viewValue: 'No' },
  ];

  attachmentTypeCode: ListValue[] = [
    { value: '01', viewValue: 'Discharge Voucher' },
    { value: '02', viewValue: 'Surveyor Report' },
  ];
  claimFromList: ListValue[] = [
    { value: '01', viewValue: 'Regular Policy ' },
    { value: '02', viewValue: 'Migrated  Policy ' },
  ];

  intimationThroughList: ListValue[] = [
    { value: '1', viewValue: 'Email' },
    { value: '2', viewValue: 'Letter' },
    { value: '3', viewValue: 'Phone' },
  ];

  nameList: ListValue[] = [
    { value: '1', viewValue: 'Bajaj Allianz General Insurance Co. Ltd.' },
    { value: '2', viewValue: 'ABC Pvt. Ltd.' },
  ];

  displayedColumns: string[] = [
    'particulars',
    'percentage',
    'claimAmount',
    'surveyorAmount',
    'total',
  ];

  displayedColumns1: string[] = [
    'particulars1',
    'percentage1',
    'claimAmount1',
    'surveyorAmount1',
    'total1',
    'action'
  ];

  displayedColumns2: string[] = [
    'claimAmount2',
    'surveyorAmount2',
    'total2',
  ];


  elementData: CoInsuranceClaimDetails[] = [
    {
      particulars: 'Intimated Claim Amount',
      percentage: '',
      claimAmount: this.claimAmountValue,
      surveyorAmount: null,
    },
    {
      particulars: '(Leader) Paid Amount',
      percentage: '',
      claimAmount: 4500000,
      surveyorAmount: 3500,
    },
    {
      particulars: 'GIF Share Amount',
      percentage: '45.00',
      claimAmount: null,
      surveyorAmount: null
    },
  ];

  elementData1: CoInsuranceReInsurer[] = [
    {
      particulars1: 'GIC',
      percentage1: '5.00',
    },
    {
      particulars1: 'ICICI',
      percentage1: '10.00',
    },
    {
      particulars1: 'United India Company',
      percentage1: '5.00',
    },
    {
      particulars1: 'Oriental Insurance Corporation',
      percentage1: '10.00',
    },
  ];

  elementData2: CoInsuranceNetGifLiability[] = [
    {
      claimAmount2: '',
      surveyorAmount2: '',
      total2: ''
    }
  ];


  dataSource = new MatTableDataSource<CoInsuranceClaimDetails>(this.elementData);
  dataSourceNetGifLiability = new MatTableDataSource<CoInsuranceNetGifLiability>(this.elementData2);
  dataSourceReInsurer = new MatTableDataSource<CoInsuranceReInsurer>(this.elementData1);


  constructor(private el: ElementRef, public dialog: MatDialog, private router: Router, private fb: FormBuilder,) { }
  directiveObject = new DoiDirectives(this.router, this.dialog);

  ngOnInit() {
    this.claimEntryForm = this.fb.group({
      name: [''],
      address: [''],
      phoneNo: [''],
      emailId: [''],
      intimationDate: new Date(''),
      intimationThrough: [''],
      claimId: [''],
      claimAmount: [''],
      policyType: [''],
      leaderPolicyNo: [''],
      acceptedPolicyDetails: [''],
      sumInsured: [{ value: '', disabled: true }],
      premiumAmount: [''],
      gifShare: [''],
      premiumShare: [{ value: '', disabled: true }],
      premiumPaidChallanDate: [''],
      challanNo: [''],
      claimAmountToBePaid: [{ value: '', disabled: true }],
      coInsurancePolicyNo: [''],
      policyStartDate: new Date(''),
      policyEndDate: new Date(''),
      insuredName: [''],
      insuredAddress: [''],
      riskLocation: [''],
      railwayTrackReceiptNo: [''],
      railwayTrackReceiptDate: [''],
      claimIdClaimDetails: [''],
      claimDate: [''],
      damageDate: [''],
      claimDescription: [''],
      reasonForDamage: [''],
      doiResponsibility: [''],
      pageNoDoiResponsibility: [''],
      receivedClaimFrom: [''],
      pageNoReceivedClaimFrom: [''],
      receivedClaimNote: [''],
      pageNoReceivedClaimNote: [''],
      surveyorName: [''],
      surveyorReportReceived: [''],
      surveyorReportReceivedPageNo: [''],
      claimIUnderInvestigation: [''],
      remarks: [''],
      thirdPartyClaimReceived: [''],
      amountReceived: [''],
      damageScalpSaleAmount: [''],
      claimFromFrom: [''],
      refNo: ['DOI/DB/19-20/E0091']
    });

    this.claimAmountValue = this.claimEntryForm.controls['claimAmount'].value;
  }

  calculatePremiumShare() {
    let premiumAmount = this.claimEntryForm.controls['premiumAmount'].value;
    let gifShare = this.claimEntryForm.controls['gifShare'].value;
    let value = 0;

    console.log(premiumAmount);
    console.log(gifShare);

    if (premiumAmount !== '' && gifShare !== '') {
      value = (Number(premiumAmount) * Number(gifShare) / 100);
      this.premiumShareValue = value;
      return value;
    } else {
      return value;
    }
  }
  ref(event) {
    if (event) {
      this.claimEntryForm.patchValue({
        claimIdClaimDetails: '1205',
        claimDate: new Date('02/12/2020'),
        damageDate: new Date('05/31/2018'),
        claimDescription: 'Fire in underground cable trench',
        reasonForDamage: 'Fire due to heavy flash over in joining kit of R-Phase of 400 KV 1200 sq. mm EHV XLPE cable ',
        doiResponsibility: '1',
        pageNoDoiResponsibility: '',
        receivedClaimFrom: '2',
        pageNoReceivedClaimFrom: '',
        receivedClaimNote: '1',
        pageNoReceivedClaimNote: '',
        surveyorName: '',
        surveyorReportReceived: '1',
        surveyorReportReceivedPageNo: '',
        claimIUnderInvestigation: '2',
        remarks: '',
        thirdPartyClaimReceived: '1',
        amountReceived: '',
        damageScalpSaleAmount: '',
      })
    }
  }
  addData(event) {
    if (event) {
      this.claimEntryForm.patchValue({
        name: '1',
        address: 'Gandhinagar',
        phoneNo: '123456789101',
        emailId: 'abc@gmail.com',
        intimationDate: new Date('02/20/2020'),
        intimationThrough: '',
        claimId: 'OC-19-2201-4090-00000004',
        claimAmount: '95153840',
        policyType: '1',
        leaderPolicyNo: 'OC-19-2201-4090-00000001',
        acceptedPolicyDetails: 'Ukai TPS Unit No. 6,500 MW',
        sumInsured: '35465710000',
        premiumAmount: '53275454',
        gifShare: '25',
        premiumShare: '',
        premiumPaidChallanDate: new Date('07/11/2018'),
        challanNo: '362',
        claimAmountToBePaid: '',
        coInsurancePolicyNo: 'Bajaj Allianz 2018-19/52/01',
        policyStartDate: new Date('04/01/2018'),
        policyEndDate: new Date('03/31/2019'),
        insuredName: 'Gujarat State Electricity Corporation',
        insuredAddress: 'Ukai',
        riskLocation: 'Ukai TPS Unit No. 6,500 MW',
        railwayTrackReceiptNo: '2018-19/52/01',
        railwayTrackReceiptDate: new Date('13/31/2019'),
      });
    }
  }
  calculateClaimAmount() {

    let value1 = 0;
    let value2 = 0;
    let total = 0;

    value1 = Number(this.dataSource.data[this.dataSource.data.length - 1].claimAmount);

    this.dataSourceReInsurer.data.forEach((element, index) => {
      value2 = Number(this.calculateGicClaimAmount(element, index)) + value2;
    });

    total = Number(value1) - Number(value2);

    if (total < 0) {
      total = total * (-1);
      return total;
    } else {
      return total;
    }
  }

  calculateSurveyorAmount() {

    let value1 = 0;
    let value2 = 0;
    let total = 0;

    value1 = Number(this.dataSource.data[this.dataSource.data.length - 1].surveyorAmount);
    this.dataSourceReInsurer.data.forEach((element, index) => {
      value2 = Number(this.calculateGicSurveyorAmount(element, index)) + value2;
    });

    total = Number(value1) - Number(value2);

    if (total < 0) {
      total = total * (-1);
      return total;
    } else {
      return total;
    }
  }

  calculateTotalAmount() {
    let totalAmount = 0;
    if (this.dataSource.data[this.dataSource.data.length - 1].particulars === 'GIF Share Amount') {
      this.dataSource.data[this.dataSource.data.length - 1].claimAmount = (Number(this.dataSource.data[this.dataSource.data.length - 1].percentage) / 100) * Number(this.dataSource.data[this.dataSource.data.length - 2].claimAmount);
      this.dataSource.data[this.dataSource.data.length - 1].surveyorAmount = (Number(this.dataSource.data[this.dataSource.data.length - 1].percentage) / 100) * Number(this.dataSource.data[this.dataSource.data.length - 2].surveyorAmount);
      totalAmount = Number(this.dataSource.data[this.dataSource.data.length - 1].claimAmount) + Number(this.dataSource.data[this.dataSource.data.length - 1].surveyorAmount);
      this.gifShareAmount = totalAmount;
      return totalAmount;
    } else {
      this.gifShareAmount = totalAmount;
      totalAmount = Number(this.dataSource.data[this.dataSource.data.length - 1].claimAmount) + Number(this.dataSource.data[this.dataSource.data.length - 1].surveyorAmount);
      return totalAmount;
    }
  }

  calculateTotalAmount1(element, index) {
    return (Number(this.calculateGicClaimAmount(element, index)) + Number(this.calculateGicSurveyorAmount(element, index)));

  }

  calculateTotalAmount2() {

    let value = 0;
    value = Number(this.calculateClaimAmount()) + Number(this.calculateSurveyorAmount());
    return value;
  }

  calculateGicClaimAmount(element, index) {

    let claimAmount = 0;
    if (index == 0) {
      claimAmount = Number(this.dataSource.data[this.dataSource.data.length - 1].claimAmount) * (Number(element.percentage1) / 100);
      return claimAmount;

    } else {
      claimAmount = Number(this.dataSource.data[this.dataSource.data.length - 2].claimAmount) * (Number(element.percentage1) / 100);
      return claimAmount;
    }

  }

  calculateGicSurveyorAmount(element, index) {
    let surveyorAmount = 0;
    if (index === 0) {
      surveyorAmount = Number(this.dataSource.data[this.dataSource.data.length - 1].surveyorAmount) * (Number(element.percentage1) / 100);
      return surveyorAmount;
    } else {
      surveyorAmount = Number(this.dataSource.data[this.dataSource.data.length - 2].surveyorAmount) * (Number(element.percentage1) / 100);
      return surveyorAmount;
    }

  }

  addColumn() {

    const data = this.dataSourceReInsurer.data;
    data.push({
      particulars1: '',
      percentage1: '',
    });
    this.dataSourceReInsurer.data = data;

  }

  deleteColumn(index) {
    this.dataSourceReInsurer.data.splice(index, 1);
    this.dataSourceReInsurer.data = this.dataSourceReInsurer.data;
  }

  onSubmit() {

  }

  onReset() {
    this.claimEntryForm.reset();
  }

  goToListing() {
    this.router.navigate(['./doi/co-insurance-claim-listing']);
  }

  onCloseClaimEntry() {

  }

  onNameSelection(event) {
    if (event.value) {
      this.claimEntryForm.controls['sumInsured'].patchValue('500000')
    }
  }

  onClose() {

  }
}
