import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { RuntimeOptions } from "firebase-functions";
import { ChatMessageDocument } from "../interfaces/chat.interface";
import { CommentDocument, PostDocument } from "../interfaces/forum.interface";
import { SendMessage } from "../interfaces/messaging.interface";
import { Messaging } from "../models/messaging.model";
import { EventName, EventType } from "../utils/event-name";

const pushNotificationRuntimeOpts: RuntimeOptions = {
  timeoutSeconds: 540,
  memory: "2GB",
};

export const messagingOnPostCreate = functions
  .region("asia-northeast3")
  .firestore.document("/posts/{postId}")
  .onCreate((snapshot) => {
    const post: PostDocument = snapshot.data() as PostDocument;
    const data: SendMessage = {
      ...post,
      id: snapshot.id,
      action: EventName.postCreate,
      type: EventType.post,
      senderUserDocumentReference: post.userDocumentReference,
    };
    return Messaging.sendMessage(data);
  });

export const messagingOnCommentCreate = functions
  .region("asia-northeast3")
  .firestore.document("/comments/{commentId}")
  .onCreate((snapshot) => {
    const comment: CommentDocument = snapshot.data() as CommentDocument;
    const data: SendMessage = {
      ...comment,
      id: snapshot.id,
      action: EventName.commentCreate,
      type: EventType.post,
      senderUserDocumentReference: comment.userDocumentReference,
    };
    return Messaging.sendMessage(data);
  });

export const pushNotificationQueue = functions
  .region("asia-northeast3")
  .firestore.document("/push-notifications-queue/{docId}")
  .onCreate(async (snapshot) => {
    console.log("pushNotificationQueue::", JSON.stringify(snapshot));
    const re = await Messaging.sendMessage(snapshot.data() as SendMessage);

    console.log("re::", re);
    return admin
      .firestore()
      .collection("push-notifications-queue")
      .doc(snapshot.id)
      .update({
        ...re,
        sentAt: admin.firestore.FieldValue.serverTimestamp(),
      });
  });

export const messagingOnChatMessageCreate = functions
  .region("asia-northeast3")
  .firestore.document("/chat_room_messages/{documentId}")
  .onCreate(async (snap) => {
    const futures = [];

    futures.push(
      Messaging.sendChatNotificationToOtherUsers(
        snap.data() as ChatMessageDocument
      )
    );
    return Promise.all(futures);
  });

export const sendPushNotificationsOnCreate = functions
  .region("asia-northeast3")
  .runWith(pushNotificationRuntimeOpts)
  .firestore.document("push_notifications/{documentId}")
  .onCreate(async (snapshot) => {
    try {
      await Messaging.sendPushNotifications(snapshot);
    } catch (e) {
      console.log(`Error: ${e}`);
      await snapshot.ref.update({ status: "failed", error: `${e}` });
    }
  });
