import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-oidc',
  templateUrl: './oidc.page.html',
  styleUrls: ['./oidc.page.scss'],
})
export class OidcPage implements OnInit {

  
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {

    this.route.queryParams
      .subscribe(params => {
        console.log(params); // { orderby: "price" }
        
        console.log("code: " + params.code);
        console.log("state: " + params.state);

      }
    ).unsubscribe();
    

  }
  ngOnDestroy(){

  }

}
