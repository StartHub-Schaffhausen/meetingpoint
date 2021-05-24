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
        this.router.navigateByUrl('tabs');
      },
      async error => {
        const alert = await this.alertCtrl.create({
          message: error.message,
          buttons: [{ text: 'Ok', role: 'cancel' }],
        });
        await alert.present();
      }
    );
  }
}
