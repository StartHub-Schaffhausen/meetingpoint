import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AuthModule, OidcConfigService } from 'angular-auth-oidc-client';

export function configureAuth(oidcConfigService: OidcConfigService): () => Promise<any> {
    return () =>
        oidcConfigService.withConfig({
              stsServer: 'https://europe-west6-starthub-schaffhausen.cloudfunctions.net/api/oidc-test', //https://eid.sh.ch/.well-known/openid-configuration
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
export class AuthConfigModule {}
