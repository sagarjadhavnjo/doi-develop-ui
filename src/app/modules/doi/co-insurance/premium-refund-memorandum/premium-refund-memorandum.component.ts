import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-premium-refund-memorandum',
  templateUrl: './premium-refund-memorandum.component.html',
  styleUrls: ['./premium-refund-memorandum.component.css']
})
export class PremiumRefundMemorandumComponent implements OnInit {

  date = new Date('12/03/2015');
  reportDetails = [
    {
      policyNo: 'POLICY NO.',
      insured: 'Claim no',
      refundAmount: 'Name of Insured',
    },
    {
      policyNo: '221500/11/14/08/0000001',
      insured: 'M/S GFSC',
      refundAmount: '286340',
    },
    {
      policyNo: 'TOTAL',
      insured: ' ',
      refundAmount: '286340',
    }
  ];
  constructor() { }

  ngOnInit() {
  }

}
