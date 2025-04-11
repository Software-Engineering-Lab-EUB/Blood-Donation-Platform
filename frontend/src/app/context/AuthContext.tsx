"use client";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  UserCredential,
} from "firebase/auth";
import Cookies from "js-cookie";
import { GoogleAuthProvider } from "firebase/auth";
import { createContext, ReactNode, useEffect, useState } from "react";

import { getUSerId } from "@/service/userService";
import auth from "../firebase/firebase.config";

// Type for the context
interface AuthContextType {
  GoogleSignIn: () => Promise<UserCredential>;
  logOut: () => Promise<void>;
  user: any;
  loading: boolean;
}

// Context
export const AuthContext = createContext<AuthContextType | null>(null);

// AuthProvider main function
const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Handle states
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const provider = new GoogleAuthProvider();

  // Google SignIn
  const GoogleSignIn = async () => {
    return await signInWithPopup(auth, provider);
  };

  // Sign-Out
  const logOut = async () => {
    return await signOut(auth);
  };

  // onAuth state change handler
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, async (currentUser:any) => {
      setUser(currentUser as any);
      setLoading(false);

      if (currentUser) {
        const email: string = currentUser.email || "";
        Cookies.set("userEmail", email, { expires: 14 });

        try {
          const idResponse = await getUSerId(email);
          const selfId = idResponse?._id;
          if (selfId) {
            Cookies.set("selfId", selfId, { expires: 14 });
          }
        } catch (error) {
          console.error("Error fetching user ID:", error);
        }
      } else {
        Cookies.remove("userEmail");
        Cookies.remove("selfId");
      }
    });

    return () => unSubscribe(); // Cleanup function
  }, []);

  // Auth info
  const authInfo: AuthContextType = {
    GoogleSignIn,
    logOut,
    user,
    loading,
  };

  // Return context provider
  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
