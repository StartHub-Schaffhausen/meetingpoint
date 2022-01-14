import { NgModule } from '@angular/core';
import { AuthModule, LogLevel} from 'angular-auth-oidc-client';

@NgModule({
  imports: [
    AuthModule.forRoot({
      config: {
        authority: 'https://europe-west6-starthub-schaffhausen.cloudfunctions.net/api/oidc-test',  // '/proxy/.well-known/openid-configuration' 'https://europe-west6-starthub-schaffhausen.cloudfunctions.net/api/oidc-test', //https://eid.sh.ch/.well-known/openid-configuration'
        redirectUrl: window.location.origin + '/oidc', //window.location.origin,
        postLogoutRedirectUri: window.location.origin,
        clientId: 'starthubmeetingpoint',
        scope: 'openid email profile address',
        responseType: 'code',
        silentRenew: true,
        useRefreshToken: true,
        renewTimeBeforeTokenExpiresInSeconds: 30,
        logLevel: LogLevel.Debug,
      },
    }),
  ],
  exports: [AuthModule],
})
export class AuthConfigModule {}
