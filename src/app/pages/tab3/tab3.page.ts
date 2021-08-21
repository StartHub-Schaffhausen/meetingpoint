import {
  Component,
  OnInit
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

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  userProfile$: Observable < UserProfile > ;
  private userProfileRef: AngularFirestoreDocument < UserProfile > ;
  private userProfileId = "";

  constructor(
    private loadingController: LoadingController,
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController,
    private afs: AngularFirestore,
    private afstorage: AngularFireStorage
  ) {

  }

  async ngOnInit() {
    const user = await this.authService.getUser();
    if (user) {
      this.userProfileId = user.uid;
      this.userProfileRef = this.afs.collection('users').doc < UserProfile > (user.uid);
      this.userProfile$ = this.userProfileRef.valueChanges();
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

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Änderungen gespeichert.',
      color: 'success',
      position: 'bottom',
      duration: 2000
    });
    toast.present();
  }

  async takePicture(userProfile) {
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
  }
}
