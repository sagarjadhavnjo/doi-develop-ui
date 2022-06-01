import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { BehaviorSubject, of as observableOf } from 'rxjs';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FileNode } from '../model/right-mapping';
import { Router } from '@angular/router';
import * as _ from 'lodash';
@Component({
    selector: 'app-user-right-view-dialog',
    templateUrl: './user-right-view-dialog.component.html',
    styleUrls: ['./user-right-view-dialog.component.css']
})
export class UserRightViewDialogComponent implements OnInit {

    @Output() menuToggle = new EventEmitter(null);
    empNo: string;
    empName: string;
    postName: string;
    subModule: any[];
    treeData: any[];
    nestedTreeControl: NestedTreeControl<FileNode>;
    nestedDataSource: MatTreeNestedDataSource<FileNode>;
    dataChange: BehaviorSubject<FileNode[]> = new BehaviorSubject<FileNode[]>([]);
    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<UserRightViewDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data) {
        this.empNo = data.empNo;
        this.empName = data.empName;
        this.postName = data.postName;
        this.nestedTreeControl = new NestedTreeControl<FileNode>(this._getChildren);
        this.nestedDataSource = new MatTreeNestedDataSource();
        this.dataChange.subscribe(moduleData => this.nestedDataSource.data = moduleData);
        this.sortMenu();
        this.dataChange.next(this.data.userRights);
    }

    ngOnInit() {
    }
    sortMenu() {
         this.data.userRights.forEach(subModuleObj => {
            this.subModule = subModuleObj['listValue'];
        });
        if (this.subModule) {
            for (let i = 0; i < this.subModule.length; i++) {
                const menu = this.subModule[i];
                if (menu.listValue && menu.listValue.length > 0) {
                    menu.listValue = this.sortChildren(menu.listValue);
                }
                this.subModule = _.orderBy(this.subModule, 'name', 'asc');
            }
        }
    }

    sortChildren(menu) {
        for (let i = 0; i < menu.length; i++) {
            const subMenu = menu[i];
            if (subMenu.listValue && subMenu.listValue.length > 0) {
                subMenu.listValue = this.sortChildren(subMenu.listValue);
            }
        }
        menu = _.orderBy(menu, 'name', 'asc');
        return menu;
    }
    naviagateTo(node, $event) {
        if (node.listValue) {
            this.menuToggle.emit($event);
            this.router.navigate(node.listValue, { skipLocationChange: true });
        }
    }
    private _getChildren = (node: FileNode) => {
        return observableOf(node['listValue']);
    }
    // tslint:disable-next-line: no-shadowed-variable
    hasNestedChild = (_: number, nodeData: FileNode) => {
        return (nodeData['listValue'] && nodeData['listValue'].length > 0);
    }
    onNoClick(): void {
        this.dialogRef.close();
    }

}
