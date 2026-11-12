"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { FirebaseError } from "firebase/app";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type Auth,
  type User,
} from "firebase/auth";

import { ensureUserProfile, updateUserProfile, type ProfileFields, type UserProfile } from "@/lib/user-profile";

type AuthState = {
  profile: UserProfile | null;
  profileError: string;
  loading: boolean;
  user: User | null;
  canLogin: boolean;
  busy: boolean;
  error: string;
  login: () => Promise<boolean>;
  logout: () => Promise<boolean>;
  saveProfile: (fields: ProfileFields) => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<{ auth: Auth; user: User | null } | null>(null);
  const [profileResult, setProfileResult] = useState<{ uid: string; profile: UserProfile | null; error: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let disposed = false;
    let authRevision = 0;
    let unsubscribe: (() => void) | undefined;

    void import("@/lib/firebase").then(({ auth, db }) => {
      if (disposed) return;
      unsubscribe = onAuthStateChanged(auth, (user) => {
        if (disposed) return;
        const revision = ++authRevision;
        setSession({ auth, user });
        setProfileResult(null);
        setLoading(false);
        if (!user) return;

        void ensureUserProfile(db, user).then((profile) => {
          if (disposed || revision !== authRevision) return;
          setProfileResult({ uid: user.uid, profile, error: "" });
        }).catch((failure) => {
          if (disposed || revision !== authRevision) return;
          const path = "users/" + user.uid;
          const denied = failure instanceof FirebaseError && failure.code === "permission-denied";
          setProfileResult({
            uid: user.uid,
            profile: null,
            error: denied
              ? path + " 프로필을 읽거나 생성할 권한이 없어요."
              : path + " 프로필을 불러오지 못했어요. 새로고침 후 다시 시도해 주세요.",
          });
        });
      });
    }).catch(() => {
      if (disposed) return;
      setError("로그인을 준비하지 못했어요. 새로고침 후 다시 시도해 주세요.");
      setLoading(false);
    });

    return () => {
      disposed = true;
      unsubscribe?.();
    };
  }, []);

  async function login() {
    if (!session || busy) return false;
    setBusy(true);
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      await signInWithPopup(session.auth, provider);
      return true;
    } catch (failure) {
      const code = failure instanceof FirebaseError ? failure.code : "";
      if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") return false;
      setError(code === "auth/popup-blocked"
        ? "브라우저에서 팝업을 허용한 뒤 다시 로그인해 주세요."
        : "Google 로그인에 실패했어요. 다시 시도해 주세요.");
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    if (!session || busy) return false;
    setBusy(true);
    setError("");
    try {
      await signOut(session.auth);
      return true;
    } catch {
      setError("로그아웃하지 못했어요. 다시 시도해 주세요.");
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function saveProfile(fields: ProfileFields) {
    const user = session?.user;
    if (!user) throw new Error("로그인 후 다시 시도해 주세요.");
    const { auth, db } = await import("@/lib/firebase");
    if (auth.currentUser?.uid !== user.uid) throw new Error("계정이 바뀌었어요. 다시 시도해 주세요.");

    try {
      const profile = await updateUserProfile(db, user, fields);
      setProfileResult((current) => current?.uid === user.uid ? { uid: user.uid, profile, error: "" } : current);
    } catch (failure) {
      if (failure instanceof FirebaseError) {
        throw new Error(failure.code === "permission-denied"
          ? "프로필을 저장할 권한이 없어요. Firestore 규칙을 확인해 주세요."
          : "프로필을 저장하지 못했어요. 다시 시도해 주세요.");
      }
      throw failure;
    }
  }

  const user = session?.user ?? null;
  const result = profileResult?.uid === user?.uid ? profileResult : null;

  return (
    <AuthContext.Provider value={{ loading, canLogin: session !== null, user, profile: result?.profile ?? null, profileError: result?.error ?? "", busy, error, login, logout, saveProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error("AuthProvider is missing");
  return auth;
}
