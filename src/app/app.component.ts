import { Component, OnInit } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
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
  public installPrompt = null;
  constructor(
    public oidcSecurityService: OidcSecurityService,
    private swUpdate: SwUpdate,
    private alertController: AlertController,
    private afAuth: AngularFireAuth,
    private afStore: AngularFirestore,
    public modalController: ModalController,
    //public routerOutlet: IonRouterOutlet,
    private router: Router,
  ) {
    this.initializeApp();
    this.initializeFirebase();
  }

  ngOnInit() {

    this.oidcSecurityService.checkAuth().subscribe(({ isAuthenticated, userData, accessToken, idToken }) => {
      console.log('app authenticated', isAuthenticated);
      console.log('app userData', userData);
      console.log('app idToken', idToken);
      console.log(`Current access token is '${accessToken}'`);
    });
  }

  login() {
    this.oidcSecurityService.authorize();
  }

  logout() {
    this.oidcSecurityService.logoff();
  }


  initializeApp(): void {
    if (this.swUpdate.available) {
      this.swUpdate.available.subscribe(() => {
        this.presentAlert();
      });
    }
  }

  getInstallPrompt():void{
    window.addEventListener('beforeinstallprompt',(e)=>{
      e.preventDefault();
      this.installPrompt = e;
    });
  }
  askUserToInstallApp(): void{
    this.installPrompt.prompt();
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      //cssClass: 'my-custom-class',
      header: 'Neue Version',
      message: 'Eine neue Version ist verf??gbar. Neue Version laden?',
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
  initializeFirebase(): void {
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
}
