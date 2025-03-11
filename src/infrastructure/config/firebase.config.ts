import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';

dotenv.config();

const firebaseCredentials = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'), // Reemplaza los saltos de línea en la clave
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
};

admin.initializeApp({
  credential: admin.credential.cert(
    firebaseCredentials as admin.ServiceAccount,
  ),
});

export const firestore = admin.firestore();
