import * as admin from "firebase-admin";
import { DocumentReference } from "firebase-admin/firestore";
export interface UserDocument {
  uid: string;
  display_name: string;
  phone_number?: string;
  email?: string;
  created_time: admin.firestore.Timestamp;
  photo_url: string;
  gender: string;
  birth_date: admin.firestore.Timestamp;
  blockedUserList?: Array<DocumentReference>;
}




export interface UserSettingsDocument {
  action: string;
  category: string;
  type?: string;
  userDocumentReference: admin.firestore.DocumentReference;
}