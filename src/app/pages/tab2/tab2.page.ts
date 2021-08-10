import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AlertController, IonItemSliding, IonRouterOutlet, ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Reservation } from 'src/app/models/reservation';
import { AuthService } from 'src/app/services/auth.service';
import { ReservationPage } from '../reservation/reservation.page';
import firebase from 'firebase/app';
import 'firebase/auth';
import { config } from 'src/app/config/config';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  //@ViewChild(IonItemSliding) slidingItem: IonItemSliding;
  deskConfig = config.offer;
  user: firebase.User;
  reservation$: Observable<Reservation[]>;
  reservationPast$: Observable<Reservation[]>;
  private reservationCollection: AngularFirestoreCollection<Reservation>;
  private reservationCollectionPast: AngularFirestoreCollection<Reservation>;
  constructor(
    private afs: AngularFirestore,
    public modalController: ModalController,
    private routerOutlet: IonRouterOutlet,
    public alertController: AlertController,
    private authService: AuthService
    ) {
  }
  async ngOnInit(){
    const user: firebase.User = await this.authService.getUser();
    if (user){
      this.reservationCollection = this.afs.collection('users').doc(user.uid)
      .collection<Reservation>('reservations', ref => ref.where('dateTo', '>=', new Date())
      .orderBy('dateTo'));
      this.reservation$ = this.reservationCollection.valueChanges({ idField: 'id' });

      this.reservationCollectionPast = this.afs.collection('users').doc(user.uid)
      .collection<Reservation>('reservations', ref => ref.where('dateTo', '<', new Date())
      .orderBy('dateTo'));
      this.reservationPast$ = this.reservationCollectionPast.valueChanges({ idField: 'id' });
      this.user = user;
    }
  }

  /*async addReservation() {
    const modal = await this.modalController.create({
      component: DeskPage,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
    });

    modal.onDidDismiss().then(data=>{
      console.log(data);
    });

    return await modal.present();
  }*/


  async presentModal(reservation) {
    const modal = await this.modalController.create({
      component: ReservationPage,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps:{
        reservation,
      }
    });
    return await modal.present();
  }

  async pay(slidingItem: IonItemSliding, reservation) {

    await Browser.open({ url: reservation.stripeInvoiceUrl });
    slidingItem.close();
  }

  async cancel(slidingItem: IonItemSliding, reservation) {

    console.log(reservation);

    const alert = await this.alertController.create({
      header: 'Reservation stornieren?',
      message: 'Möchtest du die Buchung wirklich  <strong>stornieren</strong>?',
      buttons: [
        {
          text: 'Reservation stornieren',
          role: 'cancel',
          cssClass: 'secondary',
          handler: async (blah) => {
            console.log('stornieren');
            slidingItem.close();
            await this.reservationCollection.doc(reservation.id).delete();
          }
        }, {
          text: 'Abbrechen',
          handler: () => {
            console.log('Confirm Okay');
            slidingItem.close();

          }
        }
      ]
    });

    await alert.present();
  }


}
