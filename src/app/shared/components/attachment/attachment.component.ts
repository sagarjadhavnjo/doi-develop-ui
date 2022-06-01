import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';
import { APIConst } from '../../constants/common/common-api.constants';

@Component({
    selector: 'app-attachment',
    templateUrl: './attachment.component.html',
    styleUrls: ['./attachment.component.css']
})
export class AttachmentComponent implements OnInit {
    attachmentTypeCtrl: FormControl = new FormControl();
    private _onDestroy = new Subject<void>();

    @Input() attachmentData: any;
    @Input() headerId: any;
    @Input() submitted: false;
    attachment_type_list: any[] = [
        { value: 1, viewValue: 'Supporting Document' },
        { value: 2, viewValue: 'Sanction Order' }
    ];

    attachmentTypeIdCtrl: FormControl = new FormControl();
    filteredAttachmentType: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    valueChanged: boolean = false;
    browseData: any[] = [{
        name: undefined,
        file: undefined,
        attachmentId: 0,
        attachmentTypeId: undefined
    }];

    displayedBrowseColumns = ['attachmentTypeId', 'fileName', 'browse', 'uploadedFileName', 'action'];
    allowedFileType = ['jpg', 'jpeg', 'png', 'docx', 'doc', 'pdf', 'xls', 'xlsx', 'JPG', 'JPEG', 'PNG', 'DOCX', 'DOC', 'PDF', 'XLS', 'XLSX'];
    dataSourceBrowse = new MatTableDataSource(this.browseData);
    fileBrowseIndex: number;

    constructor(
        private el: ElementRef,
        private toastr: ToastrService,
        private httpClient: HttpClient) { }

    ngOnInit() {
        this.filteredAttachmentType.next(this.attachment_type_list.slice());
        this.attachmentTypeIdCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterObjValue(this.attachment_type_list, this.attachmentTypeIdCtrl.value, this.filteredAttachmentType);
            });
        this.getAttachmentData();
    }

    onSupportingDocValueCHange(){
        this.valueChanged = true;
    }

    onFileNameChange(){
        this.valueChanged = true;
    }

    getAttachmentData() {
        const self  = this;
        this.getAttachmentList({'id': this.headerId }).subscribe((res) => {
            if (res && res['status'] === 200 && res['result'] && (res['result'].length > 0)) {
                self.browseData = _.cloneDeep(res['result']);
                for (let i = 0; i < res['result'].length; i++) {
                    self.browseData[i].attachmentTypeId = +self.browseData[i].attachmentTypeId;
                }
                this.dataSourceBrowse = new MatTableDataSource(self.browseData);
                self.valueChanged = false;
            } else {
                this.dataSourceBrowse = new MatTableDataSource([{
                    attachmentId: 0,
                    file: '',
                    fileName: '',
                    attachmentTypeId: 1,
                    headerId: this.headerId,
                    pathUploadedFile: '',
                    uploadedFileName: ''
                }]);
                self.valueChanged = false;
            }
        },
            (err) => {
                this.toastr.error(err);
            });
    }

    openFileSelector(index) {
        this.el.nativeElement.querySelector('#fileBrowse').click();
        this.fileBrowseIndex = index;
    }

    onFileSelection(fileSelected) {
        const fileExtension = fileSelected.target.files[0].name.split('.').pop().toLowerCase();
        if (fileSelected.target.files[0].size > 2000000) {
            this.toastr.error('File Size Exceed Limit of 2MB.');
        } else if (this.allowedFileType.indexOf(fileExtension) < 0) {
            this.toastr.error('File extension is not supported.');
        } else {
            this.valueChanged = true;
            this.dataSourceBrowse.data[this.fileBrowseIndex].file = fileSelected.target.files[0];
            this.dataSourceBrowse.data[this.fileBrowseIndex].uploadedFileName = fileSelected.target.files[0].name;
        }
    }

    addBrowse() {
        if (this.dataSourceBrowse) {
            const data = this.dataSourceBrowse.data[this.dataSourceBrowse.data.length - 1];
            if (data && data.fileName && (data.file || data.attachmentId != 0)) {
                const p_data = this.dataSourceBrowse.data;
                p_data.push({
                    attachmentId: 0,
                    attachmentTypeId: 1,
                    file: '',
                    fileName: '',
                    headerId: this.headerId,
                    pathUploadedFile: '',
                    uploadedFileName: '',
                });
                this.dataSourceBrowse.data = p_data;
                this.valueChanged = true;
            } else {
                this.toastr.error('Please fill the detail.');
            }
        }
    }

    deleteBrowse(index, item) {
        const self = this;
        if (item && item.attachmentId != 0) {
            this.deleteFile({ 'id': item.attachmentId }).subscribe((res) => {
                if (res && res['result']) {
                    this.dataSourceBrowse.data.splice(index, 1);
                    this.dataSourceBrowse = new MatTableDataSource(this.dataSourceBrowse.data);
                    self.toastr.success('Successfully deleted!');
                } else {
                    self.toastr.error(res['message']);
                }
            }, (err) => {
                self.toastr.error(err);
            });
        } else {
            this.dataSourceBrowse.data.splice(index, 1);
            const valueChangeCheckArray = this.dataSourceBrowse.data.filter(data => {
                return data.attachmentId === 0;
            });
            if (valueChangeCheckArray.length > 0) {
                self.valueChanged = true;
            } else {
                self.valueChanged = false;
            }
            this.dataSourceBrowse = new MatTableDataSource(this.dataSourceBrowse.data);
        }
    }

    getAttachmentList(params) {
        return this.httpClient.post(`${environment.baseUrl}${this.attachmentData.moduleName}${APIConst.ATTACHMENT.GET_ALL}`, params);
    }

    deleteFile(params) {
        return this.httpClient.post(`${environment.baseUrl}${this.attachmentData.moduleName}${APIConst.ATTACHMENT.DELETE}`, params);
    }

    saveAttachmentTab() {
        let valid = true;
        const formData = new FormData();
        const filesArray = this.dataSourceBrowse.data.filter(item => item.attachmentId === 0);

        if (filesArray.length > 5) {
            this.toastr.error('Only 5 files are allowed at a time');
            return false;
        } else if (filesArray.length === 0) {
            this.toastr.error('Please atleast add one record!');
            return false;
        }

        filesArray.forEach((element, index) => {
            if (!((element.file && element.file !== '') && (element.fileName && element.fileName !== ''))) {
                valid = false;
            }
            formData.append('attch[' + index + '].fileName', element.fileName);
            formData.append('attch[' + index + '].file', element.file);
            formData.append('attch[' + index + '].attachmentId', element.attachmentId.toString());
            formData.append('attch[' + index + '].attachmentTypeId', element.attachmentTypeId.toString());
            formData.append('attch[' + index + '].headerId', this.headerId.toString());
        });

        if (valid) {
            this.saveAttachment(formData).subscribe((res) => {
                if (res && res['status'] === 200) {
                    this.toastr.success('File Uploaded Successfully.');
                    this.valueChanged = false;
                    this.dataSourceBrowse = new MatTableDataSource(res['result']);
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

    saveAttachment(params) {
        return this.httpClient.post(`${environment.baseUrl}${this.attachmentData.moduleName}${APIConst.ATTACHMENT.ADD}`, params);
    }

    downloadAttachFile(params) {
        let ID = {
            'id': params.attachmentId
        }
        this.httpClient.post(`${environment.baseUrl}${this.attachmentData.moduleName}${APIConst.ATTACHMENT.DOWNLOAD}`, ID, { responseType: 'blob' as 'json' }).subscribe((res) => {
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
            });;
    }

    filterObjValue(arrValue, searchValue, filteredValue) {
        if (!arrValue) {
            return;
        }
        // get the search keyword
        let search = searchValue;
        if (!search) {
            filteredValue.next(arrValue.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the values
        filteredValue.next(
            arrValue.filter(item => item.viewValue.toLowerCase().indexOf(search) > -1)
        );
    }

    getAttachmentValueChange() {
        return this.valueChanged;
    }

}
