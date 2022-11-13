import * as admin from "firebase-admin";
import { DocumentReference } from "firebase-admin/firestore";
export interface PostDocument {
  userDocumentReference: DocumentReference;
  category: string;
  title: string;
  content: string;
  createdAt: admin.firestore.Timestamp;
  files: Array<string>;
}
