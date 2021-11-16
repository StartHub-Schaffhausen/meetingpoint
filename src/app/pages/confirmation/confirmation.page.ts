import { Component, OnInit,   Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { config } from 'src/app/config/config';
import { Desk } from 'src/app/models/resources';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.page.html',
  styleUrls: ['./confirmation.page.scss'],
})
export class ConfirmationPage implements OnInit {
  @Input() desk: Desk;
  @Input() bookingType: any;
  @Input() dateFrom: Date;
  @Input() dateTo: Date;
  @Input() price: any;
  @Input() bookingTypeDescription: any;

  config = config;

  constructor(
    private modalController: ModalController,
  ) { }

  ngOnInit() {
  }
  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      dismissed: true,
      confirmBooking: false,
      booking: null
    });
  }
  confirmBooking(){
      // using the injected ModalController this page
      // can "dismiss" itself and optionally pass back data
      this.modalController.dismiss({
        dismissed: true,
        confirmBooking: true,
      });
    }

}
