import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { doiMessage } from 'src/app/common/error-message/common-message.constants';
import { CiPremiumRegister } from 'src/app/models/doi/doiModel';
import { DatePipe } from '@angular/common';
import { DoiService } from '../service/doi.service';
import { APIConst } from 'src/app/shared/constants/doi/doi-api.constants';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-premium-register',
  templateUrl: './premium-register.component.html',
  styleUrls: ['./premium-register.component.css']
})
export class PremiumRegisterComponent implements OnInit {
  totalAmount: number;
  // Date
  todayDate = new Date();
  // Form Group
  premiumRegisterForm: FormGroup;
  // Form Control
  ploicyTypeCtrl: FormControl = new FormControl();
  insuranceCompanyNameCtrl: FormControl = new FormControl();
  insuranceCompanylocationCtrl: FormControl = new FormControl();
  insuranceCompanyOfficeBranchcodeCtrl: FormControl = new FormControl();
  riskTypeCtrl: FormControl = new FormControl();
  monthCtrl: FormControl = new FormControl();
  yearCtrl: FormControl = new FormControl();
  // erromesage
  errorMessage = doiMessage;

  // List
  ploicyType_list: any[] = [
    {
      value: '1',
      viewValue: 'New Policy'
    },
    {
      value: '2',
      viewValue: 'Endorsement'
    },

  ];
  // Insurance Company Name List
  insuranceCompanyName_list: any[] = [];
  // Insurance Company Location List

  // Insurance Company Location List
  insuranceCompanylocationCtrl_list: any[] = [];
  // insuranceCompanyOfficeBranchcode
  insuranceCompanyOfficeBranchcode_list: any[] = [];
  // Risk Type
  riskType_list: any[] = [];
  
  isTokentable: boolean = false;
  isTokenEtable: boolean = false;
  constructor(private fb: FormBuilder, private workflowService: DoiService, private datePipe: DatePipe, private toastr: ToastrService) { }

  ngOnInit() {
    this.getInsuranceCompanyNameList();
	  this.getinsuranceCompanyLocationList();
	  this.getInsuranceCompanyOfficeBranchcodeList();
	  this.getRiskTypeList();
    this.premiumRegisterForm = this.fb.group({
      ploicyType: [''],
      insuranceCompanyName: [''],
      insuranceCompanylocation: [''],
      insuranceCompanyOfficeBranchcode: [''],
      riskType: [''],
      premiumReceiveStartOfDate: [''],
      premiumReceiveEndOfDate: [''],
      policyNo: [''],
      endorsementNo: [''],
      nameoftheInsured: [''],
      riskLocation: [''],
      startDateofInsurance: [''],
      endDateofInsurance: [''],
      grossSumInsured: [''],
      grossPremium: [''],
      terrorismsPremium: [''],
      totalPremium: [''],
      gIFPremiumAmount: [''],
      gIFPremiumpercentage: [''],
      GIFTerrorismPremiumAmount: [''],
      GIFTerrorismPremiumPercentage: [''],
      totalGIFPremium: [''],
      challanNo: [''],
      challanDate: [''],
      challanAmount: [''],
      agencyCommissionAmount: [''],
      excessPremium: [''],
      shortPremium: [''],
      remarks: [''],
      CoInsurerPremiumpercentage: [''],
      CoInsurerPremiumShare: [''],
      GICsharepercentage: [''],
      GICshareamount: [''],
      reinsurancePremiumpercentage: [''],
      reinsurancePremiumAmount: [''],
      netGIFshare: [''],

    });
  }

  private getInsuranceCompanyNameList() {
    let passData: any = {name:APIConst.DOI_RE_INC_COMP_NAME}
    this.workflowService.getData(passData,APIConst.DOI_GET_DROPDOWN_DATA).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          this.insuranceCompanyName_list = resp.result;
          
        }
      }
    );
    
  }
  private getinsuranceCompanyLocationList() {
    let passData: any = {name:APIConst.DOI_RE_INC_COMP_LOCATION}
    this.workflowService.getData(passData,APIConst.DOI_GET_DROPDOWN_DATA).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          this.insuranceCompanylocationCtrl_list = resp.result;
          
        }
      }
    );
    
  }
  private getInsuranceCompanyOfficeBranchcodeList() {
    let passData: any = {name:APIConst.DOI_REINSU_PRI_REGI_INSU_COM_OFF_BRANCH_CODE}
    this.workflowService.getData(passData,APIConst.DOI_GET_DROPDOWN_DATA).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          this.insuranceCompanyOfficeBranchcode_list = resp.result;
          
        }
      }
    );
    
  }
  private getRiskTypeList() {
    let passData: any = {name:APIConst.DOI_REINS_PRI_REG_RISK_TYPE}
    this.workflowService.getData(passData,APIConst.DOI_GET_DROPDOWN_DATA).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          this.riskType_list = resp.result;
          
        }
      }
    );
    
  }

  ontoken(index) {
    // isTokenEtable
    if (index.value === '1') {
      this.isTokentable = true;
    } else {
      this.isTokentable = false;
    }
    if (index.value === '2') {
      this.isTokenEtable = true;
    } else {
      this.isTokenEtable = false;
    }
  }

  // calculate total fund amount
  calculateTotalFundAvailable() {
    let amount = 0;
    amount = (Number(this.premiumRegisterForm.value.terrorismsPremium) + Number(this.premiumRegisterForm.value.grossPremium));
    this.premiumRegisterForm.patchValue({"totalPremium":amount});
    return amount;
  }

  percentageTotalFundAvailable() {
    let per = 0;
    per = (Number(this.premiumRegisterForm.value.grossPremium) / 100) * (Number(this.premiumRegisterForm.value.gIFPremiumpercentage));
    this.premiumRegisterForm.patchValue({"gIFPremiumAmount":per});
    return per;
  }
  percentageTotalFundAvailablePremium() {
    let per = 0;
    per = (Number(this.premiumRegisterForm.value.terrorismsPremium) / 100) * (Number(this.premiumRegisterForm.value.GIFTerrorismPremiumPercentage));
    this.premiumRegisterForm.patchValue({"GIFTerrorismPremiumAmount":per});
    return per;
  }
  totalPremium() {
    let amount = 0;
    amount = (this.percentageTotalFundAvailable() + this.percentageTotalFundAvailablePremium());
    this.premiumRegisterForm.patchValue({"totalGIFPremium":amount});
    return amount;
  }
  totalCoInsurerPremiumShare() {
    let per = 0;
    per = (this.calculateTotalFundAvailable() / 100) * (Number(this.premiumRegisterForm.value.CoInsurerPremiumpercentage));
    this.premiumRegisterForm.patchValue({"CoInsurerPremiumShare":per});
    return per;
  }
  totalGICshareamount() {
    let per = 0;
    per = (this.totalPremium() / 100) * (Number(this.premiumRegisterForm.value.GICsharepercentage));
    this.premiumRegisterForm.patchValue({"GICshareamount":per});
    return per;
  }
  totalreinsurancePremiumAmount() {
    let per = 0;
    per = (this.totalPremium() / 100) * (Number(this.premiumRegisterForm.value.reinsurancePremiumpercentage));
    this.premiumRegisterForm.patchValue({"reinsurancePremiumAmount":per});
    return per;
  }
  netGIFshare() {
    let per = 0;
    per = (this.totalPremium() - this.totalGICshareamount() - this.totalreinsurancePremiumAmount());
    this.premiumRegisterForm.patchValue({"netGIFshare":per});
    return per;
  }

  saveData() {
    if(this.premiumRegisterForm.valid){
      let payload: CiPremiumRegister = new CiPremiumRegister();
      payload.policyTypeId = this.premiumRegisterForm.controls.ploicyType.value;
      payload.riskTypeId = this.premiumRegisterForm.controls.riskType.value;
      payload.challanNo = this.premiumRegisterForm.controls.challanNo.value;
      payload.premRecvStartDt = this.dateFormatter(this.premiumRegisterForm.controls.premiumReceiveStartOfDate.value,'yyyy-MM-dd');
      payload.premRecvEndDt = this.dateFormatter(this.premiumRegisterForm.controls.premiumReceiveEndOfDate.value,'yyyy-MM-dd');
      payload.challanAmount = this.premiumRegisterForm.controls.challanAmount.value;
      payload.insurCompId = this.premiumRegisterForm.controls.insuranceCompanyName.value;
      payload.insuranceStartDt = this.dateFormatter(this.premiumRegisterForm.controls.startDateofInsurance.value,'yyyy-MM-dd');
      payload.insuranceEndDt = this.dateFormatter(this.premiumRegisterForm.controls.endDateofInsurance.value,'yyyy-MM-dd');
      payload.insurCompLocId = this.premiumRegisterForm.controls.insuranceCompanylocation.value;
      payload.insurCompOffcId = this.premiumRegisterForm.controls.insuranceCompanyOfficeBranchcode.value;
      payload.policyNo = this.premiumRegisterForm.controls.policyNo.value;
      payload.endorsementNo = this.premiumRegisterForm.controls.endorsementNo.value;
      payload.insuredName = this.premiumRegisterForm.controls.nameoftheInsured.value;
      payload.riskLocation = this.premiumRegisterForm.controls.riskLocation.value;
      payload.grossSiAmt = this.premiumRegisterForm.controls.grossSumInsured.value;
      payload.prem100pcAmt = this.premiumRegisterForm.controls.grossPremium.value;
      payload.terrorPremAmt = this.premiumRegisterForm.controls.terrorismsPremium.value;
      payload.totPremAmt = this.premiumRegisterForm.controls.totalPremium.value;
      payload.gifPremAmt = this.premiumRegisterForm.controls.gIFPremiumAmount.value;
      payload.gifPremPc = this.premiumRegisterForm.controls.gIFPremiumpercentage.value;
      payload.gifTerrorPoolAmt = this.premiumRegisterForm.controls.GIFTerrorismPremiumAmount.value;
      payload.gifTerrorPremPc = this.premiumRegisterForm.controls.GIFTerrorismPremiumPercentage.value;
      payload.totGifPremium = this.premiumRegisterForm.controls.totalGIFPremium.value;
      payload.challanNo = this.premiumRegisterForm.controls.challanNo.value;
      payload.challanDt = this.dateFormatter(this.premiumRegisterForm.controls.challanDate.value,'yyyy-MM-dd');
      payload.challanAmount = this.premiumRegisterForm.controls.challanAmount.value;
      payload.agencyCommAmt = this.premiumRegisterForm.controls.agencyCommissionAmount.value;
      payload.excessPremAmt = this.premiumRegisterForm.controls.excessPremium.value;
      payload.shortPremAmt = this.premiumRegisterForm.controls.shortPremium.value;
      payload.remarks = this.premiumRegisterForm.controls.remarks.value;
      payload.coinsSharePremPc = this.premiumRegisterForm.controls.CoInsurerPremiumpercentage.value;
      payload.coinsSharePrem = this.premiumRegisterForm.controls.CoInsurerPremiumShare.value;
      payload.cessionToGicPc = this.premiumRegisterForm.controls.GICsharepercentage.value;
      payload.cessionToGicAmt = this.premiumRegisterForm.controls.GICshareamount.value;
      payload.facRiPremPc = this.premiumRegisterForm.controls.reinsurancePremiumpercentage.value;
      payload.facRiPremAmt = this.premiumRegisterForm.controls.reinsurancePremiumAmount.value;
      payload.netGifShare = this.premiumRegisterForm.controls.netGIFshare.value;
      console.log(payload)
      this.workflowService.saveDocumentsData(APIConst.DOI_COINSURANCE_PREMIUM_REGISTER, payload).subscribe(
        (data) => {
          if (data && data['result'] && data['status'] === 200) {
            this.toastr.success('Premium Register Successfully');
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
}





