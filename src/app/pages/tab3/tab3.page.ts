import {
  Component,
  
} from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import {
  AngularFireStorage
} from '@angular/fire/storage'
import {
  Router
} from '@angular/router';
import {
  AlertController,
  LoadingController,
  ToastController
} from '@ionic/angular';
import {
  Observable,
} from 'rxjs';
import {
  UserProfile
} from 'src/app/models/user';
import {
  AuthService
} from 'src/app/services/auth.service';
import {
  Camera,
  CameraSource,
  CameraResultType
} from '@capacitor/camera';

import { Browser } from '@capacitor/browser';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  userProfile$: Observable < any > ;
  private userProfileRef: AngularFirestoreDocument < any > ;
  private userProfileId = "";

  constructor(
    private alertController: AlertController,
    private loadingController: LoadingController,
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController,
    private afs: AngularFirestore,
    private afstorage: AngularFireStorage
  ) {

  }
  ngOnDestroy(){
    //https://blog.bitsrc.io/6-ways-to-unsubscribe-from-observables-in-angular-ab912819a78f
    //The async pipe subscribes to an Observable or Promise and returns the latest value it has emitted. When a new value is emitted, the async pipe marks the component to be checked for changes. When the component gets destroyed, the asyncpipe unsubscribes automatically to avoid potential memory leaks.
  }
  async ionViewWillEnter() {
    const user = await this.authService.getUser();
    if (user) {
      this.userProfileId = user.uid;
      this.userProfileRef = this.afs.collection('users').doc < any > (user.uid);
      this.userProfile$ = this.userProfileRef.valueChanges();
    } else {
      const alert = await this.alertController.create({
        header: 'Du bist nicht eingeloggt.',
        message: 'Bitte logge dich zuerst ein um das Profil zu sehen',
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

  async logout() {
    await this.authService.logoutUser();
    this.router.navigateByUrl('logout');
  }

  async saveProfile(userProfile) {
    await this.userProfileRef.update(userProfile);
    this.presentToast();
  }

  
  async changePassword(){

    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Passwort ??ndern',
      inputs: [
        {
          name: 'password',
          type: 'password',
          placeholder: 'Advanced Attributes',
          cssClass: 'specialClass',
          attributes: {
            minLength: 6,
          }
        }

      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            console.log('Confirm Ok');
            this.authService.updatePassword(data.password);

          }
        }
      ]
    });
    await alert.present();
  }

  async changeEmail(){

    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'E-Mail Adresse ??ndern',
      inputs: [
        {
          name: 'currentEmail',
          type: 'email',
          placeholder: 'current@mail.ch'
        },
        {
          name: 'currentPassword',
          type: 'password',
          placeholder: 'secret'
        },
        {
          name: 'email',
          type: 'email',
          placeholder: 'new@e-mail.com'
        },
      ],
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: '??ndern',
          handler: (data) => {
            console.log('Confirm Ok');
            this.authService.loginUser(data.currentEmail, data.currentPassword).then(async task=>{
              await this.authService.updateEMail(data.email);
              this.userProfileRef.set({
                email: data.email
              },{
                merge: true
              })

            })
          }
        }
      ]
    });
    await alert.present();

  }

  async takePicture(userProfile) {
    try {


      const image = await Camera.getPhoto({
        quality: 90,
        correctOrientation: true,
        source: CameraSource.Prompt,
        allowEditing: true,
        resultType: CameraResultType.Base64
      });

      const loading = await this.loadingController.create({
        message: 'Profilbild wird gespeichert...',
      });
      await loading.present();

      const path = `/userProfile/${this.userProfileId}/profilePicture.${image.format.toLowerCase()}`;
      const ref = this.afstorage.ref(path);
      const task = await ref.putString(image.base64String, 'base64', {
        contentType: `image/${image.format.toLowerCase()}`
      });

      let downloadUrl = await task.ref.getDownloadURL();
      userProfile.profilePicture = downloadUrl;
      await this.userProfileRef.set(userProfile);
      await loading.dismiss();
    } catch (err) {
      console.log(err);
      const toast = await this.toastController.create({
        message: 'Profilbild ??ndern abgebrochen',
        color: 'danger',
        position: 'bottom',
        duration: 2000
      });
      toast.present();
    }
  }
  async presentToast() {
    const toast = await this.toastController.create({
      message: '??nderungen gespeichert.',
      color: 'success',
      position: 'bottom',
      duration: 2000
    });
    toast.present();
  }

  requestSpecial(){
    Browser.open({
      "url": 'mailto:coworking@starthub.sh?subject=Studentenrabatt beantragen&body=Bitte sende uns eine Studiums-/Semesterbest??tigung'
    })
  }
}
