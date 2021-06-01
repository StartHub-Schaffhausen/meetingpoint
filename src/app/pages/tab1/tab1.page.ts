import { Component, OnInit } from '@angular/core';
import { AlertController, IonRouterOutlet, ModalController, ToastController } from '@ionic/angular';
import { DeskPage } from '../desk/desk.page';
import firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreCollection, SnapshotOptions } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Desk } from 'src/app/models/resources';
import { AddDeskPage } from '../add-desk/add-desk.page';
import { AuthService } from 'src/app/services/auth.service';
import { InvoicePage } from '../invoice/invoice.page';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{
  selectedDate: Date;

  minDate: Date;
  maxDate: Date;

  segment = 'today';
  user: firebase.User;

  items$: Observable<Desk[]>;
  private resourceRef: AngularFirestoreCollection<Desk>;

  constructor(
    public modalController: ModalController,
    private routerOutlet: IonRouterOutlet,
    private toastController: ToastController,
    private alertController: AlertController,
    private authService: AuthService,
    private afs: AngularFirestore
    ) {
      this.selectedDate = new Date();
      this.minDate = new Date();
      this.maxDate = new Date(Date.now() + 1000 * 60 * 60 * 90);

      this.resourceRef = this.afs.collection<Desk>('desks', ref=> ref.orderBy('name'));
      this.items$ = this.resourceRef.valueChanges({ idField: 'id' });

  }

  async ngOnInit(){
    const user: firebase.User = await this.authService.getUser();
    if (user){
      this.user = user;

      this.afs.collection('users').doc(user.uid)
      .collection('reservations',ref=>ref.where('statusPaid','==',false)).stateChanges(['added']).subscribe(data=>{
        data.forEach(element=>{
          console.log(element.payload.doc.data());

          this.presentInvoiceModal(element.payload.doc.data());
        });
      });
     /* this.afs.collection('users').doc(user.uid)
      .collection<any>('invoices').auditTrail().subscribe(console.log);*/

/*      firebase.firestore().collection('users').doc(user.uid).collection('invoices').onSnapshot((snapshot)=>{
        snapshot.docChanges({includeMetadataChanges:false}).forEach(change=>{
          if (change.type === 'added') {
            // change.doc here is new a new document
            console.log(change.doc.data());
            this.presentInvoiceModal(change.doc.data());
          }
        });
      });
      */

      /*this.afs.collection('users').doc(user.uid)
      .collection<any>('invoices').valueChanges().subscribe(snapshot=>{
        snapshot.forEach(invoice=>{
          console.log(invoice);
          this.presentInvoiceModal(invoice.payload.doc.data());
        });
      });*/

      /*this.afs.collection('users').doc(user.uid)
      .collection<any>('invoices').snapshotChanges(['added']).subscribe(snapshot=>{
        snapshot.forEach(invoice=>{
          console.log(invoice);
          this.presentInvoiceModal(invoice.payload.doc.data());
        });
      });*/
    }
  }


  addDesk(desk: Desk) {
    this.resourceRef.add(desk);
  }

  async addResource(){
    const modal = await this.modalController.create({
      component: AddDeskPage,
      //cssClass: 'my-custom-class',
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,

    });

    modal.onDidDismiss().then(data=>{
      console.log(data);
      if (data.data.booked){
        this.presentToasResource();
      }else{
        console.log('closed');
      }

    });

    return await modal.present();
  }

  async presentModal(desk: Desk) {

    console.log(desk);
    console.log(this.selectedDate);

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

    modal.onDidDismiss().then(async (data)=>{
      console.log(data);
      if (data.data.bookingId){
        this.presentToast();
        /*const user: firebase.User = await this.authService.getUserProfile();
        this.afs.collection('users').doc().collection('invoices').doc(data.data.bookingId).snapshotChanges().forEach(snap=>{
          console.log(snap.type);
          if (snap.type ==='added'){
            this.presentInvoiceModal(snap.payload.data());
            console.log(snap.payload.data());
          }
        });*/

      }else{
        console.log('closed');
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
  async presentToasResource() {
    const toast = await this.toastController.create({
      message: 'Erfolgreich hinzugefügt.',
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


  async presentInvoiceModal(invoice) {
    const modal = await this.modalController.create({
      component: InvoicePage,
      //cssClass: 'my-custom-class',
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps:{
        invoice
      }

    });
    return await modal.present();

  }

}
