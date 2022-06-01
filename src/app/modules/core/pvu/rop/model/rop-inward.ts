export class InwardListModel {
    transNo: string | '';
    inwardDate: string | '';
    inwardNumber: string | '';
    eventName: string | '';
    employeeNo: number | '';
    employeeName: string | '';
    designation: string | '';
    retirementDate: string | '';
    employeeType: string | '';
    forwardDate: string | '';
    officeName: string | '';
    isReceived: boolean | '';
}


export class InwardSearchFormModel {
    dateCreatedTo: string | '';
    dateCreatedFrom: string | '';
    eventsName: number;
    employeeNo: number;
    employeeName: string | '';
    designation: number;
    panNo: string | '';
    district: number;
    cardexNo: number;
    ddoNo: number;
    retirementDate: string | '';
    caseNo: string | '';
    class: number;
    empType: number;
    dateInwardFrom: string | '';
    dateInwardTo: string | '';
}
