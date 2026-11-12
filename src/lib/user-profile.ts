import type { User } from "firebase/auth";
import { doc, runTransaction, type Firestore, type Transaction } from "firebase/firestore";
import { publicUsername } from "@/lib/public-profile-path";

export function profileFromAccount(user: User) {
  const google = user.providerData.find(({ providerId }) => providerId === "google.com");
  return {
    uid: user.uid,
    displayName: google?.displayName ?? user.displayName ?? "",
    username: (google?.email ?? user.email ?? "").split("@")[0],
    photoURL: google?.photoURL ?? user.photoURL ?? "",
    bio: "",
    publicUsername: "",
  };
}

export type UserProfile = ReturnType<typeof profileFromAccount>;
export type ProfileFields = Pick<UserProfile, "username" | "displayName" | "bio">;

function readProfile(data: Record<string, unknown>, defaults: UserProfile): UserProfile {
  return {
    uid: defaults.uid,
    displayName: typeof data.displayName === "string" ? data.displayName : defaults.displayName,
    username: typeof data.username === "string" ? data.username : defaults.username,
    photoURL: typeof data.photoURL === "string" ? data.photoURL : defaults.photoURL,
    bio: typeof data.bio === "string" ? data.bio : defaults.bio,
    publicUsername: typeof data.publicUsername === "string" ? data.publicUsername : "",
  };
}

async function readUsernameClaim(db: Firestore, transaction: Transaction, key: string, uid: string) {
  const reservation = doc(db, "usernames", key);
  const publication = doc(db, "publicProfilesByUsername", key);
  const owner = await transaction.get(reservation);
  const published = await transaction.get(publication);
  if ((owner.exists() && owner.data().uid !== uid) || (published.exists() && published.data().uid !== uid)) {
    return null;
  }
  return { reservation, publication, reserved: owner.exists() };
}

function publishProfile(transaction: Transaction, claim: NonNullable<Awaited<ReturnType<typeof readUsernameClaim>>>, profile: UserProfile) {
  if (!claim.reserved) transaction.set(claim.reservation, { uid: profile.uid });
  transaction.set(claim.publication, {
    uid: profile.uid,
    username: profile.username,
    displayName: profile.displayName,
    bio: profile.bio,
  });
}

export function ensureUserProfile(db: Firestore, user: User): Promise<UserProfile> {
  const reference = doc(db, "users", user.uid);
  const defaults = profileFromAccount(user);

  return runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(reference);
    if (snapshot.exists()) {
      const data = snapshot.data();
      const profile = readProfile(data, defaults);
      const key = typeof data.username === "string" ? publicUsername(profile.username) : "";
      if (!key || profile.publicUsername === key) return profile;

      const claim = await readUsernameClaim(db, transaction, key, user.uid);
      if (!claim) return profile;

      const published = { ...profile, publicUsername: key };
      publishProfile(transaction, claim, published);
      transaction.update(reference, { publicUsername: key, displayName: profile.displayName, bio: profile.bio });
      return published;
    }

    const prefix = defaults.username.toLowerCase().replace(/[^a-z0-9._-]/g, "-").replace(/^[^a-z0-9]+/, "");
    const preferred = publicUsername(prefix.slice(0, 40));
    const suffix = globalThis.crypto.randomUUID().slice(0, 8);
    const alternative = `${prefix.slice(0, 30) || "user"}-${suffix}`;
    for (const key of [preferred, alternative]) {
      if (!key) continue;
      const claim = await readUsernameClaim(db, transaction, key, user.uid);
      if (!claim) continue;

      const profile = { ...defaults, username: key, publicUsername: key };
      publishProfile(transaction, claim, profile);
      transaction.set(reference, profile);
      return profile;
    }
    throw new Error("사용 가능한 아이디를 만들지 못했어요. 다시 시도해 주세요.");
  });
}

export function updateUserProfile(db: Firestore, user: User, fields: ProfileFields): Promise<UserProfile> {
  const enteredUsername = fields.username.trim();
  const key = publicUsername(enteredUsername);
  const displayName = fields.displayName.trim();
  const bio = fields.bio.trim();
  if (!key) {
    throw new Error("예약된 아이디이거나 주소에 사용할 수 없는 아이디예요. 영문 또는 숫자로 시작하고, 영문·숫자·점·밑줄·하이픈으로 40자 이내로 입력해 주세요.");
  }
  if (!displayName) throw new Error("표시 이름을 입력해 주세요.");

  const reference = doc(db, "users", user.uid);
  return runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(reference);
    if (!snapshot.exists()) throw new Error("프로필을 먼저 불러와 주세요.");

    const profile = readProfile(snapshot.data(), profileFromAccount(user));
    const currentKey = profile.username.toLowerCase();
    const claim = await readUsernameClaim(db, transaction, key, user.uid);
    if (!claim) throw new Error("다른 계정에서 사용 중인 아이디예요.");

    const previousReservation = /^[a-z0-9][a-z0-9._-]{0,39}$/.test(currentKey) && currentKey !== key
      ? doc(db, "usernames", currentKey)
      : null;
    const previousOwner = previousReservation ? await transaction.get(previousReservation) : null;

    const username = key === currentKey ? profile.username : key;
    const values = { username, displayName, bio, publicUsername: key };
    const updated = { ...profile, ...values };
    publishProfile(transaction, claim, updated);
    transaction.update(reference, values);
    if (profile.publicUsername && profile.publicUsername !== key) {
      transaction.delete(doc(db, "publicProfilesByUsername", profile.publicUsername));
    }
    if (previousReservation && previousOwner?.data()?.uid === user.uid) transaction.delete(previousReservation);

    return updated;
  });
}
