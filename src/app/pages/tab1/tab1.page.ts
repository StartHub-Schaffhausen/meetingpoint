import {
  Component,
  OnInit,
} from '@angular/core';
import {
  AlertController,
  IonRouterOutlet,
  LoadingController,
  ModalController,
  ToastController
} from '@ionic/angular';
import {
  config
} from 'src/app/config/config';
import {
  AngularFirestore,
  DocumentReference
} from '@angular/fire/firestore';
import {
  first
} from 'rxjs/operators';

import firebase from 'firebase/app';

import {
  addBusinessDays,
  addMonths,
  subBusinessDays
} from 'date-fns'
import {
  AuthService
} from 'src/app/services/auth.service';
import {
  Reservation
} from 'src/app/models/reservation';
import {
  Desk
} from 'src/app/models/resources';
import {
  InvoicePage
} from '../invoice/invoice.page';
import { AddDeskPage } from '../add-desk/add-desk.page';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  selectedStartDate: Date = new Date();
  selectedEndDate: Date = new Date();

  showBack: boolean = false;
  showNext: boolean = true;

  selectedTarif = 'Day';

  deskConfig = config.offer;

  freeDesks: any[] = [];

  constructor(
    public modalController: ModalController,
    private routerOutlet: IonRouterOutlet,
    public alertController: AlertController,
    public toastController: ToastController,
    public loadingController: LoadingController,
    private afs: AngularFirestore,
    private authService: AuthService,
  ) {
    this.selectedStartDate.setHours(8, 0, 0);
    this.selectedEndDate.setHours(18, 0, 0);
  }

  async ngOnInit() {

    this.getReservations(this.selectedStartDate, this.selectedEndDate, this.selectedTarif);
  }

  async getReservations(startDate, endDate, tarif) {

    this.freeDesks = [];

    const loading = await this.loadingController.create({
      //cssClass: 'my-custom-class',
      message: 'Bitte warten, wir laden die verfügbaren Angebote',
      //duration: 2000
    });
    await loading.present();

    const ref$ = this.afs.collection('desks', ref => ref.where('active', '==', true).orderBy('name', 'asc')).get();
    const desk = await ref$.pipe(first()).toPromise();

    //Loop über Desk
    for (const deskElement of desk.docs) {

      //Lese Tages-Reservationen

      if (tarif == 'Day' || tarif == 'Morning' || tarif == 'Afternoon') {
        const deskReservationRef$ =
          this.afs.collection('desks').doc(deskElement.id)
          .collection('reservations').doc(startDate.toISOString().substr(0, 10)).get();

        const deskReservation: any = await deskReservationRef$.pipe(first()).toPromise();
        if (!deskReservation.exists) { //Falls keine Reservation vorhanden, dann hinzufügen
          this.freeDesks.push(deskElement.data());
        }

      } else { //Lese Mehrtagesreservationen
        let isFree = true;
        let deskname: any = deskElement.data();

        for (let i = startDate.getTime(); i <= endDate.getTime(); i = addBusinessDays(new Date(i), 1).getTime()) {

          let date = new Date(i);

          const deskReservationMultiRef$ =
            this.afs.collection('desks').doc(deskElement.id)
            .collection('reservations').doc(date.toISOString().substr(0, 10)).get();

          const deskReservationMulti: any = await deskReservationMultiRef$.pipe(first()).toPromise();
          if (deskReservationMulti.exists) { //Falls keine Reservation vorhanden, dann hinzufügen
            isFree = false
          }

        }

        if (isFree) {
          this.freeDesks.push(deskElement.data());
        }

      }

    }

    await loading.dismiss();
    const toast = await this.toastController.create({
      message: 'Angebote aktualisiert',
      duration: 2000,
      color: 'success'
    });
    toast.present();

  }

  changeTarif(event) {

    this.selectedTarif = event.detail.value;
    this.selectedStartDate.setHours(8, 0, 0);
    this.selectedEndDate.setHours(18, 0, 0);

    if (this.selectedTarif == 'Morning') {
      this.selectedEndDate = this.selectedStartDate;
      this.selectedStartDate.setHours(8, 0, 0);
      this.selectedEndDate.setHours(13, 0, 0);
    }

    if (this.selectedTarif == 'Afternoon') {
      this.selectedEndDate = this.selectedStartDate;
      this.selectedStartDate.setHours(13, 0, 0);
      this.selectedEndDate.setHours(18, 0, 0);
    }

    if (this.selectedTarif == 'Day') {
      this.selectedEndDate = this.selectedStartDate;
      this.selectedStartDate.setHours(8, 0, 0);
      this.selectedEndDate.setHours(18, 0, 0);
    }

    if (this.selectedTarif == 'Week') {
      this.selectedEndDate = addBusinessDays(new Date(this.selectedStartDate.getTime()).getTime(), 4);
      this.selectedStartDate.setHours(8, 0, 0);
      this.selectedEndDate.setHours(18, 0, 0);
    }

    if (this.selectedTarif == 'Month') {
      this.selectedEndDate = addMonths(new Date(this.selectedStartDate.getTime()).getTime(), 1);
      this.selectedEndDate = subBusinessDays(new Date(this.selectedStartDate.getTime()).getTime(), 1);
      this.selectedStartDate.setHours(8, 0, 0);
      this.selectedEndDate.setHours(18, 0, 0);
    }

    this.getReservations(this.selectedStartDate, this.selectedEndDate, this.selectedTarif);
  }

  changeStartDate(event) {

    this.selectedStartDate = new Date(event.detail.value);
    this.selectedStartDate.setHours(8, 0, 0);
    this.selectedEndDate.setHours(18, 0, 0);

    if (this.selectedTarif == 'Morning') {
      this.selectedEndDate = new Date(event.detail.value);
      this.selectedStartDate.setHours(8, 0, 0);
      this.selectedEndDate.setHours(13, 0, 0);
    }

    if (this.selectedTarif == 'Afternoon') {
      this.selectedEndDate = new Date(event.detail.value);
      this.selectedStartDate.setHours(13, 0, 0);
      this.selectedEndDate.setHours(18, 0, 0);
    }

    if (this.selectedTarif == 'Day') {
      this.selectedEndDate = new Date(event.detail.value);
      this.selectedStartDate.setHours(8, 0, 0);
      this.selectedEndDate.setHours(18, 0, 0);
    }

    if (this.selectedTarif == 'Week') {
      this.selectedEndDate = addBusinessDays(new Date(event.detail.value).getTime(), 4);
      this.selectedStartDate.setHours(8, 0, 0);
      this.selectedEndDate.setHours(18, 0, 0);
    }

    if (this.selectedTarif == 'Month') {
      this.selectedEndDate = addMonths(new Date(event.detail.value).getTime(), 1);
      this.selectedEndDate = subBusinessDays(new Date(this.selectedStartDate.getTime()).getTime(), 1);
      this.selectedStartDate.setHours(8, 0, 0);
      this.selectedEndDate.setHours(18, 0, 0);
    }

    this.getReservations(this.selectedStartDate, this.selectedEndDate, this.selectedTarif);
  }


  async bookTable(desk) {
    console.log(desk);

    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Reservation bestätigen!',
      message: 'Willst du die Reservation <strong>verbindlich buchen</strong>?',
      buttons: [{
        text: 'Abbrechen',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => {
          console.log('Confirm Cancel: blah');
        }
      }, {
        text: 'Ja, buchen!',
        handler: () => {
          this.bookReservation(desk);
        }
      }]
    });

    await alert.present();

  }


  async bookReservation(desk: Desk) {

    let reservation: Reservation = {
      id: "",
      picture: desk.picture,
      desk: desk,
      bookingType: this.selectedTarif,
      dateFrom: this.selectedStartDate,
      dateTo: this.selectedEndDate,
      price: this.deskConfig.find(element => element.type === this.selectedTarif).price,
      bookingTypeDescription: this.deskConfig.find(element => element.type === this.selectedTarif).description,
      userId: "",
      bookingCreated: "",
      statusPaid: false,
      stripeInvoiceUrl: "",
      pdf: ""
    }

    const user: firebase.User = await this.authService.getUser();

    if (user) {
      const newBooking: DocumentReference = await this.afs.collection('users')
        .doc(user.uid).collection('reservations')
        .add(reservation);

      const alert = await this.alertController.create({
        message: 'Vielen Dank für deine Buchung. Als nächstes musst du noch die Rechnung bezahlen.',
        buttons: [{
          text: 'Ok',
          role: 'cancel'
        }],
      });
      alert.present();
      await alert.onDidDismiss();

      const loading = await this.loadingController.create({
        message: 'Rechnung wird geladen...',
      });
      await loading.present();

      //const user: firebase.User = await this.authService.getUser();
      const booking$ = this.afs.collection('users').doc(user.uid)
        .collection('reservations').doc(newBooking.id).snapshotChanges();

      booking$.subscribe(booking => {

        let data = booking.payload.data();
        if (data.stripeInvoiceUrl) {
          loading.dismiss();
          this.presentInvoiceModal(data);
        }
      });

    } else {
      //alert('User Error: no user available.');
    }
  }

  async presentInvoiceModal(invoice) {
    const modal = await this.modalController.create({
      component: InvoicePage,
      //cssClass: 'my-custom-class',
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: {
        invoice
      }

    });
    return await modal.present();

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

  async presentToasResource() {
    const toast = await this.toastController.create({
      message: 'Erfolgreich hinzugefügt.',
      color: 'success',
      position: 'bottom',
      duration: 2000
    });
    toast.present();
  }

}
