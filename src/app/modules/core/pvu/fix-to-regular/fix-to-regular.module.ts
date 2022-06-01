import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FixToRegularRoutingModule } from './fix-to-regular-routing.module';
import { FixToRegularComponent } from './fix-to-regular/fix-to-regular.component';
import { FixToRegularListComponent } from './fix-to-regular-list/fix-to-regular-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
// import { PostComponentComponent } from './post-component/post-component.component';
import { FifthCommitionPayComponent } from './fifth-commition-pay/fifth-commition-pay.component';
import { SixCommitionPayComponent } from './six-commition-pay/six-commition-pay.component';
import { SevenCommitionPayComponent } from './seven-commition-pay/seven-commition-pay.component';
import { PayScaleValidationDirective } from './directive/pay-scale-validation.directive';
import { ValidatePaybandValueDirective } from './directive/validate-payband-value.directive';
import { FixToRegularAttachmentComponent } from './fix-to-regular-attachment/fix-to-regular-attachment.component';



@NgModule({
  declarations: [
    FixToRegularComponent,
    FixToRegularListComponent,
    FixToRegularComponent,
    FixToRegularListComponent,
    FifthCommitionPayComponent,
    SixCommitionPayComponent,
    SevenCommitionPayComponent,
    PayScaleValidationDirective,
    ValidatePaybandValueDirective,
    FixToRegularAttachmentComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FixToRegularRoutingModule,
  ]
})
export class FixToRegularModule { }
