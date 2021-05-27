import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import {
  AlertController,
  ModalController
} from '@ionic/angular';
import {
  Reservation
} from 'src/app/models/reservation';
import {
  Desk
} from 'src/app/models/resources';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import {
  Observable
} from 'rxjs';
import {
  AuthService
} from 'src/app/services/auth.service';
import {
  Router
} from '@angular/router';

import { LocalNotifications, ScheduleOptions,LocalNotificationSchema } from '@capacitor/local-notifications';

@Component({
  selector: 'app-desk',
  templateUrl: './desk.page.html',
  styleUrls: ['./desk.page.scss'],
})
export class DeskPage implements OnInit {
  @Input() desk: Desk;
  @Input() selectedDate: Date;

  reservation: Reservation;
  minDate: Date;
  maxDate: Date;

  constructor(
    private modalController: ModalController,
    private afs: AngularFirestore,
    private authService: AuthService,
    private router: Router,
    private alertCtrl: AlertController
  ) {
    this.minDate = new Date();
    this.maxDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 90);

    this.reservation = {
      id: '',
      dateFrom: this.selectedDate,
      dateTo: new Date(),
      bookingMorning: false,
      bookingAfternoon: false,
      bookingDay: false,
      bookingWeek: false,
      userId: '',
      bookingCreated: new Date(),
      bookingType: 'Day',
      price: '',
      picture: '',
      desk: this.desk
    };
  }

  async ngOnInit() {
    const user = await this.authService.getUserProfile();
    if (user) {
      this.reservation.userId = user.uid;
    }

    this.reservation.dateFrom = new Date(this.selectedDate.toISOString().substr(0, 10) + ' 08:00:000.000Z');
    this.reservation.dateTo = new Date(this.selectedDate.toISOString().substr(0, 10) + ' 17:30:000.000Z');


  }

  radioChange(ev: any) {
    switch (ev.detail.value) {
      case 'Morning':
        this.reservation.dateFrom = new Date(this.selectedDate.toISOString().substr(0, 10) + ' 08:00:000.000Z');
        this.reservation.dateTo = new Date(this.selectedDate.toISOString().substr(0, 10) + ' 12:30:000.000Z');
        break;
      case 'Afternoon':
        this.reservation.dateFrom = new Date(this.selectedDate.toISOString().substr(0, 10) + ' 13:00:000.000Z');
        this.reservation.dateTo = new Date(this.selectedDate.toISOString().substr(0, 10) + ' 17:30:000.000Z');
        break;
      case 'Day':
        this.reservation.dateFrom = new Date(this.selectedDate.toISOString().substr(0, 10) + ' 08:00:000.000Z');
        this.reservation.dateTo = new Date(this.selectedDate.toISOString().substr(0, 10) + ' 17:30:000.000Z');
        break;
      case 'Week':
        this.reservation.dateFrom = new Date(this.selectedDate.toISOString().substr(0, 10) + ' 08:00:000.000Z');
        this.reservation.dateTo = new Date(this.selectedDate.toISOString().substr(0, 10) + ' 17:30:000.000Z');
        break;
      default:
        break;
    }

    /*console.log(this.selectedDate.toISOString());
    console.log(this.reservation.dateFrom.toISOString());
    console.log(this.reservation.dateTo.toISOString());*/

  }


  dateChange(ev) {
    this.selectedDate = new Date(ev.detail.value);
    switch (this.reservation.bookingType) {
      case 'Morning':
        this.reservation.dateFrom = new Date(this.selectedDate.toISOString().substr(0, 10) + ' 08:00:000.000Z');
        this.reservation.dateTo = new Date(this.selectedDate.toISOString().substr(0, 10) + ' 12:30:000.000Z');
        break;
      case 'Afternoon':
        this.reservation.dateFrom = new Date(this.selectedDate.toISOString().substr(0, 10) + ' 13:00:000.000Z');
        this.reservation.dateTo = new Date(this.selectedDate.toISOString().substr(0, 10) + ' 17:30:000.000Z');
        break;
      case 'Day':
        this.reservation.dateFrom = new Date(this.selectedDate.toISOString().substr(0, 10) + ' 08:00:000.000Z');
        this.reservation.dateTo = new Date(this.selectedDate.toISOString().substr(0, 10) + ' 17:30:000.000Z');
        break;
      case 'Week':
        this.reservation.dateFrom = new Date(this.selectedDate.toISOString().substr(0, 10) + ' 08:00:000.000Z');
        this.reservation.dateTo = new Date(this.selectedDate.toISOString().substr(0, 10) + ' 17:30:000.000Z');
        break;
      default:
        break;
    }
    /*console.log(this.selectedDate.toISOString());
    console.log(this.reservation.dateFrom.toISOString());
    console.log(this.reservation.dateTo.toISOString());
*/

  }

  async bookReservation() {
    /*console.log('Reservation');
    console.log(this.reservation);

    console.log('Desk');
    console.log(this.currentDesk);*/

    try {
      this.reservation.picture = this.desk.picture;
      this.reservation.desk = this.desk;
    } catch (e) {
      alert('Error 1: ' + JSON.stringify(e));
    }

    try {
      this.reservation.price = this.desk['price' + this.reservation.bookingType];
      this.reservation['booking' + this.reservation.bookingType] = true;
    } catch (e) {
      alert('Error 2: ' + JSON.stringify(e));
    }

      const user = await this.authService.getUserProfile().catch(err=>{
        this.alertCtrl.create({
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
        const newBooking = await this.afs.collection('users').doc(user.uid).collection('reservations').add(this.reservation).catch(err=>{
          this.alertCtrl.create({
            message: 'Add Booking Error: ' + err.message,
            buttons: [{
              text: 'Ok',
              role: 'cancel'
            }],
          }).then(alert => {
            alert.present();
          });
        });

        const notification: LocalNotificationSchema = {
          id: 123123,
          title: this.reservation.desk.name,
          body: this.reservation.dateFrom.toISOString(),
          schedule: {
            at: this.reservation.dateFrom,
          }
        };

        const scheduleOptions: ScheduleOptions = {
          notifications: [notification]
        };
        LocalNotifications.schedule(scheduleOptions).catch(err=>{
          this.alertCtrl.create({
            message: 'Schedule Notification Error: ' + err.message,
            buttons: [{
              text: 'Ok',
              role: 'cancel'
            }],
          }).then(alert => {
            alert.present();
          });
        });

        this.dismiss(true);
      } else {
        alert('no user available');
      }


  }

  dismiss(booked) {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      dismissed: true,
      booked
    });
  }

}
