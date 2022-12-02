import * as admin from "firebase-admin";

export class Upload {
  static getPathFromUrl(url: string): string {
    return (
      url.split("?").shift()?.split("/").pop()?.replaceAll("%2F", "/") ?? ""
    );
  }

  // / This function is used to update the 'targetReferencePath' field of the metadata of the uploaded files
  static async setReference(
      urls: string | string[],
      targetReferencePath: string,
      type: "" | "profilePhoto" | "coverPhoto" = ""
  ) {
    // / Update 'targetReferencePath' field of the metadata of the url in the 'urls' array to the 'reference' value
    urls = Array.isArray(urls) ? urls : [urls];

    const futures = [];

    for (const url of urls) {
      if (!url) continue;
      const bucket = admin.storage().bucket();

      const file = bucket.file(this.getPathFromUrl(url));

      futures.push(
          file.setMetadata({
            metadata: {
              targetReferencePath: targetReferencePath,
              collectionName: targetReferencePath.split("/")[1]?.replace("/", ""),
              documentId: targetReferencePath.split("/").pop()?.replace("/", ""),
              type: type,
            },
          })
      );
    }
    return Promise.all(futures);
  }
}
