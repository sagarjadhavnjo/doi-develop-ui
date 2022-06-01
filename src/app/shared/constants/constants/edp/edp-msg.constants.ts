import { PASSWORD_APIS } from './../../password-module/index';
export const msgConst = {
    DDO_OFFICE: {
        ERR_OFFICE_DETAILS: 'Some Error Occurred While Fetching Office Details!',
        ERR_OFFICE_MASTER_DATA: 'Some Error Occurred While Fetching Office Master Data!',
        ERR_EMPL_NAME: 'Some Error Occurred While Fetching Employee Name!',
        ERR_CARDEX_NO: 'Some Error Occurred While Fetching Cardex Number!',
        ERR_SAVE_OFFICE: 'Some Error Occurred While Saving Office Details!',
        GR_NUMBER: 'Please Enter GR Number',
        DISTRICT: 'Please Select Any District',
        OFFICE_TYPE: 'Please Select Office Type',
        LEVEL: 'Please Select Level Type',
        DDO_OFFICE_NAME: 'Please Enter DDO Office Name',
        DDO_NO: 'Please Enter The DDO Number ',
        CARDEX_NO: 'Please Enter The Cardex Number',
        DDO_TYPE: 'Please Select Any Name Of The DDO Type',
        NON_DDO_TYPE: 'Please Select Any Non DDO Type',
        PVU: 'Please Select Any Pay Verification Unit',
        DESG_DDO_NAME: 'Please Select Any Designation Of DDO',
        REQUEST_TO: 'Please Select Any Request Office',
        EMPLOYEE_NO: 'Please Enter Valid Employee Number',
        CO_DESG_NAME: 'Please Select CO Designation',
        CO_OFFICE_NAME: 'Please Select CO Office Name',
        BILL_SUBMITTED_TO: 'Please Select Any Bill Submitted To Name',
        BILL_TYPE: 'Please Select Any Bill Type',
        LIST_OF_BILL: 'Please Select Bills',
        MODULE_TYPE: 'Please Select Module Types',
        COMMENT: 'Please Enter Comment',
        OBJECTION_REMARKS: 'Please Enter Objection Remarks',
        ADDRESS: 'Please Enter Address Detail',
        TALUKA: 'Please Select Taluka Name',
        PIN_CODE: 'Please Enter Valid Pincode',
        PIN_CODE_REQUIRED: 'Please Enter Pin Code',
        PHONE_NO: 'Please Enter Valid Phone No',
        MOB_NO: 'Please Enter Valid Mobile No',
        FAX_NO: 'Please Enter Valid Fax No',
        EMAIL_ID: 'Please Enter Valid Email ID',
        SUB_OFFICE_NAME: 'Please Enter Office Name',
        ADDMINISTRATION_TYPE: 'User can not select Administration Department for this District',
        OFFICE_DEPART: 'Please Select Department',
        HOD: 'Please Select HOD',
        ERR_UPLOAD_ALL_ATTACH: 'Please Upload All Mandatory Attachment',
        ENDDATE: 'Please Select End Date',
        TRANSFER_DATE: 'Please Select Transfer Date',
        STATUSCOMMENT: 'Please Enter Status Comment',
        OFFICE_NOT_FOUND: 'Office Details Not Found'
    },
    OFFICE_LIST: {
        ERR_OFFICE_LIST: 'Some Error Occurred While Fetching Office List!',
        OFFICE_DELETE: 'Office Record Deleted SuccessFully',
        ERR_OFFICE_DELETE: 'Office Record Not Deleted!',
        HOD_LIST: 'Some Error Occurred While Fetching HOD List!',
        FROM_DATE: 'Please Select From Date',
        TO_DATE: 'Please Select To Date',
        ADDMIN_DEPT: 'Select Administrative Department'
    },
    OFFICE_SUMMARY: {
        ERR_SUMMARY_LIST: 'Some Error While Fetching Office Summary List!',
        ERR_SUMMARY_UPDATE_LIST: 'Some Error While Fetching Office Summary Update List!',
        HOD_LIST: 'Some Error Occurred While Fetching HOD List!',
        ADDMIN_DEPT: 'Select Administrative Department'
    },
    SUB_OFFICE: {
        ERR_SUB_OFFICE_LIST: 'Some Error While Fetching Sub Office List!',
        SUB_OFFICE_DELETE: 'Sub Office Record Deleted SuccessFully',
        ERR_SUB_OFFICE_DELETE: 'Sub Office Record Not Deleted!'
    },
    ADD_DESIGNATION: {
        DESIGNATION: 'Please Enter Designation Name',
        ERR_SAVE_DESIGNATION: 'Some Error While Save Designation Details!',
        ERR_ADD_DESIGNATION_DETAILS: 'Some Error Occurred While Fetching Add Designation Details!',
        DISTRICT_NAME: 'Some Error Occurred While Fetching District Details!',
        OFFICE_NAME: 'Please Enter Valid DDO Number And Cardex Number!',
        OFFICE_DETAILS: 'Please Enter Office Details!',
        DISTRICT: 'Please Select Any District!',
        OFFICE: 'Office name is In Active or not found'
    },
    UPDATE_DESIGNATION: {
        EMP_NO: 'Please Select An Employee Number',
        DESIGNATION: 'Please Select Designation',
        SELECT_DESIGNATION: 'Old And New Designation Name Can Not Be Same',
        ERR_SAVE_DESIGNATION: 'Some Error While Save Designation Details!',
        ERR_UPDATE_DESIGNATION_DETAILS: 'Some Error Occurred While Fetching Update Designation Details!',
        ERR_UPDATE_DESIGNATION: 'Some Error While Update Designation Details!',
        ACTIVE_POST: 'Please Select Any Active Post Name',
        TRANSACTION: {
            ERR_UPLOAD_ATTACH: 'Please Upload Mandatory Attachment',
        },
        OBJECTION_REMARKS: 'Objection Remark is required',
        UPDATE_DESIGNATION_FORM_ERROR: 'Please fill all the details'
    },
    Add_DESIGNATION_LIST: {
        DATE: 'To Date Can Not Before From Date',
        ERR_Add_DESIGNATION_LIST: 'Some Error Occurred While Fetching Add Designation List!',
        Add_DESIGNATION_DELETE: 'Add Designation Deleted Successfully',
        ERR_Add_DESIGNATION_DELETE: 'Add Designation Not Deleted!',
        FROM_DATE: 'Please Select From Date',
        TO_DATE: 'Please Select To Date',
        ADD_DESIGNATION_FORM_ERROR: 'Please fill all the details'
    },
    UPDATE_DESIGNATION_LIST: {
        DATE: 'To Date Can Not Before From Date',
        ERR_UPDATE_DESIGNATION_LIST: 'Some Error Occurred While Fetching Update Designation List!',
        UPDATE_DESIGNATION_DELETE: 'Update Designation Deleted Successfully',
        ERR_UPDATE_DESIGNATION_DELETE: 'Update Designation Not Deleted!',
        FROM_DATE: 'Please Select From Date',
        TO_DATE: 'Please Select To Date'
    },
    ATTACHMENT: {
        ERR_GET_LIST: 'Some Error Occurred While Fetching Attachment List!',
        ERR_NOT_UPLOAD: 'Please Upload All Attachments!',
        INVALID_TYPE: 'Invalid Attachment Type!',
        LARGE_FILE: 'Please Upload Small Size File!',
        UPLOAD_SUCCESS: 'Uploaded Successfully',
        ERR_FILENAME: 'Please Enter/Select File Name And Browse File',
        ERR_REMOVE_ATTACHMENT: 'Some Error Occurred While Delete Attachment!',
        ERR_LIST_ATTACHMENT: 'Some Error Occurred While List Attachment!',
        ERR_DOWNLOAD_ATTACHMENT: 'Some Error Occurred While Download Attachment!',
        ERR_UPLOAD_ATTACHMENT: 'Some Error Occurred While Upload Attachment!',
        ERR_FILL_ALL_DATA: 'Please Fill All The Detail.',
        ERR_ADD_ATTACHMENT: 'Please Insert New Attachment!',
        ERR_SAME_DOCUMENT: 'Same Document Not Allowed!'
    },
    POST: {
        ERR_POST_DETAILS: 'Some Error While Fetching Post Details!',
        ERR_POST_COUNT_DETAILS: 'Some Error While Fetching Post Count Details!',
        Designation: 'Please Select Designation Name',
        ERR_POST_SAVE: 'Some Error While Save Post Details!',
        POST_CREATION_FORM_ERROR: 'Please fill all the details'
    },
    POST_LIST: {
        DATE: 'To Date Can Not Before From Date',
        ERR_POST_LIST: 'Some Error Occurred While Fetching Post List!',
        POST_DELETE: 'Post Record Deleted Successfully',
        ERR_POST_DELETE: 'Post Record Not Deleted!',
        FROM_DATE: 'Please Select From Date',
        TO_DATE: 'Please Select To Date',
    },
    CONFIRMATION_DIALOG: {
        DELETE: 'Are you sure you want to delete record?',
        CONFIRMATION: 'Do you want to proceed?',
        RESET_PASSWORD: 'Are you sure, Do you want to reset password?',
        RESET_DATA: 'Are you sure you want to reset?',
        CLOSE: 'Do you want to close?'
    },
    PASSWORD: {
        EMPLOYEE_DETAIL: 'Some Error Occured While Fetching Employee Details!',
        USERCODE: 'Enter Valid Employee Number',
        EMPLOYEE: 'Please Enter Employee Number',
        PASSWORD_CODE: 'Password Is Required',
        EMPLOYEE_NUMBER: 'Employee Number Doesn\'t Exists',
        PASSWORD_MIN_LENGTH: 'Password Must Be 8 to 16 Characters Long',
        EMPLOYEE_CODE_LENGTH: 'Employee Number Should Be 10 Characters long',
        EMP_NUMBER: 'Employee Number Is Required.',
        EMP_MIN_NUMBER: 'Enter Valid Employee Number'
    },
    OBJECT_CLASS_MAPPING: {
        BILL_TYPE: 'Please Select Bill Type',
        ERR_SAVE_OBJECT_CLASS: 'Some Error Occured While Save Object Class Mapping',
        ERR_OBJECT_CLASS_DATA: 'Some Error Occured While Save Object Class Mapping Details',
    },
    POST_TRANSFER: {
        LIST: {
            DATE: 'To Date Can Not Before From Date',
            ERR_POST_TRANSFER_LIST: 'Some Error Occurred While Fetching Post Transfer List!',
            POST_TRANSFER_DELETE: 'Post Transfer Record Deleted SuccessFully',
            ERR_POST_TRANSFER_DELETE: 'Post Transfer Record Not Deleted!',
            FROM_DATE: 'Please Select From Date',
            TO_DATE: 'Please Select To Date'
        },
        CREATE: {
            POST_TRANS_FROM: 'Please Select Post Transfer From',
            POST_TRANS_TO: 'Please Select Post Transfer To',
            EMP_NO_FROM: 'Please Enter From Employee Number',
            EMP_NO_TO: 'Please Enter To Employee Number',
            ERR_LOAD_DATA: 'Some Error Occured While Fetching Post Transfer Details',
            ERR_LOAD_POST_TRANS_TYPE: 'Some Error Occured While Fetching Post Transfer Type',
            ERR_LOAD_POST_TYPE: 'Some Error Occured While Fetching The Post Type',
            CHANGE_POST_TYPE: 'Post Type Changed Successfully',
            ERR_CHANGE_POST_TYPE: 'Some Error Occured While Changing The Post Type',
            // tslint:disable-next-line: max-line-length
            ERR_FROM_TO_SAME: 'Employee number cannot be same for \"Transfer From\" and \"Transfer To\". Please change either of the number',
            ERR_TO_EMP_INVALID: 'To Employee Number Is Not Valid',
            ERR_SELECT_POST_TYPE: 'Please Select Post Type',
            // tslint:disable-next-line: max-line-length
            ERR_ONLY_SELECT_PRIMARY: 'Before transferring it, Make one of it as a Primary and rest of them as a secondary post',
            ERR_CHANGE_PRIMARY_POST: 'You cannot transfer primary post in case you have multiple post',
            ERR_ONE_SELECT_PRIMARY: 'Transfer the post as a primary post and not as a secondary post.',
            ERR_ONE_SELECT_POST: 'Please Select At Least One Post For Transfer',
            ERR_SAVE_TRANS: 'Some Error Occured While Have Employee Transfer Request',
            ERR_UPLOAD_ALL_ATTACH: 'Please Upload All Mandatory Attachment',
            ERR_SEL_POST_TYPE_SEL_POST: 'Please select Post Type for selected post',
            ERR_SEL_POST_TO_BE: 'Please Select The Post To Be Transfer',
            ERR_VACANT_POST_LIST: 'Some Error Occured While Fetching The Vacant Post List',
            ERR_POST_MAP_OFFICE: 'The Employee number is not mapped with any post of this office',
            ERR_EMP_NO_EXIST: 'Employee number does not exit',
            ERR_FROM_EMP_DATA: 'Some Error Occured While Fetching From Employee Details',
            ERR_TO_EMP_DATA: 'Some Error Occured While Fetching To Employee Details',
            ERR_SELECT_OFFICE: 'Please Select Office First',
            ERR_SELECT_EMP_TO_NO: 'Please Select Appropriate To Employee Number',
            COMMENT: 'Comment is required',
            OBJECTION_REMARKS: 'Objection Remark is required'
        }
    },
    RIGHTS_MAPPING: {
        LIST: {
            DATE: 'To Date Can Not Before From Date',
            FROM_DATE: 'Please Select From Date',
            TO_DATE: 'Please Select To Date'
        },
        TRANSACTION: {
            ERR_UPLOAD_ALL_ATTACH: 'Please Upload All Mandatory Attachment',
            OBJECTION_REMARKS: 'Objection Remark is required',
            EMP_NO: 'Please Select Employee Number',
        }

    },
    BRANCH: {
        BRANCH_CRATION: {
            BRANCH_NAME: 'Branch name is required',
            BRANCH_TYPE: 'Please select any one branch type'
        },
        BRANCH_CREATION_LIST: {
            FROM_DATE: 'Please Select From Date',
            TO_DATE: 'Please Select To Date',
        },
        BRANCH_MAPPING_TRANSFER: {
            BRANCH_ACTION: 'Please Select Branch Action',
            EMP_DETAILS: 'Please Select Employee Details',
            BRANCH_NAME: 'Please Select Branch Name',
            BRANCH_TYPE: 'Please Select Branch Type',
            BRANCH_MAPPING_HEADER: 'Branch Mapping',
            BRANCH_MAPPING_FROM_HEADER: 'Branch Mapping From',
            BRANCH_MAPPING_TO_HEADER: 'Branch Mapping To',
            ERR_SELECT_ATLEAST_ONE_BRANCH_ADD: 'Please select at least one branch to be added',
            ERR_SELECT_ATLEAST_ONE_BRANCH_TRNS: 'Please select at least one branch to be transferred',
            LIST: {
                DATE: 'To Date Can Not Before From Date',
                FROM_DATE: 'Please Select From Date',
                TO_DATE: 'Please Select To Date'
            },
            ERR_SAME_TO_FROM_EMP : 'From user post and to user post cannot be same'
        },
        NO_DATA_MSG: 'No Data Available.'
    }
};
