import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UserCredential } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  public user: UserCredential;

  constructor(
    private authService: AuthService,
    private alertCtrl: AlertController,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.user = {
      email: '',
      password: ''
    };

  }


  mobileLogin(phonenumber: string){
    return this.authService.mobileLogin(phonenumber);
  }

  login(){
    return this.router.navigateByUrl('login');
  }

  async signupUser(): Promise<void> {

    console.log('signup user: ' + this.user.email);

    this.authService.signupUser(this.user.email, this.user.password).then(
      () => {
        this.router.navigateByUrl('tabs');
      },
      async (error: any) => {
        const alert = await this.alertCtrl.create({
          message: error.message,
          buttons: [{ text: 'Ok', role: 'cancel' }],
        });
        await alert.present();
      }
    );
  }
}
