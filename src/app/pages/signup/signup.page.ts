import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { UserCredential } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import {FormGroup, Validators, FormBuilder} from '@angular/forms';
import {
  UserProfile
} from 'src/app/models/user';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  private userProfileRef: AngularFirestoreDocument < UserProfile > ;
  public user: UserCredential;
  public authForm: FormGroup;
  constructor(
    private authService: AuthService,
    private alertCtrl: AlertController,
    private formBuilder: FormBuilder,
    private afs: AngularFirestore,
    private loadingCtrl: LoadingController,
    private router: Router
  ) {
    this.authForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.minLength(6)],
      lastName:  ['', Validators.required],
      firstName:  ['', Validators.required],
    });
  }

  ngOnInit() {
    this.user = {
      email: '',
      password: '',
    };

  }


  submitCredentials(authForm: FormGroup): void {
    if (!authForm.valid) {
      //console.log('Form is not valid yet, current value:', authForm.value);
      this.alertCtrl.create({
        message: 'Formular ist noch fehlerhaft',
        buttons: [{ text: 'Ok', role: 'cancel' }],
      }).then(alert=>{
        alert.present();
      });


    } else {
      this.presentLoading();
      const credentials: UserCredential = {
        email: authForm.value.email,
        password: authForm.value.password
      };

      this.signupUser(credentials, {firstName: authForm.value.firstName,
        lastName: authForm.value.lastName});
    }
  }
  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Bitte warten...',
      duration: 2000,
    });
    await loading.present();

    const {role, data} = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }

  async signupUser(credentials: UserCredential, userData: any): Promise<void> {

    console.log('signup user: ' + this.user.email);

    this.authService.signupUser(credentials.email, credentials.password).then(
     async (data) => {
    
        this.userProfileRef = this.afs.collection('users').doc < UserProfile > (data.user.uid);
        await this.userProfileRef.set(userData);
      
        this.router.navigateByUrl('tabs');
      }).catch(err=>{
        this.alertCtrl.create({
          message: err.message,
          buttons: [{ text: 'Ok', role: 'cancel' }],
        }).then(alert=>{
          alert.present();
        });

      });
  }
}
