import { BadRequestException, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

const client_email = process.env.client_email;
const project_id = process.env.project_id;
const private_key = process.env.private_key;

export const adminFactory = async () => {
  //   //Check if valid google credentials are given
  //   await applicationDefault()
  //     .getAccessToken()
  //     .catch((err) => {
  //       console.error('=========FCM SETUP ERROR==========');
  //       console.error('GOOGLE_APPLICATION_CREDENTIAL env is not set!');
  //       console.error(
  //         'GOOGLE_APPLICATION_CREDENTIAL env value should point to a credentials-service.json filepath.',
  //       );
  //       console.error('===================');
  //       throw err;
  //     });

  //   const fcmApp = initializeApp({
  //     //Make sure to set your service.json to the GOOGLE_APPLICATION_CREDENTIALS env
  //     credential: applicationDefault(),
  //   });

  const adminApp = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: project_id,
      privateKey: private_key.replace(/\\n/g, '\n'),
      clientEmail: client_email,
    }),
  });

  return new FirebaseAdmin(adminApp);
};

@Injectable()
export class FirebaseAdmin {
  client: admin.app.App;
  constructor(adminApp: admin.app.App) {
    this.client = adminApp;
  }

  /**
   *
   * @param token
   * @returns boolean
   *
   * true if token is verified token
   * false if token is not verified token
   */
  async isVerifiedToken(token: string) {
    await this.client
      .auth()
      .verifyIdToken(token)
      .then((val) => {
        if (val) {
          return true;
        }
      })
      .catch((error) => {
        throw new BadRequestException(error);
      });

    return false;
  }
}
