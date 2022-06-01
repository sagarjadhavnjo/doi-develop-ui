import { RightMappingListComponent } from './right-mapping-list/right-mapping-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RightMappingComponent } from './right-mapping/right-mapping.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'list',
                component: RightMappingListComponent
            },
            {
                path: ':action',
                component: RightMappingComponent
            },
            {
                path: ':action/:id/:ddo/:cardex/:districtId/:districtName/:status/:trnNo/:trnDate/:isWfStatusDraft',
                component: RightMappingComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RightMappingRoutingModule { }
