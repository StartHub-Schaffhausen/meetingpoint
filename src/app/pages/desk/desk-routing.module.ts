import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeskPage } from './desk.page';

const routes: Routes = [
  {
    path: '',
    component: DeskPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeskPageRoutingModule {}
