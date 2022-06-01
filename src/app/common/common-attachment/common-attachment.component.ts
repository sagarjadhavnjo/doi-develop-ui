import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Attachment } from 'src/app/models/common-attachment';
import { CommonDirective } from '../directive/validation.directive';


@Component({
  selector: 'app-common-attachment',
  templateUrl: './common-attachment.component.html',
  styleUrls: ['./common-attachment.component.css']
})
export class CommonAttachmentComponent implements OnInit {



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
  attachmentTypeList: any[] = [];
  isStampView = false;
  directiveObj = new CommonDirective();

  attachmentTypeCtrl: FormControl = new FormControl();
  dataSourceBrowse = new MatTableDataSource([]);

  @Input() attachemntValue: any[];
  constructor(private toastr: ToastrService, private el: ElementRef) { }

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
            data:''
          });
        } else if (!item.type && item.value && item.viewValue) {
          this.attachmentTypeList.push({ value: item.value, viewValue: item.viewValue });
          this.dataSourceBrowse = new MatTableDataSource(this.brwoseData);
        }
      });
    } else {
      this.attachmentTypeList = [
        { value: '1', viewValue: 'Supporting Document' },
        { value: '2', viewValue: 'Sanction Order' },
        { value: '3', viewValue: 'Others' }];

    }
  }


  onFileSelection(fileSelected) {
    if (fileSelected.target && fileSelected.target.files) {
      this.dataSourceBrowse.data[this.fileBrowseIndex].file =
        fileSelected.target.files[0];
        var files = fileSelected.target.files;
      var file = files[0];
        if (files && file) {
          var reader = new FileReader();
  
          reader.onload =this._handleReaderLoaded.bind(this);
  
          reader.readAsBinaryString(file);
      }
    }
  }

  _handleReaderLoaded(readerEvt) {
    var binaryString = readerEvt.target.result;
    this.dataSourceBrowse.data[this.fileBrowseIndex].data = btoa(binaryString);
      console.log(this.dataSourceBrowse.data[this.fileBrowseIndex]);              
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

}
