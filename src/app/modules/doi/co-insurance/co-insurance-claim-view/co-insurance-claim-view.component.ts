import { AfterViewInit, Component, OnChanges, OnInit } from '@angular/core';
import { NgOnChangesFeature } from '@angular/core/src/render3';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { ListValue } from 'src/app/model/common-listing';
import { AttachmentTypeList, CoInsuranceClaimDetails, CoInsuranceNetGifLiability, CoInsuranceReInsurer } from 'src/app/model/doiModel';
import { JpaQueryDialogComponent } from '../../jpa-query-dialog/jpa-query-dialog.component';
import { JpaRejectionQueryDialogComponent } from '../../jpa-rejection-query-dialog/jpa-rejection-query-dialog.component';

@Component({
  selector: 'app-co-insurance-claim-view',
  templateUrl: './co-insurance-claim-view.component.html',
  styleUrls: ['./co-insurance-claim-view.component.css']
})
export class CoInsuranceClaimViewComponent implements OnInit {
  liceno: boolean = false;
  todayDate = new Date();
  claimEntryForm: FormGroup;
  claimAmountValue = 95153840;
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

  surveyorNameCtrl: FormControl = new FormControl();

  recomndedCtrl: FormControl = new FormControl();
  policyTypeList: ListValue[] = [
    { value: '1', viewValue: 'Fire' },
    { value: '2', viewValue: 'Marine' },
    { value: '3', viewValue: 'Miscellanous' },
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
  surveyorNameList: ListValue[] = [
    { value: '1', viewValue: 'Mr. Abhishek Gupta' },
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
  recomnded_list: ListValue[] = [
    { value: '1', viewValue: 'Recommonded to Query ' },
    { value: '4', viewValue: 'Recommonded for Rejection' },
    { value: '5', viewValue: 'Recommonded for Settlement' },
    { value: '6', viewValue: 'Recommonded For Investigation' },

  ];
  attachmentObj: AttachmentTypeList[] = [
    {
      type: 'stamp-view',
      attachmentType: 'Discharge Voucher',
    },
    {
      type: 'stamp-view',
      attachmentType: 'Surveyor Report',
    },
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
      claimAmount: this.claimAmountValue,
      surveyorAmount: null,
    },
    {
      particulars: 'GIF Share Amount',
      percentage: '.25',
      claimAmount: null,
      surveyorAmount: null
    },
  ];

  elementData1: CoInsuranceReInsurer[] = [
    {
      particulars1: 'GIC',
      percentage1: '.05',
    },
    {
      particulars1: 'Royal Sundaram General',
      percentage1: '.05',
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


  constructor(private router: Router, public dialog: MatDialog, private fb: FormBuilder,) { }
  ngOnInit() {
    this.claimEntryForm = this.fb.group({
      name: [{ value: '1', disabled: true }],
      recomnded: [''],
      address: [{ value: 'Gandhinagar', disabled: true }],
      phoneNo: [{ value: '123456789101', disabled: true }],
      emailId: [{ value: 'abc@gmail.com', disabled: true }],
      intimationDate: [{ value: new Date('02/20/2020'), disabled: true }],
      intimationThrough: [{ value: '', disabled: true }],
      claimId: [{ value: 'OC-19-2201-4090-00000004', disabled: true }],
      claimAmount: [{ value: '95153840', disabled: true }],
      policyType: [{ value: '1', disabled: true }],
      leaderPolicyNo: [{ value: 'OC-19-2201-4090-00000001', disabled: true }],
      acceptedPolicyDetails: [{ value: 'Ukai TPS Unit No. 6,500 MW', disabled: true }],
      sumInsured: [{ value: '35465710000', disabled: true }],
      premiumAmount: [{ value: '53275454', disabled: true }],
      gifShare: [{ value: '25', disabled: true }],
      premiumShare: [{ value: '', disabled: true }],
      premiumPaidChallanDate: [{ value: new Date('07/11/2018'), disabled: true }],
      challanNo: [{ value: '362', disabled: true }],
      claimAmountToBePaid: [{ value: '', disabled: true }],
      coInsurancePolicyNo: [{ value: 'Bajaj Allianz 2018-19/52/01', disabled: true }],
      policyStartDate: [{ value: new Date('04/01/2018'), disabled: true }],
      policyEndDate: [{ value: new Date('03/31/2019'), disabled: true }],
      insuredName: [{ value: 'Gujarat State Electricity Corporation', disabled: true }],
      insuredAddress: [{ value: 'Ukai', disabled: true }],
      riskLocation: [{ value: 'Ukai TPS Unit No. 6,500 MW', disabled: true }],
      railwayTrackReceiptNo: [{ value: '', disabled: true }],
      railwayTrackReceiptDate: [{ value: '', disabled: true }],
      claimIdClaimDetails: [{ value: '1205', disabled: true }],
      claimDate: [{ value: new Date('02/12/2020'), disabled: true }],
      damageDate: [{ value: new Date('05/31/2018'), disabled: true }],
      claimDescription: [{ value: 'Fire in underground cable trench', disabled: true }],
      reasonForDamage: [{ value: 'Fire due to heavy flash over in joining kit of R-Phase of 400 KV 1200 sq. mm EHV XLPE cable ', disabled: true }],
      doiResponsibility: [{ value: '1', disabled: true }],
      pageNoDoiResponsibility: [{ value: '', disabled: true }],
      receivedClaimFrom: [{ value: '2', disabled: true }],
      pageNoReceivedClaimFrom: [{ value: '', disabled: true }],
      receivedClaimNote: [{ value: '1', disabled: true }],
      pageNoReceivedClaimNote: [{ value: '', disabled: true }],
      surveyorName: [{ value: '', disabled: true }],
      surveyorReportReceived: [{ value: '1', disabled: true }],
      surveyorReportReceivedPageNo: [{ value: '', disabled: true }],
      claimIUnderInvestigation: [{ value: '2', disabled: true }],
      remarks: [{ value: '', disabled: true }],
      thirdPartyClaimReceived: [{ value: '1', disabled: true }],
      amountReceived: [{ value: '', disabled: true }],
      damageScalpSaleAmount: [{ value: '', disabled: true }],

    });

    this.claimAmountValue = this.claimEntryForm.controls['claimAmount'].value;
    this.calculatePremiumShare();
  }

  calculatePremiumShare() {
    let premiumAmount = this.claimEntryForm.value.premiumAmount;
    let gifShare = this.claimEntryForm.value.gifShare;
    let value = 0;

    value = Math.ceil(Number(premiumAmount) * (Number(gifShare)));

    this.claimEntryForm.patchValue({
      premiumShare: value
    });

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
      claimAmount = Number(this.dataSource.data[this.dataSource.data.length - 1].claimAmount) * (Number(element.percentage1));
      return claimAmount;

    } else {
      claimAmount = Number(this.dataSource.data[this.dataSource.data.length - 2].claimAmount) * (Number(element.percentage1));
      return claimAmount;
    }

  }

  calculateGicSurveyorAmount(element, index) {
    let surveyorAmount = 0;
    if (index === 0) {
      surveyorAmount = Number(this.dataSource.data[this.dataSource.data.length - 1].surveyorAmount) * (Number(element.percentage1));
      return surveyorAmount;
    } else {
      surveyorAmount = Number(this.dataSource.data[this.dataSource.data.length - 2].surveyorAmount) * (Number(element.percentage1));
      return surveyorAmount;
    }

  }

  goToListing() {
    this.router.navigate(['./doi/co-insurance-claim-listing']);
  }

  onClose() {

  }
  onSubmit() {
    if (this.claimEntryForm.controls.recomnded.value !== '') {
      if (this.claimEntryForm.controls.recomnded.value === '1') {
        const dialogRef = this.dialog.open(JpaQueryDialogComponent, {
          width: '1000px',
          height: '500px',
          disableClose: true

        });
      } else {
        this.liceno = false;
      }

      if (this.claimEntryForm.controls.recomnded.value === '4') {
        const dialogRef = this.dialog.open(JpaRejectionQueryDialogComponent, {
          width: '1000px',
          height: '500px',
          disableClose: true

        });
      }
    }
  }
}
