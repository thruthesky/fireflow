import * as functions from "firebase-functions";
import { Chat } from "../models/chat.model";
import { ChatMessageDocument, ChatRoomDocument } from "../interfaces/chat.interface";
import { EventType } from "../utils/event-name";
import { Messaging } from "../models/messaging.model";
import { Ref } from "../utils/ref";
import { SendMessage } from "../interfaces/messaging.interface";

// 사용자가 메시지를 보내면, 채팅 방 정보를 업데이트한다.
//
// 참고: README
// export const onChatMessageCreate = functions
//   .region("asia-northeast3")
//   .firestore.document("/chat_room_messages/{documentId}")
//   .onCreate(async (snap) => {
//     const futures = [];
//     futures.push(Chat.updateRoom(snap.data() as ChatMessageDocument));
//     return Promise.all(futures);
//   });


// 사용자가 메시지를 보내면, 채팅 방 정보를 업데이트한다.
//
// 참고: README
export const onChatMessageCreate = functions
    .region("asia-northeast3")
    .firestore.document("/chat_room_messages/{documentId}")
    .onCreate(async (snap) => {
      const futures = [];
      const data = snap.data() as ChatMessageDocument;
      futures.push(Chat.updateRoom(data));

      // Send push notification get other user uid
      console.log("data:: ", data);
      const chatRoomSnap = await Ref.chatRoomsDoc(data["chatRoomId"]).get();
      const chatRoomData = chatRoomSnap.data() as ChatRoomDocument;

      console.log(` ${data.senderUserDocumentReference} == ${chatRoomData.users[0]}`);
      const otherUserUid = data.senderUserDocumentReference.id == chatRoomData.users[0].id ? chatRoomData.users[1].id : chatRoomData.users[0].id;

      console.log("otherUserDocumentReference:: ", otherUserUid);
      const senderSnap = await Ref.publicDoc(data.senderUserDocumentReference.id).get();
      const displayName = senderSnap.get("display_name") ?? "";
      const sendMessage = {
        type: EventType.chat,
        title: `${displayName} send you a message.`,
        body: data.text,
        senderUid: data.senderUserDocumentReference.id,
        uids: otherUserUid,
      } as SendMessage;
      console.log("sendMessage:: ", sendMessage);
      futures.push(Messaging.sendMessage(sendMessage));
      //


      return Promise.all(futures);
    });
