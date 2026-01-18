'use client'

import { useContext, createContext, useState, useEffect } from "react";
import { getCurrUser, updateUserPassword, updateUserEmail, updateUserName } from "../../../../../api/user";

export interface UserPropsReturn {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface UserContextProps {
  currUser: UserPropsReturn | undefined;
  updatePassword: (password: string) => Promise<boolean>;
  updateEmail: (email: string) => Promise<boolean>;
  updateName: (name: string) => Promise<boolean>;
  getUser: () => Promise<UserPropsReturn | undefined>;
}

const UserContext = createContext({} as UserContextProps);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [currUser, setCurrUser] = useState<UserPropsReturn | undefined>();

  async function getUser() {
    try {
      const user = await getCurrUser();
      if (user) {
        setCurrUser(user);
      }
      return user;
    } catch {
      return undefined;
    }
  }

  async function updatePassword(password: string) {
    try {
      const response = await updateUserPassword(password);
      setCurrUser(response);
      return true;
    } catch {
      return false;
    }
  }

  async function updateEmail(email: string) {
    try {
      const response = await updateUserEmail(email);
      setCurrUser(response);
      return true;
    } catch {
      return false;
    }
  }

  async function updateName(name: string) {
    try {
      const response = await updateUserName(name);
      setCurrUser(response);
      return true;
    } catch {
      return false;
    }
  }

  return (
    <UserContext.Provider
      value={{
        currUser,
        updatePassword,
        updateEmail,
        updateName,
        getUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
