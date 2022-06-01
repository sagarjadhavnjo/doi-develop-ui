import { Component, OnInit } from '@angular/core';
import { JpaUtilityService } from './../../../service/jpa-utility.service';

@Component({
  selector: 'app-memorandum',
  templateUrl: './memorandum.component.html',
  styleUrls: ['./memorandum.component.css']
})
export class MemorandumComponent implements OnInit {
  // Report table details
  reportDetails: any[] = [];
  policyNumber: string;
  personName: string;
  claimNumber: string;
  claimAmount: string;
  generatedDate: string;

  constructor(public utilityService: JpaUtilityService) { }

  ngOnInit() {
    this.fillData();
  }

  fillData() {
    let payload = this.utilityService.getSelectedJpaApprovedData();
    if (payload) {
    this.reportDetails.push({ entry: 'Applicant/Account Holders Name', value: payload.personName});
    this.reportDetails.push({ entry: 'Account Number', value: payload.policyNum});
    this.reportDetails.push({ entry: 'Bank Name', value: payload.appBankName});
    this.reportDetails.push({ entry: 'Bank Branch', value: payload.appBranchId});
    this.reportDetails.push({ entry: 'IFSC', value: payload.bankIfscCode});
  }
  this.claimNumber = payload.claimNumber;
  this.claimAmount = payload.claimAmount;
  this.personName = payload.personName;
  this.policyNumber = payload.policyNum;
  this.generatedDate = payload.createdDate.split(' ')[0];
}

}
