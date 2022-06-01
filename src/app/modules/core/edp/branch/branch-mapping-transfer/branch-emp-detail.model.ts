export class EmployeeBranchDetails {
    empName: string;
    empNo: string;
    formAction: string;
    postName: string;
    mappedBranches: number[];
    branchesToBeMapped: number[] | any;

    /**
     *
     */
    constructor() {}

    fromJson(data: any): EmployeeBranchDetails {
        this.empName = data.empName;
        this.empNo = data.empNo;
        this.formAction = data.formAction;
        this.postName = data.postName;
        this.mappedBranches = data.mappedBranches;
        this.branchesToBeMapped = [];
        return this;
    }
}
