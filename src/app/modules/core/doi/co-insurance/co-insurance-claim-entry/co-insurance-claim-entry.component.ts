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
import { CoInsuranceClaimEntry } from 'src/app/models/doi/doiModel';
import { DatePipe } from '@angular/common';
import { DoiService } from '../../service/doi.service';
import { APIConst } from 'src/app/shared/constants/doi/doi-api.constants';
import { ToastrService } from 'ngx-toastr';

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

  policyTypeList: ListValue[] = [];
  doiResponsibilityList: ListValue[] = [];
  receivedClaimFromList: ListValue[] = [];
  receivedClaimNoteList: ListValue[] = [];
  surveyorReportReceivedList: ListValue[] = [];
  claimIUnderInvestigationList: ListValue[] = [];
  thirdPartyClaimReceivedList: ListValue[] = [];

  attachmentTypeCode: ListValue[] = [
    { value: '01', viewValue: 'Discharge Voucher' },
    { value: '02', viewValue: 'Surveyor Report' },
  ];
  claimFromList: ListValue[] = [];

  intimationThroughList: ListValue[] = [];

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


  constructor(private el: ElementRef, public dialog: MatDialog, private router: Router, private fb: FormBuilder, private workflowService: DoiService, private datePipe: DatePipe, private toastr: ToastrService) { }
  directiveObject = new DoiDirectives(this.router, this.dialog);

  ngOnInit() {
    this.getPolicyTypeList();
    this.getCIIntimationThrough();
    this.getDoiResponsibilityList();
    this.getClaimFromList();
    this.getReceivedClaimFromList();
    this.getSurveyorReportReceivedList();
    this.getClaimIUnderInvestigationList();
    this.getThirdPartyClaimReceivedList();
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

  private getPolicyTypeList() {
    let passData: any = {name:APIConst.DOI_CO_INSURANCE_POLICY_TYPE}
    this.workflowService.getData(passData,APIConst.DOI_GET_DROPDOWN_DATA).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          this.policyTypeList = resp.result;
          
        }
      }
    );
    /*this.workflowService.getDataWithoutParams(APIConst.DOI_POLICY_TYPES_DROPDOWN).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          this.policyTypeList = resp.result;
          
        }
      }
    );*/
  }
  
  private getCIIntimationThrough() {
    let passData: any = {name:APIConst.DOI_CO_INSURANCE_INTIMATION_THROUGH}
    this.workflowService.getData(passData,APIConst.DOI_GET_DROPDOWN_DATA).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          this.intimationThroughList = resp.result;
          
        }
      }
    );
  }
  private getDoiResponsibilityList() {
    let passData: any = {name:APIConst.DOI_CO_INSURANCE_DOI_RESPONSIBILITY}
    this.workflowService.getData(passData,APIConst.DOI_GET_DROPDOWN_DATA).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          this.doiResponsibilityList = resp.result;
          
        }
      }
    );
  }
  private getClaimFromList() {
    let passData: any = {name:APIConst.DOI_CO_INSURANCE_RECEIVED_CLAIM_FROM}
    this.workflowService.getData(passData,APIConst.DOI_GET_DROPDOWN_DATA).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          this.claimFromList = resp.result;
          
        }
      }
    );
  }
  private getReceivedClaimFromList() {
    let passData: any = {name:APIConst.DOI_COINS_CLAIM_ENT_RECE_CLAIM_FROM}
    this.workflowService.getData(passData,APIConst.DOI_GET_DROPDOWN_DATA).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          this.receivedClaimFromList = resp.result;
          this.receivedClaimNoteList = resp.result;
          
        }
      }
    );
  }
  private getSurveyorReportReceivedList() {
    let passData: any = {name:APIConst.DOI_CO_INSURANCE_SURVEYOR_REPORT_RECEIVED}
    this.workflowService.getData(passData,APIConst.DOI_GET_DROPDOWN_DATA).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          this.surveyorReportReceivedList = resp.result;
        }
      }
    );
  }
  private getClaimIUnderInvestigationList() {
    let passData: any = {name:APIConst.DOI_CO_INSURANCE_WHETHER_UNDER_INSURANCE}
    this.workflowService.getData(passData,APIConst.DOI_GET_DROPDOWN_DATA).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          this.claimIUnderInvestigationList = resp.result;
        }
      }
    );
  }
  private getThirdPartyClaimReceivedList() {
    let passData: any = {name:APIConst.DOI_CO_INSURANCE_WHETHER_CLAIM_HAS_BEEN_LOGED_WITH_THIRED_PARTY}
    this.workflowService.getData(passData,APIConst.DOI_GET_DROPDOWN_DATA).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          this.thirdPartyClaimReceivedList = resp.result;
        }
      }
    );
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
		console.log(this.claimEntryForm.value);
		if(this.claimEntryForm.valid){
			let payload: CoInsuranceClaimEntry = new CoInsuranceClaimEntry();
			payload.coinsClaimId = this.claimEntryForm.controls.claimIdClaimDetails.value;
			payload.acceptedPolDtls = this.claimEntryForm.controls.acceptedPolicyDetails.value;
			//payload.challanAmt = this.claimEntryForm.controls.challanNo.value;
			payload.challanDt = this.dateFormatter(this.claimEntryForm.controls.premiumPaidChallanDate.value,'yyyy-MM-dd');
			
			payload.claimAmount = this.claimEntryForm.controls.claimAmount.value;
			payload.claimDesc = this.claimEntryForm.controls.claimDescription.value;
			payload.claimFormPageNo = this.claimEntryForm.controls.pageNoReceivedClaimFrom.value;
			//payload.claimStatus = this.claimEntryForm.controls.majorHead.value;
			//payload.claimStatusId = this.claimEntryForm.controls.majorHead.value;
			payload.coinsClaimDt = this.dateFormatter(this.claimEntryForm.controls.claimDate.value,'yyyy-MM-dd');
			//payload.coinsClaimNo = this.claimEntryForm.controls.coinsClaimNo.value;
			//payload.coinsPolicyHdrId = this.claimEntryForm.controls.coinsClaimNo.value;
			payload.coinsPolicyNo = this.claimEntryForm.controls.coInsurancePolicyNo.value;
			payload.damageDt = this.dateFormatter(this.claimEntryForm.controls.damageDate.value,'yyyy-MM-dd');
			payload.damageReason = this.claimEntryForm.controls.reasonForDamage.value;
			payload.dmamgeScalpAmt = this.claimEntryForm.controls.damageScalpSaleAmount.value;
			payload.doiRespPageNo = this.claimEntryForm.controls.pageNoDoiResponsibility.value;
			payload.gifClaimAmt = this.dataSource.data[2].claimAmount;
			payload.gifClaimPerc = this.dataSource.data[2].percentage;
			payload.gifSharePerc = this.claimEntryForm.controls.gifShare.value;
			payload.gifSurveyAmt = this.dataSource.data[2].surveyorAmount;
			payload.gifTotAmt = this.calculateTotalAmount();
			payload.insuredAddress = this.claimEntryForm.controls.insuredAddress.value;
			payload.insuredName = this.claimEntryForm.controls.insuredName.value;
			payload.intimClaimAmt = this.dataSource.data[0].claimAmount;
			payload.intimClaimPerc = this.dataSource.data[0].percentage;
			payload.intimSurveyAmt = this.dataSource.data[0].surveyorAmount;
			payload.intimTotAmt = this.calculateTotalAmount();
			payload.intimationDt = this.dateFormatter(this.claimEntryForm.controls.intimationDate.value,'yyyy-MM-dd');
			payload.intimationThruId = this.claimEntryForm.controls.intimationThrough.value;
			payload.isClaimFormRecv = this.claimEntryForm.controls.receivedClaimFrom.value;
			payload.isClaimUnderInv = this.claimEntryForm.controls.claimIUnderInvestigation.value;
			payload.isDoiResponsible = this.claimEntryForm.controls.doiResponsibility.value;
			payload.isSurveyRepRecv = this.claimEntryForm.controls.surveyorReportReceived.value;
			payload.isTpClaimRecv = this.claimEntryForm.controls.thirdPartyClaimReceived.value;
			payload.leaderAddress = this.claimEntryForm.controls.address.value;
			payload.leaderClaimAmt = this.dataSource.data[1].claimAmount;
			payload.leaderClaimId = this.claimEntryForm.controls.claimId.value;
			payload.leaderEmail = this.claimEntryForm.controls.emailId.value;
			//payload.leaderId = this.claimEntryForm.controls.premiumAmount.value;
			payload.leaderName = this.claimEntryForm.controls.name.value;
			payload.leaderPaidPerc = this.dataSource.data[1].percentage;
			payload.leaderPhone = this.claimEntryForm.controls.phoneNo.value;
			payload.leaderPolicyNo = this.claimEntryForm.controls.leaderPolicyNo.value;
			payload.leaderSurveyAmt = this.dataSource.data[1].surveyorAmount;
			payload.leaderTotAmt = this.calculateTotalAmount();
			payload.netClaimAmt = this.claimEntryForm.controls.claimAmountToBePaid.value;
			payload.policyEndDt = this.dateFormatter(this.claimEntryForm.controls.policyEndDate.value,'yyyy-MM-dd');	
			payload.policyStartDt = this.dateFormatter(this.claimEntryForm.controls.policyStartDate.value,'yyyy-MM-dd');	
			payload.policyTypeId = this.claimEntryForm.controls.policyType.value;
			payload.premPaidChallanDt = this.dateFormatter(this.claimEntryForm.controls.premiumPaidChallanDate.value,'yyyy-MM-dd');	
			payload.premiumAmt = this.claimEntryForm.controls.premiumAmount.value;
			payload.premiumShareAmt = this.premiumShareValue;
			payload.railReceiptDt = this.dateFormatter(this.claimEntryForm.controls.railwayTrackReceiptDate.value,'yyyy-MM-dd');	
			payload.railReceiptNo = this.claimEntryForm.controls.railwayTrackReceiptNo.value;
			payload.receivedAmt = this.claimEntryForm.controls.amountReceived.value;
			//payload.referenceDt = this.dateFormatter(this.claimEntryForm.controls.endorsementDate.value,'yyyy-MM-dd');	
			payload.referenceNo = this.claimEntryForm.controls.refNo.value;
			payload.remarks = this.claimEntryForm.controls.remarks.value;
			payload.riskLocation = this.claimEntryForm.controls.riskLocation.value;
			payload.sumInsuredAmt = this.claimEntryForm.controls.sumInsured.value;
			payload.surveyRepPageNo = this.claimEntryForm.controls.surveyorReportReceivedPageNo.value;
			payload.totClaimAmt = this.calculateClaimAmount();
			payload.totSurveyAmt = this.calculateSurveyorAmount();
			payload.doiCoinsClaimRiDtl = [];
			
			this.dataSourceReInsurer.data.forEach((element, index) => {
				let temp:any = {};
				temp['riClaimDtlId'] = index;
				temp['coinsRiName'] = element.particulars1;
				temp['riSharePerc'] = element.percentage1;
				temp['riClaimAmt'] = this.calculateGicClaimAmount(element,index);
				temp['riSurveyAmt'] = this.calculateGicSurveyorAmount(element,index);
				temp['riTotAmt'] = this.calculateTotalAmount1(element,index);
				payload.doiCoinsClaimRiDtl.push(temp);
			});
			
			
			
			
			
			console.log(payload)
			this.workflowService.saveDocumentsData(APIConst.DOI_COINSURANCE_CLAIM_ENTRY, payload).subscribe(
			  (data) => {
          if (data && data['result'] && data['status'] === 200) {
            this.toastr.success('Claim Entry Created Successfully');
          }
        },
			  error => {
          this.toastr.error(error);
			  }
			);
		}
	}
	
	dateFormatter(date:string, pattern: string) {
		if(date !== undefined) {
		  try {
			return this.datePipe.transform(new Date(date), pattern);
			} catch(Exception ) {
	  
			}
		}
	}

  onReset() {
    this.claimEntryForm.reset();
  }

  goToListing() {
    this.router.navigate(['./dashboard/doi/co-insurance-claim-listing']);
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
