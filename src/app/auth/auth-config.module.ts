import { NgModule } from '@angular/core';
import {  AuthModule,  LogLevel} from 'angular-auth-oidc-client';

@NgModule({
  imports: [
    AuthModule.forRoot({
      config: {
        authority: 'https://europe-west6-starthub-schaffhausen.cloudfunctions.net/api/oidc-test', //https://eid.sh.ch/.well-known/openid-configuration'
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

/*import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AuthModule, OidcConfigService } from 'angular-auth-oidc-client';

export function configureAuth(oidcConfigService: OidcConfigService): () => Promise<any> {
    return () =>
        oidcConfigService.withConfigs({
              authority: 'https://europe-west6-starthub-schaffhausen.cloudfunctions.net/api/oidc-test', //https://eid.sh.ch/.well-known/openid-configuration'
              redirectUrl: 'http://localhost:8100/oidc', //window.location.origin,
              postLogoutRedirectUri: window.location.origin,
              clientId: 'starthubmeetingpoint',
              scope: 'openid email profile address', // 'openid profile offline_access ' + your scopes
              responseType: 'code',
              silentRenew: true,
              useRefreshToken: true,
              renewTimeBeforeTokenExpiresInSeconds: 30,
          });
}

@NgModule({
    imports: [AuthModule.forRoot()],
    exports: [AuthModule],
    providers: [
        OidcConfigService,
        {
            provide: APP_INITIALIZER,
            useFactory: configureAuth,
            deps: [OidcConfigService],
            multi: true,
        },
    ],
})
export class AuthConfigModule {}*/
