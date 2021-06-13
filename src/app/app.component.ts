import { Component } from '@angular/core';

/*
import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/firestore';
*/

import {SwUpdate} from '@angular/service-worker';
import { AlertController, ModalController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore} from '@angular/fire/firestore';
import { Router } from '@angular/router';

import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/firestore';


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
    private afStore: AngularFirestore,
    public modalController: ModalController,
    //public routerOutlet: IonRouterOutlet,
    private router: Router,
  ) {
    this.initializeApp();


    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        console.log('User is signed in.');

      } else {
        // No user is signed in.
        console.log(' No user is signed in.');
      }
    });

    // https://cloud.google.com/firestore/docs/manage-data/enable-offline
    // The default cache size threshold is 40 MB. Configure "cacheSizeBytes"
    // for a different threshold (minimum 1 MB) or set to "CACHE_SIZE_UNLIMITED"
    // to disable clean-up.
    firebase.firestore().settings({
      cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
    });

    firebase
      .firestore()
      .enablePersistence()
      .catch((err) => {
        if (err.code === 'failed-precondition') {
          // Multiple tabs open, persistence can only be enabled
          // in one tab at a a time.
          // ...
        } else if (err.code === 'unimplemented') {
          // The current browser does not support all of the
          // features required to enable persistence
          // ...
        }
      });
    // Subsequent queries will use persistence, if it was enabled successfully
    this.afAuth.setPersistence('local');





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
