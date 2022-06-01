import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-co-insurance-memorandum',
  templateUrl: './co-insurance-memorandum.component.html',
  styleUrls: ['./co-insurance-memorandum.component.css']
})
export class CoInsuranceMemorandumComponent implements OnInit {

  date = ' /10/2015';
  reportDetails = [
    {
      policyNo: 'Policy no.',
      claimNo: 'Claim no',
      nameOfInsured: 'Name of Insured',
      coInsAmt: 'Co-Ins Amt',
    },
    {
      policyNo: ' ',
      claimNo: ' ',
      nameOfInsured: ' ',
      coInsAmt: ' ',
    },
    {
      policyNo: ' ',
      claimNo: ' ',
      nameOfInsured: ' ',
      coInsAmt: ' ',
    }
  ];
  constructor() { }

  ngOnInit() {
  }

}
