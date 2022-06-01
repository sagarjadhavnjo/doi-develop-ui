import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DataService } from 'src/app/common/data.service';
import { CommonListing } from 'src/app/models/common-listing';
import { TalukaList } from 'src/app/models/doiModel';

@Component({
  selector: 'app-i-cheque-register-listing',
  templateUrl: './i-cheque-register-listing.component.html',
  styleUrls: ['./i-cheque-register-listing.component.css']
})
export class IChequeRegisterListingComponent implements OnInit {


  // date
  todayDate = new Date();
  // form group
  listingForm: FormGroup;
  // form control
  transTypeCtrl: FormControl = new FormControl();
  bankCtrl: FormControl = new FormControl();

  // lists start

  transType_list: CommonListing[] = [
    { value: '1', viewValue: 'E-payment' },
    { value: '2', viewValue: 'RTGS' },
    { value: '3', viewValue: 'Cheque' },
    { value: '4', viewValue: 'DD' },
  ];
  bank_list: CommonListing[] = [
    { value: '1', viewValue: 'Bank of Baroda' },
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
  talukaNameList: CommonListing[];

  policyTypeList: CommonListing[] = [
    { value: '0', viewValue: 'Standard Fire & Special Perils Policy Schedule' },
    { value: '1', viewValue: 'Burglary & Housebreaking Policy' },
    { value: '2', viewValue: 'Electronics Equipment/Material Damage Schedule' },
    { value: '3', viewValue: 'Case-In-Transit Insurance' },
    { value: '4', viewValue: 'Terrorism Pool Insurance' }
  ];
  // lists end

  // table data start
  columns: string[] = [
    'position',
    'transType',
    'tranNo',
    'cheqDate',
    'bankName',
    'brName',
    'amt',
    'partyName',
    'challanNo',
    'challanDate',
    'doBoPlace',
    'riskType',
    'agenComm',
    'mobNo',
    'action'
  ];
  elementData: any[] = [
    {
      transType: 'RTGS',
      tranNo: '465198',
      cheqDate: '19-Mar-19',
      bankName: 'HDFC',
      brName: 'Ambawadi',
      amt: '2356.00',
      partyName: 'Hydro Plant Ltd',
      challanNo: '111250',
      challanDate: '19-Mar-19',
      doBoPlace: 'Anand',
      riskType: 'Type',
      agenComm: '879',
      mobNo: '9954234578',
    },
  ];
  dataSource = new MatTableDataSource<any>(this.elementData);
  // table data end

  // constructor
  constructor(private fb: FormBuilder, private router: Router, private dataService: DataService) { }

  ngOnInit() {
    this.listingForm = this.fb.group({
      transType: [''],
      challanTranNum: [''],
      monthVal: [''],
      banName: [''],
      partyName: [''],
      challNum: [''],
    });
  }

  // reset form
  reset() {
    this.listingForm.reset();
  }

}
