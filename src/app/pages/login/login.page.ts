import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { UserCredential } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public user: UserCredential;
  public authForm: FormGroup;
  constructor(
    private oidcSecurityService: OidcSecurityService,
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {
    this.authForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.minLength(6)],
    });
  }

  ngOnInit() {
    this.user = {
      email: '',
      password: '',
    };

  }

  loginOIDC(){
    const url = this.oidcSecurityService.getAuthorizeUrl();
    window.location.href = url;
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
        password: authForm.value.password,
      };

      this.loginUser(credentials);
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

  async loginUser(credentials: UserCredential): Promise<void> {
    this.authService.loginUser(credentials.email, credentials.password).then(
      () => {
        console.log('logged in');
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
