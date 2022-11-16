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
   * Save settings
   */
  static async updateRoom(
      data: ChatMessageDocument
  ): Promise<admin.firestore.WriteResult> {
    const arr = data.chatRoomId.split("-");
    return Ref.chatRoomsDoc(data.chatRoomId).set(
        {
          chatRoomId: data.chatRoomId,
          last_message: data.text,
          last_message_timestamp: data.timestamp,
          last_message_sent_by: data.senderUserDocumentReference,
          last_message_seen_by: [data.senderUserDocumentReference],
          users: [Ref.userDoc(arr[0]), Ref.userDoc(arr[1])],
        },
        { merge: true }
    );
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
        chatRoomId: chatRoomId,
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
}
