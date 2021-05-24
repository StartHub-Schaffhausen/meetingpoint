import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserProfile } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{
  userProfile: Observable<UserProfile>;
  private userProfileDoc: AngularFirestoreDocument<UserProfile>;

  constructor(
    private authService: AuthService,
    private router: Router,
    private afs: AngularFirestore,
  ) {

  }

  async ngOnInit(){
    const user = await this.authService.getUserProfile();

    if(!user){
      this.userProfileDoc = this.afs.collection('users').doc<UserProfile>(user.uid);
      this.userProfile = this.userProfileDoc.valueChanges();
    }
  }


  async logout(){
    await this.authService.logoutUser();
    this.router.navigateByUrl('logout');
  }

  async saveProfile(userProfile){
    this.userProfileDoc.update({
      email: userProfile.email,
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      profilePicture: userProfile.profilePicture

    });

  }

}

