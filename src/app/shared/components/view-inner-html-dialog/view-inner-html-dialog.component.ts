import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ViewHtmlDialogInterface {
    innerHtmlMsg: string;
    isOkButtonVisible: boolean;
    okButtonMsg?: string;
    closeBtnMsg?: string;
}

@Component({
    selector: 'app-view-inner-html-dialog',
    templateUrl: './view-inner-html-dialog.component.html',
    styleUrls: ['./view-inner-html-dialog.component.css']
})
export class ViewInnerHtmlDialogComponent implements OnInit {

    isOkButtonVisible = false;
    constructor(
        public dialogRef: MatDialogRef<ViewInnerHtmlDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ViewHtmlDialogInterface
    ) { }
    message: string;
    ngOnInit() {
        this.message = this.data.innerHtmlMsg;
        this.isOkButtonVisible = this.data.isOkButtonVisible;

    }
    onCancel() {
        this.closeDialog(this.data.closeBtnMsg);
    }

    onOkBtnClick() {
        this.closeDialog(this.data.closeBtnMsg);
    }

    closeDialog(popup: string) {
        this.dialogRef.close(popup);
    }

}
