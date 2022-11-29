import * as functions from "firebase-functions";
import { UserDocument } from "../interfaces/user.interface";
import { User } from "../models/user.model";
import { Setting } from "../models/setting.model";
import { UserSetting } from "../models/user_setting.model";
import { Chat } from "../models/chat.model";
export const onUserCreate = functions
  .region("asia-northeast3")
  .firestore.document("/users/{uid}")
  .onCreate((snap, context) => {
    const futures = [];
    futures.push(
      Setting.increaseNoOfUsers(),
      User.updatePublicData(context.params.uid, snap.data() as UserDocument),
      UserSetting.create(context.params.uid, "settings"),
      Chat.sendWelcomeMessage(context.params.uid)
    );
    return Promise.all(futures);
  });

export const onUserUpdate = functions
  .region("asia-northeast3")
  .firestore.document("/users/{uid}")
  .onUpdate((snap, context) => {
    const futures = [];
    futures.push(
      User.updatePublicData(
        context.params.uid,
        snap.after.data() as UserDocument
      ),
      User.command(context.params.uid, snap.after.data() as UserDocument)
    );
    return Promise.all(futures);
  });
