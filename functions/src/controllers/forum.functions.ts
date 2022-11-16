import * as functions from "firebase-functions";
import { User } from "../models/user.model";
import { PostDocument } from "../interfaces/forum.interface";

export const onPostCreate = functions
  .region("asia-northeast3")
  .firestore.document("/posts/{uid}")
  .onCreate((snap, context) => {
    const futures = [];

    const post = snap.data() as PostDocument;

    futures.push(User.increaseNoOfPosts(post.userDocumentReference));
    return Promise.all(futures);
  });
