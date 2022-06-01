import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { RouteService } from 'src/app/shared/services/route.service';
import { PvuCommonService } from './../services/pvu-common.service';
import { Component, OnInit, ElementRef, Input, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { ReplaySubject, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Router, ActivatedRoute } from '@angular/router';
import { pvuMessage } from 'src/app/shared/constants/pvu/pvu-message.constants';

@Component({
    selector: 'app-attachment-pvu',
    templateUrl: './attachment-pvu.component.html',
    styleUrls: ['./attachment-pvu.component.css']
})
export class AttachmentPvuComponent implements OnInit {

    attachmentTypeCtrl: FormControl = new FormControl();

    attachmentMenuData;
    userName: string = '';
    totalAttachmentSize;
    subscribeParams: Subscription;
    action;
    isView = false;
    disableUpload = false;
    attachData = [];
    attachment_type_list = [];
    uploadDirectoryPath;
    @Input() showSubmit = false;
    @Input() viewAttachmentOnly = false;
    @Input() attachmentData: any;
    @Input() transactionId: any;
    @Input() statusId;
    @Input() dialogOpen = false;
    @Input() dialogLinkMenuId: number = 0;
    @Output() dialogClose: EventEmitter<any> = new EventEmitter();
    // tslint:disable-next-line: no-output-on-prefix
    @Output() onSubmitClick: EventEmitter<any> = new EventEmitter();
    // tslint:disable-next-line: no-output-on-prefix
    @Output() onListClickEmit: EventEmitter<any> = new EventEmitter();
    attachmentTypeIdCtrl: FormControl = new FormControl();
    filteredAttachmentType: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    valueChanged = false;
    browseData: any[] = [{
        name: undefined,
        file: undefined,
        id: 0,
        attachmentTypeName: '',
        // upoadedBy: this.userName
    }];

    displayedBrowseColumns = ['attachmentTypeName', 'fileName', 'browse', 'uploadFileName', 'uploadedBy', 'action'];
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
        private activatedRoute: ActivatedRoute,
        private routeService: RouteService) { }

    ngOnInit() {
        this.userName = this.storageService.get('userName');
        this.totalAttachmentSize = 0;
        if (!this.dialogOpen) {
            this.pvuService.getCurrentUserDetail().then((res) => {
                this.getAttachmentMaster(res['menuId']);
            });
            this.subscribeParams = this.activatedRoute.params.subscribe(resRoute => {
                this.action = resRoute.action;
                if (this.action === 'view') {
                    this.isView = true;
                } else if (this.viewAttachmentOnly) {
                    this.isView = true;
                }
            });
        } else {
            this.action = 'view';
            this.isView = true;
            this.getAttachmentMaster(this.dialogLinkMenuId);
        }
    }

    /**
     * @description Method called on the click of Submit Button
     */
    onSubmit() {
        this.onSubmitClick.emit();
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

                    res['result'].forEach(fileObj => {
                        const attach = fileObj;
                        attach['fileName'] = '';
                        attach['uploadFileName'] = '';
                        attach['uploadedBy'] = this.userName;
                        attach['file'] = null;
                        attach['id'] = 0;
                        attach['attachmentTypeName'] = fileObj['attTypeId']['name'];
                        attach['attachmentTypeId'] = fileObj['attTypeId']['id'];
                        attach['isMandatory'] = fileObj['attTypeId']['isMandatory'];
                        this.attachData.push(attach);

                        this.attachment_type_list.push(fileObj.attTypeId);
                        this.uploadDirectoryPath = fileObj['uploadDirectoryPath'];
                    });
                    this.dataSourceBrowse = new MatTableDataSource(_.cloneDeep(this.attachData));
                    this.getAttachmentData();
                }
            });
        }
    }

    /**
     * @description Method invoked if file name changes
     */
    onFileNameChange() {
        this.valueChanged = true;
    }

    /**
     * @description Method to find array index
     * @param itemArray Array from which index is to be found
     * @param keyName key based on which index is to be found
     * @param selectedValue selected value based on which index is to be found
     * @returns array object
     */
    findArrayIndex(itemArray, keyName, selectedValue) {
        const selectedIndex = itemArray.findIndex(x => x[keyName] === selectedValue);
        return itemArray[selectedIndex];
    }

    /**
     * @description Get Attachment data
     */
    getAttachmentData() {
        // tslint:disable-next-line: max-line-length
        this.pvuService.getAttachmentList({ 'id': this.transactionId }, this.attachmentData.moduleName).subscribe((res) => {
            if (res && res['status'] === 200 && res['result'] && (res['result'].length > 0)) {
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
                                // tslint:disable-next-line: max-line-length
                                attachDataClone['attachmentTypeName'] = this.findArrayIndex(this.attachment_type_list, 'id', attachData.attachmentTypeId).name;
                                // tslint:disable-next-line: max-line-length
                                attachDataClone['isMandatory'] = this.findArrayIndex(this.attachment_type_list, 'id', attachData.attachmentTypeId).isMandatory;
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
                    }
                }
                this.dataSourceBrowse.data = _.cloneDeep(updateAttachment);
            }
        },
            (err) => {
                this.toastr.error(err);
            });
    }

    /**
     * @description Open File Selector on the click of browse button
     * @param index index of the row
     */
    openFileSelector(index) {
        this.fileBrowseIndex = index;
        this.el.nativeElement.querySelector('#fileBrowse').click();
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
            this.valueChanged = true;
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
        if (item.id) {
            this.pvuService.deleteAttachment({ id: item.id }, this.attachmentData.moduleName).subscribe((res) => {
                if (res && res['status'] === 200) {
                    item.id = 0;
                    item.uploadedBy = item.uploadedBy;
                    item.size = 0;
                    item.fileName = item.fileName;
                    item.uploadFileName = '';
                    item.uploadDirectoryPath = item.uploadDirectoryPath;
                    item.file = null;
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
            // tslint:disable-next-line:no-shadowed-variable
            this.dataSourceBrowse.data.forEach((file, i) => {
                if (file.size === item.size && file.uploadFileName === item.uploadFileName &&
                    file.id === item.id && i === index ) {
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

    /**
     * @description Add row for adding attachment
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
                        uploadedBy: this.userName,
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
                if (item && item.documentId && (item.documentId !== 0)) {
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
        const filesArray = this.dataSourceBrowse.data.filter(item => item.id === 0 && item.file);
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
                // formData.append('objList[' + index + '].file',
                //     (element.file ? element.file : ''),
                //     // Adding a Another Parameter is a workaround for IE Attachment Issue
                //     (element.file.name ? element.file.name : ''));
                formData.append('objList[' + index + '].attachment', element.file, element.file.name);
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
                // formData.append('objList[' + index + '].attachment', element.file);
            });
            this.disableUpload = true;
            this.pvuService.uploadAttachment(formData, this.attachmentData.moduleName).subscribe((res) => {
                if (res && res['status'] === 200) {
                    this.toastr.success('File Uploaded Successfully.');
                    this.valueChanged = false;
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

    /**
     * @description Check if there are any changes in attachment tab
     * @returns boolean value
     */
    getAttachmentValueChange() {
        return this.valueChanged;
    }

    /**
     * @description Emit event to navigate to list page
     */
    OnListClick() {
        this.onListClickEmit.emit();
    }

    /**
     * @description Navigate to dashboard
     */
    goToDashboard() {
        if (!this.dialogOpen) {
            this.router.navigate([this.routeService.getPreviousUrl()], { skipLocationChange: true });
        } else {
            this.dialogClose.emit();
        }
    }

}
