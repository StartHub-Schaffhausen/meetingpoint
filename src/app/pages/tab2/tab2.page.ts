import { Component, ViewChild } from '@angular/core';
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
export class Tab2Page {
  @ViewChild(IonItemSliding) slidingItem: IonItemSliding;

  user: firebase.User;
  items: Observable<Reservation[]>;
  private rreservationCollection: AngularFirestoreCollection<Reservation>;
  constructor(
    private afs: AngularFirestore,
    public modalController: ModalController,
    private routerOutlet: IonRouterOutlet,
    public alertController: AlertController,
    private authService: AuthService) {

    this.authService.getUserProfile().then(user=>{

      if (user){
        this.rreservationCollection = this.afs.collection('users').doc(user.uid).collection<Reservation>('reservations');
        this.items = this.rreservationCollection.valueChanges();
      }
      this.user = user;

    });
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ReservationPage,
      //cssClass: 'my-custom-class',
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl

    });
    return await modal.present();

  }

  async cancel() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
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
