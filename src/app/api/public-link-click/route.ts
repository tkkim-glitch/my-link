import { applicationDefault, getApps, initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { publicUsername } from "@/lib/public-profile-path";

function validDocumentId(value: unknown): value is string {
  return typeof value === "string" && value.length > 0 && value.length <= 128
    && !value.includes("/") && value !== "." && value !== ".." && !/^__.*__$/.test(value);
}

function getClickApp() {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) throw new Error("Firebase project ID is missing.");
  const name = "mylink-clicks";
  return getApps().find((item) => item.name === name)
    ?? initializeApp({ credential: applicationDefault(), projectId }, name);
}

export async function POST(request: Request) {
  if (request.headers.get("sec-fetch-site") === "cross-site") {
    return new Response(null, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const username = typeof body?.username === "string" ? publicUsername(body.username) : "";
  const ownerUid = validDocumentId(body?.ownerUid) ? body.ownerUid : "";
  const linkId: unknown = body?.linkId;
  if ((!username && !ownerUid) || (username && ownerUid) || !validDocumentId(linkId)) {
    return new Response(null, { status: 400 });
  }

  let stage = "credentials";
  try {
    const app = getClickApp();
    if (!process.env.FIRESTORE_EMULATOR_HOST) {
      await app.options.credential?.getAccessToken();
    }
    stage = "firestore";
    const db = getFirestore(app);
    const counted = await db.runTransaction(async (transaction) => {
      let uid: unknown = ownerUid;
      if (username) {
        const publication = await transaction.get(db.collection("publicProfilesByUsername").doc(username));
        uid = publication.get("uid");
      }
      if (!validDocumentId(uid)) return false;

      const profile = db.collection("users").doc(uid);
      const link = profile.collection("links").doc(linkId);
      const [owner, target] = await Promise.all([transaction.get(profile), transaction.get(link)]);
      const savedName = owner.get("publicUsername");
      if (typeof savedName !== "string" || !publicUsername(savedName) || !target.exists) return false;

      if (username) {
        if (savedName !== username) return false;
      } else {
        const publication = await transaction.get(db.collection("publicProfilesByUsername").doc(savedName));
        if (publication.get("uid") !== uid) return false;
      }

      transaction.update(link, { clickCount: FieldValue.increment(1) });
      return true;
    });

    if (!counted) {
      console.warn("[public-link-click] Public profile or link not found", { username, ownerUid, linkId });
      return new Response(null, { status: 404 });
    }
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("[public-link-click] Click could not be recorded", { stage, username, ownerUid, linkId, error });
    return new Response(null, { status: stage === "credentials" ? 503 : 500 });
  }
}
