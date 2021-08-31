import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InvoiceListPage } from './invoice-list.page';

const routes: Routes = [
  {
    path: '',
    component: InvoiceListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvoiceListPageRoutingModule {}
