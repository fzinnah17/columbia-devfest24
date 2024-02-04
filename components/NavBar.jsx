"use client";
import Link from "next/link";
import { ThemeProvider } from "@/components/theme-provider";
import ModeToggle from "./mode-toggle";
import { useState, useEffect } from "react";
import { useWindowScroll } from "react-use";
import { useRouter, usePathname } from "next/navigation";
import ProfileDropdown from "./profile-dropdown";
import { HomeIcon, Users, User } from "lucide-react";
import Image from "next/image";
import Slider from "./SliderDemo";
import SearchButton from './SearchButton'
import Menu from './navbar-menu'


export default function NavBar({atLogin, profilePicUrl}) {
  const [activeNavLink, setActiveNavLink] = useState("");
  const pathname = usePathname();   // to determine which icon should be highlighted
  const { y: pageYOffset } = useWindowScroll();   // to determine if navbar is sticky
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(pageYOffset > 0);
    onScroll(); // Call on mount for initial check
  }, [pageYOffset]); // Only re-run the effect if pageYOffset changes

  if (atLogin) 
    return (

      <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
      >
          <div className="flex w-full items-center justify-end py-8 px-5 h-3 sticky top-0 z-50 transition-all duration-300 bg-inherit">
            <ModeToggle />

          </div>
        </ThemeProvider>
    );

  return (
    <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
      >
          <div className={`self-end flex justify-between w-full items-center mb-16 py-8 px-5 h-3 sticky top-0 z-50 transition-all duration-300 bg-inherit ${
        scrolled
          ? "shadow-md border-b border-gray-200 dark:border-gray-600"
          : null}`}>
            <div className="flex gap-3 lg:gap-8 items-center">
              {/* implement highlight if have time */}
              <Image alt="logo" className="hidden lg:block" width={35} height={35} src={'/logo.png'} style={{objectFit: "contain"}}  />
              <div className="ml-2 flex gap-3 sm:gap-4 lg:gap-8 items-center min-w-[300px] w-[60vw] lg:w-[35rem] md:w-[30rem]">
                <Link href='/all' className='cursor-pointer'><HomeIcon /></Link>
                {/* change to dropdown menu */}
                <Link href='/home' className='cursor-pointer'><Users /></Link>
                <Slider />
              </div>
            </div>
            <div className="hidden md:flex gap-2 md:gap-4 lg:gap-8 items-center">
              <SearchButton />
              <ProfileDropdown profilePicUrl={profilePicUrl} />
              <div><ModeToggle /></div>
            </div>
            <div className="md:hidden">
              <Menu />
            </div>
          </div>


        </ThemeProvider>
  );
}
