export class JpaMasterPolicyBase {
    public policyTypeId: number;
    public policyId: number;
    public beneficiaryNum: number;
    public schemeName: string;
    public policyStatusId: number;
}

export class JpaMasterPolicy extends JpaMasterPolicyBase {
    public createdBy: number;
    public createdDate: string;
    public createdByPost: number;
    public updatedByPost: number;
    public activeStatus: number;
    public updatedBy: number;
    public updatedDate: string;
    public curMenuId: string;
    public policyNum: number;
    public schemeId: number;
    public endorsementSrNo: number;
    public policyStartDate: string;
    public policyEndDate: string;
    public premiumAmount: number;
    public deathClaimAmt: number;
    public disable50ClaimAmt: number;
    public disable100ClaimAmt: number;
    public policyStatus: number;
    public endrRenewReason: number;
    public referenceNo: string;
    public referenceDate: string;
}