import { Component } from '@angular/core';

/*
import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/firestore';
*/

import {SwUpdate} from '@angular/service-worker';
import { AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private swUpdate: SwUpdate,
    private alertController: AlertController,
    private afAuth: AngularFireAuth,
    private router: Router,
  ) {
    this.initializeApp();


    this.afAuth.onAuthStateChanged((user)=>{

      if (user) {
        // User is signed in.
        console.log('User is signed in.');
        //this.router.navigateByUrl('tabs');

      } else {
        // No user is signed in.
        console.log(' No user is signed in.');
        //this.router.navigateByUrl('login');
      }


    });
    this.afAuth.setPersistence('session');


  }

  initializeApp(): void {
    if (this.swUpdate.available) {
      this.swUpdate.available.subscribe(() => {
        this.presentAlert();
      });
    }
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      //cssClass: 'my-custom-class',
      header: 'Neue Version',
      message: 'Eine neue Version ist verfügbar. Neue Version laden?',
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            //console.log('Confirm Cancel: blah');
          },
        },
        {
          text: 'Laden',
          handler: () => {
            window.location.reload();
            //console.log('Confirm Okay');
          },
        },
      ],
    });

    await alert.present();
  }

}
