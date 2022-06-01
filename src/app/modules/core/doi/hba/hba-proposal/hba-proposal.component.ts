
import { Component, OnInit, ElementRef } from '@angular/core';
import { hbaMessage } from 'src/app/common/error-message/common-message.constants';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { DoiDirectives } from 'src/app/models/doi/doi';
import { ListValue } from 'src/app/models/common-grant';
import { MatDialog } from '@angular/material/dialog';
import { APIConst } from 'src/app/shared/constants/doi/doi-api.constants';
import { DoiService } from '../../service/doi.service';


@Component({
  selector: 'app-hba-proposal',
  templateUrl: './hba-proposal.component.html',
  styleUrls: ['./hba-proposal.component.css']
})
export class HbaProposalComponent implements OnInit {
// Form Group
hbaProposalEntry: FormGroup;
// DAte
todayDate = Date.now();
maxDate = new Date();
errorMessage: any;
// List
districtList: ListValue[] = [];
  // { value: '00', viewValue: 'Ahmedabad' },
  // { value: '01', viewValue: 'Amreli' },
  // { value: '02', viewValue: 'Anand' },
  // { value: '03', viewValue: 'Aravalli' },
  // { value: '04', viewValue: 'Banaskantha' },
  // { value: '05', viewValue: 'Bharuch' },
  // { value: '06', viewValue: 'Bhavnagar' },
// ];
loanTakenFromDPPFList: any[] = [];
  // { value: '1', viewValue: 'Yes' },
  // { value: '2', viewValue: 'No' },
// ]
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
talukaNameList: any[];
villageList: ListValue[] = [];
//   {
//   value: '1', viewValue: 'Sanand '
// },
// { value: '2', viewValue: 'Dholka ' },
// { value: '3', viewValue: 'Bavala ' },
// { value: '4', viewValue: 'Detroj' },
// ];
aocupation_list: ListValue[] = [];
//   { value: '1', viewValue: 'Supporting Document' },
//   { value: '2', viewValue: 'Sanction Order' },
//   { value: '3', viewValue: 'Others' },
// ];
auditor_list: ListValue[] = [];
//   { value: '1', viewValue: 'Residence' },
//   { value: '2', viewValue: 'Commercial' },
// ];
construction_list: ListValue[] = [];
//   { value: '1', viewValue: 'Wall: Bricks' },
//   { value: '2', viewValue: 'Cement' },
//   { value: '3', viewValue: 'Glebe house' },
// ];
paymentMode_list: ListValue[] = [];
//   { value: '1', viewValue: 'Cheque' },
//   { value: '2', viewValue: 'Demand Draft' },
//   { value: '3', viewValue: 'Treasury' },
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
typeofbuildingUse_List: ListValue[] = [];
//   { value: '1', viewValue: 'Residence' },
//   { value: '2', viewValue: 'Commercial' },
// ];
wall_List: ListValue[] = [];
//   { value: '1', viewValue: 'Brick ' },
//   { value: '2', viewValue: 'cement ' },
//   { value: '3', viewValue: 'clay masonry ' },
// ];
Cellinf_List: ListValue[] = [];
//   { value: '1', viewValue: 'RCC ' },
//   { value: '2', viewValue: 'Naliya' },
//   { value: '3', viewValue: 'Patra' },
// ];
terrorism_list: ListValue[] = [];
//   { value: '1', viewValue: 'Yes ' },
//   { value: '2', viewValue: 'No' },
// ];
eQuake_list: ListValue[] = [];
//   { value: '1', viewValue: 'Yes ' },
//   { value: '2', viewValue: 'No' },
// ];

attachmentTypeCode: any[] = [];
//   { value: '01', viewValue: 'Supporting Document' },
//   { value: '02', viewValue: 'Sanction Order' },
//   { value: '03', viewValue: 'Others' },
//   // { type: 'view' }
// ];


treasuryName_list: ListValue[] = [];
//   { value: '1', viewValue: 'District Treasury Office, Gandhinagar' }
// ];
// control

districtCtrl: FormControl = new FormControl();
talukaCtrl: FormControl = new FormControl();
villageCtrl: FormControl = new FormControl();
ocupationtrl: FormControl = new FormControl();
constructiontrl: FormControl = new FormControl();
bankCtrl: FormControl = new FormControl();
loanTakenFromDPPFCtrl: FormControl = new FormControl();
paymentModetrl: FormControl = new FormControl();
bankbranchCtrl: FormControl = new FormControl();
typeofbuildingUseCtrl: FormControl = new FormControl();
wallCtrl: FormControl = new FormControl();
cellinfCtrl: FormControl = new FormControl();
terrorismCtrl: FormControl = new FormControl();
eQuakeCtrl: FormControl = new FormControl();
treasuryNameCtrl: FormControl = new FormControl();
fileBrowseIndex: any;
amountProposedData: any;
isTokentable = false;
isTokentableOPEN = false;
directiveObject = new DoiDirectives(this.router, this.dialog);

constructor(private router: Router, private el: ElementRef,  private workflowService: DoiService,
  public dialog: MatDialog, private fb: FormBuilder, private toastr: ToastrService,) { }

ngOnInit() {
  this.errorMessage = hbaMessage;

  this.hbaProposalEntry = this.fb.group({
    employeNo: [''],
    employeeName: [''],
    loanTakenFromDPPF: [''],
    employeeDesignation: [''],
    empAdd: [''],
    employeeDept: [''],
    empDepAdd: [''],
    homeInsured: [''],
    surInsured: [''],
    plotInsured: [''],
    add: [''],
    pincode: [''],
    ocupation: [''],
    construction: [''],
    insurance: [''],
    loan: [''],
    term: [''],
    loanAmount: [''],
    insuranceDeclare: [''],
    paymentMode: [''],
    dateCheque: [''],
    banName: [''],
    challanNo: [''],
    challanDate: [''],
    challaAmount: [''],
    receiptDate: [''],
    receiptNo: [''],
    bankBranch: [''],
    ddZNo: [''],
    sumInsured: [''],
    district: [''],
    taluka: [''],
    village: [''],
    adharNo: [''],
    mobileNo: [''],
    emailId: [''],
    typeofbuildingUse: [''],
    wall: [''],
    cellinf: [''],
    rate: [''],
    discpPerc: [''],
    loadCha: [''],
    loadAmt: [''],
    totAddPre: [''],
    totPre: [''],
    gstPerc: [''],
    payPre: [''],
    discAmt: [''],
    gstAmt: [''],
    treasuryName: [''],


    terrorism: [''],
    sumInsuredTerror: [''],
    termTerror: [''],
    rateTerror: [''],
    insuranceTerror: [''],

    eQuake: [''],
    sumInsuredeQuake: [''],
    termeQuake: [''],
    rateeQuake: [''],
    insuranceeQuake: [''],

    other: [''],
    sumInsuredOther: [''],
    termeOther: [''],
    rateOther: [''],
    insuranceOther: [''],
  });

this.getTerrorismList();
this.getLoanTakenFromDPPFList();
this.getCellinfList();
this.getWallList();
this.getePaymentModeList();
this.geteQuakeList();
this.gettypeofbuildingUseList();
}

openFileSelector(index) {
  this.el.nativeElement.querySelector('#fileBrowse').click();
  this.fileBrowseIndex = index;
}

onBrowseSelectChange() { }

// select taluka on basis of district
selectDistrict() {
  const district = this.hbaProposalEntry.value.district;
  if (district !== '' && district != null) {
    this.talukaNameList = this.taluka_list.filter(
      searchBy => searchBy.district.toLowerCase() === district.toLowerCase());
  }
  const districtadd = this.hbaProposalEntry.value.districtadd;

}
// On selection
ontoken(index) {
  if (index.value === '3') {
    this.isTokentable = true;
    this.hbaProposalEntry.patchValue({
      challanNo: '1856',
      challanDate: new Date('07/18/2020'),
      challaAmount: '10000.00'
    });
  } else {
    this.isTokentable = false;
  }
  if (index.value === '2' || index.value === '1') {
    this.isTokentableOPEN = true;
    this.hbaProposalEntry.patchValue({
      receiptNo: '11246254',
      receiptDate: new Date('07/17/2020'),
    });

  } else {
    this.isTokentableOPEN = false;
  }
}

search(index) {
  if (index.value === '1') {

    this.hbaProposalEntry.patchValue({
      loan: '78951236582',
      loanAmount: '125035',
      employeNo: '4512953',
      employeeName: ' R. G . PATEL',
      Designation: '',
      employeeDept: 'Finance Department',
      empAdd: 'Gandhinagar',
      empDepAdd: 'Gandhinagar Gujarat',
      homeInsured: 'D-405',
      surInsured: '785625',
      district: '1',
      taluka: '1',
      village: '1',
      pincode: '785213',
      adharNo: '4152 4052 1351 7856',
      mobileNo: '7845123265',
      typeofbuildingUse: '1',
      wall: '1',
      cellinf: '1',
      bankBranch: '1',
      banName: '1',
      sumInsured: '4512',
      insurance: '565555',
      paymentMode: '1',
      receiptNo: '11246254',
      receiptDate: new Date('07/17/2020'),
      dateCheque: new Date('07/17/2020'),

      ddZNo: '54',
      challanNo: '451236',

      challaAmount: '451236',
      challanDate: new Date('07/17/2020'),
    });

  } else {

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
  this.hbaProposalEntry.controls.insuranceTerror.setValue(((this.hbaProposalEntry.controls.sumInsuredTerror.value) *
    (this.hbaProposalEntry.controls.termTerror.value) * (this.hbaProposalEntry.controls.rateTerror.value) / 1000).toFixed(2));

  // Set Insurance Premium Earthquake
  this.hbaProposalEntry.controls.insuranceeQuake.setValue(((this.hbaProposalEntry.controls.sumInsuredeQuake.value) *
    (this.hbaProposalEntry.controls.termeQuake.value) * (this.hbaProposalEntry.controls.rateeQuake.value) / 1000).toFixed(2));

  // Set Insurance Premium Other
  this.hbaProposalEntry.controls.insuranceOther.setValue(((this.hbaProposalEntry.controls.sumInsuredOther.value) *
    (this.hbaProposalEntry.controls.termeOther.value) * (this.hbaProposalEntry.controls.rateOther.value) / 1000).toFixed(2));

  // Set Insurance Premium
  this.hbaProposalEntry.controls.insurance.setValue(((this.hbaProposalEntry.controls.sumInsured.value) *
    (this.hbaProposalEntry.controls.term.value) * (this.hbaProposalEntry.controls.rate.value) / 1000).toFixed(2));

  // Set Discount Amount
  this.hbaProposalEntry.controls.discAmt.setValue((Number(this.hbaProposalEntry.controls.insurance.value *
    this.hbaProposalEntry.controls.discpPerc.value) / 100).toFixed(2));

  // Set Total Add-on Premium
  this.hbaProposalEntry.controls.totAddPre.setValue((Number(this.hbaProposalEntry.controls.insuranceTerror.value) +
    Number(this.hbaProposalEntry.controls.insuranceeQuake.value) +
    Number(this.hbaProposalEntry.controls.insuranceOther.value)).toFixed(2));

  // Set Total Premium
  this.hbaProposalEntry.controls.totPre.setValue((Number(this.hbaProposalEntry.controls.insurance.value) -
    Number(this.hbaProposalEntry.controls.discAmt.value) + Number(this.hbaProposalEntry.controls.loadAmt.value)
    + Number(this.hbaProposalEntry.controls.totAddPre.value)).toFixed(2));

  // Set GST Amount
  this.hbaProposalEntry.controls.gstAmt.setValue(((Number(this.hbaProposalEntry.controls.gstPerc.value) *
    Number(this.hbaProposalEntry.controls.totPre.value)) / 100).toFixed(2));

  // Set Payable Premium
  this.hbaProposalEntry.controls.payPre.setValue((Number(this.hbaProposalEntry.controls.totPre.value) +
    Number(this.hbaProposalEntry.controls.gstAmt.value)).toFixed(2));

}

getLoanTakenFromDPPFList() {
  const params = {
    "name":"HBA_PROP_LOAN_TAKEN_FROM_DPPF"
  };
  this.workflowService.getDataPost(params, APIConst.COMMON_DROPDOWN_WITH_NAME).subscribe(
    (resp: any) => {
      if (resp && resp.result && resp.status === 200) {
        resp.result.forEach(element => {
          let data = new ListValue();
          data.value = element.id;
          data.viewValue = element.name;
          this.loanTakenFromDPPFList.push(data);
        });
      }
    },
    err => {

    }
  );
}  

getWallList() {
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
          this.wall_List.push(data);
        });
      }
    },
    err => {

    }
  );
}

gettypeofbuildingUseList() {
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
          this.typeofbuildingUse_List.push(data);
        });
      }
    },
    err => {

    }
  );
}

getCellinfList() {
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
          this.Cellinf_List.push(data);
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

geteQuakeList() {
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

getePaymentModeList() {
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
