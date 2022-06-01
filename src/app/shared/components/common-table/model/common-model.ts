export interface ActionEventInterFace {
    action: string;
    data: any;
}

export interface ActionConfigInterface {
    matSortDisable: boolean;
    actions: ActionOptionInterface[];
}

export interface ActionOptionInterface {
    actionName: string; // To identify which action is been clicked ('edit')
    title: string; // Title for action button on hover ('Edit')
    ationClasses: string; // Classes for icon ('material-icons plus edit-icon')
    iconName: string; // Name to be provided in i tag ('edit')
    isDisable?: string; // Data key for disaplying purpose ('isDisable')
    isVisible?: string; // Data key for disaplying purpose ('isEditable')
}
