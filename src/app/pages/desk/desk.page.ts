import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Reservation } from 'src/app/models/reservation';
import { Desk } from 'src/app/models/resources';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

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
    this.maxDate = new Date(Date.now() + 1000 * 60 * 60 * 90);

    this.reservation = {
      id: '',
      date: this.selectedDate,
      bookingMorning: false,
      bookingAfternoon: false,
      bookingDay: false,
      bookingWeek: false,
      userId: null,
      bookingCreated: new Date(),
      bookingType: 'Day',
      price: '',
      picture: '',
    };
   }

   async ngOnInit(){
    const user = await this.authService.getUserProfile();
    if (user){
      this.reservation.userId = user.uid;
    }

    this.reservation.date = this.selectedDate;

   }

   async bookReservation(){
     console.log('Reservation');
     console.log(this.reservation);

     console.log('Desk');
     console.log(this.desk);

     this.reservation.picture = this.desk.picture;

     //let string = this.reservation.bookingType;
     this.reservation.price = this.desk['price' + this.reservation.bookingType];

     this.reservation['booking' + this.reservation.bookingType] = true;

     const user = await this.authService.getUserProfile();
    if (user){
      await this.afs.collection('users').doc(user.uid).collection('reservations').add(this.reservation);
      this.dismiss(true);
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
