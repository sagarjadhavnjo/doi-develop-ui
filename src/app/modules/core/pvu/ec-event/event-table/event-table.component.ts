import {
    Component, OnInit, Input, OnChanges, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, SimpleChanges
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
    selector: 'app-event-table',
    templateUrl: './event-table.component.html',
    styleUrls: ['./event-table.component.css']
})
export class EventTableComponent implements OnInit, OnChanges {

    @Input() data = [];
    @Input() payCommision: number = 1;
    @Input() tableType: boolean = true;
    @Output() viewEvent: EventEmitter<any> = new EventEmitter();
    matTableColumn: string[];
    footerColumn: string[] = ['srNo'];
    matTableDataSource = new MatTableDataSource();

    @ViewChild('sortTab') sortTab: MatSort;

    constructor() { }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes.data.previousValue !== changes.data.currentValue) {
            this.setColumnNameForPayCommision();
            this.matTableDataSource = new MatTableDataSource(this.data);
            this.matTableDataSource.sort = this.sortTab;
        }
    }

    ngOnInit() {
        this.setColumnNameForPayCommision();
    }

    setColumnNameForPayCommision() {
        switch (Number(this.payCommision)) {
            case 150:
                // if (this.tableType) {
                    this.matTableColumn = ['srNo', 'transacNumber', 'eventName',
                        'eventDate', 'payScaleValue', 'empBasicPay', 'dateOfNextIncrement', 'designation',
                        'optionOpted', 'optionDate', 'approvalDate', 'status', 'action'];
                // } else {
                    // this.matTableColumn = ['srNo', 'transacNumber', 'eventName', 'eventDate', 'payScaleValue',
                    //     'empBasicPay', 'dateOfNextIncrement', 'designation', 'optionOpted',
                    //     'optionDate', 'approvalDate', 'status', 'action'];
                // }
                break;
            case 151:
                // if (this.tableType) {
                    this.matTableColumn = ['srNo', 'transacNumber', 'eventName', 'eventDate', 'payBandDisValue',
                        'payBandValue', 'gradePayValue', 'empBasicPay', 'dateOfNextIncrement', 'designation',
                        'optionOpted', 'optionDate', 'approvalDate', 'status', 'action'];
                // } else {
                //     this.matTableColumn = ['srNo', 'transacNumber', 'eventName', 'eventDate',
                //         'payBandDisValue', 'payBandValue', 'gradePayValue', 'empBasicPay', 'dateOfNextIncrement',
                //         'designation', 'optionOpted', 'optionDate', 'approvalDate', 'status', 'action'];
                // }
                break;
            case 152:
                // if (this.tableType) {
                    this.matTableColumn = ['srNo', 'transacNumber', 'eventName',
                        'eventDate', 'payLevelValue', 'cellIdVal', 'empBasicPay', 'dateOfNextIncrement', 'designation',
                        'optionOpted', 'optionDate', 'approvalDate', 'status', 'action'];
                // } else {
                //     this.matTableColumn = ['srNo', 'transacNumber', 'eventName', 'eventDate',
                //         'payLevelValue', 'cellIdVal', 'empBasicPay', 'dateOfNextIncrement', 'designation',
                //         'optionOpted', 'optionDate', 'approvalDate', 'status', 'action'];
                // }
                break;
            default:
                this.matTableColumn = ['noData'];
                break;
        }
    }

    viewEvents(eventData) {
        // console.log(eventData);
        this.viewEvent.emit(eventData);
    }
}
