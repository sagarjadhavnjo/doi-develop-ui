import { PASSWORD_APIS } from './../../password-module/index';
export const APIConst = {
    DDO_OFFICE: {
        HOD: {
            OFFICE_DETAILS: 'edp/msoffice/officedetails/201',
            EDIT_OFFICE_DETAILS: 'edp/msoffice/301',
            EMPLOYEE_DATA: 'edp/employee/301',
            CARDEX_NO: 'edp/msoffice/getCardexNo/301',
            CREATE_OFFICE: 'edp/msoffice/101',
            UPDATE_OFFICE: 'edp/msoffice/401',
            UPDATE_OFFICE_UO: 'edp/msoffice/update/401',
            SAVE_SUB_OFFICE: 'edp/mssuboffice/101',
            LOAD_SUB_OFFICE: 'edp/mssuboffice/301',
            UPDATE_SUB_OFFICE: 'edp/mssuboffice/401',
            HOD_LIST: 'edp/mshod/gethod/301',
            UPDATE_OFFICE_DELETE: 'edp/edpofficeitr/501'
        },
        ATTACHMENT: {
            ATTACHMENT_LIST_NAME: 'edp/attachment/addNewDesignation/904',
            MANDATORY_ATTACHMENT_FOR_NONDAT: 'edp/attachment/addNewDesignation/904',
            LOAD_ATTACHMENT_LIST: 'edp/attachment/office/903',
            LOAD_UPDATE_OFFICE_ATTACHMENT_LIST: 'edp/attachment/getattach/301',
            UPLOAD_ATTACHMENT: 'edp/attachment/office/101',
            UPLOAD_OFFICE_UPDATE_ATTACHMENT: 'edp/attachment/office/upload/101',
            DOWNLOAD_ATTACHMENT: 'edp/attachment/office/901',
            DELETE_ATTACHMENT: 'edp/attachment/office/902',
            OFFICE_ATTACHEMT_LIST: {
                CREATE: 'edp/attachment/office/904',
                UPDATE: 'edp/attachment/addNewDesignation/904'
            }
        },
        OFFICE_LIST: 'edp/edpofficeitr/601',
        UPDATE_OFFICE_LIST: 'edp/edpofficeitr/update/601',
        OFFICE_DELETE: 'edp/msoffice/officedetails/901',
        DEPARTMENT_WITH_HOD: 'edp/msoffice/departmentswithhod/201',
        LIST_OF_BILLS: 'edp/msbill/allbills/301',
        CHECK_DUPLICATE_DDO: 'edp/msoffice/office/checkDdoNo/201',
        CHECK_DUPL_TREASURY_OFF_NAME: 'edp/mstreasury/checktreasury/301',
        FINAL_APPROVAL: 'edp/msoffice/approve/401',
        OFFICE_TRANSFER: 'edp/msoffice/officeByDistrictfilter/201'
    },
    DDO_SUB_OFFICE: {
        SUB_OFFICE_LIST: 'edp/mssuboffice/201',
        SUB_OFFICE_DELETE: 'edp/mssuboffice/501'
    },
    DDO_OFFICE_UPDATE: {
        OFFICE_DETAILS: 'edp/msoffice/getoffice/301',
        OFFICE_SUMMARY_DETAILS: 'edp/edpofficeitr/getbytrnno/301',
        OFFICE_BILL_MAPPING: 'edp/mstreasury/treasury/301'
    },
    OFFICE_SUMMARY: {
        OFFICE_SUMMARY_LIST: 'edp/edpofficeitr/office/601',
        OFFICE_SUMMARY_UPDATE_LIST: 'edp/edpofficeitr/office/602',
        OFFICE_SUMMARY_DETAIL_LIST: 'edp/edpofficeitr/officedetail/602'
    },
    POST: {
        POST_DETAILS: 'edp/mspost/officedetails/201',
        POST_COUNT: 'edp/mspost/postcount/201',
        SAVE_POST: 'edp/mspost/101',
        UPLOAD_ATTACHMENT: 'edp/attachment/post/101',
        LOAD_ATTACHMENT_LIST: 'edp/attachment/post/302',
        DOWNLOAD_ATTACHMENT: 'edp/attachment/post/901',
        DELETE_ATTACHMENT: 'edp/attachment/post/902',
        POST_LIST: 'edp/mspost/601',
        POST_GET_DETAILS: 'edp/mspost/301',
        UPDATE_POST: 'edp/mspost/401',
        DELETE_POST: 'edp/mspost/501',
        AVAILABEL_VACANT_POST: 'edp/mspost/avilablevacantpost/201'
    },
    POST_CREATE: {
        LIST: {
            HEADER_SUBMIT_POPUP: 'edp/alias/wf/commonHeader/201',
            GET_STATUS: 'edp/posttransfer/searchStatus/301'
        },
        CHECK_FOR_WORKFLOW_CALL: 'edp/mspost/checkForWorkflow/201'
    },
    DESIGNATION: {
        ADD_DESIGNATION: {
            SAVE_DESIGNATION: 'edp/msdesignation/adddsg/101',
            UPLOAD_ATTACHMENT: 'edp/attachment/designation/adddsg/101',
            LOAD_ATTACHMENT_LIST: 'edp/attachment/designation/adddsg/301',
            DOWNLOAD_ATTACHMENT: 'edp/attachment/designation/adddsg/901',
            DELETE_ATTACHMENT: 'edp/attachment/designation/adddsg/902',
            ADD_DESIGNATION_LIST: 'edp/msdesignation/adddsg/601',
            DELETE_ADD_DESIGNATION: 'edp/msdesignation/adddsg/902',
            ADD_DESIGNATION_UPDATE_GET_DETAILS: 'edp/msdesignation/adddsg/301',
            LOAD_DROPDOWN_LIST_VALUE: 'edp/msdesignation/searchStatus/301'
        },
        UPDATE_DESIGNATION: {
            GET_UPDATE_DESIGNATION: 'edp/msdesignation/updatedsg/201',
            SAVE_UPDATE_DESIGNATION: 'edp/msdesignation/updatedsg/101',
            UPLOAD_ATTACHMENT: 'edp/attachment/designation/updatedsg/101',
            DOWNLOAD_ATTACHMENT: 'edp/attachment/designation/updatedsg/901',
            DELETE_ATTACHMENT: 'edp/attachment/designation/updatedsg/902',
            LOAD_UPDATE_ATTACHMENT_LIST: 'edp/attachment/designation/updatedsg/upddsgnid/301',
            UPDATE_DESIGNATION_LIST: 'edp/msdesignation/updatedsg/601',
            DELETE_UPDATE_DESIGNATION: 'edp/msdesignation/updatedsg/501',
            UPDATE_DESIGNATION_GET_DETAILS: 'edp/msdesignation/updatedsg/301',
            UPDATE_DESIGNATION_UPDATE: 'edp/msdesignation/updatedsg/401',
            UPDATE_DESIGNATION_GET_COUNT: 'edp/msdesignation/updatedsg/getpostcount/201',
            UPDATE_DESIGNATION_GET_LIST: 'edp/msdesignation/searchStatusForUpd/301',
            GET_EMPLOYEE_ACTIVE_POST_LIST: 'edp/msdesignation/getEmpPostForOffice/201',
            ALREADY_EXISTS_RECORD: 'edp/msdesignation/checkForUpdRequest/201'
        },
        WORKFLOW: {
            CHECK_WF_REQUIRED: 'edp/msdesignation/checkForWorkflow/201',
            CHECK_WF_UPDATE: 'edp/msdesignation/checkForUpdateWorkflow/201',
            HEADER_DETAILS: 'edp/alias/wf/commonHeader/201'
        }
    },
    PASSWORD_APIS: {
        GLOBAL_EMPLOYEE_DETAILS: 'edp/msuser/searchbyemployeenumber/globalpwd/201',
        EMPLOYEE_DETAILS: 'edp/msuser/searchbyemployeenumber/resetpwd/201',
        RESET_PASSWORD: 'edp/msuser/resetpwd/902',
        GLOBAL_RESET_PASSWORD: 'edp/msuser/globlepwd/902'
    },
    OBJECT_CLASS_MAPPING_APIS: {
        OBJECT_CLASS_MAPPING: 'edp/billobjectclassmap/getbillobjectclassdetails/201',
        SAVE_OBJECT_CLASS_MAPPING: 'edp/billobjectclassmap/101',
        GET_SELECTED_CLASS: 'edp/billobjectclassmap/getobjectclassdetails/201'
    },
    POST_TRANSFER: {
        ATTACHMENT: {
            LIST_NAME: 'edp/attachment/posttransfer/getattachment/301',
            UPLOAD_ATTACHMENT: 'edp/attachment/posttransfer/101',
            LOAD_ATTACHMENT_LIST_DATA: 'edp/attachment/posttransfer/301',
            DELETE_ATTACHMENT: 'edp/attachment/posttransfer/902',
            DOWNLOAD: 'edp/attachment/posttransfer/901'
        },
        LIST: {
            LIST_OF_DATA: 'edp/posttransfer/303',
            DELETE_RECORD: 'edp/posttransfer/902',
            HEADER_SUBMIT_POPUP: 'edp/posttransfer/submitPopup/201',
            GET_STATUS: 'edp/posttransfer/searchStatus/301'
        },
        GET_POST_TRANS_LIST: 'edp/lulookupinfo/getbyname/201',
        GET_EMPL_DATA: 'edp/posttransfer/empdetails/301',
        CHANGE_POST_TYPE: 'edp/posttransfer/changepost/401',
        GET_VACANT_POST_LIST: 'edp/posttransfer/vacantpost/301',
        CREATE_POST_TRANSFER_REQ: 'edp/posttransfer/101',
        GET_POST_TRANSFER_DATA: 'edp/posttransfer/301',
        GET_POST_TRANSFER_DATA_VIEW: 'edp/posttransfer/approve/301',
        CHECK_FOR_WORKFLOW_CALL: 'edp/posttransfer/checkForWorkflow/201'
    },
    DISTRICT: 'edp/msoffice/officedetails/district/201',
    COMMON: {
        GET_HEADER_DETAILS_WF: 'edp/alias/wf/commonHeader/201',
        WF_HEADER_DETAILS: 'edp/alias/wf/commonHeader/201',
        WORKFLOW_CONDITION: 'edp/msoffice/checkForWorkflowCno/201',
        IS_WF_ENABLE: 'edp/msoffice/checkForWorkflowUo/201',
        ATTACHMENT_VALIDATION: 'edp/attachment/addNewDesignation/904',
        VALIDATE_FOR_DUPLICATE_RECORDS: 'common/wf/wfnextactions/201',
        VALIDATE_FOR_DUPLICATE_RECORDS_DETAILS_LIST: 'edp/msoffice/office/wfstatus/201',
        GET_DISTRICT_OFFICE_DETAILS: 'edp/msoffice/officeByDistrictfilter/201'
    },
    REPORTS: {
        COMMON_LOOK_UP: 'edp/reports/searchfilterdata',
        COMMON_REPORT_GENERATION: 'edp/reports/generation',
        POST_HISTORY: {
            GET_POST_DETAILS: 'edp/reports/getpostdetail'
        },
        OFFICE_CREATION: { GET_OFFICE_BILLS: 'edp/msoffice/getbills/201' }
    },
    BRANCH: {
        BRANCH_CREATION: {
            GET_BRANCH_DATA: 'edp/msbranch/getbranchdata/301',
            SAVE_BRANCH_DATA: 'edp/msbranch/savebranch/101',
            BRANCH_CREATION_LIST: 'edp/msbranch/303',
            DELETE_BRANCH_CREATION_LIST: 'edp/msbranch/902'
        },
        BRANCH_MAPPING_TRANSFER: {
            GET_BRANCH_REQUEST_TYPE: 'edp/msbranch/getBranchRequestType/301',
            GET_EMP_AND_POST_FOR_OFFICE: 'edp/msbranch/getEmpAndPostForOffice/201',
            GET_EMP_BRANCHES: 'edp/msbranch/getEmpBranches/201',
            GET_LOGGED_OFFICE_BRANCHES: 'edp/msbranch/getLoggedOfficeBranches/201',
            SAVE_BRANCH_MAPPING: 'edp/msbranch/mapBranch/101',
            GET_SEARCH_FILTERS: 'edp/msbranch/searchFilter/201',
            GET_FILTERED_MAPPED_BRANCHES: 'edp/msbranch/mapBranch/303',

            GET_MAPPED_BRANCH_EDIT_VIEW: 'edp/msbranch/branchMapping/301',
            DELETE_MAPPED_BRANCH_LIST: 'edp/msbranch/branchMapping/901',
            CHECK_FOR_BR_MAP_REQUEST: 'edp/msbranch/checkForBrMapRequest/201',
            CHECK_USER_ACCESS: 'edp/msbranch/branchMapping/checkUserAccess/301'
        }
    }
};
