import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { jpaMessage } from 'src/app/common/error-message/common-message.constants';
import { ListValue, LEgalEntryRequest } from 'src/app/models/doi/doiModel';
import { DOcumentElement, DocumentCasu, DocumentRequirement } from 'src/app/models/doi/doiModel';
import { DoiService } from '../../service/doi.service';
import { APIConst } from 'src/app/shared/constants/doi/doi-api.constants';
import { timeStamp } from 'console';
import { JpaUtilityService } from '../../service/jpa-utility.service';
import { msgConst } from 'src/app/shared/constants/edp/edp-msg.constants';


@Component({
  selector: 'app-document-master',
  templateUrl: './document-master.component.html',
  styleUrls: ['./document-master.component.css']
})
export class DocumentMasterComponent implements OnInit {
  errorMessages = jpaMessage;
  isSubmitted: boolean = false;
  todayDate = new Date();
  selectedSchemeText: any;
  // Form Group
  documentMasterForm: FormGroup;
  // Control
  requirementCtrl: FormControl = new FormControl();
  schemeCtrl: FormControl = new FormControl();
  documentRequirementCtrl: FormControl = new FormControl();
  policyCtrl: FormControl = new FormControl();
  causeOfLossCtrl: FormControl = new FormControl();
  causeRequirementCtrl: FormControl = new FormControl();
  // List
  Element_Data: DocumentRequirement[] = [];
  Document_Element_Data: DOcumentElement[] = [];
  Cause_Element_Data: DocumentCasu[] = [];;
  //documentRequirement: any[] = [];
  addButtnTextCommonDocument: string = 'Add';
  addButtnTextSchemeDocument: string = 'Add';
  addButtnTextCauseOfLossDocument: string = 'Add';
  isPolicyDropdown: boolean = false;
  referenceNumber: string = '';
  selectedReferneceNumber: string = '';

  requirementList: ListValue[] = [];

  documentRequirementList: ListValue[] = [];

  causeRequirementList: ListValue[] = [];

  schemeList: any[] = [];

  policyList: any[];

  causeOfLossList: ListValue[] = [];

  // Table Source

  displayedColumnsCommon: any[] = [
    'srno',
    'document',
    'requirement',
    'action'

  ];

  displayedColumnsDocument: any[] = [
    'srno',
    'scheme',
    'policy',
    'document',
    'requirement',
    'action'

  ];

  displayedColumnsCause: any[] = [
    'srno',
    'causeName',
    'document',
    'requirement',
    'action'

  ];

  dataSourceCommon = new MatTableDataSource<any>(this.Element_Data);
  dataSourceDocument = new MatTableDataSource<any>(this.Document_Element_Data);
  dataSourceCause = new MatTableDataSource<any>(this.Cause_Element_Data);

  editId: number;
  isEditEnabled: boolean = false;

  constructor(private router: Router, public dialog: MatDialog, private fb: FormBuilder,
    private workflowService: DoiService, private jpaUtilityService: JpaUtilityService) { }
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  ngOnInit() {
    this.getActiveCommonDocumentList();
    this.getActiveDataSourceCauseList();
    this.getActiveDataSourceDocumentList();
    this.getSchemeMasterList();
    this.getLossOfCauseList();
    this.getRequirementList();
    
    this.dataSourceCommon.paginator = this.paginator;
    this.dataSourceCommon.sort = this.sort;
    this.referenceNumber = this.jpaUtilityService.getNewPolicyNumber();

    this.documentMasterForm = this.fb.group({
      requirement: "1",
      document: [''],

      scheme: [''],
      policy: [''],
      schemeDocument: [''],
      documentRequirement: "1",

      causeOfLoss: [''],
      causeDocument: [''],
      causeRequirement: "1",
    });
  }

  getActiveCommonDocumentList() {
    this.workflowService.getDataWithoutParamsPost(APIConst.DOI_JPA_COMMON_DOCUMENT_LISTING).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          this.Element_Data = resp.result;
          this.dataSourceCommon.data = this.Element_Data;
        }
      }
    );
  }

  getActiveDataSourceCauseList() {
    this.workflowService.getDataWithoutParamsPost(APIConst.DOI_JPA_SCHEME_DOCUMENT_LISTING).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          this.Document_Element_Data = resp.result;
          this.dataSourceDocument.data = this.Document_Element_Data;
        }
      }
    );
  }
  getActiveDataSourceDocumentList() {
    this.workflowService.getDataWithoutParamsPost(APIConst.DOI_JPA_LOSSCAUSE_DOCUMENT_LISTING).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          this.Cause_Element_Data = resp.result;
          this.dataSourceCause.data = this.Cause_Element_Data;
        }
      }
    );
  }

  reset(source: string = '') {    
    this.documentMasterForm.reset();
    //this.documentMasterForm.markAsPristine();
    this.isEditEnabled = false;
    this.editId = -999;
    this.selectedReferneceNumber = '';
    this.referenceNumber = this.jpaUtilityService.getNewPolicyNumber();
    if (source) {
      switch (source.toLocaleLowerCase()) {
        case 'commondocuent':
          this.addButtnTextCommonDocument = 'Add';
          break;
        case 'schemedocument':
          this.addButtnTextSchemeDocument = 'Add';
          break;
        case 'causeofloss':
          this.addButtnTextCauseOfLossDocument = 'Add';
          break
      }
    }
  }

  //function to show errormessages
  onSaveCommonDocument() {
    if (this.documentMasterForm.controls.document.valid) {
      let payload = {
        'document': this.documentMasterForm.controls.document.value,
        'requirement': this.documentMasterForm.controls.requirement.value == 1 ? true : false,
        'requirementKey': this.documentMasterForm.controls.requirement.value,
        // 'refDate': '2021-09-26 10:45:37 709'//new Date()
        'refDate': new Date().toJSON().replace('T', ' ').replace('.', ' ').replace('Z', '')
      }

      if (this.isEditEnabled === true) {
        payload["id"] = this.editId;
        payload["refNo"] = this.selectedReferneceNumber;
      }
      this.workflowService.saveDocumentsData(APIConst.DOI_JPA_COMMON_DOCUMENT_ENTRY, payload)
        .subscribe((data: any) => {
          if (data && data.result && data.status === 200) {
            this.Element_Data = data.result;
            this.dataSourceCommon.data = this.Element_Data;
            this.reset('commondocuent');   
            this.clearError();        
          }
        });
    }
    if (this.documentMasterForm.valid) {
      this.isSubmitted = false;
    } else {
      this.isSubmitted = true;
    }
   
  }

  private clearError(){  
    this.documentMasterForm.reset();  
    Object.keys(this.documentMasterForm.controls).forEach(key => {
      this.documentMasterForm.get(key).setErrors(null);
    });
    
    // this.documentMasterForm.get("requirement").setValue("1");
    // this.documentMasterForm.get("documentRequirement").setValue("1");
    // this.documentMasterForm.get("causeRequirement").setValue("1");
  }
  // save scheme document
  onSaveSchemeDocument() {
    if (this.documentMasterForm.controls.scheme.valid) {
      let payload = {
        'scheme': this.documentMasterForm.controls.scheme.value,
        'policy': this.documentMasterForm.controls.policy.value,
        'schemeDocument': this.documentMasterForm.controls.schemeDocument.value,
        'documentRequirement': this.documentMasterForm.controls.documentRequirement.value == 1 ? true : false,
        'documentRequirementKey': this.documentMasterForm.controls.documentRequirement.value,
        'refDate': new Date().toJSON().replace('T', ' ').replace('.', ' ').replace('Z', ''),
        "schemeName": this.selectedSchemeText
      }
      if (this.isEditEnabled === true) {
        payload["id"] = this.editId;
        payload["refNo"] = this.selectedReferneceNumber;
      }
      this.workflowService.saveDocumentsData(APIConst.DOI_JPA_SCHEME_DOCUMENT_ENTRY, payload)
        .subscribe((data: any) => {
          if (data && data.result && data.status === 200) {
            this.Document_Element_Data = data.result;
            this.dataSourceDocument.data = this.Document_Element_Data;
            this.reset('schemedocument');    
            this.clearError();               
          }
        });
    }
    if (this.documentMasterForm.valid) {
      this.isSubmitted = false;
    } else {
      this.isSubmitted = true;
    }
  }

  // save cause of loss 
  onSaveCauseOfLoss() {
    if (this.documentMasterForm.controls.causeOfLoss.valid) {
      let payload = {
        'causeOfLoss': this.documentMasterForm.controls.causeOfLoss.value,
        'causeDocument': this.documentMasterForm.controls.causeDocument.value,
        'causeRequirement': this.documentMasterForm.controls.causeRequirement.value == 1 ? true : false,
        'causeRequirementKey': this.documentMasterForm.controls.causeRequirement.value,
        'refDate': new Date().toJSON().replace('T', ' ').replace('.', ' ').replace('Z', ''),
        'causeTypeName': this.getDropdowntxt(this.documentMasterForm.controls.causeOfLoss.value, this.causeOfLossList)
      }

      if (this.isEditEnabled === true) {
        payload["id"] = this.editId;
        payload["refNo"] = this.selectedReferneceNumber;
      }

      this.workflowService.saveDocumentsData(APIConst.DOI_JPA_LOSSCAUSE_DOCUMENT_ENTRY, payload)
        .subscribe((data: any) => {
          if (data && data.result && data.status === 200) {
            this.Cause_Element_Data = data.result;
            this.dataSourceCause.data = this.Cause_Element_Data;
            this.reset('causeofloss');
            this.clearError();       
          }
        });
    }
    if (this.documentMasterForm.valid) {
      this.isSubmitted = false;
    } else {
      this.isSubmitted = true;
    }

  }

  // function to delete row from table
  deleteCommonDocument(element) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '360px',
      data: msgConst.CONFIRMATION_DIALOG.DELETE
  });
  dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        let deletedElement = this.dataSourceCommon.data.splice(element, 1);
        this.workflowService.deleteDocument(APIConst.DOI_JPA_COMMON_DOCUMENT_DELETE, deletedElement[0].id).subscribe((resp) => {
          this.dataSourceCommon = new MatTableDataSource(this.dataSourceCommon.data);
        })
      }
  });
  }

  // function to delete row from table
  deleteDocument(element) {

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '360px',
      data: msgConst.CONFIRMATION_DIALOG.DELETE
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        let deletedElement = this.dataSourceDocument.data.splice(element, 1);
        this.workflowService.deleteDocument(APIConst.DOI_JPA_SCHEME_DOCUMENT_DELETE, deletedElement[0].id).subscribe((resp) => {
          this.dataSourceDocument = new MatTableDataSource(this.dataSourceDocument.data);
        })
      }
    });

  }

  // function to delete row from table
  deleteCause(element) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '360px',
      data: msgConst.CONFIRMATION_DIALOG.DELETE
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        let deletedElement = this.dataSourceCause.data.splice(element, 1);

        this.workflowService.deleteDocument(APIConst.DOI_JPA_LOSSCAUSE_DOCUMENT_DELETE, deletedElement[0].id).subscribe((resp) => {
          this.dataSourceCause = new MatTableDataSource(this.dataSourceCause.data);
        })
      }
    });
  }

  // edit common document 
  editCommonDocument(element) {
    let commonDataSrcCopy = Object.assign([], this.dataSourceCommon.data);
    let deletedElement = commonDataSrcCopy.splice(element, 1);
    if (deletedElement && deletedElement.length === 1) {
      this.documentMasterForm.patchValue({
        document: deletedElement[0].document,
        requirement: this.requirementList.filter(x => x.viewValue == (deletedElement[0].requirement === true ? "Yes" : "No"))[0].value
      });
      this.editId = deletedElement[0].id;
      this.isEditEnabled = true;
      this.addButtnTextCommonDocument = 'Update';
      this.selectedReferneceNumber = deletedElement[0].refNo;
      this.referenceNumber = deletedElement[0].refNo;
    }
  }

  editSchemeDocument(element) {
    let commonDataSrcCopy = Object.assign([], this.dataSourceDocument.data);
    let deletedElement = commonDataSrcCopy.splice(element, 1);
    if (deletedElement && deletedElement.length === 1) {
      this.documentMasterForm.patchValue({
        scheme: deletedElement[0].scheme,
        policy: deletedElement[0].policy,
        schemeDocument: deletedElement[0].schemeDocument,
        documentRequirement: this.requirementList.filter(x => x.viewValue == (deletedElement[0].documentRequirement === true ? "Yes" : "No"))[0].value
      });
      this.editId = deletedElement[0].id;
      this.isEditEnabled = true;
      this.addButtnTextSchemeDocument = 'Update';
      this.selectedReferneceNumber = deletedElement[0].refNo;
      this.referenceNumber = deletedElement[0].refNo;
    }
  }

  editLostDocment(element) {
    let commonDataSrcCopy = Object.assign([], this.dataSourceCause.data);
    let deletedElement = commonDataSrcCopy.splice(element, 1);
    if (deletedElement && deletedElement.length === 1) {
      this.documentMasterForm.patchValue({
        causeOfLoss: deletedElement[0].causeOfLoss.toString(),
        causeDocument: deletedElement[0].causeDocument,
        causeRequirement: this.requirementList.filter(x => x.viewValue == (deletedElement[0].causeRequirement === true ? "Yes" : "No"))[0].value
      });
      this.editId = deletedElement[0].id;
      this.isEditEnabled = true;
      this.addButtnTextCauseOfLossDocument = 'Update';
      this.selectedReferneceNumber = deletedElement[0].refNo;
      this.referenceNumber = deletedElement[0].refNo;
    }
  }

  onSchemeChange(event) {
    let val = event.value;
    this.selectedSchemeText = event.source.selected.viewValue;
    if (val) {
      let item: any = this.schemeList.filter(x => x.schemeId == val);
      if (item && item.length == 1 && item[0].policies.length > 0) {
        this.isPolicyDropdown = true;
        this.policyList = item[0].policies;
      } else {
        this.isPolicyDropdown = false;
      }
    }
  }

  getRequiredText(data: boolean): string {
    return data === true ? 'Yes' : 'No';
  }

  getSchemeMasterList() {
    this.workflowService.getDataWithoutParams(APIConst.DOI_MASTER_SCHEME_POLICY_DROPDOWN).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          this.schemeList = resp.result;
        }
      }
    );
  }

  getLossOfCauseList() {
    this.workflowService.getDataWithoutParams(APIConst.DOI_LOSS_OF_CAUSE_DROPDOWN).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          this.causeOfLossList = resp.result;
        }
      }
    );
  }

  getRequirementList() {
    this.workflowService.getDataWithoutParams(APIConst.DOI_REQUIREMENT_LIST_DROPDOWN).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          this.requirementList = resp.result;
          this.documentRequirementList = resp.result;
          this.causeRequirementList = resp.result;
        }
      }
    );
  }

  onTabChange(event) {
    if (event && event.tab) {
      switch (event.tab.textLabel) {
        case 'Common Document':
          if (this.addButtnTextCommonDocument === 'Update') {
            this.referenceNumber = this.selectedReferneceNumber;
          } else {
            this.referenceNumber = this.jpaUtilityService.getNewPolicyNumber();
          }
          break;
        case 'Scheme Document':
          if (this.addButtnTextSchemeDocument === 'Update') {
            this.referenceNumber = this.selectedReferneceNumber;
          } else {
            this.referenceNumber = this.jpaUtilityService.getNewPolicyNumber();
          }
          break;
        case 'Cause of Loss Document':
          if (this.addButtnTextCauseOfLossDocument === 'Update') {
            this.referenceNumber = this.selectedReferneceNumber;
          } else {
            this.referenceNumber = this.jpaUtilityService.getNewPolicyNumber();
          }
          break;
      }
    }
  }

  private getDropdowntxt(id: number, data: ListValue[]): string {
    let retVal: string = '';
    retVal = data.filter(x => x.value == id.toString())[0].viewValue
    return retVal;
  }
}
