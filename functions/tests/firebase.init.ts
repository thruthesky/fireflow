import * as admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      "../keys/withcenter-kmeet-firebase-adminsdk.json"
    ),
  });
}
