
export const COMMON_MESSAGES = {
    VIEW_REMARKS_LABEL: 'DDO Office',
    VIEW_PVU_REMARKS_LABEL: 'PVU Office'
};
export const COMMON_APIS = {
    DESIGNATION: 'masters/designations/201',
    COMMON_ERROR_MESSAGES: {
        WF_USER_LIST_EMPTY: 'Workflow user not mapped!',
    },
    ALL_COMMISSION: 'pvu/get-all-commissions',
    WORKFLOW: {
        GET_ASSIGN_OPT: 'common/workflow/wfnextactions/201',
        GET_EMP_DETAIL: 'pvu/employe/common/response',
        GET_USERS: 'common/workflow/users/wfactionid/201',
        GET_HISTORY: 'common/workflow/history/wfhistory/201',
        GET_PVU_HISTORY: 'common/workflow/history/pvuwfhistory/201',
        SUBMIT_CODE: '/201',
        GET_PVUOFFICE: {
            Senior_Scale_PVU: 'pvu/senior-scale/getpvuoffice/201',
            Change_of_Scale_PVU: 'pvu/csevent/getpvuoffice/201',
            Tiku_Pay: 'pvu/tikupay/getpvuoffice/201',
            Selection_Grade: 'pvu/selectiongrade/getpvuoffice/201',
            Shetty_Pay: 'pvu/employeshettypay/getpvuoffice/201',
            Higher_Pay_Scale: 'pvu/employehigherpayscaleevent/getpvuoffice/201',
            Assured_Career_Progression: 'pvu/assured-career-progression/getpvuoffice/201',
            Stepping_Up: 'pvu/event/steppingup/getpvuoffice/201',
            Career_Advancement_Scheme: 'pvu/careeradvancevent/getpvuoffice/201'
        },
        CODES: {
            WF_APPROVE_CODE: '1007',
            WF_REJECT_CODE: '1016',
            WF_FORWORD_PVU_CODE: '1014',
            WF_AUTHORIZE_CODE: '1019',
            WF_RETURN_CODE: '1023',
            WF_PULLBACK_CODE: '1017',
            APPROVER_CUR_WF_ROLE: 3,
            CREATOR_WF_ROLE_CODE: '1000',
            VERIFIER_WF_ROLE_CODE: '1001',
            APPROVER_WF_ROLE_CODE: '1002',
            AUDITOR_WF_ROLE_CODE: '1005',
            PVU_APPROVER_WF_ROLE_CODE: '1006',
            PVU_APPROVER_CLASS_1_WF_ROLE_CODE: '1007',
            PVU_VERIFIER_WF_ROLE_CODE: '1018',
            WF_VERIFY_CODE: '1004'
        },
        PVU_TRANSFER_MENU_ID: 48, // MenuId value for Transfer to fetch actions
        SUBMIT: {
            SUSPENSION: 'pvu/employe-suspension/insertEmployeeSuspensionItr',
            INCREMENT: 'pvu/employee-increment/insertIncrementItr',
            EOL: 'pvu/employeeeoleave/insertExtraOrdinaryLeaveItr',
            Reversion: 'pvu/pvuemployereversion/insertReversionItr',
            Promotion: 'pvu/promotion/itr-insert',
            Deemed_Date: 'pvu/deemed-date/itr-insert',
            Promotion_Forgo: 'pvu/employe-forgo-event/insertEmployeeItr',
            Senior_Scale: 'pvu/senior-scale/itr-insert',
            Senior_Scale_PVU: 'pvu/senior-scale/itr-insert',
            Change_of_Scale: 'pvu/csevent/itr-insert',
            TRANSFER: 'pvu/transfer/itr-insert',
            TRANSFER_JOINING: 'pvu/transfer/itr-insert',
            Change_of_Scale_PVU: 'pvu/csevent/itr-insert',
            Tiku_Pay: 'pvu/tikupay/itr-insert',
            Selection_Grade: 'pvu/selectiongrade/insertSgItr',
            Shetty_Pay: 'pvu/employeshettypay/spevent/itr-insert',
            Higher_Pay_Scale: 'pvu/employehigherpayscaleevent/itr-insert',
            Assured_Career_Progression: 'pvu/assured-career-progression/itr-insert',
            Stepping_Up: 'pvu/event/steppingup/itr-insert',
            Career_Advancement_Scheme: 'pvu/careeradvancevent/itr-insert',
        }
    },
    ATTACHMENT: {
        GET_ATTACHMENT_DATA: 'common/attachment/301',
        UPLOAD: '/upload',
        GET_ATTACHMENT: '/get-attachment',
        DOWNLOAD: 'common/attachment/filenet/download/901',
        VIEW: 'common/attachment/filenet/imagedownload/901',
        DELETE: '/delete-attachment'
    },
    VIEWCOMMENTS: 'pvu/employeeeoleave/generate-eol-comments-prints/101'
};

export const SENIOR_SCALE_EVENT_ERRORS = {
    EMP_NO_MAX: 'Employee number should be of 10 digits!',
    EMP_NO: 'Please fill Employee Number',
    PAY_COMMISSION: 'Please select Pay Commission',
    ORDER_NO: 'Please Enter Order Number',
    ORDER_DATE: 'Please Enter Order Date',
    PAY_BAND: 'Please Select Pay Band',
    GRADE_PAY: 'Please Select Grade Pay',
    GRADE: 'Please Select Grade Pay',
    PAY_LEVEL: 'Please Select Pay Level',
    PAY_SCALE: 'Please Select Pay Scale',
    CELL_ID: 'Please Select Cell Id',
    INCREMENT_AMT: 'Please Select Option',
    OPTION_AVAILED: 'Please Select Option availed or Not',
    OPTION_DATE: 'Please Select Option date',
    OPTION_TYPE: 'Please Select Type',
    BENEFIT_EFFECTIVE_DATE: 'Please select Benefit Effective Date',
    DATE_OF_NEXT_INCREMENT: 'Please Select Date of Next Increment',
    EVENT_ORDER_DATE: 'Please Select Event Order Date',
    CLASS: 'Please Select Class',
    DESIGNATION: 'Please Select Designation',
    PAY_BAND_VALUE: 'Please Select Pay Band Value',
    PAY_BAND_MIN_MAX: 'Please Enter between selected pay band',
    BASIC_PAY: 'Please Select Basic Pay',
    EVENT_ORDER_NUMBER: 'Please Select Event Order Number',
    DATE_OF_JOINING: 'Please Select Date of Joining',
    EVENT_EFFECTIVE_DATE: 'Please Select Event Effective Date',
    OFFICE_NAME: 'Please Enter Office Name',
    SCALE: 'Please Select Scale',
    REMARKS: 'Please Enter Remarks',
    BASIC_PAY_MIN: 'Please enter basic pay greater than ',
    BASIC_PAY_MAX: 'Please enter basic pay lesser than ',
    NOTIONAL_FROM_DATE: 'Please Select From Date',
    NOTIONAL_TO_DATE: 'Please Select To Date'
};
export const SENIOR_SCALE_APIS = {
    SEVENTH_BASIC_PAY: 'pvu/seven/basic/payPVU',
    PAY_MASTERS: 'pvu/pay-masters',
    PVU_CAL_SEVEN_BASIC: 'pvu/seven/higherbasic/payPVU',
    EMPLOYEE_DETAILS: 'pvu/get-regular-common-detail',
    EMPLOYEE_DETAILS_BY_EVENT_ID: 'pvu/current-details',
    CHECK_FOR_ELIGIBILITY: 'pvu/check-employee-eligible',
    EMPLOYEE_EXAM_DETAILS: 'pvu/get-employee-exams'
};
