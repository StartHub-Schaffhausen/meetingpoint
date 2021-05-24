import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-desk',
  templateUrl: './desk.page.html',
  styleUrls: ['./desk.page.scss'],
})
export class DeskPage implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() {
  }


  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss();
  }
}
