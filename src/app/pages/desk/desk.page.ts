import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Reservation } from 'src/app/models/reservation';
import { Desk } from 'src/app/models/resources';

@Component({
  selector: 'app-desk',
  templateUrl: './desk.page.html',
  styleUrls: ['./desk.page.scss'],
})
export class DeskPage implements OnInit {
  @Input() desk: Desk;
  @Input() selectedDate: Date;

  reservation: Reservation;
  minDate: Date;
  maxDate: Date;

  constructor(private modalController: ModalController) {
    this.minDate = new Date();
    this.maxDate = new Date(Date.now() + 1000 * 60 * 60 * 90);
   }

   ngOnInit(){

    this.reservation = {
      date: this.selectedDate,
      bookingMorning: false,
      bookingAfternoon: false,
      bookingDay: false,
      bookingWeek: false,
      userId: '',
      bookingCreated: new Date(),
      reservationType:  'day'
    };
    console.log(this.reservation);
   }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss();
  }
}
