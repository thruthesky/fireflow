import * as admin from "firebase-admin";

export interface ChatMessageDocument {
  chatRoomId: string;
  senderUserDocumentReference: admin.firestore.DocumentReference;
  text: string;
  timestamp: admin.firestore.Timestamp;
}

export interface ChatRoomDocument {
  chatRoomId: string;
  last_message: string;
  last_message_seen_by: Array<admin.firestore.DocumentReference>;
  last_message_sent_by: admin.firestore.DocumentReference;
  last_message_timestamp: admin.firestore.Timestamp;
  users: Array<admin.firestore.DocumentReference>;
}
