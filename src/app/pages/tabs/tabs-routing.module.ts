import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('../dashboard/dashboard.module').then(m => m.DashboardPageModule),
        //canActivate: [AuthGuard],
      },
      {
        path: 'community',
        loadChildren: () => import('../community/community.module').then( m => m.CommunityPageModule)
        //canActivate: [AuthGuard],
      },
      {
        path: 'invoice-list',
        loadChildren: () => import('../invoice-list/invoice-list.module').then( m => m.InvoiceListPageModule)
        //canActivate: [AuthGuard],
      },
      {
        path: 'desks',
        loadChildren: () => import('../tab1/tab1.module').then(m => m.Tab1PageModule),
        //canActivate: [AuthGuard],
      },
      {
        path: 'reservations',
        loadChildren: () => import('../tab2/tab2.module').then(m => m.Tab2PageModule),
        //canActivate: [AuthGuard],

      },
      {
        path: 'faq',
        loadChildren: () => import('../faq/faq.module').then( m => m.FaqPageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('../tab3/tab3.module').then(m => m.Tab3PageModule),
        //canActivate: [AuthGuard],
      },
      {
        path: '',
        redirectTo: '/tabs/desks',
        pathMatch: 'full',
        //canActivate: [AuthGuard],
      }
    ],
    //canActivate: [AuthGuard],
  },
  {
    path: '',
    redirectTo: '/tabs/desks',
    pathMatch: 'full',
    //canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
