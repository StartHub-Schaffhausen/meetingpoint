import { Component,Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Reservation } from 'src/app/models/reservation';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.page.html',
  styleUrls: ['./reservation.page.scss'],
})
export class ReservationPage implements OnInit {
  @Input() reservation: Reservation;

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    console.log(this.reservation);
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      dismissed: true
    });
  }

  bookReservation() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      dismissed: true,
      reservation: true
    });
  }

}
