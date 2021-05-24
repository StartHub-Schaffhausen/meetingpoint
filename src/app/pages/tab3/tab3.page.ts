import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserProfile } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{

  user: UserProfile;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(){

    this.user = {
      email: '',
      firstName: '',
      lastName: '',
      profilePicture: ''
    };
  }


  async logout(){
    await this.authService.logoutUser();
    this.router.navigateByUrl('logout');
  }

  async saveProfile(){

  }

}

