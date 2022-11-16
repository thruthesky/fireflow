import * as admin from "firebase-admin";

export interface ChatMessageDocument {
  chatRoomId: string;
  senderUserDocumentReference: admin.firestore.DocumentReference<admin.firestore.DocumentData>;
  text: string;
  timestamp: admin.firestore.Timestamp;
}
