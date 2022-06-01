import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { msgConst } from 'src/app/shared/constants/edp/edp-msg.constants';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Department, Hod, District, Taluka } from '../../model/office-data-model';
import { EdpDdoOfficeService } from '../../services/edp-ddo-office.service';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { EdpDataConst } from 'src/app/shared/constants/edp/edp-data.constants';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

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
    selector: 'app-sub-office-creation-dialog',
    templateUrl: './sub-office-creation.dialog.html',
    styleUrls: ['./sub-office-creation.component.css']
})

export class SubOfficeCreationComponent implements OnInit {
    ddoSubOffice: FormGroup;
    errorMessages: any = {};
    isHOD: boolean;
    isDepartmentVisible: boolean;
    isHodVisible: boolean = true;
    isSubOfficeEdit: boolean;
    officeId;
    isShown: boolean = true;
    departmentId;
    officeDivision: string;
    hodName: string;
    departmentName: string;

    districtCtrl: FormControl = new FormControl();
    talukaCtrl: FormControl = new FormControl();
    hodCtrl: FormControl = new FormControl();

    departmentList: Department[] = [];
    hodList: Hod[] = [];
    districtList: District[] = [];
    subOffData;
    talukaList: Taluka[] = [];
    action: string = '';
    subOfficeUpdateFlag: boolean;
    subOfficeFlag: boolean;
    datAsHOD: boolean = false;
    hodIdFromList;
    usertype: UserType;
    isUpdate;
    subscribeParams: Subscription;
    subOfficeItrId;
    subOfficeId;
    matInputSelectNull = EdpDataConst.MAT_SELECT_NULL_VALUE;
    officeTypeId: number = 0;
    disableSubmit: boolean = false;
    isDepartmentShowInSubOffice: boolean;
    officeTrnId;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<SubOfficeCreationComponent>,
        private storageService: StorageService,
        private edpDdoOfficeService: EdpDdoOfficeService,
        private toastr: ToastrService
    ) {
        this.departmentList = _.cloneDeep(data.departmentList);
        this.hodList = _.cloneDeep(data.hodList);
        this.districtList = _.cloneDeep(data.districtList);
        this.officeId = _.cloneDeep(data.officeId);
        this.action = _.cloneDeep(data.action);
        this.subOfficeUpdateFlag = _.cloneDeep(data.subOfficeUpdateFlag);
        this.subOfficeFlag = _.cloneDeep(data.subOfficeFlag);
        this.hodIdFromList = _.cloneDeep(data.hodId);
        this.usertype = _.cloneDeep(data.usertype);
        this.isUpdate = _.cloneDeep(data.isUpdate);
        this.departmentId = _.cloneDeep(data.departmentId);
        this.departmentName = _.cloneDeep(data.departmentName);
        this.subOfficeItrId = _.cloneDeep(data.subOfficeItrId);
        this.subOfficeId = _.cloneDeep(data.subOfficeId);
        if (this.isUpdate) {
            this.hodName = _.cloneDeep(data.hodName);
            this.hodIdFromList = _.cloneDeep(data.hodId);
            this.officeTypeId = _.cloneDeep(data.officeTypeId);
            this.isDepartmentShowInSubOffice = _.cloneDeep(data.isDepartmentShowInSubOffice);
            this.officeTrnId = _.cloneDeep(data.officeTrnId);
        }
    }

    ngOnInit() {
        this.isDepartmentVisible = this.data.isDepartmentVisible;
        this.isHOD = this.data.isHOD;
        this.errorMessages = msgConst.DDO_OFFICE;
        this.createForm();
        if (this.data.subOfficeId) {
            this.isSubOfficeEdit = true;
            this.loadSubOfficeData(this.data.subOfficeId);
            if (this.action === 'view') {
                this.ddoSubOffice.disable();
            }
        } else if (this.data.subOfficeItrId) {
            this.isSubOfficeEdit = true;
            this.loadSubOfficeData(this.data.subOfficeItrId);
            if (this.action === 'view') {
                this.ddoSubOffice.disable();
            }
        } else {
            this.isSubOfficeEdit = false;
        }
        this.datAsHOD = this.data.datAsHOD ? this.data.datAsHOD : false;
        this.setData();
        this.isUpdate = this.isUpdate ? this.isUpdate : 0; // If 0 , it is for office creation to make fields readonly
    }

    createForm() {
        this.ddoSubOffice = this.fb.group({
            subOfficeName: ['', Validators.required],
            subOfficeCode: [''],
            departmentName: [''],
            hodId: [''],
            address: ['', Validators.required],
            districtName: ['', Validators.required],
            talukaId: [''],
            station: [''],
            pincode: ['', [Validators.minLength(6), Validators.maxLength(6)]],
            stdCode: [''],
            phoneNo: ['', [Validators.minLength(8), Validators.maxLength(8)]],
            faxNo: ['', [Validators.minLength(10), Validators.maxLength(10)]],
            officeEmailId: ['', Validators.compose([Validators.pattern(EdpDataConst.PATTERN.EMAIL)])],
        });

        this.fieldsValidation();
    }

    fieldsValidation() {
        if (this.isUpdate) {
            this.ddoSubOffice.controls.subOfficeCode.disable();
            this.ddoSubOffice.controls.departmentName.disable();
            this.ddoSubOffice.controls.stdCode.disable();
            this.ddoSubOffice.controls.hodId.disable();
            this.ddoSubOffice.controls.districtName.disable();
            if (this.usertype.isDDOUser) {
                // logic goes here for ddo User
            }
            if (this.usertype.isToPaoUser) {
                this.ddoSubOffice.disable();
            }
            if (this.usertype.isJD) {
                this.ddoSubOffice.disable();
            }
            if (this.usertype.isDatUser) {
                // this.isDepartmentVisible = this.usertype.isDatSuperAdmin ? true : false;
                this.ddoSubOffice.disable();
            }
            if (this.usertype.isHodUser) {
                // logic goes here for Hod User
            }
        }
        if (this.action === 'view') {
            this.ddoSubOffice.disable();
        }
        if (Number(this.officeTypeId) === Number(EdpDataConst.ADMINISTRATIVE_DEPARTMENT_OFFICE_TYPE_ID)) {
            this.isHodVisible = false;
            this.isDepartmentVisible = false;
        } else if (Number(this.officeTypeId) === Number(EdpDataConst.HOD_OFFICE_TYPE_ID)) {
            this.isDepartmentVisible = true;
            this.isHodVisible = false;
        } else if (Number(this.officeTypeId) === Number(EdpDataConst.DDO_OFFICE_TYPE_ID)) {
            this.isDepartmentVisible = true;
            this.isHodVisible = true;
        }
    }

    loadSubOfficeData(subOfficeId) {
        const param = {
            id: this.isUpdate ? this.subOfficeItrId ? this.subOfficeItrId : subOfficeId : subOfficeId,
            isUpdate: this.subOfficeUpdateFlag,
            flag: this.subOfficeFlag
        };
        this.edpDdoOfficeService.getSubOfficeDetails(param).subscribe((res) => {
            if (res && res['result'] && res['status'] === 200) {
                const data = res['result'];
                this.officeTrnId = data.officeTrnId;
                this.subOffData = _.cloneDeep(res['result']);
                let districtName;

                if (this.districtList) {
                    districtName = this.districtList.filter(obj => {
                        return obj.id === data.districtId;
                    })[0];
                }
                if (districtName) {
                    this.talukaList = districtName['taluka'];
                    this.ddoSubOffice.controls.districtName.setValue(districtName['name']);
                    this.ddoSubOffice.controls.stdCode.setValue(districtName['stdCode']);
                }
                this.ddoSubOffice.patchValue({
                    subOfficeName: data.subOfficeName,
                    subOfficeCode: data.subOfficeCode,
                    // departmentName: this.departmentList['name'],
                    // hodId: this.hodList['name'],
                    departmentName: data.departmentName,
                    hodId: data.hodName,
                    address: data.address,
                    talukaId: data.talukaId,
                    station: data.station,
                    pincode: data.pincode,
                    phoneNo: data.phoneNo,
                    faxNo: data.faxNo,
                    officeEmailId: data.officeEmailId
                });
            } else {
                this.toastr.error(res['message']);
            }
        },
            (err) => {
                this.toastr.error(this.errorMessages['ERR_OFFICE_DETAILS']);
            });
    }

    setData() {
        const userOffice = this.storageService.get('userOffice');
        this.officeDivision = userOffice['officeDivision'];
        let district;
        if (this.districtList) {
            // tslint:disable-next-line: no-shadowed-variable
            district = this.districtList.filter((element: District) => {
                return element.id === this.data.districtId;
            })[0];
        }
        if (district) {
            this.talukaList = district['taluka'];
        }
        if (this.officeDivision
            &&
            this.officeDivision.toLowerCase() === EdpDataConst.OFFICE_DIVISION_DAT.toLowerCase() &&
            !this.datAsHOD) {

            if (this.departmentList && this.departmentList[0] && this.departmentList[0]['name']) {
                this.ddoSubOffice.patchValue({
                    departmentName: this.departmentName ? this.departmentName : this.departmentList[0]['name']
                });
            }
            if (this.hodList && this.hodList.length === 1 && this.hodList[0] && this.hodList[0]['name']) {
                this.ddoSubOffice.patchValue({
                    hodId: this.hodList[0]['name']
                });
            }
            if (this.isUpdate) {
                this.ddoSubOffice.patchValue({
                    hodId: this.hodName
                });

            }
            this.ddoSubOffice.patchValue({
                districtName: district['name'],
                stdCode: district['stdCode']
            });
        } else {
            this.departmentList = this.data.departmentList;
            this.hodList = this.data.hodList;
            this.ddoSubOffice.patchValue({
                districtName: district['name'],
                stdCode: district['stdCode'],
                departmentName: this.departmentName ? this.departmentName :
                    this.departmentList[0] && this.departmentList[0]['name'] ?
                        this.departmentList[0]['name'] : this.departmentList['name'],
                hodId: this.hodName ? this.hodName : this.hodList['name'],
            });
        }
    }

    onCancel(): void {
        this.dialogRef.close('no');
    }

    saveSubOffice(): void {
        this.disableSubmit = true;
        if (this.ddoSubOffice.valid) {
            const param = this.ddoSubOffice.value;
            if (this.departmentList && this.departmentList.length > 0 &&
                param['departmentName'] != null && param['departmentName'] !== '') {
                const selectedDept = this.departmentList.filter(deptObj => {
                    return deptObj.name === param['departmentName'];
                })[0];
                if (selectedDept && selectedDept['id']) {
                    param.departmentId = selectedDept['id'];
                }
            } else {
                param.departmentId = this.departmentList && this.departmentList['id']
                    ? this.departmentList['id'] : null;
            }
            if (this.isUpdate) {
                param.departmentId = this.departmentId;
            }

            if (this.hodList && this.hodList.length > 0 && param['hodId']) {
                const hod = this.hodList.filter(hodObj => {
                    return hodObj.name === param['hodId'];
                })[0];
                if (hod && hod['id']) {
                    param.hodId = hod['id'];
                }
            } else {
                param.hodId = this.hodList && this.hodList['id'] ? this.hodList['id'] : null;
            }
            if (this.isUpdate) {
                param.hodId = this.hodIdFromList ?
                    this.hodIdFromList : this.hodList && this.hodList['id'] ? this.hodList['id'] : null;
            }
            param.districtId = this.districtList[0]['id'];
            param.officeId = this.officeId;
            param.isUpdate = this.subOfficeUpdateFlag;
            param.flag = this.subOfficeFlag;
            param.officeTrnId = this.officeTrnId;
            if (this.subOfficeItrId) {
                param.subOfficeItrId = this.subOfficeItrId;
            }
            if (this.subOfficeId) {
                param.subOfficeId = this.subOfficeId;
            }
            if (this.isSubOfficeEdit) {
                param.subOfficeItrId = this.subOfficeItrId ? this.subOfficeItrId : undefined;
                param.subOfficeId = this.data.subOfficeId;
                this.edpDdoOfficeService.updateSubOfficeDetails(param).subscribe((updateRes) => {
                    if (updateRes && updateRes['result'] && updateRes['status'] === 200 && updateRes['message']) {
                        this.toastr.success(updateRes['message']);
                        this.dialogRef.close('save');
                    } else {
                        this.toastr.error(updateRes['message']);
                    }
                },
                    (updateErr) => {
                        this.toastr.error(this.errorMessages['ERR_OFFICE_DETAILS']);
                    });
            } else {
                this.edpDdoOfficeService.saveSubOfficeDetails(param).subscribe((saveRes) => {
                    if (saveRes && saveRes['result'] && saveRes['status'] === 200 && saveRes['message']) {
                        this.toastr.success(saveRes['message']);
                        this.dialogRef.close('save');
                    } else {
                        this.toastr.error(saveRes['message']);
                    }
                },
                    (saveErr) => {
                        this.toastr.error(this.errorMessages['ERR_OFFICE_DETAILS']);
                    });
            }
        } else {
            _.each(this.ddoSubOffice.controls, function (control) {
                if (control.status === 'INVALID') {
                    control.markAsTouched({ onlySelf: true });
                }
            });
            this.disableSubmit = false;
        }
    }

}
