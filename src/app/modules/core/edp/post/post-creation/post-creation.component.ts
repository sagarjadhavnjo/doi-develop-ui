import { Component, OnInit, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { CommonService } from 'src/app/modules/services/common.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { EdpPostService } from '../../services/edp-post.service';
import { DesignationName, VacantPost, BranchName } from '../../model/post-model';
import { DistrictName, OfficeListData } from '../../model/add-designation';
import { msgConst } from 'src/app/shared/constants/edp/edp-msg.constants';
import { Subscription } from 'rxjs';
import { EdpDataConst } from 'src/app/shared/constants/edp/edp-data.constants';
import { TabelElement } from '../../model/post-model';
import { environment } from 'src/environments/environment';
import { APIConst } from 'src/app/shared/constants/edp/edp-api.constants';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { AddDesignationService } from '../../services/add-designation.service';
import { CommonWorkflowComponent } from '../../../common/common-workflow/common-workflow.component';
import { ModuleNames } from '../../../common/constant/common-workflow.constants';
import { HeaderJson, WorkflowPopupData } from '../../../common/model/common-workflow';
import { map } from 'rxjs/operators';
import { ViewCommonWorkflowHistoryComponent } from '../../../common/view-common-workflow-history/view-common-workflow-history.component';
import { SearchDialogComponent } from 'src/app/shared/components/search-dialog/search-dialog.component';

@Component({
    selector: 'app-post-creation',
    templateUrl: './post-creation.component.html',
    styleUrls: ['./post-creation.component.css']
})
export class PostCreationComponent implements OnInit {
    postForm: FormGroup;
    saveDraftEnable: boolean = false;
    isSubmitDisable: boolean = true;
    editDesgId: number;
    editPostName: string;
    action: string = 'new';
    subscribeParams: Subscription;
    fileBrowseIndex: number;
    isDesignation: boolean;
    errorMessages = msgConst;
    officeId: number;
    postId: number;
    selectedIndex: number;
    totalAttachmentSize: number;
    userName: string;
    transactionNo: string;
    transactionDate: string;
    userType: string;
    officeDivision: string;
    formAction: string;
    loadPostData: string;
    officeDistrictId: number;

    isDATUser: boolean = false;
    isUpload: boolean = false;
    edpUsrPoTrnsHeaderId: number;
    isCheckWorkFlow: boolean = false;
    objStatus: boolean = false;
    isObjectionRequired: boolean = false;
    isOfficeDetailSearch: boolean = false;
    hasWorkFlow: boolean = false;

    districtId: number;
    isWfSaveDrftApiCall;
    isWfSubmit;
    wfInRequest;

    displayedBrowseColumns = ['attachmentType', 'fileName', 'browse', 'uploadedFileName', 'uploadedBy', 'action'];
    designationList: DesignationName[] = [];
    vacantPostList: VacantPost[] = [];
    branchNameList: BranchName[] = [];
    districtNameList: DistrictName[] = [];
    officeListData: OfficeListData[] = [];
    browseData: TabelElement[] = [];
    isWf: boolean = false;

    districtCtrl: FormControl = new FormControl();
    designationCtrl: FormControl = new FormControl();
    vacantPostCtrl: FormControl = new FormControl();
    branchNameCtrl: FormControl = new FormControl();
    isInsert: boolean = true;
    dataSourceBrowse = new MatTableDataSource(this.browseData);
    district = {};
    @ViewChild('postAttachment', { static: true }) postAttachment: ElementRef;
    matInputSelectNull = EdpDataConst.MAT_SELECT_NULL_VALUE;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        public dialog: MatDialog,
        private activatedRoute: ActivatedRoute,
        private toastr: ToastrService,
        private el: ElementRef,
        private commonService: CommonService,
        private storageService: StorageService,
        private edpPostService: EdpPostService,
        private httpClient: HttpClient,
        private addDesignationService: AddDesignationService
    ) { }

    /**
     * @description Call when component is load
     */
    ngOnInit() {
        this.totalAttachmentSize = 0;
        this.errorMessages = msgConst;
        this.userName = this.storageService.get('userName');
        const userOffice = this.storageService.get('userOffice');
        this.officeDivision = userOffice['officeDivision'];
        this.districtId = userOffice['districtId'];
        this.postCreationForm();
        this.subscribeParams = this.activatedRoute.params.subscribe(resRoute => {
            this.action = resRoute.action;
            if (this.action === 'edit' || this.action === 'view') {
                this.postId = +resRoute.id;
                if (this.postId) {
                    this.getPostDetails();
                    if (this.action === 'view') {
                        this.postForm.disable();
                    }
                } else {
                    this.router.navigate(['../new'], { relativeTo: this.activatedRoute, skipLocationChange: true });
                }
            } else {
                this.getPostDetails();
                this.action = 'new';
            }
        });
        this.postForm.valueChanges.subscribe(() => {
            this.saveDraftEnable = true;
            this.isSubmitDisable = false;
        });
    }

    hasWf() {
        this.getValueForCheckWorkFlowPopup().subscribe(res => {
            this.hasWorkFlow = res;
            this.isWf = res;
        });
    }

    /**
     * @method postCreationForm
     * @description form creation and set validators
     */
    postCreationForm() {
        this.postForm = this.fb.group({
            district: [''],
            ddoNo: [''],
            cardexNo: [''],
            ddoOffice: [''],
            vacantPost: [''],
            branchName: [''],
            designationName: ['', Validators.required],
            postName: [''],
            objStatus: [''],
            objRemark: ['']
        });
        if (this.objStatus) {
            this.objectionRemarks();
        }
    }

    /**
     * @method loadDistrictDetails
    * @description load district details
    */
    loadDistrictDetails() {
        const userOffice = this.storageService.get('userOffice');
        if (this.officeDivision && this.officeDivision.toLowerCase() === 'DAT'.toLowerCase()) {
            this.addDesignationService.loadDistrictDetails('').subscribe((res) => {
                if (res && res['result'] && res['status'] === 200) {
                    const districtData = res['result'];
                    if (districtData) {
                        this.districtNameList = districtData;
                        this.isDATUser = true;
                        if (this.isObjectionRequired) {
                            this.postForm.get('district').disable();
                            this.postForm.get('ddoNo').disable();
                            this.postForm.get('cardexNo').disable();
                        }
                        if (this.officeId) {
                            if (this.loadPostData) {
                                this.postForm.patchValue({
                                    district: this.loadPostData['district'].id,
                                    ddoNo: this.loadPostData['ddoNo'],
                                    cardexNo: this.loadPostData['cardexNo'],
                                    ddoOffice: this.loadPostData['ddoOffice'],
                                    designationName: this.loadPostData['designationId'],
                                    postName: this.loadPostData['postName'],
                                    objStatus: this.loadPostData['hasObjection'],
                                    objRemark: this.loadPostData['objectionRemarks']
                                });
                                this.officeDistrictId = this.loadPostData['district'].id;
                            }
                            this.officeData();
                        }
                    } else {
                        this.toastr.error(this.errorMessages['ADD_DESIGNATION']['DISTRICT_NAME']);
                    }
                } else {
                    this.toastr.error(res['message']);
                }
            }, (err) => {
                this.toastr.error(err);
            });
        } else {
            this.postForm.patchValue({
                district: userOffice.districtName,
                ddoNo: userOffice.ddoNo,
                cardexNo: userOffice.cardexno,
                ddoOffice: userOffice.officeName
            });
            this.officeId = userOffice.officeId;
            this.district = userOffice.districtId;
            this.isDATUser = false;
        }
    }

    /**
     * @method officeData
     * @description load office Data based on id using filter
     */
    officeData() {
        const district = this.postForm.controls.district.value;
        this.districtData();
        const officeList = this.districtNameList.filter(data => data.id === district)[0];
        if (officeList) {
            this.officeListData = _.cloneDeep(officeList['officeList']);
        }
    }

    /**
     * @method changeOfficeData
     * @description after load office data based on id and selection load office data
     */
    changeOfficeData() {
        const district = this.postForm.controls.district.value;
        this.officeId = null;
        this.districtData();
        this.makeEmptyInput();
        const officeList = this.districtNameList.filter(data => {
            return data.id === district;
        })[0];
        if (officeList) {
            this.officeListData = _.cloneDeep(officeList['officeList']);
        }
    }
    districtData() {
        const district = this.postForm.controls.district.value;
        this.officeDistrictId = district;
        if (district) {
            this.isOfficeDetailSearch = true;
        } else {
            this.isOfficeDetailSearch = false;
        }
    }
    /**
     * @method makeEmptyInput
     * @description fields reset
     */
    makeEmptyInput() {
        this.postForm.controls.ddoNo.setValue('');
        this.postForm.controls.cardexNo.setValue('');
        this.postForm.controls.ddoOffice.setValue('');
        this.postForm.controls.designationName.setValue('');
        this.postForm.controls.postName.setValue('');
        this.isDesignation = false;
        this.vacantPostList = [];
        this.saveDraftEnable = false;
        this.isSubmitDisable = true;
    }

    /**
     * @method onChangeNumber
     * @description office selection and display based on ddo no and cardex no
     */
    onChangeNumber() {
        const ddoNo = this.postForm.controls.ddoNo.value;
        const cardexNo = this.postForm.controls.cardexNo.value;
        if (ddoNo && cardexNo) {
            this.postForm.controls.ddoOffice.setValue('');
            this.officeListData.forEach((officeObj) => {
                if (ddoNo === officeObj['ddoNo'] && cardexNo.toString() === officeObj['cardexNo'].toString()) {
                    this.postForm.patchValue({
                        ddoOffice: officeObj.name
                    });
                    this.officeId = officeObj['id'];
                    this.isOfficeDetailSearch = true;
                    if (this.officeId) {
                        this.availabelVacantPost();
                        const designationId = this.postForm.controls.designationName.value;
                        if (designationId) {
                            this.loadPostName();
                        }
                    }
                    return true;
                } else {
                    this.vacantPostList = [];
                }
            });
            if (!this.postForm.controls.district.value) {
                this.toastr.error(this.errorMessages['ADD_DESIGNATION']['DISTRICT']);
                this.postForm.controls.ddoOffice.setValue('');
                this.postForm.controls.designationName.setValue('');
                this.postForm.controls.postName.setValue('');
                this.isDesignation = false;
                this.vacantPostList = [];
                this.saveDraftEnable = false;
                this.isSubmitDisable = true;
            } else if (!this.postForm.controls.ddoOffice.value) {
                this.toastr.error(this.errorMessages['ADD_DESIGNATION']['OFFICE']);
                this.postForm.controls.ddoOffice.setValue('');
                this.postForm.controls.designationName.setValue('');
                this.postForm.controls.postName.setValue('');
                this.isDesignation = false;
                this.vacantPostList = [];
                this.saveDraftEnable = false;
                this.isSubmitDisable = true;
            } else {
                this.saveDraftEnable = true;
                this.isSubmitDisable = false;
            }
        } else {
            this.postForm.controls.ddoOffice.setValue('');
            this.postForm.controls.designationName.setValue('');
            this.postForm.controls.postName.setValue('');
            this.isDesignation = false;
            this.vacantPostList = [];
            this.saveDraftEnable = false;
            this.isSubmitDisable = true;
            this.getFormError();
        }
    }

    /**
     * @method availabelVacantPost
     * @description pass office ID and get response of available vacantpost
     */
    availabelVacantPost() {
        const param = {
            id: this.officeId
        };
        this.edpPostService.availabelVacantPost(param).subscribe((res) => {
            if (res && res['result'] && res['status'] === 200) {
                this.vacantPostList = res['result']['vacantPost'];
            } else {
                this.toastr.error(res['message']);
            }
        });
    }

    /**
     * @method loadPostDeatail
     * @description fetch post details based on pass post ID
     * @param postId pass postID for post details
     */
    loadPostDeatail(postId) {
        const param = {
            id: postId
        };
        this.edpPostService.loadPostDeatail(param).subscribe((res) => {
            if (res && res['result'] && res['status'] === 200) {
                this.isInsert = false;
                this.loadPostData = res['result'];
                const resResult = res['result'];
                this.transactionNo = resResult.transactionNo;
                this.transactionDate = resResult.trnDate;
                this.isObjectionRequired = resResult.isObjectionRequired;
                this.isWfSaveDrftApiCall = resResult.isWfSaveDrftApiCall;
                this.isWfSubmit = resResult.isWfSubmit;
                this.wfInRequest = resResult.wfInRequest;
                this.hasWorkFlow = resResult.wfInRequest;
                if (this.officeDivision && this.officeDivision.toLowerCase() === 'DAT'.toLowerCase()) {
                    this.loadDistrictDetails();
                    this.officeId = resResult['officeId'];
                    this.isOfficeDetailSearch = true;
                } else {
                    this.objStatus = resResult.hasObjection;
                    this.postForm.patchValue({
                        district: resResult.district.name,
                        ddoNo: resResult.ddoNo,
                        cardexNo: resResult.cardexNo,
                        ddoOffice: resResult.ddoOffice,
                        designationName: resResult.designationId,
                        postName: resResult.postName,
                        objStatus: resResult.hasObjection,
                        objRemark: resResult.objectionRemarks
                    });
                    this.officeId = resResult.officeId;
                }
                if (this.postId) {
                    this.availabelVacantPost();
                }
                this.editDesgId = resResult.designationId;
                this.editPostName = resResult.postName;
                this.isDesignation = true;
                if (this.action === 'view') {
                    this.postForm.disable();
                }
                this.loadAttachmentList(this.postId);
                if (this.isObjectionRequired) {
                    this.postForm.get('designationName').disable();
                    this.postForm.get('postName').disable();
                }
            }
        }, (err) => {
            this.toastr.error(err);
        });
    }

    /**
     * @method getPostDetails
     * @description get post details
     */
    getPostDetails() {
        this.edpPostService.getPostDetails('').subscribe((res) => {
            if (res && res['result'] && res['status'] === 200) {
                // tslint:disable-next-line: no-shadowed-variable
                if (res['result']['designations']) {
                    res['result']['designations'].forEach(element => {
                        this.designationList.push(element);
                    });
                }
                this.vacantPostList = [];
                if (this.officeDivision === null) {
                    this.officeId = res['result']['officeId'];
                    this.vacantPostList = res['result']['vacantPost'];
                } else if (this.officeDivision && this.officeDivision.toLowerCase() !== 'DAT'.toLowerCase()) {
                    this.officeId = res['result']['officeId'];
                    this.vacantPostList = res['result']['vacantPost'];
                }
                // this.branchNameList = res['result']['branches'];
                // this.district = res['result']['district'];
                if (this.action === 'edit' || this.action === 'view') {
                    this.loadPostDeatail(this.postId);
                } else {
                    this.loadDistrictDetails();
                    this.loadAttachment();
                    this.hasWf();
                }
                this.saveDraftEnable = false;
            }
        }, (err) => {
            this.toastr.error(err);
        });
    }

    /**
     * @method availableVacantPostListDialog
     * @description display dialog and load AvailableVacantPostDialogComponent
     */
    availableVacantPostListDialog() {
        // tslint:disable-next-line: no-use-before-declare
        const dialogRef = this.dialog.open(AvailableVacantPostDialogComponent, {
            width: '800px',
            height: '400px',
            data: this.vacantPostList
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'no') {
                return result;
            }
        });
    }

    /**
     * @method objectionRemarks
    * @description checkbox select or not and set value true or false
    */
    objectionRemarks() {
        if (this.objStatus) {
            this.objStatus = true;
            this.postForm.controls.objRemark.setValidators(Validators.required);
            this.postForm.controls.objRemark.updateValueAndValidity();
        } else {
            this.objStatus = false;
            if (this.postForm.controls.objRemark.value) {
                this.postForm.controls.objRemark.reset();
            }
            this.postForm.controls.objRemark.clearValidators();
            this.postForm.controls.objRemark.updateValueAndValidity();
        }
    }

    getPostCrationFormData() {
        const param = {
            designationId: this.postForm.controls.designationName.value,
            districtId: this.district,
            ddoNo: this.postForm.controls.ddoNo.value,
            cardexNo: this.postForm.controls.cardexNo.value,
            ddoOffice: this.postForm.controls.ddoOffice.value,
            postName: this.postForm.controls.postName.value,
            officeId: this.officeId,
            workFlowId: EdpDataConst.CURRENT_WORK_FLOW_ID,
            workFlowRoleId: EdpDataConst.CURRENT_WORK_FLOW_ROLE_ID,
            isObjectionRequired: this.isObjectionRequired,
            hasObjection: this.objStatus,
            objectionRemarks: this.postForm.controls.objRemark.value,
        };

        return param;
    }
    /**
     * @method savePost
    * @description function called on save as draft button and submit button check
    * code on condition basis
    * @param buttonName pass parameter on click "submit" or "draft"
    */
    savePost(buttonName) {
        const param = this.getPostCrationFormData();
        const proceedMessage = this.errorMessages['CONFIRMATION_DIALOG']['CONFIRMATION'];
        // tslint:disable-next-line: no-use-before-declare
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '360px',
            data: proceedMessage
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                if (this.action === 'edit') {
                    if (!this.officeId) {
                        this.toastr.error(this.errorMessages['ADD_DESIGNATION']['OFFICE_DETAILS']);
                    } else {

                        if (buttonName === 'submit') {
                            param['formAction'] = EdpDataConst.STATUS_SUBMITTED;
                            // this.isSubmitDisable = true;
                            if (this.postForm.valid) {
                                if (this.wfInRequest == null || this.wfInRequest === false) {
                                    this.checkWorkFlowUpdate(param, buttonName);
                                } else {
                                    // this.getValueForCheckWorkFlowPopup().subscribe(r => {
                                    if (this.officeDivision && this.officeDivision.toLowerCase() === 'dat') {
                                        if (this.wfInRequest != null) {
                                            if (this.checkForMandatory()) {
                                                this.updatePostApiCall(param, buttonName);
                                            } else {
                                                this.toastr.error(
                                                    this.errorMessages.POST_TRANSFER.CREATE.ERR_UPLOAD_ALL_ATTACH);
                                                return;
                                            }
                                        } else {
                                            this.updatePostApiCall(param, buttonName);
                                        }
                                    } else {
                                        // Non DAT
                                        if (this.checkForMandatory()) {
                                            // if (this.isCheckWorkFlow) {
                                            // this.openWorkFlow();
                                            this.updatePostApiCall(param, buttonName);
                                            // }
                                        } else {
                                            // tslint:disable-next-line: max-line-length
                                            this.toastr.error(this.errorMessages.POST_TRANSFER.CREATE.ERR_UPLOAD_ALL_ATTACH);
                                            return;
                                        }
                                    }
                                    // });
                                }
                            } else {
                                this.toastr.error(this.errorMessages.POST.POST_CREATION_FORM_ERROR);
                                this.getFormError();
                            }
                        } else {
                            param['formAction'] = EdpDataConst.STATUS_DRAFT;
                            if (this.postForm.valid) {
                                this.updatePostApiCall(param, buttonName);
                                this.isSubmitDisable = false;
                                this.isInsert = false;
                            } else {
                                this.toastr.error(this.errorMessages.POST.POST_CREATION_FORM_ERROR);
                                this.getFormError();
                            }
                        }
                    }
                } else {
                    if (!this.officeId) {
                        this.toastr.error(this.errorMessages['ADD_DESIGNATION']['OFFICE_DETAILS']);
                    } else {
                        if (buttonName === 'submit') {
                            param['formAction'] = EdpDataConst.STATUS_SUBMITTED;
                            if (this.isInsert) {
                                if (this.postForm.valid) {
                                    // this.getValueForCheckWorkFlowPopup().subscribe(r => {
                                    if (this.officeDivision && this.officeDivision.toLowerCase() === 'dat') {
                                        if (this.wfInRequest != null) {
                                            if (this.checkForMandatory()) {
                                                this.savePostApiCall(param, buttonName);
                                            } else {
                                                // tslint:disable-next-line: max-line-length
                                                this.toastr.error(this.errorMessages.POST_TRANSFER.CREATE.ERR_UPLOAD_ALL_ATTACH);
                                                return;

                                            }
                                        } else {
                                            this.savePostApiCall(param, buttonName);
                                        }
                                    } else {
                                        // Non DAT
                                        if (this.checkForMandatory()) {
                                            // if (this.isCheckWorkFlow) {
                                            this.savePostApiCall(param, buttonName);
                                            // }
                                        } else {
                                            // tslint:disable-next-line: max-line-length
                                            this.toastr.error(this.errorMessages.POST_TRANSFER.CREATE.ERR_UPLOAD_ALL_ATTACH);
                                            return;
                                        }
                                    }
                                    // });
                                } else {
                                    this.getFormError();
                                }
                            }
                        } else {
                            param['formAction'] = EdpDataConst.STATUS_DRAFT;
                            if (!this.postId) {
                                this.getValueForCheckWorkFlowPopup().subscribe(r => {
                                    param['wfInRequest'] = this.isCheckWorkFlow;
                                    this.savePostApiCall(param, buttonName);
                                });
                            } else {
                                if (this.postForm.valid) {
                                    param['wfInRequest'] = this.isCheckWorkFlow;
                                    this.savePostApiCall(param, buttonName);
                                    this.selectedIndex = 1;
                                    this.isSubmitDisable = false;
                                    this.isInsert = false;
                                } else {
                                    this.getFormError();
                                    this.toastr.error(this.errorMessages['ADD_DESIGNATION']['OFFICE_DETAILS']);
                                }
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * @method checkWorkFlowUpdate
    * @description function called on save as draft button and submit button check
    * code on condition basis
    * @param buttonName pass parameter on click "submit" or "draft"
    * @param param pass params which we add in checkWorkFlowUpdate method
    */
    checkWorkFlowUpdate(param, buttonName) {
        this.getValueForCheckWorkFlowPopup().subscribe(r => {
            if (this.officeDivision && this.officeDivision.toLowerCase() === 'dat') {
                if (this.isCheckWorkFlow) {
                    if (this.checkForMandatory()) {
                        this.updatePostApiCall(param, buttonName);
                    } else {
                        this.toastr.error(
                            this.errorMessages.POST_TRANSFER.CREATE.ERR_UPLOAD_ALL_ATTACH);
                        return;
                    }
                } else {
                    this.updatePostApiCall(param, buttonName);
                    this.goToListing();
                }
            } else {
                // Non DAT
                if (this.checkForMandatory()) {
                    if (this.isCheckWorkFlow) {
                        // this.openWorkFlow();
                        this.updatePostApiCall(param, buttonName);
                    }
                } else {
                    // tslint:disable-next-line: max-line-length
                    this.toastr.error(this.errorMessages.POST_TRANSFER.CREATE.ERR_UPLOAD_ALL_ATTACH);
                    return;
                }
            }
        });
    }

    /**
     * @method checkWorkFlowUpdate
    * @description function called on save as draft button and submit button check
    * code on condition basis
    * @param buttonName pass parameter on click "submit" or "draft"
    * @param param pass params which we add in checkWorkFlowSave method
    */
    checkWorkFlowSave(param, buttonName) {
        this.getValueForCheckWorkFlowPopup().subscribe(r => {
            if (this.officeDivision && this.officeDivision.toLowerCase() === 'dat') {
                if (this.isCheckWorkFlow) {
                    if (this.checkForMandatory()) {
                        this.savePostApiCall(param, buttonName);
                    } else {
                        // tslint:disable-next-line: max-line-length
                        this.toastr.error(this.errorMessages.POST_TRANSFER.CREATE.ERR_UPLOAD_ALL_ATTACH);
                        return;

                    }
                } else {
                    this.savePostApiCall(param, buttonName);
                }
            } else {
                // Non DAT
                if (this.checkForMandatory()) {
                    if (this.isCheckWorkFlow) {
                        this.savePostApiCall(param, buttonName);
                    }
                } else {
                    // tslint:disable-next-line: max-line-length
                    this.toastr.error(this.errorMessages.POST_TRANSFER.CREATE.ERR_UPLOAD_ALL_ATTACH);
                    return;
                }
            }
        });
    }

    /**
     * @method checkForMandatory
    * @description check all documents are attached and upload or not
    */
    checkForMandatory() {
        let flag = true;
        this.dataSourceBrowse.data.forEach(obj => {
            if (obj.mandatoryFlag) {
                if (!obj.postAttachmentId) {
                    flag = false;
                }
            }
        });
        if (!this.dataSourceBrowse.data[0].postAttachmentId) {
            flag = false;
        }
        return flag;
    }

    /**
      * @method getValueForCheckWorkFlowPopup
     * @description check workflow is required or not and return value true or false
     */
    getValueForCheckWorkFlowPopup() {
        const params = null;
        // if (this.wfInRequest === null) {
        return this.edpPostService.getValueForCheckWorkFlowPopup(params).pipe(
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
        // }
    }

    /**
      * @method viewComments
     * @description function called click on ciew comments button and open popup
     * load ViewCommonWorkflowHistoryComponent
     */
    viewComments(): void {
        const params = {};
        params['menuId'] = EdpDataConst.POST_CREATION_MENU_ID;
        params['id'] = this.postId;
        this.edpPostService.getHeaderDetails(params).subscribe(
            (res: any) => {
                if (res && res.result && res.status === 200) {
                    const headerJson: HeaderJson[] = res.result;
                    this.dialog.open(ViewCommonWorkflowHistoryComponent, {
                        width: '2700px',
                        height: '600px',
                        data: {
                            menuModuleName: ModuleNames.EDP,
                            headingName: EdpDataConst.POST_CREATION,
                            headerJson: headerJson,
                            trnId: this.postId,
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

    /**
      * @method openWorkFlow
     * @description open workflow popup and load CommonWorkflowComponent
     */
    openWorkFlow() {
        const params = {};
        params['menuId'] = this.commonService.getLinkMenuId() ? this.commonService.getLinkMenuId() : 39,
            params['id'] = this.postId;
        this.edpPostService
            .getHeaderDetails(params)
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
                        headingName: EdpDataConst.POST_CREATION,
                        headerJson: headerJson,
                        trnId: this.postId, // dynamic
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
                            // tslint:disable-next-line: prefer-const
                            let request = null;
                            const popUpRes = wfData.data.result[0];
                            if (popUpRes.trnStatus && popUpRes.trnStatus.toLowerCase() === 'approved') {
                                // request = this.getPostTransferRequest(EdpDataConst.STATUS_SUBMITTED);
                                const param: any = this.getPostCrationFormData();
                                param.isWfSubmit = true;
                                param.formAction = EdpDataConst.STATUS_SUBMITTED;
                                this.updatePostApiCall(param, 'submit');
                            } else {
                                this.goToListing();
                            }
                        }
                    });
                }
            });
    }

    /**
      * @method savePostApiCall
     * @description if we click on save as draft api then call this function for save data
     * @param param pass params which we add in savepost method
     * @param buttonName pass save or draft value
     */
    savePostApiCall(param, buttonName) {
        param['menucode'] = this.commonService.getMenuCode();
        param['curMenuId'] = this.commonService.getMenuId();
        param['initiatedBy'] = 1;
        // param['wfInRequest'] = this.isCheckWorkFlow;
        param['wfInRequest'] = this.wfInRequest ? this.wfInRequest : this.isCheckWorkFlow;
        param['isWfSaveDrftApiCall'] = true;
        param['isWfSubmit'] = false;
        this.edpPostService.savePostDetails(param).subscribe((res) => {
            if (res && res['result'] && res['status'] === 200 && res['message']) {
                this.toastr.success(res['message']);
                this.saveDraftEnable = false;
                this.isSubmitDisable = false;
                this.action = 'edit';
                this.postId = res['result']['postId'];
                this.transactionNo = res['result']['transactionNo'];
                this.transactionDate = res['result']['trnDate'];
                this.hasWorkFlow = res['result']['wfInRequest'];
                // this.openWorkFlow();
                if (buttonName === 'submit' && (this.wfInRequest || this.isCheckWorkFlow)) {
                    this.openWorkFlow();
                    // this.goToListing();
                } else {
                    if (this.officeDivision && this.officeDivision.toLowerCase() === 'dat' && buttonName === 'submit') {
                        this.goToListing();
                    }
                }
            }
        },
            (err) => {
                this.toastr.error(err);
            });
    }

    /**
      * @method updatePostApiCall
     * @description click on submit button and then api call this function for submit data after modification
     * @param param pass params which we add in savepost method
     * @param buttonName pass save or draft value
     */
    updatePostApiCall(param, buttonName) {
        param['curMenuId'] = EdpDataConst.POST_CREATION_MENU_ID;
        param['transactionNo'] = this.transactionNo;
        param['activeStatus'] = 1;
        param['postId'] = this.postId;
        // param['wfInRequest'] = this.isCheckWorkFlow;
        param['wfInRequest'] = this.wfInRequest ? this.wfInRequest : this.isCheckWorkFlow;

        this.edpPostService.updatePostDetails(param).subscribe((res: any) => {
            if (res && res.result && res.status === 200 && res.message) {
                this.saveDraftEnable = false;
                this.isSubmitDisable = false;
                this.hasWorkFlow = res.result.wfInRequest;
                if (res.result.isWfSubmit) {
                    this.goToListing();
                } else {
                    if (buttonName === 'submit' && (this.wfInRequest || this.isCheckWorkFlow)) {
                        this.openWorkFlow();
                    } else {
                        this.toastr.success(res.message);
                    }
                }
            }
        }, (err) => {
            this.toastr.error(err);
        });
    }

    /**
      * @method loadPostName
     * @description load post name while pass designationId and officeId and postId
     */
    loadPostName() {
        const param = {};
        param['designationId'] = this.postForm.controls.designationName.value;
        param['officeId'] = this.officeId;
        if (this.action === 'edit') {
            param['postId'] = this.postId;
        }
        if (param['designationId'] === undefined) {
            this.isDesignation = false;
            return param['designationId'];
        }
        if (this.officeId) {
            this.edpPostService.postCountDetails(param).subscribe((res) => {
                if (res && res['result'] && res['status'] === 200 && res['status']) {
                    // tslint:disable-next-line: no-inferrable-types
                    let postName: string = '';
                    const designation = this.postForm.controls.designationName.value;
                    if (designation) {
                        this.isDesignation = true;
                    } else {
                        this.isDesignation = false;
                    }
                    const post = this.designationList.filter(data => {
                        return data.id === designation;
                    })[0];
                    postName = post['name'];
                    if (res['result']['count'] > 1) {
                        postName += ' - ' + res['result']['count'];
                    }
                    this.postForm.controls.postName.setValue(postName);
                } else {
                    this.toastr.error(res['message']);
                }
            }, (err) => {
                this.toastr.error(err);
            });
        } else {
            this.toastr.error(this.errorMessages['ADD_DESIGNATION']['OFFICE_DETAILS']);
            this.postForm.controls.designationName.setValue('');
        }
    }

    /**
    * @description Get Attachment data
    */
    loadAttachment() {
        const param = [{
            name: ''
        }];
        this.edpPostService.loadAttachment(param).subscribe((res) => {
            if (res && res['result'] && res['status'] === 200) {
                const mandatoryAttach = [],
                    nonMandatoryAttach = [];
                res['result'].forEach(fileObj => {
                    const attach = fileObj;
                    attach['fileName'] = '';
                    attach['uploadedFileName'] = '';
                    attach['uploadedByName'] = '';
                    attach['postAttachmentId'] = null;
                    attach['size'] = 0;
                    attach['pathUploadFile'] = '';
                    attach['rolePermId'] = null;
                    attach['file'] = null;
                    this.browseData.push(attach);
                    if (attach['mandatoryFlag']) {
                        mandatoryAttach.push(attach);
                    } else {
                        nonMandatoryAttach.push(attach);
                    }
                });
                this.browseData = mandatoryAttach;
                this.browseData = this.browseData.concat(nonMandatoryAttach);
                this.dataSourceBrowse.data = _.cloneDeep(this.browseData);
                // this.dataSourceBrowse.data = this.browseData;
                // this.loadAttachmentList(this.postId);
                this.isSubmitDisable = false;
            } else {
                this.toastr.error(res['message']);
            }
        }, (err) => {
            // this.toastr.error(err);
            this.toastr.error(this.errorMessages['ATTACHMENT']['ERR_GET_LIST']);
        });
    }

    /**
     * @description Validate File on file selection
     * @param fileSelected selected file
     */
    onFileSelection(fileSelected) {
        const fileType = EdpDataConst.EDP_ATTACHMENT_FILE_TYPE;
        if (fileSelected.target && fileSelected.target.files) {
            let fileAllowed: Boolean = false;
            fileType.forEach(el => {
                if (fileSelected.target.files[0] &&
                    el.toLowerCase() === fileSelected.target.files[0].name.split('.').pop().toLowerCase()) {
                    fileAllowed = true;
                    const fileSizeInKb = fileSelected.target.files[0].size / Math.pow(1024, 1);
                    this.totalAttachmentSize += Number(fileSizeInKb);
                    if (this.totalAttachmentSize <= EdpDataConst.MAX_FILE_SIZE_FOR_COMMON) {
                        const uplFlName = fileSelected.target.files[0].name;
                        this.dataSourceBrowse.data[this.fileBrowseIndex].uploadedFileName = uplFlName;
                        this.dataSourceBrowse.data[this.fileBrowseIndex].pathUploadFile = fileSelected.target.value;
                        this.dataSourceBrowse.data[this.fileBrowseIndex].size = fileSizeInKb;
                        this.dataSourceBrowse.data[this.fileBrowseIndex].uploadedByName = this.userName;
                        this.dataSourceBrowse.data[this.fileBrowseIndex].file = fileSelected.target.files[0];
                        this.postAttachment.nativeElement.value = '';
                        this.isUpload = true;
                    } else {
                        this.totalAttachmentSize = this.totalAttachmentSize - fileSizeInKb;
                        this.toastr.error(this.errorMessages['ATTACHMENT']['LARGE_FILE']);
                        this.postAttachment.nativeElement.value = '';
                        this.isUpload = false;
                    }
                }
            });
            if (!fileAllowed) {
                this.toastr.error(this.errorMessages['ATTACHMENT']['INVALID_TYPE']);
            }
        }
    }

    /**
     * @description Open File Selector on the click of browse button
     * @param index index of the row
     */
    openFileSelector(index) {
        this.el.nativeElement.querySelector('#fileBrowse').click();
        this.fileBrowseIndex = index;
    }

    /**
    * @description Add row for adding attachment
    */
    addBrowse() {
        if (this.dataSourceBrowse) {
            const data = this.dataSourceBrowse.data[this.dataSourceBrowse.data.length - 1];
            if (data && data.fileName && data.uploadedFileName) {
                const attachData = this.dataSourceBrowse.data;
                let mandtoryFlag = false;
                if (this.officeDivision && this.officeDivision.toLowerCase() === 'dat') {
                    mandtoryFlag = false;
                }
                // else {
                //     mandtoryFlag = true;
                // }
                attachData.push({
                    attachmentId: Number(data.attachmentId),
                    attachmentName: data.attachmentName,
                    attachmentCode: data.attachmentCode,
                    attachmentDesc: data.attachmentDesc,
                    attahcmentType: Number(data.attahcmentType),
                    fileName: '',
                    uploadedFileName: '',
                    uploadedByName: '',
                    size: 0,
                    pathUploadFile: '',
                    file: null,
                    rolePermId: 0,
                    workFlowId: 0,
                    workFlowRoleId: 0,
                    postId: null,
                    postAttachmentId: null,
                    mandatoryFlag: mandtoryFlag
                });
                attachData[0].mandatoryFlag = true;
                if (this.officeDivision && this.officeDivision.toLowerCase() === 'dat') {
                    attachData[0].mandatoryFlag = true;
                }
                this.dataSourceBrowse.data = attachData;
                this.isUpload = true;
            } else {
                this.isUpload = false;
                this.toastr.error(this.errorMessages['ATTACHMENT']['ERR_FILL_ALL_DATA']);
            }
        }
    }

    /**
    * @description Delete entire row attachment details
    * @param index index of the row
    */
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
            this.isUpload = false;
        }
    }

    /**
     * @description Remove just the file and not the whole row
     * @param fileData item
     * @param removeIndex index
     */
    removeFile(fileData, removeIndex = null): boolean {
        // tslint:disable-next-line: no-shadowed-variable
        this.dataSourceBrowse.data.forEach((file, index) => {
            if (file.postAttachmentId) {
                const fileSize = Number(fileData.uploadedFileSize);
                if (file.size === fileData.size && file.uploadedFileName === fileData.uploadedFileName &&
                    file.postAttachmentId === fileData.postAttachmentId) {
                    this.edpPostService.deleteAttachment({ id: fileData.postAttachmentId }).subscribe((res) => {
                        if (res && res['result'] && res['status'] === 200) {
                            this.totalAttachmentSize = this.totalAttachmentSize - fileSize;
                            file.uploadedByName = '';
                            file.size = 0;
                            file.uploadedFileName = '';
                            file.pathUploadFile = '';
                            file.file = null;
                            file.postAttachmentId = null;
                            return true;
                        } else {
                            return false;
                        }
                    }, (err) => {
                        this.toastr.error(err);
                        return false;
                    });
                }
            } else if (file.size === fileData.size && file.uploadedFileName === fileData.uploadedFileName &&
                file.attachmentId === fileData.attachmentId && index === removeIndex) {
                this.totalAttachmentSize = this.totalAttachmentSize - Number(fileData.size);
                file.uploadedByName = '';
                file.size = 0;
                file.uploadedFileName = '';
                file.pathUploadFile = '';
                file.file = null;
                file.postAttachmentId = null;
                return true;
            }
        });
        return true;
    }

    /**
     * @description load attachment list
     * @param postId pass postId as param
     */
    loadAttachmentList(postId) {
        const param = {
            'id': postId
        };
        this.edpPostService.loadListAttachment(param).subscribe(res => {
            if (res && res['status'] === 200 && res['result']) {
                const resultObject = _.cloneDeep(res['result']);
                this.totalAttachmentSize = 0;
                resultObject.forEach(attachData => {
                    this.totalAttachmentSize += Number(attachData.uploadedFileSize);
                });
                this.dataSourceBrowse.data = resultObject;
            } else {
                if (this.dataSourceBrowse && this.dataSourceBrowse.data) {
                    this.loadAttachment();
                }
            }
        });
    }

    /**
     * @description Save/Upload Attachment Details
     */
    uploadFiles() {
        // tslint:disable-next-line: prefer-const
        let allowUpload = false;
        const uploadAttachmentList = new FormData();
        let index = 0;
        this.dataSourceBrowse.data.forEach((obj) => {
            if (obj.pathUploadFile && obj.size > 0 && obj.uploadedFileName &&
                obj.uploadedByName && obj.postAttachmentId === null) {
                if (obj.fileName.trim()) {
                    uploadAttachmentList.append('attch[' + index + '].fileName', obj.fileName.trim());
                    uploadAttachmentList.append('attch[' + index + '].file', obj.file);
                    uploadAttachmentList.append('attch[' + index + '].attachmentId', obj.attachmentId.toString());
                    uploadAttachmentList.append('attch[' + index + '].uploadedFileName', obj.uploadedFileName);
                    uploadAttachmentList.append('attch[' + index + '].pathUploadFile', obj.pathUploadFile);
                    uploadAttachmentList.append(
                        'attch[' + index + '].postId',
                        this.postId.toString()
                    );
                    uploadAttachmentList.append(
                        'attch[' + index + '].rolePermId',
                        EdpDataConst.ROLE_PERM_ID.toString()
                    );
                    uploadAttachmentList.append('attch[' + index + '].officeId', this.officeId.toString());
                    allowUpload = true;
                    index++;
                }
            }
        });
        if (allowUpload && uploadAttachmentList) {
            this.edpPostService.uploadAttachment(uploadAttachmentList).subscribe((res) => {
                if (res && res['result'] && res['status'] === 200) {
                    this.toastr.success(this.errorMessages['ATTACHMENT']['UPLOAD_SUCCESS']);
                    this.loadAttachmentList(this.postId);
                    this.isUpload = false;
                    this.isSubmitDisable = false;
                } else {
                    this.isUpload = true;
                }
            }, (err) => {
                this.toastr.error(err);
            });
        } else {
            this.toastr.error(this.errorMessages['ATTACHMENT']['ERR_FILENAME']);
        }
    }

    /**
     * @description View Attachment
     * @param attachment  attachment
     */
    viewAttachment(attachment) {
        const ID = {
            'id': attachment.postAttachmentId
        };
        this.httpClient.post(
            `${environment.baseUrl}${APIConst.POST.DOWNLOAD_ATTACHMENT}`,
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

    /**
    * @description Download Attachment
    * @param params attachment details
    */
    downloadAttachment(attachment) {
        const ID = {
            'id': attachment.postAttachmentId
        };
        this.httpClient.post(
            `${environment.baseUrl}${APIConst.POST.DOWNLOAD_ATTACHMENT}`,
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
     * @description reset attachment (remove selected file and set default data or file)
     */
    resetAttachment() {
        const proceedMessage = this.errorMessages['CONFIRMATION_DIALOG']['CONFIRMATION'];
        // tslint:disable-next-line: no-use-before-declare
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '360px',
            data: proceedMessage
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                this.browseData = [];
                this.loadAttachmentList(this.postId);
                this.isUpload = false;
            }
        });
    }

    /**
     * @description Navigate to listing page
     */
    goToListing() {
        this.router.navigate(['/dashboard/edp/post/list'], { skipLocationChange: true });
    }

    /**
     * @description Navigate to dashboard
     */
    goToDashboard() {
        const proceedMessage = this.errorMessages['CONFIRMATION_DIALOG']['CONFIRMATION'];
        // tslint:disable-next-line: no-use-before-declare
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

    /**
     * @description reset form
     */
    resetForm(postForms: NgForm) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '400px',
            data: msgConst.CONFIRMATION_DIALOG.CONFIRMATION
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                if (this.postId) {
                    this.action = 'edit';
                }
                if (this.action === 'new' && this.officeDivision &&
                    this.officeDivision.toLowerCase() === 'DAT'.toLowerCase()) {
                    this.officeId = undefined;
                }
                postForms.resetForm();
                this.getPostDetails();
                this.vacantPostList = [];
                this.saveDraftEnable = false;
                this.isSubmitDisable = true;
                this.isDesignation = false;
                const district = this.postForm.controls.district.value;
                if (district) {
                    this.isOfficeDetailSearch = true;
                } else {
                    this.isOfficeDetailSearch = false;
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

    getFormError() {
        _.each(this.postForm.controls, function (control) {
            if (control.status === 'INVALID') {
                control.markAsTouched({ onlySelf: true });
            }
        });
    }
}
@Component({
    selector: 'app-vacant-post-dialog',
    templateUrl: './available-vacant-post.dialog.html',
    styleUrls: ['./post-creation.component.css']
})

export class AvailableVacantPostDialogComponent implements OnInit {
    constructor(
        public dialogRef: MatDialogRef<AvailableVacantPostDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) { }
    ngOnInit() { }
    onCancel(): void {
        this.dialogRef.close('no');
    }
}
