export const MESSAGES = {
    PROCEED_MESSAGE: 'Are you sure you want to Close ?',
    MANDATORY_FIELD_MSG: 'Please fill all the details',
    DELETE_CONFIRMATION_MESSAGE: 'Are you sure, you want to delete record?',
    RESET_CONFIRMATION_MESSAGE: 'Are you sure you want to reset ? ',
    UPDATE_SUCCESS:'Data Updated Successfully ',
    DATA_SAVED_MESSAGE:'Data Saved Successfully',
    NO_DATA_MSG: 'No Data Available',
    RECEIVE_FROM_DATE: 'Please Select Receive From Date',
    RECEIVE_TO_DATE: 'Please Select Receive To Date',
    REFERENCE_FROM_DATE: 'Please Select Reference From Date',
    REFERENCE_TO_DATE: 'Please Select Reference To Date',
    ADVICE_FROM_DATE: 'Please Select Advice From Date',
    ADVICE_TO_DATE: 'Please Select Advice To Date',

    SENT_FROM_DATE: 'Please Select Sent From Date',
    SENT_TO_DATE: 'Please Select Sent To Date',
    ISSUE_FROM_DATE: 'Please Select LC Issue From Date',
    ISSUE_TO_DATE: 'Please Select LC Issue To Date',
    LC_FROM_AMOUNT: 'Please Enter LC From Amount',
    LC_TO_AMOUNT: 'Please Enter LC To Amount',
    CHEQUE_FROM_AMOUNT: 'Please Enter Cheque From Amount',
    CHEQUE_TO_AMOUNT: 'Please Enter Cheque To Amount',
    ADVICE_GROSS_FROM_AMOUNT: 'Please Enter Advice Gross From Amount',
    ADVICE_GROSS_TO_AMOUNT: 'Please Enter Advice Gross To Amount',
    CHEQUE_FROM_AMOUNT_VALIDATION: 'Cheque To Amount Cannot not be less than Cheque From Amount',
    LC_FROM_AMOUNT_VALIDATION: 'LC To Amount Cannot not be less than LC From Amount',
    ADVICE_GROSS_FROM_AMOUNT_VALIDATION: ' Advice Gross To Amount Cannot not be less than Advice Gross From Amount',
SELECT_VALIDATION: 'Please select atleast one record',
    CALCULATION_AMT:'HeadWiseCancellation Amount should be equal to ChequeAmount',
    CALCULATION_CHEQUE_AMT:'MissingCheque Amount should be equal to ChequeAmount',
    DEDUCTION_VALIDATION: 'Expenditure amount should be greater than or equal to Deduction amount',  
    HEADER: {
        FIN_YEAR: 'Please select any Financial Year',
        DEPARTMENT: 'Please select any Department',
        BRANCH: 'Please select any Name of the Branch ',
        ESTIMATION_FORM: 'Please select any Estimation Form ',
        ESTIMATE_BY: 'Please select any Estimation By ',
        MAJOR_HEAD: 'Please select any Major Head'
    },
    DETAILS: {
        ERROR_PROPESED_AMOUNT_FILL: 'Please fill all the details!',
        RESET_CONFIRMATION_MESSAGE: 'Are you sure you want to reset ?',
        SUBMIT_CONFIRMATION_MESSAGE: 'Do You Want To Submit This Data ?'
    },
    ATTACHMENT: {
        ERROR_GET_LIST: 'Some Error Occurred While Fetching Attachment List!',
        ERROR_NOT_UPLOAD: 'Please Upload All Attachments!',
        INVALID_TYPE: 'Support file format of ("jpg", "jpeg", "png", "pdf", "JPG","JPEG", "PNG", "PDF")',
        LARGE_FILE: 'File Size must be 2MB!',
        ERROR_FILE_NAME: 'Please enter a File Name',
        ERROR_FILE: 'Please select a file and click on upload button',
        ERROR_REMOVE_ATTACHMENT: 'Some Error Occurred While Delete Attachment!',
        ERROR_LIST_ATTACHMENT: 'Some Error Occurred While List Attachment!',
        ERROR_DOWNLOAD_ATTACHMENT: 'Some Error Occurred While Download Attachment!',
        ERROR_UPLOAD_ATTACHMENT: 'Some Error Occurred While Upload Attachment!',
        ERROR_ADD_ATTACHMENT: 'Please Insert New Attachment!',
        ERROR_SAME_DOCUMENT: 'Same Document Not Allowed!',
        NOT_ALLOWED: 'Upload Document Not Allowed',
        VIEW_ERROR: 'Some Error Occurred While View Attachment!',
        ERR_GET_UPLOAD_ATTACH: 'Error During Fetch Uploaded Attachment',
        DELETE_SUCCESS: 'Attachment Deleted Successfully',
        ERROR_ATTACHMENT_TYPE: 'Some Error Occurred While Fetching Attachment Type!',
        UPLOAD_SUCCESS: 'File Uploaded Successfully',
        ERROR_FILL_ALL_DATA: 'Please fill all the details.',
        DELETE_FILE: 'Are you sure, you want to delete ?',

        ERROR_FILE_SIZE: 'File size exceeds. Uploaded attachment size is more than Maximum allowed size.',
        ERROR_EXTENSION: 'File extension is not supported. Supported extensions are ',
        ERROR_FILL_DATA: 'Please fill the details!',
        ALREADY_UPLOADED: 'Documents already uploaded!',
        ATLEAST_ONE_UPLOAD: 'Please add atleast one new record!',
        PLEASE_ATTACH: 'Please attach mandatory documents and Upload the same!',
    },
    LIST: {
        DELETE_CONFIRMATION_MESSAGE: 'Are you sure, you want to delete record?'
    },
    REF_NO: 'Reference No. is : '

};

export const lcMessage = {
    MISSING_CHEQUE_NUMBER: 'Please Enter Missing Cheque Number',
    DIVISION_CODE: 'Please Enter Division Code',
    EXPENDITURE_AMOUNT: 'Please Enter Expenditure Amount',
    NET_TOTAL: 'Please Enter Net Total Amount',
    PARTY_NAME: 'Please Enter Party Name',
    CHEQUE_AMOUNT: 'Please Enter Cheque Amount',
    EXEMPTIONS: 'Please select Exemptions',
    REMARKS: 'Please Enter Remarks',
    INWARD_NO: 'Please Enter Inward No.',
    INWARD_DATE: 'Please Select Inward Date',
    SANCTIONED_AMOUNT: 'Please Enter Sanctioned Amount',
    DIVISION_OFFICE: 'Please Select Division Office',
    DIVISION_OFFICE_ADDRESS: 'Please Select Division Office Address',
    BUDGET_PROVISION: 'Please Select Budget Provision',
    DETAILS_OF_STAFF_SANCTIONED: 'Please Enter No. of Sanctioned Post',
    DESIGNATION: 'Please Select Designation',
    NO_OF_SANCTIONED: 'Please Enter No. of Sanctioned',
    DEDUCTION_AMOUNT: 'Pelase enter Deduction Amount',
    NET_AMOUNT: 'Please Enter the Net Amount',
    CHEQUE_NUMBER: 'Please Enter Cheque Number',
    MAJOR_HEAD: 'Please Select Major Head',
    SUB_MAJOR_HEAD: 'Please Select Sub Major Head',
    MINOR_HEAD: 'Please Select Minor Head',
    SUB_HEAD: 'Please Select Sub Head',
    BANK_ACCOUNT_NUMBER: 'Please Enter Bank Account Number',
    BANK_NAME: 'Please Select Bank Name',
    BANK_BRANCH: 'Please Select Bank Branch',
    CIRCLE_CODE: 'Please Enter Circle Code',
    CIRCLE_NAME: 'Please Enter Circle Name',
    IFMS_USER_ID: 'Please Enter DDO IFMS User ID',
    DDO_FULL_NAME: 'Please Enter DDO Full Name',
    ANTICIPATED_DATE: 'Please Select Anticipated Date',
    EFFECTIVE_DATE: 'Please Select Effective Date',
    CLOSING_DATE: 'Please Select Closing Date',
    AG_AUTHORIZATION_NO:'Please Select AG Authorization No',
    AG_AUTHORIZATION_DATE:'Please Select AG Authorization Date',
    DETAILED_HEAD: 'Please Select Detailed head',
    DEMAND:'Please Select Demand',
    ESTIMATION_TYPE:'Please Select Type of Estimation',
    ITEM_NAME:'Please Select Item Name',
    OBJECT_CLASS:'Please Select Object Class',
    BUDGET_TYPE:'Please Select Budget Type',
    CHARGE_VOTED:'Please Select Charged / Voted',
    FUNDTYPE:'Please Select Fund Type',
    MONTH:'Please Select Month',
    PAYMENT_TYPE:'Please Select Payment Type',
    ADVICE_TYPE:'Please Select Advice Type',
    HEAD_OF_DEPARTMENT:'Please Select HOD',
    ENTER_CIRCLE_NAME:'Please Enter Circle Name',
    PARTY_REFERENCE_NUMBER:'Please Enter Party Reference Number',
    PARTY_REFERENCE_DATE:'Please Select Party Reference Date',
    HEADWISE_AMOUNT: 'Please Enter HeadWise Amount',
    LC_NUMBER:'Please Select LC Number',
    CHEQUE_TYPE:'Please select Cheque Type'

};

