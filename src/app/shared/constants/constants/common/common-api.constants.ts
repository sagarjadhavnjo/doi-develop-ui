export const APIConst = {
    LOGIN: 'edp/oauth/token',
    user: 'edp/api/getuser',
    LOGOUT: 'edp/oauth/revoketoken',
    EXTEND_SESSION: 'edp/oauth/token/refreshtoken',
    GET_CONDITIONAL_IDS: 'edp/lulookupinfo/getbyname/201',
    STATUS_CODE: {
        AUTHENTICATION_FAILED: 401
    },
    HEADER: {
        GET_ALL_FINANCIAL_YEARS: 'edp/msfinancialyear/201',
        GET_ALL_DEPARTMENTS: 'edp/msdepartment/getbyuserid/201',
        GET_ALL_DEPT: 'edp/msdepartment/idcode/201',
        
        GET_ALL_BRANCH: 'edp/msbranch/getbydepartmentid/301',
        // GET_ALL_ESTIMATE_FROM: 'edp/msoffice/getbyuserid/201',
        GET_ESTIMATE_FROM: 'edp/msoffice/estimationfromname',
        GET_ALL_ESTIMATE_FOR: 'edp/msoffice/estimationby/getbyofficeid/809',
        GET_ALL_DEMAND: 'budget/msdmand/getbydepartmentid/301',
        GET_REVENUE_CAPITAL: 'edp/lulookupinfo/getbyname/201',
        GET_ALL_MAJOR_HEAD: 'budget/msmajorhead/getbydemandid/301',
        GET_ALL_SUB_MAJOR_HEAD: 'budget/mssubmajorhead/getbymajorheadid/301',
        GET_SUB_MAJOR_HEAD_BYMAJOR_ID: 'budget/mssubmajorhead/bymajorid/301',
        GET_ALL_MINOR_HEAD: 'budget/msminorrhead/getbysubmajorheadid/301',
        GET_ALL_MINOR_HEAD_BYMAJOR_ID: 'budget/msminorrhead/findByMajorAndSubMajorHead',
        GET_ALL_SUB_HEAD: 'budget/mssubhead/getbyminorheadid/301',
        GET_ALL_SUB_HEAD_BYMAJOR_ID: 'budget/mssubhead/findSubHeadByMinorHeadAndSubMajorId',
        GET_ALL_DETAIL_HEAD: 'budget/detailhead/getbysubheadid/301',
        GET_ALL_DETAIL_HEAD_BYMAJOR_ID: 'budget/detailhead/findBySubMajorHeadId',
        SCHEME_LIST: 'budget/msschemetype/getactiveschemetypes/201',
        FORM_LIST: 'budget/msform/getactiveform/201',
        ITEM_CATEGORY_LIST: 'budget/msitemcategory/getactivecategory/201',
        GET_ALL_OBJECT_HEAD: 'budget/msobjecthead/getAllObjectHead',
        GET_RECIPET_OBJECT_HEAD: 'budget/receiptObjecthead/getAllObjectHead',
    },
    PROFILE: {
        USER_PROFILE: 'edp/msuser/userphoto/201',
        SWITCH_POST: 'edp/oauth/changepost'
    },

    SEARCH: {
        SEARCH_ALL: 'budget/sc/establishmentDetailHeader/201'
    }
};
