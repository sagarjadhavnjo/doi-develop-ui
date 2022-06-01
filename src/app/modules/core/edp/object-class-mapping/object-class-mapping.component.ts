import { BillType, ObjectClass } from './../model/object-class-model';
import { Component, OnInit } from '@angular/core';
import { msgConst } from './../../../../shared/constants/edp/edp-msg.constants';
import { FormBuilder, Validators, FormControl, FormGroup, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { EdpObjectClassService } from '../services/edp-object-class.service';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
@Component({
    selector: 'app-object-class-mapping',
    templateUrl: './object-class-mapping.component.html',
    styleUrls: ['./object-class-mapping.component.css']
})
export class ObjectClassMappingComponent implements OnInit {

    billTypeCtrl: FormControl = new FormControl();
    showTab: Boolean = false;
    isGlobal: boolean = false;
    date: any = new Date();
    today_date = Date.now();
    errorMessage: any = {};
    billList: BillType[] = [];
    objectClassList: ObjectClass[] = [];

    objectClassMappingForm: FormGroup;
    constructor(
        private fb: FormBuilder,
        private router: Router,
        private objectClassService: EdpObjectClassService,
        private toaster: ToastrService,
    ) { }


    ngOnInit() {
        this.errorMessage = msgConst.OBJECT_CLASS_MAPPING;
        this.createForm();
        this.getData();
    }

    createForm() {
        this.objectClassMappingForm = this.fb.group({
            billTypeId: ['', Validators.required],
            objectClassId: this.fb.array([])
        });
    }
    getData(): void {
        this.objectClassService.getObjectClassDetails().subscribe(res => {
            if (res && res['result'] && res['status'] === 200) {
                this.billList = res['result']['billType'];
                this.objectClassList = res['result']['objectClass'];
                this.objectClassList.forEach(objClass => {
                    objClass['checked'] = false;
                });
            }
        }, (err) => {
            this.toaster.error(this.errorMessage['ERR_OBJECT_CLASS_DATA']);
        });
    }

    loadObjectClass() {
        const param = {
            id: this.objectClassMappingForm.controls.billTypeId.value
        },
            self = this;
        this.objectClassList.forEach(objClass => {
            objClass.checked = false;
            self.onObjectChange({ checked: false, source: { value: objClass.id } });
        });
        self.objectClassService.getSelectedObjectClass(param).subscribe(res => {
            if (res && res['result'] && res['status'] === 200) {
                const classList = res['result']['objectClass'];
                if (classList && classList.length > 0) {
                    this.objectClassList.forEach(objClass => {
                        classList.forEach(element => {
                            if (element.flag && element.id === objClass.id) {
                                objClass.checked = true;
                                self.onObjectChange({ checked: element.flag, source: { value: element.id } });
                            }
                        });
                    });
                }
            }
        }, (err) => {
            self.toaster.error(self.errorMessage['ERR_OBJECT_CLASS_DATA']);
        });
    }

    onObjectChange(event) {
        const objectClassList = <FormArray>this.objectClassMappingForm.get('objectClassId') as FormArray;

        if (event.checked) {
            objectClassList.push(new FormControl(event.source.value));
        } else {
            const i = objectClassList.controls.findIndex(x => x.value === event.source.value);
            objectClassList.removeAt(i);
        }
    }
    searchDetail(): void {
        if (this.objectClassMappingForm.valid) {
            const param = this.objectClassMappingForm.value;
            this.objectClassService.saveObjectClassDetails(param).subscribe(res => {
                if (res && res['result'] && res['status'] === 200 && res['message']) {
                    this.toaster.success(res['message']);
                }
            }, (err) => {
                this.toaster.error(this.errorMessage['ERR_SAVE_OBJECT_CLASS']);
            });
        } else {
            _.each(this.objectClassMappingForm.controls, function (control) {
                if (control.status === 'INVALID') {
                    control.markAsTouched({ onlySelf: true });
                }
            });
        }

    }

    goToDashboard() {
        this.router.navigate(['/dashboard'], {skipLocationChange: true});
    }
}
