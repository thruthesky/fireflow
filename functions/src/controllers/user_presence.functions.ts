import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

const firestore = admin.firestore();

// Realtime database 에서 /status/<uid> 가 변경되면, Firestore 로 sync 하는 역할을 한다.
// 특히, 사용자가 offline 이 될 때, 필요하다.
export const onUserStatusChanged = functions.database
    .ref("/status/{uid}")
    .onUpdate(async (change: any, context: any) => {
    // 저장된 데이터를 가져온다.
      const eventStatus = change.after.val();

      // 사용자 공개 문서
      const userStatusFirestoreRef = firestore.doc(
          `users_public_data/${context.params.uid}`
      );

      // 현재 onUpdate() 이벤트가 이전 업데이트로 재귀적으로 덮어쓰여졌을 수 있으므로,
      // 확실히 하기 위해서, 데이터를 한번 더 읽어서, timestamp 를 비교한다.
      const statusSnapshot = await change.after.ref.once("value");
      const status = statusSnapshot.val();
      functions.logger.log(status, eventStatus);
      // 현재 이벤트 문서의 시간 값이, 이전에 발생한 이벤트 문서의 시간 보다 크면, 종료.
      if (status.last_changed > eventStatus.last_changed) {
        return null;
      }

      // Firestore 에 맞게 Timestamp 를 변경
      eventStatus.last_changed = new Date(eventStatus.last_changed);

      // Firestore /users_public_data/<uid> 에 상태 업데이트
      return userStatusFirestoreRef.set(eventStatus, { merge: true });
    });
