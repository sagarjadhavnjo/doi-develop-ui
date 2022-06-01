import { CommonService } from './../../../modules/services/common.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { StorageService } from 'src/app/shared/services/storage.service';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { UserPostList } from 'src/app/models/userPost-model';
import * as _ from 'lodash';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { APIConst } from 'src/app/shared/constants/common/common-api.constants';
import { AuthenticationService } from 'src/app/modules/services';
import { TransactionMessageDialogComponent } from 'src/app/modules/non-auth/login/transaction-message-dialog/transaction-message-dialog.component';
import { Router } from '@angular/router';

@Component({
    selector: 'app-header',
    templateUrl: './app-header.component.html',
    styleUrls: ['./app-header.component.css']
})
export class AppHeaderComponent implements OnInit {
    @Output() menuToggle = new EventEmitter(null);
    userCode: number;
    employeeNumber: number;
    designationName: string;
    userName: string;
    currentUserData: string;
    officeName: string;
    postName: string;
    imgsrc: string;
    officeId: number;
    pouId: number;
    userPostList: string[] = [];
    base64textString = [];
    notificationCount: number;

    isSwitchPostDisbled: boolean = false;
    constructor(
        private commonService: CommonService,
        private storageService: StorageService,
        private toastr: ToastrService,
        private dialog: MatDialog,
        private httpClient: HttpClient,
        private router: Router
    ) { }


    ngOnInit() {
        this.userName = this.storageService.get('userName');
        this.currentUserData = this.storageService.get('currentUser');
        this.userCode = this.currentUserData['usercode'];
        this.userOfficeDetails();
        this.profileData();
        this.getNotificationCount();
    }
    userOfficeDetails() {
        this.userPostList = this.currentUserData['post'];
        if (this.userPostList) {
            if (this.userPostList.length > 1) {
                this.isSwitchPostDisbled = true;
            } else {
                this.isSwitchPostDisbled = false;
            }
            this.userPostList.forEach(designationObj => {
                if (designationObj['loginPost'] === true) {
                    this.employeeNumber = _.cloneDeep(this.currentUserData['usercode']);
                    this.postName = _.cloneDeep(designationObj['postName']);
                    this.officeName = _.cloneDeep(
                        designationObj['oauthTokenPostDTO']['edpMsOfficeDto']['officeNameDisp']);
                    this.designationName =
                        _.cloneDeep(designationObj['oauthTokenPostDTO']['edpMsDesignationDto']['designationName']);
                }
            });
        }
    }

    logout() {
        this.commonService.logout();
    }

    menuDisplay($event) {
        this.menuToggle.emit($event);
    }
    switchRoleModel() {
        // tslint:disable-next-line: no-use-before-declare
        const dialogRef = this.dialog.open(SwitchRoleDialog, {
            width: '780px',
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                return true;
            }
        });
    }
    profileModel() {
        // tslint:disable-next-line: no-use-before-declare
        const dialogRef = this.dialog.open(UserProfileDialog, {
            width: '780px',
        });
        dialogRef.afterClosed().subscribe(result1 => {
            if (result1 === 'yes') {
                return true;
            }
        });
    }
    profileData() {
        const ID = {
            id: this.userCode
        };
        this.httpClient.post(
            `${environment.baseUrl}${APIConst.PROFILE.USER_PROFILE}`, ID
        ).subscribe((res) => {
            if (res && res['result'] && res['status'] === 200) {
                const resultObj = res['result'];
                const imgNameArray = resultObj['name'].split('.');
                const imgType = imgNameArray[imgNameArray.length - 1];
                this.imgsrc = 'data:image/' + imgType + ';base64,' + resultObj['image'];
            }
        }, (err) => {
            this.toastr.error(err);
        });
    }

    getNotificationList() {
        this.router.navigate(['dashboard/system-notification'], { skipLocationChange: true });
    }


    /**
     * count of Unread Notifications
     * 
     * @private
     * 
     * @memberOf AppHeaderComponent
     */
    private getNotificationCount() {
        let userPrimary = this.userPostList.filter((row: any) => row.loginPost == true);
        userPrimary = _.head(userPrimary)
        const userDetail = {
            assignByOfficeId: userPrimary['oauthTokenPostDTO']['edpMsOfficeDto'].officeId,
            assignByPOUId: userPrimary['lkPoOffUserId']
        }
        this.commonService.getNotificationCount(userDetail).subscribe((res: any) => {
            if (res && res.status == 200 && res !== null) {
                this.notificationCount = res.result;
            }
            
        })
        this.commonService.updateNotificationCount$.subscribe(x => this.notificationCount = x);

    }
}

@Component({
    selector: 'app-switch-role-dialog',
    templateUrl: './switch-role-dialog.html',
    styleUrls: ['./app-header.component.css']
})

// tslint:disable-next-line: component-class-suffix
export class SwitchRoleDialog implements OnInit {

    switchUserDataSource = new MatTableDataSource([]);
    historyColumns = ['officeName', 'postName', 'postType', 'switchRole'];
    currentUserData: string;
    userName: string;
    newPostId: number;
    imgsrc: string;
    employeeNumber: number;
    designationName: string;
    postDataList: any[] = [];
    userPostList: UserPostList[] = [];
    isButtonDisabled: boolean = true;
    constructor(
        public dialogRef: MatDialogRef<SwitchRoleDialog>,
        private dialog: MatDialog,
        private storageService: StorageService,
        private commanService: CommonService,
        private authService: AuthenticationService,
        private toastr: ToastrService,
    ) { }
    ngOnInit() {
        this.currentUserData = this.storageService.get('currentUser');
        this.userName = this.currentUserData['username'];
        this.userPostData();
    }

    userPostData() {
        this.postDataList = this.currentUserData['post'];
        const officeObj = [];
        this.postDataList.forEach(postObj => {
            const tempObj = {
                officeName: postObj['oauthTokenPostDTO']['edpMsOfficeDto'] ?
                    _.cloneDeep(postObj['oauthTokenPostDTO']['edpMsOfficeDto']['officeName']) : '',
                postName: _.cloneDeep(postObj['postName']),
                postType: postObj['primaryPost'] ? 'Primary' : 'Secondary',
                postId: postObj['postId'],
                loginPost: _.cloneDeep(postObj['loginPost'])
            };
            if (postObj['loginPost'] === true) {
                this.designationName =
                    _.cloneDeep(postObj['postName']);
                this.employeeNumber = _.cloneDeep(this.currentUserData['usercode']);
            }
            officeObj.push(tempObj);
        });
        const officePostObj = _.orderBy(officeObj, (x) => x.postType === 'Primary', ['desc']);
        this.switchUserDataSource = new MatTableDataSource(officePostObj);
    }

    onCancel(): void {
        this.dialogRef.close('no');
    }

    userPostSwitch(element) {
        if (element['loginPost'] === false) {
            this.isButtonDisabled = false;
            this.newPostId = element['postId'];
        } else {
            this.isButtonDisabled = true;
        }
    }

    switchPostRole() {
        const param = {
            id: this.newPostId
        };
        this.commanService.getSwitchPost(param).subscribe(res => {
            if (res && res['result'] && res['status'] === 200) {
                if (res['result'] !== null) {
                    this.toastr.success(res['message']);
                    this.authService.setLocalStorage(res).then(data => {
                        this.dialogRef.close('no');
                        if (data.transactionInfo) {
                            this.openTransactionMessageDialog(data.transactionInfo.transactionMessage);
                        } else {
                            this.reload();
                        }

                    }).catch(err => {
                        throw err;
                    });
                } else {
                    this.toastr.error(res['message']);
                }
            }
        }, (err) => {
            this.toastr.error(err);
        });
    }

    private reload() {
        location.reload();
    }

    private openTransactionMessageDialog(transactionMessage: string) {
        const dialogRef = this.dialog.open(TransactionMessageDialogComponent, {
            width: '600px',
            data: { transactionMessage: transactionMessage }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.reload();
        });
    }
}

@Component({
    selector: 'app-profile-role-dialog',
    templateUrl: './profile-role-dialog.html',
    styleUrls: ['./app-header.component.css']
})

// tslint:disable-next-line: component-class-suffix
export class UserProfileDialog implements OnInit {

    userProfileDataSource = new MatTableDataSource([]);
    profileColumn = ['panNo', 'emailId', 'mobileNo'];
    currentUserData: string;
    userName: string;
    profileDataList: any[] = [];
    constructor(
        public dialogRef: MatDialogRef<UserProfileDialog>,
        public storageService: StorageService,
    ) { }
    ngOnInit() {
        this.currentUserData = this.storageService.get('currentUser');
        this.userName = this.currentUserData['username'];
        this.userProfileData();
    }

    userProfileData() {
        this.profileDataList.push(this.currentUserData['EmployeeInfo']);
        this.userProfileDataSource = new MatTableDataSource(this.profileDataList);
    }

    onCancel(): void {
        this.dialogRef.close('no');
    }


}
