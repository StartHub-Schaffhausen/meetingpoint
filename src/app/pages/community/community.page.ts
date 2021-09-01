import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-community',
  templateUrl: './community.page.html',
  styleUrls: ['./community.page.scss'],
})
export class CommunityPage implements OnInit {
  community$: Observable<any[]>;
  communityCollection: AngularFirestoreCollection<any>;

  communityFuture$: Observable<any[]>;
  communityCollectionFuture: AngularFirestoreCollection<any>;

  constructor(
    private afs: AngularFirestore,
    private authService: AuthService
  ) { }

  async ngOnInit() {

    this.communityCollection = this.afs.collection('community', ref => ref.where('metadata.isoStringFrom', '==', new Date().toISOString().substring(0,10)));
    this.community$ = this.communityCollection.valueChanges({ idField: 'id' });

    this.communityCollectionFuture = this.afs.collection('community', ref => ref.where('metadata.isoStringFrom', '>', new Date().toISOString().substring(0,10)));
    this.communityFuture$ = this.communityCollectionFuture.valueChanges({ idField: 'id' });
  }

}
