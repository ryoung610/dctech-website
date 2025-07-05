import { defineAuth, secret } from '@aws-amplify/backend';

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: {
      verificationEmailStyle: 'CODE',
      verificationEmailSubject: 'Welcomes to DCtech!',
      verificationEmailBody: createCode =>
        `Hello, pleae use this code to confirm your account: ${createCode()}`,
    },
    externalProviders: {
      callbackUrls: [
        'http://localhost:8080/',
        'https://lllhqvideo.d12qapjfjtfl4g.amplifyapp.com/',
        'https://www.dcfuturetech.com/'
      ],
      logoutUrls: [
        'http://localhost:8080/',
        'https://lllhqvideo.d12qapjfjtfl4g.amplifyapp.com/',
        'https://www.dcfuturetech.com/'
      ],
      google: {
        clientId: secret('GOOGLE_CLIENT_ID'),
        clientSecret: secret('GOOGLE_CLIENT_SECRET'),
        scopes: ['email', 'openid', 'profile'],
        attributeMapping: {
          email: 'email',
        },
      },
    },
  },
});
