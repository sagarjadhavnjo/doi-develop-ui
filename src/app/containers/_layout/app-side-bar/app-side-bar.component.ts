import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { BehaviorSubject, of as observableOf } from 'rxjs';
import * as cloneDeep from 'lodash/cloneDeep';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/modules/services/common.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import * as _ from 'lodash';
export class FileNode {
    menuId: number;
    menuName: string;
    orderId: number;
    menuLink: string;
    menuDescription?: string;
    menuDtos?: FileNode[];
}

/**
 * @title Tree with dynamic data
 */
@Component({
    selector: 'app-side-bar',
    templateUrl: './app-side-bar.component.html',
    styleUrls: ['./app-side-bar.component.css']
})
export class AppSideBarComponent implements OnInit {
    @Output() menuToggle = new EventEmitter(null);
    nestedTreeControl: NestedTreeControl<FileNode>;
    nestedDataSource: MatTreeNestedDataSource<FileNode>;
    dataChange: BehaviorSubject<FileNode[]> = new BehaviorSubject<FileNode[]>([]);
    menu: any[];
    userOffice: any[];
    currentUser: any[];
    treeData: any[];
    officeTypeID: number;
    constructor(
        private router: Router,
        private commonService: CommonService,
        private storageService: StorageService
    ) {

        this.nestedTreeControl = new NestedTreeControl<FileNode>(this._getChildren);
        this.nestedDataSource = new MatTreeNestedDataSource();
        this.dataChange.subscribe(data => this.nestedDataSource.data = data);
        this.menu = this.storageService.get('menu');
        this.sortMenu();
        this.userOffice = this.storageService.get('userOffice');
        this.currentUser = this.storageService.get('currentUser');
        this.dataChange.next(this.menu);
        console.log(this.menu);
        console.log(this.storageService.get('access_token'));
    }

    ngOnInit() { }

    sortMenu() {
        for (let i = 0; i < this.menu.length; i++) {
            const menu = this.menu[i];
            if (menu.menuDtos && menu.menuDtos.length > 0) {
                menu.menuDtos = this.sortChildren(menu.menuDtos);
            }
        }
        if (this.menu && this.menu[0] && (this.menu[0].orderId || this.menu[0].orderId === 0)) {
            this.menu = _.orderBy(this.menu, 'orderId', 'asc');
        }
    }

    sortChildren(menu) {
        for (let i = 0; i < menu.length; i++) {
            const subMenu = menu[i];
            if (subMenu.menuDtos && subMenu.menuDtos.length > 0) {
                subMenu.menuDtos = this.sortChildren(subMenu.menuDtos);
            }
        }
        if (menu && menu[0] && (menu[0].orderId || menu[0].orderId === 0)) {
            menu = _.orderBy(menu, 'orderId', 'asc');
        }
        return menu;
    }

    naviagateOfficeType(): number {
        this.currentUser['post'].forEach((element) => {
            if (element['primaryPost'] === true) {
                return this.userOffice['officeTypeId'];
            }
        });
        return null;
    }
    private _getChildren = (node: FileNode) => {
        return observableOf(node.menuDtos);
    }

    naviagateTo(node, $event) {
        console.log(node);
        if (node.menuLink) {
            this.commonService.setMenu(node);
            this.commonService.setMenuId(node.menuId);
            this.commonService.setLinkMenuId(node.linkMenuId);
            this.commonService.setLinkMenuWfRoleId(node.linkMenuWfRoleId);
            this.commonService.setwfRoleId(node.wfRoleId);
            this.commonService.setMenuCode(node.menuCode);
            this.commonService.setOfficeTypeId(this.naviagateOfficeType());
            this.menuToggle.emit($event);
            this.router.navigate([node.menuLink], { skipLocationChange: true });
            // added skipLocationChange, as a part of
            //  reverting a change done by Sumanth Reddy, I have there conscent also
        }
    }

    // tslint:disable-next-line: no-shadowed-variable
    hasNestedChild = (_: number, nodeData: FileNode) => {
        return (nodeData.menuDtos && nodeData.menuDtos.length > 0);
    }

    public filtertree(filterText: string) {
        let filteredTreeData: FileNode[] = [];
        this.treeData = cloneDeep(this.menu);
        if (filterText) {
            for (let i = 0; i < this.treeData.length; i++) {
                const menu = this.treeData[i];
                if (menu.menuDtos && menu.menuDtos.length > 0) {
                    const menuChildrenData = this.getChildrenMenuOnFilter(menu.menuDtos, filterText);
                    if (menuChildrenData.length > 0) {
                        filteredTreeData.push(menu);
                        filteredTreeData[filteredTreeData.length - 1].menuDtos = menuChildrenData;
                    } else {
                        if (menu.menuName.toLocaleLowerCase().indexOf(filterText.toLocaleLowerCase()) > -1) {
                            const menu1 = {
                                menuDescription: menu.menuDescription,
                                menuId: menu.menuId,
                                menuLink: menu.menuLink,
                                menuName: menu.menuName,
                                orderId: menu.orderId
                            };
                            filteredTreeData.push(menu1);
                            filteredTreeData[filteredTreeData.length - 1].menuDtos = menu.menuDtos;
                        }
                    }
                } else {
                    if (menu.menuName.toLocaleLowerCase().indexOf(filterText.toLocaleLowerCase()) > -1) {
                        const menu1 = {
                            menuDescription: menu.menuDescription,
                            menuId: menu.menuId,
                            menuLink: menu.menuLink,
                            menuName: menu.menuName,
                            orderId: menu.orderId
                        };
                        filteredTreeData.push(menu1);
                    }
                }
            }
        } else {
            filteredTreeData = this.treeData;
        }
        this.dataChange.next(filteredTreeData);
        return filteredTreeData;
    }

    getChildrenMenuOnFilter(menuChild, filterText) {
        const returnData = [];
        for (let i = 0; i < menuChild.length; i++) {
            const menu = menuChild[i];
            if (menu.menuDtos && menu.menuDtos.length > 0) {
                const menuChildrenData = this.getChildrenMenuOnFilter(menu.menuDtos, filterText);
                if (menuChildrenData.length > 0) {
                    returnData.push(menu);
                    returnData[returnData.length - 1].menuDtos = menuChildrenData;
                } else {
                    if (menu.menuName.toLocaleLowerCase().indexOf(filterText.toLocaleLowerCase()) > -1) {
                        const menu1 = {
                            menuDescription: menu.menuDescription,
                            menuId: menu.menuId,
                            menuLink: menu.menuLink,
                            menuName: menu.menuName,
                            orderId: menu.orderId
                        };
                        returnData.push(menu1);
                    }
                }
            } else {
                if (menu.menuName.toLocaleLowerCase().indexOf(filterText.toLocaleLowerCase()) > -1) {
                    const menu1 = {
                        menuDescription: menu.menuDescription,
                        menuId: menu.menuId,
                        menuLink: menu.menuLink,
                        menuName: menu.menuName,
                        orderId: menu.orderId
                    };
                    returnData.push(menu1);
                }
            }
        }
        return returnData;
    }

    filterChanged(filterText: string) {
        this.filtertree(filterText);
        // if (filterText) {
        //   this.nestedTreeControl.expandAll();
        // } else {
        // this.nestedTreeControl.collapseAll();
        // }
    }
}
