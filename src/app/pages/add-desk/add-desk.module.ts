import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddDeskPageRoutingModule } from './add-desk-routing.module';

import { AddDeskPage } from './add-desk.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddDeskPageRoutingModule
  ],
  declarations: [AddDeskPage]
})
export class AddDeskPageModule {}
