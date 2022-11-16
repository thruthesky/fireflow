import * as admin from "firebase-admin";
export interface PostDocument {
  id: string;
  category: string;
  userDocumentReference: admin.firestore.DocumentReference;
  createdAt: admin.firestore.Timestamp;
  title: string;
  content?: string;
  files: string[];
  noOfComments: number;
  likes: admin.firestore.DocumentReference[];
  noOfLikes: number;
}

export interface CommentDocument {
  id: string;
  userDocumentReference: admin.firestore.DocumentReference;
  postDocumentReference: admin.firestore.DocumentReference;
  commentParentDocumentReference: admin.firestore.DocumentReference;
  createdAt: admin.firestore.Timestamp;
  content: string;
  files: string[];
  order: string;
  depth: number;
  likes: admin.firestore.DocumentReference[];
  noOfLikes: number;
}


