import * as admin from "firebase-admin";

export interface GptDocument {
  userDocumentReference: FirebaseFirestore.DocumentReference;
  id: string;
  model: string;
  object: string;
  prompt: string;
  finish_reason: string;
  index: number;
  logprobs: any;
  text: string;
  created: number;
  result?: string;
  max_tokens: number;
  message?: string;
  queryStartedAt?: admin.firestore.Timestamp;
  queryFinishedAt?: admin.firestore.Timestamp;
  createdAt: admin.firestore.Timestamp;
  temperature: number;

  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}
