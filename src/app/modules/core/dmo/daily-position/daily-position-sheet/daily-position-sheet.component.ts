import { CommonListing, TransactionList, TransactionSubType } from '../../../common/model/common-listing';
import { CommonDirective } from 'src/app/common/directive/validation.directive';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { dmoMessage } from 'src/app/common/error-message/common-message.constants';
import {
  CreditDebitTable,
  LoanReceivedPaidDataSourceTable,
  OtherIgaTransactionsDataSourceTable,
  TbInvestRediscountTable,
  WaysAndMeansAdvancesDataSourceTable
} from '../../model/dmo';
import { SubmitDialogComponent } from '../submit-dialog/submit-dialog.component';
import { TbillInvestmentComponent } from './tbill-investment/tbill-investment.component';
import { TbillMaturityComponent } from './tbill-maturity/tbill-maturity.component';
import { TbillRediscountingComponent } from './tbill-rediscounting/tbill-rediscounting.component';
import { NwmaDialogComponent } from './nwma-dialog/nwma-dialog.component';
import { SwmaDialogComponent } from './swma-dialog/swma-dialog.component';
import { OverdraftDialogComponent } from './overdraft-dialog/overdraft-dialog.component';
import { WorkflowDmoComponent } from '../workflow-dmo/workflow-dmo.component';
import { DailyPositionSheetService } from '../../services/daily-position-sheet.service';
import { getDPListObject, setDPListRecord } from './daily-position.data-model';
import { ToastMsgService } from '../../services/toast.service';
import * as moment from 'moment';
@Component({
  selector: 'app-daily-position-sheet',
  templateUrl: './daily-position-sheet.component.html',
  styleUrls: ['./daily-position-sheet.component.css']
})
export class DailyPositionSheetComponent implements OnInit {
  errorMessages = dmoMessage;

  dailyPositionSheetForm: FormGroup;
  maxDate = new Date();
  todayDate = Date.now();

  // List
  mainTransaction_list: TransactionList[] = [];
  transaction_list: any = [];

  // Credit / Debit Table data
  creditDebitData: CreditDebitTable[] = [
    { transactionsName: 'Opening Balance (Dr/Cr) ', credit: '', debit: '', },
    { transactionsName: 'PAD Transactions (Dr/Cr) ', credit: '', debit: '', },
    { transactionsName: 'PAD Mumbai GST Transaction (Dr/Cr) ', credit: '', debit: '', },
    { transactionsName: 'Agency Bank Transactions (Dr/Cr) ', credit: '', debit: '', },
  ];
  creditDebitDataSource;
  creditDebitDisplayedColumns: string[] = [
    'transactionsName',
    'debit',
    'credit',
  ];

  // Treasury Bill Investment / Rediscounting Table data
  TbInvestRediscountData: TbInvestRediscountTable[] = [
    {
      memoNo: '',
      adviceNo: '',
      adviceDate: '',
      adviceBy: '',
      transaction: '',
      description: '',
      credit: '',
      debit: '',
    },
  ];
  TbInvestRediscountDataSource = new MatTableDataSource<TbInvestRediscountTable>(this.TbInvestRediscountData);
  TbInvestRediscountColumns: string[] = [
    'memoNo',
    'adviceNo',
    'adviceDate',
    'adviceBy',
    'transaction',
    'description',
    'credit',
    'debit',
    'action',
  ];

  // Loan Received / Paid Table data
  loanReceivedPaidData: LoanReceivedPaidDataSourceTable[] = [
    {
      memoNo: '',
      adviceNo: '',
      adviceDate: '',
      adviceBy: '',
      transaction: '',
      description: '',
      credit: '',
      debit: '',
    },
  ];
  loanReceivedPaidDataSource = new MatTableDataSource<LoanReceivedPaidDataSourceTable>(this.loanReceivedPaidData);
  loanReceivedPaidColumns: string[] = [
    'memoNo',
    'adviceNo',
    'adviceDate',
    'adviceBy',
    'transaction',
    'description',
    'credit',
    'debit',
    'action',
  ];

  // Ways & Means Advances Table data
  waysAndMeansAdvancesData: WaysAndMeansAdvancesDataSourceTable[] = [
    {
      memoNo: '',
      adviceNo: '',
      adviceDate: '',
      adviceBy: '',
      transaction: '',
      description: '',
      credit: '',
      debit: '',
    },
  ];
  waysAndMeansAdvancesDataSource = new MatTableDataSource<WaysAndMeansAdvancesDataSourceTable>(this.waysAndMeansAdvancesData);
  waysAndMeansAdvancesColumns: string[] = [
    'memoNo',
    'adviceNo',
    'adviceDate',
    'adviceBy',
    'transaction',
    'description',
    'credit',
    'debit',
    'action',
  ];

  // Other IGA Transactions Table data
  otherIgaTransactionsData: OtherIgaTransactionsDataSourceTable[] = [
    {
      memoNo: '',
      adviceNo: '',
      adviceDate: '',
      adviceBy: '',
      transaction: '',
      description: '',
      credit: '',
      debit: '',
    },
  ];
  otherIgaTransactionsDataSource = new MatTableDataSource<OtherIgaTransactionsDataSourceTable>(this.otherIgaTransactionsData);
  otherIgaTransactionsColumns: string[] = [
    'memoNo',
    'adviceNo',
    'adviceDate',
    'adviceBy',
    'transaction',
    'description',
    'credit',
    'debit',
    'action',
  ];

  dataSource: any;

  displayedColumns: string[] = [
    'memoNo',
    'adviceNo',
    'adviceDate',
    'adviceBy',
    'mainTransaction',
    'transaction',
    'description',
    'debit',
    'credit',
    'action',
  ];



  directiveObj: CommonDirective = new CommonDirective();

  totalRecords: number = 0;
  pageSize:number = 10;
  pageIndex: number = 0;

  totalDpSheetRecords: any = [];

  constructor(private fb: FormBuilder
    , private router: Router
    , public dialog: MatDialog
    , private positionSheetService: DailyPositionSheetService
    , private _toast: ToastMsgService) { }

  async ngOnInit() {
    this.initDPForm();
    await this.fetchDPTransactionType();
    this.fetchDPTransactionList();
  }

  initDPForm() {
    this.dailyPositionSheetForm = this.fb.group({
      id: [''],
      memoNo: [''],
      lastDpDate: [new Date()],
      date: [new Date()],
      code: [{value:'', disabled: true}],
      total: [''],
      closingMinimumBalance: [''],
      fourteenDayTbillBalance: [''],
    });
  }

  /**
   * Fetch transaction type with sub type data fetcted
   * First DP transaction type will fetch & based on will perform list transaction selection
   */
  fetchDPTransactionType() {
    return new Promise(resolve => {
      this.positionSheetService.fetchDailyPositionList().subscribe((response:any) => {
        this.mainTransaction_list = response.result;
        resolve(true);
      }, error => {
        console.log(error);
      })
    })
  }

  searchByDateDPDet() {
    if(this.dailyPositionSheetForm.value.date) {
      this.totalDpSheetRecords = [];
      this.pageIndex = 0;
      this.pageSize = 10;
      this.fetchDPTransactionList();
    }
  }
  /**
   * Fetch DP transaction list API
   */
  fetchDPTransactionList() {
    this.transaction_list = [];
    this.totalDpSheetRecords = [];
    const dpFilterObj = {
      date: moment(this.dailyPositionSheetForm.value.date).format('YYYY-MM-DD')
    };
    this.positionSheetService.fetchMainTransactiononList(dpFilterObj).subscribe((res:any) => {
      if (res && res.result && res.status === 200) {
        const data = res && res.result ? res.result : null;
        const { dpSheetDtos } = data;
        this.totalRecords = dpSheetDtos.length;
        dpSheetDtos.forEach((element, index) => {
          this.totalDpSheetRecords.push(getDPListObject(element, index));
        });
        
        const dataArr = this.paginateDpsheetRecord(this.pageIndex)
        this.dataSource = new MatTableDataSource<OtherIgaTransactionsDataSourceTable>(dataArr)

        this.creditDebitData[0].credit = data.openBalCr ? data.openBalCr : '';
        this.creditDebitData[0].debit = data.openBalDr ? data.openBalDr : '';
        this.creditDebitData[1].credit = data.padTransCr ? data.padTransCr : '';
        this.creditDebitData[1].debit = data.padTransDr ? data.padTransDr : '';
        this.creditDebitData[2].credit = data.padMumbGstCr ? data.padMumbGstCr : '';
        this.creditDebitData[2].debit = data.padMumbGstDr ? data.padMumbGstDr : '';
        this.creditDebitData[3].credit = data.agencyBankCr ? data.agencyBankCr : '';
        this.creditDebitData[3].debit = data.agencyBankDr ? data.agencyBankDr : '';
        this.creditDebitDataSource = new MatTableDataSource<any>(this.creditDebitData);

        data.gogCode ? this.dailyPositionSheetForm.get('code').patchValue(data.gogCode) : 
          this.dailyPositionSheetForm.get('code').patchValue('');
        data.memoNo ? this.dailyPositionSheetForm.get('memoNo').patchValue(data.memoNo) : 
          this.dailyPositionSheetForm.get('memoNo').patchValue('');
        data.closMinBal ? this.dailyPositionSheetForm.get('closingMinimumBalance').patchValue(data.closMinBal) : 
          this.dailyPositionSheetForm.get('closingMinimumBalance').patchValue(data.closMinBal);
        data.tBill14DBal ? this.dailyPositionSheetForm.get('fourteenDayTbillBalance').patchValue(data.tBill14DBal) : 
          this.dailyPositionSheetForm.get('fourteenDayTbillBalance').patchValue(data.tBill14DBal);
        data.id ? this.dailyPositionSheetForm.get('id').patchValue(data.id) : 
          this.dailyPositionSheetForm.get('id').patchValue(data.id);
      }
    }, error => {
      console.log('fetchDPTransactionList error => ', error);
    })
  }

  paginateDpsheetRecord(index) {
    const arr=[];
    let startIndex = index==0 ? index+1 : (index*this.pageSize)+1;
    const lastIndex = index==0 ? this.pageSize : (index+1)*this.pageSize;
    for(startIndex;startIndex<=lastIndex;startIndex++) {
      let obj = this.totalDpSheetRecords.find(o=>o.index===startIndex);
      if(obj) arr.push(obj);
    }
    this.transaction_list = [];
    arr.forEach(element => {
      if(element.transaction) {
        let obj: any = this.checkMainTransaction(element.transaction);
        if(obj && obj.id) {
          element.mainTransaction = obj.id;
          this.transaction_list.push(obj.list);
        } else {
          this.transaction_list.push([]);
        }
      }
    })
    return arr;
  }

  checkMainTransaction(id) {
    let res = {};
    this.mainTransaction_list.forEach(ele => {
      const obj: any = ele.transactionSubType.findIndex(o=>o.id==id);
      if(obj>=0) {
        res['id'] = ele.id;
        res['list']=ele.transactionSubType;
      } 
    });
    return res;
  }

  onPaginateChange(event) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    const dataArr = this.paginateDpsheetRecord(this.pageIndex)
    this.dataSource = new MatTableDataSource<OtherIgaTransactionsDataSourceTable>(dataArr)
    /* this.dpFilterObj.pageIndex = event.pageIndex,
    this.dpFilterObj.pageElement = event.pageSize
    this.fetchDPTransactionList(this.dpFilterObj); */
  }

  onCancel() {
    this.router.navigate(['dashboard/dmo/nssf-loan-received']);
  }

  dpListing() {
    this.router.navigate(['dashboard/dmo/daily-position-sheet-listing']);
  }

  // Add row in Treasury Bill Investment / Rediscounting Table
  add(dataSource) {
    dataSource.data.push({
      memoNo: '',
      adviceNo: '',
      adviceDate: '',
      adviceBy: '',
      transaction: '',
      description: '',
    });
    dataSource.data = dataSource.data;
  }
  // On credit
  forTreasuryBillInvestmentRediscounting(value) {
    switch (value) {
      case 1: const DIALOG_REF1 = this.dialog.open(TbillInvestmentComponent, {
        width: '900px',
        height: 'auto',
        data: 'for14'
      }
      );
        DIALOG_REF1.afterClosed().subscribe(result => {
          console.log('Dialog Closed');
        });
        break;

      case 2: const DIALOG_REF2 = this.dialog.open(TbillMaturityComponent, {
        width: '900px',
        height: 'auto',
        data: 'for14'
      }
      );
        DIALOG_REF2.afterClosed().subscribe(result => {
          console.log('Dialog Closed');
        });
        break;

      case 3: const DIALOG_REF3 = this.dialog.open(TbillRediscountingComponent, {
        width: '900px',
        height: 'auto',
        data: 'for14'
      }
      );
        DIALOG_REF3.afterClosed().subscribe(result => {
          console.log('Dialog Closed');
        });
        break;

      case 4: const DIALOG_REF4 = this.dialog.open(TbillInvestmentComponent, {
        width: '900px',
        height: 'auto',
        data: 'for91'
      }
      );
        DIALOG_REF4.afterClosed().subscribe(result => {
          console.log('Dialog Closed');
        });
        break;

      case 5: const DIALOG_REF5 = this.dialog.open(TbillMaturityComponent, {
        width: '900px',
        height: 'auto',
        data: 'for91'
      }
      );
        DIALOG_REF5.afterClosed().subscribe(result => {
          console.log('Dialog Closed');
        });
        break;

      case 6: const DIALOG_REF6 = this.dialog.open(TbillRediscountingComponent, {
        width: '900px',
        height: 'auto',
        data: 'for91'
      }
      );
        DIALOG_REF6.afterClosed().subscribe(result => {
          console.log('Dialog Closed');
        });
        break;

      default:
        break;
    }
  }
  // On debit
  onDebit(element) { }

  // on chjange of wma transaction
  onWmaTransaction(value) {
    switch (value) {
      case 7: const DIALOG_REF1 = this.dialog.open(NwmaDialogComponent, {
        width: '900px',
        height: 'auto',
        data: 'advance'
      }
      );
        DIALOG_REF1.afterClosed().subscribe(result => {
          console.log('Dialog Closed');
        });
        break;

      case 8: const DIALOG_REF2 = this.dialog.open(NwmaDialogComponent, {
        width: '900px',
        height: 'auto',
        data: 'interest'
      }
      );
        DIALOG_REF2.afterClosed().subscribe(result => {
          console.log('Dialog Closed');
        });
        break;

      case 9: const DIALOG_REF3 = this.dialog.open(NwmaDialogComponent, {
        width: '900px',
        height: 'auto',
        data: 'principal'
      }
      );
        DIALOG_REF3.afterClosed().subscribe(result => {
          console.log('Dialog Closed');
        });
        break;

      case 10: const DIALOG_REF4 = this.dialog.open(OverdraftDialogComponent, {
        width: '900px',
        height: 'auto',
        data: 'advance'
      }
      );
        DIALOG_REF4.afterClosed().subscribe(result => {
          console.log('Dialog Closed');
        });
        break;

      case 11: const DIALOG_REF5 = this.dialog.open(OverdraftDialogComponent, {
        width: '900px',
        height: 'auto',
        data: 'interest'
      }
      );
        DIALOG_REF5.afterClosed().subscribe(result => {
          console.log('Dialog Closed');
        });
        break;

      case 12: const DIALOG_REF6 = this.dialog.open(OverdraftDialogComponent, {
        width: '900px',
        height: 'auto',
        data: 'principal'
      }
      );
        DIALOG_REF6.afterClosed().subscribe(result => {
          console.log('Dialog Closed');
        });
        break;

      case 13: const DIALOG_REF7 = this.dialog.open(SwmaDialogComponent, {
        width: '900px',
        height: 'auto',
        data: 'advance'
      }
      );
        DIALOG_REF7.afterClosed().subscribe(result => {
          console.log('Dialog Closed');
        });
        break;

      case 14: const DIALOG_REF8 = this.dialog.open(SwmaDialogComponent, {
        width: '900px',
        height: 'auto',
        data: 'interest'
      }
      );
        DIALOG_REF8.afterClosed().subscribe(result => {
          console.log('Dialog Closed');
        });
        break;

      case 15: const DIALOG_REF9 = this.dialog.open(SwmaDialogComponent, {
        width: '900px',
        height: 'auto',
        data: 'principal'
      }
      );
        DIALOG_REF9.afterClosed().subscribe(result => {
          console.log('Dialog Closed');
        });
        break;

      default:
        break;
    }
  }


  // On Submit
  onSubmit() {
    let dpFlag=true;
    const dpSheetData: any = this.dataSource.data;
    dpSheetData.forEach(element => {
      if(!element.transaction) dpFlag=false;
    });
    if(dpFlag && this.dailyPositionSheetForm.valid) {
      const dialogRef2 = this.dialog.open(WorkflowDmoComponent, {
        width: '1200px',
        data: 'dpSheet'
      });
      dialogRef2.afterClosed().subscribe(result2 => {
        if(result2=='submit') {
          const reqObj = setDPListRecord(this.dailyPositionSheetForm.value, this.creditDebitDataSource.data, dpSheetData);
          reqObj['action']=1;
          this.positionSheetService.submitMainTransactiononList(reqObj).subscribe(res => {
            if (res && res['status'] && res['status'] === 200) {
              this._toast.success('Data submitted successfully.');
              this.fetchDPTransactionList();
            }
          }, error => {
            console.log('DP sheet onSubmit error =>', error)
            this._toast.error('Something went wrong.');
          })
        }
      });
    } else {
      this.dailyPositionSheetForm.markAllAsTouched();
      this._toast.error('Please fill all mandatory fields.');
    }
  }
  
  onDraft() {
    if(this.dailyPositionSheetForm.valid) {
      const dpSheetData: any = this.dataSource.data;
      const dpRec = dpSheetData.filter(o=>o.transaction);
      if(dpRec.length) {
        const reqObj = setDPListRecord(this.dailyPositionSheetForm.value, this.creditDebitDataSource.data, dpSheetData);
        reqObj['action']=0;
        this.positionSheetService.submitMainTransactiononList(reqObj).subscribe(res => {
          if (res && res['status'] && res['status'] === 200) {
            this._toast.success('Data submitted successfully.');
            this.fetchDPTransactionList();
          }
        }, error => {
          console.log('DP sheet onDraft error =>', error)
          this._toast.error('Something went wrong.');
        });
      } else {
        console.log('Select at least 1 transaction...')
      }
    } else {
      this.dailyPositionSheetForm.markAllAsTouched();
    }
  }

  // on main transaction
  onMainTransaction(value, element, index) {
    element.transaction = '';
    let data = this.mainTransaction_list.find(o=>o.id===value);
    this.transaction_list[index] = data.transactionSubType;
  }

  // on transaction
  onTransaction(value, element) {
    switch (element.mainTransaction) {
      case 1: this.forTreasuryBillInvestmentRediscounting(value);
        break;
      case 2: this.onWmaTransaction(value);
        break;
      default:
        break;
    }
  }

}
