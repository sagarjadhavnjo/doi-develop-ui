import { Component, OnInit, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject, Subscription, BehaviorSubject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PvuCommonService } from '../../pvu-common/services/pvu-common.service';
import { COMMON_APIS } from '../../pvu-common';
import { pvuMessage } from 'src/app/shared/constants/pvu/pvu-message.constants';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { CommonService } from 'src/app/modules/services/common.service';

@Component({
    selector: 'app-rop-attachment',
    templateUrl: './rop-attachment.component.html',
    styleUrls: ['./rop-attachment.component.css']
})
export class RopAttachmentComponent implements OnInit {
    isCreator;
    attachmentTypeCtrl: FormControl = new FormControl();

    attachmentMenuData;
    userName;
    totalAttachmentSize;
    subscribeParams: Subscription;
    action;
    isView = false;
    disableUpload = false;
    attachData = [];
    attachment_type_list = [];
    uploadDirectoryPath;
    deleteUploaded: boolean;

    @Input() attachmentData: any;
    @Input() transactionId: any;
    @Input() statusId;
    @Input() isAuditor;
    @Input() isPvuApprover;
    @Input() isPrintEnable;

    @Input() dialogOpen = false; // for event tab changes
    @Input() dialogLinkMenuId: number = 0; // for event tab changes

    @Output() submitRopEvent: EventEmitter<any> = new EventEmitter();
    @Output() printRopEvent: EventEmitter<any> = new EventEmitter();
    @Output() viewCommmentsRopEvents: EventEmitter<any> = new EventEmitter();

    attachmentTypeIdCtrl: FormControl = new FormControl();
    filteredAttachmentType: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    valueChanged: boolean = false;
    browseData: any[] = [{
        name: undefined,
        file: undefined,
        id: 0,
        attachmentTypeId: 18,
        // upoadedBy: this.userName,
        delete: false
    }];

    displayedBrowseColumns = ['attachmentTypeName', 'fileName', 'browse', 'uploadFileName', 'uploadedBy', 'action'];
    variableClm = new BehaviorSubject<string[]>(['noData']);
    allowedFileType = ['jpg', 'jpeg', 'png', 'pdf', 'JPG', 'JPEG', 'PNG', 'PDF'];
    dataSourceBrowse = new MatTableDataSource(this.browseData);
    fileBrowseIndex: number;

    constructor(
        private el: ElementRef,
        private toastr: ToastrService,
        private httpClient: HttpClient,
        private pvuService: PvuCommonService,
        private storageService: StorageService,
        public router: Router,
        private dialog: MatDialog,
        private commonService: CommonService,
        private activatedRoute: ActivatedRoute) { }

    ngOnInit() {
        this.userName = this.storageService.get('userName');
        this.totalAttachmentSize = 0;
        /**
         * condition to check if the user is Auditor or pvuApprover
         * if the user is not user and approver then browse column will come and vice verse
         */
        if (this.isAuditor || this.isPvuApprover) {
            this.displayedBrowseColumns = [
                'attachmentTypeName', 'fileName', 'uploadFileName', 'uploadedBy', 'action'
            ];
        } else {
            this.displayedBrowseColumns = [
                'attachmentTypeName', 'fileName', 'browse', 'uploadFileName', 'uploadedBy', 'action'
            ];
        }
        if (!this.dialogOpen) {
            /**
             * To get the current user details
             */
            this.pvuService.getCurrentUserDetail().then((res) => {
                this.getAttachmentMaster(this.commonService.getLinkMenuId());
            });
            this.subscribeParams = this.activatedRoute.params.subscribe(resRoute => {
                this.action = resRoute.action;
                if (this.action === 'view') {
                    this.isView = true;
                }
            });
        } else {
            // This code is for rop event view from employee creation event tab
            this.action = 'view';
            this.isView = true;
            this.getAttachmentMaster(this.dialogLinkMenuId);
        }
    }

    /**
     * to get the the rows for mandatory and non mandatory Documents upload
     * @param menuId parameter to get the list of mandatory and non madatory documents
     */

    getAttachmentMaster(menuId) {
        if (menuId) {
            const param = { 'id': menuId };
            this.pvuService.getAttachmentByMenuId(param).subscribe((res) => {
                if (res && res['result'] && res['status'] === 200) {
                    res['result'].forEach(fileObj => {
                        const attach = fileObj;
                        attach['fileName'] = '';
                        attach['uploadFileName'] = '';
                        attach['uploadedBy'] = '';
                        //  attach['uploadDirectoryPath'] = '';
                        attach['file'] = null;
                        attach['id'] = 0;
                        attach['attachmentTypeName'] = fileObj['attTypeId']['name'];
                        attach['attachmentTypeId'] = fileObj['attTypeId']['id'];
                        attach['isMandatory'] = fileObj['attTypeId']['isMandatory'];
                        this.attachData.push(attach);

                        this.attachment_type_list.push(fileObj.attTypeId);
                        this.uploadDirectoryPath = fileObj['uploadDirectoryPath'];
                    });
                    this.variableClm.next(this.displayedBrowseColumns);
                    this.dataSourceBrowse = new MatTableDataSource(_.cloneDeep(this.attachData));
                    this.getAttachmentData();
                } else {
                    this.variableClm.next(['noData']);
                    this.dataSourceBrowse = new MatTableDataSource(['noData']);
                }
            }, (err) => {
                this.toastr.error(err);
                this.variableClm.next(['noData']);
                this.dataSourceBrowse = new MatTableDataSource(['noData']);
            });
        }
    }

    onSupportingDocValueCHange() {
        this.valueChanged = true;
    }

    onFileNameChange() {
        this.valueChanged = true;
    }

    findArrayIndex(itemArray, keyName, selectedValue) {
        const selectedIndex = itemArray.findIndex(x => x[keyName] === selectedValue);
        return itemArray[selectedIndex];
    }

    /**
     * To get the the list of documents which are uploaded
     */

    getAttachmentData() {
        this.getAttachmentList({ 'id': this.transactionId }).subscribe((res) => {
            if (res && res['status'] === 200 && res['result'] && (res['result'].length > 0)) {
                this.deleteUploaded = res['result'].delete;
                const resultObject = _.cloneDeep(res['result']);
                const suppAttachment: any = [];
                let updateAttachment: any = [];
                if (resultObject.length === 0) {
                    updateAttachment = _.cloneDeep(this.attachData);
                } else {
                    if (this.attachData) {
                        this.attachData.forEach((attachmentData, attachindex) => {
                            const data = resultObject.filter(obj => {
                                return attachmentData.attachmentTypeId === obj.attachmentTypeId;
                            });
                            data.forEach((attachData, index) => {
                                const attachDataClone = _.cloneDeep(attachmentData);
                                attachDataClone['fileName'] = attachData.fileName;
                                attachDataClone['id'] = attachData.id;
                                attachDataClone['uploadFileName'] = attachData.uploadFileName;
                                attachDataClone['attachmentTypeId'] = attachData.attachmentTypeId;
                                attachDataClone['attachmentTypeName'] = this.findArrayIndex(
                                    this.attachment_type_list, 'id', attachData.attachmentTypeId).name;
                                attachDataClone['isMandatory'] = this.findArrayIndex(
                                    this.attachment_type_list, 'id', attachData.attachmentTypeId).isMandatory;
                                attachDataClone['file'] = attachData.file;
                                attachDataClone['uploadDirectoryPath'] = this.uploadDirectoryPath;
                                attachDataClone['uploadedBy'] = attachData.uploadedBy;
                                attachDataClone['size'] = attachData.uploadedFileSize;
                                attachDataClone['documentId'] = attachData.documentId;
                                attachDataClone['delete'] = attachData.delete;
                                if (index === 0) {
                                    this.attachData.splice(attachindex, 1, attachDataClone);
                                } else {
                                    suppAttachment.push(attachDataClone);
                                }
                            });
                        });
                        updateAttachment = this.attachData.concat(suppAttachment);
                        this.disableUpload = false;
                    }
                }
                if (!(this.isAuditor || this.isPvuApprover)) {
                    this.variableClm.next(this.displayedBrowseColumns);
                    this.dataSourceBrowse.data = _.cloneDeep(updateAttachment);
                } else {
                    const attachmentData = [];
                    updateAttachment.forEach(attachObj => {
                        if (attachObj.documentId) {
                            attachmentData.push(_.cloneDeep(attachObj));
                        }
                    });
                    if (attachmentData && attachmentData.length !== 0) {
                        this.variableClm.next(this.displayedBrowseColumns);
                        this.dataSourceBrowse.data = _.cloneDeep(attachmentData);
                    } else {
                        this.variableClm.next(['noData']);
                        this.dataSourceBrowse = new MatTableDataSource(['noData']);
                    }
                }
            } else {
                if (this.isAuditor || this.isPvuApprover) {
                    this.variableClm.next(['noData']);
                    this.dataSourceBrowse = new MatTableDataSource(['noData']);
                }
            }
        },
            (attachmentListErr) => {
                this.toastr.error(attachmentListErr);
                this.variableClm.next(['noData']);
                this.dataSourceBrowse = new MatTableDataSource(['noData']);
            });
    }

    /**
     * Trigger when browse button is pressed and open a dialog to select file.
     * Input type file is triggered by this logic
     * @param index  index of the row
     */

    openFileSelector(index) {
        this.el.nativeElement.querySelector('#fileBrowse').click();
        this.fileBrowseIndex = index;
    }

    /**
     * trigered when file is selected for file selection dialog
     * @param fileSelected file details
     * @param index row index
     */

    onFileSelection(fileSelected, index) {
        const fileExtension = fileSelected.target.files[0].name.split('.').pop().toLowerCase();
        const fileSizeInKb = fileSelected.target.files[0].size / Math.pow(1024, 1);
        if (fileSelected.target.files[0].size > 2000000) {
            this.toastr.error('File Size Exceed Limit of 2MB.');
        } else if (this.allowedFileType.indexOf(fileExtension) < 0) {
            this.toastr.error('File extension is not supported.');
        } else {
            this.totalAttachmentSize += fileSizeInKb;
            this.valueChanged = true;
            this.dataSourceBrowse.data[this.fileBrowseIndex].file = fileSelected.target.files[0];
            this.dataSourceBrowse.data[this.fileBrowseIndex].uploadFileName = fileSelected.target.files[0].name;
        }
    }

    /**
     * triggered when file is deleted by the User
     * @param item file details
     * @param index row index
     */

    removeFile(item, index?): boolean {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '360px',
            data: pvuMessage.DELETE
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                if (item.id) {
                    this.deleteFile({ id: item.id }).subscribe((res) => {
                        if (res && res['status'] === 200) {
                            item.id = 0;
                            item.uploadedBy = item.uploadedBy;
                            item.size = 0;
                            item.fileName = item.fileName;
                            item.uploadFileName = '';
                            item.uploadDirectoryPath = item.uploadDirectoryPath;
                            item.file = null;
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
                    this.dataSourceBrowse.data.forEach(file => {
                        if (file.size === item.size && file.uploadFileName === item.uploadFileName &&
                            file.id === item.id) {
                            file.uploadedBy = item.uploadedBy;
                            file.size = 0;
                            file.uploadFileName = '';
                            file.uploadDirectoryPath = item.uploadDirectoryPath;
                            file.file = null;
                            return true;
                        }
                    });
                }

                const i = this.dataSourceBrowse.data.indexOf(index);
                if (i > -1) {
                    this.dataSourceBrowse.data.splice(index, 1);
                }

                return true;
            }
        });

        return false;
    }


    /**
     * To add new row for uploading new Supporting Docs
     */
    addBrowse() {
        if (this.dataSourceBrowse) {
            const data = this.dataSourceBrowse.data[this.dataSourceBrowse.data.length - 1];
            if (data && data.fileName && data.uploadFileName) {
                if (this.totalAttachmentSize < 10240000) {
                    const p_data = this.dataSourceBrowse.data;
                    p_data.push({
                        id: 0,
                        attachmentTypeId: this.findArrayIndex(this.attachment_type_list, 'isMandatory', 'NO').id,
                        attachmentTypeName: this.findArrayIndex(this.attachment_type_list, 'isMandatory', 'NO').name,
                        file: '',
                        fileName: '',
                        uploadDirectoryPath: data.uploadDirectoryPath,
                        uploadFileName: '',
                        uploadedBy: '',
                        fileSize: data.fileSize,
                        format: data.format,
                        menuId: data.menuId,
                    });
                    this.dataSourceBrowse.data = p_data;
                    this.valueChanged = true;
                    this.disableUpload = false;
                }
            } else {
                this.toastr.error('Please fill the detail.');
            }
        }
    }

    /**
     * To Remove the complete row
     * @param index row Index
     * @param item row data
     */

    deleteBrowse(index, item) {
        const self = this;
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '360px',
            data: pvuMessage.DELETE
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                if (item && Number(item.documentId) !== 0) {
                    this.deleteFile({ 'id': item.id }).subscribe((res) => {
                        if (res && res['status'] === 200) {
                            this.dataSourceBrowse.data.splice(index, 1);
                            this.dataSourceBrowse = new MatTableDataSource(this.dataSourceBrowse.data);
                            self.toastr.success(res['message']);
                            // this.disableUpload = true;
                        } else {
                            self.toastr.error(res['message']);
                        }
                    }, (err) => {
                        self.toastr.error(err);
                    });
                } else {
                    this.dataSourceBrowse.data.splice(index, 1);
                    const valueChangeCheckArray = this.dataSourceBrowse.data.filter(data => {
                        return data.documentId === 0;
                    });
                    if (valueChangeCheckArray.length > 0) {
                        self.valueChanged = true;
                    } else {
                        self.valueChanged = false;
                    }
                    this.dataSourceBrowse = new MatTableDataSource(this.dataSourceBrowse.data);
                }
            }
        });

    }

    /**
     * get attachment service call
     * @param params request parameters
     */

    getAttachmentList(params) {
        return this.httpClient.post(
            `${environment.baseUrl}${this.attachmentData.moduleName}${COMMON_APIS.ATTACHMENT.GET_ATTACHMENT}`,
            params);
    }

    /**
     * delete file service
     * @param params request parameters
     */

    deleteFile(params) {
        return this.httpClient.post(
            `${environment.baseUrl}${this.attachmentData.moduleName}${COMMON_APIS.ATTACHMENT.DELETE}`,
            params);
    }

    checkForMandatory() {
        let flag = true;
        this.dataSourceBrowse.data.forEach(obj => {
            if (obj.isMandatory === 'YES') {
                if (!obj.id) {
                    flag = false;
                }
            }
        });
        return flag;
    }

    /**
     * to upload the Files
     */

    saveAttachmentTab() {
        let valid = true;
        this.disableUpload = true;
        const formData = new FormData();
        const filesArray = this.dataSourceBrowse.data.filter(item => item.id === 0 && item.file);
        // if (filesArray.length === 0) {
        //     return false;
        // }

        if (filesArray.length === 0) {
            this.toastr.error('Please add atleast one record !');
            valid = false;
        } else {
            filesArray.forEach((element) => {
                if (!((element.file && element.file !== '') && (element.fileName && element.fileName !== ''))) {
                    valid = false;
                }
            });
            if (!valid) {
                this.toastr.error('Please fill the detail.');
            }
        }
        if (valid) {
            filesArray.forEach((element, index) => {
                if (!((element.file && element.file !== '') && (element.fileName && element.fileName !== ''))) {
                    valid = false;
                }
                formData.append('objList[' + index + '].attachmentTypeId', element.attachmentTypeId);
                formData.append('objList[' + index + '].statusId', '205');
                formData.append('objList[' + index + '].fileSize', element.fileSize);
                formData.append('objList[' + index + '].transactionId', this.transactionId);
                formData.append('objList[' + index + '].format', element.format);
                formData.append('objList[' + index + '].uploadDirectoryPath', element.uploadDirectoryPath);
                formData.append('objList[' + index + '].menuId', element.menuId);
                formData.append('objList[' + index + '].formAction', 'DRAFT');
                formData.append('objList[' + index + '].fileName', element.fileName);
                formData.append('objList[' + index + '].uploadFileName', element.uploadFileName);
                formData.append('objList[' + index + '].attachment', element.file);
            });
            this.saveAttachment(formData).subscribe((res) => {
                if (res && res['status'] === 200) {
                    this.toastr.success('File Uploaded Successfully.');
                    this.valueChanged = false;
                    this.getAttachmentData();
                } else {
                    this.toastr.error(res['message']);
                }
            },
                (err) => {
                    this.toastr.error(err);
                });
        } else {
            this.toastr.error('Please fill the detail.');
        }
    }

    /**
     * upload file service call
     * @param params request parameters
     */

    saveAttachment(params) {
        return this.httpClient.post(
            `${environment.baseUrl}${this.attachmentData.moduleName}${COMMON_APIS.ATTACHMENT.UPLOAD}`,
            params);
    }

    /**
     * To view the file
     * @param attachment file
     */

    viewAttachment(attachment) {
        const param = {
            'documentDataKey': attachment.documentId,
            'fileName': attachment.uploadFileName
        };
        this.httpClient.post(
            `${environment.baseUrl}${COMMON_APIS.ATTACHMENT.VIEW}`,
            param
        ).subscribe((res) => {
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
     * To Download the attachment File
     * @param params document id and file name
     */

    downloadAttachFile(params) {
        const ID = {
            'documentDataKey': params.documentId,
            'fileName': params.uploadFileName
        };
        this.httpClient.post(`${environment.baseUrl}${COMMON_APIS.ATTACHMENT.DOWNLOAD}`,
            ID,
            { responseType: 'blob' as 'json' }).subscribe((res) => {
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

    getAttachmentValueChange() {
        return this.valueChanged;
    }

    goToDashboard() {
        if (!this.dialogOpen) {
            this.router.navigate(['']);
        } else {
            this.dialog.closeAll();
        }
    }

    viewComments() {
        this.viewCommmentsRopEvents.emit();
    }

    saveRopDetails(data) {
        this.submitRopEvent.emit();
    }

    goToListing() {
        this.router.navigate(['/dashboard/pvu/rop'], { skipLocationChange: true });
    }

    print() {
        this.printRopEvent.emit();
    }

}
