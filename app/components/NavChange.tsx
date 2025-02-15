"use client";

import { usePathname } from "next/navigation";
import Nav from "./Nav";
import NavPostLogin from "./NavPostLogin";

export default function NavChange() {
  const pathname = usePathname();

  return pathname === "/" ? <Nav /> : <NavPostLogin />;
}
