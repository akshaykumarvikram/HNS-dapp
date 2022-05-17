import { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithCustomToken,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import { auth } from "../firebase-config";

const UserAuthContext = createContext();

export default function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState("");
  const login = (token) => {
    return signInWithCustomToken(auth, token);
  };
  const logout = () => {
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      console.log(user);
    });
    return () => {
      unsubscribe();
    };
  }, []);
  
  return (
    <UserAuthContext.Provider value={{ user, login, logout }}>
      {children}
    </UserAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(UserAuthContext);
}
