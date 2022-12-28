import * as admin from "firebase-admin";
interface GptChoice {
  finish_reason: string;
  index: number;
  logprobs: any;
  text: string;
}
export interface GptDocument {
  choices: GptChoice[];
  created: number;
  id: string;
  model: string;
  object: string;
  prompt: string;
  result?: string;
  max_tokens: number;
  message?: string;
  queryStartedAt?: admin.firestore.Timestamp;
  queryFinishedAt?: admin.firestore.Timestamp;
  temperature: number;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}
