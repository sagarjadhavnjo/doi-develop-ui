# Description for Common Pagination
This documents will give you step by step instrucions how to integrate common dynamic pagination with mat-table for the perticular menu. It also covers the customized sorting and serching functionality.

## Step 1 - Integrate Common Table Component
You have to integrate a common component whenever required. There are some input and output parameters that will help you in customizing the searching sorting and pagination. All the parameters are explained below with the example.
#### HTML code

    <app-common-table
        [tableData] = "storedData"
        [tableHeaderDataKeyMap] ="TABLE_HEADER_DATA_CONFIG"
        [showFirstLastButtons] = "true"
        [pageConfiguration] = "pageConfiguration"
        (pageChange) = "pageChange($event)"
        (actionEvent) = "actionEvent($event)"
        (sortChange) = "sortChange($event)"
        [refreshData] = "newSearch">
    </app-common-table>


    
> Parameter Explaination given below:

## Step 2 - Pass Parameters According to Needs

#### Input Parameters

+ **tableData**
	+ (Input Data Recieved from list parameter)
+ **tableHeaderDataKeyMap**
	+ (Header data config to show Table Header)
+ **showFirstLastButtons**
	+ (Show First and Last buttons of pagination (True Or False))
		E.g.:  true, false
+ **pageConfiguration**
+ Page Configuration To Configure Pagination and Page size

#### JSON code

```
pageConfiguration = 
{
	pageSizeOptions: [5, 10, 25],
	totalElements: 0,
   	pageSize: 25,
	pageIndex: 0,
};
```


+ **refreshData**
+ If new Data is searched, then true will be passed

####OutPut Parameters

+ **pageChange**
	+ Pagination change event fired to handle event.
+ **actionEvent**
	+ Handle actions event accordingly.
+ **sortChange**
	+ Sort changing event to handle.

## Step  3 - json explaination to be passed in tableHeaderDataKeyMap
#### JSON code

  ```
  [{
        'dataKey': 'position',
        'tableHeader': 'Sr No.',
        'matSortDisable': true,
        'width': '1%'
    },
    {
        'dataKey': 'budgetHead',
        'tableHeader': 'Budget Head',
        'width': '10%'
    },
    {
    'dataKey': 'action',
    'tableHeader': 'Action',
    'width': '6%',
    'rowSpan': '2',
    'matSortDisable': true, 
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
```


+ **dataKey** - dataKey means recieved from backend for column
+ **tableHeader** - Header to be displayed in Column Header
+ **matSortDisable** - If want to disable sort then, pass true. Default will be false.
+ **width** - width to set for pericular column.
+ **Row Span And Col Span**: - If not passed it will take by default one
	+ **rowSpan** - rowspan count to be padssed for that perticular column
	+ **colSpan** - colspan count to be padssed for that perticular column and row.


##### ActionConfiguration

+ **actionName** - Action Name Which will be passed in action event to handle the event
+ **title** - Title To be displayed When hovering the action
+ **actionClass** - Action Class To be applied to i tag
+ **iconName** - Icon Name To be passed in 'i' tag.
+ **isDisable** - If want to disable the Icon pass true or false on condition.
+ **isVisible** - It hides the icon according condition yo passed.



## Further help

To get more help the common table code 
[For Sample File](../../index.ts).
+ Administrative Approval Example
    + [TS-File](../../../modules/core/budget/administrative-approval/administrative-approval-list/administrative-approval-list.component.ts)
    + [HTML-File](../../../modules/core/budget/administrative-approval/administrative-approval-list/administrative-approval-list.component.html)
