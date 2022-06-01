import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject } from 'rxjs';
import { FieldHistoryService } from './service/field-history.service';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-fields-history-dialog',
  templateUrl: './fields-history-dialog.component.html',
  styleUrls: ['./fields-history-dialog.component.css']
})
export class FieldsHistoryDialogComponent implements OnInit {

  dataSource = new MatTableDataSource();

  storedData = [];

  sectionName: string = '';
  moduleName: string = '';
  isTable: boolean = false;
  isAnyOtherField: boolean = false;
  params;
  index = 0;
  updatedDate;

  normalColumn = ['fieldName', 'previousValue', 'currentValue'];
  subNormalColumn = ['name', 'empNo', 'post', 'office', 'dateTime'];

  keyNameToSkip =  ['changeType', 'updateByUserName',
                    'updateByUserCode', 'updateByPostName', 'updateByUpdateDate', 'officeName'];

  otherFields = [];
  otherFieldName = {};
  otherFieldValue = [];

  tabularData = [];
  tabularColumn = [];
  dataColumn = new BehaviorSubject([]);

  constructor(public dialogRef: MatDialogRef<FieldsHistoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fieldService: FieldHistoryService,
    private toastr: ToastrService,
    private datePipe: DatePipe) { }

  ngOnInit(): void {
    if (this.data?.data?.keyNameToSkip) {
      this.keyNameToSkip = this.keyNameToSkip.concat(_.cloneDeep(this.data.data.keyNameToSkip));
    }
    if (this.data && this.data.data && this.data.data.sectionName
      && this.data.data.moduleName && this.data.data.params) {
      this.sectionName = this.data.data.sectionName;
      this.moduleName = this.data.data.moduleName;
      this.params = this.data.data.params;
      this.isTable = this.data.data.isTable;
      if (this.data.data.isAnyOtherField) {
        this.isAnyOtherField = this.data.data.isAnyOtherField;
        if (this.data.data.otherFields) {
          this.otherFields = _.cloneDeep(this.data.data.otherFields);
        } else {
          console.error('FieldsHistoryDialogComponent.ts :' +
          'Need otherFields as an array which contains field name under which other category exits');
        }
        if (this.data.data.otherFieldName) {
          this.otherFieldName = _.cloneDeep(this.data.data.otherFieldName);
        } else {
          console.error('FieldsHistoryDialogComponent.ts :' +
          'Need otherFieldName as an list which contains key value pair as ParentKeyName : childKeyName');
        }
        if (this.data.data.otherFieldValue) {
          this.otherFieldValue = _.cloneDeep(this.data.data.otherFieldValue);
        } else {
          console.error('FieldsHistoryDialogComponent.ts :' +
          'Need otherFieldValue as an array of string which contains String value like others/other');
        }
      }
      this.getSectionHistory();
    } else {
      console.error('FieldsHistoryDialogComponent.ts : Expected parameters missing');
      console.error('FieldsHistoryDialogComponent.ts : Following Parameters are compulsary :');
      console.error('1. sectionName : key name in common apicostant.ts that contain url');
      console.error('2. moduleName : module name as per list name created in apiconstant.ts');
      console.error('3. isTable : Defines if the displaying data is table or fields data');
      console.error('4. params : request parameter for api call');
    }
  }

  /**
   * @method getSectionHistory
   * @description method calls api for history data of particular section
   */
  getSectionHistory() {
    if (this.sectionName && this.moduleName && this.params) {
      this.fieldService.getHistory(this.params, this.sectionName, this.moduleName).subscribe((res) => {
        if (res['status'] && res['status'] === 200 && res['result']) {
          if (this.isTable) {
            this.tabularColumn = [];
            this.tabularData = this.data.data.tabularData;
            this.data.data.tabularData.forEach(element => {
              this.tabularColumn.push(element.column);
            });
            this.setTabularData(res);
          } else {
            this.setNormalData(res);
          }
        } else {
          this.toastr.error(res['message']);
        }
      }, err => {
        this.toastr.error(err);
      });
    }
  }

  /**
   * @method setTabularData
   * @description to set datasource and column
   * @param res result data returned by api
   */
  setTabularData(res) {
    if (res['result']) {
      // Add column to mat table here for tabular data
      // Store recieve data to mat data source
      this.dataSource = new MatTableDataSource(_.cloneDeep(res['result']));
      this.dataColumn.next(this.tabularColumn.concat(['action']).concat(
        this.subNormalColumn).concat(['updatedBy']));
    }
  }

  /**
   * @method setTabularData
   * @description to set datasource and column
   * @param res result data returned by api
   */
  setNormalData(res) {
    if (res['result']) {
      this.storedData = _.cloneDeep(res['result']);
      let tempArray;
      tempArray = [];
      if (this.storedData.length > 1) {
        for (let i = 1; i < this.storedData.length; i++) {
          let subTempArray;
          subTempArray = [];
          Object.keys(this.storedData[i]).forEach((k) => {
            let tempList = {};
            if ((this.storedData[i - 1][k] !== this.storedData[i][k]) && !this.keyNameToSkip.includes(k)) {
              tempList = {
                'fieldName': _.startCase(k),
                'previousValue': this.storedData[i][k],
                'currValue': this.storedData[i - 1][k],
                'updateByUserName': this.storedData[i - 1]['updateByUserName'],
                'updateByUserCode': this.storedData[i - 1]['updateByUserCode'],
                'updateByPostName': this.storedData[i - 1]['updateByPostName'],
                'updateByUpdateDate': this.storedData[i - 1]['updateByUpdateDate'],
                'officeName': this.storedData[i - 1]['officeName']
              };
              subTempArray.push(tempList);
            }
          });
          if (subTempArray.length > 0) {
            tempArray.push(subTempArray);
          }
        }
        this.storedData = tempArray;
        if (this.storedData[this.index]) {
          this.dataSource = new MatTableDataSource(this.storedData[this.index]);
          this.setUpdateDate();
        }
        this.dataColumn.next(this.normalColumn.concat(this.subNormalColumn).concat(['updatedBy']));
      }
    }
  }

  // getElementValue (element) {
  //   console.log(element);
  //   console.log(!(element instanceof Number ) && !isNaN(Date.parse(element)) );
  //   return !(element instanceof Number ) && !isNaN(Date.parse(element)) ?
  //           this.datePipe.transform(element, 'dd/MM/yyyy hh:mm:ss a') : element;
  // }

  onPrevious() {
    if (this.index < this.storedData.length - 1) {
      this.index++;
      this.dataSource = new MatTableDataSource(this.storedData[this.index]);
      this.setUpdateDate();
    }
  }

  onNext() {
    if (this.index > 0) {
      this.index--;
      this.dataSource = new MatTableDataSource(this.storedData[this.index]);
      this.setUpdateDate();
    }
  }

  /**
   * @method setUpdateDate
   * @description for setting global updated date for transaction for non-tabular data
   */
  setUpdateDate() {
    if (this.dataSource && this.dataSource.data && (this.dataSource.data.length > 0)) {
      this.updatedDate = this.dataSource.data[0]['updateByUpdateDate'];
    }
  }

  /**
   * @method getFieldName
   * @param element element of mattable row
   * @param keyName name of key contains data
   * @description For checking of a key is type of others or not
   */
  getFieldName(element, keyName) {
    return this.otherFields.includes(keyName) ?
    (this.otherFieldValue.includes(element[keyName]) ?
    this.otherFieldName[keyName] : keyName) : keyName;
  }

}
