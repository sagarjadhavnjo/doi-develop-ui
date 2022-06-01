import { ActionEventInterFace } from './model/common-model';
import { PageConfiguration } from './../../index';
import {
    Component,
    OnInit,
    Input,
    OnChanges,
    AfterViewInit,
    ViewChild,
    Output,
    EventEmitter,
    ChangeDetectorRef
} from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-common-table',
    templateUrl: './common-table.component.html',
    styleUrls: ['./common-table.component.css']
})
export class CommonTableComponent implements OnInit, OnChanges, AfterViewInit {

    @Input() tableData = [];
    @Input() tableHeaderDataKeyMap;
    @Input() showFirstLastButtons: boolean = false;
    @Input() pageConfiguration: PageConfiguration;
    @Input() refreshData: boolean = true;
    @Input() showPaginationDropdown: boolean = true;

    @Output() pageChange: EventEmitter<any> = new EventEmitter(null);
    // @Output() edit: EventEmitter<any> = new EventEmitter(null);
    // @Output() view: EventEmitter<any> = new EventEmitter(null);
    @Output() actionEvent: EventEmitter<ActionEventInterFace> = new EventEmitter(null);
    @Output() sortChange: EventEmitter<any> = new EventEmitter(null);

    @ViewChild('paginator', { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    displayedColumnsFooter: string[];
    sortSubscriber: Subscription;
    tableDataSource: MatTableDataSource<any> = new MatTableDataSource([]);
    loadedOnce: boolean = false;
    tableHeadersKey: Array<string> = [];
    tableHeadersKeyRowAndColSpan: Array<string> = [];
    totalPages: Array<number> = [];
    pageSelected: number = 0;
    allTableData: any[] = [];
    iteratablePageIndex: number = 0;
    constructor() { }

    ngOnInit() { }

    ngOnChanges(changes: import('@angular/core').SimpleChanges) {
        // this.pageSelected = this.pageConfiguration.pageIndex + 1;
        // if (this.loadedOnce) {
        //     this.segeregrateColumns();
        //     this.processingData();
        // }

        if (changes.tableHeaderDataKeyMap &&
            changes.tableHeaderDataKeyMap.currentValue !== changes.tableHeaderDataKeyMap.previousValue) {
                this.segeregrateColumns();
        }

        if (changes.pageConfiguration &&
            changes.pageConfiguration.currentValue !== changes.pageConfiguration.previousValue) {
                this.processingData();
        }

        if (changes.tableData &&
            changes.tableData.currentValue !== changes.tableData.previousValue) {
                this.processingData();
                this.setTotalPageDropDown();
        }
    }

    ngAfterViewInit() {
        const self = this;
        if (this.sortSubscriber) {
            this.sortSubscriber.unsubscribe();
        }
        this.sortSubscriber = this.sort.sortChange
            .subscribe((event) => {
                this.allTableData = new Array(this.pageConfiguration.totalElements);
                self.sortChange.emit(event);
            });
        this.loadedOnce = true;
    }

    segeregrateColumns() {
        this.tableHeadersKey = [];
        this.tableHeadersKeyRowAndColSpan = [];
        let i;
        for (i = 0; i < this.tableHeaderDataKeyMap.length; i++) {
            this.displayedColumnsFooter = [this.tableHeaderDataKeyMap[i].dataKey];
            this.tableHeadersKey.push(this.tableHeaderDataKeyMap[i].dataKey);
            if (this.tableHeaderDataKeyMap[i].rowSpan ) {
                this.tableHeadersKeyRowAndColSpan.push(this.tableHeaderDataKeyMap[i].dataKey + 'Row' + i);
            }
            if (this.tableHeaderDataKeyMap[i].colSpan ) {
                this.tableHeadersKeyRowAndColSpan.push(this.tableHeaderDataKeyMap[i].dataKey + 'Col' + i);
            }
        }
        this.setTotalPageDropDown();
    }

    setTotalPageDropDown() {
        let i = 0;
        if (this.pageConfiguration.totalElements) {
            this.totalPages = [];
            const totalPage = Math.trunc(this.pageConfiguration.totalElements / this.pageConfiguration.pageSize);
            for (i = 0; i < totalPage; i++) {
                this.totalPages.push(i + 1);
            }
            if (this.pageConfiguration.totalElements % this.pageConfiguration.pageSize !== 0) {
                this.totalPages.push(i + 1);
            }
        }
    }

    processingData() {
           this.pageSelected = this.pageConfiguration.pageIndex + 1;
           if (this.paginator) {
                this.paginator.pageIndex = this.pageConfiguration.pageIndex;
                this.paginator.pageSize = this.pageConfiguration.pageSize;
                this.paginator.length = this.pageConfiguration.totalElements;
           }
            this.tableDataSource = new MatTableDataSource(this.tableData);
            this.addTotalDataLen();
            this.tableDataSource.sort = this.sort;
    }

    addTotalDataLen() {
        if (this.refreshData) {
            this.allTableData = new Array(this.pageConfiguration.totalElements);
            this.refreshData = false;
        }
        if (this.tableData && this.tableData.length > 0) {
            let i = this.pageConfiguration.pageIndex * this.pageConfiguration.pageSize;
            for (let j = 0; j < this.tableData.length; j++) {
                this.allTableData[i] = this.tableData[j];
                i++;
            }
        }
    }

    onPaginateChange(event) {
        if (event.pageSize !== this.pageConfiguration.pageSize) {
            this.pageConfiguration.pageSize = event.pageSize;
            this.setTotalPageDropDown();
        }
        const pageIndexSize = event.pageIndex * this.pageConfiguration.pageSize;
        let maxSize = pageIndexSize + this.pageConfiguration.pageSize;
        if (maxSize > this.pageConfiguration.totalElements) {
            maxSize = this.pageConfiguration.totalElements;
        }
        this.pageConfiguration.pageIndex = event.pageIndex;
        if (this.allTableData.length !== 0 &&
            this.allTableData[pageIndexSize]
            && this.allTableData[maxSize - 1]) {
                this.pageSelected = this.pageConfiguration.pageIndex  + 1;
                const sliceData = this.allTableData.slice(pageIndexSize,
                    (maxSize));
                this.tableDataSource.data = sliceData;
                return false;
        }
        this.pageChange.emit(event);
        return true;
    }

    onPageDropdownChange() {
        const pageEvent = {
            pageSize: this.pageConfiguration.pageSize,
            pageIndex: this.pageSelected - 1,
            previousPageIndex: this.pageConfiguration.pageIndex,
            length: this.pageConfiguration.totalElements
        };
        this.onPaginateChange(pageEvent);
    }

    onActionClick(elem, action) {
        const objEvent: ActionEventInterFace = {
            action: action,
            data: elem
        };
        this.actionEvent.emit(objEvent);
    }
}
