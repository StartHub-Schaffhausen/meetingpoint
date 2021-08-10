import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';

import { Tab1PageRoutingModule } from './tab1-routing.module';
import { InvoicePageModule } from '../invoice/invoice.module';
import { AddDeskPageModule } from '../add-desk/add-desk.module';
import { ConfirmationPageModule } from '../confirmation/confirmation.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab1PageRoutingModule,
    ConfirmationPageModule,
    InvoicePageModule,
    AddDeskPageModule
  ],
  declarations: [Tab1Page]
})
export class Tab1PageModule {}
