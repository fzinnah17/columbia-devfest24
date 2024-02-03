// Assuming "use client" is necessary at the top if you're specifically instructed to do so by Next.js documentation or error messages
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProfileDropdown from "./profile-dropdown";
import ModeToggle from "./mode-toggle";
import { HomeIcon, UsersIcon, SearchIcon, UserIcon } from "lucide-react";

const NavBar = ({ atLogin, profilePicUrl }) => {
  const [activeNavLink, setActiveNavLink] = useState("");
  const router = useRouter(); // This will not cause an error as it's used inside a component
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.pageYOffset > 0);
    };

    // Attach scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener on component unmount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Assuming you want to perform some actions based on the route, do it here
  }, [router.pathname]);

  if (atLogin) {
    return (
      <div className="flex w-full items-center justify-end py-8 px-5 h-16 sticky top-0 z-50 transition-all duration-300 bg-inherit">
        <ModeToggle />
      </div>
    );
  }

  return (
    <div className={`flex justify-between w-full items-center py-8 px-5 h-16 sticky top-0 z-50 transition-all duration-300 bg-inherit ${scrolled ? "shadow-md border-b border-gray-200 dark:border-gray-600" : ""}`}>
      <div className="flex gap-2">
        {/* Placeholder for slider or any other content */}
        <HomeIcon className="w-6 h-6" />
        <UsersIcon className="w-6 h-6" />
      </div>
      <div className="flex gap-2 items-center">
        <SearchIcon className="w-6 h-6" />
        <ProfileDropdown profilePicUrl={profilePicUrl} />
        <ModeToggle />
      </div>
    </div>
  );
};

export default NavBar;
