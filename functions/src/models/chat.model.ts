import * as admin from "firebase-admin";
import {
  ChatMessageDocument,
  ChatRoomDocument,
} from "../interfaces/chat.interface";
import { Ref } from "../utils/ref";
import { Setting } from "./setting.model";

/**
 * User class
 *
 * It supports user management for cloud functions.
 */
export class Chat {
  static async getRoom(roomId: string): Promise<ChatRoomDocument> {
    const data = await Ref.chatRoomsDoc(roomId).get();
    return data.data() as ChatRoomDocument;
  }
  /**
   * Save chat room settings
   *
   *
   * @param data
   *
   * 참고, 채팅방 정보 문서(/chat_rooms/<docId>)는 사용자가 채팅방에 입장 할 때, ChatRoomMessages 위젯에서 생성된다.
   * 그래서, 여기서 따로 채팅방이 존재하지 않으면 생성 할 필요는 없지만,
   * 사용자가 가입하면 웰컴 메시지를 보내는 경우에는, 채팅방을 생성해야 새 메시지 수 (1) 이 사용자 화면에 표시된다.
   * 그래서 set(merge: true) 로 채팅방을 업데이트 하는 것이다.
   */
  static async updateRoom(
    data: ChatMessageDocument
  ): Promise<admin.firestore.WriteResult> {
    // 채팅방 정보 업데이트
    const info: ChatRoomDocument = {
      last_message: data.text,
      last_message_timestamp: data.timestamp,
      last_message_sent_by: data.senderUserDocumentReference,
      last_message_seen_by: [data.senderUserDocumentReference],
    } as ChatRoomDocument;
    // 1:1 채팅이면, users 배열 추가. (웰컴 메시지에서 필요)
    // 검토, 어쩌면, 웰컴 메시지의 경우, 따로 로직을 분리하는 것이 필요할 수 있겠다.
    if (data.chatRoomDocumentReference.id.indexOf("-") > 0) {
      const arr = data.chatRoomDocumentReference.id.split("-");
      info.users = [Ref.userDoc(arr[0]), Ref.userDoc(arr[1])];
    }
    return data.chatRoomDocumentReference.set(info, { merge: true });
  }

  /**
   * 가입한 사용자에게 welcome 메시지를 보낸다.
   * @param uid 가입한 사용자 UID
   *
   * @return 웰컴 메시지를 전송했으면, 채팅방 ID를 반환한다. 아니면 null.
   */
  static async sendWelcomeMessage(uid: string): Promise<string | null> {
    const system = await Setting.getSystemSettings();
    if (system.helperUid && system.welcomeMessage) {
      const chatRoomId = [system.helperUid, uid].sort().join("-");

      const message: ChatMessageDocument = {
        chatRoomDocumentReference: Ref.chatRoomsCol.doc(chatRoomId),
        senderUserDocumentReference: Ref.userDoc(system.helperUid),
        text: system.welcomeMessage,
        timestamp: admin.firestore.Timestamp.now(),
      };
      await Ref.chatRoomMessagesCol.add(message);

      await this.updateRoom(message);
      return chatRoomId;
    } else {
      return null;
    }
  }

  static async getOtherUserUidsFromChatMessageDocument(
    data: ChatMessageDocument
  ): Promise<string> {
    const chatRoomDoc = await data.chatRoomDocumentReference.get();
    const chatRoomData = chatRoomDoc.data() as ChatRoomDocument;
    const refs = chatRoomData.users.filter(
      (ref) => ref !== data.senderUserDocumentReference
    );

    return refs.map((ref) => ref.id).join(",");
  }
}
