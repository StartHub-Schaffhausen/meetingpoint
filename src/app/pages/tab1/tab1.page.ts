import { Component } from '@angular/core';
import { AlertController, IonRouterOutlet, ModalController, ToastController } from '@ionic/angular';
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
    private toastController: ToastController,
    private alertController: AlertController
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


  segmentChanged(event){
    console.log(event.detail.value);

    if(event.detail.value==='custom'){
      this.presentAlertPrompt();
    }

  }




  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      //cssClass: 'my-custom-class',
      header: 'Datum wählen:',
      inputs: [
        {
          name: 'name4',
          type: 'date',
          min: '2021-05-23',
          max: '2022-12-31'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: () => {
            console.log('Confirm Ok');
          }
        }
      ]
    });

    await alert.present();
  }




}
