import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InvoiceListPageRoutingModule } from './invoice-list-routing.module';

import { InvoiceListPage } from './invoice-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InvoiceListPageRoutingModule
  ],
  declarations: [InvoiceListPage]
})
export class InvoiceListPageModule {}
