"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const PUBLIC_ROUTES = ["/", "/login", "/register"];
const AUTH_ONLY_ROUTES = ["/cart"];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const isLoggedIn = !!token;
    const isAuthOnlyRoute = AUTH_ONLY_ROUTES.some((route) =>
      pathname.startsWith(route)
    );

    if (!isLoggedIn && isAuthOnlyRoute) {
      router.replace("/login");
      return;
    }

    if (isLoggedIn && (pathname === "/login" || pathname === "/register")) {
      router.replace("/");
      return;
    }
  }, [pathname, router]);

  return <>{children}</>;
}
