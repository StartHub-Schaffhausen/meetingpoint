import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Observable, pipe } from 'rxjs';
import { UserProfile } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { Camera, CameraSource, CameraResultType } from '@capacitor/camera';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{
  userProfile$: Observable<UserProfile>;
 // invoices$: Observable<any[]>;
  private userProfileRef: AngularFirestoreDocument<UserProfile>;
  //private invoiceCollection: AngularFirestoreCollection<any>;




  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController,
    private afs: AngularFirestore,
  ) {

  }

  async ngOnInit(){
    const user = await this.authService.getUserProfile();
    if(user){
      this.userProfileRef = this.afs.collection('users').doc<UserProfile>(user.uid);
      this.userProfile$ = this.userProfileRef.valueChanges();

     /* this.invoiceCollection = this.afs.collection('users').doc(user.uid)
      .collection<any>('invoices');
      this.invoices$ = this.invoiceCollection.valueChanges({ idField: 'id' });
*/


    }
  }

  openInvoice(invoice){

    if (invoice.statusPaid){
      Browser.open({ url: invoice.pdf });
    }else{
      Browser.open({ url: invoice.stripeInvoiceUrl });
    }
  }

  async logout(){
    await this.authService.logoutUser();
    this.router.navigateByUrl('logout');
  }

  async saveProfile(userProfile){
    await this.userProfileRef.update(userProfile);
    this.presentToast();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Änderungen gespeichert.',
      color: 'success',
      position: 'bottom',
      duration: 2000
    });
    toast.present();
  }

  async takePicture(userProfile){
    const image = await Camera.getPhoto({
      quality: 90,
      correctOrientation: true,
      source: CameraSource.Prompt,
      allowEditing: true,
      resultType: CameraResultType.Base64
    });
    // image.webPath will contain a path that can be set as an image src.
    // You can access the original file using image.path, which can be
    // passed to the Filesystem API to read the raw data of the image,
    // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
//    let imageUrl = image.webPath;

//console.log(image);
    userProfile.profilePicture = 'data:image/' + image.format.toLowerCase() + ';base64,'  + image.base64String;
    await this.userProfileRef.set(userProfile);

}
}

