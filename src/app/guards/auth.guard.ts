import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router, 
    private authService: AuthService,
    private alertCtrl: AlertController
    ){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return new Promise( async (resolve,reject)=>{
        const user = await this.authService.getUser();
        //console.log(user);
        if (user && user.emailVerified){
          //console.log('guard true');
          resolve(true);
          //return true;
          }  else if (user && !user.emailVerified){
            const alert = await this.alertCtrl.create({
              header: 'E-Mail Adresse verifizieren',
              message: 'Bitte verifiziere zuerst deine E-Mail Adresse. Prüfe deinen Posteingang/Spam Ordner. Sollen wir dir noch einmal einen Bestätigungslink per E-Mail senden`?',
              buttons: [
                {
                  text: 'Nein',
                  handler: (data) => {
                    this.router.navigateByUrl('/login');
                  },
                },
                {
                  text: 'Nochmals senden',
                  handler: (data) => {
                    user
                      .sendEmailVerification({
                        url: window.location.toString(),
                      })
                      .then(
                        (ok) => {
                          console.log('sendEmailVerification');
                        },
                        (error) => {
                          console.log('Error sendEmailVerification');
                        }
                      );
                    this.router.navigateByUrl('/login');
                  },
                },
              ],
            });
            await alert.present();
            reject('email not verified');

          }else{
          //console.log('guard false');
          //reject(this.router.createUrlTree(['/login']));
          this.router.navigateByUrl('/login');
          reject('No user logged in');
          //return false;
        }
      });
  }

}
