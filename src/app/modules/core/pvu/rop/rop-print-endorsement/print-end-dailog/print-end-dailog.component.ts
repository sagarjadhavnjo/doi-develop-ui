import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'app-print-end-dailog',
    templateUrl: './print-end-dailog.component.html',
    styleUrls: ['./print-end-dailog.component.css']
})
export class PrintEndDailogComponent implements OnInit {

    remarksForm: FormGroup;
    isSubmitted = false;
    result: any;

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<PrintEndDailogComponent>,
        @Inject(MAT_DIALOG_DATA) public data
    ) { }

    ngOnInit() {

        this.isSubmitted = false;
        this.remarksForm = this.fb.group({
            remarks: ['', Validators.required]
        });
    }

    onNoClick() {
        this.dialogRef.close();
    }

    /**
     * On submit remarks, the remarks will be send back to the subscriber
     * i.e. printing function in rop-print-endorsement component
     */

    submitRemarks() {
        this.isSubmitted = true;
        this.result = {
            remarks: this.remarksForm.controls.remarks.value,
            isSubmitted: this.isSubmitted
        };
        if (this.remarksForm.controls.remarks.value !== null && this.remarksForm.controls.remarks.value !== '') {
            this.dialogRef.close(this.result);
        }
    }
}
