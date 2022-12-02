import * as functions from "firebase-functions";
import { Chat } from "../models/chat.model";
import { ChatMessageDocument } from "../interfaces/chat.interface";
import { Upload } from "../models/upload.model";

// 사용자가 메시지를 보내면, 채팅 방 정보를 업데이트한다.
//
// 참고: README
export const onChatMessageCreate = functions
    .region("asia-northeast3")
    .firestore.document("/chat_room_messages/{documentId}")
    .onCreate(async (snap) => {
      const futures = [];
      const chatMessage = snap.data() as ChatMessageDocument;
      futures.push(
          Chat.updateRoom(chatMessage),
          Upload.setReference(
              chatMessage.photo_url ?? "",
              `/chat_room_messages/${snap.id}`
          )
      );
      return Promise.all(futures);
    });
