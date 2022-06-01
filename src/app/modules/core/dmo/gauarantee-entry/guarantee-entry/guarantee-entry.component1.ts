// import { datasource } from './../../../budget/delegation/delegation.component';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
// import { MatPaginator, MatTableDataSource } from '@angular/material';
import { dmoMessage } from 'src/app/common/error-message/common-message.constants';
import { CommonDirective } from 'src/app/shared/directive/validation.directive';
import { CommonListing } from 'src/app/models/common-listing';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-guarantee-entry',
  templateUrl: './guarantee-entry.component.html',
  styleUrls: ['./guarantee-entry.component.css']
})
export class GuaranteeEntryComponent implements OnInit {


  selectedIndex: number;
  tabDisable: Boolean = true;
  guaranteeEntryForm: FormGroup;
  addDetailsForm: FormGroup;
  isDetails = false;
  maxDate = new Date();
  todayDate = Date.now();
  errorMessages = dmoMessage;

  departmentNameCreditCtrl: FormControl = new FormControl();
  hodCreditCtrl: FormControl = new FormControl();
  departmentNameDebitCtrl: FormControl = new FormControl();
  hodDebitCtrl: FormControl = new FormControl();
  hodList: CommonListing[] = [
    { value: '1', viewValue: 'Commissioner of Geology & Mining' },
    { value: '2', viewValue: 'Industries Commissioner' },
    { value: '3', viewValue: 'Director of Government Printing & Stationary' },
    { value: '4', viewValue: 'Commissioner of Cottage industries' },
    { value: '5', viewValue: 'Technical Examination Board' },
    { value: '6', viewValue: 'Chief Electrical Inspector' },
  ];

  departmentNameList: CommonListing[] = [
    { value: '1', viewValue: 'Agriculture, Famers welfare and Co-operation Department', },
    { value: '2', viewValue: 'Climate Change Department', },
    { value: '3', viewValue: 'Education Department', },
    { value: '4', viewValue: 'Energy & Petrochemicals Department', },
    { value: '5', viewValue: 'Finance Department', },
    { value: '6', viewValue: 'Food, Civil Supplies & Consumer Affairs Department', },
    { value: '7', viewValue: 'Forests & Environment Department', },
    { value: '8', viewValue: 'General Administration Department', },
    { value: '9', viewValue: 'Gujarat Legislature Secretariat', },
    { value: '10', viewValue: 'Health and Family Welfare Department', },
    { value: '11', viewValue: 'Home Department', },
    { value: '12', viewValue: 'Industries and Mines Department', },
    { value: '13', viewValue: 'Information & Broadcasting Department', },
    { value: '14', viewValue: 'Labour and Employment Department', },
    { value: '15', viewValue: 'Legal Department', },
    { value: '16', viewValue: 'Legislative & Parliamentary Affairs Department', },
    { value: '17', viewValue: 'Narmada, Water Resources, Water Supply & Kalpsar', },
    { value: '18', viewValue: 'Panchayat, Rural Housing & Rural Development', },
    { value: '19', viewValue: 'Ports and Transport Department', },
    { value: '20', viewValue: 'Revenue Department', },
    { value: '21', viewValue: 'Roads & Buildings', },
    { value: '22', viewValue: 'Science and Technology Department', },
    { value: '23', viewValue: 'Social justice and Empowerment Department', },
    { value: '24', viewValue: 'Sports, Youth & Cultural Activities Department', },
    { value: '25', viewValue: 'Tribal Development Department', },
    { value: '26', viewValue: 'Urban Development & Urban Housing Department', },
    { value: '27', viewValue: 'Women & Child Development Department', },
  ];

  // table data
  Element_Data: any[] = [];

  dataSource = new MatTableDataSource<any>(this.Element_Data);

  displayedColumns: any[] = [
    'position',
    'creditorDepartmentName',
    'creditorHodName',
    'creditorInstitutionName',
    'debitorDepartmentName',
    'debitorHodName',
    'debitorInstitutionName',
    'amount',
    'tenure',
    'guaranteeRate',
    'action',
  ];

  directiveObj = new CommonDirective();
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.dataSource.paginator = mp;
  }

  constructor(private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.guaranteeEntryForm = this.fb.group({
      departmentNameCredit: [''],
      hodCredit: [''],
      instituteNameCredit: [''],
      departmentNameDebit: [''],
      hodDebit: [''],
      instituteNameDebit: [''],
      amount: [''],
      tenure: [''],
      guaranteeRate: [''],
    });
  }

  getDetails() {
    this.isDetails = true;
  }
  onAddDetails() {
    this.router.navigate(['./dmo/nssf-loan-received/add-details']);
  }
  getTabIndex(tabIndex) {
    this.selectedIndex = tabIndex;
    const temp = this.selectedIndex;
  }
  onAdd() {
    this.tabDisable = false;
    this.selectedIndex = 1;
    this.dataSource.data.push({

      creditorDepartmentName:
        this.directiveObj.getViewValue(this.departmentNameList, this.guaranteeEntryForm.controls.departmentNameCredit.value),
      creditorHodName:
        this.directiveObj.getViewValue(this.hodList, this.guaranteeEntryForm.controls.hodCredit.value),
      creditorInstitutionName: this.guaranteeEntryForm.controls.instituteNameCredit.value,
      debitorDepartmentName:
        this.directiveObj.getViewValue(this.departmentNameList, this.guaranteeEntryForm.controls.departmentNameDebit.value),
      debitorHodName:
        this.directiveObj.getViewValue(this.hodList, this.guaranteeEntryForm.controls.hodDebit.value),
      debitorInstitutionName: this.guaranteeEntryForm.controls.instituteNameDebit.value,
      amount: this.guaranteeEntryForm.controls.amount.value,
      tenure: this.guaranteeEntryForm.controls.tenure.value,
      guaranteeRate: this.guaranteeEntryForm.controls.guaranteeRate.value,
    });
    this.dataSource.data = this.dataSource.data;

  }
  onSave() {
    this.router.navigate(['./dmo/nssf-loan-approved']);
  }
  edit(element) {
    this.selectedIndex = 0;
  }
  delete(i) {
    this.dataSource.data.slice(i, 1);
    this.dataSource.data = this.dataSource.data;
  }
  view(element) {
    this.selectedIndex = 0;
  }

  saveDetails(){
    console.log(this.dataSource.data)
  }

}
