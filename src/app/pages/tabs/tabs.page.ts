import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import 'firebase/auth';
import { Observable } from 'rxjs';
import { Reservation } from 'src/app/models/reservation';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {
  isAdmin = false;
  isBock = false;
  isStartHub = false;
  user: firebase.User;
  reservation$: Observable<Reservation[]>;
  private reservationCollection: AngularFirestoreCollection<Reservation>;
  constructor(
    private afs: AngularFirestore,
    private authService: AuthService,
  ) {

  }

  async ngOnInit(){
    const user: firebase.User = await this.authService.getUser();
    const userRef = await this.afs.collection('users').doc<any>(user.uid).get();
    userRef.subscribe(userData=>{
      this.isAdmin = userData.data().admin || false;
      this.isBock = userData.data().isBock || false;
      this.isStartHub = userData.data().isStartHub || false;
    })


    if (user){
      this.reservationCollection = this.afs.collection('users').doc(user.uid)
      .collection<Reservation>('reservations', ref => ref.where('dateTo', '>=', new Date())
      .orderBy('dateTo'));
      this.reservation$ = this.reservationCollection.valueChanges({ idField: 'id' });

      this.user = user;
    }
  }

}
