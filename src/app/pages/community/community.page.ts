import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-community',
  templateUrl: './community.page.html',
  styleUrls: ['./community.page.scss'],
})
export class CommunityPage {
  community$: Observable<any[]>;
  communityCollection: AngularFirestoreCollection<any>;

  communityFuture$: Observable<any[]>;
  communityCollectionFuture: AngularFirestoreCollection<any>;

  constructor(
    private afs: AngularFirestore,
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
  ) { }

  async ionViewWillEnter() {


    const user = await this.authService.getUser();
    if (user) {

      this.communityCollection = this.afs.collection('community', ref => ref.where('metadata.isoStringFrom', '==', new Date().toISOString().substring(0,10)));
      this.community$ = this.communityCollection.valueChanges({ idField: 'id' });
  
      this.communityCollectionFuture = this.afs.collection('community', ref => ref.where('metadata.isoStringFrom', '>', new Date().toISOString().substring(0,10)));
      this.communityFuture$ = this.communityCollectionFuture.valueChanges({ idField: 'id' });

    }else{
      const alert = await this.alertController.create({
        header: 'Du bist nicht eingeloggt.',
        message: 'Bitte logge dich zuerst ein um deine Coworker zu sehen',
        buttons: [
          {
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
          }
        ]
      });
  
      await alert.present();


    }


  }

}
