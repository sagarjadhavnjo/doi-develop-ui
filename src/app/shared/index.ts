export class PageConfiguration {
    pageSizeOptions: Array<Number>;
    totalElements: number;
    pageSize: number;
    pageIndex: number;
}

// Sample for table header
export const EMPLOYEE_LIST_TABLE_HEADER_DATAKEY_MAP = [
    {
        'dataKey': 'position',
        'tableHeader': 'Sr No.'
    },
    {
        'dataKey': 'employeeNo',
        'tableHeader': 'Employee No.'
    },
    {
        'dataKey': 'empName',
        'tableHeader': 'Employee Name'
    },
    {
        'dataKey': 'caseNo',
        'tableHeader': 'Case No.'
    },
    {
        'dataKey': 'designation',
        'tableHeader': 'Designation'
    },
    {
        'dataKey': 'classLevel',
        'tableHeader': 'Class'
    },
    {
        'dataKey': 'dob',
        'tableHeader': 'DOB'
    },
    {
        'dataKey': 'doj',
        'tableHeader': 'DOJ (GoG)'
    },
    {
        'dataKey': 'pan',
        'tableHeader': 'PAN'
    },
    {
        'dataKey': 'officeName',
        'tableHeader': 'Office Name'
    },
    {
        'dataKey': 'status',
        'tableHeader': 'Status'
    },
    {
        'dataKey': 'wfTrnStatus',
        'tableHeader': 'Workflow Status'
    },
    {
        'dataKey': 'action',
        'tableHeader': 'Action',
        'configuration': {
            'matSortDisable': false,
            'actions': [{
                'actionName': 'edit', // To identify which action is been clicked
                'title': 'Edit', // Title for action button on hover
                'actionClass': 'material-icons plus edit-icon', // Classes for icon
                'iconName': 'edit', // Name to be provided in i tag
                'isDisable': 'isDisable', // Data key for disaplying purpose
                'isVisible': 'isEditable' // Data key for disaplying purpose
            }]
        }
    }];

const ADMIN_APPR_LIST_TABLE_HEADER_DATAKEY_MAP = [
    {
        'dataKey': 'position',
        'tableHeader': 'Sr No.',
        'matSortDisable': true, // Pass true if want to disable sorting. By default sorting will be enabled
        'rowSpan': '2', // row span if colspan is applied
        'width': '1%'
    },
    {
        'dataKey': 'budgetHead',
        'tableHeader': 'Budget Head',
        // 'actionName': 'testHyperLink', // Pass actionName if want column to be treated as action or link
        'rowSpan': '2',
        'width': '10%'
    },
    {
        'dataKey': 'typeOfEstimate',
        'tableHeader': 'Type of Estimate',
        'colSpan': '2', // Col span if want to make 2 column and do not pass after number of times
        'dataColumnHeader': 'Estimate Check', // Column header if want to dispaly above colspan columns
        'width': '10%'
    },
    {
        'dataKey': 'itemName',
        'tableHeader': 'Item Work Name',
        'width': '25%'
    },
    {
        'dataKey': 'proposedAmountByFd',
        'tableHeader': '',
        'rowSpan': '2',
        'width': '9%'
    },
    {
        'dataKey': 'refNo',
        'tableHeader': 'Reference No.',
        'rowSpan': '2',
        'width': '7%'
    },
    {
        'dataKey': 'recFromRecOn',
        'tableHeader': 'Received From Received On',
        'rowSpan': '2',
        'width': '8%'
    },
    {
        'dataKey': 'sentToSentOn',
        'tableHeader': 'Sent To Sent On',
        'rowSpan': '2',
        'width': '8%'
    },
    {
        'dataKey': 'lyingWith',
        'tableHeader': 'Lying With',
        'rowSpan': '2',
        'width': '5%'
    },
    {
        'dataKey': 'wfStatus',
        'tableHeader': 'Workflow Status',
        'colSpan': '2',
        'dataColumnHeader': 'Admin Approve Check',
        'width': '5%'
    },
    {
        'dataKey': 'trnStatus',
        'tableHeader': 'Status',
        'width': '5%'
    },
    {
        'dataKey': 'action',
        'tableHeader': 'Action',
        'width': '6%',
        'rowSpan': '2',
        'matSortDisable': true, // Pass true if want to disable sorting. By default sorting will be enabled
        'configuration': {
            'actions': [
                {
                    'actionName': 'new',
                    'title': 'Initiate Administrative Approval',
                    'actionClass': 'material-icons plus view-icon',
                    'iconName': 'open_in_new',
                    'isDisable': 'isDisable',
                    'isVisible': 'isInitiateVisible'
                }, {
                    'actionName': 'edit',
                    'title': 'Edit',
                    'actionClass': 'material-icons plus edit-icon',
                    'iconName': 'edit',
                    'isDisable': 'isDisable',
                    'isVisible': 'isEditVisible'
                },
            ]
        }
}];
