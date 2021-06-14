import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Reservation } from 'src/app/models/reservation';
import firebase from 'firebase/app';
import { AuthService } from 'src/app/services/auth.service';
import { Browser } from '@capacitor/browser';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  reservation$: Observable<any[]>;
  reservationPast$: Observable<any[]>;
  private reservationCollection: AngularFirestoreCollection<Reservation>;
  private reservationCollectionPast: AngularFirestoreCollection<Reservation>;
  constructor(
    private afs: AngularFirestore,
    private authService: AuthService
  ) { }

  async ngOnInit() {
    const user: firebase.User = await this.authService.getUser();
    if (user){
      this.reservationCollection = this.afs.collection('invoices', ref => ref.where('reservationTo', '>=', new Date()).where('canceled', '==', false)
      .orderBy('reservationTo'));
      this.reservation$ = this.reservationCollection.valueChanges({ idField: 'id' });
    }
  }
  async openLink(link) {
    await Browser.open({ url: link });
  };
}
