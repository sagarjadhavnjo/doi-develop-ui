import { Component, OnInit, ElementRef, Input, ViewChild, EventEmitter, Output, OnChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { TabelElement } from '../../model/office-data-model';
import { EdpDdoOfficeService } from '../../services/edp-ddo-office.service';
import { msgConst } from 'src/app/shared/constants/edp/edp-msg.constants';
import { EdpDataConst } from 'src/app/shared/constants/edp/edp-data.constants';
import { environment } from 'src/environments/environment';
import { APIConst } from 'src/app/shared/constants/edp/edp-api.constants';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';

interface UserType {
    isHodUser: number;
    isEdpUser: number;
    isToPaoUser: number;
    isDDOUser: number;
    isAdUser: number;
    isDatUser: number;
    isDatSuperAdmin: number;
    isJD: number;
}
@Component({
    selector: 'app-office-attachment',
    templateUrl: './office-attachment.component.html',
    styleUrls: ['./office-attachment.component.css']
})
export class OfficeAttachmentComponent implements OnInit, OnChanges {

    errorMessages: any = {};
    fileBrowseIndex: number;
    totalAttachmentSize: number;
    attachmentData: TabelElement[] = [];
    noOfAttachment: number = 0;
    noOfAttachmentDept: number = 0;
    toLevelAttachment: any[] = [];
    disableForUpdateOffice: boolean = false;

    userName: string;
    isShown: boolean = false;

    isHodUser: boolean = false;
    isToPaoUser: boolean = false;
    isEdpUser: boolean = false;
    isEnabled: boolean = true;
    isUpload: boolean = true;
    saveDraftEnable;
    transactionDate;
    transactionNo;
    fileArr: number[] = [];
    fileArr1: number[] = [];
    existFileCount: number[] = [];

    fileAttach = [];
    newVar;
    newVarNew;
    attachmentData1;
    officeDivision;
    lastResult;
    lastResult1;
    totalExistFileCount: number;

    officeData;
    // @ViewChild(OfficeCreationComponent) passResult: OfficeCreationComponent;
    displayedBrowseColumns = [
        'sr_no', 'attachmentType', 'fileName', 'browse', 'uploadedFileName', 'uploadedBy', 'action'
    ];
    dataSourceAttachment = new MatTableDataSource(this.attachmentData);
    dataSourceAttachment1 = new MatTableDataSource(this.attachmentData);

    displayedHodAttachmentColumns = [
        'sr_no', 'attachmentName', 'uploadedFileName', 'uploadedByName', 'action'
    ];
    dataSourceHodAttechment = new MatTableDataSource([]);

    displayedToAttachmentColumns = [
        'sr_no', 'attachmentName', 'uploadedFileName', 'uploadedByName', 'action'
    ];
    dataSourceToAttachment = new MatTableDataSource([]);

    selectedFiles: FileList;
    isDATfromWF = false;
    increaseNumber;
    fileNumber = 0;
    toAllowUplodSize: number;
    dispTotalAllowSize: number;

    @Input() officeId;
    @Input() action;
    @Input() userType;
    @Input() userTypeForUpdate: UserType = null;
    @Input() isUpdate;
    @Input() isSubmitDisable: boolean;
    @Input() passResult;
    @Input() isEditAttachment;
    @Input() trnId = 0;
    @Input() fromDetailOfficeSummary: boolean = false;
    @Input() hasWorkFlow: boolean;
    @Input() isRequestTC: boolean;
    @Output() fillMandatoryFields: EventEmitter<any> = new EventEmitter();
    @Output() submitOfficeEvent: EventEmitter<any> = new EventEmitter();
    @Output() viewComment: EventEmitter<any> = new EventEmitter();
    @Output() goToListing: EventEmitter<any> = new EventEmitter();
    @Input() isOfficeSummary: boolean = false;

    constructor(
        private toastr: ToastrService,
        private el: ElementRef,
        private edpDdoOfficeService: EdpDdoOfficeService,
        private httpClient: HttpClient,
        private router: Router,
        private storageService: StorageService,
        public dialog: MatDialog
    ) { }

    ngOnInit() {
        this.isOfficeSummary = this.fromDetailOfficeSummary;
        let data = '';
        let existData = '';
        let newData = '';
        this.userName = this.storageService.get('userName');
        this.errorMessages = msgConst.ATTACHMENT;
        this.totalAttachmentSize = 0;

        this.officeData = this.storageService.get('userOffice');
        this.officeDivision = this.officeData['officeDivision'];
        existData = EdpDataConst.DEPARTMENT_LEVEL_ATTACHMENT;
        this.fileAttach = _.cloneDeep(existData, newData);

        if (this.isUpdate === 'office') {
            this.toAllowUplodSize = EdpDataConst.MAX_FILE_SIZE;
            this.dispTotalAllowSize = this.toAllowUplodSize / Math.pow(1024, 1);
        } else {
            this.toAllowUplodSize = EdpDataConst.MAX_FILE_SIZE_FOR_COMMON;
            this.dispTotalAllowSize = this.toAllowUplodSize / Math.pow(1024, 1);
            if (this.officeData['isHod'] === 2) {
                this.userType = 'hod_user';
                this.isHodUser = true;
            }
            if (this.officeData['isTreasury'] === 2 ||
                this.officeData['officeSubType'] === EdpDataConst.IS_PO_USER
            ) {
                this.userType = 'to_user';
                this.isToPaoUser = true;
            }
            if (this.officeData['officeTypeId'] === 71 && this.officeData['officeSubType'] !== 405) {
                this.isHodUser = true;
            }
            if (this.officeData['officeTypeId'] === 52) {
                this.isHodUser = true;
            }
        }
        if (this.userType === 'hod_user') {
            this.isHodUser = true;
            if (this.isUpdate === 'office-update') {
                data = '';
                newData = '';
                this.isShown = true;
                this.isSubmitDisable = false;
            } else {
                data = EdpDataConst.DEPARTMENT_LEVEL_ATTACHMENT;
                newData = EdpDataConst.TO_LEVEL_ATTACHMENT;
                this.toAllowUplodSize = EdpDataConst.MAX_FILE_SIZE_HOD_OFFICE_CREATION;
                this.dispTotalAllowSize = this.toAllowUplodSize / Math.pow(1024, 1);
            }
            this.getAttachmentMasterData(data, newData);
        } else if (this.userType === 'to_user') {
            this.isToPaoUser = true;
            if (this.isUpdate === 'office-update') {
                this.getAttachmentMasterData('', '');
            } else {
                newData = EdpDataConst.TO_LEVEL_ATTACHMENT;
                data = EdpDataConst.DEPARTMENT_LEVEL_ATTACHMENT;
                this.getAttachmentMasterData(data, newData);
                this.toAllowUplodSize = EdpDataConst.MAX_FILE_SIZE_TO_PAO_OFFICE_CREATION;
                this.dispTotalAllowSize = this.toAllowUplodSize / Math.pow(1024, 1);
                // this.loadHodAttachment(EdpDataConst.DEPARTMENT_LEVEL_ATTACHMENT_TYPEID);
            }
        } else if (this.userType === 'edp_user') {
            if (this.isUpdate === 'office-update') {
                this.getAttachmentMasterData('', '');
            } else {
                this.isToPaoUser = true;
                this.isHodUser = true;
                data = EdpDataConst.DEPARTMENT_LEVEL_ATTACHMENT;
                newData = EdpDataConst.TO_LEVEL_ATTACHMENT;
                this.getAttachmentMasterData(data, newData);
                this.isDATfromWF = this.hasWorkFlow !== undefined ? this.hasWorkFlow : false;
            }
        } else {
            this.getAttachmentMasterData('', '');
        }
        this.validationForUpdate();
    }

    validationForUpdate() {
        if (this.isUpdate === 'office-update') {
            if (this.action === 'view') {
                this.disableForUpdateOffice = true;
                return;
            }
            if (this.userTypeForUpdate.isDatUser || this.userTypeForUpdate.isJD
                || this.userTypeForUpdate.isToPaoUser) {
                this.disableForUpdateOffice = true;
            } else {
                this.disableForUpdateOffice = false;
            }
        }
    }

    /**
     * @description It emits submit button for page
     * @param btnName Not Passed
     */
    saveDDO(btnName) {
        this.submitOfficeEvent.emit();
    }

    /**
     * @description based on mandatory flag it returns true or false for Attachment
     * @returns boolean value
     */
    checkForMandatory() {
        let flag = true;
        if (this.isUpdate === 'office-update' || this.isToPaoUser) {
            if (!this.dataSourceAttachment.data[0].ofcAttactmentId ||
                !this.dataSourceAttachment.data[0].uploadedFileName
            ) {
                flag = false;
            }
            this.dataSourceAttachment.data.forEach(obj => {
                if (obj.mandatoryFlag) {
                    if (!obj.ofcAttactmentId) {
                        flag = false;
                    }
                }
            });
        }
        if (this.isUpdate !== 'office-update' && this.isHodUser) {
            // to check ad/hod level user
            this.dataSourceAttachment1.data.forEach(attachmentObj => {
                if (attachmentObj.mandatoryFlag) {
                    if (!attachmentObj.ofcAttactmentId) {
                        flag = false;
                    }
                }
            });
        }
        if (this.isUpdate !== 'office-update' && this.officeDivision === 'DAT') {
            // to check whole attachment
            this.dataSourceAttachment1.data.forEach(attachmentObject => {
                if (attachmentObject.mandatoryFlag) {
                    if (!attachmentObject.ofcAttactmentId) {
                        flag = false;
                    }
                }
            });
        }
        /**
         * Attachment is not mandatory for Super Admin
         */
        if (this.isUpdate === 'office-update' && this.userTypeForUpdate.isDatSuperAdmin) {
            flag = true;
        }
        return flag;
    }

    /**
     * @description button is not being used
     * @param btnName btnName
     */
    saveAttachment(btnName) {
        if (this.getFormStatus() && this.checkForMandatory()) {
            const param = this.passResult;
            if (btnName === 'submit') {
                param['formAction'] = EdpDataConst.STATUS_SUBMITTED;
            }
            this.edpDdoOfficeService.updateOfficeDetails(param).subscribe((res) => {
                if (res && res['result'] && res['status'] === 200 && res['message']) {
                    this.toastr.success(res['message']);
                    // this.selectedIndex = 1;
                    // if (res['result']['districtId']) {
                    //     this.isSubOfficeEnable = false;
                    // }
                    this.action = 'edit';
                    this.officeId = res['result']['officeId'];
                    this.transactionNo = res['result']['transactionNo'];
                    this.transactionDate = res['result']['createdDate'];
                    this.saveDraftEnable = true;
                    this.isSubmitDisable = true;
                    this.goToListing1();
                } else {
                    this.toastr.error(res['message']);
                }
            }, (err) => {
                this.toastr.error(this.errorMessages['ERR_SAVE_OFFICE']);
            });
        } else {
            // this.toastr.error('Please fill all Mandatory Fields');
            if (!this.getFormStatus()) {
                this.toastr.error('Please fill all Mandatory Fields');
                this.fillMandatoryFields.emit();
            } else {
                this.toastr.error(this.errorMessages['ERR_NOT_UPLOAD']);
            }
        }

        // this.uploadFiles();
        // this.isSubmitDisable = this.officeData.isSubmitDisable = true;
    }

    /**
     * @description On clicking reset button , attachment is being reset using this method
     */
    resetAttachmentForm() {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '360px',
            data: msgConst.CONFIRMATION_DIALOG.CONFIRMATION
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                /**
                 * UnComment Below Line if Requirement is to show No attahment
                 * when User Navigate from Detail Office Summary. Ref-ED-1034 BUg
                 */

                // this.isOfficeSummary = this.fromDetailOfficeSummary;

                let data = '',
                    newData = '';
                this.totalAttachmentSize = 0;
                if (this.isUpdate === 'office-update') {
                    this.attachmentData = [];
                    this.getAttachmentMasterData(data, newData);
                } else {
                    this.dataSourceAttachment.data = _.cloneDeep([]);
                    if (this.officeDivision === 'DAT') {
                        data = EdpDataConst.DEPARTMENT_LEVEL_ATTACHMENT;
                        newData = EdpDataConst.TO_LEVEL_ATTACHMENT;
                        this.attachmentData = [];
                        this.getAttachmentMasterData(data, newData);
                    } else if (this.isHodUser) {
                        data = EdpDataConst.DEPARTMENT_LEVEL_ATTACHMENT;
                        this.attachmentData = [];
                        this.getAttachmentMasterData(data, newData);
                    } else if (this.isToPaoUser) {
                        data = EdpDataConst.TO_LEVEL_ATTACHMENT;
                        newData = EdpDataConst.DEPARTMENT_LEVEL_ATTACHMENT;
                        this.attachmentData = [];
                        this.getAttachmentMasterData(data, newData);
                    }
                }
                this.isUpload = false;
            }
        });
    }
    setAttachment(res) {
        if (res && res['result'] && res['status'] === 200) {
            const resultObject = _.cloneDeep(res['result']);
            this.isEnabled = true;
            this.existFileCount = [];
            if (this.isUpdate === 'office-update') {
                const suppAttachment: any = [];
                let updateOfficeAttachment: any = [];
                this.noOfAttachment = this.attachmentData.length;
                if (resultObject.length === 0) {
                    updateOfficeAttachment = _.cloneDeep(this.attachmentData);
                } else {
                    this.attachmentData.forEach((attachData, attachindex) => {
                        const data = resultObject.filter(obj => {
                            return attachData.attachmentId === obj.attachmentId;
                        });
                        data.forEach((attachmentData, index) => {
                            const attachDataClone = _.cloneDeep(attachData);
                            attachDataClone['fileName'] = attachmentData.fileName;
                            attachDataClone['ofcAttactmentId'] = attachmentData.ofcAttactmentId;
                            attachDataClone['uploadedFileName'] = attachmentData.uploadedFileName;
                            attachDataClone['file'] = attachmentData.file;
                            attachDataClone['pathUploadFile'] = attachmentData.pathUploadFile;
                            attachDataClone['rolePermId'] = attachmentData.rolePermId;
                            attachDataClone['uploadedBy'] = attachmentData.uploadedByName;
                            attachDataClone['size'] = attachmentData.uploadedFileSize;
                            attachDataClone['common'] = false;
                            this.totalAttachmentSize += Number(attachmentData.uploadedFileSize);
                            if (index === 0) {
                                this.attachmentData.splice(attachindex, 1, attachDataClone);
                            } else {
                                suppAttachment.push(attachDataClone);
                            }
                            if (index !== 0) {
                                attachDataClone['mandatoryFlag'] = false;
                                attachDataClone['isMandatory'] = 0;
                            }
                            this.existFileCount.push(attachmentData.uploadedFileName);
                        });
                    });
                    updateOfficeAttachment = this.attachmentData.concat(suppAttachment);
                }
                this.dataSourceAttachment.data = _.cloneDeep(updateOfficeAttachment);
            } else {
                if (this.attachmentData && this.attachmentData.length > 0) {
                    let hodAttach = this.attachmentData.filter(item => {
                        return item.attachmentDesc === 'DEPARTMENT_LEVEL_ATTACHMENT';
                    });
                    this.noOfAttachmentDept = hodAttach.length;
                    hodAttach = this.attachmentData.filter(item => {
                        return item.attachmentDesc === 'TO_LEVEL_ATTACHMENT';
                    });
                    this.noOfAttachment = hodAttach.length;
                }
                const suppAttachment: any = [];
                if (resultObject.length > 0) {
                    this.attachmentData.forEach((attachData, attachindex) => {
                        this.toLevelAttachment.push(attachData.attachmentDesc);
                        const data = resultObject.filter(obj => {
                            return attachData.attachmentId === obj.attachmentId;
                        });
                        if (data && data.length > 0) {
                            if (data.length === 1) {
                                attachData['fileName'] = data[0].fileName;
                                attachData['ofcAttactmentId'] = data[0].ofcAttactmentId;
                                attachData['uploadedFileName'] = data[0].uploadedFileName;
                                attachData['file'] = data[0].file;
                                attachData['pathUploadFile'] = data[0].pathUploadFile;
                                attachData['rolePermId'] = data[0].rolePermId;
                                attachData['uploadedBy'] = data[0].uploadedByName;
                                attachData['size'] = data[0].uploadedFileSize;
                                attachData['common'] = false;
                                this.totalAttachmentSize += Number(data[0].uploadedFileSize);
                                this.existFileCount.push(data[0].uploadedFileName);
                            } else if (data.length > 1) {
                                data.forEach((attachmentData1, dataIndex) => {
                                    const attachDataClone = _.cloneDeep(attachData);
                                    attachDataClone['fileName'] = attachmentData1.fileName;
                                    attachDataClone['ofcAttactmentId'] = attachmentData1.ofcAttactmentId;
                                    attachDataClone['uploadedFileName'] = attachmentData1.uploadedFileName;
                                    attachDataClone['file'] = attachmentData1.file;
                                    attachDataClone['pathUploadFile'] = attachmentData1.pathUploadFile;
                                    attachDataClone['rolePermId'] = attachmentData1.rolePermId;
                                    attachDataClone['uploadedBy'] = attachmentData1.uploadedByName;
                                    attachDataClone['size'] = attachmentData1.uploadedFileSize;
                                    attachDataClone['common'] = false;
                                    this.totalAttachmentSize += Number(attachmentData1.uploadedFileSize);
                                    if (dataIndex === 0) {
                                        this.attachmentData.splice(attachindex, 1, attachDataClone);
                                    } else {
                                        suppAttachment.push(attachDataClone);
                                    }
                                    this.existFileCount.push(attachmentData1.uploadedFileName);
                                });
                            }
                        }
                    });
                }
                this.attachmentData = this.attachmentData.concat(suppAttachment);
                if (this.isHodUser) {
                    const filtered = this.attachmentData.filter(item => {
                        return item.attachmentDesc === 'DEPARTMENT_LEVEL_ATTACHMENT';
                    });
                    // this.attachmentData1 = newFiltered;
                    this.dataSourceAttachment1.data = _.cloneDeep(filtered);
                }
                if (this.isToPaoUser) {
                    const filtered1 = this.attachmentData.filter(item => {
                        return item.attachmentDesc === 'DEPARTMENT_LEVEL_ATTACHMENT';
                    });
                    // this.attachmentData1 = newFiltered;
                    this.dataSourceAttachment1.data = _.cloneDeep(filtered1);
                    const filtered = this.attachmentData.filter(item => {
                        return item.attachmentDesc === 'TO_LEVEL_ATTACHMENT';
                    });
                    // this.attachmentData = filtered;
                    this.dataSourceAttachment.data = _.cloneDeep(filtered);
                }

                for (let i = 0; i < this.existFileCount.length; i++) {
                    this.lastResult = i;
                    this.lastResult1 = i;
                }
                if (this.lastResult >= 7 && this.lastResult1 >= 7) {
                    this.isSubmitDisable = false;
                }
            }
        } else {
            this.toastr.error(res['message']);
        }
    }
    /**
     * @description It loads all uploaded attachments for office id
     * @param attachmentType attachmentType means TO level  or Department Level
     */
    loadAttachment(attachmentType) {
        const param = {
            'officeId': this.officeId,
            'attachmentType': attachmentType
        };
        if (this.isUpdate === 'office-update') {
            this.edpDdoOfficeService.loadUpadateOfficeAttachmentList(param).subscribe((res) => {
                this.setAttachment(res);
            },
                (err) => {
                    this.toastr.error(this.errorMessages['ERR_GET_LIST']);
                });
        } else {
            this.edpDdoOfficeService.loadAttachmentList(param).subscribe((res) => {
                this.setAttachment(res);
            },
                (err) => {
                    this.toastr.error(this.errorMessages['ERR_GET_LIST']);
                });
        }

    }
    /**
     * @description It loads attachment to datasurce (It is not used)
     * @param data Type of Attachment Id
     */
    loadHodAttachment(data) {
        const param = {
            'officeId': this.officeId,
            'attachmentType': data
        };
        this.edpDdoOfficeService.loadAttachmentList(param).subscribe((res) => {
            if (res && res['result'] && res['status'] === 200) {
                const resultObject = _.cloneDeep(res['result']);
                this.dataSourceHodAttechment.data = resultObject;
            } else {
                this.toastr.error(res['message']);
            }
        },
            (err) => {
                this.toastr.error(this.errorMessages['ERR_GET_LIST']);
            });
    }
    /**
     * @description It loads attachment to datasurce (It is not used)
     * @param data Type of Attachment Id
     */
    loadToAttachment(data) {
        const param = {
            'officeId': this.officeId,
            'attachmentType': data
        };
        this.edpDdoOfficeService.loadAttachmentList(param).subscribe((res) => {
            if (res && res['result'] && res['status'] === 200) {
                const resultObject = _.cloneDeep(res['result']);
                this.dataSourceToAttachment.data = resultObject;
            } else {
                this.toastr.error(res['message']);
            }
        },
            (err) => {
                this.toastr.error(this.errorMessages['ERR_GET_LIST']);
            });
    }
    /**
     * @description It loads attachment type data
     * @param data Data to be passed for Department
     * @param newData Data to be passed for TO/PAO Department
     */
    getAttachmentMasterData(data, newData) {
        const param = [{
            name: data
        },
        {
            name: newData
        }];
        const isUpdateReq = this.isUpdate !== 'office-update' ? 'CREATE' : 'UPDATE';
        this.edpDdoOfficeService.getOfficeAttachmentMasterData(param, isUpdateReq).subscribe((res) => {
            if (res && res['result'] && res['status'] === 200) {
                res['result'].forEach(fileObj => {
                    const attach = fileObj;
                    attach['fileName'] = '';
                    attach['uploadedFileName'] = '';
                    attach['uploadedBy'] = '';
                    attach['ofcAttactmentId'] = null;
                    attach['size'] = 0;
                    attach['pathUploadFile'] = '';
                    attach['rolePermId'] = null;
                    attach['file'] = null;
                    this.attachmentData.push(attach);
                    // this.noOfAttachment++;
                });
                this.dataSourceAttachment.data = _.cloneDeep(this.attachmentData);
                if (this.isOfficeSummary) {
                    return;
                }
                if (this.officeDivision === 'DAT') {
                    // if (this.isUpdate !== 'office-update') {
                    // this.loadAttachment(EdpDataConst.DEPARTMENT_LEVEL_ATTACHMENT_TYPEID);
                    // }
                    this.loadAttachment(EdpDataConst.TO_LEVEL_ATTACHMENT_TYPEID);
                } else if (this.isHodUser) {
                    this.loadAttachment(EdpDataConst.DEPARTMENT_LEVEL_ATTACHMENT_TYPEID);
                } else if (this.isToPaoUser) {
                    this.loadAttachment(EdpDataConst.TO_LEVEL_ATTACHMENT_TYPEID);
                } else {
                    this.loadAttachment(EdpDataConst.TO_LEVEL_ATTACHMENT_TYPEID);
                }
            } else {
                this.toastr.error(res['message']);
            }
        },
            (err) => {
                this.toastr.error(this.errorMessages['ERR_GET_LIST']);
            });
    }

    /**
     * @description On Selection of a file, it sets various parameter
     *       and validation for datasource for AD/HOD level.
     * @param fileSelected Selected File to attach
     * @param index Index on which file is being uploaded
     */
    onFileSelection(fileSelected, index) {
        const fileType = EdpDataConst.EDP_ATTACHMENT_FILE_TYPE;
        this.isEnabled = false;
        if (fileSelected.target && fileSelected.target.files) {
            let fileAllowed = false;
            fileType.forEach(el => {
                if (el.toLowerCase() === fileSelected.target.files[0].name.split('.').pop().toLowerCase()) {
                    fileAllowed = true;
                    const fileSizeInKb = fileSelected.target.files[0].size / Math.pow(1024, 1);
                    const currentSelectedIndexFileSize = this.dataSourceAttachment.data[this.fileBrowseIndex] ?
                        this.dataSourceAttachment.data[this.fileBrowseIndex].size : 0;
                    this.totalAttachmentSize -= currentSelectedIndexFileSize;
                    this.totalAttachmentSize += fileSizeInKb;
                    if (this.totalAttachmentSize <= this.toAllowUplodSize) {
                        const uplFlName = fileSelected.target.files[0].name;
                        this.dataSourceAttachment.data[this.fileBrowseIndex].uploadedFileName = uplFlName;
                        this.dataSourceAttachment.data[this.fileBrowseIndex].pathUploadFile = fileSelected.target.value;
                        this.dataSourceAttachment.data[this.fileBrowseIndex].size = fileSizeInKb;
                        this.dataSourceAttachment.data[this.fileBrowseIndex].uploadedBy = this.userName;
                        this.dataSourceAttachment.data[this.fileBrowseIndex].file = fileSelected.target.files[0];
                        const result1 = this.checkFileIndexArr1(index, this.fileArr1);
                        // tslint:disable-next-line: no-unused-expression
                        if (!result1) {
                            this.fileArr1.push(index);
                        }
                        this.isUpload = false;
                        if (!result1) {
                            this.fileArr1.push(index);
                        }
                        this.checkForSubmit1();
                        this.lastResult1 = this.checkForSubmit1();

                    } else {
                        this.totalAttachmentSize = this.totalAttachmentSize - fileSizeInKb;
                        this.toastr.error(this.errorMessages['LARGE_FILE']);
                        this.isUpload = true;
                    }
                }
            });
            if (!fileAllowed) {
                this.toastr.error(this.errorMessages['INVALID_TYPE']);
            }
        }
    }

    checkForSubmit() {
        let res = false;
        for (let i = 0; i <= 4; i++) {
            if (this.fileArr.includes(i)) {
                res = true;
            } else {
                res = false;
                break;
            }
        }

        return res;
    }

    checkForSubmit1() {
        let res1 = false;
        for (let j = 0; j <= 2; j++) {
            if (this.fileArr1.includes(j)) {
                res1 = true;
            } else {
                res1 = false;
                break;
            }
        }

        return res1;
    }

    checkFileIndexArr(index, arr) {
        return arr.includes(index);
    }
    checkFileIndexArr1(index, arr) {
        return arr.includes(index);
    }

    /**
     * @description On Selection of a file, it sets various parameter and
     *      validation for datasource for TO/PAO level or Office Updation.
     * @param fileSelected Selected File to attach
     * @param index Index on which file is being uploaded
     */
    onFileSelection1(fileSelected, index) {
        const fileType = EdpDataConst.EDP_ATTACHMENT_FILE_TYPE;
        this.isEnabled = false;
        if (fileSelected.target && fileSelected.target.files) {
            let fileAllowed = false;
            fileType.forEach(el => {
                if (el.toLowerCase() === fileSelected.target.files[0].name.split('.').pop().toLowerCase()) {
                    fileAllowed = true;
                    const fileSizeInKb = fileSelected.target.files[0].size / Math.pow(1024, 1);
                    const currentSelectedIndexFileSize = this.dataSourceAttachment1.data[this.fileBrowseIndex] ?
                        this.dataSourceAttachment1.data[this.fileBrowseIndex].size : 0;
                    this.totalAttachmentSize -= currentSelectedIndexFileSize;
                    this.totalAttachmentSize += fileSizeInKb;
                    if (this.totalAttachmentSize <= this.toAllowUplodSize) {
                        const uplFlName = fileSelected.target.files[0].name;
                        this.dataSourceAttachment1.data[this.fileBrowseIndex].uploadedFileName = uplFlName;
                        this.dataSourceAttachment1.data[this.fileBrowseIndex].pathUploadFile =
                            fileSelected.target.value;
                        this.dataSourceAttachment1.data[this.fileBrowseIndex].size = fileSizeInKb;
                        this.dataSourceAttachment1.data[this.fileBrowseIndex].uploadedBy = this.userName;
                        this.dataSourceAttachment1.data[this.fileBrowseIndex].file = fileSelected.target.files[0];
                        const result = this.checkFileIndexArr(index, this.fileArr);
                        // tslint:disable-next-line: no-unused-expression
                        if (!result) {
                            this.fileArr.push(index);
                        }
                        this.isUpload = false;
                        if (!result) {
                            this.fileArr.push(index);
                        }
                        this.checkForSubmit();

                        this.lastResult = this.checkForSubmit();
                    } else {
                        this.totalAttachmentSize = this.totalAttachmentSize - fileSizeInKb;
                        this.toastr.error(this.errorMessages['LARGE_FILE']);
                        this.isUpload = true;
                    }
                }
            });
            if (!fileAllowed) {
                this.toastr.error(this.errorMessages['INVALID_TYPE']);
            }
        }
    }

    /**
     * @description It triggers the file to be uploaded for TO/PAO level
     * @param index Index on which file will be uploaded
     */
    openFileSelector(index) {
        this.el.nativeElement.querySelector('#fileBrowse' + index).click();
        this.fileBrowseIndex = index;
    }

    /**
     * @description It triggers the file to be uploaded for AD/HOD level
     * @param index Index on which file will be uploaded
     */
    openFileSelector1(index) {
        this.el.nativeElement.querySelector('#fileBrowse1' + index).click();
        this.fileBrowseIndex = index;
    }

    /**
     * @description It adds one row to dataSourceAttachment for TO/PAO level
     */
    addBrowse() {
        if (this.dataSourceAttachment) {
            const data = this.dataSourceAttachment.data[this.dataSourceAttachment.data.length - 1];
            if (data && data.fileName && data.uploadedFileName) {
                const attachData = this.dataSourceAttachment.data;
                attachData.push({
                    attachmentId: Number(data.attachmentId),
                    attachmentName: data.attachmentName,
                    attachmentCode: data.attachmentCode,
                    attachmentDesc: data.attachmentDesc,
                    attahcmentType: Number(data.attahcmentType),
                    fileName: '',
                    uploadedFileName: '',
                    uploadedBy: '',
                    size: 0,
                    pathUploadFile: '',
                    file: null,
                    rolePermId: 0,
                    ofcAttactmentId: null,
                    common: true,
                    mandatoryFlag: false
                });
                this.dataSourceAttachment.data = _.cloneDeep(attachData);
                this.isUpload = false;
            } else {
                this.isUpload = true;
                this.toastr.error(this.errorMessages['ERR_FILL_ALL_DATA']);
            }
        }
    }

    /**
     * @description It adds one row to dataSourceAttachment for AD/HOD level
     */
    addBrowse1() {
        if (this.dataSourceAttachment1) {
            const data = this.dataSourceAttachment1.data[this.dataSourceAttachment1.data.length - 1];
            if (data && data.fileName && data.uploadedFileName) {
                const attachData = this.dataSourceAttachment1.data;
                attachData.push({
                    attachmentId: Number(data.attachmentId),
                    attachmentName: data.attachmentName,
                    attachmentCode: data.attachmentCode,
                    attachmentDesc: data.attachmentDesc,
                    attahcmentType: Number(data.attahcmentType),
                    fileName: '',
                    uploadedFileName: '',
                    uploadedBy: '',
                    size: 0,
                    pathUploadFile: '',
                    file: null,
                    rolePermId: 0,
                    ofcAttactmentId: null,
                    common: true,
                    mandatoryFlag: false
                });
                this.dataSourceAttachment1.data = _.cloneDeep(attachData);
                this.isUpload = false;
            } else {
                this.isUpload = true;
                this.toastr.error(this.errorMessages['ERR_FILL_ALL_DATA']);
            }
        }
    }

    /**
     * @description It removes file from datasource for TO/PAO level
     * @param index index on which file will be removed
     */
    deleteBrowse(index) {
        const deletedFile: any = this.dataSourceAttachment.data.splice(index, 1);
        if (!this.removeFile(deletedFile[0])) {
            const tableData = this.dataSourceAttachment.data;
            tableData.push(deletedFile);
            this.dataSourceAttachment = new MatTableDataSource(tableData);
        } else {
            if (deletedFile && deletedFile.length > 0 && deletedFile[0].mandatoryFlag) {
                this.dataSourceAttachment.data.splice(index, 0, deletedFile[0]);
            }
            this.dataSourceAttachment = new MatTableDataSource(this.dataSourceAttachment.data);
        }

        const i = this.fileArr.indexOf(index);
        if (i > -1) {
            this.fileArr.splice(index, 1);
        }

    }
    /**
     * @description It removes file from datasource1 for AD/HOD level
     * @param index index on which file will be removed
     */
    deleteBrowse1(index) {
        const deletedFile: any = this.dataSourceAttachment1.data.splice(index, 1);
        if (!this.removeFile1(deletedFile[0])) {
            const tableData = this.dataSourceAttachment1.data;
            tableData.push(deletedFile);
            this.dataSourceAttachment1 = new MatTableDataSource(tableData);
        } else {
            if (deletedFile && deletedFile.length > 0 && deletedFile[0].mandatoryFlag) {
                this.dataSourceAttachment.data.splice(index, 0, deletedFile[0]);
            }
            this.dataSourceAttachment1 = new MatTableDataSource(this.dataSourceAttachment1.data);
        }
        const i = this.fileArr.indexOf(index);
        if (i > -1) {
            this.fileArr.splice(index, 1);
        }

    }

    /**
     * @description It removes file from database for dataSourceAttachment for TO/PAO level
     * @param fileData file
     * @param index index
     */
    removeFile(fileData, index?): boolean {
        if (fileData.ofcAttactmentId) {
            const fileSize = fileData.size;
            this.edpDdoOfficeService.deleteAttachment({ id: fileData.ofcAttactmentId }).subscribe((res) => {
                if (res && res['result'] && res['status'] === 200) {
                    this.totalAttachmentSize = this.totalAttachmentSize - fileSize;
                    fileData.uploadedBy = '';
                    fileData.size = 0;
                    fileData.uploadedFileName = '';
                    fileData.pathUploadFile = '';
                    fileData.file = null;
                    fileData.ofcAttactmentId = null;
                    this.toastr.success(res['message']);
                    return true;
                } else {
                    this.toastr.error(res['message']);
                    return false;
                }
            },
                (err) => {
                    this.toastr.error(this.errorMessages['ERR_REMOVE_ATTACHMENT']);
                    return false;
                });
        } else {
            this.dataSourceAttachment.data.forEach((file, inex) => {
                if (file.size === fileData.size && file.uploadedFileName === fileData.uploadedFileName &&
                    file.attachmentId === fileData.attachmentId && inex === index) {
                    this.totalAttachmentSize = this.totalAttachmentSize - fileData.size;
                    file.uploadedBy = '';
                    file.size = 0;
                    file.uploadedFileName = '';
                    file.pathUploadFile = '';
                    file.file = null;
                    file.ofcAttactmentId = null;
                    return true;
                }
            });
        }

        const j = this.fileArr1.indexOf(index);
        if (j > -1) {
            this.fileArr1.splice(index, 1);
        }

        return true;
    }
    /**
     * @description It removes file from database for dataSourceAttachment1 for AD/HOD level
     * @param fileData file
     * @param index index
     */
    removeFile1(fileData, index?): boolean {
        if (fileData.ofcAttactmentId) {
            const fileSize = fileData.size;
            this.edpDdoOfficeService.deleteAttachment({ id: fileData.ofcAttactmentId }).subscribe((res) => {
                if (res && res['result'] && res['status'] === 200) {
                    this.totalAttachmentSize = this.totalAttachmentSize - fileSize;
                    fileData.uploadedBy = '';
                    fileData.size = 0;
                    fileData.uploadedFileName = '';
                    fileData.pathUploadFile = '';
                    fileData.file = null;
                    fileData.ofcAttactmentId = null;
                    this.toastr.success(res['message']);
                    return true;
                } else {
                    this.toastr.error(res['message']);
                    return false;
                }
            },
                (err) => {
                    this.toastr.error(this.errorMessages['ERR_REMOVE_ATTACHMENT']);
                    return false;
                });
        } else {
            this.dataSourceAttachment1.data.forEach((fileAttach, ind) => {
                if (fileAttach.size === fileData.size && fileAttach.uploadedFileName === fileData.uploadedFileName &&
                    fileAttach.attachmentId === fileData.attachmentId && ind === index) {
                    this.totalAttachmentSize = this.totalAttachmentSize - fileData.size;
                    fileAttach.uploadedBy = '';
                    fileAttach.size = 0;
                    fileAttach.uploadedFileName = '';
                    fileAttach.pathUploadFile = '';
                    fileAttach.file = null;
                    fileAttach.ofcAttactmentId = null;
                    return true;
                }
            });
        }

        const i = this.fileArr.indexOf(index);
        if (i > -1) {
            this.fileArr.splice(index, 1);
        }

        return true;
    }

    /**
     * @description Uploads all files for both data source
     */
    uploadFiles() {
        let allowUpload = false;
        const uploadAttachmentList = new FormData();
        let index = 0;
        this.isOfficeSummary = false;

        this.dataSourceAttachment.data.forEach((obj) => {
            if (obj.pathUploadFile && obj.size > 0 && obj.uploadedFileName &&
                obj.uploadedBy && obj.ofcAttactmentId === null) {
                if (obj.fileName.trim()) {
                    if (this.isUpdate === 'office-update') {
                        uploadAttachmentList.append('officeTrnId', String(this.trnId));
                    }
                    uploadAttachmentList.append('attch[' + index + '].fileName', obj.fileName.trim());
                    uploadAttachmentList.append('attch[' + index + '].file', obj.file);
                    uploadAttachmentList.append('attch[' + index + '].attachmentId', obj.attachmentId.toString());
                    uploadAttachmentList.append('attch[' + index + '].uploadedFileName', obj.uploadedFileName);
                    uploadAttachmentList.append('attch[' + index + '].pathUploadFile', obj.pathUploadFile);
                    uploadAttachmentList.append('attch[' + index + '].officeId', this.officeId.toString());
                    uploadAttachmentList.append(
                        'attch[' + index + '].rolePermId',
                        EdpDataConst.ROLE_PERM_ID.toString()
                    );
                    allowUpload = true;
                    index++;
                } else {
                    allowUpload = false;
                }
            }
        });

        this.dataSourceAttachment1.data.forEach((obj) => {
            if (obj.pathUploadFile && obj.size > 0 && obj.uploadedFileName &&
                obj.uploadedBy && obj.ofcAttactmentId === null) {
                if (obj.fileName.trim()) {
                    uploadAttachmentList.append('attch[' + index + '].fileName', obj.fileName.trim());
                    uploadAttachmentList.append('attch[' + index + '].file', obj.file);
                    uploadAttachmentList.append('attch[' + index + '].attachmentId', obj.attachmentId.toString());
                    uploadAttachmentList.append('attch[' + index + '].uploadedFileName', obj.uploadedFileName);
                    uploadAttachmentList.append('attch[' + index + '].pathUploadFile', obj.pathUploadFile);
                    uploadAttachmentList.append('attch[' + index + '].officeId', this.officeId.toString());
                    uploadAttachmentList.append(
                        'attch[' + index + '].rolePermId',
                        EdpDataConst.ROLE_PERM_ID.toString()
                    );
                    allowUpload = true;
                    // this.isSubmitDisable = false;
                    index++;
                } else {
                    allowUpload = false;
                }
                if (obj.uploadedFileName && obj.mandatoryFlag) {
                    // this.isSubmitDisable = false;
                }
            }
        });

        if (allowUpload && uploadAttachmentList) {
            if (this.isUpdate === 'office-update') {
                this.edpDdoOfficeService.uploadOfficeUpdateAttachment(uploadAttachmentList).subscribe((resParam) => {
                    if (resParam && resParam['result'] && resParam['status'] === 200) {
                        this.toastr.success(this.errorMessages['UPLOAD_SUCCESS']);
                        this.isOfficeSummary = false;
                        resParam['result'].forEach(returnData => {
                            this.dataSourceAttachment.data.forEach(dataObject => {
                                if (returnData.attachmentId === dataObject.attachmentId) {
                                    dataObject.ofcAttactmentId = returnData.ofcAttactmentId;
                                }
                            });
                            this.dataSourceAttachment1.data.forEach(dataOb => {
                                if (returnData.attachmentId === dataOb.attachmentId) {
                                    dataOb.ofcAttactmentId = returnData.ofcAttactmentId;
                                }
                            });
                        });
                        if (this.lastResult && this.lastResult1) {
                            this.isSubmitDisable = false;
                            this.isUpload = false;
                        } else {
                            this.isUpload = true;
                        }
                    } else {
                        this.toastr.error(resParam['message']);
                    }
                },
                    (err) => {
                        this.toastr.error(err);
                    });
            } else {
                this.edpDdoOfficeService.uploadAttachment(uploadAttachmentList).subscribe((res) => {
                    if (res && res['result'] && res['status'] === 200) {
                        this.toastr.success(this.errorMessages['UPLOAD_SUCCESS']);
                        this.isOfficeSummary = false;
                        res['result'].forEach(returnData => {
                            this.dataSourceAttachment.data.forEach(dataObj => {
                                if (dataObj.fileName && dataObj.fileName === returnData.fileName
                                    && dataObj.size > 0 && returnData.attachmentId === dataObj.attachmentId) {
                                    dataObj.ofcAttactmentId = returnData.ofcAttactmentId;
                                }
                            });
                            this.dataSourceAttachment1.data.forEach(data => {
                                if (data.uploadedFileName && data.uploadedFileName === returnData.uploadedFileName
                                    && data.size > 0 && returnData.attachmentId === data.attachmentId) {
                                    data.ofcAttactmentId = returnData.ofcAttactmentId;
                                }
                            });
                        });
                        if (this.lastResult && this.lastResult1) {
                            this.isSubmitDisable = false;
                            this.isUpload = false;
                        } else {
                            this.isUpload = true;
                        }
                    } else {
                        this.toastr.error(res['message']);
                    }
                },
                    (err) => {
                        this.toastr.error(err);
                    });
            }
        } else {
            this.toastr.error(this.errorMessages['ERR_FILENAME']);
        }
    }
    /**
     * @description It views the attachment in new tab
     * @param attachment object of perticular dataSource
     */
    viewAttachment(attachment) {
        const ID = {
            'id': attachment.ofcAttactmentId
        };
        this.httpClient.post(
            `${environment.baseUrl}${APIConst.DDO_OFFICE.ATTACHMENT.DOWNLOAD_ATTACHMENT}`,
            ID,
            { responseType: 'blob' as 'json' }
        ).subscribe((res) => {
            const url = window.URL.createObjectURL(res);
            window.open(url, '_blank');
        },
            (err) => {
                this.toastr.error(err);
            });
    }

    viewComments() {
        this.viewComment.emit();
    }
    /**
     * @description It downloads the attachment in new tab
     * @param attachment object of perticular dataSource
     */
    downloadAttachment(attachment) {
        const ID = {
            'id': attachment.ofcAttactmentId
        };
        this.httpClient.post(
            `${environment.baseUrl}${APIConst.DDO_OFFICE.ATTACHMENT.DOWNLOAD_ATTACHMENT}`,
            ID,
            { responseType: 'blob' as 'json' }
        ).subscribe((res) => {
            const url = window.URL.createObjectURL(res);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', '' + attachment.uploadedFileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
        },
            (err) => {
                this.toastr.error(err);
            });
    }
    /**
     * @description emits go to listing event
     */
    goToListing1() {
        this.goToListing.emit();
        // if (this.isUpdate === 'office-update') {
        //     this.router.navigate(['/dashboard/edp/office/update-list'], { skipLocationChange: true });
        // } else {
        //     this.router.navigate(['/dashboard/edp/office/list'], { skipLocationChange: true });
        // }
    }
    /**
     * @description goes to Dashboard
     */
    goToDashboard() {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '360px',
            data: msgConst.CONFIRMATION_DIALOG.CONFIRMATION
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                this.router.navigate(['/dashboard'], { skipLocationChange: true });
            }
        });
    }
    /**
     * @description checkMandatoryAttachment in dataSource
     */
    checkMandatoryAttachment(): boolean {
        let flag = true;
        this.dataSourceAttachment.data.forEach(objAttach => {
            if (objAttach.mandatoryFlag) {
                if (!objAttach.ofcAttactmentId) {
                    flag = false;
                }
            }
        });
        return flag;
    }

    getFormStatus() {
        return this.edpDdoOfficeService.getStatus();
    }

    /**
     * @description It is called when Changes occurred in other page
     */
    ngOnChanges(): void {
        if (this.hasWorkFlow === true) {
            if (this.userType === 'edp_user') {
                if (this.isUpdate === 'office-update') {
                    // this.getAttachmentMasterData('', '');
                } else {
                    this.isDATfromWF = this.hasWorkFlow !== undefined ? this.hasWorkFlow : false;
                    // this.loadHodAttachment(EdpDataConst.DEPARTMENT_LEVEL_ATTACHMENT_TYPEID);
                    // this.loadToAttachment(EdpDataConst.TO_LEVEL_ATTACHMENT_TYPEID);
                }
            }
            if (this.userType === 'hod_user') {
                this.isToPaoUser = false;
                // this.isEdpUser = false;
                this.isHodUser = true;
            }
        }
        if (this.isRequestTC !== undefined) {
            const check = this.isRequestTC;
            this.isRequestTC = check;
        }
    }
}
