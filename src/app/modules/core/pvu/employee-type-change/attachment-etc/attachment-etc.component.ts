import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { cloneDeep } from 'lodash';
import { FormControl } from '@angular/forms';
import { PvuCommonService } from '../../pvu-common/services/pvu-common.service';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { pvuMessage } from 'src/app/shared/constants/pvu/pvu-message.constants';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-attachment-etc',
  templateUrl: './attachment-etc.component.html',
  styleUrls: ['./attachment-etc.component.css']
})
export class AttachmentEtcComponent implements OnInit {

  attachmentTypeCodeCtrl: FormControl = new FormControl();

  allowedFileType = ['jpg', 'jpeg', 'png', 'pdf', 'JPG', 'JPEG', 'PNG', 'PDF'];
  attachmentTypeList: any[] = [];
  dataSourceBrowse = new MatTableDataSource([]);
  totalAttachmentSize: number = 0;
  displayedBrowseColumns = [
    'attachmentTypeId',
    'fileName',
    'browse',
    'uploadedFileName',
    'uploadedBy',
    'action',
  ];
  @Input() trnId: any;
  @Input() viewMode = false;
  @Output() submitClick: EventEmitter<any> = new EventEmitter();
  @Input() statusId = null;
  @Input() attachmentData: any;
  @Input() dialogOpen: boolean = false;

  fileBrowseIndex: any;
  @Input() menuId: any;

  disableUpload = false;
  attachment_type_list: any;
  uploadDirectoryPath: any;


  constructor(
    private toastr: ToastrService,
    private pvuService: PvuCommonService,
    private dialog: MatDialog,
    private el: ElementRef) { }

  ngOnInit(): void {
    if (!this.dialogOpen) {
      this.pvuService.getCurrentUserDetail().then((res) => {
        this.getAttachmentMaster(res['menuId']);
      });
    } else {
      this.getAttachmentMaster(this.menuId);
    }
  }

  /**
     * @description Method called on the click of Submit Button
     */
  onSubmit() {
    this.submitClick.emit();
  }

  /**
    * @description Get Attachment details based on menuId
    * @param menuId menu id
    */
  getAttachmentMaster(menuId) {
    if (menuId) {
      const param = { 'id': menuId };
      this.pvuService.getAttachmentByMenuId(param).subscribe((res) => {
        if (res && res['result'] && res['status'] === 200) {
          cloneDeep( res['result']).forEach(fileObj => {
            const attach = fileObj;
            attach['attachmentTypeName'] = fileObj['attTypeId']['name'];
            attach['attachmentTypeId'] = fileObj['attTypeId']['id'];
            attach['isMandatory'] = fileObj['attTypeId']['isMandatory'];
            delete fileObj['attTypeId'];
            this.attachmentTypeList.push(attach);
          });
          this.dataSourceBrowse = new MatTableDataSource();
          this.getAttachmentData();
        }
      });
    }
  }

  /**
   * @description Get Attachment data
   */
  getAttachmentData() {
    // tslint:disable-next-line: max-line-length
    this.pvuService.getAttachmentList({ 'id': this.trnId }, this.attachmentData.moduleName).subscribe((res) => {
      if (res && res['status'] === 200 && res['result'] && (res['result'].length > 0)) {
        const resultObject = cloneDeep(res['result']);
        this.totalAttachmentSize = 0;
        resultObject.forEach((resAttach) => {
          this.totalAttachmentSize += resAttach.uploadFileSize;
        });
        this.dataSourceBrowse = new MatTableDataSource(resultObject);
      } else {
        this.dataSourceBrowse = new MatTableDataSource();
        this.addBrowse();
      }
    },
      (err) => {
        this.dataSourceBrowse = new MatTableDataSource();
        this.addBrowse();
        this.toastr.error(err);
      });
  }


  openFileSelector(index) {
    this.el.nativeElement.querySelector('#fileBrowse').click();
    this.fileBrowseIndex = index;
  }

  /**
   * @description Validate File on file selection
   * @param fileSelected selected file
   */
  onFileSelection(fileSelected) {
    let valid = true;
    const fileExtension = fileSelected.target.files[0].name.split('.').pop().toLowerCase();
    const fileSizeInKb = fileSelected.target.files[0].size / Math.pow(1024, 1);
    if (fileSelected.target.files[0].size > 2000000) {
      valid = false;
      this.toastr.error('File Size Exceed Limit of 2MB.');
    } else if (this.allowedFileType.indexOf(fileExtension) < 0) {
      valid = false;
      this.toastr.error('File extension is not supported.');
    }
    if (valid) {
      this.totalAttachmentSize += fileSizeInKb;
      this.dataSourceBrowse.data[this.fileBrowseIndex].file = fileSelected.target.files[0];
      this.dataSourceBrowse.data[this.fileBrowseIndex].uploadFileName = fileSelected.target.files[0].name;
    }
  }

  /**
   * @description Remove just the file and not the whole row
   * @param item item
   * @param index index
   */
  removeFile(item, index?): boolean {
    if (item.id && item.id !== 0) {
      this.pvuService.deleteAttachment({ id: item.id }, this.attachmentData.moduleName).subscribe((res) => {
        if (res && res['status'] === 200) {
            this.dataSourceBrowse.data.splice(index, 1);
            this.dataSourceBrowse = new MatTableDataSource(this.dataSourceBrowse.data);
            if (this.dataSourceBrowse && this.dataSourceBrowse.data && this.dataSourceBrowse.data.length < 1) {
              this.addBrowse();
            }
          this.toastr.success(res['message']);
          return true;
        } else {
          this.toastr.error(res['message']);
          return false;
        }
      },
        (err) => {
          this.toastr.error(err);
          return false;
        }
      );
    } else {
      this.dataSourceBrowse.data.forEach((file, i) => {
        if (i === index) {
          file.uploadedBy = '';
          file.size = 0;
          file.uploadFileName = '';
          file.file = null;
          return true;
        }
      });
    }

    return true;
  }

  /**
   * @description Add row for adding attachment
   */
  addBrowse() {
    if (this.dataSourceBrowse && this.dataSourceBrowse.data && this.dataSourceBrowse.data.length > 0) {
      const data = this.dataSourceBrowse.data[this.dataSourceBrowse.data.length - 1];
      if (data
        // && data.fileName // Removed for non madatory check
        && data.uploadFileName) {
        if (this.totalAttachmentSize < 10240000) {
          this.addNewRow();
          this.disableUpload = false;
        } else {
          this.toastr.error('Total attachment size exceed alloted limit');
        }
      } else {
        this.toastr.error('Please Select File');
      }
    } else {
      this.addNewRow();
    }
  }

  addNewRow() {
    const attachmentType = this.getSelectedFileTypeData();
    const p_data = this.dataSourceBrowse.data;
    p_data.push({
      id: 0,
      attachmentTypeId: attachmentType.attachmentTypeId,
      attachmentTypeName: attachmentType.attachmentTypeName,
      file: '',
      fileName: '',
      uploadDirectoryPath: attachmentType.uploadDirectoryPath,
      uploadFileName: '',
      uploadedBy: '',
      isMandatory: attachmentType.isMandatory,
      fileSize: attachmentType.fileSize,
      format: attachmentType.format,
      menuId: attachmentType.menuId,
    });
    this.dataSourceBrowse.data = p_data;
  }

  /**
   * @description Delete entire row attachment details
   * @param index index of the row
   * @param item item
   */
  deleteBrowse(index, item) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '360px',
      data: pvuMessage.DELETE
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        const self = this;
        if (item && item.documentId && (item.documentId !== 0) && item.id !== 0) {
          // tslint:disable-next-line:max-line-length
          this.pvuService.deleteAttachment({ 'id': item.id }, this.attachmentData.moduleName).subscribe((res) => {
            if (res && res['status'] === 200) {
              this.dataSourceBrowse.data.splice(index, 1);
              this.dataSourceBrowse = new MatTableDataSource(this.dataSourceBrowse.data);
              self.toastr.success(res['message']);
            } else {
              self.toastr.error(res['message']);
            }
          }, (err) => {
            self.toastr.error(err);
          });
        } else {
          this.dataSourceBrowse.data.splice(index, 1);
          this.dataSourceBrowse = new MatTableDataSource(this.dataSourceBrowse.data);
        }
      }
    });
  }

  /**
   * @description Check if it is mandatory to upload a file
   * @returns boolean flag
   */
  checkForMandatory() {
    let flag = true;
    this.dataSourceBrowse.data.forEach(obj => {
      if (obj.isMandatory === 'YES') {
        if (!obj.id) {
          flag = false;
        }
      }
    });
    if (!flag) {
      this.toastr.error('Please attach mandatory documents and Upload the same!');
    }
    return flag;
  }

  /**
   * @description Save/Upload Attachment Details
   */
  saveAttachmentTab() {
    let valid = true;
    const formData = new FormData();
    const filesArray = this.dataSourceBrowse.data.filter(item => item.id === 0);
    if (filesArray.length === 0) {
      this.toastr.error('Please add atleast one record !');
      valid = false;
    } else {
      filesArray.forEach((element) => {
        if (!((element.file && element.file !== '')
        // && (element.fileName && element.fileName !== '')  // Removed for non madatory check
        )) {
          valid = false;
        }
      });
      if (!valid) {
        this.toastr.error('Please Select a file');
      }
    }
    if (valid) {
      filesArray.forEach((element, index) => {
        formData.append('objList[' + index + '].attachment', element.file, element.file.name);
        formData.append('objList[' + index + '].attachmentTypeId', element.attachmentTypeId);
        formData.append('objList[' + index + '].statusId', '205');
        formData.append('objList[' + index + '].fileSize', element.fileSize);
        formData.append('objList[' + index + '].transactionId', this.trnId);
        formData.append('objList[' + index + '].format', element.format);
        formData.append('objList[' + index + '].uploadDirectoryPath', element.uploadDirectoryPath);
        formData.append('objList[' + index + '].menuId', element.menuId);
        formData.append('objList[' + index + '].formAction', 'DRAFT');
        formData.append('objList[' + index + '].fileName', element.fileName);
        formData.append('objList[' + index + '].uploadFileName', element.uploadFileName);
      });
      this.disableUpload = true;
      this.pvuService.uploadAttachment(formData, this.attachmentData.moduleName).subscribe((res) => {
        if (res && res['status'] === 200) {
          this.toastr.success('File Uploaded Successfully.');
          this.getAttachmentData();
        } else {
          this.toastr.error(res['message']);
        }
        this.disableUpload = false;
      },
        (err) => {
          this.toastr.error(err);
          this.disableUpload = false;
        });
    }
  }

  /**
   * @description View Attachment
   * @param attachment  attachment
   */
  viewAttachment(attachment) {
    const param = {
      'documentDataKey': attachment.documentId,
      'fileName': attachment.uploadFileName
    };
    this.pvuService.viewAttachment(param).subscribe((res) => {
      if (res) {
        const resultObj = res['result'];
        const imgNameArray = attachment.uploadFileName.split('.');
        const imgType = imgNameArray[imgNameArray.length - 1];
        let docType;
        if (imgType.toLowerCase() === 'pdf') {
          docType = 'application/pdf';
        } else if (imgType.toLowerCase() === 'png') {
          docType = 'image/png';
        } else if (imgType.toLowerCase() === 'jpg') {
          docType = 'image/jpg';
        } else if (imgType.toLowerCase() === 'jpeg') {
          docType = 'image/jpeg';
        }

        const byteArray = new Uint8Array(atob(resultObj['fileSrc']).split('').map(char => char.charCodeAt(0)));
        const blob = new Blob([byteArray], { type: docType });
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(blob, res['result']['fileName']);
        } else {
          const url = window.URL.createObjectURL(blob);
          window.open(url, '_blank');
        }
      }
    }, (err) => {
      this.toastr.error(err);
    });

  }

  /**
   * @description Download Attachment
   * @param params attachment details
   */
  downloadAttachFile(params) {
    const ID = {
      'documentDataKey': params.documentId,
      'fileName': params.uploadFileName
    };
    this.pvuService.downloadAttachment(ID).subscribe((res) => {
      const url = window.URL.createObjectURL(res);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', '' + params.uploadFileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    },
      (err) => {
        this.toastr.error(err);
      });
  }

  getSelectedFileTypeData(id?) {
    if (id) {
      const arr = this.attachmentTypeList.filter((ele) => ele.attachmentTypeId === id);
      return arr.length > 0 ? arr[0] : {};
    } else {
      return this.attachmentTypeList[0] ? this.attachmentTypeList[0] : {};
    }
  }
  /**
   * @description Set the data on selection of file
   * @param object item
   * @param number index
   */
  onAttachmentTypeChange(item, index) {
    try {
      const getCurrentFileTypeInfo = this.getSelectedFileTypeData(
        item.attachmentTypeId
      );
      this.dataSourceBrowse.data.forEach((data, indexTable) => {
        if (indexTable === index) {
          const isBigger = data['uploadFileSize'] > getCurrentFileTypeInfo.fileSize;
          data['uploadDirectoryPath'] =
            getCurrentFileTypeInfo.uploadDirectoryPath;
          data['fileSize'] = getCurrentFileTypeInfo.fileSize;
          data['format'] = getCurrentFileTypeInfo.format;
          data['menuId'] = getCurrentFileTypeInfo.menuId;
          data['attCtegryId'] = getCurrentFileTypeInfo.attCtegryId;
          data['fileName'] = isBigger ? '' :  data['fileName'];
          data['file'] = isBigger ? null : data['file'];
          data['uploadFileName'] = isBigger ? '' : data['uploadedFileName'];
        }
      });
    } catch (error) {
      this.toastr.error(error);
    }
  }

}
