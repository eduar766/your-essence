import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config();

const firebaseCredentialsPath = process.env.FIREBASE_CREDENTIALS;

if (!firebaseCredentialsPath) {
  throw new Error('🔥 FIREBASE_CREDENTIALS environment variable is not set!');
}

const serviceAccount = JSON.parse(
  fs.readFileSync(firebaseCredentialsPath, 'utf8'),
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const firestore = admin.firestore();
