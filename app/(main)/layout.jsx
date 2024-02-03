"use client";
import React from 'react';
import Provider from "@/components/Provider";
import NavBar from "@/components/NavBar";
import QueryProvider from "@/components/QueryProvider";
import Footer from "@/components/Footer";

const RootLayout = ({ children }) => {
  return (
    <Provider>
      <QueryProvider>
        <div className="font-primary flex flex-col min-h-screen justify-between">
          <NavBar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </QueryProvider>
    </Provider>
  );
};

export default RootLayout;
