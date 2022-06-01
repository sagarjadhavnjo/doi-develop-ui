import { FormActions, ToFromEmpDetails } from './branch-mapping-transfer';
export class BranchDetails {
    formAction: FormActions;
    tedpBrDtlId: number;
    tedpBrHdrId: number;
    trnNo: string;
    requestType: number;
    fromPouId: number;
    toPouId: number;
    branchesToBeMapped: number[];
    fromUserBranch: ToFromEmpDetails;
    toUserBranch: ToFromEmpDetails;
    createdDate: string;

    /**
     *
     */
    constructor() {}

    fromJson(data: any): BranchDetails {
        this.formAction = data.formAction;
        this.tedpBrDtlId = data.tedpBrDtlId;
        this.tedpBrHdrId = data.tedpBrHdrId;
        this.trnNo = data.trnNo;
        this.requestType = data.requestType;
        this.fromPouId = data.fromPouId;
        this.toPouId = data.toPouId;
        this.branchesToBeMapped = data.branchesToBeMapped;
        this.fromUserBranch = data.fromUserBranch;
        this.toUserBranch = data.toUserBranch;
        return this;
    }
}
