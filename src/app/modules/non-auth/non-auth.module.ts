import { NotificationComponent } from './notification/notification.component';
import { AuthenticationService } from 'src/app/modules/services';
import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { NonAuthRoutingModule } from './non-auth-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
    imports: [NonAuthRoutingModule, SharedModule],
    declarations: [LoginComponent, NotificationComponent],
    entryComponents: [NotificationComponent],
    providers: [AuthenticationService]
})
export class NonAuthModule {}
