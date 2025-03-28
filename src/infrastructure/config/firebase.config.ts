import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';

dotenv.config();

const firebaseCredentials = process.env.FIREBASE_CREDENTIALS_BASE64
  ? JSON.parse(
      Buffer.from(process.env.FIREBASE_CREDENTIALS_BASE64, 'base64').toString(
        'utf8',
      ),
    )
  : null;

if (!firebaseCredentials) {
  throw new Error(
    'No se encontraron credenciales de Firebase. Verifica la variable de entorno FIREBASE_CREDENTIALS_BASE64.',
  );
}

admin.initializeApp({
  credential: admin.credential.cert(firebaseCredentials),
});

export const firestore = admin.firestore();
