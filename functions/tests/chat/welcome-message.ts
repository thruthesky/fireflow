import "mocha";
import { expect } from "chai";

import * as admin from "firebase-admin";

import { Setting } from "../../src/models/setting.model";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      "../keys/withcenter-kmeet-firebase-adminsdk.json"
    ),
  });
}

describe("Get system settings", () => {
  it("Get system settings", async () => {
    const size = await Setting.getSystemSettings();
    console.log(size);
    expect(size).to.be.an("object");
  });
});
