import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UserCredential } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public user: UserCredential;

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.user = {
      email: '',
      password: ''
    };

  }
  async loginUser(): Promise<void> {
    this.authService.loginUser(this.user.email, this.user.password).then(
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
