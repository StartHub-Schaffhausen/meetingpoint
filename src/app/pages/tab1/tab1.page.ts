import {
  Component,
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
  Router
} from '@angular/router';

import { faCircle1, faCircle2, faCircle3 } from '@fortawesome/pro-solid-svg-icons';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page{

  faCircle1 = faCircle1;
  faCircle2 = faCircle2;
  faCircle3 = faCircle3;

  selectedStartDate: Date = new Date();
  selectedEndDate: Date = new Date();
  selectedTarif = 'Day';

  itsFree: boolean = false;

  bookingBlocked = false;

  deskConfig = config.offer;
  isStudent:boolean = false;

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
   
      firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
          const userRef = await this.afs.collection('users').doc < any > (user.uid).get().pipe(first()).toPromise();;
          if (userRef.data().isStudent === true) {
            this.isStudent = true;
            console.log("STUDENT");
          }else{
            this.isStudent = false;
            console.log("KEIN STUDENT");
          }
        } else {
          this.isStudent = false;
        }
      });

  }


  ionViewWillEnter():void {
    this.setStartEndDate();
    this.checkIfBlocked();
    this.checkIfFreeDay();
    this.getReservations();
  }


  ngOnDestroy(){
    this.freeDesks = [];
  }


  checkIfFreeDay() {
    //console.log("is blocked? " + date.toISOString().substring(0,10));

    if (this.selectedStartDate.getDay() === 3 ) { //'2021-08-30'
      this.presentItsFree();
      this.itsFree = true;
    }else{
      this.itsFree = false;
    }
  }


  checkIfBlocked() {
    //console.log("is blocked? " + date.toISOString().substring(0,10));

    //check if Past
    if (this.selectedStartDate.toISOString().substring(0, 10) < new Date().toISOString().substring(0,10) ) { //'2021-08-30'
      this.bookingBlocked = true;
      //this.presentToastBookingBlocked();
      this.presentToastPast();
    } else {
      this.bookingBlocked = false;

      // check if WEEKEND
      if (this.selectedStartDate.getDay() == 0 || this.selectedStartDate.getDay() == 6) { // 0 for sunday / 1 for monday... / 2 for tuesday
        this.bookingBlocked = true;
        this.presentToastWeekendBlocked();
      } else {
        this.bookingBlocked = false;

        // check if COWORKING Closed
        if (
           this.selectedStartDate.toISOString().substring(0, 10) <= '2022-01-23' 
          /* || this.selectedStartDate.toISOString().substring(0, 10) == '2021-12-24' 
            || this.selectedStartDate.toISOString().substring(0, 10) == '2021-12-25' 
            || this.selectedStartDate.toISOString().substring(0, 10) == '2021-12-26' */
       ) { 
          this.bookingBlocked = true;
          this.presentToastCoworkingClosed();
        } else {
          this.bookingBlocked = false;
        }
      }

    }
  }

  async getReservations() {
    console.log("CALL getReservations ");

    this.freeDesks = [];

    const loading = await this.loadingController.create({
      //cssClass: 'my-custom-class',
      message: 'Bitte warten, wir laden die verf??gbaren Tische',
      //duration: 2000
    });
    await loading.present();

    const ref$ = this.afs.collection('desks', ref => ref.where('active', '==', true).orderBy('name', 'asc')).get();
    const desk = await ref$.pipe(first()).toPromise();

    //Loop ??ber Desk
    console.log("Anzahl verf??gbare Tische "  + desk.docs.length );
    for (const deskElement of desk.docs) {

      console.log(deskElement.data());
      //Lese Tages-Reservationen

      if (this.selectedTarif == 'Day' || this.selectedTarif == 'Morning' || this.selectedTarif == 'Afternoon') {
        const deskReservationRef$ =
          this.afs.collection('desks').doc(deskElement.id)
          .collection('reservations').doc(this.selectedStartDate.toISOString().substr(0, 10)).get();

        const deskReservation: any = await deskReservationRef$.pipe(first()).toPromise();
        if (!deskReservation.exists) { //Falls keine Reservation vorhanden, dann hinzuf??gen
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
          if (deskReservationMulti.exists) { //Falls keine Reservation vorhanden, dann hinzuf??gen
            isFree = false
          }

        }

        if (isFree) {
          this.freeDesks.push(deskElement.data());
        }

      }

    }

    await loading.dismiss();
    
    /*const toast = await this.toastController.create({
      message: 'Angebote aktualisiert',
      duration: 2000,
      color: 'success'
    });
    toast.present();*/

  }

  changeTarif(event) {

    this.selectedTarif = event.detail.value;

    this.setStartEndDate();

    this.getReservations();
  }

  changeStartDate(event) {
    
      this.selectedStartDate = new Date(event.detail.value);

      this.checkIfBlocked();
      this.checkIfFreeDay();
  
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


      const userRef = await this.afs.collection('users').doc < any > (user.uid).get().pipe(first()).toPromise();;
      if (userRef.data().firstName && userRef.data().lastName && userRef.data().email  ) {

        const isStudent = userRef.data().isStudent;
        let calculatedPrice = ((isStudent) ?  this.deskConfig.find(element => element.type === this.selectedTarif).priceSpecial : this.deskConfig.find(element => element.type === this.selectedTarif).price );
        
        if ((this.selectedTarif === 'Morning' || this.selectedTarif === 'Afternoon' || this.selectedTarif === 'Day') && this.itsFree){
          calculatedPrice = 0;
        }

        const modal = await this.modalController.create({
          component: ConfirmationPage,
          swipeToClose: false,
          presentingElement: this.routerOutlet.nativeEl,
          componentProps: {
            desk,

            bookingType: this.selectedTarif,
            dateFrom: this.selectedStartDate,
            dateTo: this.selectedEndDate,

            price: calculatedPrice,
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
          }, calculatedPrice);
        } else {
          this.presentToastBookingCancel();
        }

        /*const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Reservation best??tigen!',
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

  async bookReservation(desk: Desk, meta: any, calculatedPrice: number) {

    let reservation: Reservation = {
      id: "",
      picture: desk.picture,
      desk: desk,
      bookingType: this.selectedTarif,
      dateFrom: this.selectedStartDate,
      dateTo: this.selectedEndDate,
      //price: this.deskConfig.find(element => element.type === this.selectedTarif).price,
      price: calculatedPrice,
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
        message: 'Vielen Dank f??r deine Buchung! Als n??chstes kannst du die Rechnung bezahlen.',
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
      message: 'Bitte zuerst Profil vervollst??ndigen (Vorname, Nachname, E-Mail).',
      color: 'danger',
      position: 'bottom',
      duration: 4000
    });
    toast.present();
  }


  async presentToastBookingBlocked() {
    const toast = await this.toastController.create({
      message: 'An diesem Tag ist keine Buchung m??glich. Buchungen sind ab 30.08.2021 m??glich.',
      color: 'danger',
      position: 'top',
      duration: 4000
    });
    toast.present();
  }

  async presentToastCoworkingClosed() {
    const toast = await this.toastController.create({
      message: 'Wir haben an diesem Tag geschlossen.',
      color: 'danger',
      position: 'top',
      duration: 4000
    });
    toast.present();
  }

  async presentToastPast() {
    const toast = await this.toastController.create({
      message: 'Dieses Datum liegt in der Vergangenheit. Back to the future ????',
      color: 'danger',
      position: 'top',
      duration: 4000
    });
    toast.present();
  }

  async presentItsFree() {
    const toast = await this.toastController.create({
      message: 'Mittwoch ist Gratis Coworking Tag',
      color: 'success',
      position: 'top',
      duration: 2000
    });
    toast.present();
  }

  async presentToastWeekendBlocked() {
    const toast = await this.toastController.create({
      message: 'Wir haben am Wochenende geschlossen.',
      color: 'danger',
      position: 'top',
      duration: 4000
    });
    toast.present();
  }

  async presentToastResource() {
    const toast = await this.toastController.create({
      message: 'Erfolgreich hinzugef??gt.',
      color: 'success',
      position: 'bottom',
      duration: 4000
    });
    toast.present();
  }

}
