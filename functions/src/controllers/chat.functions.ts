import * as functions from "firebase-functions";
import { Chat } from "../models/chat.model";
import { ChatMessageDocument } from "../interfaces/chat.interface";

// 사용자가 메시지를 보내면, 채팅 방 정보를 업데이트한다.
//
// 참고: README
export const onChatMessageCreate = functions
    .region("asia-northeast3")
    .firestore.document("/chat_room_messages/{documentId}")
    .onCreate((snap) => {
      const futures = [];
      futures.push(Chat.updateRoom(snap.data() as ChatMessageDocument));
      return Promise.all(futures);
    });
