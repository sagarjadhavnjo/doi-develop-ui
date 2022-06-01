export const EdpDataConst = {
    PAGINATION_ARRAY: [5, 10, 20, 50, 100, 200],
    EDP_ATTACHMENT_FILE_TYPE: ['jpg', 'jpeg', 'pdf', 'png'],
    DEPARTMENT_LEVEL_ATTACHMENT: 'Department level Attachments',
    DEPARTMENT_LEVEL_ATTACHMENT_TYPEID: 76,
    TO_LEVEL_ATTACHMENT: 'TO level Attachments',
    TO_LEVEL_ATTACHMENT_TYPEID: 77,
    PATTERN: {
        // EMAIL: '[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}',
        // EMAIL: '(?!.*?\\.\\.)[a-zA-Z0-9.\\-_]{1,}[a-zA-Z0-9]{1,}@[(gujarat.gov|gov)]{3,}[.]{1}[(in)]{2,}',
        EMAIL: '(?!.*?\\.\\.)[a-zA-Z0-9.\\-_]{1,}[a-zA-Z0-9]{1,}@?(gujarat.gov.in|gov.in)$',
        MOBILE: '^[6-9][0-9]{9}$',
        ALPHABET: '^[a-zA-Z]$',
        STATION: '[a-zA-Z ]*'
    },
    OFFICE_ID: 23,
    ROLE_PERM_ID: 1,
    STATUS_ID: 1,
    MENU_ID: 45,
    HEADER_ID: 359,
    DELETE_RECORD_KEY: 0,
    ACTIVE_STATUS_ID: 1,
    MAX_FILE_SIZE: 8192,
    MAX_FILE_SIZE_FOR_COMMON: 2048,
    MAX_FILE_SIZE_FOR_BUDGET: 10240,
    AD_ID: 'Administrative Department',
    OFFICE_DDO_ID: 'Drawing and Disbursing office (DDO)',
    DDO_ID: 'DDO',
    NON_DDO_ID: 'Non DDO',
    FD_ID: 'Finance Department',
    PAO_ID: 'Pay & Account Office',
    PVU_ID: 'Pay Verification Unit, Self',
    DDO_TYPE: 'Panchayat',
    HOD_ID: 'Head of Department (HOD)',
    DDO_OFFICE_TYPE: 'Drawing and Disbursing office (DDO)',
    STATE_ID: 'State Level',
    DISTRICT_ID: 'District Level',
    TALUKA_LEVEL_ID: 'Taluka Level',
    CURRENT_WORK_FLOW_ID: 1,
    CURRENT_WORK_FLOW_ROLE_ID: 1,
    POST_TRN_ID: 3,
    POST_TRNSF_EMP: 1,
    POST_TRNSF_VACANT: 2,
    POST_TYPE_PRIMARY: 2,
    POST_TYPE_SECONDARY: 1,
    STATUS_DRAFT: 'DRAFT',
    STATUS_SUBMITTED: 'SUBMITTED',
    POSTTYPEID: 'Primary',
    OFFICE_HOD_ID: 54,
    MENU_CODE_UPDATE_OFF: 'UO',
    POST_TRANSFER: 'Post Transfer',
    RIGHTS_MAPPING: 'Rights Mapping',
    POST_CREATION: 'Post Creation',
    ADD_DESIGNATION: 'Add Designation',
    UPDATE_DESIGNATION: 'Update Designation',
    CREATE_NEW_OFFICE: 'Create New Office',
    MENU: {
        LISTING: 36,
        UPDATE_DESIGNATION_LIST: 29,
        POST_TRANSFER: 35,
        RIGHTS_MAPPING: {
            TRANSACTION: 31,
            LISTING: 32
        },
        POST_HISTORY: 39,
        OFFICE_CREATION_MENU_ID: 20,
        ADD_DESIGNATION_MENU_ID: 26,
        UPDATE_DESIGNATION_MENU_ID: 28
    },
    MAX_FILE_SIZE_TO_PAO_OFFICE_CREATION: 3072,
    MAX_FILE_SIZE_HOD_OFFICE_CREATION: 5120,
    POST_CREATION_MENU_ID: 39,
    UPDATE_OFFICE_MENU_ID: 75,
    OFFICE_DIVISION_DAT: 'DAT',
    ACCOUNT_AND_TREASURY_OFFICE_1: 'Directorate of Accounts & Treasury',
    ACCOUNT_AND_TREASURY_OFFICE_2: 'Directorate of Accounts & Treasuries',
    USER_TYPE_HOD: 'HOD',
    USER_TYPE_TO_PAO: 'TO/PAO',
    USER_TYPE_EDP: 'EDP',
    OFFICE_DATA_FOR_TREASURY: 2,
    OFFICE_DATA_FOR_HOD: 2,
    OFFICE_TYPE_ID_FOR_DDO: 71,
    SUB_OFFICE_TYPE_FOR_DDO: 405,
    NAVIAGTE_FROM_UPDATION_LIST: 2,
    OFFICE_STATUS_ACTIVE: 205,
    INACTIVE_STATUS: 'inactive',
    TRANSFER_STATUS: 'transfer',
    CANCEL_STATUS: 'cancel',
    TRANSFER_NAME_STATUS: 'transfer',
    ACTIVE_STATUS: 'active',
    CANCEL_WF_STATUS: 'Cancelled',
    REJECT_WF_STATUS: 'Rejected',
    APPROVE_WF_STATUS: 'Approved',
    PRV_OFFICE_STATUS_INACTIVE: 282,
    NON_DDO_TYPE_ID: 69,
    DUPLICATE_TRANSACTION_WARNING: 'The request has been already Initiated !',
    FILL_ALL_DETAILS_WARNING: 'Please Fill All The Detail.',
    USERTYPE_DAT_SUPER_ADMIN: 45,
    USERTYPE_JD: 23,
    WF_CREATOR_ROLE: 1,
    WF_VERIFIER_ROLE: 2,
    WF_APPROVER_ROLE: 3,
    PAO_SUB_OFFICE_TYPE: 400,
    TREASURY_TYPE_TO_OFFICE_ID: 63,
    TREASURY_TYPE_PAO_OFFICE_ID: 65,
    ADMINISTRATIVE_DEPARTMENT_OFFICE_TYPE_ID: 52,
    HOD_OFFICE_TYPE_ID: 54,
    DDO_OFFICE_TYPE_ID: 71,
    MAT_SELECT_NULL_VALUE: '-- Select --',
    BRANCH_REQUEST_TYPE: 1096,
    BRANCH_TYPE_ID: 507,
    BRANCH_STATUS: 'Approved',
    BRANCH_MENU_CODE: 'BRC',
    IS_TREASURY: 2,
    IS_PO_USER: 400,
    GAD_DEPT_ID: 16
};

export enum EDPDialogResult {
    YES = 'yes',
    NO = 'no'
}

export const CONFIRM_DIALOG_RESULT = {
    CLOSE: 'Do you Want to Proceed ?',
    WIDTH: '360px'
};

export const DOCUMENT_TYPE = {
    EXCEL: 'application/vnd.ms-excel',
    PDF: 'application/pdf'
};

export const EDP_REPORTS_ROUTES = {
    DASHBOARD: 'dashboard'
};

export const EDP_REPORTS = {
    PAGE_SIZE_OPTIONS: [5, 10, 25],
    PAGE_ELEMENTS: 250,
    RIGHTS_MAPPING: {
        DISPLAY_COLS_HEADER: [
            'srNo',
            'trnNo',
            'trnDate',
            'district',
            'ddoNo',
            'cardexNo',
            'ddoOffice',
            'empNo',
            'empName',
            'postName',
            'lyingWith',
            'status',
            'wfStatus'
        ],
        DISPLAY_COLS_FOOTER: ['srNo']
    },
    POST_TRANSFER: {
        DISPLAY_COLS_HEADER: [
            'srNo',
            'trnNo',
            'trnDate',
            'district',
            'ddoNo',
            'cardexNo',
            'ddoOffice',
            'postName',
            'transferFrom',
            'transferTo',
            'lyingWith',
            'trnStatus',
            'wfStatus'
        ],
        DISPLAY_COLS_FOOTER: ['srNo']
    },
    POST_HISTORY: {
        DISPLAY_COLS_HEADER: ['srNo', 'postName', 'empNumber', 'empName', 'fromDate', 'toDate'],
        DISPLAY_COLS_FOOTER: ['srNo']
    },

    OFFICE_CREATION: {
        DISPLAY_COLS_HEADER: [
            'srNo',
            'trnNo',
            'trnDate',
            'uniqueId',
            'district',
            'ddoNo',
            'cardexNo',
            'officeName',
            'designationOfDdo',
            'department',
            'hod',
            'officeType',

            'ddoType',
            'pvu',
            'isCo',
            'coOfficeName',
            'mappedTo',
            'startDate',
            'endDate',
            'officeStatus',
            'billType',
            'lyingWith',
            'trnStatus',
            'workFlowStatus'
        ],
        DISPLAY_COLS_FOOTER: ['srNo'],

        BILL_DETAILS: {
            HEADING: 'Bill Details',
            DISPLAY_COLS_HEADER: ['srNo', 'billName'],
            DISPLAY_COLS_FOOTER: ['srNo']
        }
    }
};

export const REPORTS_NAMES = {
    RIGHTS_MAPPING: 'RIGHTS_MAPPING',
    POST_TRANSFER: 'POST_TRANSFER',
    POST_HISTORY: 'POST_HISTORY',
    OFFICE_CREATION: 'OFFICE_CREATION'
};

export const REPORT_ACTION = {
    VIEW: 'VIEW',
    PDF: 'PDF',
    EXCEL: 'EXCEL'
};

export const EDP_BRANCH = {
    BRANCH: {
        PAGE_SIZE_OPTIONS: [5, 10, 25],
        CONFIRM_DIALOG_WIDTH: '360px',
        PAGE_ELEMENTS: 250,
        BRANCH_MAPPING_TRANSFER: {
            DISPLAY_COLS_HEADER: [
                'position',
                'employeeNo',
                'employeeName',
                'postName',
                'branch',
                'branchesToBeMapped',
                'mappedBranch'
            ],
            DISPLAY_NO_DATA_ROW: ['noData'],
            DISPLAY_COLS_FOOTER: [],

            LISTING: {
                DISPLAY_COLS_HEADER: [
                    'position',
                    'refNo',
                    'refDate',
                    'districtName',
                    'ddoNo',
                    'cardexNo',
                    'ddoOffice',
                    'requestType',
                    'fromEmployeeNo',
                    'fromPostName',
                    'toEmployeeNo',
                    'toPostName',
                    'lyingWith',
                    'status',
                    'action'
                ],
                DISPLAY_NO_DATA_ROW: ['noData']
            }
        },
        BRANCH_MAPPING_FROM: {
            DISPLAY_COLS_HEADER: [
                'position',
                'employeeNo',
                'employeeName',
                'postName',
                'branch',
                'toBeTransferred',
                'mappedBranch'
            ],
            DISPLAY_NO_DATA_ROW: ['noData'],
            DISPLAY_COLS_FOOTER: []
        },
        BRANCH_MAPPING_TO: {
            DISPLAY_COLS_HEADER: ['position', 'employeeNo', 'employeeName', 'postName', 'branch'],
            DISPLAY_NO_DATA_ROW: ['noData'],
            DISPLAY_COLS_FOOTER: []
        },

        MAPPING_INFO: {
            DISPLAY_COLS_HEADER: ['srNo', 'name'],
            DISPLAY_NO_DATA_ROW: ['noData'],
            LABELS: {
                EMP_NO: 'Employee No. ',
                EMP_NAME: 'Employee Name',
                POST_NAME: 'Post Name'
            }
        },
        MENU_ACCESS_INFO: {
            DISPLAY_COLS_HEADER: ['srNo', 'menu', 'rolePrm', 'wfRoles'],
            DISPLAY_NO_DATA_ROW: ['noData']
        },
        PAGE_ACTION: {
            NEW: 'new',
            EDIT: 'edit',
            VIEW: 'view'
        },
        BRANCH_ACTIONS: {
            MAPPING: 611,
            TRANSFER: 612
        }
    },

    STORAGE_SERVICE_KEYS: {
        USER_OFFICE: 'userOffice'
    }
};
