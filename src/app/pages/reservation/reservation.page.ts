import { Component,Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AlertController, ModalController } from '@ionic/angular';
import { Reservation } from 'src/app/models/reservation';
import { config } from 'src/app/config/config';
import { Browser } from '@capacitor/browser';
import firebase from 'firebase/app';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.page.html',
  styleUrls: ['./reservation.page.scss'],
})
export class ReservationPage implements OnInit {
  @Input() reservation: Reservation;
  config = config;
  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private authService: AuthService,
    private afs: AngularFirestore,
    ) { }

  ngOnInit() {
    console.log(this.reservation);
  }
  async openLink(link) {
    await Browser.open({ url: link });
  };
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
          text: 'Buchung stornieren',
          role: 'cancel',
          cssClass: 'secondary',
          handler: async (blah) => {
            console.log('stornieren');
            console.log(reservation.userId);
            console.log(reservation.id);
            const user: firebase.User = await this.authService.getUser();

            await this.afs.collection('users').doc(user.uid).collection('reservations').doc(reservation.id).delete();
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
