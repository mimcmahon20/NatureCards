"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { UsersRound, Compass, Image, Home, MessageCircleHeart } from "lucide-react";

interface NavElementProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const NavElement = ({ href, icon, label }: NavElementProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col items-center justify-center p-2 text-muted-foreground transition-colors",
        isActive && " text-green-600 font-bold"
      )}
    >
      <div className="w-[50px] h-[50px] flex items-center justify-center">
        {icon}
      </div>
      <span className="text-xs mt-1">{label}</span>
    </Link>
  );
};

export function Navigation() {
  return (
    <nav className="flex fixed bottom-0 w-full items-center justify-around bg-background border-t border-border py-2">
      <NavElement href="/social" icon={<MessageCircleHeart size={28} />} label="Social" />
      <NavElement href="/feed" icon={<Home size={28} />} label="Feed" />
      <NavElement href="/" icon={<Compass size={28} />} label="Adventure" />
      <NavElement href="/gallery" icon={<Image size={28} />} label="Gallery" />
      <NavElement href="/user" icon={<UsersRound size={28} />} label="User" />
    </nav>
  );
} 