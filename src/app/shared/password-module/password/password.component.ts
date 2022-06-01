import { StorageService } from './../../services/storage.service';
import { CommonService } from './../../../modules/services/common.service';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-password',
    templateUrl: './password.component.html',
    styleUrls: ['./password.component.css']
})
export class PasswordComponent implements OnInit {
    showUserName = false;
    userName: string;
    constructor(private commonService: CommonService, private storageService: StorageService) { }

    ngOnInit() {
        if (this.commonService.isUserLoggedIn()) {
            this.showUserName = true;
            this.userName = this.storageService.get('userName');
        }
    }

}
