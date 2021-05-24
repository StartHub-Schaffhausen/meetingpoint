import { Component, ViewChild } from '@angular/core';
import { AlertController, IonItemSliding, IonRouterOutlet, ModalController } from '@ionic/angular';
import { ReservationPage } from '../reservation/reservation.page';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  @ViewChild(IonItemSliding) slidingItem: IonItemSliding;

  constructor(public modalController: ModalController, private routerOutlet: IonRouterOutlet, public alertController: AlertController) {


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
