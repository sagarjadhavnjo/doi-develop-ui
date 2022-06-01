export class DataConstantClass {
    public static readonly abc = 'test';
}
// export const dataConstant = {
//     userData : [{id: 1, Name: 'test1'}, {id: 2, Name: 'test2'}],
// };
export const DataConst = {
    PAGINATION_ARRAY: [5, 10, 20, 50, 100, 200],
    PAGE_ELEMENT: 250,
    RECORDS_PER_PAGE: 'Records Per Page',
    CONDITIONAL_API_CONST: 'ConditionCheck',
    PWD_ENCRYPT_KEY: 'IFMS@123',
    SESSION_EXP_POPUP_TIME: 59,
    DELETE_ALERT: {
        DELETE_RECORD: 'Are you sure you want to delete record?',
        TITLE: 'Are you sure?',
        TEXT: 'You want to delete this!',
        CONFIRM_BTN_TEXT: 'Yes, delete it!',
        CONFIRM_BTN_COLOR: '#356a94',
        CANCEL_BTN_TEXT: 'No, keep it',
        CANCEL_BTN_COLOR: '#d33',
        SUCCESS_TITLE: 'Deleted!',
        ERROR_TITLE: 'Error!'
    },
    INCREMENT: {
        WF_APPROVE_CODE: '1007',
        WF_REJECT_CODE: '1016',
        WF_FORWORD_PVU_CODE: '1014',
        WF_AUTHORIZE_CODE: '1019',
        WF_RETURN_CODE: '1013',
        APPROVER_CUR_WF_ROLE: 3,
        CREATOR_WF_ROLE_CODE: '1000',
        VERIFIER_WF_ROLE_CODE: '1001',
        APPROVER_WF_ROLE_CODE: '1002',
        AUDITOR_WF_ROLE_CODE: '1005',
        PVU_APPROVER_WF_ROLE_CODE: '1006',
    },
    OFFICE_TYPE: {
        DDO_OFFICE : 'Drawing and Disbursing office (DDO)',
        HOD_OFFICE : 'Head of Department (HOD)',
        AD_OFFICE : 'Administrative Department',
        FD_OFFICE : 'Finance Department',
        CO_OFFICE : 'Controlling office (CO)'
    }
};


export const ConfirmDialog = {
    Yes: 'Yes',
    No: 'No',
    Save: 'Save',
    Cancel: 'Cancel'
};

export const DateLocaleAndFormat = {
    Locale: {
        EnUS: 'en-US'
    },
    Format: {
        MMddyyyy: 'MM/dd/yyyy',
        DDMMMYYYYHHMMSSA: 'dd-MMM-yyyy hh:mm:ss a',
        DDMMMYYYY: 'dd-MMM-yyyy',
        ddMMyyyy: 'dd/MM/yyyy'
    }
};

