import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { OidcService } from 'src/app/services/oidc.service';

@Component({
  selector: 'app-oidc',
  templateUrl: './oidc.page.html',
  styleUrls: ['./oidc.page.scss'],
})
export class OidcPage implements OnInit {

  
  constructor(private route: ActivatedRoute,
    private oidc: OidcService,
    private router: Router, 
    private authService: AuthService) { }

  ngOnInit() {

    this.route.queryParams
      .subscribe(params => {
        console.log(params);
        
        console.log("code: " + params.code);
        console.log("state: " + params.state);

        /* this.oidc.getEidUserData(params.code, params.state).subscribe(data=>{
          console.log(data);
        }); */

        try{
          this.oidc.getEidLogin(params.code, params.state).pipe(first()).toPromise().then(data =>{
            console.log(data);
            this.authService.loginWithToken(data as string).then( ()=>{
              
              this.router.navigateByUrl('/');
              
            });
          });
        }catch(e){
          this.router.navigateByUrl('/');
        }


      }
    ).unsubscribe();
    

  }
  ngOnDestroy(){

  }

}
