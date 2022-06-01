import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserCreationRoutingModule } from './user-creation-routing.module';
import { UserCreationListComponent } from './user-creation-list/user-creation-list.component';
import { UserCreationComponent } from './user-creation/user-creation.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxMaskModule } from 'ngx-mask';
@NgModule({
    declarations: [
        UserCreationListComponent,
        UserCreationComponent,
    ],
    imports: [
        // CommonModule,
        SharedModule,
        UserCreationRoutingModule,
        NgxMaskModule.forRoot(),
    ]
})
export class UserCreationModule { }
