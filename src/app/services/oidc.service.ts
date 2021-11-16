import { Injectable } from '@angular/core';
import {AngularFireFunctions} from '@angular/fire/functions';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OidcService {

  constructor(
    private functions: AngularFireFunctions,
    private oidcSecurityService: OidcSecurityService) {}


  getEidLogin(token: string, state: string): Observable<string | undefined> {
    const callable: (data: any) => Observable<string | undefined> = this.functions.httpsCallable<any, string | undefined>(
      'eidLogin'
      );
    return callable({authorization_code: token, state: state, redirect_uri: this.oidcSecurityService.getConfiguration().redirectUrl });
  }

  getEidUserData(token: string, state: string): Observable<any | undefined> {
    const callable: (data: any) => Observable<any | undefined> = this.functions.httpsCallable<any, any | undefined>(
      'eidData'
    );
    return callable({authorization_code: token, state: state, redirect_uri: this.oidcSecurityService.getConfiguration().redirectUrl } );
  }
}
