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
  deleted?: boolean;
}

export interface CommentDocument {
  id: string;
  userDocumentReference: admin.firestore.DocumentReference;
  postDocumentReference: admin.firestore.DocumentReference;
  parentCommentDocumentReference: admin.firestore.DocumentReference;
  createdAt: admin.firestore.Timestamp;
  content: string;
  files: string[];
  order: string;
  depth: number;
  likes: admin.firestore.DocumentReference[];
  noOfLikes: number;
}

export interface CategoryDocument {
  id: string;
  category: string;
  title: string;
  noOfPosts: number;
  noOfComments: number;
}
