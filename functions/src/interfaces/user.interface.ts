import * as admin from "firebase-admin";
export interface UserDocument {
  uid: string;
  display_name: string;
  phone_number?: string;
  email?: string;
  created_time: admin.firestore.Timestamp;
  photo_url: string;
  gender: string;
  birth_date: admin.firestore.Timestamp;
}
