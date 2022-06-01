import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {  MatTableDataSource } from '@angular/material/table';
import {  MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { DataService } from 'src/app/common/data.service';
import { CommonDirective } from 'src/app/common/directive/validation.directive';
import { Attachment } from 'src/app/models/common-attachment';
import { CommonListing } from 'src/app/models/common-listing';

@Component({
  selector: 'app-upload-provision',
  templateUrl: './upload-provision.component.html',
  styleUrls: ['./upload-provision.component.css']
})
export class UploadProvisionComponent implements OnInit {

  private attachmentUploaded = new Subject();

  brwoseData: Attachment[] = [
    {
      attachmentType: '',
      fileName: undefined,
      file: undefined,
      uploadedBy: 'Mr. Rakesh Patel'
    }
  ];

  fileBrowseIndex: number;
  displayedBrowseColumns = [
    'srNo',
    'attachmentType',
    'fileName',
    'browse',
    'uploadedFileName',
    'uploadedBy',
    'action'
  ];

  attachemntValue: any[] = [
    { value: '01', viewValue: 'Supporting Document' },
    { value: '02', viewValue: 'Sanction Order' },
    { value: '03', viewValue: 'Others' },
  ];
  attachmentTypeList: CommonListing[] = [];
  isStampView = false;
  isNps = false;
  directiveObj = new CommonDirective();

  attachmentTypeCtrl: FormControl = new FormControl();
  dataSourceBrowse = new MatTableDataSource([]);
  constructor(private toastr: ToastrService, private el: ElementRef, private data: DataService,
    public dialogRef: MatDialogRef<UploadProvisionComponent>,) { }

  ngOnInit() {
    if (this.attachemntValue) {
      this.attachemntValue.forEach(item => {

        if (item.type === 'stamp-view') {
          this.isStampView = true;
          this.displayedBrowseColumns = [
            'srNo',
            'attachmentType',
            'fileName',
            'uploadedBy',
            'action'
          ];
          this.dataSourceBrowse.data.push({
            attachmentType: item.attachmentType,
            fileName: 'PAN.pdf',
            file: '',
            uploadedBy: 'Mr. Rakesh Patel',
          });
        } else if (item.type === 'nps-pran-upload') {
          this.isNps = true;
          this.displayedBrowseColumns = [
            // 'srNo',
            'attachmentType',
            'fileName',
            'browse',
            'uploadedFileName',
            'uploadedBy',
          ];
          this.attachmentTypeList = [
            { value: '1', viewValue: 'NSDL PRAN File' },
          ];
          this.dataSourceBrowse = new MatTableDataSource(this.brwoseData);
        } else if (item.type === 'nps-legacy-upload') {
          this.displayedBrowseColumns = [
            // 'srNo',
            'attachmentType',
            'fileName',
            'browse',
            'uploadedFileName',
            'uploadedBy',
          ];
          this.attachmentTypeList = [
            { value: '1', viewValue: 'Legacy Excel File' },
          ];
          this.dataSourceBrowse = new MatTableDataSource(this.brwoseData);
        } else if (!item.type && item.value && item.viewValue) {
          this.attachmentTypeList.push({ value: item.value, viewValue: item.viewValue });
          this.dataSourceBrowse = new MatTableDataSource(this.brwoseData);
        } else if (item.type === 'lf') {
          this.displayedBrowseColumns = [
            'srNo',
            'attachmentType',
            'fileName',
            'browse',
            'downloadTemplate',
            'uploadedFileName',
            'uploadedBy',
            'action'
          ];
          this.attachmentTypeList = [
            { value: '1', viewValue: 'Online Diary' },
            { value: '2', viewValue: 'Diary Calculation' },
          ];
          this.dataSourceBrowse = new MatTableDataSource(this.brwoseData);
        }
      });
    } else {
      this.attachmentTypeList = [
        { value: '1', viewValue: 'Supporting Document' },
        { value: '2', viewValue: 'Sanction Order' },
        { value: '3', viewValue: 'Others' }];
      this.dataSourceBrowse = new MatTableDataSource(this.brwoseData);

    }
  }


  onFileSelection(fileSelected) {
    if (fileSelected.target && fileSelected.target.files) {
      this.dataSourceBrowse.data[this.fileBrowseIndex].file =
        fileSelected.target.files[0];
    }
  }

  openFileSelector(index) {
    this.el.nativeElement.querySelector('#fileBrowse').click();
    this.fileBrowseIndex = index;
  }

  addBrowse() {
    if (this.dataSourceBrowse) {
      const data = this.dataSourceBrowse.data[
        this.dataSourceBrowse.data.length - 1
      ];
      if (data && data.fileName && data.file && data.attachmentType) {
        const p_data = this.dataSourceBrowse.data;
        p_data.push({
          attachmentType: '',
          fileName: undefined,
          file: '',
          uploadedBy: 'Mr. Rakesh Patel',
        });
        this.dataSourceBrowse.data = p_data;
      } else {
        this.toastr.error('Please fill the detail.');
      }
    }
  }
  onUpload() {
    this.data.setObv('commonAttachment', 'isUploaded');
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
