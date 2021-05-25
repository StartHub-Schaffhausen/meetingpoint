import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddDeskPage } from './add-desk.page';

const routes: Routes = [
  {
    path: '',
    component: AddDeskPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddDeskPageRoutingModule {}
