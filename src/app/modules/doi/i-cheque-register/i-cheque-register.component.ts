import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { doiMessage } from 'src/app/common/error-message/common-message.constants';

@Component({
  selector: 'app-i-cheque-register',
  templateUrl: './i-cheque-register.component.html',
  styleUrls: ['./i-cheque-register.component.css']
})
export class IChequeRegisterComponent implements OnInit {
  // Form Group
  chequeRegisterForm: FormGroup;
  // Date
  todayDate = new Date();
  // Form Control

  chequeTypeCtrl: FormControl = new FormControl();
  riskTypeCtrl: FormControl = new FormControl();
  bankCtrl: FormControl = new FormControl();
  branchNameCtrl: FormControl = new FormControl();
  // erromesage
  errorMessage = doiMessage;

  branchNameList: any[] = [
    { value: '1', viewValue: 'Ahmedabad' },
    { value: '2', viewValue: 'Dahod' },
    { value: '3', viewValue: 'Gandhinagar' },
  ];
  // Risk Type
  riskType_list: any[] = [
    {
      value: '1',
      viewValue: 'Fire'
    }
  ];

  // cheque Type 
  chequeType_list: any[] = [
    {
      value: '1',
      viewValue: '2019'
    }
  ];
  // list
  bank_list: any[] = [
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
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.chequeRegisterForm = this.fb.group({
      agentCommission: [''],
      riskType: [''],
      challanNo: ['789'],
      challanDate: [new Date('30-May-18')],
      challanAmount: [''],
      amount: [''],
      chequeDate: [''],
      chequeNumber: [''],
      chequeType: [''],
      banName: [''],
      placeDOBO: [''],
      receivedFrom: ['']
    });
  }

}
