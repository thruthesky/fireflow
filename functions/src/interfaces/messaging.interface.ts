import * as admin from "firebase-admin";

export interface SendMessage {
  id?: string; // / postId
  postId?: string; // postId from comment.
  uid?: string; // / added by 'auth' in flutter.
  uids?: string; // a single uid or a list of uids seperated by comma.
  users?: string[];
  tokens?: string;
  topic?: string;
  title?: string;
  body?: string; // message body
  content?: string; // this will be used as message body if message body is empty.
  type?: string;

  badge?: string;
  icon?: string; // imageUrl

  // for sending messages of new posts, comments.
  userDocumentReference?: admin.firestore.DocumentReference;

  clickAction?: string; // customize web click action
  chatRoomDocumentReference?: admin.firestore.DocumentReference; // 채팅방 ref
  // 푸시 알림 전송자 ref ( 글, 코멘트, 채팅 메시지 등에서 푸시 알림 전송자 ref)
  senderUserDocumentReference?: admin.firestore.DocumentReference;

  //
  action?: string;

  // for sending messages by action. Like post-create, comment-create.
  postDocumentReference?: admin.firestore.DocumentReference;

  // for sending messages by action. Like post-create, comment-create.
  category?: string;
}

export interface MessagePayload {
  topic?: string;
  token?: string;
  data: {
    id?: string;
    type?: string;
    senderUserDocumentReference?: string;
    chatRoomDocumentReference?: string;
    badge?: string;
    [key: string]: any;
  };
  notification: {
    title: string;
    body: string;
  };
  webpush: {
    notification: {
      title: string;
      body: string;
      icon?: string;
      /* eslint-disable camelcase */
      click_action: string;
    };
    /* eslint-disable camelcase */
    fcm_options: {
      link: string;
    };
  };
  android: {
    notification: {
      /* eslint-disable camelcase */
      channel_id?: string;
      /* eslint-disable camelcase */
      click_action?: string;
      sound?: string;
    };
  };
  apns: {
    payload: {
      aps: {
        sound: string;
        badge?: number;
      };
    };
  };
}



export interface SendMessageToDocument {
  title?: string;
  body?: string;
  image_url?: string;
  sound?: string;
  parameter_data?: string;
  target_audience?: string;
  initial_page_name?: string;
  user_refs?: string;
  status?: string;
  error?: string;
  batch_index?: number;
  num_batches?: number;
}
