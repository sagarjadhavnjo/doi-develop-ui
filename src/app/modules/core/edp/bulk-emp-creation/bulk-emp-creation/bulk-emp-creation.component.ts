import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { CommonWorkflowService } from '../../../common/workflow-service/common-workflow.service';
import * as _ from 'lodash';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Subscription } from 'rxjs';
import { OkDialogComponent } from 'src/app/shared/components/ok-dialog/ok-dialog.component';
import { map } from 'rxjs/operators';
import { MESSAGES } from '../constants/messages.constants';
import { BulkEmpCreationService } from '../bulk-emp-creation.service';



@Component({
    selector: 'app-bulk-emp-creation',
    templateUrl: './bulk-emp-creation.component.html',
    styleUrls: ['./bulk-emp-creation.component.css']
})
export class BulkEmpCreationComponent implements OnInit {

    msg = MESSAGES;
    viewableExtension: ['xls', 'xlsx'];
    isEdit: boolean = false;
    isUploadDisabled: boolean = true;

    refNo;
    refDate;

    fileBrowseIndex: number;
    totalAttachmentSize = 0;
    menuId: number = 0;
    linkMenuId: number = 0;
    lkPoOffUserId: number = 0;
    userId: number = 0;
    hdrId: number = 0;
    userName: string = '';
    subscribeParams: Subscription;

    dataSourceBrowse = new MatTableDataSource([]);
    displayedBrowseColumns = ['title', 'browse', 'fileName', 'action'];
    @ViewChild('attachment', { static: true }) attachment: ElementRef;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        public dialog: MatDialog,
        private toastr: ToastrService,
        private el: ElementRef,
        private workflowService: CommonWorkflowService,
        private storageService: StorageService,
        private activatedRoute: ActivatedRoute,
        private apiService: BulkEmpCreationService,
    ) { }

    ngOnInit() {
        this.getUserDetails();
        this.getSingleRow();
    }

    /**
     * @description get login user details
     */
    getUserDetails() {
        this.userName = this.storageService.get('userName');
        this.workflowService.getCurrentUserDetail().then(res => {
            if (res) {
                this.menuId = res['menuId'];
                this.linkMenuId = res['linkMenuId'] ? res['linkMenuId'] : this.menuId;
                this.lkPoOffUserId = res['lkPoOffUserId'];
                this.userId = res['userId'];
            }
        });
    }

    /**
     * @description get table row
     */
    getSingleRow() {
        this.dataSourceBrowse = new MatTableDataSource([]);
        const tableData = [{
            attachmentId: 0,
            file: '',
            fileName: '',
            uploadDirectoryPath: 'IFMS_DOC',
            uploadedFileName: '',
            fileSize: 10240,
            format: 'xls,xlsx',
        }];
        this.dataSourceBrowse = new MatTableDataSource(tableData);
    }

    /**
    * @description Open file selector
    */
    browseClick(index: number) {
        if (this.dataSourceBrowse.data[index].attachmentId) {
            const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                width: '360px',
                data: MESSAGES.DELETE_FILE
            });
            dialogRef.afterClosed().subscribe(confirmationResult => {
                if (confirmationResult === 'yes') {
                    const param = {
                        'attachmentId': this.dataSourceBrowse.data[index].attachmentId,
                        'menuId': this.linkMenuId
                    };
                    this.workflowService.attachmentDelete(param).subscribe((res) => {
                        if (res && res['status'] === 200 && res['result'] === true) {
                            this.dataSourceBrowse.data[index].uploadedFileName = '';
                            this.dataSourceBrowse.data[index].attachmentId = 0;
                            this.dataSourceBrowse.data[index].uploadDirectoryPath = 'IFMS_DOC';
                            this.isUploadDisabled = true;
                            this.openFileSelector(index);
                        }
                    },
                        (err) => {
                            this.toastr.error(err);
                        });
                }
            });
        } else {
            this.openFileSelector(index);
        }
    }

    /**
    * @description Open file selector
    */
    openFileSelector(index: number) {
        this.el.nativeElement.querySelector('#fileBrowse').click();
        this.fileBrowseIndex = index;
    }

    /**
     * @description Validate File on file selection
     * @param fileSelected selected file
     */
    onFileSelection(fileSelected: any) {
        let valid = true;
        const fileExtension = fileSelected.target.files[0].name.split('.').pop().toLowerCase();
        const fileSizeInKb = fileSelected.target.files[0].size / Math.pow(1024, 1);
        const fileSupportedExtension = this.dataSourceBrowse.data[this.fileBrowseIndex].format;
        const extensionArray = fileSupportedExtension.split(',');
        if (fileSelected.target.files[0].size > this.dataSourceBrowse.data[this.fileBrowseIndex].fileSize * 1024) {
            valid = false;
            const sizeInMB = this.dataSourceBrowse.data[this.fileBrowseIndex].fileSize / 1024;
            this.toastr.error(MESSAGES.ERROR_FILE_SIZE + sizeInMB + 'MB.');
        } else if (extensionArray.indexOf(fileExtension) < 0) {
            valid = false;
            this.toastr.error(MESSAGES.ERROR_EXTENSION + extensionArray);
        }
        if (valid) {
            this.totalAttachmentSize += fileSizeInKb;
            this.dataSourceBrowse.data[this.fileBrowseIndex].file = fileSelected.target.files[0];
            this.dataSourceBrowse.data[this.fileBrowseIndex].uploadedFileName = fileSelected.target.files[0].name;
            this.dataSourceBrowse.data[this.fileBrowseIndex].fileExtension = fileExtension.toLowerCase();
            this.dataSourceBrowse.data[this.fileBrowseIndex].uploadedFileSize = fileSizeInKb;
            this.isUploadDisabled = false;
        }
        this.attachment.nativeElement.value = '';
    }

    /**
       * @description This method remove the attached file from data table.
       * @param item Array from which index is to be found
       * @param index key based on which index is to be found
       */
    removeUploadUserFile(item, index) {
        this.dataSourceBrowse.data.forEach((data, indexTable) => {
            if (indexTable === index) {
                data['file'] = null;
                data['uploadedFileName'] = '';
                data['fileExtension'] = '';
                data['uploadedFileSize'] = 0;
                this.isUploadDisabled = true;
            }
        });
    }

    /**
     * @description save form data
     */
    saveHeaderDetail() {
        const param = {};
        return this.apiService.saveTransaction(param).pipe(
            map((resp) => {
                if (resp['status'] === 200 && resp['result']) {
                    const result = resp['result'];
                    this.hdrId = result.becId;
                    return true;
                } else {
                    this.toastr.error(resp['message']);
                    return false;
                }
            }, err => {
                this.toastr.error(err);
                return false;
            }));
    }

    /**
     * @description actions to be taken on upload button click
     */
    uploadClick() {
            if (this.dataSourceBrowse.data[0].file) {
            this.saveHeaderDetail().subscribe((re) => {
                    if (re) {
                        this.saveAttachment();
                    }
                });
            } else {
                this.toastr.error(MESSAGES.ERROR_SELECT_FILE);
            }
    }

    /**
     * @description actions to be taken on submit button click
     */
    submitClick() {
            if (this.dataSourceBrowse.data[0].attachmentId && this.hdrId) {
                               this.submitData( );
            } else {
                this.toastr.error(MESSAGES.ERROR_SELECT_FILE);
            }
        }
    /**
     * @description submit api call
     */
    submitData() {
        try {
        const param = {
            id: this.hdrId
        };
       this.apiService.submitTransaction(param).subscribe((res) => {
        const url = window.URL.createObjectURL(res);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'IFMS_BEC_' + (new Date()).getTime() + '.xlsx');
        document.body.appendChild(link);
        link.click();
        link.remove();
        this.hdrId = null;
        this.getSingleRow();
           },
        (err) => {
          this.toastr.error(err);
        });
    } catch (error) {
      this.toastr.error(error);
    }

}


    /**
    * @description Method to get user uploaded attachments.
    * @returns array object
    */
    getUploadedAttachmentData() {
        try {
            this.dataSourceBrowse = new MatTableDataSource([]);
            const param = {
                'categoryName': 'TRANSACTION',
                'menuId': this.linkMenuId,
                'trnId': this.hdrId,
                'lkPOUId': this.lkPoOffUserId
            };
            this.apiService.getUploadedAttachmentList(param).subscribe((res) => {
                if (res && res['status'] === 200 && res['result']) {
                    const resultObject = _.cloneDeep(res['result']);
                    if (resultObject.length !== 0) {
                        resultObject[0].format = 'xls,xlsx';
                        resultObject[0].fileSize = 10240;
                        this.dataSourceBrowse.data = _.cloneDeep(resultObject);
                        // tslint:disable-next-line: max-line-length
                        if ( this.dataSourceBrowse.data[0].attachmentId &&
                                this.dataSourceBrowse.data[0].uploadedFileName) {
                            this.isUploadDisabled = true;
                        }
                    } else {
                        this.getSingleRow();
                    }
                }
            },
                (err) => {
                    this.toastr.error(err);
                });
        } catch (error) {
            this.toastr.error(error);
        }
    }

    /**
    * @description Save/Upload Attachment Details
    * @returns void
    */
    saveAttachment() {
        let valid = true;
        const formData = new FormData();
        if (!this.dataSourceBrowse.data[0].file) {
            valid = false;
        }

        if (valid) {
            const element = this.dataSourceBrowse.data[0];
            formData.append('attachmentCommonDtoList[0].eventId', '');
            formData.append('attachmentCommonDtoList[0].uploadedFileSize', element.uploadedFileSize);
            formData.append('attachmentCommonDtoList[0].userName', this.userName);
            formData.append('attachmentCommonDtoList[0].attachmentTypeId', '31');
            formData.append('attachmentCommonDtoList[0].categoryId', '501');
            formData.append('attachmentCommonDtoList[0].fileName', '');
            formData.append('attachmentCommonDtoList[0].fileSize', element.fileSize);
            formData.append('attachmentCommonDtoList[0].format', element.fileExtension);
            formData.append('attachmentCommonDtoList[0].lkPOUId', this.lkPoOffUserId.toString());
            formData.append('attachmentCommonDtoList[0].menuId', this.linkMenuId.toString());
            formData.append('attachmentCommonDtoList[0].trnId', this.hdrId.toString());
            formData.append('attachmentCommonDtoList[0].userId', this.userId.toString());
            formData.append('attachmentCommonDtoList[0].uploadDirectoryPath', element.uploadDirectoryPath);
            formData.append('attachmentCommonDtoList[0].attachment', element.file, element.file.name);
            formData.append('attachmentCommonDtoList[0].uploadedFileName', element.uploadedFileName);
            this.apiService.attachmentUpload(formData).subscribe((res) => {
                if (res && res['status'] === 200) {
                    this.toastr.success(MESSAGES.UPLOAD_SUCCESS);
                    this.getUploadedAttachmentData();
                } else {
                    this.toastr.error(res['message']);
                }
            },
                (err) => {
                    this.toastr.error(err);
                });
        }
    }

    /**
    * @description Download Attachment
    * @param params attachment details
    */
    downLoadUploadedAttachment(params) {
        try {
            const ID = {
                'documentDataKey': params.documentId,
                'fileName': params.uploadedFileName
            };
            this.apiService.downloadAttachment(ID).subscribe((res) => {
                const url = window.URL.createObjectURL(res);
                const link = document.createElement('a');
                link.setAttribute('href', url);
                link.setAttribute('download', '' + params.uploadedFileName);
                document.body.appendChild(link);
                link.click();
                link.remove();
            },
                (err) => {
                    this.toastr.error(err);
                });
        } catch (error) {
            this.toastr.error(error);
        }
    }

    /**
    * @description Close Button Click
    */
    goToDashboard() {
        const proceedMessage = MESSAGES.CLOSE;
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '360px',
            data: proceedMessage
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                this.router.navigate(['/dashboard'], { skipLocationChange: true });
            }
        });
    }
}
