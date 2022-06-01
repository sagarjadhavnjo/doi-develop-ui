import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filterSelectInput' })
export class FilterSelectInputPipe implements PipeTransform {
    transform(arr: any[], searchString?: string, keyName?: string): any {
        if (!searchString) {
            return arr;
        }
        if (arr[0].lookupInfoName) {
            // return arr.filter((item) => item.lookupInfoName.toLowerCase().indexOf(searchString.toLowerCase()) > -1);
            return arr.filter(item => item.lookupInfoName.toLowerCase().indexOf(searchString.toLowerCase()) > -1);
        } else if (arr[0].districtName) {
            return arr.filter(item => item.districtName.toLowerCase().indexOf(searchString.toLowerCase()) > -1);
        } else if (arr[0].fyStart) {
            return arr.filter(
                item =>
                    item.fyStart
                        .toString()
                        .toLowerCase()
                        .indexOf(searchString.toLowerCase()) > -1
            );
        } else if (arr[0].name) {
            return arr.filter(
                item =>
                    item.name
                        .toString()
                        .toLowerCase()
                        .indexOf(searchString.toLowerCase()) > -1
            );
        } else if (arr[0].head) {
            return arr.filter(
                item =>
                    item.head
                        .toString()
                        .toLowerCase()
                        .indexOf(searchString.toLowerCase()) > -1
            );
        } else if (arr[0].voucherNo) {
            return arr.filter(
                item =>
                    item.voucherNo
                        .toString()
                        .toLowerCase()
                        .indexOf(searchString.toLowerCase()) > -1
            );
        } else if (arr[0].majorHead) {
            return arr.filter(
                item =>
                    item.majorHead
                        .toString()
                        .toLowerCase()
                        .indexOf(searchString.toLowerCase()) > -1
            );
        } else if (arr[0].voucherNum) {
            return arr.filter(
                item =>
                    item.voucherNum
                        .toString()
                        .toLowerCase()
                        .indexOf(searchString.toLowerCase()) > -1
            );
        } else if (arr[0].designationName) {
            return arr.filter(
                item =>
                    item.designationName
                        .toString()
                        .toLowerCase()
                        .indexOf(searchString.toLowerCase()) > -1
            );
        } else if (arr[0].departmentName) {
            return arr.filter(
                item =>
                    item.departmentName
                        .toString()
                        .toLowerCase()
                        .indexOf(searchString.toLowerCase()) > -1
            );
        } else if (arr[0].hod) {
            return arr.filter(
                item =>
                    item.hod
                        .toString()
                        .toLowerCase()
                        .indexOf(searchString.toLowerCase()) > -1
            );
        } else if (arr[0].officeName) {
            return arr.filter(
                item =>
                    item.officeName
                        .toString()
                        .toLowerCase()
                        .indexOf(searchString.toLowerCase()) > -1
            );
        } else if (arr[0].withdrawalTypeName) {
            return arr.filter(
                item =>
                    item.withdrawalTypeName
                        .toString()
                        .toLowerCase()
                        .indexOf(searchString.toLowerCase()) > -1
            );
        } else if (arr[0].departName) {
            return arr.filter(
                item =>
                    item.departName
                        .toString()
                        .toLowerCase()
                        .indexOf(searchString.toLowerCase()) > -1
            );
        } else if (arr[0].stateName) {
            return arr.filter(
                item =>
                    item.stateName
                        .toString()
                        .toLowerCase()
                        .indexOf(searchString.toLowerCase()) > -1
            );
        } else if (arr[0].talukaName) {
            return arr.filter(
                item =>
                    item.talukaName
                        .toString()
                        .toLowerCase()
                        .indexOf(searchString.toLowerCase()) > -1
            );
        } else if (arr[0].gradePayValue) {
            return arr.filter(
                item =>
                    item.gradePayValue
                        .toString()
                        .toLowerCase()
                        .indexOf(searchString.toLowerCase()) > -1
            );
        } else if (arr[0].designationName) {
            return arr.filter(
                item =>
                    item.designationName
                        .toString()
                        .toLowerCase()
                        .indexOf(searchString.toLowerCase()) > -1
            );
        } else  if(arr[0][keyName]) {
            return arr.filter((item) => item[keyName].toLowerCase().indexOf(searchString.toLowerCase()) > -1);
        } else {
			return arr.filter((item) => item.viewValue.toLowerCase().indexOf(searchString.toLowerCase()) > -1);
            /*return arr.filter(item => item.lookupInfoName.toLowerCase().indexOf(searchString.toLowerCase()) > -1);*/
        }
    }
}
