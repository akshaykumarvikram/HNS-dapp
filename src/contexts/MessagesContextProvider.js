import React, {createContext, useContext, useEffect, useState} from 'react'
import { collection, query, orderBy, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "src/firebase-config";
import { useUserAuth } from "src/contexts/UserAuthContextProvider";

const UserMessagesContext = createContext();

export default function MessagesContextProvider({ children }) {
    const { user } = useUserAuth();
    const [userMessages, setUserMessages] = useState();
    const [unreadMsgCount, setUnreadMsgCount] = useState([0, 0, 0]);
    const mapping = {
        personalized : 0,
        onchain : 1,
        broadcast: 2
    }
    useEffect(() => {
        const getMessages = () => {
            const ref = collection(db, "users", user.uid, `inbox`);
            const unsub = onSnapshot(query(ref, orderBy("sentTime", "desc")), (snapshot) => {
              let messages = [];
              let copy = [...unreadMsgCount];
              snapshot.forEach((doc) => {
                let data = doc.data();
                data["id"] = doc.id;
                if (!data.readTime){
                    copy[mapping[data.messageType]] += 1;
                }
                messages.push(data);
              });
              setUserMessages(messages);
              setUnreadMsgCount(copy);
            });
          };
          if(user){
            getMessages();
          }
    }, [user])
  return (
        <UserMessagesContext.Provider value={{ userMessages, unreadMsgCount }}>
          {children}
        </UserMessagesContext.Provider>
  )
}

export function useUserMessages() {
    return useContext(UserMessagesContext);
  }