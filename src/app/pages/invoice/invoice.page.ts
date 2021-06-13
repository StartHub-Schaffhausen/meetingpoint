import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import {
  AlertController,
  ModalController
} from '@ionic/angular';
import {
  config
} from 'src/app/config/config';
import {
  Browser
} from '@capacitor/browser';
import {
  AngularFirestore
} from '@angular/fire/firestore';
import {
  AuthService
} from 'src/app/services/auth.service';
import firebase from 'firebase/app';
import 'firebase/auth';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.page.html',
  styleUrls: ['./invoice.page.scss'],
})
export class InvoicePage implements OnInit {
  @Input() invoice: any;
  config = config;
  constructor(
    private modalController: ModalController,
    private afs: AngularFirestore,
    private authService: AuthService
  ) {}

  async ngOnInit() {

    const user: firebase.User = await this.authService.getUser();
    if (user) {
      //this.user$ = await this.afs.collection('users').doc(user.uid).get();


      if (!this.invoice) {
        this.afs.collection('users').doc(user.uid)
          .collection('reservations', ref => ref.where('statusPaid', '==', false)).stateChanges(['added']).subscribe(data => {
            data.forEach(element => {
              console.log();
              this.invoice = element.payload.doc.data();
            });
          });

      }
    }


  }
  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      dismissed: true
    });
  }
  async openLink(link) {
    await Browser.open({
      url: link
    });
    this.dismiss();
  };

}
