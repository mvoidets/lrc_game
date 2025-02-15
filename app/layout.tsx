"use client";
import { ReactNode, useEffect, useState } from "react";
import Nav from "./components/Nav";
import NavPostLogin from "./components/NavPostLogin";
import { robotoMono } from "./fonts";
import "./globals.css";
import { usePathname } from "next/navigation";

type LayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: LayoutProps) {
  const pathname = usePathname();
  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    setShowNav(
      pathname === "/" || pathname === "/login" || pathname === "/signup"
    );
  }, [pathname]);

  return (
    <html lang="en">
      <body
        className={`${robotoMono.className} relative min-h-screen bg-cover bg-center bg-no-repeat`}
        style={{
          backgroundImage: "url('/images/fade_lrc.jpg')",
          // backgroundAttachment: "fixed",
        }}
      >
        {showNav ? <Nav /> : <NavPostLogin />}
        {children}
      </body>
    </html>
  );
}
