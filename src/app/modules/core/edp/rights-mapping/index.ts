export const RIGHT_MAPPING = {
    DISTRICT_LIST: 'edp/userrolemapping/getDistrictByStateId/201',
    USER_POST_LIST: 'edp/msuser/511',
    // MODULE_LIST: 'edp/msmodule/modules/201',
    SUB_MODULE_LIST_BY_MODULE_ID: 'edp/mssubmodule/301',
    MENU_LIST_BY_SUB_MODULE_ID: 'edp/msmenu/411',
    MENU_LIST_BY_MODULE_ID: 'edp/msmenu/708',
    MODULE_LIST_NONDAT: 'edp/userrolemapping/getOfficeModule/201',
    SUB_MODULE_LIST_BY_MODULE_ID_NONDAT: 'edp/userrolemapping/getSubModuleOrMenu/201',
    MENU_LIST_BY_SUB_MODULE_ID_NONDAT: 'edp/userrolemapping/getMenuForSubmodule/201',
    WORKFLOW_LIST_NONDAT: 'edp/userrolemapping/getWorkflowByUserMenuId/201',
    USER_RIGHTS_MAPPED_APPROVED_NONDAT: 'edp/userrolemapping/approvedrights/201',
    USER_RIGHTS_MAPPED: 'edp/msuser/801',
    // USER_RIGHTS_MAPPED_APPROVED: 'edp/userrolemapping/savedRights/301',
    USER_RIGHTS_MAPPED_APPROVED: 'edp/msuser/approvedrights/801',
    USER_RIGHTS_EDITVIEW_APPROVED: 'edp/userrolemapping/savedRights/301',
    USER_RIGHTS_EDIT_MODULESSUMODULES: 'edp/userrolemapping/getMenuOfficeDetails/201',

    // USER_RIGHTS_USERROLE_APPROVED: 'edp/userrolemapping/approvedrights/201',
    USER_RIGHTS_MAPPED_UN_APPROVED: 'edp/msuser/savedrights/801',
    USER_RIGHTS_MAPPED_BY_MENU_APPROVED: 'edp/userrolemapping/getPostByMenuOffId/201',
    PERMISSIONS_BY_MENU: 'edp/msrole/201',
    SAVE_RIGHTS: 'edp/usermenurole/101',
    // SUBMIT_RIGHTS: 'edp/userrolemapping/rolemapping/102',
    // DELETE_RIGHTS: 'edp/userrolemapping/501',
    DELETE_RIGHTS: 'edp/userrolemapping/deleteSavedRoleMappings/401',
    DELETE_TRANSACTION: 'edp/usermenurole/501',
    SUBMIT_RIGHTS: 'edp/usermenurole/901',
    STATUS_LIST: 'edp/lulookupinfo/getbyname/201',
    OFFICE_DETAIL_BY_DISTRICT: 'edp/msoffice/officedetails/district/201',
    TRANSACTION_RIGHTS: 'edp/userrolemapping/702',
    GETEMPBYOFFID: 'edp/userrolemapping/getEmpByOffId/201',
    // GETEMPBYOFFID:'edp/userrolemapping/getEmpByOffId/702',
    WORKFLOW_LIST: 'edp/userrolemapping/getWorkflowByUserMenuId/201',
    ATTECHMENT: {
        GET_ALL: 'edp/attachment/userrolemp/302',
        ADD: 'edp/attachment/userrolemp/101',
        DELETE: 'edp/attachment/userrolemp/902',
        DOWNLOAD_FILE: 'edp/attachment/userrolemp/901',
        GET_MASTER: 'edp/attachment/userrolemp/904'
    },
    SEARCH: {
        ALL: 'edp/userrolemapping/201'
    },
    SAVE_USER_RIGHTS: 'edp/userrolemapping/101',
    DELETE_SAVED_USER_RIGHTS_RECORDS: 'edp/userrolemapping/deleteRoleMappings/401',
    WF_COMMON_HEADER: 'edp/alias/wf/commonHeader/201',
    WF_CHECK_FOR_WORKFLOW : 'edp/userrolemapping/checkForWorkflow/201',
    SEARCH_STATUS: 'edp/userrolemapping/searchStatus/301'

};

export const ERROR_MESSAGES = {
    DISTRICT : 'Please select district',
    DDO_OFFICE: 'Please enter valid DDO No. and Cardex No.',
    CARDEX_NO: 'Please enter Cardex No.',
    DDO_NO: 'Please enter DDO No.',
    ATTACHMENT : {
        LARGE_FILE: 'dsadsa'
    }
};
