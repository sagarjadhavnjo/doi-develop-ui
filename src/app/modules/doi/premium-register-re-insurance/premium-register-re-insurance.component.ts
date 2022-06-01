import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { doiMessage } from 'src/app/common/error-message/common-message.constants';

@Component({
  selector: 'app-premium-register-re-insurance',
  templateUrl: './premium-register-re-insurance.component.html',
  styleUrls: ['./premium-register-re-insurance.component.css']
})
export class PremiumRegisterReInsuranceComponent implements OnInit {
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
  insuranceCompanyName_list: any[] = [
    {
      value: '1',
      viewValue: 'Oriental Insurance Co. Ltd.'
    }
  ];
  // Insurance Company Location List

  // Insurance Company Location List
  insuranceCompanylocationCtrl_list: any[] = [
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
  // insuranceCompanyOfficeBranchcode
  insuranceCompanyOfficeBranchcode_list: any[] = [
    {
      value: '1',
      viewValue: 'B1020103'
    }
  ];
  // Risk Type
  riskType_list: any[] = [
    {
      value: '1',
      viewValue: 'Fire'
    },
    {
      value: '2',
      viewValue: 'Fire Stand alone Terrorism'
    },
    {
      value: '3',
      viewValue: ' Marrine Cargo'
    },
    {
      value: 'Marrine hull machinery insurance',
      viewValue: 'Fire'
    },
    {
      value: '5',
      viewValue: 'Miscellaneous'
    }
  ];
  // MOnth
  month_list: any[] = [
    {
      value: '1',
      viewValue: 'March'
    }
  ];
  // YEar
  year_list: any[] = [
    {
      value: '1',
      viewValue: '2019'
    }
  ];
  isTokentable: boolean = false;
  isTokenEtable: boolean = false;
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
	  console.log('sfdfdsf')
    this.premiumRegisterForm = this.fb.group({
      ploicyType: [''],
      insuranceCompanyName: [''],
      insuranceCompanylocation: [''],
      insuranceCompanyOfficeBranchcode: [''],
      riskType: [''],
      premiumReceiveStartOfDate: [''],
      premiumReceiveEndOfDate: [''],
      policyNo: [''],
      endorsementNo: ['122345'],
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

  setValues() {
    if (this.premiumRegisterForm.controls.policyNo.valid) {
      this.premiumRegisterForm.controls.nameoftheInsured.setValue('GSECL');
      this.premiumRegisterForm.controls.riskLocation.setValue('Ahmedabad');
      this.premiumRegisterForm.controls.startDateofInsurance.setValue(new Date());
      this.premiumRegisterForm.controls.endDateofInsurance.setValue(new Date());
      this.premiumRegisterForm.controls.grossSumInsured.setValue(500000.00);
      this.premiumRegisterForm.controls.grossPremium.setValue(25000.00);
      this.premiumRegisterForm.controls.terrorismsPremium.setValue(100.00);
      this.premiumRegisterForm.controls.totalPremium.setValue(this.premiumRegisterForm.controls.grossPremium.value +
        this.premiumRegisterForm.controls.terrorismsPremium.value);
    }
  }

  setChallanFields() {
    this.premiumRegisterForm.controls.challanDate.setValue(new Date());
    this.premiumRegisterForm.controls.challanAmount.setValue(6275.00);
  }

  // calculate total fund amount
  calculateTotalFundAvailable() {
    let amount = 0;
    amount = (Number(this.premiumRegisterForm.value.terrorismsPremium) + Number(this.premiumRegisterForm.value.grossPremium));

    return amount;
  }

  percentageTotalFundAvailable() {
    let per = 0;
    per = (Number(this.premiumRegisterForm.value.grossPremium) / 100) * (Number(this.premiumRegisterForm.value.gIFPremiumpercentage));
    return per;
  }
  percentageTotalFundAvailablePremium() {
    let per = 0;
    per = (Number(this.premiumRegisterForm.value.terrorismsPremium) / 100) * (Number(this.premiumRegisterForm.value.GIFTerrorismPremiumPercentage));
    return per;
  }
  totalPremium() {
    let amount = 0;
    amount = (this.percentageTotalFundAvailable() + this.percentageTotalFundAvailablePremium());

    return amount;
  }
  totalCoInsurerPremiumShare() {
    let per = 0;
    per = (this.calculateTotalFundAvailable() / 100) * (Number(this.premiumRegisterForm.value.CoInsurerPremiumpercentage));
    return per;
  }
  totalGICshareamount() {
    let per = 0;
    per = (this.totalPremium() / 100) * (Number(this.premiumRegisterForm.value.GICsharepercentage));
    return per;
  }
  totalreinsurancePremiumAmount() {
    let per = 0;
    per = (this.totalPremium() / 100) * (Number(this.premiumRegisterForm.value.reinsurancePremiumpercentage));
    return per;
  }
  netGIFshare() {
    let per = 0;
    per = (this.totalPremium() - this.totalGICshareamount() - this.totalreinsurancePremiumAmount());
    return per;
  }
}





