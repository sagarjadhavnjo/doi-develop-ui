import { JpaUtilityService } from './../../../service/jpa-utility.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-claim-note',
  templateUrl: './claim-note.component.html',
  styleUrls: ['./claim-note.component.css']
})
export class ClaimNoteComponent implements OnInit {
  // Report Table Details
  reportDetails: any[] = [
    
    // { entry: 'Remarks', value: ''},
  ];

  constructor( public utilityService: JpaUtilityService) { }

  ngOnInit() {
    this.fillData();
  }

  fillData() {
    let payload = this.utilityService.getSelectedJpaApprovedData();
    if (payload) {
    this.reportDetails.push({ entry: 'Claim No.', value: payload.claimNumber});
    this.reportDetails.push({ entry: 'Policy No.', value: payload.policyNum});
    this.reportDetails.push({ entry: 'Policy Period', value: '01-04-2020 TO 31-03-2021'});
    this.reportDetails.push({ entry: 'Scheme Covered', value: payload.schemeName});
    this.reportDetails.push({ entry: 'Name of Deceased / Disabled', value: payload.personName});
    this.reportDetails.push({ entry: 'Name of Beneficiary /Applicant', value: payload.fatherHusbName});
    this.reportDetails.push({ entry: 'Date of Accident', value: payload.accidentDt.split(' ')[0]});
    this.reportDetails.push({ entry: 'Date of Death / Disablement', value: payload.deathDisableDt.split(' ')[0] });
    this.reportDetails.push({ entry: 'Claim Type (Death /Disablement)', value: 'DEATH'});
    this.reportDetails.push({ entry: 'Claim Amount', value: payload.claimAmount});
    this.reportDetails.push({ entry: 'Cause of Accident', value: 'VEHICLE ACCIDENT'});
    this.reportDetails.push({ entry: 'District Nodal Officer', value: payload.nodalOfficerName});
    this.reportDetails.push({ entry: 'Recommendation For Claim', value: 'GENERATE QUERY'});
  }
}

}
