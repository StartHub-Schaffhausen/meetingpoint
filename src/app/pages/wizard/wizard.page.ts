import {
  Component,
  OnInit,
} from '@angular/core';
import {
  LoadingController,
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

import {
  AlertController
} from '@ionic/angular';

import {
  addBusinessDays,
  addMonths,
  subBusinessDays
} from 'date-fns'
import {
  Desk
} from 'src/app/models/resources';
import {
  Reservation
} from 'src/app/models/reservation';
import {
  AuthService
} from 'src/app/services/auth.service';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.page.html',
  styleUrls: ['./wizard.page.scss'],
})
export class WizardPage implements OnInit {

  selectedStartDate: Date = new Date();
  selectedEndDate: Date = new Date();
  showBack: boolean = false;
  showNext: boolean = true;

  selectedTarif = 'Day';

  deskConfig = config.offer;

  freeDesks: any[] = [];

  constructor(
    public alertController: AlertController,
    public toastController: ToastController,
    public loadingController: LoadingController,
    private afs: AngularFirestore,
    private authService: AuthService,
  ) {}

  async ngOnInit() {

    this.getReservations(this.selectedStartDate, this.selectedEndDate, this.selectedTarif);
  }

  async getReservations(startDate, endDate, tarif) {

    console.log(startDate);
    console.log(endDate);
    console.log(tarif);

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
        console.log("Neuer Tisch: " + deskname.name);

        for (let i = startDate.getTime(); i <= endDate.getTime(); i = addBusinessDays(new Date(i), 1).getTime()) {

          let date = new Date(i);

          const deskReservationMultiRef$ =
            this.afs.collection('desks').doc(deskElement.id)
            .collection('reservations').doc(date.toISOString().substr(0, 10)).get();

          const deskReservationMulti: any = await deskReservationMultiRef$.pipe(first()).toPromise();
          if (deskReservationMulti.exists) { //Falls keine Reservation vorhanden, dann hinzufügen
            isFree = false
          }
          console.log("Datum: " + date.toISOString().substr(0, 10) + " " + isFree);
        }
        console.log("Tisch ist frei: " + isFree);
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
    console.log(event.detail.value);
    console.log(this.selectedStartDate);
    console.log(this.selectedEndDate);
    this.selectedTarif = event.detail.value;

    if (this.selectedTarif == 'Morning') {
      this.selectedEndDate = this.selectedStartDate;
    }

    if (this.selectedTarif == 'Afternoon') {
      this.selectedEndDate = this.selectedStartDate;
    }

    if (this.selectedTarif == 'Day') {
      this.selectedEndDate = this.selectedStartDate;
    }

    if (this.selectedTarif == 'Week') {
      this.selectedEndDate = addBusinessDays(new Date(this.selectedStartDate.getTime()).getTime(), 4);
    }

    if (this.selectedTarif == 'Month') {
      this.selectedEndDate = addMonths(new Date(this.selectedStartDate.getTime()).getTime(), 1);
      this.selectedEndDate = subBusinessDays(new Date(this.selectedStartDate.getTime()).getTime(), 1)
    }

    this.getReservations(this.selectedStartDate, this.selectedEndDate, this.selectedTarif);
  }

  changeStartDate(event) {
    console.log(event.detail.value);
    console.log(this.selectedStartDate);
    console.log(this.selectedEndDate);
    console.log(this.selectedTarif);

    this.selectedStartDate = new Date(event.detail.value);

    if (this.selectedTarif == 'Morning') {
      this.selectedEndDate = new Date(event.detail.value);
    }

    if (this.selectedTarif == 'Afternoon') {
      this.selectedEndDate = new Date(event.detail.value);
    }

    if (this.selectedTarif == 'Day') {
      this.selectedEndDate = new Date(event.detail.value);
    }

    if (this.selectedTarif == 'Week') {
      this.selectedEndDate = addBusinessDays(new Date(event.detail.value).getTime(), 5);
    }

    if (this.selectedTarif == 'Month') {
      this.selectedEndDate = addMonths(new Date(event.detail.value).getTime(), 1);
      this.selectedEndDate = subBusinessDays(new Date(this.selectedStartDate.getTime()).getTime(), 1)
    }

    console.log(this.selectedEndDate);

    this.getReservations(this.selectedStartDate, this.selectedEndDate, this.selectedTarif);
  }

  async bookTable(desk) {
    console.log(desk);

    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: 'Message <strong>text</strong>!!!',
      buttons: [{
        text: 'Abbrechen',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => {
          console.log('Confirm Cancel: blah');
        }
      }, {
        text: 'berbindlich buchen',
        handler: () => {
          this.bookReservation(desk);
        }
      }]
    });

    await alert.present();

  }


  async bookReservation(desk: Desk) {

    let reservation: Reservation;

    reservation.picture = desk.picture;
    reservation.desk = desk;

    reservation.bookingType = this.selectedTarif;
    reservation.dateFrom = this.selectedStartDate;
    reservation.dateTo = this.selectedEndDate;
    reservation.price = this.deskConfig[this.selectedTarif].price;
    reservation.bookingTypeDescription = this.deskConfig.find(element => element.type === reservation.bookingType).description;

    const user = await this.authService.getUser().catch(err => {
      this.alertController.create({
        message: 'Get Userprofile Error: ' + err.message,
        buttons: [{
          text: 'Ok',
          role: 'cancel'
        }],
      }).then(alert => {
        alert.present();
      });
    });

    if (user) {
      const newBooking: DocumentReference = await this.afs.collection('users')
        .doc(user.uid).collection('reservations')
        .add(reservation);
    } else {
      alert('User Error: no user available.');
    }
  }



}
