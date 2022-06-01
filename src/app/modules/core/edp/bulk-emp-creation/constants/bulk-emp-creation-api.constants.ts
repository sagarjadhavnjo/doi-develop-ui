export const API = {
    LIST_PAGE: {
        GET_SEARCHED_LIST: 'budget/agupload/getAgUploadList/201',
        DELETE: 'budget/agupload/deleteAgUploadHeader/501'
    },
    CREATE: {
        GET_DDLS: 'budget/agupload/201',
        CREATE_HDR: 'budget/agupload/saveAgUploadHeader/101',
        SUBMIT_AG_UPLOAD: 'budget/agupload/101',
        GET_HDR: 'budget/agupload/getAgUploadHeader/201'

    },
    BEC_TRANSACTION :  {
        CREATE: 'edp/usercreation/101',
        SUBMIT: 'edp/usercreation/submit/101',
        ATTACHMENTS: {
            GET_UPLOADED_ATTACH: 'common/attachment/201',
            ATTACH_UPLOAD: 'common/attachment/101',
            ATTACH_DOWNLOAD: 'common/attachment/filenet/download/901'
        }
    }
};

