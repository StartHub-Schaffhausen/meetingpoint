import { Component,Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AlertController, ModalController } from '@ionic/angular';
import { Reservation } from 'src/app/models/reservation';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.page.html',
  styleUrls: ['./reservation.page.scss'],
})
export class ReservationPage implements OnInit {
  @Input() reservation: Reservation;

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private afs: AngularFirestore,
    ) { }

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

  async cancel(reservation) {

    console.log(reservation);

    const alert = await this.alertController.create({
      //cssClass: 'my-custom-class',
      header: 'Buchung stornieren?',
      message: 'Möchtest du die Buchung wirklich  <strong>stornieren</strong>?',
      buttons: [
        {
          text: 'Stornieren',
          role: 'cancel',
          cssClass: 'secondary',
          handler: async (blah) => {
            console.log('Confirm Cancel: blah');
            await this.afs.collection('users').doc(reservation.userId).collection('reservations').doc(reservation.id).delete();
            this.dismiss();
          }
        }, {
          text: 'Abbrechen',
          handler: () => {
            console.log('Confirm Okay');

          }
        }
      ]
    });

    await alert.present();
  }

}
