"use client";

import React, { useEffect, useState } from "react";
import Provider from "@/components/Provider";
import NavBar from "@/components/NavBar";
import ModeToggle from "@/components/mode-toggle";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const RootLayout = ({ children }) => {
  const { data: session } = useSession();
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const router = isClient ? useRouter() : null;

  useEffect(() => {
    if (isClient && !session) {
      router.push("/home");
    }
  }, [session, router, isClient]);

  return (
    <Provider>
      <div className="font-primary flex flex-col min-h-screen justify-between items-center">
        <NavBar atLogin={!session} />
        {children}
        <div>footer placeholder</div>
      </div>
    </Provider>
  );
};

export default RootLayout;
