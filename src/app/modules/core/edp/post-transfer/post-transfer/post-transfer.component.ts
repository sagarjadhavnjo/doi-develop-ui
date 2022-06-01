import { Component, OnInit, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SelectionModel } from '@angular/cdk/collections';
import { TabelElement, PostTransferList } from '../../model/post-transfer-model';
import { HttpClient } from '@angular/common/http';
import { PostTransferService } from '../../services/post-transfer.service';
import { msgConst } from 'src/app/shared/constants/edp/edp-msg.constants';
import { EdpDataConst } from 'src/app/shared/constants/edp/edp-data.constants';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Subscription, Subject } from 'rxjs';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import * as _ from 'lodash';
import { APIConst } from 'src/app/shared/constants/edp/edp-api.constants';
import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/modules/services/common.service';
import { AddDesignationService } from '../../services/add-designation.service';
import { DistrictName, OfficeListData } from '../../model/add-designation';
import {
    PostTransferToEmployee,
    PostTransferToUser,
    PostTransferToVacant,
    PostTransferVacantToEmployee,
    PostTransferVacantToUser,
    FormActions,
    EdpUsrPoTrnsDetailDto,
    EditViewPostTransfer,
    WorkFlowDetailDto,
    WfRequestDto
} from '../post-transfer';
import { debounceTime, map } from 'rxjs/operators';
import { CommonWorkflowComponent } from '../../../common/common-workflow/common-workflow.component';
import { ModuleNames } from '../../../common/constant/common-workflow.constants';
import { HeaderJson, WorkflowPopupData } from '../../../common/model/common-workflow';
import { element } from 'protractor';
import { ViewCommonWorkflowHistoryComponent } from '../../../common/view-common-workflow-history/view-common-workflow-history.component';
import { SearchDialogComponent } from 'src/app/shared/components/search-dialog/search-dialog.component';
@Component({
    selector: 'app-already-exists-dialog',
    templateUrl: 'already-exists-dialog.html',
    styleUrls: ['./post-transfer.component.css']
})
export class AlreadyExistsDialogComponent implements OnInit {
    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<AlreadyExistsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data
    ) {}
    message: string;
    ngOnInit() {
        this.message = this.data.message;
    }

    onNoClick(data): void {
        this.dialogRef.close(data);
    }
}

@Component({
    selector: 'app-post-transfer',
    templateUrl: './post-transfer.component.html',
    styleUrls: ['./post-transfer.component.css']
})
export class PostTransferComponent implements OnInit {
    subscribeParams: Subscription;
    employeeFromNumber: number;
    postTransferId: number;
    transactionNo: string;
    transactionDate: string;
    headerId: string;
    fromUserId: number;
    employeeToNumber: number;
    toUserId: number;
    officeId: number;
    selectedIndex: number;
    totalAttachmentSize: number;
    noOfAttachment: number;
    userCode: number;
    userName: string;
    action: string = 'new';
    districtId: number;
    officeDistrictId: number;

    isWfStatusDraft: boolean = true;
    saveDraftEnable: boolean = false;
    isSubmitDisable: boolean = true;
    emplFromRequired: boolean = false;
    emplToRequired: boolean = false;
    isPostTransferToPrimary: boolean = false;
    isPostTransferFromEmpl: boolean = false;
    isPostTransferFromEmplName: boolean = false;
    isPostTransferFromTable: boolean = false;
    isPostTransferToEmpl: boolean = false;
    isPostTransferToEmplName: boolean = false;
    isPostTransferToTable: boolean = false;
    isPostToBeTransferVisible: boolean = false;
    showPostListTitle = false;
    isVacantPostTable = false;
    checkedBox: boolean = false;
    officeDivision: string;
    isDATUser: boolean = false;
    objStatus: boolean = false;
    isHodUser: boolean = false;
    isToPaoUser: boolean = false;
    isEdpUser: boolean = false;
    isObjectionRequired: boolean = false;
    isCheckWorkFlow: boolean = false;
    hasWorkFlow: boolean = false;
    isOfficeDetailSearch: boolean = false;

    userType: string;
    isInActiveSelected: boolean;
    isCancelSelected: boolean;
    fileBrowseIndex: any;
    toEmployeeInfo: any;
    fromEmployeeInfo: any;
    edpUsrPoTrnsHeaderId: number;
    postData;
    @ViewChild('postTransferAttachment', { static: true }) postTransferAttachment: ElementRef;
    displayedColumnsFooter = ['select'];
    displayColumnFromPost = ['select', 'srNo', 'postName', 'postType', 'officeName', 'action'];
    displayedColumnToPost: string[] = ['srNo', 'postName', 'postType'];
    displayedColumnsToPostFooter = ['srNo'];
    displayedColumnPostTransfer = ['srNo', 'postName', 'postType'];
    displayedColumnVacantPost = ['select', 'srNo', 'postName', 'userName'];

    dataSourceFromPostList = new MatTableDataSource([]);
    dataSourceToPostList = new MatTableDataSource([]);
    dataSourceSelectedPostList = new MatTableDataSource([]);
    dataSourceVacantPost = new MatTableDataSource([]);

    selectedFromPostData = [];
    selectedToPostData = [];
    selectionFromPostListTable = new SelectionModel(true, []);
    selectionVacantPostListTable = new SelectionModel(true, []);
    postTransferForm: FormGroup;
    empNoCtrlModelChanged: Subject<string> = new Subject<string>();

    displayedBrowseColumnsAttachment = [
        'id',
        'attachmentType',
        'fileName',
        'browse',
        'uploadedFileName',
        'uploadedBy',
        'action'
    ];

    today_date = Date.now();

    postListfr: any[] = [];
    postListtoo: any[] = [];
    errorMessages = msgConst;
    postTransferList: PostTransferList[] = [];
    postTransferFromList: PostTransferList[] = [];
    postTransferToList: PostTransferList[] = [];
    postTypeList: any[] = [];
    browseData: TabelElement[] = [];
    districtNameList: DistrictName[] = [];
    officeListData: OfficeListData[] = [];

    districtCtrl: FormControl = new FormControl();
    empNoCtrl: FormControl = new FormControl();
    postCtrl: FormControl = new FormControl();
    Postnamecodectrl: FormControl = new FormControl();
    postcheckctr: FormControl = new FormControl();
    dataSourceBrowse = new MatTableDataSource(this.browseData);
    matSelectNullValue = EdpDataConst.MAT_SELECT_NULL_VALUE;

    constructor(
        private fb: FormBuilder,
        private el: ElementRef,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private httpClient: HttpClient,
        private toastr: ToastrService,
        private dialog: MatDialog,
        private storageService: StorageService,
        private postTransferService: PostTransferService,
        private commonService: CommonService,
        private addDesignationService: AddDesignationService
    ) {
        this.empNoCtrlModelChanged.pipe(debounceTime(300)).subscribe(value => {
            this.employeeNoFromKeyUp(value, true);
        });
    }
    ngOnInit() {
        this.errorMessages = msgConst;
        this.noOfAttachment = 0;
        this.totalAttachmentSize = 0;
        this.fromUserId = 0;
        this.toUserId = 0;
        this.userName = this.storageService.get('userName');
        this.createForm();

        const userOffice = this.storageService.get('userOffice');
        this.officeDivision = userOffice['officeDivision'];
        this.selectedIndex = 0;
        this.subscribeParams = this.activatedRoute.params.subscribe(resRoute => {
            this.action = resRoute.action;

            if (this.action === 'edit' || this.action === 'view') {
                this.isWfStatusDraft = resRoute.isWfStatusDraft === 'false' ? false : true;
                this.loadDataForEditMode(resRoute.id, resRoute.status, this.action);
                this.postTransferId = resRoute.id;
                this.isSubmitDisable = false;
                if (!this.isWfStatusDraft) {
                    this.postTransferForm.disable();
                    this.empNoCtrl.disable();
                    this.postTransferForm.controls['objStatus'].enable();
                    this.postTransferForm.controls['objRemark'].enable();
                }
                if (this.postTransferId) {
                    if (this.action === 'view') {
                        this.postTransferForm.disable();
                        this.empNoCtrl.disable();
                    }
                } else {
                    this.router.navigate(['../new'], { relativeTo: this.activatedRoute, skipLocationChange: true });
                }
            } else {
                this.loadDistrictDetails();
                this.action = 'new';
            }
        });

        this.postTransferForm.valueChanges.subscribe(() => {
            this.saveDraftEnable = true;
        });
    }

    createForm() {
        this.postTransferForm = this.fb.group({
            district: [''],
            ddoNo: [''],
            cardexNo: [''],
            officeName: [''],
            postTransFrom: ['', [Validators.required]],
            postTransTo: ['', [Validators.required]],
            employeeNoFrom: [''],
            employeeNameFrom: [''],
            employeeNoTo: [''],
            employeeNameTo: [''],
            objStatus: [''],
            objRemark: ['']
        });
        if (this.objStatus) {
            this.objectionRemarks();
        }
    }
    loadDataForEditMode(id: number, status: string = null, action = null) {
        this.postTransferId = id;
        if (status === 'Approved' && action === 'view') {
            // view mode
            this.addDesignationService.loadDistrictDetails('').subscribe(
                (res: any) => {
                    if (res && res.result && res.status === 200) {
                        const districtData = res.result;
                        if (districtData) {
                            this.districtNameList = districtData;
                        }
                        this.postTransferId = id;
                        this.isSubmitDisable = false;

                        const viewPostTransferRequest = this.getEditOrViewPostTransferRequest();
                        this.getPostTransferDataForView(viewPostTransferRequest);
                    } else {
                        this.toastr.error(res.message);
                    }
                },
                err => {
                    this.toastr.error(err);
                }
            );
        } else {
            // Edit Mode
            this.addDesignationService.loadDistrictDetails('').subscribe(
                (res: any) => {
                    if (res && res.result && res.status === 200) {
                        const districtData = res.result;
                        if (districtData) {
                            this.districtNameList = districtData;
                        }
                        this.postTransferId = id;
                        this.isSubmitDisable = false;

                        const editPostTransferRequest = this.getEditOrViewPostTransferRequest();
                        this.getPostTransferDataForEdit(editPostTransferRequest);
                    } else {
                        this.toastr.error(res.message);
                    }
                },
                err => {
                    this.toastr.error(err);
                }
            );
        }
    }

    getPostTransferDataForView(viewPostTransferRequest: EditViewPostTransfer) {
        this.postTransferService.getPostTransferApproveData(viewPostTransferRequest).subscribe(
            (res: any) => {
                this.setPostTransferDataForEditOrView(res);
            },
            err => {
                this.toastr.error(this.errorMessages['POST_TRANSFER']['CREATE']['ERR_LOAD_DATA']);
            }
        );
    }

    getEditOrViewPostTransferRequest(): EditViewPostTransfer {
        const editPostTransfer: EditViewPostTransfer = {
            edpUsrTrnHeaderId: +this.postTransferId.toString(),
            from: true,
            id: 0,
            lkPoOffId: 0,
            officeId: 0,
            userCode: null,
            userId: 0
        };
        return editPostTransfer;
    }

    getPostTransferDataForEdit(editPostTransferRequest: EditViewPostTransfer) {
        this.postTransferService.getPostTransferData(editPostTransferRequest).subscribe(
            (res: any) => {
                this.setPostTransferDataForEditOrView(res);
            },
            err => {
                this.toastr.error(this.errorMessages['POST_TRANSFER']['CREATE']['ERR_LOAD_DATA']);
            }
        );
    }

    setPostTransferDataForEditOrView(res: any) {
        if (res && res.result && res.status === 200) {
            const response = res.result;
            this.transactionNo = response.trnNo;
            this.transactionDate = response.createdDate;
            this.postTransferId = response.edpUsrPoTrnsHeaderId;
            this.loadAttachmentList(this.postTransferId);
            this.officeId = response.officeId;
            this.districtId = response.districtId;
            // objection check based on response
            this.isObjectionRequired = response.isObjectionRequired;
            this.hasWorkFlow = response.wfInRequest;
            const districtDetails = this.districtNameList.find(data => {
                return data.id === response.districtId;
            });
            if (districtDetails) {
                const officeDetail = districtDetails.officeList.find(x => x.id === this.officeId);

                if (this.officeDivision && this.officeDivision.toLowerCase() === 'dat') {
                    this.isDATUser = true;
                    this.isOfficeDetailSearch = true;
                    this.officeDistrictId = response.districtId;
                } else {
                    this.isDATUser = false;
                }
                this.objStatus = response.hasObjection;
                this.postTransferForm.patchValue({
                    district: this.isDATUser ? response.districtId : districtDetails.name,
                    ddoNo: officeDetail.ddoNo,
                    cardexNo: officeDetail.cardexNo,
                    officeName: officeDetail.name,
                    objStatus: response.hasObjection,
                    objRemark: response.objectionRemarks
                });
            }
            this.setOfficeData(response);
            this.getPostTransferFrom();
            this.getPostTypeList();
            this.loadAllDataForEdit(response);
        } else {
            this.toastr.error(res['message']);
        }
    }

    loadAllDataForEdit(response: any) {
        this.edpUsrPoTrnsHeaderId = response.edpUsrPoTrnsHeaderId;

        if (!response.fromUserId) {
            // vacant to user/emp

            this.loadFromVacantPostForEdit(response);
            this.loadToEmplyeeOrUserForEdit(response);
        } else if (response.toEmpId || response.toUserId) {
            // Employee to (Employee or user)
            this.loadFromEmployeeForEdit(response);
            this.loadToEmplyeeOrUserForEdit(response);
        } else {
            // Employee to vacant

            this.isPostTransferToTable = false;
            this.loadToVacantPostForEdit();
            this.loadFromEmployeeForEdit(response);
        }
    }

    loadToEmplyeeOrUserForEdit(response: any) {
        this.toEmployeeInfo = response.toUserPost;
        this.isPostTransferToEmpl = true;
        this.isPostTransferToTable = true;
        this.isPostTransferToEmplName = true;
        this.postTransferForm.controls.postTransTo.setValue(EdpDataConst.POST_TRNSF_EMP);
        this.postTransferForm.controls.employeeNoTo.setValue(response.toUserCode);
        this.postTransferForm.controls.employeeNameTo.setValue(response.toUserName);
        if (response.toUserPost && response.toUserPost.postMapDto) {
            this.dataSourceToPostList = new MatTableDataSource(response.toUserPost.postMapDto);
        } else {
            this.dataSourceToPostList = new MatTableDataSource([]);
        }
    }

    loadFromEmployeeForEdit(response: any) {
        this.employeeFromNumber = +response.fromUserCode;
        this.fromUserId = response.fromUserId;
        this.fromEmployeeInfo = response.fromUserPost;
        this.postData = response.fromUserPost.postMapDto;
        this.isPostTransferFromEmpl = true;
        this.isPostTransferFromTable = true;
        this.isPostTransferFromEmplName = true;
        this.postTransferForm.controls.postTransFrom.setValue(EdpDataConst.POST_TRNSF_EMP);
        this.postTransferForm.controls.employeeNoFrom.setValue(response.fromUserCode);
        this.postTransferForm.controls.employeeNameFrom.setValue(response.fromUserName);
        this.dataSourceFromPostList = new MatTableDataSource(response.fromUserPost.postMapDto);
        this.mapSelectedPosts(response.detailDto, EdpDataConst.POST_TRNSF_EMP);
    }

    loadToVacantPostForEdit() {
        this.dataSourceToPostList = new MatTableDataSource([]);
        this.postTransferForm.controls.postTransTo.setValue(EdpDataConst.POST_TRNSF_VACANT);
    }
    getPostTransferFrom() {
        const param = {
            name: 'Post Transfer'
        };
        this.postTransferService.getPostTransferList(param).subscribe(
            (res: any) => {
                if (res && res.result && res.status === 200) {
                    const response = res.result;
                    this.postTransferList = [];
                    this.postTransferFromList = [];
                    this.postTransferToList = [];
                    response.forEach(listObj => {
                        const listData: PostTransferList = {
                            lookUpInfoId: listObj.lookUpInfoId,
                            lookUpInfoName: listObj.lookUpInfoName,
                            lookUpInfoValue: listObj.lookUpInfoValue
                        };
                        this.postTransferList.push(_.cloneDeep(listData));
                        this.postTransferFromList.push(_.cloneDeep(listData));
                        this.postTransferToList.push(_.cloneDeep(listData));
                    });
                } else {
                    this.toastr.error(res.message);
                }
            },
            err => {
                this.toastr.error(this.errorMessages.POST_TRANSFER.CREATE.ERR_LOAD_POST_TRANS_TYPE);
            }
        );
    }

    loadFromVacantPostForEdit(response) {
        this.postTransferForm.controls.postTransFrom.setValue(EdpDataConst.POST_TRNSF_VACANT);

        this.isPostTransferFromEmpl = false;
        this.isPostTransferFromTable = false;
        this.isPostTransferFromEmplName = false;

        this.postTransferForm.controls.employeeNoFrom.setValue('');
        this.postTransferForm.controls.employeeNameFrom.setValue('');

        this.isVacantPostTable = true;
        this.dataSourceVacantPost = new MatTableDataSource(response.vacantPostsDto);

        this.mapSelectedPosts(response.detailDto, EdpDataConst.POST_TRNSF_VACANT);
    }

    mapSelectedPosts(detailDto: any[], postFromType) {
        if (detailDto.length) {
            switch (postFromType) {
                case EdpDataConst.POST_TRNSF_VACANT:
                    this.dataSourceVacantPost.data.forEach(p => {
                        const post = detailDto.find(x => x.postOfficeId === p.lkPoOffId);
                        if (post) {
                            // First select  // selected change
                            this.selectionVacantPostListTable.select(p);
                        }
                    });
                    this.dataSourceSelectedPostList = new MatTableDataSource(
                        this.selectionVacantPostListTable.selected
                    );
                    this.setSelectedPost(detailDto);

                    break;
                case EdpDataConst.POST_TRNSF_EMP:
                default:
                    this.dataSourceFromPostList.data.forEach(p => {
                        const post = detailDto.find(x => x.postOfficeId === p.lkPoOffId);
                        if (post) {
                            this.selectionFromPostListTable.select(p);
                        }
                    });
                    this.dataSourceSelectedPostList = new MatTableDataSource(this.selectionFromPostListTable.selected);
                    this.setSelectedPost(detailDto);
                    break;
            }
            const data = this.postTransferForm.controls.postTransTo.value;

            if (data === EdpDataConst.POST_TRNSF_VACANT) {
                this.isPostToBeTransferVisible = false;
            } else {
                this.isPostToBeTransferVisible = true;
            }
        }
    }

    setSelectedPost(detailDto: any[]) {
        const selectedPostData = [];
        detailDto.forEach(post => {
            const selectedPost = _.cloneDeep(this.dataSourceSelectedPostList.data).find(
                x => x.lkPoOffId === post.postOfficeId
            );
            if (selectedPost) {
                if (post.willBePrimary) {
                    selectedPost.postTypeValue = EdpDataConst.POST_TYPE_PRIMARY;
                    selectedPost.isPrimaryPost = true;
                } else {
                    selectedPost.postTypeValue = EdpDataConst.POST_TYPE_SECONDARY;
                    selectedPost.isPrimaryPost = false;
                }
                selectedPostData.push(selectedPost);
            }
        });

        this.dataSourceSelectedPostList = new MatTableDataSource(selectedPostData);
    }

    getAssignedSelectedPost(post, postListData) {
        if (post.willBePrimary) {
            postListData.postTypeValue = EdpDataConst.POST_TYPE_PRIMARY;
            postListData.isPrimaryPost = true;
        } else {
            postListData.postTypeValue = EdpDataConst.POST_TYPE_SECONDARY;
            postListData.isPrimaryPost = false;
        }
        return postListData;
    }
    loadDistrictDetails() {
        const userOffice = this.storageService.get('userOffice');
        this.officeDivision = userOffice['officeDivision'];
        if (this.officeDivision && this.officeDivision.toLowerCase() === 'DAT'.toLowerCase()) {
            this.isDATUser = true;
            this.addDesignationService.loadDistrictDetails('').subscribe(
                res => {
                    this.getPostTransferList();
                    this.getPostTypeList();
                    this.getAttachmentMasterData();
                    if (res && res['result'] && res['status'] === 200) {
                        const districtData = res['result'];
                        if (districtData) {
                            this.districtNameList = districtData;
                        } else {
                            this.toastr.error(this.errorMessages['ADD_DESIGNATION']['DISTRICT_NAME']);
                        }
                    } else {
                        this.toastr.error(res['message']);
                    }
                },
                err => {
                    this.toastr.error(err);
                }
            );
        } else {
            this.postTransferForm.patchValue({
                district: userOffice.districtName,
                ddoNo: userOffice.ddoNo,
                cardexNo: userOffice.cardexno,
                officeName: userOffice.officeName
            });
            this.officeId = userOffice.officeId;
            this.districtId = userOffice.districtId;
            this.isDATUser = false;
            this.getPostTransferList();
            this.getPostTypeList();
            this.getAttachmentMasterData();
        }
    }

    onDistrictChange() {
        this.resetPostTransferInfo();
        this.resetOnlyDDOAndCardex();
        const district = this.postTransferForm.controls.district.value;
        this.officeDistrictId = district;
        if (district) {
            this.isOfficeDetailSearch = true;
        } else {
            this.isOfficeDetailSearch = false;
        }
    }

    resetFromToPostTransfer() {
        if (this.isDATUser) {
            this.resetOfficeDetails();
        }
        this.resetPostTransferInfo();
    }

    resetPostTransferInfo() {
        this.dataSourceFromPostList = new MatTableDataSource([]);
        this.dataSourceToPostList = new MatTableDataSource([]);
        this.dataSourceVacantPost = new MatTableDataSource([]);
        this.dataSourceSelectedPostList = new MatTableDataSource([]);

        this.selectionVacantPostListTable.clear();
        this.selectionFromPostListTable.clear();

        this.postTransferForm.patchValue({
            employeeNoFrom: '',
            employeeNameFrom: '',
            employeeNoTo: '',
            employeeNameTo: '',
            postTransFrom: '',
            postTransTo: ''
        });
        this.isPostTransferFromEmpl = false;
        this.isPostTransferFromEmplName = false;
        this.isPostTransferFromTable = false;
        this.isVacantPostTable = false;

        this.isPostTransferToEmpl = false;
        this.isPostTransferToEmplName = false;
        this.isPostTransferToTable = false;
        this.isPostToBeTransferVisible = false;
        this.postTransferForm.markAsPristine();
        this.postTransferForm.markAsUntouched();
    }

    resetOfficeDetails() {
        this.postTransferForm.patchValue({
            district: '',
            ddoNo: '',
            cardexNo: '',
            officeName: ''
        });
        const district = this.postTransferForm.controls.district.value;
        if (district) {
            this.isOfficeDetailSearch = true;
        } else {
            this.isOfficeDetailSearch = false;
        }
    }

    resetOnlyDDOAndCardex() {
        this.postTransferForm.patchValue({
            ddoNo: '',
            cardexNo: '',
            officeName: ''
        });
    }

    onCardexDDOChange() {
        const ddoNo = this.postTransferForm.controls.ddoNo.value;
        const cardexNo = this.postTransferForm.controls.cardexNo.value;
        const district = this.postTransferForm.controls.district.value;
        this.districtId = district;
        if (ddoNo && cardexNo && district) {
            this.postTransferForm.controls.officeName.setValue('');
            const officeList = this.districtNameList.find(data => {
                return data.id === +district;
            });
            if (officeList) {
                this.officeListData = _.cloneDeep(officeList.officeList);
            }
            if (this.officeListData && this.officeListData.length > 0) {
                const officeObj = this.officeListData.find(
                    office => ddoNo === office.ddoNo && cardexNo.toString() === office.cardexNo.toString()
                );

                if (officeObj) {
                    this.postTransferForm.patchValue({
                        officeName: officeObj.name
                    });
                    this.officeId = officeObj.id;
                    this.isOfficeDetailSearch = true;
                } else {
                    this.officeId = null;
                    this.isOfficeDetailSearch = false;
                }
                if (!this.postTransferForm.controls.officeName.value) {
                    this.toastr.error(this.errorMessages['ADD_DESIGNATION']['OFFICE']);
                    this.postTransferForm.controls.officeName.setValue('');
                    this.saveDraftEnable = false;
                    this.isSubmitDisable = true;
                } else {
                    this.saveDraftEnable = true;
                    this.isSubmitDisable = false;
                }
            }
        }
        this.resetPostTransferInfo();
    }

    loadPostTransferData(postTransferId) {
        const param = {
            headerId: postTransferId
        };
        this.postTransferService.getPostTransferData(param).subscribe(
            res => {
                if (res && res['result'] && res['status'] === 200) {
                    const response = res['result'];
                    this.transactionNo = response.trnNo;
                    this.transactionDate = response.createdDate;
                    this.selectedFromPostData = _.cloneDeep(response.edpUsrPoTrnsDetailDto);
                    this.selectedToPostData = _.cloneDeep(response.edpUsrPoTrnsDetailDto);
                    this.postTransferId = response.edpUsrPoTrnsHeaderId;
                    this.loadAttachmentList(this.postTransferId);
                    this.postTransferForm.controls.district.patchValue(response.districtId);
                    // this.onDistrictChange();
                    this.officeId = response.officeId;
                    this.setOfficeData(response);
                    if (response.fromUserCode) {
                        this.isPostTransferFromEmpl = true;
                        this.postTransferForm.controls.postTransFrom.setValue(EdpDataConst.POST_TRNSF_EMP);
                        this.postTransferForm.controls.employeeNoFrom.setValue(response.fromUserCode);
                        this.employeeNoFromKeyUp(response.fromUserCode);
                    } else {
                        this.postTransferForm.controls.postTransFrom.setValue(EdpDataConst.POST_TRNSF_VACANT);
                        this.postTransferFormChange();
                    }

                    if (response.toUserCode) {
                        this.isPostTransferToEmpl = true;
                        this.postTransferForm.controls.postTransTo.setValue(EdpDataConst.POST_TRNSF_EMP);
                        this.postTransferForm.controls.employeeNoTo.setValue(response.toUserCode);
                        this.employeeNoToKeyUp(response.toUserCode);
                    } else {
                        this.postTransferForm.controls.postTransTo.setValue(EdpDataConst.POST_TRNSF_VACANT);
                        this.postTransferToChange();
                    }
                } else {
                    this.toastr.error(res['message']);
                }
            },
            err => {
                this.toastr.error(this.errorMessages['POST_TRANSFER']['CREATE']['ERR_LOAD_DATA']);
            }
        );
    }

    getPostTransferList() {
        const param = {
            name: 'Post Transfer'
        };
        this.postTransferService.getPostTransferList(param).subscribe(
            res => {
                if (res && res['result'] && res['status'] === 200) {
                    const response = res['result'];
                    this.postTransferList = [];
                    this.postTransferFromList = [];
                    this.postTransferToList = [];
                    response.forEach(listObj => {
                        const listData: PostTransferList = {
                            lookUpInfoId: listObj['lookUpInfoId'],
                            lookUpInfoName: listObj['lookUpInfoName'],
                            lookUpInfoValue: listObj['lookUpInfoValue']
                        };
                        this.postTransferList.push(_.cloneDeep(listData));
                        this.postTransferFromList.push(_.cloneDeep(listData));
                        this.postTransferToList.push(_.cloneDeep(listData));
                    });
                    if (this.action === 'edit' || this.action === 'view') {
                        this.loadPostTransferData(this.postTransferId);
                    }
                } else {
                    this.toastr.error(res['message']);
                }
            },
            err => {
                this.toastr.error(this.errorMessages['POST_TRANSFER']['CREATE']['ERR_LOAD_POST_TRANS_TYPE']);
            }
        );
    }

    getPostTypeList() {
        const param = {
            name: 'Post Type'
        };
        this.postTransferService.getPostTransferList(param).subscribe(
            res => {
                if (res && res['result'] && res['status'] === 200) {
                    const response = res['result'];
                    this.postTypeList = [];
                    response.forEach(listObj => {
                        const listData: PostTransferList = {
                            lookUpInfoId: listObj['lookUpInfoId'],
                            lookUpInfoName: listObj['lookUpInfoName'],
                            lookUpInfoValue: listObj['lookUpInfoValue']
                        };
                        // this.postTypeData.push(_.cloneDeep(listData));
                        this.postTypeList.push(_.cloneDeep(listData));
                    });
                } else {
                    this.toastr.error(res['message']);
                }
            },
            err => {
                this.toastr.error(this.errorMessages['POST_TRANSFER']['CREATE']['ERR_LOAD_POST_TYPE']);
            }
        );
    }

    showConfirmationPopup(postData) {
        const self = this;
        // tslint:disable-next-line: no-use-before-declare
        const dialogRef = self.dialog.open(ChargeConfirmDialogComponent, {
            width: '400px'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                if (postData.lkPoOffId && self.employeeFromNumber && self.fromUserId) {
                    const param = {
                        lkPoOffId: postData.lkPoOffId,
                        userCode: self.employeeFromNumber,
                        userId: self.fromUserId
                    };

                    self.postTransferService.changePostType(param).subscribe(
                        res => {
                            if (res && res['result'] && res['status'] === 200) {
                                self.isPostTransferFromEmplName = true;
                                self.isPostTransferFromTable = true;
                                const data = this.postData.filter(postObj => postObj.lkPoOffId === postData.lkPoOffId);

                                this.dataSourceSelectedPostList.data
                                    .filter(selectedPost => selectedPost.lkPoOffId === postData.lkPoOffId)
                                    .forEach(post => {
                                        post.postTypeValue = EdpDataConst.POST_TYPE_PRIMARY;
                                        post.isPrimaryPost = true;
                                    });

                                this.dataSourceSelectedPostList.data
                                    .filter(selectedPost => selectedPost.lkPoOffId !== postData.lkPoOffId)
                                    .forEach(post => {
                                        post.postType = EdpDataConst.POST_TYPE_SECONDARY;
                                        post.isPrimaryPost = false;
                                    });

                                if (data) {
                                    this.postData.forEach(postTransferObj => {
                                        if (postTransferObj['postType'] === 'Primary') {
                                            postTransferObj['postType'] = 'Secondary';
                                            postTransferObj['isPrimaryPost'] = false;
                                        }
                                    });
                                    data.forEach(resObj => {
                                        if (resObj['postType'] === 'Secondary') {
                                            resObj['postType'] = 'Primary';
                                            resObj['isPrimaryPost'] = true;
                                        }
                                    });

                                    this.postData = _.orderBy(this.postData, x => x.isPrimaryPost, ['desc']);
                                    self.dataSourceFromPostList = new MatTableDataSource(this.postData);
                                }
                                if (res['message']) {
                                    this.toastr.success(res['message']);
                                } else {
                                    // tslint:disable-next-line: max-line-length
                                    this.toastr.success(
                                        this.errorMessages['POST_TRANSFER']['CREATE']['CHANGE_POST_TYPE']
                                    );
                                }
                            } else {
                                this.toastr.error(res['message']);
                            }
                        },
                        err => {
                            self.toastr.error(this.errorMessages['POST_TRANSFER']['CREATE']['ERR_CHANGE_POST_TYPE']);
                        }
                    );
                }
            }
        });
    }

    /**
     * chckbox selection logic for the From Post List data source table
     */
    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelectedFromPostList() {
        const numSelected = this.selectionFromPostListTable.selected.length;
        const enableRows = this.dataSourceFromPostList.data.filter(obj => {
            return obj.isSameOffice;
        });
        const numRows = enableRows.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selectionFromPostListTable. */
    fromPostListTableMasterToggle(event: any) {
        if (event.checked) {
            this.selectAll();
        } else {
            this.clearFromAll();
        }
        const data = this.postTransferForm.controls.postTransFrom.value;
        if (data === EdpDataConst.POST_TRNSF_VACANT) {
            this.loadPostToBeTransfer('vacant');
        } else {
            this.loadPostToBeTransfer('mapped');
        }
    }

    clearFromAll() {
        this.selectionFromPostListTable.clear();
        this.selectedFromPostData = [];
    }

    selectAll() {
        this.dataSourceFromPostList.data.forEach(row => {
            if (row.isSameOffice) {
                this.selectionFromPostListTable.select(row);
            }
        });
    }

    /** The label for the checkbox on the passed row */
    checkboxLabelFromPostList(row?): string {
        // this.dataSourceSelectedPostList = new MatTableDataSource([]);
        if (!row) {
            return `${this.isAllSelectedFromPostList() ? 'select' : 'deselect'} all`;
        }
        return `${this.selectionFromPostListTable.isSelected(row) ? 'deselect' : 'select'} row ${row.srNo + 1}`;
    }
    mappedSelectionChange(item) {
        this.selectionFromPostListTable.toggle(item);
        const data = this.postTransferForm.controls.postTransFrom.value;
        if (data === EdpDataConst.POST_TRNSF_VACANT) {
            this.loadPostToBeTransfer('vacant');
        } else {
            this.loadPostToBeTransfer('mapped');
        }
    }
    // chckbox selection logic ends here for the From Post List data source table

    /**
     * chckbox selection logic for the Vacant Post List data source table
     */
    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelectedVacantPostList() {
        const numSelected = this.selectionVacantPostListTable.selected.length;
        const numRows = this.dataSourceVacantPost.data.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selectionFromPostListTable. */
    vacantPostListTableMasterToggle() {
        const isAllSelectedFlag = this.isAllSelectedVacantPostList();
        isAllSelectedFlag ? this.clearVacantAll() : this.selectAllVacant();
        this.loadPostToBeTransfer('vacant');
    }

    clearVacantAll() {
        this.selectionVacantPostListTable.clear();
        this.selectedFromPostData = [];
    }

    selectAllVacant() {
        this.dataSourceVacantPost.data.forEach(row => {
            if (row.checked) {
                this.selectionVacantPostListTable.select(row);
            }
        });
    }

    /** The label for the checkbox on the passed row */
    checkboxLabelVacantPostList(row?): string {
        if (!row) {
            return `${this.isAllSelectedVacantPostList() ? 'select' : 'deselect'} all`;
        }
        return `${this.selectionVacantPostListTable.isSelected(row) ? 'deselect' : 'select'} row ${row.srNo + 1}`;
    }
    vacantSelectionChange(item) {
        this.selectionVacantPostListTable.toggle(item);
        this.loadPostToBeTransfer('vacant');
    }
    // chckbox selection logic ends here for the Vacant Post List data source table

    loadPostToBeTransfer(type) {
        if (type === 'vacant') {
            const data = this.postTransferForm.controls.postTransTo.value;
            if (data === EdpDataConst.POST_TRNSF_EMP) {
                this.isPostToBeTransferVisible = true;
            } else {
                this.isPostToBeTransferVisible = false;
            }

            this.isVacantPostTable = true;
            this.dataSourceSelectedPostList = new MatTableDataSource(
                _.cloneDeep(this.selectionVacantPostListTable.selected)
            );
        } else if (type === 'mapped') {
            const data = this.postTransferForm.controls.postTransTo.value;
            if (data === EdpDataConst.POST_TRNSF_VACANT) {
                this.isPostToBeTransferVisible = false;
            } else {
                this.isPostToBeTransferVisible = true;
            }

            this.isVacantPostTable = false;
            this.dataSourceSelectedPostList = new MatTableDataSource(
                _.cloneDeep(this.selectionFromPostListTable.selected)
            );
        }
        if (this.selectedFromPostData && this.selectedFromPostData.length > 0) {
            this.selectedFromPostData.forEach(selectedObj => {
                this.dataSourceSelectedPostList.data.forEach(selectedPost => {
                    if (selectedObj.setPostTypeId === EdpDataConst.POST_TYPE_PRIMARY) {
                        selectedPost.postType = EdpDataConst.POST_TYPE_PRIMARY;
                    } else if (selectedObj.setPostTypeId === EdpDataConst.POST_TYPE_SECONDARY) {
                        selectedPost.postType = EdpDataConst.POST_TYPE_SECONDARY;
                    }
                });
            });
        }
        this.dataSourceSelectedPostList.data.forEach(selectedPost => {
            selectedPost.postTypeValue = null;
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

    objectionRemarks() {
        if (this.objStatus) {
            this.objStatus = true;
            this.postTransferForm.controls.objRemark.setValidators(Validators.required);
            this.postTransferForm.controls.objRemark.updateValueAndValidity();
        } else {
            this.objStatus = false;
            this.postTransferForm.controls.objRemark.clearValidators();
            this.postTransferForm.controls.objRemark.updateValueAndValidity();
        }
    }

    isDraftOrSaveDisabled() {
        return this.dataSourceSelectedPostList && this.dataSourceSelectedPostList.data.length > 0 ? false : true;
    }

    savePostTransfer2(status = EdpDataConst.STATUS_DRAFT) {
        if (!this.isWfStatusDraft) {
            if (this.postTransferForm.valid) {
                const request = this.getPostTransferRequest(status);
                this.callPostTransfer(request);
            }
        } else {
            const formResult = this.postTransferForm.value;

            if (formResult.postTransFrom && formResult.postTransTo) {
                if (
                    formResult.employeeNoFrom ||
                    formResult.employeeNameFrom ||
                    formResult.employeeNoTo ||
                    formResult.employeeNameTo
                ) {
                    if (this.isEmpNoDuplicate(formResult.employeeNoFrom, formResult.employeeNameTo)) {
                        // When both employee number to and from post are same
                        this.toastr.error(this.errorMessages.POST_TRANSFER.CREATE.ERR_FROM_TO_SAME);
                        return;
                    } else if (!this.postTransferForm.controls.employeeNameTo) {
                        // Emp To is not searched
                        this.toastr.error(this.errorMessages.POST_TRANSFER.CREATE.ERR_TO_EMP_INVALID);
                    } else {
                        const postTransfer = this.validatePostTransfer();
                        if (!postTransfer.valid) {
                            this.toastr.error(postTransfer.errorMessage);
                        } else {
                            if (this.hasWorkFlow) {
                                const request = this.getPostTransferRequest(status);
                                this.callPostTransfer(request);
                            } else {
                                this.getValueForCheckWorkFlowPopup().subscribe((r: boolean) => {
                                    const request = this.getPostTransferRequest(status);
                                    this.callPostTransfer(request);
                                });
                            }
                        }
                    }
                }
            } else {
                this.showFormError();
            }
        }
    }

    getValueForCheckWorkFlowPopup() {
        const data = this.postTransferForm.controls.postTransFrom.value;
        let param = null;
        if (data === EdpDataConst.POST_TRNSF_VACANT) {
            param = {
                officeId: this.officeId,
                userId: null
            };
        } else {
            param = {
                officeId: this.officeId,
                userId: this.fromUserId
            };
        }
        return this.postTransferService.getValueForCheckWorkFlowPopup(param).pipe(
            map(
                (res: any) => {
                    if (res && res.status === 200) {
                        this.isCheckWorkFlow = res.result;
                    }
                    return this.isCheckWorkFlow;
                },
                err => {
                    this.toastr.error(err);
                }
            )
        );
    }
    submitRequest() {
        if (this.postTransferForm.valid) {
            if (
                this.dataSourceSelectedPostList &&
                this.dataSourceSelectedPostList.data &&
                this.dataSourceSelectedPostList.data.length > 0
            ) {
                if (this.hasWorkFlow) {
                    if (this.isWfStatusDraft) {
                        const postTransfer = this.validatePostTransfer();
                        if (postTransfer.valid) {
                            const request: any = this.getPostTransferRequest();
                            if (!request.fromUserId) {
                                this.savePostTransfer2(EdpDataConst.STATUS_SUBMITTED);
                            } else {
                                this.saveDraftWithoutPopup();
                                this.openWorkFlow();
                            }
                        } else {
                            this.toastr.error(postTransfer.errorMessage);
                        }
                    } else {
                        this.openWorkFlow();
                    }
                } else {
                    this.getValueForCheckWorkFlowPopup().subscribe(r => {
                        const postTransfer = this.validatePostTransfer();
                        if (!postTransfer.valid) {
                            this.toastr.error(postTransfer.errorMessage);
                        } else {
                            if (this.officeDivision && this.officeDivision.toLowerCase() === 'dat') {
                                // Dat
                                if (this.isCheckWorkFlow) {
                                    this.saveDraftWithoutPopup();
                                    this.openWorkFlow();
                                } else {
                                    this.savePostTransfer2(EdpDataConst.STATUS_SUBMITTED);
                                }
                            } else {
                                // Non Dat
                                if (this.hasMandatoryAttachmentUploaded()) {
                                    if (this.isCheckWorkFlow) {
                                        this.saveDraftWithoutPopup();
                                        this.openWorkFlow();
                                    } else {
                                        this.savePostTransfer2(EdpDataConst.STATUS_SUBMITTED);
                                    }
                                } else {
                                    this.saveDraftWithoutPopup();
                                    this.toastr.error(this.errorMessages.POST_TRANSFER.CREATE.ERR_UPLOAD_ALL_ATTACH);
                                    return;
                                }
                            }
                        }
                    });
                }
            } else {
                this.toastr.error(this.errorMessages.POST_TRANSFER.CREATE.ERR_SEL_POST_TO_BE);
            }
        } else {
            this.showFormError();
        }
    }

    saveDraftWithoutPopup() {
        const request = this.getPostTransferRequest();
        this.callPostTransfer(request, false);
    }

    viewComments(): void {
        this.postTransferService.getHeaderDetails({ edpUsrTrnHeaderId: this.edpUsrPoTrnsHeaderId }).subscribe(
            (res: any) => {
                if (res && res.result && res.status === 200) {
                    const headerJson: HeaderJson[] = res.result;
                    this.dialog.open(ViewCommonWorkflowHistoryComponent, {
                        width: '2700px',
                        height: '600px',
                        data: {
                            menuModuleName: ModuleNames.EDP,
                            headingName: EdpDataConst.POST_TRANSFER,
                            headerJson: headerJson,
                            trnId: this.edpUsrPoTrnsHeaderId,
                            refNo: this.transactionNo, // dynamic
                            refDate: this.transactionDate // dynamic
                        }
                    });
                } else {
                    this.toastr.error(res.message);
                }
            },
            err => {
                this.toastr.error(err);
            }
        );
    }

    openWorkFlow() {
        this.postTransferService
            .getHeaderDetails({ edpUsrTrnHeaderId: this.edpUsrPoTrnsHeaderId })
            .subscribe((res: any) => {
                if (res && res.result && res.status === 200) {
                    // Dynamic
                    const headerJson: HeaderJson[] = res.result;

                    const moduleInfo = {
                        moduleName: ModuleNames.EDP,
                        districtId: this.districtId
                    };
                    const workflowData: WorkflowPopupData = {
                        menuModuleName: ModuleNames.EDP,
                        headingName: EdpDataConst.POST_TRANSFER,
                        headerJson: headerJson,
                        trnId: this.edpUsrPoTrnsHeaderId, // dynamic
                        conditionUrl: 'edp/condition/2001', // edp url
                        moduleInfo: moduleInfo,
                        refNo: this.transactionNo, // dynamic
                        refDate: this.transactionDate, // dynamic
                        branchId: null,
                        ministerId: null,
                        isAttachmentTab: false, // for Attachment tab visible it should be true
                        fdGroupUrl: null // Need to check that its required or not. came after pull from trunk
                    };
                    const dialogRef = this.dialog.open(CommonWorkflowComponent, {
                        width: '2700px',
                        height: '600px',
                        data: workflowData
                    });

                    dialogRef.afterClosed().subscribe(wfData => {
                        if (wfData.commonModelStatus) {
                            let request = null;
                            const popUpRes = wfData.data.result[0];
                            if (popUpRes.trnStatus && popUpRes.trnStatus.toLowerCase() === 'approved') {
                                request = this.getPostTransferRequest(EdpDataConst.STATUS_SUBMITTED);
                                request.wfSubmit = true;
                                this.callPostTransfer(request, false);
                            } else if (this.objStatus !== null) {
                                request = this.getPostTransferRequest(EdpDataConst.STATUS_DRAFT);
                                this.callPostTransfer(request, false, true);
                            } else {
                                this.gotoListing();
                            }
                        }
                    });
                }
            });
    }

    postTransferFormChange() {
        const district = this.postTransferForm.controls.district.value;
        const ddoNo = this.postTransferForm.controls.ddoNo.value;
        const cardexNo = this.postTransferForm.controls.cardexNo.value;

        if (district && ddoNo && cardexNo) {
            const data = this.postTransferForm.controls.postTransFrom.value;
            this.empNoCtrl.setValue('', { emitViewToModelChange: false });
            this.fromEmployeeInfo = null;
            if (data === EdpDataConst.POST_TRNSF_EMP) {
                // User Id
                this.isPostTransferFromEmpl = true;
                this.isVacantPostTable = false;
                this.isPostTransferFromEmplName = true;
                this.postTransferToList = _.cloneDeep(this.postTransferList);
                this.dataSourceSelectedPostList = new MatTableDataSource([]);
                this.dataSourceVacantPost = new MatTableDataSource([]);
            } else if (data === EdpDataConst.POST_TRNSF_VACANT) {
                // Post - vacant
                this.isPostTransferFromEmpl = false;
                this.isPostTransferFromTable = false;
                this.isPostTransferFromEmplName = false;
                this.postTransferForm.controls.employeeNoFrom.setValue('');
                this.postTransferForm.controls.employeeNameFrom.setValue('');
                const param = {
                    officeId: this.officeId,
                    edpUsrTrnHeaderId: this.postTransferId
                };
                this.dataSourceFromPostList = new MatTableDataSource([]);
                if (param.officeId) {
                    this.postTransferService.getVacantPostList(param).subscribe(
                        res => {
                            if (res && res['result'] && res['status'] === 200) {
                                this.isVacantPostTable = true;
                                const vacantPostData = res['result'];
                                this.dataSourceVacantPost = new MatTableDataSource(vacantPostData);
                                this.dataSourceSelectedPostList = new MatTableDataSource([]);
                                this.selectedFromPostData.forEach(selectedObj => {
                                    // if (this.transactionNo === selectedObj.trnNo) {
                                    this.dataSourceVacantPost.data.forEach(tableObj => {
                                        if (tableObj.postId === selectedObj.postId) {
                                            this.selectionVacantPostListTable.select(tableObj);
                                            this.loadPostToBeTransfer('vacant');
                                        }
                                    });
                                    // }
                                });
                            } else {
                                this.dataSourceVacantPost = new MatTableDataSource([]);
                                this.selectedFromPostData = [];
                                this.selectionVacantPostListTable.clear();
                                this.dataSourceSelectedPostList = new MatTableDataSource([]);
                                this.toastr.error(res['message']);
                            }
                        },
                        err => {
                            this.toastr.error(this.errorMessages['POST_TRANSFER']['CREATE']['ERR_VACANT_POST_LIST']);
                            this.dataSourceVacantPost = new MatTableDataSource([]);
                            this.selectedFromPostData = [];
                            this.selectionVacantPostListTable.clear();
                            this.dataSourceSelectedPostList = new MatTableDataSource([]);
                        }
                    );
                }
                this.postTransferToList = this.postTransferList.filter(listObj => {
                    return listObj.lookUpInfoValue !== EdpDataConst.POST_TRNSF_VACANT;
                });
            } else {
                this.dataSourceSelectedPostList = new MatTableDataSource([]);
                this.dataSourceVacantPost = new MatTableDataSource([]);
                this.dataSourceFromPostList = new MatTableDataSource([]);

                this.isPostTransferFromEmpl = false;
                this.isPostTransferFromTable = false;
                this.isPostTransferFromEmplName = false;
                this.isVacantPostTable = false;

                this.postTransferForm.controls.employeeNoFrom.setValue('');
                this.postTransferForm.controls.employeeNameFrom.setValue('');

                this.selectedFromPostData = [];
                this.selectionVacantPostListTable.clear();
                this.selectedToPostData = [];
                this.selectionFromPostListTable.clear();
            }
        } else {
            this.showFormError();
        }
    }
    employeeNoKeyUp(value) {
        this.resetFromToPostTransfer();
        if (!isNaN(value) && value.length === 10) {
            this.empNoCtrlModelChanged.next(value);
        }
    }
    employeeNoFromKeyUp(number?, isFromMainSearch = false) {
        let emplNo = '';
        if (number) {
            emplNo = number;
        } else {
            emplNo = this.postTransferForm.controls.employeeNoFrom.value;
            this.empNoCtrl.setValue('', { emitViewToModelChange: false });
        }
        if (emplNo.toString().length === 10 && !number && !this.officeId) {
            this.toastr.error(this.errorMessages['POST_TRANSFER']['CREATE']['ERR_SELECT_OFFICE']);
        } else if (emplNo.toString().length === 10) {
            if (emplNo === this.postTransferForm.controls.employeeNoTo.value) {
                this.toastr.error(this.errorMessages['POST_TRANSFER']['CREATE']['ERR_FROM_TO_SAME']);
                return;
            }
            let param = {};
            if (isFromMainSearch && this.officeDivision && this.officeDivision.toLowerCase() === 'dat') {
                param = {
                    from: true,
                    userCode: Number(emplNo)
                };
            } else {
                param = {
                    from: true,
                    userCode: Number(emplNo),
                    officeId: this.officeId
                };
            }
            this.postTransferService.getEmployeeDetails(param).subscribe(
                res => {
                    if (res && res['result'] && res['status'] === 200) {
                        this.fromEmployeeInfo = res['result'];
                        if (number) {
                            this.isPostTransferFromEmpl = true;
                            this.postTransferForm.controls.postTransFrom.setValue(EdpDataConst.POST_TRNSF_EMP);
                            this.postTransferForm.controls.employeeNoFrom.setValue(number);
                        }
                        this.postTransferForm.controls.employeeNameFrom.setValue(res['result']['name']);
                        this.employeeFromNumber = res['result']['userCode'];
                        this.fromUserId = res['result']['userId'];
                        if (res['result']['postMapDto'] && res['result']['postMapDto'].length > 0) {
                            this.isPostTransferFromEmplName = true;
                            this.isPostTransferFromTable = true;
                            const postListData = res['result']['postMapDto'];
                            this.postData = res['result']['postMapDto'];
                            if (number) {
                                const primaryPostListData = postListData.find(post => post.isPrimaryPost === true);
                                const officeList = this.districtNameList.filter(data => {
                                    return data.id === primaryPostListData.districtId;
                                })[0];
                                if (officeList) {
                                    this.officeListData = _.cloneDeep(officeList['officeList']);
                                }

                                this.officeId = primaryPostListData.officeId;

                                const officeData = this.officeListData.find(el => el.id === this.officeId);
                                if (this.isDATUser) {
                                    if (officeData) {
                                        this.postTransferForm.patchValue({
                                            district: primaryPostListData.districtId,
                                            ddoNo: officeData.ddoNo,
                                            cardexNo: officeData.cardexNo,
                                            officeName: officeData.name
                                        });
                                        this.isOfficeDetailSearch = true;
                                        this.officeDistrictId = primaryPostListData.districtId;
                                    }
                                }
                            }
                            this.dataSourceFromPostList = new MatTableDataSource(postListData);
                            this.selectedFromPostData.forEach(selectedObj => {
                                if (this.transactionNo === selectedObj.trnNo) {
                                    this.dataSourceFromPostList.data.forEach(tableObj => {
                                        if (tableObj.postId === selectedObj.postId) {
                                            this.selectionFromPostListTable.select(_.cloneDeep(tableObj));
                                            this.loadPostToBeTransfer('mapped');
                                        }
                                    });
                                }
                            });
                            this.dataSourceSelectedPostList = new MatTableDataSource([]);
                            this.selectionFromPostListTable.clear();
                        } else {
                            if (res['result']['name']) {
                                this.toastr.error(this.errorMessages['POST_TRANSFER']['CREATE']['ERR_POST_MAP_OFFICE']);
                            } else {
                                this.toastr.error(this.errorMessages['POST_TRANSFER']['CREATE']['ERR_EMP_NO_EXIST']);
                            }
                            this.dataSourceFromPostList = new MatTableDataSource([]);
                            this.selectedFromPostData = [];
                            this.selectionFromPostListTable.clear();
                            this.dataSourceSelectedPostList = new MatTableDataSource([]);
                        }
                    } else if (res && res['status'] === 10001) {
                        this.loadAlreadyExistsPopup(res);
                    } else {
                        this.toastr.error(res['message']);
                        if (this.isPostTransferFromEmpl === true) {
                            this.isPostTransferFromEmplName = false;
                            this.isPostTransferFromTable = false;
                        } else {
                            this.isPostTransferFromEmpl = false;
                            this.dataSourceFromPostList = new MatTableDataSource([]);
                            this.selectedFromPostData = [];
                            this.selectionFromPostListTable.clear();
                            this.dataSourceSelectedPostList = new MatTableDataSource([]);
                            if (this.isDATUser) {
                                this.postTransferForm.reset();
                            }
                        }
                    }
                },
                err => {
                    this.toastr.error(this.errorMessages['POST_TRANSFER']['CREATE']['ERR_FROM_EMP_DATA']);
                    this.dataSourceFromPostList = new MatTableDataSource([]);
                    this.selectedFromPostData = [];
                    this.selectionFromPostListTable.clear();
                    this.dataSourceSelectedPostList = new MatTableDataSource([]);
                }
            );
        } else {
            this.dataSourceFromPostList = new MatTableDataSource([]);
            this.selectedFromPostData = [];
            this.selectionFromPostListTable.clear();
            this.dataSourceSelectedPostList = new MatTableDataSource([]);
            this.isPostTransferFromEmplName = false;
            this.isPostTransferFromTable = false;
            this.fromEmployeeInfo = null;
        }
    }

    postTransferToChange() {
        this.toEmployeeInfo = null;
        const data = this.postTransferForm.controls.postTransTo.value;
        if (data === EdpDataConst.POST_TRNSF_EMP) {
            // User Id
            this.isPostTransferToEmpl = true;
            this.isPostTransferToEmplName = true;
            this.isPostToBeTransferVisible = true;
        } else if (data === EdpDataConst.POST_TRNSF_VACANT) {
            // Post - vacant
            this.isPostTransferToEmpl = false;
            this.isPostToBeTransferVisible = false;

            this.employeeToNumber = null;
            this.postTransferForm.controls.employeeNoTo.setValue('');
            this.postTransferForm.controls.employeeNameTo.setValue('');
            this.isPostTransferToEmplName = false;
            this.isPostTransferToTable = false;
        } else {
            this.isPostTransferToEmpl = false;
            this.isPostToBeTransferVisible = false;
            this.isPostTransferToEmplName = false;
            this.isPostTransferToTable = false;
            this.employeeToNumber = null;

            this.postTransferForm.controls.employeeNoTo.setValue('');
            this.postTransferForm.controls.employeeNameTo.setValue('');
        }
    }
    employeeNoToKeyUp(number?) {
        let emplNo = '';
        if (number) {
            emplNo = number;
        } else {
            emplNo = this.postTransferForm.controls.employeeNoTo.value;
        }
        if (emplNo.toString().length === 10) {
            if (emplNo === this.postTransferForm.controls.employeeNoFrom.value) {
                this.toastr.error(this.errorMessages['POST_TRANSFER']['CREATE']['ERR_FROM_TO_SAME']);
                return;
            }
            const param = {
                from: false,
                userCode: Number(emplNo)
            };
            this.postTransferService.getEmployeeDetails(param).subscribe(
                res => {
                    if (res && res['result'] && res['status'] === 200) {
                        this.toEmployeeInfo = res['result'];
                        this.postTransferForm.controls.employeeNameTo.setValue(res['result']['name']);
                        this.employeeToNumber = res['result']['userCode'];
                        this.toUserId = res['result']['userId'];
                        if (res['result']['postMapDto'] && res['result']['postMapDto'].length > 0) {
                            this.isPostTransferToEmplName = true;
                            this.isPostTransferToTable = true;
                            this.isPostToBeTransferVisible = true;
                            const postListData = res['result']['postMapDto'];
                            this.dataSourceToPostList = new MatTableDataSource(postListData);
                        } else {
                            if (res['result']['name']) {
                                this.isPostTransferToEmplName = true;
                                this.isPostToBeTransferVisible = true;
                            } else {
                                this.toastr.error(this.errorMessages['POST_TRANSFER']['CREATE']['ERR_EMP_NO_EXIST']);
                                this.isPostTransferToEmplName = false;
                                this.isPostToBeTransferVisible = false;
                            }
                            this.dataSourceToPostList = new MatTableDataSource([]);
                            this.isPostTransferToTable = false;
                        }
                    } else if (res && res['status'] === 10001) {
                        this.loadAlreadyExistsPopup(res);
                    } else {
                        this.toastr.error(res['message']);
                    }
                },
                err => {
                    this.toastr.error(this.errorMessages['POST_TRANSFER']['CREATE']['ERR_TO_EMP_DATA']);
                    this.dataSourceToPostList = new MatTableDataSource([]);
                    this.isPostTransferToEmplName = false;
                    this.isPostTransferToTable = false;
                    this.isPostToBeTransferVisible = false;
                }
            );
        } else {
            this.toEmployeeInfo = null;
            this.postTransferForm.controls.employeeNameTo.setValue('');
            this.dataSourceToPostList = new MatTableDataSource([]);
            this.isPostTransferToEmplName = true;
            this.isPostTransferToTable = false;
        }
    }

    gotoListing() {
        this.router.navigate(['/dashboard/edp/post-transfer/list'], { skipLocationChange: true });
    }

    getAttachmentMasterData() {
        const param = {};
        this.postTransferService.getAttachmentMasterData(param).subscribe(
            res => {
                if (res && res['result'] && res['status'] === 200) {
                    const mandatoryAttach = [],
                        nonMandatoryAttach = [];
                    res['result'].forEach(fileObj => {
                        const attach = fileObj;
                        attach['fileName'] = '';
                        attach['uploadedFileName'] = '';
                        attach['uploadedBy'] = '';
                        attach['edpUsrPoTranAttId'] = null;
                        attach['size'] = 0;
                        attach['pathUploadFile'] = '';
                        attach['rolePermId'] = null;
                        attach['file'] = null;
                        if (attach['mandatoryFlag']) {
                            mandatoryAttach.push(attach);
                        } else {
                            nonMandatoryAttach.push(attach);
                        }
                        this.noOfAttachment++;
                    });
                    this.browseData = mandatoryAttach;
                    this.browseData = this.browseData.concat(nonMandatoryAttach);
                    this.dataSourceBrowse.data = _.cloneDeep(this.browseData);
                    // Fix for duplicate entries in create mode
                    this.loadAttachmentList(this.postTransferId);
                } else {
                    this.toastr.error(res['message']);
                }
            },
            err => {
                this.toastr.error(this.errorMessages['ATTACHMENT']['ERR_GET_LIST']);
            }
        );
    }

    onFileSelection(fileSelected) {
        const fileType = EdpDataConst.EDP_ATTACHMENT_FILE_TYPE;
        if (fileSelected.target && fileSelected.target.files) {
            let fileAllowed: Boolean = false;
            for (let index = 0; index < fileType.length; index++) {
                // tslint:disable-next-line: max-line-length
                if (
                    fileType[index].toLowerCase() ===
                    fileSelected.target.files[0].name
                        .split('.')
                        .pop()
                        .toLowerCase()
                ) {
                    fileAllowed = true;
                    const fileSizeInKb = fileSelected.target.files[0].size / Math.pow(1024, 1);
                    const currentSelectedIndexFileSize = this.dataSourceBrowse.data[this.fileBrowseIndex]
                        ? this.dataSourceBrowse.data[this.fileBrowseIndex].size
                        : 0;
                    this.totalAttachmentSize -= currentSelectedIndexFileSize;
                    this.totalAttachmentSize += Number(fileSizeInKb);
                    if (this.totalAttachmentSize <= EdpDataConst.MAX_FILE_SIZE_FOR_COMMON) {
                        const uplFlName = fileSelected.target.files[0].name;
                        this.dataSourceBrowse.data[this.fileBrowseIndex].uploadedFileName = uplFlName;
                        this.dataSourceBrowse.data[this.fileBrowseIndex].pathUploadFile = fileSelected.target.value;
                        this.dataSourceBrowse.data[this.fileBrowseIndex].size = fileSizeInKb;
                        this.dataSourceBrowse.data[this.fileBrowseIndex].uploadedByName = this.userName;
                        this.dataSourceBrowse.data[this.fileBrowseIndex].file = fileSelected.target.files[0];
                        this.postTransferAttachment.nativeElement.value = '';
                        break;
                    } else {
                        this.totalAttachmentSize = this.totalAttachmentSize - fileSizeInKb;
                        this.toastr.error(this.errorMessages['ATTACHMENT']['LARGE_FILE']);
                        this.postTransferAttachment.nativeElement.value = '';
                        break;
                    }
                }
            }
            if (!fileAllowed) {
                this.toastr.error(this.errorMessages['ATTACHMENT']['INVALID_TYPE']);
            }
        }
    }
    openFileSelector(index) {
        this.el.nativeElement.querySelector('#fileBrowse').click();
        this.fileBrowseIndex = index;
    }
    addBrowse() {
        if (this.dataSourceBrowse) {
            const data = this.dataSourceBrowse.data[this.dataSourceBrowse.data.length - 1];
            if (data && data.fileName && data.uploadedFileName) {
                const attachData = this.dataSourceBrowse.data;
                attachData.push({
                    attachmentId: Number(data.attachmentId),
                    attachmentName: data.attachmentName,
                    attachmentCode: data.attachmentCode,
                    attachmentDesc: data.attachmentDesc,
                    attahcmentType: Number(data.attahcmentType),
                    fileName: '',
                    uploadedFileName: '',
                    uploadedBy: '',
                    uploadedByName: '',
                    size: 0,
                    pathUploadFile: '',
                    file: null,
                    rolePermId: 0,
                    officeId: null,
                    edpUsrPoTranAttId: null,
                    edpUsrPoTrnsHeadrId: null
                });
                this.dataSourceBrowse.data = attachData;
            } else {
                this.toastr.error(this.errorMessages['ATTACHMENT']['ERR_FILL_ALL_DATA']);
            }
        }
    }
    deleteBrowse(index) {
        const data = _.cloneDeep(this.dataSourceBrowse.data);
        const deletedFile: any = data.splice(index, 1)[0];
        if (!this.removeFile(deletedFile, index)) {
            this.dataSourceBrowse.data.splice(index, 1);
            const tableData = this.dataSourceBrowse.data;
            tableData.push(deletedFile);
            this.dataSourceBrowse = new MatTableDataSource(tableData);
        } else {
            this.dataSourceBrowse.data.splice(index, 1);
            this.dataSourceBrowse = new MatTableDataSource(this.dataSourceBrowse.data);
        }
    }
    removeFile(fileData, removeIndex): boolean {
        this.dataSourceBrowse.data.forEach((file, index) => {
            if (file.edpUsrPoTranAttId) {
                if (
                    file.size === fileData.size &&
                    file.uploadedFileName === fileData.uploadedFileName &&
                    file.edpUsrPoTranAttId === fileData.edpUsrPoTranAttId
                ) {
                    this.postTransferService
                        .deleteAttachment({
                            id: fileData.edpUsrPoTranAttId
                        })
                        .subscribe(
                            res => {
                                if (res && res['result'] && res['status'] === 200) {
                                    this.totalAttachmentSize = this.totalAttachmentSize - Number(fileData.size);
                                    file.uploadedByName = '';
                                    file.size = 0;
                                    file.uploadedFileName = '';
                                    file.pathUploadFile = '';
                                    file.file = null;
                                    file.edpUsrPoTranAttId = null;
                                    return true;
                                } else {
                                    return false;
                                }
                            },
                            err => {
                                this.toastr.error(this.errorMessages['ATTACHMENT']['ERR_REMOVE_ATTACHMENT']);
                                return false;
                            }
                        );
                }
            } else if (
                file.size === fileData.size &&
                file.uploadedFileName === fileData.uploadedFileName &&
                file.attachmentId === fileData.attachmentId &&
                index === removeIndex
            ) {
                this.totalAttachmentSize = this.totalAttachmentSize - Number(fileData.size);
                file.uploadedByName = '';
                file.size = 0;
                file.uploadedFileName = '';
                file.pathUploadFile = '';
                file.file = null;
                file.edpUsrPoTranAttId = null;
                return true;
            }
        });
        return true;
    }
    loadAttachmentList(edpUsrPoTrnsHeadrId) {
        const param = {
            id: edpUsrPoTrnsHeadrId
        };
        this.postTransferService.loadAttachmentDataList(param).subscribe(
            res => {
                if (res && res['result'] && res['status'] === 200) {
                    const resultObject = _.cloneDeep(res['result']);
                    this.noOfAttachment = this.browseData.length;
                    let updateOfficeAttachment = [];
                    if (resultObject.length) {
                        const postTransferAttachment: any = [];
                        if (resultObject.length > 0) {
                            this.browseData.forEach((attachData, attachindex) => {
                                const data = resultObject.filter(obj => {
                                    return attachData.attachmentId === obj.attachmentId;
                                });
                                if (data && data.length > 0) {
                                    data.forEach((attachmentData, dataIndex) => {
                                        const attachDataClone = _.cloneDeep(attachData);
                                        attachDataClone['fileName'] = attachmentData.fileName;
                                        attachDataClone['edpUsrPoTranAttId'] = attachmentData.edpUsrPoTranAttId;
                                        attachDataClone['edpUsrPoTrnsHeadrId'] = attachmentData.edpUsrPoTrnsHeadrId;
                                        attachDataClone['uploadedFileName'] = attachmentData.uploadedFileName;
                                        attachDataClone['file'] = attachmentData.file;
                                        attachDataClone['pathUploadFile'] = attachmentData.pathUploadFile;
                                        attachDataClone['rolePermId'] = attachmentData.rolePermId;
                                        attachDataClone['uploadedByName'] = attachmentData.uploadedByName;
                                        attachDataClone['size'] = attachmentData.uploadedFileSize;
                                        attachDataClone['common'] = false;
                                        this.totalAttachmentSize += Number(attachmentData.uploadedFileSize);
                                        if (dataIndex === 0) {
                                            this.browseData.splice(attachindex, 1, attachDataClone);
                                        } else {
                                            postTransferAttachment.push(attachDataClone);
                                        }
                                    });
                                }
                            });
                            updateOfficeAttachment = this.browseData.concat(postTransferAttachment);
                        }
                        this.dataSourceBrowse.data = _.cloneDeep(updateOfficeAttachment);
                    }
                    if (
                        this.dataSourceBrowse &&
                        this.dataSourceBrowse.data &&
                        this.dataSourceBrowse.data.length === 0
                    ) {
                        this.getAttachmentMasterData();
                    }
                }
            },
            err => {
                this.toastr.error(this.errorMessages['ATTACHMENT']['ERR_GET_LIST']);
            }
        );
    }
    uploadFiles() {
        let allowUpload = false;
        const uploadAttachmentList = new FormData();
        let index = 0;
        this.dataSourceBrowse.data.forEach(obj => {
            if (
                obj.pathUploadFile &&
                obj.size > 0 &&
                obj.uploadedFileName &&
                obj.uploadedByName &&
                obj.edpUsrPoTranAttId === null
            ) {
                if (obj.fileName.trim()) {
                    uploadAttachmentList.append('attch[' + index + '].fileName', obj.fileName.trim());
                    uploadAttachmentList.append('attch[' + index + '].file', obj.file);
                    uploadAttachmentList.append('attch[' + index + '].attachmentId', obj.attachmentId.toString());
                    uploadAttachmentList.append('attch[' + index + '].uploadedFileName', obj.uploadedFileName);
                    uploadAttachmentList.append('attch[' + index + '].pathUploadFile', obj.pathUploadFile);
                    uploadAttachmentList.append(
                        'attch[' + index + '].rolePermId',
                        EdpDataConst.ROLE_PERM_ID.toString()
                    );
                    uploadAttachmentList.append('attch[' + index + '].officeId', this.officeId.toString());
                    uploadAttachmentList.append(
                        'attch[' + index + '].edpUsrPoTrnsHeadrId',
                        this.postTransferId.toString()
                    );
                    allowUpload = true;
                    index++;
                }
            }
        });
        if (allowUpload && uploadAttachmentList) {
            this.postTransferService.uploadAttachment(uploadAttachmentList).subscribe(
                res => {
                    if (res && res['result'] && res['status'] === 200) {
                        this.toastr.success(this.errorMessages['ATTACHMENT']['UPLOAD_SUCCESS']);
                        this.totalAttachmentSize = 0;
                        this.loadAttachmentList(this.postTransferId);
                    } else {
                        this.toastr.error(res['message']);
                    }
                },
                err => {
                    this.toastr.error(this.errorMessages['ATTACHMENT']['ERR_UPLOAD_ATTACHMENT']);
                }
            );
        } else {
            this.toastr.error(this.errorMessages['ATTACHMENT']['ERR_FILENAME']);
        }
    }
    viewAttachment(attachment) {
        const ID = {
            id: attachment.edpUsrPoTranAttId
        };
        this.httpClient
            .post(`${environment.baseUrl}${APIConst.POST_TRANSFER.ATTACHMENT.DOWNLOAD}`, ID, {
                responseType: 'blob' as 'json'
            })
            .subscribe(
                res => {
                    const url = window.URL.createObjectURL(res);
                    window.open(url, '_blank');
                },
                err => {
                    this.toastr.error(err);
                }
            );
    }
    downloadAttachment(attachment) {
        const ID = {
            id: attachment.edpUsrPoTranAttId
        };
        this.httpClient
            .post(`${environment.baseUrl}${APIConst.POST_TRANSFER.ATTACHMENT.DOWNLOAD}`, ID, {
                responseType: 'blob' as 'json'
            })
            .subscribe(
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

    hasMandatoryAttachmentUploaded(): boolean {
        const hasAllMandatoryAttachment = this.dataSourceBrowse.data
            .filter(attachement => attachement.mandatoryFlag)
            .every(x => x.edpUsrPoTranAttId > 0);
        return hasAllMandatoryAttachment;
    }

    loadAlreadyExistsPopup(res) {
        const dialogRef = this.dialog.open(AlreadyExistsDialogComponent, {
            disableClose: true,
            height: '270px',
            width: '600px',
            data: {
                message: res['message']
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                this.router.navigate(['/dashboard/edp/post-transfer/list'], { skipLocationChange: true });
            }
        });
    }

    resetAttachment() {
        const proceedMessage = this.errorMessages['CONFIRMATION_DIALOG']['CONFIRMATION'];
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '360px',
            data: proceedMessage
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                this.browseData = [];
                this.totalAttachmentSize = 0;
                this.getAttachmentMasterData();
            }
        });
    }

    setOfficeData(response) {
        this.officeListData.forEach(el => {
            if (response.officeId === el.id) {
                this.postTransferForm.patchValue({
                    ddoNo: el.ddoNo,
                    cardexNo: el.cardexNo,
                    officeName: el.name
                });
            }
        });
    }

    showFormError() {
        _.each(this.postTransferForm.controls, function(control) {
            if (control.status === 'INVALID') {
                control.markAsTouched({ onlySelf: true });
            }
        });
    }

    /******************************Private Methods*****************************/

    private isEmpNoDuplicate(empTo: number, empFrom: number): boolean {
        if (empTo && empFrom) {
            return empTo === empFrom;
        }
        return false;
    }

    private validatePostTransfer(): { valid: boolean; errorMessage: string } {
        const postTransfer = {
            valid: false,
            errorMessage: null
        };

        if (!this.isPrimaryPostTransferValid()) {
            postTransfer.valid = false;
            postTransfer.errorMessage = this.errorMessages.POST_TRANSFER.CREATE.ERR_CHANGE_PRIMARY_POST;
        } else {
            if (this.isPostTypeEmpty()) {
                postTransfer.valid = false;
                postTransfer.errorMessage = this.errorMessages.POST_TRANSFER.CREATE.ERR_SELECT_POST_TYPE;
            } else if (!this.isPostTypeValid()) {
                postTransfer.valid = false;
                postTransfer.errorMessage = this.errorMessages.POST_TRANSFER.CREATE.ERR_ONLY_SELECT_PRIMARY;
            } else if (
                this.toEmployeeInfo &&
                !this.toUserOrEmpContainsPrimaryPost() &&
                !this.isPostToTransferContainsPrimaryPost()
            ) {
                postTransfer.valid = false;
                postTransfer.errorMessage = this.errorMessages.POST_TRANSFER.CREATE.ERR_ONE_SELECT_PRIMARY;
            } else if (!this.isPostTransferToContainsValidEmpNum()) {
                postTransfer.valid = false;
                postTransfer.errorMessage = this.errorMessages.POST_TRANSFER.CREATE.ERR_SELECT_EMP_TO_NO;
            } else {
                postTransfer.valid = true;
                postTransfer.errorMessage = null;
            }
        }
        return postTransfer;
    }

    private isPostTransferToContainsValidEmpNum() {
        const data = this.postTransferForm.controls.postTransTo.value;
        if (data === EdpDataConst.POST_TRNSF_EMP && !this.toEmployeeInfo) {
            return false;
        }
        return true;
    }

    private isPostToTransferContainsPrimaryPost() {
        const primaryPost = this.dataSourceSelectedPostList.data.some(
            selectedPost => selectedPost.postTypeValue === EdpDataConst.POST_TYPE_PRIMARY
        );

        return primaryPost;
    }

    private isPrimaryPostTransferValid() {
        const data = this.postTransferForm.controls.postTransFrom.value;

        if (data === EdpDataConst.POST_TRNSF_EMP) {
            const fromEmployeePostsLength = this.dataSourceFromPostList.data.length;
            const fromEmployeeSelectedPostsLength = this.dataSourceSelectedPostList.data.length;

            if (fromEmployeePostsLength === fromEmployeeSelectedPostsLength) {
                return true;
            } else {
                const containsPrimaryPost = this.dataSourceSelectedPostList.data.find(
                    selectedPost => selectedPost.isPrimaryPost
                );
                if (containsPrimaryPost && this.action === 'edit') {
                    const isPrimarySelected = this.dataSourceFromPostList.data.some(
                        x => x.lkPoOffId === containsPrimaryPost.lkPoOffId && x.isPrimaryPost
                    );
                    return isPrimarySelected ? false : true;
                } else {
                    return containsPrimaryPost ? false : true;
                }
            }
        } else {
            return true;
        }
    }

    private isPostTypeEmpty() {
        const data = this.postTransferForm.controls.postTransTo.value;

        if (data === EdpDataConst.POST_TRNSF_VACANT) {
            return false;
        }
        const emptyPostType = this.dataSourceSelectedPostList.data.find(
            selectedPost => selectedPost.postTypeValue == null
        );

        return emptyPostType ? true : false;
    }

    private isPostTypeValid() {
        const primaryPosts = this.dataSourceSelectedPostList.data.filter(
            selectedPost => selectedPost.postTypeValue === EdpDataConst.POST_TYPE_PRIMARY
        );

        return primaryPosts && primaryPosts.length > 1 ? false : true;
    }

    private toUserOrEmpContainsPrimaryPost() {
        const toInfo = this.getToPostTransferInfo();
        let containsPrimaryPost = false;

        if (toInfo.isUser || toInfo.isEmployee) {
            containsPrimaryPost = this.dataSourceToPostList.data.some(post => post.isPrimaryPost);
        }
        return containsPrimaryPost;
    }

    private getPostTransferRequest(
        status = EdpDataConst.STATUS_DRAFT
    ):
        | PostTransferToEmployee
        | PostTransferToUser
        | PostTransferToVacant
        | PostTransferVacantToEmployee
        | PostTransferVacantToUser {
        const fromPostTransferInfo = this.getFromPostTransferInfo();
        const toPostTransferInfo = this.getToPostTransferInfo();

        const menuCode = this.commonService.getMenuCode();
        const menuId = this.commonService.getMenuId();
        const userData = this.storageService.get('userOffice');
        const currentUserData = this.storageService.get('currentUser');
        let postId, pouId;
        if (currentUserData['post'].length > 0) {
            // tslint:disable-next-line: no-shadowed-variable
            currentUserData['post'].forEach(element => {
                if (element['primaryPost'] === true) {
                    postId = element['lkPoOffUserId'];
                    pouId = element['postId'];
                }
            });
        }
        let statusValue = null;
        let postTransfer:
            | PostTransferToEmployee
            | PostTransferToUser
            | PostTransferToVacant
            | PostTransferVacantToEmployee
            | PostTransferVacantToUser = null;

        switch (status) {
            case EdpDataConst.STATUS_DRAFT:
                statusValue = FormActions.DRAFT;
                break;
            case EdpDataConst.STATUS_SUBMITTED:
            default:
                statusValue = FormActions.SUBMITTED;
                break;
        }

        if (fromPostTransferInfo.isEmployee) {
            if (toPostTransferInfo.isEmployee) {
                postTransfer = {
                    edpUsrPoTrnsDetailDto: [],
                    formAction: statusValue,
                    menuCode: menuCode,
                    fromUserId: this.fromEmployeeInfo.userId,
                    edpUsrPoTrnsHeaderId: undefined,
                    toEmpId: this.toEmployeeInfo.empId,
                    trnNo: undefined
                };
            } else if (toPostTransferInfo.isUser) {
                postTransfer = {
                    edpUsrPoTrnsDetailDto: [],
                    formAction: statusValue,
                    menuCode: menuCode,
                    fromUserId: this.fromEmployeeInfo.userId,
                    edpUsrPoTrnsHeaderId: undefined,
                    toUserId: this.toEmployeeInfo.userId,
                    trnNo: undefined
                };
            } else {
                postTransfer = {
                    edpUsrPoTrnsDetailDto: [],
                    formAction: statusValue,
                    menuCode: menuCode,
                    fromUserId: this.fromEmployeeInfo.userId,
                    edpUsrPoTrnsHeaderId: undefined,
                    trnNo: undefined
                };
            }
        } else {
            if (toPostTransferInfo.isEmployee) {
                postTransfer = {
                    edpUsrPoTrnsDetailDto: [],
                    formAction: statusValue,
                    menuCode: menuCode,
                    edpUsrPoTrnsHeaderId: undefined,
                    toEmpId: this.toEmployeeInfo.empId,
                    trnNo: undefined
                };
            } else {
                postTransfer = {
                    edpUsrPoTrnsDetailDto: [],
                    formAction: statusValue,
                    menuCode: menuCode,
                    edpUsrPoTrnsHeaderId: undefined,
                    toUserId: this.toEmployeeInfo.userId,
                    trnNo: undefined
                };
            }
        }
        const edpUsrPoTrnsDetailDto: EdpUsrPoTrnsDetailDto[] = [];

        this.dataSourceSelectedPostList.data.forEach(selectedPost => {
            edpUsrPoTrnsDetailDto.push({
                postOfficeId: selectedPost.lkPoOffId,
                willBePrimary: selectedPost.postTypeValue === EdpDataConst.POST_TYPE_PRIMARY ? true : false
            });
        });

        const wfRequestDto: WfRequestDto = {
            menuId: menuId,
            officeId: userData.officeId,
            postId: postId,
            pouId: pouId,
            userId: currentUserData.userId
        };
        postTransfer.curMenuId = menuId;
        postTransfer.edpUsrPoTrnsDetailDto = edpUsrPoTrnsDetailDto;
        postTransfer.edpUsrPoTrnsHeaderId = this.edpUsrPoTrnsHeaderId ? this.edpUsrPoTrnsHeaderId : undefined;
        postTransfer.trnNo = this.transactionNo ? this.transactionNo : undefined;

        if (this.isCheckWorkFlow) {
            postTransfer.wfRequestDto = wfRequestDto;
            postTransfer.wfInRequest = true;
            postTransfer.wfSubmit = false;
        } else {
            postTransfer.wfRequestDto = undefined;
            postTransfer.wfInRequest = false;
            postTransfer.wfSubmit = undefined;
        }

        if (this.isObjectionRequired) {
            if (this.objStatus) {
                postTransfer.hasObjection = this.postTransferForm.controls.objStatus.value;
                postTransfer.objectionRemarks = this.postTransferForm.controls.objRemark.value;
            }
        }
        return postTransfer;
    }

    private getFromPostTransferInfo(): {
        isEmployee: boolean;
        isVacant: boolean;
    } {
        const postTrasferFrom = this.postTransferForm.controls.postTransFrom.value;
        const fromInfo = {
            isEmployee: false,
            isVacant: false
        };

        switch (postTrasferFrom) {
            case EdpDataConst.POST_TRNSF_EMP:
                fromInfo.isEmployee = true;
                fromInfo.isVacant = false;
                break;

            case EdpDataConst.POST_TRNSF_VACANT:
            default:
                fromInfo.isEmployee = false;
                fromInfo.isVacant = true;
                break;
        }

        return fromInfo;
    }

    private getToPostTransferInfo(): {
        isUser: boolean;
        isEmployee: boolean;
        isVacant: boolean;
    } {
        const toInfo = {
            isUser: false,
            isEmployee: false,
            isVacant: false
        };

        if (this.toEmployeeInfo) {
            if (this.toEmployeeInfo.userId) {
                toInfo.isUser = true;
                toInfo.isEmployee = false;
                toInfo.isVacant = false;
            } else {
                toInfo.isUser = false;
                toInfo.isEmployee = true;
                toInfo.isVacant = false;
            }
        } else {
            toInfo.isUser = false;
            toInfo.isEmployee = false;
            toInfo.isVacant = true;
        }
        return toInfo;
    }

    private callPostTransfer(
        request:
            | PostTransferToEmployee
            | PostTransferToUser
            | PostTransferToVacant
            | PostTransferVacantToEmployee
            | PostTransferVacantToUser,
        showConfirmation: boolean = true,
        redirectToDashboard: boolean = false
    ) {
        if (showConfirmation) {
            const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                width: '360px',
                data: msgConst.CONFIRMATION_DIALOG.CONFIRMATION
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result === 'yes') {
                    this.callPostTransferDraftOrSubmit(request);
                }
            });
        } else {
            this.callPostTransferDraftOrSubmit(request, showConfirmation, redirectToDashboard);
        }
    }

    callPostTransferDraftOrSubmit(
        request:
            | PostTransferToEmployee
            | PostTransferToUser
            | PostTransferToVacant
            | PostTransferVacantToEmployee
            | PostTransferVacantToUser,
        showConfirmation: boolean = true,
        redirectToDashboard: boolean = false
    ) {
        this.postTransferService.createPostTransfer(request).subscribe(
            (res: any) => {
                if (res && res.result && res.status === 200 && res.message) {
                    this.transactionNo = res.result.trnNo;
                    this.transactionDate = res.result.trnDate;
                    this.edpUsrPoTrnsHeaderId = res.result.edpUsrPoTrnsHeaderId;

                    this.transactionNo = res.result.trnNo;
                    if (this.transactionNo) {
                        this.isSubmitDisable = false;
                    }
                    this.transactionDate = res.result.trnDate;
                    this.postTransferId = res.result.edpUsrPoTrnsHeaderId;
                    if (showConfirmation) {
                        this.toastr.success(res.message);
                    }
                    if (request.formAction === EdpDataConst.STATUS_SUBMITTED) {
                        this.gotoListing();
                    } else {
                        this.selectedIndex = 1;
                        if (redirectToDashboard) {
                            this.gotoListing();
                        }
                    }
                } else {
                    this.toastr.error(res.message);
                }
            },
            err => {
                this.toastr.error(this.errorMessages.POST_TRANSFER.CREATE.ERR_SAVE_TRANS);
            }
        );
    }

    /******************************Private Methods*****************************/

    resetForm(postTransferForms: NgForm) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '400px',
            data: msgConst.CONFIRMATION_DIALOG.CONFIRMATION
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                if (this.action === 'edit') {
                    this.resetFromToPostTransfer();
                    this.loadDataForEditMode(this.postTransferId);
                } else {
                    this.resetFromToPostTransfer();
                    this.loadDataForEditMode(this.postTransferId);
                    this.saveDraftEnable = false;
                    this.isSubmitDisable = true;
                    this.isPostTransferFromEmplName = false;
                    this.isPostTransferFromTable = false;
                    this.empNoCtrl.setValue('', { emitViewToModelChange: false });
                }
            }
        });
    }

    searchOfficeDetails() {
        // tslint:disable-next-line: no-use-before-declare
        const districtData = {
            district: this.officeDistrictId
        };
        const dialogRef = this.dialog.open(SearchDialogComponent, {
            width: '1000px',
            height: '600px',
            data: districtData
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'no') {
                return result;
            }
        });
    }
}

@Component({
    selector: 'app-charge-confirm-dialog',
    templateUrl: './charge.confirm.dialog.html',
    styleUrls: ['./post-transfer.component.css']
})
export class ChargeConfirmDialogComponent implements OnInit {
    constructor(
        public dialogRef: MatDialogRef<ChargeConfirmDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}
    ngOnInit() {}

    onCancel(): void {
        this.dialogRef.close('no');
    }

    onSave(): void {
        this.dialogRef.close('yes');
    }
}
