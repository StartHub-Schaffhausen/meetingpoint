import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserProfile } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  user: UserProfile;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}


  async logout(){
    await this.authService.logoutUser();
    this.router.navigateByUrl('logout');
  }
}
