import { Component } from '@angular/core';
import { IonRouterOutlet, ModalController, ToastController } from '@ionic/angular';
import { DeskPage } from '../desk/desk.page';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  constructor(
    public modalController: ModalController,
    private routerOutlet: IonRouterOutlet,
    private toastController: ToastController
    ) {
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: DeskPage,
      //cssClass: 'my-custom-class',
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl
    });

    modal.onDidDismiss().then(data=>{
      console.log(data);
      if (data.role){
        console.log('closed');
      }else{
        this.presentToast();
      }
    });

    return await modal.present();

  }


  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Buchung bestätigt.',
      color: 'success',
      position: 'bottom',
      duration: 2000
    });
    toast.present();
  }


}
