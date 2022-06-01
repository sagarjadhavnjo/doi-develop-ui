import { Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Component, OnInit, Inject, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { CommonWorkflowService } from '../workflow-service/common-workflow.service';
import {
    CommonWfMsg,
    DataConstant,
    viewableExtension,
    previewExtension,
    ModuleNames
} from '../constant/common-workflow.constants';
import * as _ from 'lodash';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { promise } from 'protractor';
import { resolve } from 'url';
import { DatePipe } from '@angular/common';

declare function SetGujarati();
declare function SetEnglish();

@Component({
    selector: 'app-view-common-workflow-history',
    templateUrl: './view-common-workflow-history.component.html',
    styleUrls: ['./view-common-workflow-history.component.css']
})
export class ViewCommonWorkflowHistoryComponent implements OnInit {
    currentLang = new BehaviorSubject<string>('Eng');
    isLangChange = false;
    hasFocusSet: number;
    public showData: boolean = true;
    showWorkFlowAction: boolean = true;

    date: any = new Date();
    displayData: boolean = false;
    page: number = 1;
    totalPages: number;
    isLoaded: boolean = false;
    sampleFlag: boolean;
    tabDisable: Boolean = true;
    selectedIndex: number;

    errorMessages = CommonWfMsg;

    historyData: any[] = [];

    linkMenuId: any;
    postId: any;
    wfRoleCode: any;
    wfRoleIds: any;
    menuId: any;
    userId: any;
    lkPoOffUserId: any;
    actionResponse: any;
    remarksRequired: boolean;
    officeId: any;
    attachData = [];
    uploadDirectoryPath: string;
    totalAttachmentSize: number = 0;
    allowedFileType: any;
    isSubmitted: boolean;
    parentOffice: any;
    userSelTwoObj: any;
    selectedAction: any;
    sendBackFlag: boolean;
    selectedFilePreviewPdf: string;
    selectedFilePreviewImageBase64: string;
    selectedFileBase64: string;
    commentHistoryOfficeName: string;
    commentsData: any;
    constructor(
        private elem: ElementRef,
        private toastr: ToastrService,
        private router: Router,
        private fb: FormBuilder,
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<ViewCommonWorkflowHistoryComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        private el: ElementRef,
        private datePipe: DatePipe,
        private commonWorkflowService: CommonWorkflowService
    ) {
        data.showPrintBtn = data.showPrintBtn !== undefined ? data.showPrintBtn: true;
    }

    ngOnInit() {
        // To get the logged in user info and menu info
        this.commonWorkflowService.getCurrentUserDetail().then(res => {
            if (res) {
                this.wfRoleIds = res['wfRoleId'];
                this.wfRoleCode = res['wfRoleCode'];
                this.menuId = res['menuId'];
                this.linkMenuId = res['linkMenuId'] ? res['linkMenuId'] : this.menuId;
                this.postId = res['postId'];
                this.userId = res['userId'];
                this.lkPoOffUserId = res['lkPoOffUserId'];
                this.officeId = res['officeDetail']['officeId'];
                this.commentHistoryOfficeName = res['officeDetail']['officeName'];
                this.getHistory();
            }
        });
    }

    /**
     * @description to get the workflow history
     */
    getHistory() {
        try {
            const histParam = {
                menuId: this.linkMenuId,
                trnId: this.data.trnId
            };
            this.commonWorkflowService.getWorkFlowHistory(histParam).subscribe(data => {
                if (data && data['result'] && data['result'].length > 0) {
                    let extension;
                    this.historyData = data['result'].filter(dataObj => {
                        if (dataObj && dataObj.attachmentCommonDtoList) {
                            dataObj.attachmentCommonDtoList = dataObj.attachmentCommonDtoList.filter(attachmentItem => {
                                extension = attachmentItem.uploadedFileName
                                    ? attachmentItem.uploadedFileName.split('.').pop()
                                    : '';
                                if (previewExtension.indexOf(extension) !== -1) {
                                    attachmentItem.isView = true;
                                }
                                return attachmentItem;
                            });
                        }
                        return dataObj;
                    });
                }
            });
        } catch (err) {
            this.toastr.error(err);
        }
    }
    gotoListing() {
        this.router.navigate(['']);
    }

    uploadAttachment() {
        this.tabDisable = false;
        this.selectedIndex = 2;
    }

    /**
     * @description to close the dialog box
     */
    closeDialog(): void {
        this.dialogRef.close('no');
    }

    printDocument(): void {
        if (this.data.url) {
            const myObject = _.cloneDeep(this.data);
            const headerJson = myObject.headerJson;
            delete myObject.headerJson;
            const url = this.data.url;
            myObject.refDate = myObject.refDate ? this.datePipe.transform(myObject.refDate, 'dd-MMM-yyyy hh:mm:ss a').toString() : '';
            const params = {
                'headerData': myObject,
                'commentsData': this.historyData,
                'headerJson': headerJson
            };
            this.commonWorkflowService.viewComments(params, url).subscribe(res => {
                if (res) {
                    const file = res['result'];
                    const docType = 'application/pdf';
                    const byteArray = new Uint8Array(atob(file).split('').map(char => char.charCodeAt(0)));
                    const blob = new Blob([byteArray], { type: docType });
                    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                        window.navigator.msSaveOrOpenBlob(blob);
                        //this.loader = false;
                    } else {
                        window.open(window.URL.createObjectURL(blob), '_blank');
                    }
                }
            }, err => {
                this.toastr.error(err);
            });
        } else {
            //this.toastr.error('Invalid URL');
            window.print();
        }
    }

    nextPage() {
        this.page += 1;
        if (this.page > this.totalPages) {
            this.page = this.totalPages;
        }
    }

    previousPage() {
        this.page -= 1;
        if (this.page < 1) {
            this.page = 1;
        }
    }

    afterLoadComplete(pdfData: any) {
        this.totalPages = pdfData.numPages;
    }
    checkDisplayFile(data, event) {
        this.viewUploadedAttachment(data, event);
    }

    onBrowseSelectChange() { }

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
     * @description View Attachment
     * @param attachment  attachment
     */
    viewUploadedAttachment(attachment: any, event, isPreview = false) {
        try {
            const param = {
                documentDataKey: attachment.documentId,
                fileName: attachment.uploadedFileName
            };
            this.commonWorkflowService.viewAttachment(param).subscribe(
                (res: any) => {
                    if (res) {
                        const resultObj = res['result'];
                        const imgNameArray = attachment.uploadedFileName.split('.');
                        const imgType = imgNameArray[imgNameArray.length - 1];
                        let docType;
                        let isPdf = false;
                        if (imgType.toLowerCase() === 'pdf') {
                            docType = 'application/pdf';
                            isPdf = true;
                        } else if (imgType.toLowerCase() === 'png') {
                            docType = 'image/png';
                        } else if (imgType.toLowerCase() === 'jpg') {
                            docType = 'image/jpg';
                        } else if (imgType.toLowerCase() === 'jpeg') {
                            docType = 'image/jpeg';
                        }
                        if (isPreview === true) {
                            this.selectedFilePreviewImageBase64 = '';
                            this.selectedFilePreviewPdf = '';
                            const blobData = resultObj['fileSrc'] as string;
                            if (isPdf) {
                                this.selectedFilePreviewPdf = 'data:' + docType + ';base64,' + blobData;
                            } else {
                                this.selectedFilePreviewImageBase64 = 'data:' + docType + ';base64,' + blobData;
                            }
                            this.showWorkFlowAction = false;
                            event.stopPropagation();
                        } else {
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
                    }
                },
                err => {
                    this.toastr.error(err);
                }
            );
        } catch (error) {
            this.toastr.error(error);
            console.log('@@@@@Error @@@' + error);
        }
    }

    onError(error: any) {
        console.log(`#### Error #### ${error}`);
    }
    /**
     * @description Download Attachment
     * @param params attachment details
     */
    downLoadUploadedAttachment(params) {
        try {
            const ID = {
                documentDataKey: params.documentId,
                fileName: params.uploadedFileName
            };
            this.commonWorkflowService.downloadAttachment(ID).subscribe(
                res => {
                    const url = window.URL.createObjectURL(res);
                    const link = document.createElement('a');
                    link.setAttribute('href', url);
                    link.setAttribute('download', '' + params.uploadedFileName);
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                },
                err => {
                    this.toastr.error(err);
                }
            );
        } catch (error) {
            this.toastr.error(error);
        }
    }

    setEnglishOnFocusOut() {
        SetEnglish();
    }

    toggleLanguage() {
        this.isLangChange = true;
        const elements = this.elem.nativeElement.querySelectorAll('.hasfocus')[0];
        if (elements !== undefined) {
            if (this.currentLang.value === 'Guj') {
                SetEnglish();
                this.currentLang.next('Eng');
            } else {
                SetGujarati();
                this.currentLang.next('Guj');
            }
            elements.focus();
        }
    }
    changeViewToWorkFlowAction() {
        this.showWorkFlowAction = true;
    }
}
