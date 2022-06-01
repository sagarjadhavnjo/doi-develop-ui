import {
    Component,
    OnInit,
    ElementRef,
    ViewChild,
    Input,
    Output,
    EventEmitter,
    OnChanges,
    SimpleChanges,
    Inject
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { EdpDataConst } from 'src/app/shared/constants/edp/edp-data.constants';
import { StorageService } from 'src/app/shared/services/storage.service';
import * as _ from 'lodash';

import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonWorkflowService } from 'src/app/modules/core/common/workflow-service/common-workflow.service';
import { CommonService } from 'src/app/modules/services/common.service';
import { AuthenticationService } from 'src/app/modules/services';
import { DataConst as CommanDataConst } from 'src/app/shared/constants/common/common-data.constants';
import { common_message } from 'src/app/shared/constants/common/common-message.constants';

class Attachment {
    attachmentTypeId: number;
    attachmentName: string;
    attachmentCode: string;
    attachmentDesc: string;
    attahcmentType: number;
    fileName: string;
    uploadedFileName: string;
    userName: string;
    size: number;
    pathUploadFile: string;
    headerId: number;
    rolePrmId: number;
    file: File;
    id: number;
}

@Component({
    selector: 'app-fix-to-regular-attachment',
    templateUrl: './fix-to-regular-attachment.component.html',
    styleUrls: ['./fix-to-regular-attachment.component.css'],
    providers: [
        {
            provide: MAT_DIALOG_DATA,
            useValue: {}
        }
    ]
})
export class FixToRegularAttachmentComponent implements OnInit, OnChanges {
    fileBrowseIndex: number;
    totalAttachmentSize: number = 0;
    userName: string;
    errorMessages = {};
    isUpload: boolean = false;
    isSubmitStatus: boolean = false;
    lkPoOffUserId: any;
    budHdrId: number = 0;
    // menuId : number = 152;
    userId: any;
    historyData: any[] = [];
    trnId: number;
    format: string;

    @Output() isFileUploadedAction: EventEmitter<boolean> = new EventEmitter();
    @Output() submitAction: EventEmitter<void> = new EventEmitter();
    @Input() headerId: number;
    @Input() action: string;
    @Input() fileAttachmentSave: boolean;
    @Input() resetfileAttachment: boolean;
    @Input() menuId: number;
    @Input() isCountClick: number;
    @Input() dialogOpen: boolean = false;

    BudgetConst = {
        MAX_FILE_SIZE_FOR_COMMON: 2048,
        UPLOAD_DIRECTORY_PATH: 'IFMS_DOC',
        ATTACHMENT_STATUS_ID: 1,
        ROLE_PERM_ID: 1,
        // HEADER_ID: this.headerId,
        STATUS_ID: 1,
        MENU_ID: 152
        // categoryId: 864
    };

    @ViewChild('standingAttachment', { static: true }) standingAttachment: ElementRef;
    attachmentTypeList: any[] = [];
    browseData: Attachment[] = [
        {
            attachmentTypeId: 0,
            attachmentDesc: '',
            attachmentCode: '',
            attahcmentType: 0,
            attachmentName: '',
            id: null,
            headerId: 0,
            file: undefined,
            fileName: '',
            uploadedFileName: undefined,
            userName: undefined,
            size: 0,
            pathUploadFile: '',
            rolePrmId: 0
        }
    ];

    attachmentTypeCtrl: FormControl = new FormControl();

    displayedBrowseColumns = [
        'position',
        'attachmentType',
        'fileName',
        'browse',
        'uploadedFileName',
        'uploadedBy',
        'action'
    ];
    attachmentTypeCodeCtrl: FormControl[] = [new FormControl()];
    dataSourceBrowse = new MatTableDataSource([]);
    categoryId: any;
    officeType: number;
    dataSourceBrowseClone: any = [];

    constructor(
        private toastr: ToastrService,
        private storageService: StorageService,
        private commonWorkflowService: CommonWorkflowService,
        private commonService: CommonService,
        public el: ElementRef,
        public dialog: MatDialog,
        private authservice: AuthenticationService,
        private router: Router,
        private httpClient: HttpClient,
        @Inject(MAT_DIALOG_DATA) public data
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.action && changes.action.currentValue !== changes.action.previousValue) {
            if (this.action === 'view') {
                this.isUpload = false;
            } else {
                this.isUpload = true;
            }
        }

        if (changes.headerId && changes.headerId.currentValue !== changes.headerId.previousValue) {
            this.trnId = this.headerId;
            this.commonWorkflowService.getCurrentUserDetail().then(res => {
                if (res) {
                    this.userId = res['userId'];
                    this.lkPoOffUserId = res['lkPOUId'];
                    this.loadAttachmentList();
                }
            });
        }
    }

    ngOnInit() {
        this.errorMessages = common_message;
        this.totalAttachmentSize = 0;
        this.userName = this.storageService.get('userName');
        // this.getAttachmentType();
        /*for standing charges attachment works with list as well
         as add new so static store with 146 for both (new/list) */
        const menuId = this.menuId ? this.menuId : this.commonService.getMenuId();
        this.manageDisplayColumns();
        this.getAttachmentMaster(menuId);
        this.attachmentTypeCodeCtrl.push(new FormControl());
        this.dataSourceBrowse = new MatTableDataSource(_.cloneDeep(this.browseData));
    }

    loadAttachmentList(redirectTo = null) {
        const catName = 'Transaction';

        /*for standing charges attachment works with list as well
         as add new so static store with 146 for both (new/list) */
        const menuId = this.menuId ? this.menuId : this.commonService.getMenuId();
        const param = {
            categoryName: catName,
            menuId: menuId,
            trnId: this.headerId,
            lkPOUId: this.lkPoOffUserId
        };

        this.commonService.loadCommonAttachmentList(param).subscribe((res) => {
            if (res && res['status'] === 200 && res['result']) {
                const resultObject = _.cloneDeep(res['result']);
                if (resultObject.length > 0) {
                    this.isFileUploadedAction.emit(true);
                    this.totalAttachmentSize = 0;
                    resultObject.forEach(attachData => {
                        this.attachmentTypeCodeCtrl.push(new FormControl());
                        console.log(Number(attachData.uploadFileSize));
                        this.totalAttachmentSize += Number(attachData.fileSize);
                    });

                    this.dataSourceBrowse.data = _.cloneDeep(resultObject);
                    this.dataSourceBrowseClone = _.cloneDeep(resultObject);
                    if (this.dataSourceBrowse.data.length >= 1 ) {
                        this.isUpload = false;
                    }

                } else {
                    this.isFileUploadedAction.emit(false);
                }

                if (redirectTo !== null) {
                    this.router.navigate([redirectTo], { skipLocationChange: true });
                }

            }
        });
    }

    onSubmitActionTrigger() {
        if (this.dataSourceBrowse.data.length > 0) {
            this.submitAction.emit();
        } else {
            this.toastr.error('Please upload at least one attachment.');
        }
    }


    getAttachmentMaster(menuId) {
        const catName = 'Transaction';
        if (menuId) {
            const param = {
                menuId: menuId,
                categoryName: catName
            };
            this.commonService.getAttachmentTypes(param).subscribe(res => {
                if (res && res['result'] && res['status'] === 200) {
                    res['result'].forEach(fileObj => {
                        const attach = fileObj;
                        attach['fileName'] = '';
                        attach['uploadFileName'] = '';
                        attach['userName'] = this.userName;
                        attach['file'] = null;
                        attach['id'] = 0;
                        attach['attachmentTypeName'] = fileObj['attTypeId']['name'];
                        attach['attachmentTypeId'] = fileObj['attTypeId']['id'];
                        attach['isMandatory'] = fileObj['attTypeId']['isMandatory'];
                        // this.attachData.push(attach);
                        // this.attachmentTypeCodeCtrl.push(new FormControl());

                        // this.attachment_type_list.push(fileObj.attTypeId);
                        // this.attachmentTypeList.push(fileObj.attTypeId);
                        this.attachmentTypeList = res['result'].filter(
                            obj => obj['attTypeId']['name'].toLowerCase() !== 'workflow attachment'
                        );
                        // this.uploadDirectoryPath = fileObj['uploadDirectoryPath'];
                        this.categoryId = fileObj['attCtegryId'];
                        this.BudgetConst.UPLOAD_DIRECTORY_PATH = fileObj['uploadDirectoryPath'];
                    });
                    const attachData = [];
                    attachData.push({
                        attachmentTypeId: Number(0),
                        attachmentName: '',
                        attachmentCode: '',
                        attachmentDesc: '',
                        attahcmentType: 0,
                        attachmentId: 0,
                        fileName: '',
                        uploadedFileName: '',
                        userName: '',
                        size: 0,
                        pathUploadFile: '',
                        file: null,
                        rolePrmId: 0,
                        headerId: 0,
                        id: null
                    });
                    this.attachmentTypeCodeCtrl.push(new FormControl());
                    this.dataSourceBrowse = new MatTableDataSource(_.cloneDeep(attachData));
                    this.loadAttachmentList();
                }
            });
        }
    }

    viewAttachment(attachment: any) {
        const param = {
            documentDataKey: attachment.documentId,
            fileName: attachment.uploadedFileName
        };
        this.commonService.viewAttachment(param).subscribe(
            (res: any) => {
                if (res) {
                    const resultObj = res['result'];
                    const imgNameArray = attachment.uploadedFileName.split('.');
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

                    const byteArray = new Uint8Array(
                        atob(resultObj['fileSrc'])
                            .split('')
                            .map(char => char.charCodeAt(0))
                    );
                    const blob = new Blob([byteArray], { type: docType });
                    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                        window.navigator.msSaveOrOpenBlob(blob, res['result']['fileName']);
                    } else {
                        const url = window.URL.createObjectURL(blob);
                        window.open(url, '_blank');
                    }
                }
            },
            err => {
                this.toastr.error(err);
            }
        );
    }

    downloadAttachment(attachment) {
        const ID = {
            documentDataKey: attachment.documentId,
            fileName: attachment.fileName
        };
        this.commonService.downloadAttachment(ID).subscribe(
            res => {
                const url = window.URL.createObjectURL(res);
                const link = document.createElement('a');
                link.setAttribute('href', url);
                link.setAttribute('download', '' + attachment.uploadedFileName);
                document.body.appendChild(link);
                link.click();
                link.remove();
            },
            err => {
                this.toastr.error(err);
            }
        );
    }

    openFileSelector(index) {
        this.el.nativeElement.querySelector('#fileBrowse').click();
        this.fileBrowseIndex = index;
    }

    uploadFiles(redirectTo = null) {
        let allowUpload = false;
        const formData = new FormData();
        let index = 0;
        /*for standing charges attachment works with list as well
         as add new so static store with 146 for both (new/list) */
        const menuId = this.menuId ? this.menuId : this.commonService.getMenuId();
        this.dataSourceBrowse.data.forEach(element => {
            if (
                element.pathUploadFile &&
                element.size > 0 &&
                element.uploadedFileName &&
                element.userName &&
                element.id === null &&
                element.attachmentTypeId
            ) {
                if (element.fileName.trim()) {
                    formData.append('attachmentCommonDtoList[' + index + '].uploadedFileSize', element.size);
                    formData.append(
                        'attachmentCommonDtoList[' + index + '].attachmentTypeId',
                        element.attachmentTypeId
                    );
                    formData.append('attachmentCommonDtoList[' + index + '].categoryId', this.categoryId);
                    formData.append('attachmentCommonDtoList[' + index + '].fileName', element.fileName);
                    formData.append('attachmentCommonDtoList[' + index + '].fileSize', element.file.size);
                    formData.append(
                        'attachmentCommonDtoList[' + index + '].format',
                        element.file.type
                            .split('/')
                            .pop()
                            .toLowerCase()
                    );
                    formData.append('attachmentCommonDtoList[' + index + '].lkPOUId', this.lkPoOffUserId);
                    formData.append('attachmentCommonDtoList[' + index + '].menuId', menuId);
                    formData.append('attachmentCommonDtoList[' + index + '].trnId', this.trnId.toString());
                    formData.append('attachmentCommonDtoList[' + index + '].userId', this.userId);
                    formData.append('attachmentCommonDtoList[' + index + '].documentId', this.data.documentId);
                    formData.append('attachmentCommonDtoList[' + index + '].uploadDirectoryPath', 'IFMS_DOC');
                    formData.append(
                        'attachmentCommonDtoList[' + index + '].attachment',
                        element.file,
                        element.file.name
                    );
                    formData.append(
                        'attachmentCommonDtoList[' + index + '].uploadedFileName',
                        element.uploadedFileName
                    );
                    allowUpload = true;
                    index++;
                }
            }
        });
        if (allowUpload === false && formData !== new FormData()) {
            // setTimeout(() => {
            //     this.selectedIndexAction.emit(6);
            // }, 100);
            this.toastr.error(this.errorMessages['ATTACHMENT']['ERR_FILL_ALL_DATA']);
        } else {
            const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                width: '360px',
                data: common_message.ATTACHMENT.SAVE_ATTACHMENT
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result === 'yes') {
                    if (allowUpload && formData) {
                        this.commonService.uploadAttachment(formData).subscribe(
                            res => {
                                if (res && res['result'] && res['status'] === 200) {
                                    this.toastr.success(this.errorMessages['ATTACHMENT']['UPLOAD_SUCCESS']);
                                    this.loadAttachmentList(redirectTo);
                                    this.isUpload = false;
                                } else if (res['status'] !== 200) {
                                    this.toastr.error(res['message']);
                                    this.isUpload = true;
                                } else {
                                    this.isUpload = true;
                                }

                                if (redirectTo !== null) {
                                    this.router.navigate([redirectTo], { skipLocationChange: true });
                                }
                            },
                            err => {
                                this.toastr.error(err);
                            }
                        );
                    }
                }
            });
        }
    }

    getSelectedFileTypeData(id?) {
        if (id) {
            return this.attachmentTypeList.find(ele => ele.id === id);
        } else {
            return this.attachmentTypeList[0] ? this.attachmentTypeList[0] : {};
        }
    }

    addBrowse() {
        if (this.dataSourceBrowse) {
            this.attachmentTypeCodeCtrl.push(new FormControl());
            const data = this.dataSourceBrowse.data[this.dataSourceBrowse.data.length - 1];
            if (data && data.attachmentTypeId && data.fileName && data.uploadedFileName) {
                const attachData = this.dataSourceBrowse.data;
                attachData.push({
                    attachmentTypeId: data.attachmentTypeId,
                    attachmentName: data.attachmentName,
                    attachmentCode: data.attachmentCode,
                    attachmentDesc: data.attachmentDesc,
                    attachmentId: 0,
                    attahcmentType: Number(data.attahcmentType),
                    fileName: '',
                    uploadedFileName: '',
                    userName: '',
                    size: 0,
                    pathUploadFile: '',
                    file: null,
                    rolePrmId: 0,
                    headerId: 0,
                    id: null
                });
                this.attachmentTypeCodeCtrl.push(new FormControl());
                this.dataSourceBrowse.data = attachData;
                this.isUpload = true;
            } else {
                // this.isUpload = true;
                this.toastr.error(this.errorMessages['ATTACHMENT']['ERR_FILL_ALL_DATA']);
            }
        }
    }

    deleteUploadedAttachment(item, index) {
        /*for standing charges attachment works with list as well
         as add new so static store with 146 for both (new/list) */
        const menuId = this.menuId ? this.menuId : this.commonService.getMenuId();
        if (item && item.uploadedFileName && item.uploadedDate && item.attachmentId) {
            const param = {
                attachmentId: item.attachmentId,
                menuId: menuId
            };
            this.commonService.attachmentDelete(param).subscribe(
                res => {
                    if (res && res['status'] === 200 && res['result'] === true) {
                        this.toastr.success(res['message']);
                        this.dataSourceBrowse.data.splice(index, 1);
                        if (this.dataSourceBrowse.data.length > 0) {
                            this.isFileUploadedAction.emit(true);
                        } else {
                            this.isFileUploadedAction.emit(false);
                        }
                        this.dataSourceBrowse = new MatTableDataSource(this.dataSourceBrowse.data);

                        if (this.dataSourceBrowse.data.length === 0) {
                            this.resetAttachmentFields();
                        }

                        // this.getUploadedAttachmentData();
                    }
                },
                err => {
                    this.toastr.error(err);
                }
            );
        } else {
            // this.toastr.error('Please upload the file first, then it can be removed.');
            // if (item.attachmentTypeId > 0) {
                this.dataSourceBrowse.data.splice(index, 1);
                this.attachmentTypeCodeCtrl.splice(index, 1);
                if (this.dataSourceBrowse.data.length === 0) {
                    this.resetAttachmentFields();
                } else {
                    this.isUpload = true;
                }
                // tslint:disable-next-line:max-line-length
                if (this.dataSourceBrowseClone.length === this.dataSourceBrowse.data.length && this.dataSourceBrowse.data[this.dataSourceBrowse.data.length - 1].attachmentId !== 0) {
                    this.isUpload = false;
                }
            // }
            this.dataSourceBrowse = new MatTableDataSource(this.dataSourceBrowse.data);
        }
    }
    resetAttachmentFields() {
        this.dataSourceBrowse.data.push({
            attachmentTypeId: Number(0),
            attachmentName: 0,
            attachmentCode: '',
            attachmentDesc: '',
            attachmentId: 0,
            attahcmentType: Number(0),
            fileName: '',
            uploadedFileName: '',
            userName: '',
            size: 0,
            pathUploadFile: '',
            file: null,
            rolePrmId: 0,
            headerId: 0,
            id: null
        });
        this.attachmentTypeCodeCtrl.push(new FormControl());
    }

    onFileSelection(fileSelected) {
        console.log('onFileSelection');
        console.log(fileSelected);
        const fileType = EdpDataConst.EDP_ATTACHMENT_FILE_TYPE;
        if (fileSelected.target && fileSelected.target.files) {
            let fileAllowed: Boolean = false;
            fileType.forEach(el => {
                if (
                    fileSelected.target.files[0] &&
                    el.toLowerCase() ===
                    fileSelected.target.files[0].name
                        .split('.')
                        .pop()
                        .toLowerCase()
                ) {
                    fileAllowed = true;
                    const fileSizeInKb = fileSelected.target.files[0].size / Math.pow(1024, 1);
                    console.log(fileSizeInKb);
                    console.log('totalSize' + this.totalAttachmentSize);
                    if (fileSizeInKb <= EdpDataConst.MAX_FILE_SIZE_FOR_COMMON) {
                        this.totalAttachmentSize += Number(fileSizeInKb);
                        console.log('totalSize' + Number(this.totalAttachmentSize));
                        if (this.totalAttachmentSize <= EdpDataConst.MAX_FILE_SIZE_FOR_BUDGET) {
                            const uplFlName = fileSelected.target.files[0].name;
                            this.dataSourceBrowse.data[this.fileBrowseIndex].uploadedFileName = uplFlName;
                            this.dataSourceBrowse.data[this.fileBrowseIndex].pathUploadFile = fileSelected.target.value;
                            this.dataSourceBrowse.data[this.fileBrowseIndex].size = fileSizeInKb;
                            this.dataSourceBrowse.data[this.fileBrowseIndex].userName = this.userName;
                            this.dataSourceBrowse.data[this.fileBrowseIndex].file = fileSelected.target.files[0];
                            this.standingAttachment.nativeElement.value = '';
                            this.isUpload = true;
                        } else {
                            this.totalAttachmentSize = this.totalAttachmentSize - fileSizeInKb;
                            this.toastr.error(this.errorMessages['ATTACHMENT']['LARGE_FILE']);
                            this.standingAttachment.nativeElement.value = '';
                            this.isUpload = false;
                        }
                    } else {
                        this.totalAttachmentSize = this.totalAttachmentSize - fileSizeInKb;
                        this.toastr.error(this.errorMessages['ATTACHMENT']['FIX_SIZE_FILE']);
                        this.standingAttachment.nativeElement.value = '';
                        this.isUpload = false;
                    }
                }
            });
            if (!fileAllowed) {
                this.toastr.error(this.errorMessages['ATTACHMENT']['INVALID_TYPE']);
            }
        }
    }

    goToListing() {
        const proceedMessage = this.errorMessages['CONFIRMATION_DIALOG']['CONFIRMATION'];
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '360px',
            data: proceedMessage
        });

        dialogRef.afterClosed().subscribe(result => {
            this.router.navigate(['/dashboard/pvu/fix-to-regular/list'], { skipLocationChange: true });
        });
    }

    goToDashboard() {
        const proceedMessage = this.errorMessages['CONFIRMATION_DIALOG']['CONFIRMATION'];
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

    getCtrl(control, i) {
        return this.attachmentTypeCodeCtrl[i];
    }

    getTitleNameDataSorce(x, y) { }

    manageDisplayColumns() {
        const officeTypeName = this.authservice.getLoginUserPrimaryOfficeTypeName();
        if (officeTypeName === CommanDataConst.OFFICE_TYPE.DDO_OFFICE) {
            this.officeType = 1;
        } else if (officeTypeName === CommanDataConst.OFFICE_TYPE.HOD_OFFICE) {
            this.officeType = 2;
        } else if (officeTypeName === CommanDataConst.OFFICE_TYPE.AD_OFFICE) {
            this.officeType = 3;
        } else if (officeTypeName === CommanDataConst.OFFICE_TYPE.FD_OFFICE) {
            this.officeType = 4;
        }
    }
}
