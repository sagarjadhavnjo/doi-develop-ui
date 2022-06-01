interface PostTransfer {
    edpUsrPoTrnsDetailDto: EdpUsrPoTrnsDetailDto[];
    formAction: FormActions;
    menuCode: string;
    edpUsrPoTrnsHeaderId: number;
    trnNo: string;

    wfRequestDto?: WfRequestDto;
    curMenuId?: number;
    wfInRequest?: boolean;
    wfSubmit?: boolean;

    hasObjection?: boolean;
    objectionRemarks?: string;
}

export interface WfRequestDto {
    menuId: number;
    officeId: number;
    postId: number;
    pouId: number;
    userId: string;
}
interface ToUser extends PostTransfer {
    toUserId: number;
}

interface ToEmployee extends PostTransfer {
    toEmpId: number;
}

export enum FormActions {
    SUBMITTED = 'SUBMITTED',
    DRAFT = 'DRAFT'
}

export interface EdpUsrPoTrnsDetailDto {
    postOfficeId: number;
    willBePrimary: boolean;
}

export interface WorkFlowDetailDto {
    curMenuId: number;
    officeId: number;
    postId: number;
    pouId: number;
    userId: string;
    wfRoleIds: [];
}

// tslint:disable-next-line: no-empty-interface
export interface PostTransferVacantToUser extends ToUser {}

// tslint:disable-next-line: no-empty-interface
export interface PostTransferVacantToEmployee extends ToEmployee {}

export interface PostTransferToUser extends ToUser {
    fromUserId: number;
}

export interface PostTransferToEmployee extends ToEmployee {
    fromUserId: number;
}

export interface PostTransferToVacant extends PostTransfer {
    fromUserId: number;
}

export interface EditViewPostTransfer {
    edpUsrTrnHeaderId: number;
    from: boolean;
    id: number;
    lkPoOffId: number;
    officeId: number;
    userCode: string;
    userId: number;
}
