import { Component } from '@angular/core';
import { AlertController, IonRouterOutlet, ModalController, ToastController } from '@ionic/angular';
import { DeskPage } from '../desk/desk.page';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Desk } from 'src/app/models/resources';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  minDate: Date;
  maxDate: Date;

  selectedDate: Date;
  segment = 'today';
  items: Observable<Desk[]>;
  // eslint-disable-next-line @typescript-eslint/member-ordering
  private resourcesCollection: AngularFirestoreCollection<Desk>;


  constructor(
    public modalController: ModalController,
    private routerOutlet: IonRouterOutlet,
    private toastController: ToastController,
    private alertController: AlertController,
    private afs: AngularFirestore
    ) {
      this.resourcesCollection = afs.collection<Desk>('resources');
      this.items = this.resourcesCollection.valueChanges();
      this.selectedDate = new Date();
      this.minDate = new Date();
      this.maxDate = new Date(Date.now() + 1000 * 60 * 60 * 90);
  }
  addDesk(desk: Desk) {
    this.resourcesCollection.add(desk);
  }

  async presentModal(desk: Desk) {
    const modal = await this.modalController.create({
      component: DeskPage,
      //cssClass: 'my-custom-class',
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps:{
        desk,
        selectedDate: this.selectedDate
      }
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

    this.segment = event.detail.value;

    if(event.detail.value==='custom'){
      this.presentAlertPrompt();
    } else if(event.detail.value==='today'){
      this.selectedDate = new Date();
    } else if (event.detail.value ==='tomorrow'){
      this.selectedDate = new Date(Date.now() + 1000 * 60 * 60 * 24);
    }

    console.log('new selected date: '  + this.selectedDate);
  }




  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      //cssClass: 'my-custom-class',
      header: 'Datum wählen:',
      inputs: [
        {
          name: 'dateSelected',
          type: 'date',
          min: '2021-05-23',
          max: '2022-12-31'
        }
      ],
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Datum wählen',
          handler: (event: any) => {
            console.log('Confirm Ok ');

            this.selectedDate = new Date(event.dateSelected);
            console.log('new selected date: '  + this.selectedDate);
          }
        }
      ]
    });

    await alert.present();
  }




}
