/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import * as React from "react";
import { client } from "../../api/client";

export const AuthContext = React.createContext<any>(null);

export const AuthProvider = (props: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    client.auth
      .getSession()
      .then(({ data: { session } }: { data: { session: any } }) => {
        setUser(session?.user ?? null);
        setLoading(false);
      });

    const { data: listener } = client.auth.onAuthStateChange(
      (e: any, session: any) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {props.children}
    </AuthContext.Provider>
  );
};
