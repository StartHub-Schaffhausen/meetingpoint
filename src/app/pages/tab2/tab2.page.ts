import { Component, ViewChild, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AlertController, IonItemSliding, IonRouterOutlet, ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Reservation } from 'src/app/models/reservation';
import { AuthService } from 'src/app/services/auth.service';
import { ReservationPage } from '../reservation/reservation.page';
import firebase from 'firebase/app';
import 'firebase/auth';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  @ViewChild(IonItemSliding) slidingItem: IonItemSliding;

  user: firebase.User;
  reservation$: Observable<Reservation[]>;
  private reservationCollection: AngularFirestoreCollection<Reservation>;
  constructor(
    private afs: AngularFirestore,
    public modalController: ModalController,
    private routerOutlet: IonRouterOutlet,
    public alertController: AlertController,
    private authService: AuthService
    ) {
  }
  async ngOnInit(){
    const user: firebase.User = await this.authService.getUserProfile();
    if (user){
      this.reservationCollection = this.afs.collection('users').doc(user.uid).collection<Reservation>('reservations');
      this.reservation$ = this.reservationCollection.valueChanges();
      this.user = user;
    }
  }

  async presentModal(reservation) {
    const modal = await this.modalController.create({
      component: ReservationPage,
      //cssClass: 'my-custom-class',
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps:{
        reservation
      }

    });
    return await modal.present();

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
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
            this.slidingItem.close();

            this.reservationCollection.doc(reservation.id).delete();
          }
        }, {
          text: 'Abbrechen',
          handler: () => {
            console.log('Confirm Okay');
            this.slidingItem.close();

          }
        }
      ]
    });

    await alert.present();
  }


}
