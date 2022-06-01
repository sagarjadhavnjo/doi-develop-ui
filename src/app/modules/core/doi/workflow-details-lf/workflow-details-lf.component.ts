import { Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Component, OnInit, Inject, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { startWith, takeUntil, map } from 'rxjs/operators';
import { HeaderElement } from 'src/app/models/common-listing';
import { ReplaySubject, Subject, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { DialogData } from 'src/app/models/doi/standing-charge';
import { BrwoseDatagrant, ListValue } from 'src/app/models/common-grant';
import { BehaviorSubject } from 'rxjs';
declare function SetGujarati();
declare function SetEnglish();

@Component({
    selector: 'app-workflow-details-lf',
    templateUrl: './workflow-details-lf.component.html',
    styleUrls: ['./workflow-details-lf.component.css']
})
export class WorkflowDetailsLfComponent implements OnInit {
    currentLang = new BehaviorSubject<string>('Eng');
    isLangChange = false;
    hasFocusSet: number;
    public showData: Boolean = true;
    showAction: Boolean = true;

    fileBrowseIndex: number;
    date: any = new Date();
    brwoseData: BrwoseDatagrant[] = [{
        name: undefined,
        file: undefined,
        uploadedBy: undefined

    }];
    dataSourceBrowse = new MatTableDataSource(this.brwoseData);
    displayedBrowseColumns = ['srno', 'attachmentType', 'fileName', 'browse', 'uploadedFileName', 'action'];
    headerJso: HeaderElement[] = [
        { label: 'Financial Year', value: '2019-2020' },
        //   { label: 'Demand', value: '017: Treasury and Accounts Administrations' },
        //   { label: 'Fund', value: 'Consolidated' },
        //   { label: 'Major Head', value: '2054: Treasury and Accounts Administrations' },
        //   { label: 'Sub Major Head', value: '00' },
        //   { label: 'Minor Head', value: '097:Treasury Establishment' },
        //   { label: 'Sub Head', value: '01:Treasuries' },
        //   { label: 'Detailed Head', value: '00' },
        //   { label: 'Charged/Voted', value: 'Voted' },
        //   { label: 'Type of budget', value: 'State' },
        //   { label: 'Bill gross amount', value: '100000'},
        //   { label: 'Bill Deduction', value: '100' },
        //   { label: 'Bill Recovery', value: '0.00' },
        //   { label: 'Bill Net Amount', value: '999900'},
    ];

    displayData: Boolean = false;

    attachment = [
        // {fileName:'Attachment 1', fileType:'image', filePath:'', imgStatus: false},
        { fileName: 'Attachment 1', fileType: 'image', filePath: '../../../assets/sample-attachments/image-sample.jpg', imgStatus: false },
        // {fileName:'Sample PDF', fileType:'pdf', filePath:'src/assets/img/OoPdfFormExample.pdf'},
        // {fileName:'Attachment 2', fileType:'pdf', filePath:'src/assets/img/pdf-test.pdf', pdfStatus: false},
        { fileName: 'Attachment 2', fileType: 'pdf', filePath: '../../../assets/sample-attachments/pdf-sample.pdf', pdfStatus: false },
        // {fileName:'Attachment 2', fileType:'pdf', filePath:'', pdfStatus: false},
    ];
    sample = 'src/assets/img/pdf-test.pdf';
    fieldArray = Array.apply(null, { length: 10 }).map(Number.call, Number);
    show = false;
    page = 1;
    totalPages: number;
    isLoaded = false;
    sampleFlag: boolean;
    tabDisable = true;
    selectedIndex: number;

    actionForm: FormGroup;

    errorMessages = {
        FIN_YEAR: 'Please select any Financial Year',
        DEPARTMENT: 'Please select any Department',
    };

    forwardDialog_history_list: any[] = [
        {
            id: 1, userName: 'Shri S M Modi', designation: 'Deputy Section Officer',
            // tslint:disable-next-line: max-line-length
            role: 'Creator', date: '1/11/2019', comment: 'Please correct standing charge estimate for object head and correct all the calculations.Please verify last 3 year account as well as CSS grant received till date.Ask cooncerned officer from respective office to send necessay details at the earliest to department.'
        },
        {
            id: 2, userName: 'Shri C Patel', designation: 'Section Officer', role: 'Verifier',
            date: '10/11/2019', comment: 'We may approve'
        },
        {
            id: 3, userName: 'Shri P M Shah', designation: 'Deputy Secretaryr',
            role: 'Approver', date: '11/11/2019', comment: 'We may approve'
        },
        // {userName: 'Shri S M modi', designation: 'HOD', date: '11/11/2019', comment: 'We may approve'},
        // {userName: 'Shri S M modi', designation: 'HOD', date: '11/11/2019', comment: 'We may approve'},
        // {userName: 'Shri S M modi', designation: 'HOD', date: '11/11/2019', comment: 'We may approve'},
        // {userName: 'Shri S M modi', designation: 'HOD', date: '11/11/2019', comment: 'We may approve'},
        // {userName: 'Shri S M modi', designation: 'HOD', date: '11/11/2019', comment: 'We may approve'},
        // {userName: 'Shri S M modi', designation: 'HOD', date: '11/11/2019', comment: 'We may approve'},
        // {userName: 'Shri S M modi', designation: 'HOD', date: '11/11/2019', comment: 'We may approve'},
    ];

    action_list: ListValue[] = [
        { value: '1', viewValue: 'Forward' },
        { value: '2', viewValue: 'Return' },
        { value: '3', viewValue: 'Send Back' },
        { value: '4', viewValue: 'Verify' },
        { value: '5', viewValue: 'Approve' },
        { value: '6', viewValue: 'Reject' },
        { value: '7', viewValue: 'Cancel' },
        { value: '8', viewValue: 'Pull back' },
        { value: '9', viewValue: 'Request Submit to TO' },
        { value: '10', viewValue: 'Authorize Cancel Cheque Request' },
        { value: '11', viewValue: 'Receive and Forward' },
        { value: '12', viewValue: 'Send to Peer' },
        { value: '13', viewValue: 'Authorize' },
    ];

    user_list: ListValue[] = [
        { value: '1', viewValue: 'Satendra Zala (DDO)' },
        // { value: '2', viewValue: 'Hardik Chaudhary' },
        // { value: '3', viewValue: 'C.K Brahmbhatt' },
    ];

    attachmentType_list: ListValue[] = [
        { value: '1', viewValue: 'WorkFlow' },
    ];

    actionCtrl: FormControl = new FormControl();
    filteredAction: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

    userCodeCtrl: FormControl = new FormControl();
    filteredUserCode: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

    attachmentTypeCodeCtrl: FormControl = new FormControl();
    filteredAttachmentTypeCode: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

    private _onDestroy = new Subject<void>();

    constructor(private elem: ElementRef,
        private toastr: ToastrService,
        private router: Router,
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<WorkflowDetailsLfComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private el: ElementRef,
    ) { }

    filteredOptions: Observable<string[]>;
    options: any;
    myControl = new FormControl();
    additionalText = new FormControl();

    ngOnInit() {
        // additionalText :['', Validators.required]
        this.createForm();
        if (this.action_list) {
            this.filteredAction.next(this.action_list.slice());
        }
        this.actionCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterObjValue(this.action_list, this.actionCtrl.value, this.filteredAction);
            });
        if (this.user_list) {
            this.filteredUserCode.next(this.user_list.slice());
        }
        this.userCodeCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterObjValue(this.user_list, this.userCodeCtrl.value, this.filteredUserCode);
            });
        this.filteredAttachmentTypeCode.next(this.attachmentType_list.slice());
        this.attachmentTypeCodeCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterObjValue(this.attachmentType_list, this.attachmentTypeCodeCtrl.value, this.filteredAttachmentTypeCode);
            });
        console.log('data', this.data);
        this.options = this.data;
        this.filteredOptions = this.myControl.valueChanges
            .pipe(
                startWith(''),
                map(value => this._filter(value))
            );

        this.actionForm.patchValue({
            'actionCode': '1',
            'userCode': '1'
        });
    }

    gotoListing() {
        this.router.navigate(['']);
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
    uploadAttachment() {
        this.tabDisable = false;
        this.selectedIndex = 2;
    }
    createForm() {
        this.actionForm = this.fb.group({
            actionCode: [''],
            userCode: [''],
        });
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.options.filter(option => option.toLowerCase().includes(filterValue));
    }

    onNoClick(): void {
        this.dialogRef.close('no');
    }

    forwardConsolidate() {
        console.log('forwardConsolidate');
        this.dialogRef.close('yes');
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
        // console.log("pdfData",  pdfData)
        this.totalPages = pdfData.numPages;
        // this.isLoaded = true;
    }
    checkDisplayFile(data) {
        for (let i = 0; i < this.attachment.length; i++) {
            if (data.fileType === 'image') {
                if (this.showAction = true) {
                    this.showAction = false;
                }
                // tslint:disable-next-line: triple-equals
                if (this.attachment[i].fileName == data.fileName) {
                    this.attachment[i].imgStatus = !this.attachment[i].imgStatus;
                    this.show = this.attachment[i].imgStatus ? true : false;
                    // this.showAction = true;
                } else {
                    this.attachment[i].imgStatus = false;
                    // this.show = false;
                }
            } else if (data.fileType === 'pdf') {
                if (this.showAction = true) {
                    this.showAction = false;
                }
                if (this.attachment[i].fileName === data.fileName) {
                    this.attachment[i].pdfStatus = !this.attachment[i].pdfStatus;
                    this.show = this.attachment[i].pdfStatus ? true : false;
                    // this.showAction = true;
                } else {
                    this.attachment[i].pdfStatus = false;
                }
            } else {
            }
            if (this.show === false) {
                this.showAction = true;
                if (this.attachment[i].fileType === 'image') {
                    this.attachment[i].imgStatus = false;
                } else if (this.attachment[i].fileType === 'pdf') {
                    this.attachment[i].pdfStatus = false;
                }
            }
        }
        console.log(data);
    }


    onFileSelection(fileSelected) {
        if (fileSelected.target && fileSelected.target.files) {
            this.dataSourceBrowse.data[this.fileBrowseIndex].file = fileSelected.target.files[0];
        }
    }

    openFileSelector(index) {
        this.el.nativeElement.querySelector('#fileBrowse').click();
        this.fileBrowseIndex = index;
    }

    onBrowseSelectChange() { }

    addBrowse() {
        if (this.dataSourceBrowse) {
            const data = this.dataSourceBrowse.data[this.dataSourceBrowse.data.length - 1];
            if (data && data.name && data.file) {
                const p_data = this.dataSourceBrowse.data;
                p_data.push({
                    name: undefined,
                    file: undefined,
                    uploadedBy: undefined
                });
                this.dataSourceBrowse.data = p_data;
            } else {
                this.toastr.error('Please fill the detail.');
            }
        }
    }
    checkDisplayFileToggle() {
        this.showAction = true;
        this.show = false;
    }
    deleteBrowse(index) {
        this.dataSourceBrowse.data.splice(index, 1);
        this.dataSourceBrowse = new MatTableDataSource(this.dataSourceBrowse.data);
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


}
