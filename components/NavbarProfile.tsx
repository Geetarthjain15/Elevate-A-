"use client";

import { useRouter } from "next/navigation";
import { signOut } from "@/lib/actions/auth.action";
import { LogOut } from "lucide-react";

export default function NavbarProfile({ userName }: { userName: string }) {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };

  return (
    <button
      onClick={handleSignOut}
      className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-dark-200 border border-light-800/30 px-3 py-1.5 hover:bg-dark-300 hover:border-red-500/50 transition-all duration-300"
    >
      <div className="flex items-center gap-2 transition-transform duration-300 group-hover:-translate-y-10">
        <div className="w-7 h-7 rounded-full bg-primary-200 text-dark-100 flex items-center justify-center text-sm font-bold">
          {userName?.charAt(0).toUpperCase() || "U"}
        </div>
        <span className="text-sm font-medium text-light-100 pr-2">{userName}</span>
      </div>
      
      <div className="absolute inset-0 flex items-center justify-center gap-2 text-red-400 translate-y-10 transition-transform duration-300 group-hover:translate-y-0">
        <LogOut size={16} />
        <span className="text-sm font-medium">Sign Out</span>
      </div>
    </button>
  );
}
