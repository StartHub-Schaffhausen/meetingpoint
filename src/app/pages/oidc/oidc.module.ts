import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OidcPageRoutingModule } from './oidc-routing.module';

import { OidcPage } from './oidc.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OidcPageRoutingModule
  ],
  declarations: [OidcPage]
})
export class OidcPageModule {}
