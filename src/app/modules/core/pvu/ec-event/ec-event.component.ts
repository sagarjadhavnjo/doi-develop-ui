import { RopAuditorApproverComponent } from './../rop/rop-auditor-approver/rop-auditor-approver.component';
// import { IncrementComponent } from './../increment/increment-component/increment.component';
import { EolComponent } from './../extra-ordinary-leave/eol/eol.component';
import { TransferJoiningComponent } from './../transfer/transfer-joining/transfer-joining.component';
import { SuspensionComponent } from './../suspensions/suspension/suspension.component';
import { PVUEventViewComponent } from './../events/pvu-events/event-view/event-view.component';
import { EventComponent } from './../events/pay-event/event/event.component';
import { EventViewPopupService } from './../services/event-view-popup.service';
import { Component, OnInit, Input, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { EmployeeCreationService } from 'src/app/modules/services/pvu/employee-creation.service';
import { BehaviorSubject } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import * as _ from 'lodash';
import { IncrementNewComponentComponent } from '../increment/increment-new-component/increment-new-component.component';
import { EmployeeTypeChangeComponent } from '../employee-type-change/employee-type-change/employee-type-change.component';
import { FixToRegularComponent } from '../fix-to-regular/fix-to-regular/fix-to-regular.component';

@Component({
    selector: 'app-ec-event',
    templateUrl: './ec-event.component.html',
    styleUrls: ['./ec-event.component.css']
})
export class EcEventComponent implements OnInit, OnChanges {

    allEventsList: any[] = [
        // {
        //     transacNumber: 1100100012, eventName: 'Employee Creation', eventEffectiveDate: '04-01-2020',
        //     employeeName: 'Hardik Nenuji', empPayBand: '', employeePayLevel: '', payBandValue: '',
        //     empBasicPay: '', designation: 'Sub Accountant', dateOfAudit: '04-01-2020',
        //     status: 'Approved'
        // }
    ];
    payComissionList: any[] = [
        // {
        //     transacNumber: 1100100013, eventName: 'ROP 1998', eventEffectiveDate: '01-01-1996',
        //     payScale: '6500-200-10500', empBasicPay: 6700, incrementDate: '04-01-1996',
        //     designation: 'Sub Accountant', optionAvailed: '', optionDate: '', dateOfAudit: '04-01-2020',
        //     status: 'PVU_Approved', action: 'View', remarks: ''
        // },
        // {
        //     transacNumber: 1100100014, eventName: 'Regular Increment', eventEffectiveDate: '04-01-1996',
        //     payScale: '6500-200-10500', empBasicPay: 6900, incrementDate: '04-01-1996',
        //     designation: 'Sub Accountant', optionAvailed: '', optionDate: '', dateOfAudit: '04-01-2020',
        //     status: 'DDO Approved', action: 'View', remarks: 'Event name : Increment'
        // }
    ];
    revisedPayComissionList: any[] = [
        // {
        //     transacNumber: 1100100012, eventName: 'ROP 1998', eventEffectiveDate: '04-01-2020',
        //     payScale: '6500-200-10500', empBasicPay: 7300, incrementDate: '04-01-1996',
        //     designation: 'Sub Accountant', optionAvailed: '', optionDate: '', dateOfAudit: '04-01-2020',
        //     status: 'Approved', action: 'View', remarks: ''
        // },
        // {
        //     transacNumber: 1100100013, eventName: 'Regular Increment', eventEffectiveDate: '04-01-1996',
        //     payScale: '6500-200-10500', empBasicPay: 7500, incrementDate: '04-01-1996',
        //     designation: 'Sub Accountant', optionAvailed: '', optionDate: '', dateOfAudit: '04-01-2020',
        //     status: 'DDO Approved', action: 'View', remarks: 'Event name : Increment'
        // }
    ];
    sixthPayComissionList: any[] = [
        // {
        //     transacNumber: 1100100026, eventName: 'ROP 2009', eventEffectiveDate: '01-01-2006',
        //     payBand: '9300-34800', payBandValue: 16930, gradePay: 5400, basicPay: 22330,
        //     incrementDate: '07-01-2006', designation: 'Sub Accountant',
        //     optionAvailed: '', optionDate: '', dateOfAudit: '01-01-2006',
        //     status: 'PVU Approved', action: 'View'
        // },
        // {
        //     transacNumber: 1100100027, eventName: 'Regular Increment', eventEffectiveDate: '07-01-2006',
        //     payBand: '9300-34800', payBandValue: 17600, gradePay: 5400, basicPay: 23000,
        //     incrementDate: '04-01-1996', designation: 'Sub Accountant',
        //     optionAvailed: '', optionDate: '', dateOfAudit: '07-01-2006',
        //     status: 'DDO Approved', action: 'View'
        // }
    ];
    revisedSixthPayComissionList: any[] = [
        // {
        //     transacNumber: 1100100026, eventName: 'ROP 2009', eventEffectiveDate: '01-01-2006',
        //     payBand: '9300-34800', payBandValue: 17950, gradePay: 5400, basicPay: 23350,
        //     incrementDate: '07-01-2006', designation: 'Sub Accountant',
        //     optionAvailed: '', optionDate: '', dateOfAudit: '01-01-2006',
        //     status: 'PVU Approved', action: 'View'
        // },
        // {
        //     transacNumber: 1100100027, eventName: 'Regular Increment', eventEffectiveDate: '07-01-2006',
        //     payBand: '9300-34800', payBandValue: 18660, gradePay: 5400, basicPay: 24060,
        //     incrementDate: '07-01-2006', designation: 'Sub Accountant',
        //     optionAvailed: '', optionDate: '', dateOfAudit: '07-01-2006',
        //     status: 'DDO Approved', action: 'View'
        // }
    ];
    seventhPayComissionList: any[] = [
        // {
        //     transacNumber: 1100100126, eventName: 'ROP 2016', eventEffectiveDate: '01-01-2016',
        //     payLevel: 'LEVEL-9', cellId: 14, basicPay: '77900',
        //     incrementDate: '07-01-2016', designation: 'Sub Accountant',
        //     optionAvailed: '', optionDate: '', dateOfAudit: '01-01-2016',
        //     status: 'PVU Approved', action: 'View'
        // },
        // {
        //     transacNumber: 1100100127, eventName: 'Regular Increment', eventEffectiveDate: '07-01-2016',
        //     payLevel: 'LEVEL-9', cellId: 15, basicPay: '80200',
        //     incrementDate: '07-01-2017', designation: 'Sub Accountant',
        //     optionAvailed: '', optionDate: '', dateOfAudit: '07-01-2016',
        //     status: 'DDO Approved', action: 'View'
        // }
    ];
    revisedSeventhPayComissionList: any[] = [
        // {
        //     transacNumber: 1100100126, eventName: 'ROP', eventEffectiveDate: '01-01-1996',
        //     payLevel: 'LEVEL-9', cellId: 16, basicPay: 82600,
        //     incrementDate: '07-01-2016', designation: 'Sub Accountant',
        //     optionAvailed: '', optionDate: '', dateOfAudit: '01-01-2016',
        //     status: 'PVU Approved', action: 'View'
        // },
        // {
        //     transacNumber: 1100100127, eventName: 'Regular Increment', eventEffectiveDate: '04-01-1996',
        //     payLevel: 'LEVEL-9', cellId: 17, basicPay: 82100,
        //     incrementDate: '07-01-2016', designation: 'Sub Accountant',
        //     optionAvailed: '', optionDate: '', dateOfAudit: '07-01-2016',
        //     status: 'DDO Approved', action: 'View'
        // }
    ];
    transferEventList: any[] = [
        // {
        //     transacNumber: 1100100128, fromLocation: 'DDO Gandhinagar', toLocation: 'DDO Ahemadabad',
        //     designation: 'Sub Accountant', status: 'DDO Approved', action: 'View'
        // }
    ];
    otherEventList: any[] = [
        // {
        //     transacNumber: 1100100126, eventName: 'EOL', fromDate: '01-01-2020', toDate: '05-01-2020',
        //     designation: 'Sub Accountant', basicPay: 4500, status: 'Approved', action: 'View'
        // },
        // {
        //     transacNumber: 1100100127, eventName: 'Suspension', fromDate: '01-05-2020', toDate: '15-05-2020',
        //     designation: 'Sub Accountant', basicPay: 3500, status: 'DDO Approved', action: 'View'
        // }
    ];

    displayedEventsColumns: string[] = ['srNo', 'transacNumber', 'eventName', 'eventDate',
        'empName', 'empPayScalPayBand', 'gradPayPayLevel', 'payGrandValuCellId', 'empBasicPay', 'designation',
        'approvalDate', 'status'];
    displayedTransferEventColumns: string[] = [
        'srNo', 'trnNo', 'designation', 'fromLocation', 'toLocation', 'relievingDate',
        'status', 'action'
    ];
    displayedOtherEventColumns: string[] = [
        'srNo', 'trnNo', 'eventName', 'designation', 'officeName', 'payCommission', 'fromDate',
        'endDate', 'payScale', 'gradePay', 'status', 'action'
    ];

    dataSourceEvents = new MatTableDataSource<any>(this.allEventsList);
    dataSourceTransferEvents = new MatTableDataSource<any>(this.transferEventList);
    dataSourceOtherEvents = new MatTableDataSource<any>(this.otherEventList);

    joiningEventsClm = new BehaviorSubject(['noData']);
    transferEventsClm = new BehaviorSubject(['noData']);
    otherEventsClm = new BehaviorSubject(['noData']);

    @Input() approvedStatus: boolean;
    @Input() action: string;
    @Input() empId: number;
    @Input() loadJoiningDetails: boolean;

    regularSeven = [];
    revisedSeven = [[]];
    regularSix = [];
    revisedSix = [[]];
    regularFifth = [];
    revisedFifth = [[]];

    toggle5: number = 0;
    toggle6: number = 0;
    toggle7: number = 0;
    toggle1: number = 0;
    toggle2: number = 0;

    @ViewChild('eventSort') eventSort: MatSort;

    @ViewChild('transferSort') transferSort: MatSort;

    @ViewChild('otherSort') otherSort: MatSort;

    constructor(
        private toastr: ToastrService,
        private employeeCreationService: EmployeeCreationService,
        private eventViewPopupService: EventViewPopupService,
        public dialog: MatDialog
    ) { }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes.loadJoiningDetails &&
            (changes.loadJoiningDetails.previousValue !== changes.loadJoiningDetails.currentValue)
            && changes.loadJoiningDetails.currentValue) {
            this.loadJoiningPayData(this.approvedStatus);
        }
    }

    ngOnInit() {
        this.setSortAttribute();
    }

    setSortAttribute() {
        this.dataSourceEvents.sort = this.eventSort;
        this.dataSourceTransferEvents.sort = this.transferSort;
        this.dataSourceOtherEvents.sort = this.otherSort;
    }

    requestParam() {
        return {
            'pageIndex': 0,
            'pageElement': 250,
            'jsonArr': [
                {
                    'key': 'in_emp_id',
                    'value': this.empId // Employee Id
                }
            ]
        };
    }
    requestParamRegularRevised(payCommision, regRev) {
        return {
            'pageIndex': 0,
            'pageElement': 250,
            'jsonArr': [
                {
                    'key': 'empId',
                    'value': this.empId + '' // Employee Id
                }, {
                    'key': 'payCommission',
                    'value': payCommision + ''
                }, {
                    'key': 'regOrRevType',
                    'value': regRev
                }
            ]
        };
    }

    loadJoiningPayData(approvedStatus) {
        try {
            if (approvedStatus && this.action === 'view' && this.empId) {
                this.employeeCreationService.getJoiningPayEvents(this.requestParam()).subscribe((res) => {
                    if (res && res['result'] && res['result']['result'] && res['result']['result'].length > 0) {
                        this.joiningEventsClm.next(this.displayedEventsColumns);
                        this.dataSourceEvents = new MatTableDataSource(res['result']['result']);
                        this.setSortAttribute();
                    } else {
                        this.joiningEventsClm.next(['noData']);
                        this.dataSourceEvents = new MatTableDataSource(['noData']);
                    }
                }, (err) => {
                    this.toastr.error(err);
                });
            }
        } catch (error) {
            this.toastr.error(error);
        }
    }

    setStep(val, payCommision) {
        switch (payCommision) {
            case 150:
                if (this.toggle5 !== 1) {
                    this.loadPayCommissionRegularPayData(payCommision);
                    this.loadPayCommissionRevisedPayData(payCommision);
                }
                this.toggle5 = val;
                break;
            case 151:
                if (this.toggle6 !== 1) {
                    this.loadPayCommissionRegularPayData(payCommision);
                    this.loadPayCommissionRevisedPayData(payCommision);
                }
                this.toggle6 = val;
                break;
            case 152:
                if (this.toggle7 !== 1) {
                    this.loadPayCommissionRegularPayData(payCommision);
                    this.loadPayCommissionRevisedPayData(payCommision);
                }
                this.toggle7 = val;
                break;
            case 1:
                if (this.toggle1 !== 1) {
                    this.loadTransferEventData();
                }
                this.toggle1 = val;
                break;
            case 2:
                if (this.toggle2 !== 1) {
                    this.loadOtherEventData();
                }
                this.toggle2 = val;
                break;
        }
    }

    loadPayCommissionRegularPayData(payCommision) {
        try {
            if (this.approvedStatus && this.action === 'view' && this.empId && payCommision) {
                this.employeeCreationService.getPayCommissionEvents(this.requestParamRegularRevised(payCommision, 0))
                    .subscribe((res) => {
                        if (res && res['result'] && res['result']['empEventsRevision']
                            && res['result']['empEventsRevision'].length > 0) {
                            if (res['result']['empEventsRevision'][0]['tabDetails']) {
                                const data = _.cloneDeep(
                                    res['result']['empEventsRevision'][0]['tabDetails'].filter((ele) => {
                                        if (ele['eventDate']) {
                                            const tempDate = ele['eventDate'].trim().split('-');
                                            if (tempDate.length > 1) {
                                                ele['eventDate'] = new Date(Number(tempDate[2]),
                                                    Number(tempDate[1]) - 1, Number(tempDate[0]));
                                            }
                                        }
                                        return true;
                                    }));
                                switch (Number(payCommision)) {
                                    case 150:
                                        this.regularFifth = _.orderBy(data, 'eventDate', 'asc');
                                        break;
                                    case 151:
                                        this.regularSix = _.orderBy(data, 'eventDate', 'asc');
                                        break;
                                    case 152:
                                        this.regularSeven = _.orderBy(data, 'eventDate', 'asc');
                                        break;
                                }
                            }
                        } else {
                            switch (Number(payCommision)) {
                                case 150:
                                    this.regularFifth = [];
                                    break;
                                case 151:
                                    this.regularSix = [];
                                    break;
                                case 152:
                                    this.regularSeven = [];
                                    break;
                            }
                        }
                    }, (err) => {
                        switch (Number(payCommision)) {
                            case 150:
                                this.regularFifth = [];
                                break;
                            case 151:
                                this.regularSix = [];
                                break;
                            case 152:
                                this.regularSeven = [];
                                break;
                        }
                        this.toastr.error(err);
                    });
            }
        } catch (error) {
            this.toastr.error(error);
        }
    }

    loadPayCommissionRevisedPayData(payCommision) {
        try {
            if (this.approvedStatus && this.action === 'view' && this.empId && payCommision) {
                this.employeeCreationService.getPayCommissionEvents(this.requestParamRegularRevised(payCommision, 1))
                    .subscribe((res) => {
                        if (res && res['result'] && res['result']['empEventsRevision']
                            && res['result']['empEventsRevision'].length > 0) {
                            const tempRevised = [];
                            const revisedData = _.sortBy(res['result']['empEventsRevision'], 'revised');
                            revisedData.forEach((ele1) => {
                                const data = _.cloneDeep(ele1['tabDetails'].filter((ele) => {
                                    if (ele['eventDate']) {
                                        const tempDate = ele['eventDate'].trim().split('-');
                                        if (tempDate.length > 1) {
                                            ele['eventDate'] = new Date(Number(tempDate[2]),
                                                Number(tempDate[1]) - 1, Number(tempDate[0]));
                                        }
                                    }
                                    return true;
                                }));
                                tempRevised.push(_.orderBy(data, 'eventDate', 'asc'));
                            });
                            switch (Number(payCommision)) {
                                case 150:
                                    this.revisedFifth = _.orderBy(_.cloneDeep(tempRevised), 'eventDate', 'asc');
                                    break;
                                case 151:
                                    this.revisedSix = _.orderBy(_.cloneDeep(tempRevised), 'eventDate', 'asc');
                                    break;
                                case 152:
                                    this.revisedSeven = _.orderBy(_.cloneDeep(tempRevised), 'eventDate', 'asc');
                                    break;
                            }
                        } else {
                            switch (Number(payCommision)) {
                                case 150:
                                    this.revisedFifth = [[]];
                                    break;
                                case 151:
                                    this.revisedSix = [[]];
                                    break;
                                case 152:
                                    this.revisedSeven = [[]];
                                    break;
                            }
                        }
                    }, (err) => {
                        switch (Number(payCommision)) {
                            case 150:
                                this.revisedFifth = [[]];
                                break;
                            case 151:
                                this.revisedSix = [[]];
                                break;
                            case 152:
                                this.revisedSeven = [[]];
                                break;
                        }
                        this.toastr.error(err);
                    });
            }
        } catch (error) {
            this.toastr.error(error);
        }
    }

    loadTransferEventData() {
        try {
            if (this.approvedStatus && this.action === 'view' && this.empId) {
                this.employeeCreationService.getTransferEvents(this.requestParam()).subscribe((res) => {
                    if (res && res['result'] && res['result']['result'] && res['result']['result'].length > 0) {
                        this.transferEventsClm.next(this.displayedTransferEventColumns);
                        res['result']['result'].forEach((resObj) => {
                            resObj['action'] = 'View';
                        });
                        this.dataSourceTransferEvents = new MatTableDataSource(res['result']['result']);
                        this.setSortAttribute();
                    } else {
                        this.transferEventsClm.next(['noData']);
                        this.dataSourceTransferEvents = new MatTableDataSource(['noData']);
                    }
                }, (err) => {
                    this.toastr.error(err);
                });
            }
        } catch (error) {
            this.toastr.error(error);
        }
    }
    loadOtherEventData() {
        try {
            if (this.approvedStatus && this.action === 'view' && this.empId) {
                this.employeeCreationService.getOtherEvents(this.requestParam()).subscribe((res) => {
                    if (res && res['result'] && res['result']['result'] && res['result']['result'].length > 0) {
                        this.otherEventsClm.next(this.displayedOtherEventColumns);
                        res['result']['result'].forEach((resObj) => {
                            resObj['action'] = 'View';
                        });
                        this.dataSourceOtherEvents = new MatTableDataSource(res['result']['result']);
                        this.setSortAttribute();
                    } else {
                        this.otherEventsClm.next(['noData']);
                        this.dataSourceOtherEvents = new MatTableDataSource(['noData']);
                    }
                }, (err) => {
                    this.toastr.error(err);
                });
            }
        } catch (error) {
            this.toastr.error(error);
        }
    }

    /**
     * @description To get the pay scale, pay band value and pay level based on the pay commission
     * @param element event data
     */
    getPay(element) {
        switch (Number(element.payCommId)) {
            case 150: return element.payScale ? element.payScale : 'NA'; // 5th Pay Commission (150 id)
            case 151: return element.payBandValue ? element.payBandValue : 'NA'; // 6th Pay Commission (151 id)
            case 152: return element.paylevelId ? element.paylevelId : 'NA'; // 7th Pay Commission (152 id)
            default: return 'NA';
        }
    }

    /**
     * @description Tio get the grade pay or cell id based on the pay commission
     * @param element event data
     */
    getGradePayCellId(element) {
        switch (Number(element.payCommId)) {
            // case 150 : return element.payScale ? element.payScale : '';
            case 151: return element.gradePay ? element.gradePay : 'NA'; // 6th Pay Commission (151 id)
            case 152: return element.cellId ? element.cellId : 'NA';  // 7th Pay Commission (152 id)
            default: return 'NA';
        }
    }

    openEventPopup(eventData) {
        const width: string = String(window.innerWidth) + 'px';
        const height: string = String(window.innerHeight) + 'px';
        this.eventViewPopupService.eventID = eventData.empEventId;
        this.eventViewPopupService.eventCode = eventData.eventCode;
        try {
            eventData.eventCode = (!eventData.eventCode && eventData.eventName === 'EOL') ?
                eventData.eventName : eventData.eventCode;
            if (eventData.eventCode) {
                const param = {
                    'eventCode': eventData.eventCode,
                    'trnNo': eventData.trnNo
                };
                this.employeeCreationService.getEventIdByEventDetail(param).subscribe((res) => {
                    if (res && res['result'] && res['status'] === 200) {
                        console.log(res);
                        if (res['result']['eventId']) {
                            this.eventViewPopupService.eventID = +res['result']['eventId'];
                            this.eventViewPopupService.linkMenuID = +res['result']['menuLinkId'];
                            switch (eventData.eventCode) {
                                case 'Promotion':
                                case 'Senior_Scale':
                                case 'Change_of_Scale':
                                case 'Reversion':
                                case 'Promotion_Forgo':
                                case 'Deemed_Date':
                                    this.dialog.open(EventComponent, {
                                        minWidth: width,
                                        maxWidth: width,
                                        height: height
                                    });
                                    break;
                                case 'Higher_Pay_Scale':
                                case 'Tiku_Pay':
                                case 'Assured_Career_Progression':
                                case 'Stepping_Up':
                                case 'Selection_Grade':
                                case 'Shetty_Pay':
                                case 'Career_Advancement_Scheme':
                                case 'Senior_Scale_PVU':
                                case 'Change_of_Scale_PVU':
                                    this.dialog.open(PVUEventViewComponent, {
                                        minWidth: width,
                                        maxWidth: width,
                                        height: height
                                    });
                                    break;
                                case 'Suspension':
                                    this.dialog.open(SuspensionComponent, {
                                        minWidth: width,
                                        maxWidth: width,
                                        height: height
                                    });
                                    break;
                                case 'EOL':
                                    this.dialog.open(EolComponent, {
                                        minWidth: width,
                                        maxWidth: width,
                                        height: height
                                    });
                                    break;
                                case 'Transfer':
                                    this.dialog.open(TransferJoiningComponent, {
                                        minWidth: width,
                                        maxWidth: width,
                                        height: height
                                    });
                                    break;
                                case 'Increment':
                                case 'Event_Increment':
                                    this.dialog.open(IncrementNewComponentComponent, {
                                        minWidth: width,
                                        maxWidth: width,
                                        height: height
                                    });
                                    break;
                                case 'ROP_2009':
                                case 'ROP_2016':
                                    this.dialog.open(RopAuditorApproverComponent, {
                                        minWidth: width,
                                        maxWidth: width,
                                        height: height
                                    });
                                    break;
                                case 'Adhoc_to_Regular':
                                case 'Probationary_to_Regular':
                                case 'Probational_to_Regular':
                                    this.dialog.open(EmployeeTypeChangeComponent, {
                                        minWidth: width,
                                        maxWidth: width,
                                        height: height
                                    }
                                    );
                                    break;
                                case 'Fixpay to Regular':
                                case 'Fixpay_to_Regular':
                                    this.dialog.open(FixToRegularComponent, {
                                        minWidth: width,
                                        maxWidth: width,
                                        height: height
                                    }
                                    );
                                    break;
                            }
                        }
                    } else {
                        this.toastr.error(res['message']);
                    }
                }, (err) => {
                    this.toastr.error(err);
                });
            }
        } catch (error) {
            this.toastr.error(error);
        }

    }
}
