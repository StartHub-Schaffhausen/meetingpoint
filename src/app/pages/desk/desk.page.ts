import {
  Component,  Input,  OnInit} from '@angular/core';
import {  AlertController,  ModalController} from '@ionic/angular';
import {  Reservation} from 'src/app/models/reservation';
import {  Desk} from 'src/app/models/resources';
import {  AngularFirestore,  AngularFirestoreCollection, DocumentReference} from '@angular/fire/firestore';
import {  AuthService} from 'src/app/services/auth.service';
import {  Router} from '@angular/router';

import { LocalNotifications, ScheduleOptions,LocalNotificationSchema } from '@capacitor/local-notifications';
import { config } from 'src/app/config/config';

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

  deskConfig = config.offer;

  constructor(
    private modalController: ModalController,
    private afs: AngularFirestore,
    private authService: AuthService,
    private router: Router,
    private alertCtrl: AlertController,
  ) {
  }

  async ngOnInit() {
    this.minDate = new Date();
    this.maxDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 90);

    console.log('desk');
    console.log(this.desk);
    console.log('reservation');

    const user = await this.authService.getUserProfile();
    if (user) {
    this.reservation = {
      id: '',
      dateFrom: new Date(this.selectedDate.toISOString().substr(0, 11) + '08:00:00'),
      dateTo: new Date(this.selectedDate.toISOString().substr(0, 11) + '17:30:00'),
      userId: user.uid,
      bookingCreated: new Date(),
      bookingType: this.deskConfig.find(element=>element.type==='Day').type,
      bookingTypeDescription: this.deskConfig.find(element=>element.type==='Day').description,
      price: '',
      picture: '',
      desk: this.desk
    };
  }
  console.log(this.reservation);
  }

  radioChange(ev: any) {
    switch (ev.detail.value) {
      case 'Morning':
        this.reservation.dateFrom = new Date(this.selectedDate.toISOString().substr(0, 11) + '08:00:00');
        this.reservation.dateTo = new Date(this.selectedDate.toISOString().substr(0, 11) + '12:30:00');
        break;
      case 'Afternoon':
        this.reservation.dateFrom = new Date(this.selectedDate.toISOString().substr(0, 11) + '13:00:00');
        this.reservation.dateTo = new Date(this.selectedDate.toISOString().substr(0, 11) + '17:30:00');
        break;
      case 'Day':
        this.reservation.dateFrom = new Date(this.selectedDate.toISOString().substr(0, 11) + '08:00:00');
        this.reservation.dateTo = new Date(this.selectedDate.toISOString().substr(0, 11) + '17:30:00');
        break;
      case 'Week':
        this.reservation.dateFrom = new Date(this.selectedDate.toISOString().substr(0, 11) + '08:00:00');
        this.reservation.dateTo = new Date(this.selectedDate.toISOString().substr(0, 11) + '17:30:00');
        break;
      default:
        break;
    }
    this.reservation.bookingType = ev.detail.value;

    /*console.log(this.selectedDate.toISOString());
    console.log(this.reservation.dateFrom.toISOString());
    console.log(this.reservation.dateTo.toISOString());*/

  }


  dateChange(ev) {
    this.selectedDate = new Date(ev.detail.value);
    switch (this.reservation.bookingType) {
      case 'Morning':
        this.reservation.dateFrom = new Date(this.selectedDate.toISOString().substr(0, 11) + '08:00:00');
        this.reservation.dateTo = new Date(this.selectedDate.toISOString().substr(0, 11) + '12:30:00');
        break;
      case 'Afternoon':
        this.reservation.dateFrom = new Date(this.selectedDate.toISOString().substr(0, 11) + '13:00:00');
        this.reservation.dateTo = new Date(this.selectedDate.toISOString().substr(0, 11) + '17:30:00');
        break;
      case 'Day':
        this.reservation.dateFrom = new Date(this.selectedDate.toISOString().substr(0, 11) + '08:00:00');
        this.reservation.dateTo = new Date(this.selectedDate.toISOString().substr(0, 11) + '17:30:00');
        break;
      case 'Week':
        this.reservation.dateFrom = new Date(this.selectedDate.toISOString().substr(0, 11) + '08:00:00');
        this.reservation.dateTo = new Date(this.selectedDate.toISOString().substr(0, 11) + '17:30:00');
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
    console.log('Reservation');
    console.log(this.reservation);

    console.log('Desk');
    console.log(this.reservation.desk);

    try {
      this.reservation.picture = this.desk.picture;
      this.reservation.desk = this.desk;
    } catch (e) {
      alert('Error 1: ' + JSON.stringify(e));
    }

    try {
      this.reservation.price = this.desk['price' + this.reservation.bookingType];
      this.reservation.bookingTypeDescription = this.deskConfig.find(element=>element.type===this.reservation.bookingType).description;
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
        const newBooking: DocumentReference = await this.afs.collection('users')
        .doc(user.uid).collection('reservations')
        .add(this.reservation);
        /*const notification: LocalNotificationSchema = {
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
        });*/

        this.dismiss(newBooking.id);
      } else {
        alert('User Error: no user available.');
      }
  }

  dismiss(bookingId) {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      dismissed: true,
      bookingId
    });
  }

}
