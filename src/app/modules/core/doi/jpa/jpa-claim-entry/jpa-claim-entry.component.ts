
import { JpaUtilityService } from './../../service/jpa-utility.service';
import { DoiService } from './../../service/doi.service';
import { JpaMasterEntry, JpaMasterClaimEntryRequest } from './../../../../../models/doi/doiModel';

import { Component, ElementRef, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { jpaMessage } from 'src/app/common/error-message/common-message.constants';
import { BehaviorSubject } from 'rxjs';
import { ListValue, MasterEntry } from 'src/app/models/doi/doiModel';
import { JpaQueryDialogComponent } from '../jpa-query-dialog/jpa-query-dialog.component';
import { JpaRejectionQueryDialogComponent } from '../jpa-rejection-query-dialog/jpa-rejection-query-dialog.component';
import { DialogData } from 'src/app/models/doi/standing-charge';
import { DoiDirectives } from 'src/app/modules/core/common/directive/doi';
import { DocumentDialogComponent } from './document-dialog/document-dialog.component';
import { APIConst } from 'src/app/shared/constants/doi/doi-api.constants';
import { ToastrService } from 'ngx-toastr';

declare function SetGujarati();
@Component({
  selector: 'app-jpa-claim-entry',
  templateUrl: './jpa-claim-entry.component.html',
  styleUrls: ['./jpa-claim-entry.component.css']
})
export class JpaClaimEntryComponent implements OnInit {
  selectedindex: number;
  // Form Group
  jpaClaimEntry: FormGroup;
  // DAte
  todayDate = Date.now();
  maxDate = new Date();
  referenceNumer: string;
  policyList: any[];
  policyListDisp: ListValue[] = [];
  policyCtrl: FormControl = new FormControl();
  isPolicyDropdown: boolean = true;
  deathOrDisability: any;
  dateOfDeathOrDisability: any;

  // Form Contrl
  talukaCtrl: FormControl = new FormControl();
  bankCtrl: FormControl = new FormControl();
  bankbranchCtrl: FormControl = new FormControl();
  districtCtrl: FormControl = new FormControl();
  stateCtrl: FormControl = new FormControl();
  adisabledDiedCtrl: FormControl = new FormControl();
  aadharAvailCtrl: FormControl = new FormControl();
  availDocCtrl: FormControl = new FormControl();
  PersonDisabllityCtrl: FormControl = new FormControl();
  maritalStatusCtrl: FormControl = new FormControl();
  villageCtrl: FormControl = new FormControl();
  genderCtrl: FormControl = new FormControl();
  causeofLossCtrl: FormControl = new FormControl();
  driveVehicleCtrl: FormControl = new FormControl();
  schemeTypeCtrl: FormControl = new FormControl();
  relationPersonCtrl: FormControl = new FormControl();
  farmerCtrl: FormControl = new FormControl();
  licTypeCtrl: FormControl = new FormControl();
  // List
  schemeType_list: ListValue[] = [];
  taluka_list: any[] = [];
  taluka_listApplicant: any[] = [];
  taluka_listApplicantPer: any[] = [];
  talukaNameList: any[];
  talukaNameaddList: any[];
  talukaNamenodalList: any[];
  farmer_list: ListValue[] = [];
    // { value: '1', viewValue: 'Deceased person himself' },
//     { value: '0', viewValue: 'Self' },
// { value: '1', viewValue: 'Deceased Person Father' },
// { value: '2', viewValue: 'Deceased Person Mother' },
// { value: '3', viewValue: 'Deceased Person Wife' },
// { value: '4', viewValue: 'Deceased Person Husband' },
// { value: '5', viewValue: 'None of above' }
//   ];
  driveVehicle_List: ListValue[] = [];
  deac_list: ListValue[] = [];
  aadharAvail_list: ListValue[] = [];
  availDoc_list: ListValue[] = [];
  //   {
  //   value: '1', viewValue: 'Election Card'
  // },
  // { value: '2', viewValue: 'Death Certificate' },
  // ];

  genderList: ListValue[] = [];

  maritalStatus_list: ListValue[] = [];

  villageList: ListValue[] = [];

  villageListApplicant: ListValue[] = [];
  villageListApplicantPer: ListValue[] = [];

  causeofLoss_List: ListValue[] = [];
  relationPerson_List: ListValue[] = [];

  bank_list: ListValue[] = [];
  bankbranch_list: ListValue[] = [];
  PersonDisabllity_list: ListValue[] = [];

  districtList: ListValue[] = [];
  districtListApplicant: ListValue[] = [];
  districtListApplicantPer: ListValue[] = [];
  recomnded_list: ListValue[] = [];
  attachmentTypeCode: any[] = [];
  //   { value: '1', viewValue: 'Supporting Document' },
  //   { value: '2', viewValue: 'Sanction Order' },
  //   { value: '3', viewValue: 'Others' },
  //   // { type: 'view' }
  // ];
  attachmentObj: any[] = [];
  //   {
  //     type: 'stamp-view',
  //     attachmentType: 'Surprise Verification Report',
  //   },
  // ];
  licType_List: any[] = [];

  errorMessage;
  isTokentable: boolean = false;
  liceno: boolean = false;
  iscauseToken: boolean = false;
  schemeNo: boolean = false;



  recomndedCtrl: FormControl = new FormControl();


  constructor(private el: ElementRef, public dialog: MatDialog, private router: Router, private toastr: ToastrService,
    private fb: FormBuilder, private workflowService: DoiService, private jpaUtilityService: JpaUtilityService) { }
  directiveObject = new DoiDirectives(this.router, this.dialog);

  ngOnInit() {
    this.errorMessage = jpaMessage;
    this.getDistrictList();
    this.getBankList();
    this.getRequirementList();
    this.getGenderTypeList();
    this.getMaritalStatusList();
    this.getRelationList();
    this.getLossOfCauseList();
    this.getDeceasedPersonList();
    this.getAvailableDocLsit();
    this.getMasterSchemeListing(new MasterEntry());
    this.getDisablityList();
    this.jpaClaimEntry = this.fb.group({
      clID: [{ value: 'XXXXX', disabled: true }],
      clDate: [{ value: new Date(), disabled: true }],
      disabledDied: [''],
      PersonDisabllity: [''],
      nameOfApplicant: [''],
      adharNo: [''],
      fatherName: [''],
      motherName: [''],
      maritalStatus: [''],
      commAdd: [''],
      district: [''],
      taluka: [''],
      pincode: [''],
      village: [''],
      gender: [''],
      dateOfBirth: [''],
      dateOfAccident: [''],
      dateOfisability: [''],
      ageOnDeath: [''],
      placeofAccident: [''],
      causeofLoss: [''],
      driveVehicle: [''],
      licenseNo: [''],
      fullName: [''],
      farmer: [''],
      applicantNo: [''],
      applicantAddr: [''],
      relationPerson: [''],
      pincodeadd: [''],
      districtadd: [''],
      talukaadd: [''],
      villageadd: [''],
      banName: [''],
      bankBranch: [''],
      bankAccount: [''],
      appNameInBank: [''],
      bankIFSC: [''],
      mobileNo: [''],
      inwardDate: [''],
      inwardNo: [''],
      dateOfDisability: [''],
      claimAmount: [''],
      nodalDistrict: [''],
      nodalTaluka: [''],
      nodalOffice: [''],
      ploicyNo: [''],
      schemeType: [''],
      recomnded: [''],
      deathCertiNo: [''],
      deathCertiDate: [''],
      aadharAvail: [''],
      availDoc: [''],
      docNo: [''],
      licType: [''],
      valDateTo: [''],
      valDateFrom: [''],
      permAdd: [''],
      mobileNoAlt: [''],
      email: [''],
      nodalEmail: [''],
      districtAddPer: [''],
      talukaAddPer: [''],
      villageAddPer: [''],
      pincodeAddPer: [''],
      applicantAddPer: [''],
      isPermanentSame: false
    });
    this.referenceNumer = this.jpaUtilityService.getNewPolicyNumber();

    this.setFormData();

  }

  // on submit form control
  oncauseofLoss(index) {
    if (this.causeofLoss_List.filter(x => x.value === index.value)[0].viewValue === APIConst.VEHICLE_ACCIDENT) {
      this.iscauseToken = true;
    } else {
      this.iscauseToken = false;
      this.liceno = false;
    }
  }
  aadharAvail() {
    if (this.jpaClaimEntry.controls.aadharAvail.value === '2') {
      const dialogRef = this.dialog.open(DocumentDialogComponent, {
        width: '400px'
      });

      dialogRef.afterClosed().subscribe(result => {
      });

    }

  }

  private getLossOfCauseList() {
    this.workflowService.getDataWithoutParams(APIConst.DOI_LOSS_OF_CAUSE_DROPDOWN).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          this.causeofLoss_List = resp.result;
        }
      }
    );
  }

  private getDistrictList() {
    this.workflowService.getDataWithoutParams(APIConst.JPA_DOI_GET_DISTRICT_LIST_GUJRAT).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          this.districtList = resp.result;
          this.districtListApplicant = resp.result;
          this.districtListApplicantPer = resp.result;
          this.licType_List = resp.result;
        }
      }
    );
  }



  private geTalukaList(districtID: number) {
    this.workflowService.getRequestWithNumberPathVar(APIConst.GET_DOI_TALUKA_LIST, districtID).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          this.taluka_list = resp.result;
          this.talukaNamenodalList = resp.result;
        }
      }
    );
  }

  private geTalukaListApplicant(districtID: number) {
    this.workflowService.getRequestWithNumberPathVar(APIConst.GET_DOI_TALUKA_LIST, districtID).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          this.taluka_listApplicant = resp.result;
        }
      }
    );
  }
  private geTalukaListApplicantPer(districtID: number) {
    this.workflowService.getRequestWithNumberPathVar(APIConst.GET_DOI_TALUKA_LIST, districtID).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          this.taluka_listApplicantPer = resp.result;
        }
      }
    );
  }


  private getVillageList(talukaID: number) {
    this.workflowService.getRequestWithNumberPathVar(APIConst.GET_DOI_VILLAGE_LIST, talukaID).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          this.villageList = resp.result;
        }
      }
    );
  }

  private getVillageListApplicant(talukaID: number) {
    this.workflowService.getRequestWithNumberPathVar(APIConst.GET_DOI_VILLAGE_LIST, talukaID).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          this.villageListApplicant = resp.result;
        }
      }
    );
  }

  private getVillageListApplicantPer(talukaID: number) {
    this.workflowService.getRequestWithNumberPathVar(APIConst.GET_DOI_VILLAGE_LIST, talukaID).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          this.villageListApplicantPer = resp.result;
        }
      }
    );
  }



  private getBankList() {
    this.workflowService.getDataWithoutParams(APIConst.DOI_BANK_LIST).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          this.bank_list = resp.result;
        }
      }
    );
  }

  private getDisablityList() {
    this.workflowService.getRequestWithStringPathVar(APIConst.JPA_LOOKUP_INFO_BASED_ON_CATEGORY, APIConst.JPA_DISABILITY).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          this.PersonDisabllity_list = resp.result;
        }
      }
    );
  }

  private getRequirementList() {
    this.workflowService.getDataWithoutParams(APIConst.DOI_REQUIREMENT_LIST_DROPDOWN).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          this.driveVehicle_List = resp.result;
          this.aadharAvail_list = resp.result;
        }
      }
    );
  }


  private getGenderTypeList() {
    this.workflowService.getRequestWithStringPathVar(APIConst.JPA_LOOKUP_INFO_BASED_ON_CATEGORY, APIConst.JPA_GENDER_TYPES).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          this.genderList = resp.result;
        }
      }
    );
  }

  private getDeceasedPersonList() {
    this.workflowService.getRequestWithStringPathVar(APIConst.JPA_LOOKUP_INFO_BASED_ON_CATEGORY, APIConst.JPA_DECEASED_PERSON).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          this.deac_list = resp.result;
        }
      }
    );
  }

  private getAvailableDocLsit() {
    const params = {
      "name":"JPA Claim Entry Available Document"
    };
    this.workflowService.getDataPost(params, APIConst.COMMON_DROPDOWN_WITH_NAME).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          resp.result.forEach(element => {
            let data = new ListValue();
            data.value = element.id;
            data.viewValue = element.name;
            this.availDoc_list.push(data);
          });
        }
      },
      err => {

      }
    );
  }

  private getRelationList() {
    this.workflowService.getRequestWithStringPathVar(APIConst.JPA_LOOKUP_INFO_BASED_ON_CATEGORY, APIConst.JPA_PERSON_RELEATION).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          this.relationPerson_List = resp.result;
        }
      }
    );
  }

  private getMaritalStatusList() {
    this.workflowService.getRequestWithStringPathVar(APIConst.JPA_LOOKUP_INFO_BASED_ON_CATEGORY, APIConst.JPA_MARITAL_TYPES).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          this.maritalStatus_list = resp.result;
        }
      }
    );
  }

  onSchemeChange(value) {
    if (value) {
      this.workflowService.getRequestWithNumberPathVar(APIConst.JPA_SCHEME_MASTER_POLICY_LISTING_BY_SCHEME_ID, value).subscribe(
        (resp: any) => {
          if (resp && resp.result && resp.status === 200) {
            this.policyListDisp =[];
            resp.result.forEach(element => {
              let data = new ListValue();
              data.value = element.policyId;
              data.viewValue = element.policyNum;
              this.policyListDisp.push(data);
            });
            this.policyList = resp.result;
          }
        }
      );
    }

    this.workflowService.getRequestWithNumber(APIConst.JPA_SCHEME_MASTER_SCHEME_BY_SCHEME_ID, value).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          this.jpaClaimEntry.patchValue({
          nodalOffice : resp.result.nodalOffice
          });
        }
      });
    }
  


  onSelect(index) {
    if (index.value === '2') {
      this.isTokentable = true;
      this.dateOfDeathOrDisability = "Age On Disability";
      this.deathOrDisability = "Date of Disability";

    } else {
      this.isTokentable = false;
      this.dateOfDeathOrDisability = "Age On Death";
      this.deathOrDisability = "Date of Death";
    }
  }

  onLicon(index) {
    if (index.value === '1') {
      this.liceno = true;
    } else {
      this.liceno = false;
    }
  }
  onSelectScheme(index) {
    if (index.value === '1' || index.value === '5') {
      this.schemeNo = true;
    } else {
      this.schemeNo = false;
    }
    this.onSchemeChange(index.value);
  }
  setRegisterFarmer(index) {
    if (index.value === '1') {

      this.farmer_list = [
        { value: '0', viewValue: 'Self' },
        { value: '1', viewValue: 'Deceased Person Father' },
        { value: '2', viewValue: 'Deceased Person Mother' },
        { value: '3', viewValue: 'Deceased Person Wife' },
        { value: '4', viewValue: 'Deceased Person Husband' },
        { value: '5', viewValue: 'None of above' }
      ];
      this.jpaClaimEntry.controls.farmer.setValue('0');
    }
    else if (index.value === '5') {
      this.farmer_list = [
        { value: '0', viewValue: 'Self' },
        { value: '1', viewValue: 'Deceased Person Father' },
        { value: '2', viewValue: 'Deceased Person Mother' },
        { value: '3', viewValue: 'Deceased Person Wife' },
        { value: '4', viewValue: 'Deceased Person Husband' },
      ];
      this.jpaClaimEntry.controls.farmer.reset();
    }
    else {

      this.farmer_list = [
        { value: '0', viewValue: 'Self' },
        { value: '1', viewValue: 'Deceased Person Father' },
        { value: '2', viewValue: 'Deceased Person Mother' },
        { value: '3', viewValue: 'Deceased Person Wife' },
        { value: '4', viewValue: 'Deceased Person Husband' },
        { value: '5', viewValue: 'None of above' }
      ];
      this.jpaClaimEntry.controls.farmer.reset();
    }

  }
  onSelectrecomanded(index) {
    if (index.value === '1') {
      const dialogRef = this.dialog.open(JpaQueryDialogComponent, {
        width: '1000px',
        height: '500px'

      });
    } else {
      this.liceno = false;
    }
    if (index.value === '4') {
      const dialogRef = this.dialog.open(JpaRejectionQueryDialogComponent, {
        width: '1000px',
        height: '500px'

      });
    }

  }

  onSelectBank(index) {
    const bankId = this.jpaClaimEntry.value.banName;
    this.workflowService.getRequestWithStringPathVar(APIConst.DOI_BANK_BRANCH_LIST, bankId).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          this.bankbranch_list = resp.result;
        }
      }
    );
  }

  onSelectBranch(index) {
    const branch = this.bankbranch_list.filter(x => x.value === this.jpaClaimEntry.value.bankBranch).pop();
    this.jpaClaimEntry.patchValue({
      bankIFSC: [branch["ifscCode"]],
    });
  }

  onPolicyChange(index) {
    let amount=0; 
    if(this.jpaClaimEntry.get("disabledDied").value ===1){
      amount=this.policyList.filter(x=>x.policyNum===index.value.toString())[0].deathClaimAmt;
    }else{
      if(this.jpaClaimEntry.get("disabledDied").value ===1){
        amount=this.policyList.filter(x=>x.policyNum===index.value.toString())[0].disable50ClaimAmt;
      }else{
        amount=this.policyList.filter(x=>x.policyNum===index.value.toString())[0].disable100ClaimAmt;
      }
    }
    if (Number.isNaN(amount)) {
      amount = 0;
    }
    this.jpaClaimEntry.get("claimAmount").setValue(amount);
  }

  onClick(event) {
    if (this.jpaClaimEntry.get("isPermanentSame").value === false) {
      if (this.jpaClaimEntry.get("applicantAddr").value && this.jpaClaimEntry.get("districtadd").value
      && this.jpaClaimEntry.get("talukaadd").value && this.jpaClaimEntry.get("villageadd").value &&
      this.jpaClaimEntry.get("pincodeadd").value) {
      this.jpaClaimEntry.get("applicantAddPer").setValue(this.jpaClaimEntry.get("applicantAddr").value);
      this.jpaClaimEntry.get("districtAddPer").setValue(this.jpaClaimEntry.get("districtadd").value);
      this.geTalukaListApplicantPer(this.jpaClaimEntry.get("districtAddPer").value);
      this.jpaClaimEntry.get("talukaAddPer").setValue(this.jpaClaimEntry.get("talukaadd").value);
      this.getVillageListApplicantPer(this.jpaClaimEntry.get("talukaAddPer").value);
      this.jpaClaimEntry.get("villageAddPer").setValue(this.jpaClaimEntry.get("villageadd").value);
      this.jpaClaimEntry.get("pincodeAddPer").setValue(this.jpaClaimEntry.get("pincodeadd").value);

      this.jpaClaimEntry.get("applicantAddPer").disable();
      this.jpaClaimEntry.get("districtAddPer").disable();
      this.jpaClaimEntry.get("talukaAddPer").disable();
      this.jpaClaimEntry.get("villageAddPer").disable();
      this.jpaClaimEntry.get("pincodeAddPer").disable();
      this.jpaClaimEntry.get("isPermanentSame").setValue(true);
      }else{
        this.toastr.warning('Please fill all the fields of permanent address.');
      }
    } else {
      this.jpaClaimEntry.get("applicantAddPer").enable();
      this.jpaClaimEntry.get("districtAddPer").enable();
      this.jpaClaimEntry.get("talukaAddPer").enable();
      this.jpaClaimEntry.get("villageAddPer").enable();
      this.jpaClaimEntry.get("pincodeAddPer").enable();
      this.jpaClaimEntry.get("isPermanentSame").setValue(false);
    }
  }
  ageOnYear(event) {
    let dateOfBirth: any = new Date(this.jpaClaimEntry.get("dateOfBirth").value);
    let dateOfisability: any = new Date(this.jpaClaimEntry.get("dateOfDisability").value);
    let timeDiff: number = Math.abs(dateOfisability - dateOfBirth);
    let age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
    if (Number.isNaN(age)) {
      age = 0;
    }
    this.jpaClaimEntry.patchValue({
      ageOnDeath: age.toString(),
    });
  }
  onClickNodal(event) {
    //this.jpaClaimEntry.patchValue({
      //inwardDate: new Date('10-Jul-2019'),
      //inwardNo: ['20541'],

      //claimAmount: '100000',
      //nodalOffice: ['Ahmedabad'],
      //ploicyNo: ['4854531531'],
      this.jpaClaimEntry.get("nodalDistrict").setValue(this.jpaClaimEntry.get("districtadd").value);
      this.geTalukaList(this.jpaClaimEntry.get("nodalDistrict").value);
      this.jpaClaimEntry.get("nodalTaluka").setValue(this.jpaClaimEntry.get("talukaadd").value);
      // nodalDistrict: this.jpa,
      // nodalTaluka: '01',
      //schemeType: '2',
      //recomnded: '2'
   // });
  }

  // select taluka on basis of district

  onSubmitDetails() {
    let payload: JpaMasterClaimEntryRequest = new JpaMasterClaimEntryRequest();
    //Basic details
    payload.claimStatus = APIConst.JPA_CLAIM_PENDING_FOR_APPROVAL_APPLICATION;
    payload.personTypeId = this.jpaClaimEntry.controls.disabledDied.value;
    payload.disableTypeId = this.jpaClaimEntry.controls.PersonDisabllity.value;
    payload.isAdharAvaliable = this.jpaClaimEntry.controls.aadharAvail.value;
    payload.personName = this.jpaClaimEntry.controls.nameOfApplicant.value;
    payload.aadharNum = this.jpaClaimEntry.controls.adharNo.value;
    payload.fatherHusbName = this.jpaClaimEntry.controls.fatherName.value;
    payload.motherWifeName = this.jpaClaimEntry.controls.motherName.value;
    payload.maritalTypeId = this.jpaClaimEntry.controls.maritalStatus.value;
    //address details   
    payload.districtId = this.jpaClaimEntry.controls.district.value;
    payload.talukaId = this.jpaClaimEntry.controls.taluka.value;
    payload.villageId = this.jpaClaimEntry.controls.village.value;
    payload.genderId = this.jpaClaimEntry.controls.gender.value;
    //age and birth details 
    payload.dobDt = (this.jpaClaimEntry.controls.dateOfBirth.value).toJSON();//.replace('T', ' ').replace('.', ' ').replace('Z', '');
    payload.accidentDt = (this.jpaClaimEntry.controls.dateOfAccident.value).toJSON();//.replace('T', ' ').replace('.', ' ').replace('Z', '');
    payload.deathDisableDt = (this.jpaClaimEntry.controls.dateOfDisability.value).toJSON();//.replace('T', ' ').replace('.', ' ').replace('Z', '');
    payload.ageOnDeath = this.jpaClaimEntry.controls.ageOnDeath.value;
    payload.accidentPlace = this.jpaClaimEntry.controls.placeofAccident.value;
    if (this.jpaClaimEntry.controls.disabledDied.value == '1') {
      payload.deathCertificateNumber = this.jpaClaimEntry.controls.deathCertiNo.value;
      payload.deathCertificateDate = (this.jpaClaimEntry.controls.deathCertiDate.value).toJSON();//.replace('T', ' ').replace('.', ' ').replace('Z', '');;
    }
    payload.lossCauseId = this.jpaClaimEntry.controls.causeofLoss.value;
    //vehicle accident fields 
   // if (this.causeofLoss_List.filter(x => x.value === payload.lossCauseId)[0].viewValue === APIConst.VEHICLE_ACCIDENT) {
      payload.driveVehicle = this.jpaClaimEntry.controls.driveVehicle.value;
      payload.licenseNo = this.jpaClaimEntry.controls.licenseNo.value;
      payload.licType = this.jpaClaimEntry.controls.licType.value;
      payload.valDateTo = this.jpaClaimEntry.controls.valDateTo.value ? this.jpaClaimEntry.controls.valDateTo.value.toJSON() : this.jpaClaimEntry.controls.valDateTo.value;
      payload.valDateFrom = this.jpaClaimEntry.controls.valDateFrom.value ? this.jpaClaimEntry.controls.valDateFrom.value.toJSON() : this.jpaClaimEntry.controls.valDateFrom.value;
    //}

    //Applicant Details 
    payload.applicantName = this.jpaClaimEntry.controls.fullName.value;
    payload.applAadharNum = this.jpaClaimEntry.controls.applicantNo.value;

    //Applicant Details communicaton 
    payload.communicateAddr = this.jpaClaimEntry.controls.applicantAddr.value;
    payload.applRelationId = this.jpaClaimEntry.controls.relationPerson.value;
    payload.appDistrictId = this.jpaClaimEntry.controls.districtadd.value;
    payload.appTalukaId = this.jpaClaimEntry.controls.talukaadd.value;
    payload.appVillageId = this.jpaClaimEntry.controls.villageadd.value;
    payload.appPincode = this.jpaClaimEntry.controls.pincodeadd.value;
    //Applicant Details permanent  
    payload.applicantAddPer = this.jpaClaimEntry.controls.applicantAddPer.value;
    payload.districtAddPer = this.jpaClaimEntry.controls.districtAddPer.value;
    payload.talukaAddPer = this.jpaClaimEntry.controls.talukaAddPer.value;
    payload.villageAddPer = this.jpaClaimEntry.controls.villageAddPer.value;
    payload.pincodeAddPer = this.jpaClaimEntry.controls.pincodeAddPer.value;
    //Applicant Details bank 
    payload.appBankId = this.jpaClaimEntry.controls.banName.value;
    payload.appBranchId = this.jpaClaimEntry.controls.bankBranch.value;
    payload.bankIfscCode = this.jpaClaimEntry.controls.bankIFSC.value ? this.jpaClaimEntry.controls.bankIFSC.value[0] : "";
    payload.appBankName = this.bankbranch_list.filter(x=>x.value===this.jpaClaimEntry.controls.bankBranch.value)[0].viewValue;
    payload.appBankAccountNo = this.jpaClaimEntry.controls.bankAccount.value;
    payload.appNameInBank= this.jpaClaimEntry.controls.appNameInBank.value;
    //Applicant Details contact 
    payload.appMobileNo = this.jpaClaimEntry.controls.mobileNo.value;
    payload.appMobileNoAlt = this.jpaClaimEntry.controls.mobileNoAlt.value;
    payload.appEmail = this.jpaClaimEntry.controls.email.value;
    //Nodel 
    payload.nodalDistrictId = this.jpaClaimEntry.controls.nodalDistrict.value;
    payload.nodalTalukaId = this.jpaClaimEntry.controls.nodalTaluka.value;
    payload.schemeId = this.jpaClaimEntry.controls.schemeType.value;
    payload.schemeName = this.schemeType_list.filter(x=>x.value===this.jpaClaimEntry.controls.schemeType.value)[0].viewValue;
    payload.nodalOfficer = this.jpaClaimEntry.controls.nodalOffice.value[0];
    payload.nodalEmailAddress = this.jpaClaimEntry.controls.nodalEmail.value;
    payload.policyNum = this.jpaClaimEntry.controls.ploicyNo.value;
    payload.claimAmount = this.jpaClaimEntry.controls.claimAmount.value;
    //payload.inwardNumber = this.jpaClaimEntry.controls.inwardNo.value;
    //payload.nodalOfficer = this.jpaClaimEntry.controls.nodalOffice.value;
    payload.nodalEmailAddress = this.jpaClaimEntry.controls.nodalEmail.value;
    payload.policyNum = this.jpaClaimEntry.controls.ploicyNo.value;
  //  payload.claimAmount = this.jpaClaimEntry.controls.claimAmount.value ? this.jpaClaimEntry.controls.claimAmount.value[0] : "";
    payload.inwardNumber = this.jpaClaimEntry.controls.inwardNo.value[0];
    payload.inwrdDate = this.jpaClaimEntry.controls.inwardDate.value ? this.jpaClaimEntry.controls.inwardDate.value.toJSON() : this.jpaClaimEntry.controls.inwardDate.value;
    payload.isNodlJtaEntry = 1;
    this.workflowService.saveDocumentsData(APIConst.JPA_CLAIM_ENTERY, payload).subscribe(
      (data : any) => {
        this.toastr.success(data.message);
        this.jpaUtilityService.isEdit = false;
        this.jpaClaimEntry.reset();
        Object.keys(this.jpaClaimEntry.controls).forEach(key => {
          this.jpaClaimEntry.get(key).setErrors(null);
        });
      },
      error => {
        this.jpaUtilityService.isEdit = false;
        this.toastr.error(error);
      }
    )
  }

  selectDistrict() {
    const district = this.jpaClaimEntry.value.district;
    this.geTalukaList(district);
  }

  selectDistrictApplicant() {
    const district = this.jpaClaimEntry.value.districtadd;
    this.geTalukaListApplicant(district);
  }

  selectDistrictApplicantPer() {
    const district = this.jpaClaimEntry.value.districtAddPer;
    this.geTalukaListApplicantPer(district);
  }


  public selectTaluka() {
    const taluka = this.jpaClaimEntry.value.taluka;
    this.getVillageList(taluka);
  }

  public selectTalukaApplicant() {
    const taluka = this.jpaClaimEntry.value.talukaadd;
    this.getVillageListApplicant(taluka);
  }

  public selectTalukaApplicantPer() {
    const taluka = this.jpaClaimEntry.value.talukaAddPer;
    this.getVillageListApplicantPer(taluka);
  }


  // Navigation Route
  navigate() {
    this.jpaUtilityService.isEdit = false;
    this.router.navigate(['./dashboard/doi/jpa/jpa-pending-approval-listing']);
  }
  onFileSelection(event) { }
  gotoListing() { }
  goToDashboard() { }

  reset() {
    this.jpaUtilityService.isEdit = false;
  }

  close() {
    this.jpaUtilityService.isEdit = false;
  }

  displayDetails() {
    this.jpaClaimEntry.patchValue({
      fullName: ['J K Mehta'],
      farmer: '1',
      applicantNo: ['5263'],
      applicantADD: ['Gandhinagar'],
      relationPerson: '1',
      pincodeadd: ['524421'],
      districtadd: '01',
      talukaadd: '01',
      villageadd: '1',
      banName: '1',
      bankBranch: '1',
      bankAccount: ['454541531531435'],
      nameOfApp: ['M B Patel'],
      bankIFSC: ['ICIC89456'],
      mobileNo: ['4854654165'],
      inwardDate: new Date('10-Jul-2019'),
      inwardNo: ['20541'],

      claimAmount: ['100000'],
      nodalOffice: ['Ahmedabad'],
      ploicyNo: ['4854531531'],
      nodalDistrict: '00',
      nodalTaluka: '01',
      schemeType: '2',
      recomnded: '2',


      disabledDied: ['1'],
      PersonDisabllity: ['1'],
      nameOfApplicant: ['1'],
      adharNo: ['456254556441'],
      fatherName: ['Father'],
      motherName: ['Mother'],
      maritalStatus: ['1'],
      commAdd: ['address'],
      district: ['02'],
      taluka: ['2'],
      pincode: ['2'],
      village: ['2'],
      gender: ['1'],
      dateOfBirth: [new Date()],
      dateOfAccident: [new Date()],
      dateOfisability: [new Date()],
      ageOnDeath: ['2'],
      placeofAccident: ['Surat'],
      causeofLoss: ['3'],
      driveVEhicle: ['3'],
      licenseNo: ['3'],
      deathCertiNo: ['123564'],
      deathCertiDate: [new Date()],
      aadharAvail: ['1'],
      availDoc: ['1'],
      docNo: ['1'],
      licType: ['1'],
      valDateTo: [new Date()],
      valDateFrom: [new Date()],
      permAdd: ['address'],
      mobileNoAlt: ['9985645785'],
      email: ['abc@gmail.com'],
      nodalEmail: ['abc@gmail.com'],
    });

    setTimeout(() => { window.print(); }, 1000);
    setTimeout(() => { this.jpaClaimEntry.reset(); }, 2000);



  }

  openValidateDialog(event) {
    const applicantName = this.jpaClaimEntry.controls.nameOfApplicant.value;
    const aadharNo = this.jpaClaimEntry.controls.adharNo.value;
    let count = 0;

    console.log(event);
    if (event.code === 'Space') {
      count++;
      if (count == 1) {
        const dialogRef = this.dialog.open(ValidationDialogComponent, {
          width: '750px',
          height: '250px',
          data: {
            applicantName: applicantName, aadharNo: aadharNo
          }

        });

        dialogRef.afterClosed().subscribe(result => {
          console.log(result[0]);
          if (result[0].column.value.length > 1) {
            this.jpaClaimEntry.reset();
          } else {
            if (!result[0].adharName) {
              let data = applicantName + ' ';
              console.log(data);
              console.log(name);
              this.jpaClaimEntry.controls.nameOfApplicant.patchValue(data);
            } else {
              this.jpaClaimEntry.controls.nameOfApplicant.patchValue('');
            }
          }
        });
      }
    }


  }

  private getMasterSchemeListing(payload: MasterEntry) {
    this.workflowService.getDataWithoutParams(APIConst.DOI_MASTER_SCHEME_POLICY_DROPDOWN).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          resp.result.forEach(element => {
            let data = new ListValue();
            data.value = element.schemeId;
            data.viewValue = element.schemeNameEnglish;
            this.schemeType_list.push(data);
          });
        }
      }
    );
  }
  private setFormData() {
    if (this.jpaUtilityService.isEdit) {
      let payload: any = this.jpaUtilityService.getSelectedJpaApprovedData();
      this.referenceNumer = payload.claimNumber;
      this.jpaClaimEntry.patchValue({
        "disabledDied": payload.personTypeId ? payload.personTypeId.toString() : 0,
        "PersonDisabllity": payload.disableTypeId ? payload.disableTypeId.toString() : 0,
        "aadharAvail": payload.isAdharAvaliable,
        "nameOfApplicant": payload.personName,
        "adharNo": payload.aadharNum,
        "fatherName": payload.fatherHusbName,
        "motherName": payload.motherWifeName,
        "maritalStatus": payload.maritalTypeId ? payload.maritalTypeId.toString() : 0,
        "district": payload.districtId ? payload.districtId.toString() : 0,
        "taluka": payload.talukaId ? payload.talukaId.toString() : 0,
        "village": payload.villageId ? payload.villageId.toString() : 0,
        "gender": payload.genderId ? payload.genderId.toString() : 0,
        "dateOfBirth": new Date(payload.dobDt.split(' ')[0]),
        "dateOfAccident": new Date(payload.accidentDt.split(' ')[0]),
        "dateOfDisability": new Date(payload.deathDisableDt.split(' ')[0]),
        "ageOnDeath": payload.ageOnDeath,
        "placeofAccident": payload.accidentPlace,
        "causeofLoss": payload.lossCauseId ? payload.lossCauseId.toString() : 0,

        "fullName": payload.applicantName,
        "applicantNo": payload.applAadharNum,
        "applicantADD": payload.communicateAddr,
        "permAdd": payload.applicantAddr,
        "relationPerson": payload.applRelationId ? payload.applRelationId.toString() : 0,
        "districtadd": payload.appDistrictId ? payload.appDistrictId.toString() : 0,
        "talukaadd": payload.appTalukaId ? payload.appTalukaId.toString() : 0,
        "villageadd": payload.appVillageId ? payload.appVillageId.toString() : 0,
        "pincodeadd": payload.appPincode,
        "banName": payload.appBankId ? payload.appBankId.toString() : 0,
        "bankBranch": payload.appBranchId ? payload.appBranchId.toString() : 0,
        "nameOfApp": payload.appBankName,
        "bankAccount": payload.appBankAccountNo,
        "bankIFSC": payload.bankIfscCode,
        "mobileNo": payload.appMobileNo,
        "mobileNoAlt": payload.appMobileNoAlt,
        "email": payload.appEmail,

        "nodalDistrict": payload.nodalDistrictId ? payload.nodalDistrictId.toString() : 0,
        "nodalTaluka": payload.nodalTalukaId ? payload.nodalTalukaId.toString() : 0,
        "schemeType": payload.schemeId,
        "nodalOffice": payload.nodalOfficer,
        "nodalEmail": payload.nodalEmailAddress,
        "ploicyNo": payload.policyNum,
        "claimAmount": payload.claimAmount,
        "inwardNo": payload.inwardNumber,
        "inwardDate": payload.inwrdDate,
      })
    }
  }
}


@Component({
  selector: 'app-validation-entry',
  templateUrl: 'validation-dialog.html',
})

export class ValidationDialogComponent implements OnInit {

  applicantName;
  aadharNo;
  isDataPresent = false;
  filterDataElement: any[];

  displayColumnArray = new BehaviorSubject(['noData']);

  displayedColumn = [
    'claimId',
    'deceasedDisabledName',
    'adharNo',
    'dateOfAccident',
    'dateOfDeath',
    'applicantName',
    'applicantAdhar',
    'schemeName',
    'nodalDistrict'
  ];

  elementData: any[] = [
    {
      claimId: '549',
      deceasedDisabledName: 'Manganbhai Patel',
      adharNo: '12345678910',
      dateOfAccident: new Date('07/10/2019'),
      dateOfDeath: new Date('07/10/2019'),
      applicantName: 'Changanbhai Manganbhai Patel',
      applicantAdhar: '12346',
      schemeName: 'Registered Farmer',
      nodalDistrict: 'Amreli',
    }
  ];

  dataSource = new MatTableDataSource([{ noData: 'No Data Available' }]);

  constructor(public dialogRef: MatDialogRef<ValidationDialogComponent>,
    private toastr: ToastrService, 
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.applicantName = data['applicantName'];
    this.aadharNo = data['aadharNo'];
  }

  ngOnInit() {
    if (this.applicantName !== ' ' && this.aadharNo === '') {
      console.log("name");

      this.filterApplicantNameData();
    } else {
      console.log("adhar");
      this.filterAdharNoData();
    }

  }



  filterApplicantNameData() {
    this.displayColumnArray.next(this.displayedColumn);
    this.filterDataElement = this.elementData.filter((item) => ((item.deceasedDisabledName).split(' '))[0] === this.applicantName);
    if (this.filterDataElement.length > 0) {
      this.isDataPresent = false;
      this.dataSource = new MatTableDataSource(this.filterDataElement);
    } else {
      this.displayColumnArray.next(['noData']);
      this.dataSource = new MatTableDataSource([{ noData: 'no data' }]);
    }
  }

  filterAdharNoData() {
    this.displayColumnArray.next(this.displayedColumn);
    this.filterDataElement = this.elementData.filter((item) => (item.adharNo) === this.aadharNo);
    if (this.filterDataElement.length > 0) {
      this.isDataPresent = true;
      this.dataSource = new MatTableDataSource(this.filterDataElement);
    } else {
      this.displayColumnArray.next(['noData']);
      this.dataSource = new MatTableDataSource([{ noData: 'no data' }]);
    }
  }

  onIgnore() {
    let result = [{ column: this.displayColumnArray, adharName: this.isDataPresent }];
    this.dialogRef.close(result);
  }


}
