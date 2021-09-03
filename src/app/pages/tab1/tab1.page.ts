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
  subBusinessDays,
  setHours,
  setMinutes,
  setSeconds,
  format
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
import {
  AddDeskPage
} from '../add-desk/add-desk.page';
import {
  ConfirmationPage
} from '../confirmation/confirmation.page';
import {
  UserProfile
} from 'src/app/models/user';
import {
  Browser
} from 'protractor';
import {
  Router
} from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  selectedStartDate: Date = new Date();
  selectedEndDate: Date = new Date();
  selectedTarif = 'Day';

  bookingBlocked = false;

  deskConfig = config.offer;

  freeDesks: any[] = [];

  constructor(
    private router: Router,
    public modalController: ModalController,
    private routerOutlet: IonRouterOutlet,
    public alertController: AlertController,
    public toastController: ToastController,
    public loadingController: LoadingController,
    private afs: AngularFirestore,
    private authService: AuthService,
  ) {
    this.setStartEndDate();
    this.checkIfBlocked();
    this.getReservations();
  }

  async ngOnInit() {

    /*
    if (new Date().getTime() <= 1629471600000) {
      const toast = await this.toastController.create({
        message: 'Gratis Probewoche vom 16. bis 20. August! Melde dich per E-Mail hello@starthub.sh bei uns.',
        duration: 10000,
        position: 'top',
        color: 'primary',
        buttons: [{
            text: 'YES!',
            handler: () => {
              window.location.href = "mailto:hello@starthub.sh?subject=Probewoche&body=Ich komme gerne am xx. August zur Probewoche vorbei. Bitte reserviert mir einen gratis Platz im Coworking Space <VORNAME> <NAME> <EMAIL> <HANDY>";
            }
          },
        ]
      });
      toast.present();
    }
    */

  }

  checkIfBlocked() {
    //console.log("is blocked? " + date.toISOString().substring(0,10));

    if (this.selectedStartDate.toISOString().substring(0, 10) < new Date().toISOString().substring(0,10) ) { //'2021-08-30'
      this.bookingBlocked = true;
      this.presentToastBookingBlocked();
      this.presentToastPast();
    } else {


      // check if WEEKEND
      if (this.selectedStartDate.getDay() == 0 || this.selectedStartDate.getDay() == 6) { // 0 for sunday / 1 for monday... / 2 for tuesday
        this.bookingBlocked = true;
        this.presentToastWeekendBlocked();
      } else {
        this.bookingBlocked = false;
      }

    }
  }

  async getReservations() {

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

      if (this.selectedTarif == 'Day' || this.selectedTarif == 'Morning' || this.selectedTarif == 'Afternoon') {
        const deskReservationRef$ =
          this.afs.collection('desks').doc(deskElement.id)
          .collection('reservations').doc(this.selectedStartDate.toISOString().substr(0, 10)).get();

        const deskReservation: any = await deskReservationRef$.pipe(first()).toPromise();
        if (!deskReservation.exists) { //Falls keine Reservation vorhanden, dann hinzufügen
          this.freeDesks.push(deskElement.data());
        }

      } else { //Lese Mehrtagesreservationen
        let isFree = true;
        let deskname: any = deskElement.data();

        for (let i = this.selectedStartDate.getTime(); i <= this.selectedEndDate.getTime(); i = addBusinessDays(new Date(i), 1).getTime()) {

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

    this.setStartEndDate();

    this.getReservations();
  }

  changeStartDate(event) {

    this.selectedStartDate = new Date(event.detail.value);

    this.checkIfBlocked();

    this.setStartEndDate();

    this.getReservations();
  }

  setStartEndDate() {
    if (this.selectedTarif == 'Morning') {
      this.selectedEndDate = this.selectedStartDate;

      this.selectedStartDate = setHours(this.selectedStartDate, 8);

      this.selectedEndDate = setHours(this.selectedEndDate, 13);
    } else if (this.selectedTarif == 'Afternoon') {
      this.selectedEndDate = this.selectedStartDate;

      this.selectedStartDate = setHours(this.selectedStartDate, 13);

      this.selectedEndDate = setHours(this.selectedEndDate, 18);

    } else if (this.selectedTarif == 'Day') {
      this.selectedEndDate = this.selectedStartDate;

      this.selectedStartDate = setHours(this.selectedStartDate, 8);

      this.selectedEndDate = setHours(this.selectedEndDate, 18);

    } else if (this.selectedTarif == 'Week') {
      this.selectedEndDate = addBusinessDays(new Date(this.selectedStartDate.getTime()).getTime(), 4);

      this.selectedStartDate = setHours(this.selectedStartDate, 8);

      this.selectedEndDate = setHours(this.selectedEndDate, 18);

    } else if (this.selectedTarif == 'Month') {
      this.selectedEndDate = addMonths(new Date(this.selectedStartDate.getTime()).getTime(), 1);

      this.selectedEndDate = subBusinessDays(new Date(this.selectedEndDate.getTime()).getTime(), 1);

      this.selectedStartDate = setHours(this.selectedStartDate, 8);

      this.selectedEndDate = setHours(this.selectedEndDate, 18);
    }
    this.selectedStartDate = setMinutes(this.selectedStartDate, 0);
    this.selectedEndDate = setMinutes(this.selectedEndDate, 0);

  }

  async bookTable(desk) {
    //console.log(desk);

    const user: firebase.User = await this.authService.getUser();

    if (user) { // LOGIN OK


      const userRef = await this.afs.collection('users').doc < UserProfile > (user.uid).get().pipe(first()).toPromise();;
      if (userRef.data().firstName && userRef.data().lastName) {

        const modal = await this.modalController.create({
          component: ConfirmationPage,
          swipeToClose: false,
          presentingElement: this.routerOutlet.nativeEl,
          componentProps: {
            desk,


            bookingType: this.selectedTarif,
            dateFrom: this.selectedStartDate,
            dateTo: this.selectedEndDate,



            price: this.deskConfig.find(element => element.type === this.selectedTarif).price,
            bookingTypeDescription: this.deskConfig.find(element => element.type === this.selectedTarif).description,
          }

        });
        await modal.present();

        const data = await modal.onDidDismiss();
        //console.log(data);
        if (data.data.confirmBooking === true) {
          this.bookReservation(desk, {
            firstName: userRef.data().firstName,
            lastName: userRef.data().lastName,
            userId: user.uid,
            dateFromStringDate: format(this.selectedStartDate.getTime(), 'dd.MM.y'),
            dateFromStringTime: format(this.selectedStartDate.getTime(), 'HH:mm'),
            dateToStringDate: format(this.selectedEndDate.getTime(), 'dd.MM.y'),
            dateToStringTime: format(this.selectedEndDate.getTime(), 'HH:mm'),
            isoStringFrom: this.selectedStartDate.toISOString().substring(0,10),
            isoStringTo: this.selectedEndDate.toISOString().substring(0,10)
          });
        } else {
          this.presentToastBookingCancel();
        }

        /*const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Reservation bestätigen!',
        message: 'Willst du die Reservation <strong>verbindlich buchen</strong>?',
        buttons: [{
          text: 'Abbrechen',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
           // console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Ja, buchen!',
          handler: () => {
            this.bookReservation(desk);
          }
        }]
      });
  
      await alert.present();
      */
      } else {
        this.presentToastCompleteProfile();
      }
    } else {
      const alert = await this.alertController.create({
        header: 'Du bist nicht eingeloggt.',
        message: 'Bitte logge dich zuerst ein um eine Reservation zu machen',
        buttons: [{
          text: 'Abbrechen',
          role: 'cancel',
          cssClass: 'secondary',
          handler: async (blah) => {

          }
        }, {
          text: 'Login',
          handler: () => {
            this.router.navigateByUrl('login');

          }
        }]
      });

      await alert.present();
    }
  }

  async bookReservation(desk: Desk, meta: any) {

    let reservation: Reservation = {
      id: "",
      picture: desk.picture,
      desk: desk,
      bookingType: this.selectedTarif,
      dateFrom: this.selectedStartDate,
      dateTo: this.selectedEndDate,
      price: this.deskConfig.find(element => element.type === this.selectedTarif).price,
      bookingTypeDescription: this.deskConfig.find(element => element.type === this.selectedTarif).description,
      userId: meta.userId,
      bookingCreated: "",
      statusPaid: false,
      stripeInvoiceUrl: "",
      pdf: ""
    }

    const user: firebase.User = await this.authService.getUser();

    if (user) {
      const newBooking: DocumentReference = await this.afs.collection('users')
        .doc(user.uid).collection('reservations')
        .add({
          reservation,
          meta
        });

      const alert = await this.alertController.create({
        message: 'Vielen Dank für deine Buchung! Als nächstes kannst du die Rechnung bezahlen.',
        buttons: [{
          text: 'Ok',
          role: 'cancel'
        }],
      });
      alert.present();
      await alert.onDidDismiss();

      const loading = await this.loadingController.create({
        message: 'Bitte warten. Deine Rechnung wird geladen...',
      });
      await loading.present();

      const booking$ = this.afs.collection('users').doc(user.uid)
        .collection('reservations').doc(newBooking.id).snapshotChanges();

      //.pipe(first()).toPromise()
      /*const booking: any = booking$.pipe(first()).toPromise();
      let data = booking.payload.data();
      if (data.stripeInvoiceUrl) {
        loading.dismiss();
        this.presentInvoiceModal(data);
      }*/
      //this.getReservations();

      const bookingSubscriber = booking$.subscribe(booking => {

        let data = booking.payload.data().reservation;
        //console.log("stripeInvoiceUrl: " + booking.payload.data().stripeInvoiceUrl);

        data.stripeInvoiceUrl = booking.payload.data().stripeInvoiceUrl;
        data.pdf = booking.payload.data().pdf;
        if (data.stripeInvoiceUrl) {
          loading.dismiss();
          this.presentInvoiceModal(data);

          bookingSubscriber.unsubscribe();
          //this.getReservations(); wird bei ondiddismiss gemacht
        }
      })

    } else {
      alert('User Error: no user available.');
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
    modal.onDidDismiss().then(() => {
      this.getReservations();
    })

    return await modal.present();

  }

  async addResource() {
    const modal = await this.modalController.create({
      component: AddDeskPage,
      //cssClass: 'my-custom-class',
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,

    });

    modal.onDidDismiss().then(data => {
      //console.log(data);
      if (data.data.booked) {
        this.presentToastResource();
      } else {
        //console.log('closed');
      }

    });

    return await modal.present();
  }

  async presentToastBookingCancel() {
    const toast = await this.toastController.create({
      message: 'Buchung abgebrochen.',
      color: 'danger',
      position: 'bottom',
      duration: 2000
    });
    toast.present();
  }

  async presentToastCompleteProfile() {

    const toast = await this.toastController.create({
      message: 'Bitte zuerst Profil vervollständigen.',
      color: 'danger',
      position: 'bottom',
      duration: 4000
    });
    toast.present();
  }


  async presentToastBookingBlocked() {
    const toast = await this.toastController.create({
      message: 'An diesem Tag ist keine Buchung möglich. Buchungen sind ab 30.08.2021 möglich.',
      color: 'danger',
      position: 'bottom',
      duration: 4000
    });
    toast.present();
  }

  async presentToastPast() {
    const toast = await this.toastController.create({
      message: 'Dieses Datum liegt in der Vergangenheit. Back to the future 🚀',
      color: 'danger',
      position: 'bottom',
      duration: 4000
    });
    toast.present();
  }


  async presentToastWeekendBlocked() {
    const toast = await this.toastController.create({
      message: 'Wir haben am Wochenende geschlossen.',
      color: 'danger',
      position: 'bottom',
      duration: 4000
    });
    toast.present();
  }

  async presentToastResource() {
    const toast = await this.toastController.create({
      message: 'Erfolgreich hinzugefügt.',
      color: 'success',
      position: 'bottom',
      duration: 4000
    });
    toast.present();
  }

}
