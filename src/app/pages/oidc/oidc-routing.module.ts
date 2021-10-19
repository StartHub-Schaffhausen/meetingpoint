import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OidcPage } from './oidc.page';

const routes: Routes = [
  {
    path: '',
    component: OidcPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OidcPageRoutingModule {}
