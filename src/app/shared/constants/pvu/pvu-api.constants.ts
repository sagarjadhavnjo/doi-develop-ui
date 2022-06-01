export const APIConst = {
    PAY_COMM: 'pvu/paycommision',
    SEARCH_EMPLOYEE: {
        SEARCH: 'pvu/employe/common/201',
        LOOKUP: 'pvu/employe/pvu/getddlempLookup',
        SEARCH_EMP_BY_NO: 'pvu/get-common-detail',
        SEARCH_FIX_PAY_EMPLOYEE_BY_NO: 'pvu/get-fixpay-emp-common-detail',
        SEARCH_EMP_BY_CASENO: '',
        GET_EMP_BY_ID: 'pvu/employe/common/response'
    },
    EMPLOYEE_CREATION: {
        // LOOKUPINFO: 'pvu/employe/getEmployeLookUpInfo/201',
        LOOKUPINFO: 'pvu/employe/pvulookupinfo/201',
        UPLOAD: 'common/attachment/filenet/upload/101',
        APPROVER_DETAIL: 'pvu/employe/getApproverNameAndDesignation/201',
        EDITABLE_SUBMIT: 'pvu/employe/employeeUpdate/401',
        PERSONAL_DETAIL: {
            SAVE: 'pvu/employe/101',
            GET: 'pvu/employe/301',
            CHECK_PAN: 'pvu/employe/isDublicatePanNumber/201',
            DELETE_NOMINEE: 'pvu/employe/nomineeDetail/901',
            DELETE_NOMINEE_ATTACHMENT: 'pvu/employe/deleteAttachment/201',
            DELETE_EMP_PHOTO: 'pvu/employe/deleteEmployeePhoto/201',
            GET_ATTACHMENT: 'common/attachment/301',
            // DOWNLOADATTACHMENT : 'common/attachment/filenet/download/901'
            DOWNLOADATTACHMENT: 'pvu/employe/getAttachments/201'
        },
        PAY_DETAIL: {
            SAVE: 'pvu/employepaydetail/101',
            GET: 'pvu/employepaydetail/301',
            BASIC_PAY: 'pvu/employepaydetail/seven/basic/pay',
            GET_PAY_SCALE: 'pvu/pay-masters',
            GET_PAY_ENTRY_PAY: 'pvu/employe/enteryPay/201',
            DESIGNATION: 'pvu/designations',
            MASTER_DESIGNATION: 'masters/designations/201',
            MASTER_LSTSDT: 'masters/states/201',
            MASTER_DISTRICT: 'masters/districtsbystateid/201',
            MASTER_TALUKA: 'masters/talukasbydistrictid/201',
            MASTER_ADMINISTRATIVE_DEPARTMENT: 'masters/dept/201'
        },
        EVENTS: {
            GET_ALL: 'pvu/employeevents/201',
            GET_JOINING_PAY: 'pvu/employeevents/getEmpJoinPayDetails/201',
            GET_FIVE_SIX_SEVEN: 'pvu/employeevents/emp-events-reg-rev/201',
            GET_TRANSFER: 'pvu/employeevents/getEmpTrnEvent/201',
            GET_OTHER: 'pvu/employeevents/getEmpSusEolEvent/201',
            GET_EVENT_ID: 'pvu/employeevents/emp-events-id-by-event-details/201'
        },
        QUALIFICATION: {
            CREATE: 'pvu/employequalification/101',
            GET: 'pvu/employequalification/getQualificationByEmpId/201',
            UPDATE: 'pvu/employequalification/401',
            DELETE_QUAL_EXAM: 'pvu/employequalification/qualificationDetail/901',
            DELETE_DEPT_EXAM: 'pvu/employequalification/deptExamDetail/901',
            DELETE_CCC_EXAM: 'pvu/employequalification/cccExamDetail/901',
            DELETE_LANG_EXAM: 'pvu/employequalification/langExamDetail/901'
        },
        DEPARTMENTAL: {
            CREATE: 'pvu/employeedepartment/101',
            GET: 'pvu/employeedepartment/301',
            GET_OFFICE_BY_DISTRICT_ID: 'pvu/transferemployee/getOfficeByDistrictId/301',
            DELETE_PREV_HISTORY: 'pvu/employeedepartment/501',
            GET_SUB_OFFICE: 'pvu/suboffice',
            GET_OFFICE_BY_DDO_CARDEX: 'pvu/employeedepartment/getOfficeByOfficeType/301'
        },
        EMPLOYEE_VIEW: {
            GET_DUPLICATE_PAN: 'pvu/employe/getDuplicatePanNoDetail/201'
        },
        WORKFLOW: {
            GET_ASSIGN_OPT: 'common/workflow/wfnextactions/201',
            GET_EMP_DETAIL: 'pvu/employe/common/response',
            GET_USERS: 'common/workflow/users/wfactionid/201',
            SUBMIT: 'pvu/employe/insertEmployeeItr/201',
            GET_REVIEW: 'pvu/employe/getemployeewfhistory/201'
        }
    },
    EMPLOYEE_LIST: {
        GET_ALL: 'pvu/employe/201',
        LOOKUP_DATA: 'pvu/employe/pvu/getddlempLookup',
        DESIGNATION_LIST: 'masters/designations/201',
        OFFICE_TYPE: 'pvu/employe/office/type',
        WORKFLOW_STATUS: 'common/workflow/getWfStatus/201',
        DELETE: 'pvu/employe/deleteEmployee/901',
        OFFICE_NAME_LIST: 'pvu/employe/getOfficeByOfficeType/301'
    },
    EXTRA_ORDINARY_LEAVE: {
        CREATE: 'pvu/employeeeoleave/101',
        GET: 'pvu/employeeeoleave/301',
        UPDATE: 'pvu/employeeeoleave/401',
        GET_ALL: 'pvu/employeeeoleave/201',
        DELETE: 'pvu/employeeeoleave/deleteeol/901',
        DESIGNATION: 'masters/designations/201',
        WORKFLOW_STATUS: 'pvu/employe-suspension/pvu/getAllLookup',
        PRINT: 'pvu/employeeeoleave/generate-printendorsement/101',
        VALIDATION : {
            edit: 'pvu/employeeeoleave/Validation/301',
            add: 'pvu/employeeeoleave/ValidationCreate/301',
        }
    },
    EXTRA_ORDINARY_LEAVE_LIST: {
        WORKFLOW_STATUS: 'common/workflow/getWfStatus/201'
    },
    SUSPENSION: {
        CREATE: 'pvu/employe-suspension/101',
        GET: 'pvu/employe-suspension/301',
        UPDATE: 'pvu/employe-suspension/401',
        GET_ALL: 'pvu/employe-suspension/201',
        LOOKUPINFO: 'pvu/employe-suspension/pvu/getAllLookup',
        SEARCH_EMP_BY_NO: 'pvu/get-common-detail',
        WORKFLOW_STATUS: 'common/workflow/getWfStatus/201',
        SUS_PREFIX: 'pvu/employe-suspension',
        DELETE_PAY: 'pvu/employe-suspension/501',
        DELETE_SUS: 'pvu/employe-suspension/delete/501',
        PRINT_ORDER: 'pvu/employe-suspension/generate-printendorsement/101'
    },
    TRANSFER: {
        LOOKUP: 'pvu/transfer/pvu/getAllLookup',
        DISTRICT_DESG_LOOKUP: 'pvu/transfer/pvu/getLookupDetails',
        GET_OFFICE_BY_DISTRICT: 'pvu/transfer/getOfficeByDistrictId/301',
        GET_SUB_OFFICE: 'pvu/suboffice',
        GET_EMP_DETAIL: 'pvu/employe/getEmployeeByEmployeeNo/201',
        SAVE_TRANSFER: 'pvu/transfer/101',
        GET_ALL: 'pvu/transfer/201',
        GET: 'pvu/transfer/301',
        DELETE: 'pvu/transfer/501',
        GET_TRANSFER_JOINING_LIST: 'pvu/transfer/transfer-employee/201'
    },
    ROP: {
        ROP_PREFIX: 'pvu/revisionofpay',
        DESIGNATION: 'pvu/designations',
        LOOKUP: 'pvu/revisionofpay/pvu/getAllLookup',
        ROP_LOOKUP: 'pvu/revisionofpay/ropcreatelookup/201',
        ROP_RETURN_REASON: 'pvu/revisionofpay/ropReasons/201',
        GET_POST_DATA: 'pvu/revisionofpay/roppostdetails/201',
        EMPLOYEE_DETAILS: 'pvu/revisionofpay/employeedetail/301',
        VALIDATE_EMPLOYEE: 'pvu/ropvalid/201',
        CREATE: 'pvu/revisionofpay/101',
        UPDATE_REMARKS: 'pvu/revisionofpay/ropremark/401',
        ROP_EVENT_DATA: 'pvu/revisionofpay/301',
        ROP_CONFIG: 'pvu/ropconfiguration/201',
        ROP_REASON_DATA: 'pvu/revisionofpay/ropreturnreasonbyid/201',
        ROP_TRNS_STATUS: 'common/workflow/trnpvuwf/wfrolecode/roptrnid/201',
        GET_PVUOFFICE: 'pvu/revisionofpay/getpvuoffice/201',
        PRINT_ANNEXURE: 'pvu/ropprintendorsement/generateannexure/101',
        PRINT_DDO_CERTIFICATE: 'pvu/revisionofpay/ddo-approval-certificate/201',
        LIST: {
            GET_SEARCH_LIST: 'pvu/revisionofpay/601',
            GET_LIST_DATA: 'pvu/revisionofpay/201',
            WORKFLOW_STATUS: 'common/workflow/getWfStatus/201',
            DELETE: 'pvu/revisionofpay/501'
        },
        AUDITOR_LIST: {
            GET_LIST_DATA: 'pvu/revisionofpay/employeesearch/901',
            OFFICE_LIST: 'edp/msoffice/officebyofficeidandpvuid/301'
        },
        EMP_SEARCH: {
            ROP_EMP_LIST: 'pvu/revisionofpay/employeesearch/201'
        },
        WORKFLOW: {
            ROP_SUBMIT: 'pvu/revisionofpay/901',
            WORKFLOW_HISTORY: 'common/workflow/history/pvuwfhistory/201'
        },
        INWARD: {
            INWARD_LOOKUP: 'pvu/ropinward/ropInwardLookup/201',
            GET_INWARDS: 'pvu/ropinward/201',
            RECEIVE: 'pvu/ropinward/generateInwardNumber/201',
            SUBMIT_WF: 'pvu/ropinward/inwardSubmit/901'
        },
        DISTRIBUTOR: {
            GET_DISTRIBUTOR: 'pvu/ropdistributor/201',
            SUBMIT_WF: 'pvu/ropinward/distributorSubmit/901'
        },
        PRINTENDORSEMENT: {
            GET_PRINTENDORSEMENT_LOOKUP: 'pvu/ropprintendorsement/ropPELookup/201',
            GET_PRINTENDORSEMENT: 'pvu/ropprintendorsement/201',
            PRINT_STICKER: 'pvu/ropprintendorsement/generateprintendorsement/101',
            PRINT_MULTI_STICKER: 'pvu/ropprintendorsement/generateprintendorsement/201',
            REPRINT_REMARKS_HISTORY: 'pvu/ropprintendorsement/endorsementremarks/101'
        }
    },
    INCREMENT: {
        LIST: {
            // Old Increment
            DELETE_ADDED_DATA: '',
            // New Increment
            INCREMENT_GET_LOOKUP_DATA: 'pvu/employee-increment/list_lookup',
            INCREMENT_LIST_DATA: 'pvu/employee-increment/employeeIncrementList/201',
            WORKFLOW_STATUS: 'common/workflow/getWfStatus/201',
            DELETE: 'pvu/employee-increment/501'
        },
        GET: 'pvu/employee-increment/301',
        GET_EMPLOYEE_DETAILS: 'pvu/incrementevent/incrementedit/201',
        TRNS_STATUS: 'common/workflow/trnpvuwf/wfrolecode/inctrnid/201',
        CREATE: {
            // Old Increment
            CREATE_LOOKUP_DATA: 'pvu/incrementevent/create_lookup',
            FINANCIAL_YEAR: 'edp/msfinancialyear/201',
            DESIGNATION: 'masters/designations/201',
            INCREMENT_LIST_DATA: 'pvu/incrementevent/incrementcreate/201',
            SAVE_INCREMENT_DETAILS: 'pvu/employee-increment/101',
            // VALIDATE_INCREMENT_DETAILS: 'pvu/incrementevent/validateincrementsubmit/201',
            // New Increment
            LOOKUP: 'pvu/employee-increment/create_lookup',
            GET_EMP_LIST: 'pvu/employee-increment/regularEmployeeList/201',
            CONFIRM_PROCESS: 'pvu/employee-increment/pvuEmployeeIncrementConfirmAndProcess/101',
            VALIDATE_INCREMENT_DETAILS: 'pvu/employee-increment/validateincrementsubmit/201',
            COUNTLIST: 'pvu/employee-increment/processStatus'
        },
        // New Increment
        PRINT_ORDER: 'pvu/employee-increment/generate-printendorsement/101',
        EMPLOYEE_DATA: 'pvu/employee-increment/excelGeneration/employeeData',
        PROCESSED_EMP_DATA: 'pvu/employee-increment/excelGeneration/processedEmployeeList',
        INELIGIBLE_EMPLOYEE_DATA: 'pvu/employee-increment/excelGeneration/ineligibleEmployeeList',
        SUCCESS_FAILURE_COUNT: 'pvu/employee-increment/excelGeneration/successCount'
    },
    FIX_TO_REGULAR: {
        DESIGNATION: 'masters/designations/201',
        WORKFLOW_STATUS: 'masters/lookupinfobyparentlookupid/201',
        STATUS: 'pvu/fixpaytoreg/getStatus/201',
        CREATE: {
            LOOKUP_DETAILS: '',
            SUBMIT_DETAILS: ''
        },
        LIST: {
            LIST_DATA: 'pvu/fixpaytoreg/getf2rlist/201',
            DELETE: 'pvu/fixpaytoreg/deletefixtoreg/301'
        },
        GETFIXTOREGULARDATA: 'pvu/fixpaytoreg/getfixtoreg/301'
    },
    EMPLOYEE_TYPE_CHANGE: {
        ATTACHMENT_PREFIX: 'pvu/employeTypeChange',
        CREATE: {
            LOOKUP_DETAILS: '',
            SUBMIT_DETAILS: 'pvu/employeTypeChange/101',
            EMP_PAY_TYPE: 'pvu/exp/emp/lookup/paytype/201',
            GET_EMP_CHANGE_DATA: 'pvu/employeTypeChange/301',
            GET_EMP_DETAILS: 'pvu/employeTypeChange/getEmpDetails'
        },
        LIST: {
            LIST: 'pvu/employeTypeChange/getEmpPayTypeList',
            DELETE: 'pvu/employeTypeChange/501'
        }
    },
    USER_CREATION: {
        CREATE: {
            LOOKUP_DETAILS: 'pvu/exp/emp/lookup/salutation/201',
            EMP_PAY_TYPE: 'pvu/exp/emp/lookup/paytype/201',
            EMPLOYEE_SEARCH: 'pvu/exp/emp/caseno/601',
            // CHECK_PAN: 'pvu/employe/isDublicatePanNumber/201',
            CHECK_PAN: 'pvu/exp/emp/panno/601',
            DESIGNATION: 'masters/designations/201',
            SUBMIT: 'pvu/exp/emp/901',
            GET_USER_DATA: 'pvu/exp/emp/301'
        },
        LIST: {
            EMP_PAY_TYPE: 'pvu/exp/emp/lookup/paytype/201',
            DELETE: '',
            GET_LIST: 'pvu/exp/emp/list/201',
            DESIGNATION: 'masters/designations/201',
            OFFICE_NAME_LIST: 'pvu/employe/getOfficeByOfficeType/301'
        }
    },
    REPORT: {
        LIST: {
            CASE_INQUIRY: 'pvu/mis/reports/caseInquiry',
            EMPLOYEE_CREATION: 'pvu/mis/reports/employeeCreation',
            INWARD_CASES_FOR_ROP: 'pvu/mis/reports/inwardCase',
            OUTWARD_CASES_FOR_EVENTS: 'pvu/mis/reports/outwardCase-event',
            INWARD_CASES_FOR_EVENTS: 'pvu/mis/reports/inwardCase-Event',
            FORWARD_CASES_DDO_WISE: 'pvu/mis/reports/forwardCaseDdo-event ',
            RETURN_CASES: 'pvu/mis/reports/returnCase-event',
            DDO_EVENT_STATUS: 'pvu/mis/reports/ddoEventStatus-event',
            DDO_FORWARD_CASES: 'pvu/mis/reports/ddoForwardCase',
            EVENT_WISE_PENDING_STATUS: 'pvu/mis/reports/eventWisePendingStatus',
            DISTRICT_WISE_PENDING_STATUS: 'pvu/mis/reports/districtWisePendingStatus-event',
            DISTRICT_WISE_VERIFICATION: 'pvu/mis/reports/districtWise-event',
            DEPT_WISE_PENDING_STATUS: 'pvu/mis/reports/departmentWisePendingStatus-event',
            DEPARTMENT_WISE_VERIFICATION: 'pvu/mis/reports/depWiseVeriReport',
            EMPLOYEE_WISE_WORK_DONE: 'pvu/mis/reports/empWiseWorkdone-event',
            EVENT_STATUS: 'pvu/mis/reports/pvuEventStatus',
            EMPLOYEE_WISE_MONTHLY_PROGRESS: 'pvu/mis/reports/employeeWiseMonthlypProgress-event',
            DURATION_WISE_PENDING_CASES: 'pvu/mis/reports/durationWisePendingStatus',
            EMP_WISE_ALLOCATION: 'pvu/mis/reports/empWiseAllocation'
        },
        PDF: {
            CASE_INQUIRY: 'pvu/mis/reports/caseInquiry-download',
            EMPLOYEE_CREATION: 'pvu/mis/reports/employeeCreation-download',
            INWARD_CASES_FOR_ROP: 'pvu/mis/reports/inwardCase-download',
            OUTWARD_CASES_FOR_EVENTS: 'pvu/mis/reports/outwardCasesEvent-download',
            INWARD_CASES_FOR_EVENTS: 'pvu/mis/reports/inwardCaseDetails-download',
            FORWARD_CASES_DDO_WISE: 'pvu/mis/reports/forwardWiseDDO-download',
            RETURN_CASES: 'pvu/mis/reports/returnCasePdf-download',
            DDO_EVENT_STATUS: 'pvu/mis/reports/ddoEvents-pdf-download',
            DDO_FORWARD_CASES: 'pvu/mis/reports/ddoForward-download',
            EVENT_WISE_PENDING_STATUS: 'pvu/mis/reports/eventWisePendingStatus-pdf-download',
            DISTRICT_WISE_PENDING_STATUS: 'pvu/mis/reports/districtWisePendingStatus-pdf-download',
            DISTRICT_WISE_VERIFICATION: 'pvu/mis/reports/distWiseVerification-pdf-download',
            DEPT_WISE_PENDING_STATUS: 'pvu/mis/reports/departmentWisePendingStatus-pdf-download',
            DEPARTMENT_WISE_VERIFICATION: 'pvu/mis/reports/deptWiseVerification-pdf-download',
            EMPLOYEE_WISE_WORK_DONE: 'pvu/mis/reports/empWiseWorkdone-pdf-download',
            EVENT_STATUS: 'pvu/mis/reports/eventStatusReport-pdf-download',
            EMPLOYEE_WISE_MONTHLY_PROGRESS: 'pvu/mis/reports/employeeWiseMonthlyProgress-pdf-download',
            EMP_WISE_ALLOCATION: 'pvu/mis/reports/empWiseAllocation-pdf-download',
            DURATION_WISE_PENDING_CASES: 'pvu/mis/reports/durationWisePendingStatus-Pdf-download'
        },
        EXCEL: {
            CASE_INQUIRY: 'pvu/mis/reports/excelGeneration/caseInquiry',
            EMPLOYEE_CREATION: 'pvu/mis/reports/excelGeneration/employeeCreation',
            INWARD_CASES_FOR_ROP: 'pvu/mis/reports/excelGeneration/inwardCase',
            OUTWARD_CASES_FOR_EVENTS: 'pvu/mis/reports/excelGeneration/outwardCaseEvent',
            INWARD_CASES_FOR_EVENTS: 'pvu/mis/reports/excelGeneration/inwardCaseEvent',
            FORWARD_CASES_DDO_WISE: 'pvu/mis/reports/excelGeneration/forwardCaseDdo',
            RETURN_CASES: 'pvu/mis/reports/excelGeneration/returnCase',
            DDO_EVENT_STATUS: 'pvu/mis/reports/excelGeneration/ddoEventStatus',
            DDO_FORWARD_CASES: 'pvu/mis/reports/excelGeneration/ddoForwardCase',
            EVENT_WISE_PENDING_STATUS: 'pvu/mis/reports/excelGeneration/eventWisePendingStatus',
            DISTRICT_WISE_PENDING_STATUS: 'pvu/mis/reports/excelGeneration/districtWisePendingStatus',
            DISTRICT_WISE_VERIFICATION: 'pvu/mis/reports/excelGeneration/districtWise',
            DEPT_WISE_PENDING_STATUS: 'pvu/mis/reports/excelGeneration/departmentWisePendingStatus',
            DEPARTMENT_WISE_VERIFICATION: 'pvu/mis/reports/excelGeneration/depWiseVeriReport',
            EMPLOYEE_WISE_WORK_DONE: 'pvu/mis/reports/excelGeneration/empWiseWorkdone-event',
            EVENT_STATUS: 'pvu/mis/reports/excelGeneration/pvuEventStatus',
            EMPLOYEE_WISE_MONTHLY_PROGRESS: 'pvu/mis/reports/excelGeneration/employeeWiseMonthlyProgress',
            DURATION_WISE_PENDING_CASES: 'pvu/mis/reports/excelGeneration/durationWisePendingStatus',
            EMP_WISE_ALLOCATION: 'pvu/mis/reports/excelGeneration/empWiseAllocation'
        },
        LOOKUP: {
            CASE_INQUIRY: 'pvu/mis/reports/status_lookup',
            EMPLOYEE_CREATION: 'pvu/mis/reports/create_lookup',
            DDO_FORWARD_CASES: 'pvu/mis/reports/ddoforward_lookup',
            PVU_EVENTS_NINE_ROP: 'pvu/mis/reports/ddoforward_lookup',
            OUTWARD_CASES_FOR_EVENTS: 'pvu/mis/reports/pvuOutward_lookup',
            INWARD_CASES_FOR_EVENTS: 'pvu/mis/reports/getcommonscreen_lookup',
            PARENT_DEPARTMENT_LIST: 'pvu/mis/reports/department_lookup',
            DISTRICT_LIST: 'pvu/mis/reports/district_lookup',
            INWARD_CASES_FOR_ROP: 'pvu/mis/reports/inwardcase_lookup',
            FORWARD_CASES_DDO_WISE: 'pvu/mis/reports/ddoforward_lookup',
            EMPLOYEE_WISE_WORK_DONE: 'pvu/mis/reports/getEmpWiseWorkdoneLookup',
            EMPLOYEE_WISE_MONTHLY_PROGRESS: 'edp/msfinancialyear/201',
            EMP_WISE_ALLOCATION: 'pvu/mis/reports/getEmpWiseAllocationLookup'
        },
        DDOFORWARDCASES: {
            DDOFORWARDCASES_LOOKUP: 'pvu/mis/reports/ddoforward_lookup',
            PAYCOMMSIIOSNLIST: 'pvu/mis/reports/create_lookup'
        },
        FORWARDDDOWISE: {
            FORWARDDDOWISE_DISTRICT_LOOKUP: 'pvu/mis/reports/district_lookup',
            FORWARDDDOWISE_CARDEX_LOOKUP: 'pvu/transfer/getOfficeByDistrictId/301'
        },
        OUTWARDCASESEVENTSDIALOG: {
            OUTWARDCASESEVENTSDIALOG_GETLIST: 'pvu/mis/reports/outwardCase-event',
            EXCEL: 'pvu/mis/reports/excelGeneration/inwardCase',
            PDF: 'pvu/mis/reports/inwardCase-download'
        },
        REMARKS: {
            RETURN_CASES: 'pvu/mis/reports/trnRemarks',
            EMPLOYEE_WISE_WORK_DONE: 'pvu/mis/reports/trnRemarks'
        },
        EMPLOYEE_WISE_MONTHLY_PROGRESS: {
            EMP_LOOKUP: 'pvu/mis/reports/empWise_llokup'
        },
        EMP_WISE_ALLOCATION: {
            LOOKUP_TO_EMP: 'pvu/mis/reports/getEmpWiseAllocationEmployeeLookup'
        }
    },

    FIX_TO_REG: {
        SAVE_FIX_TO_REG: 'pvu/fixpaytoreg/fixtoreg/201',
        GET_PAY_SCALE: 'pvu/fixpaytoreg/getpayscale',
        GET_PAY_BAND: 'pvu/fixpaytoreg/getpayband',
        GET_GRADE_PAY: 'pvu/fixpaytoreg/getGradepay',
        GET_PAY_LEVEL: 'pvu/fixpaytoreg/getpaylevel',
        GET_CELL: 'pvu/fixpaytoreg/getcellvalue'
    }
};
