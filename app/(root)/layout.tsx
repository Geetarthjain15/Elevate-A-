import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/actions/auth.action";
import NavbarProfile from "@/components/NavbarProfile";

const Layout = async ({ children }: { children: ReactNode }) => {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  return (
    <div className="root-layout">
      <nav className="flex items-center justify-between w-full">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="ElevateAI Logo" width={38} height={32} className="rounded-lg" />
          <h2 className="text-primary-100 font-bold tracking-wide">ElevateAI</h2>
        </Link>
        <NavbarProfile userName={user.name} />
      </nav>

      {children}
    </div>
  );
};

export default Layout;
