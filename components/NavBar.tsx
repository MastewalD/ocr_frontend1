"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  LayoutDashboard,
  FileText,
  LogOut,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItemProps = {
  href?: string;
  onClick?: () => void;
  tooltip: string;
  className?: string;
  children: React.ReactNode;
};

const NavItem = ({
  href,
  onClick,
  tooltip,
  className,
  children,
}: NavItemProps) => {
  const content = (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "h-12 w-12 rounded-full transition-all duration-200 hover:rounded-xl hover:scale-110 cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {children}
    </Button>
  );

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          {href ? <Link href={href}>{content}</Link> : content}
        </TooltipTrigger>
        <TooltipContent side="right" className="ml-2">
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const NavBar = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  const navLinks = [
    {
      href: "/",
      tooltip: "Home",
      icon: <Home size={22} />,
      color: "bg-cyan-400 text-white",
    },    
    {
      href: "/dashboard",
      tooltip: "Dashboard",
      icon: <LayoutDashboard size={22} />,
      color: "bg-orange-400 text-white",
    },
    {
      href: "/receipts",
      tooltip: "All Receipts",
      icon: <FileText size={22} />,
      color: "bg-amber-400 text-white",
    },
  ];

  return (
    <aside className="fixed left-4 top-1/2 -translate-y-1/2 z-50">
      <nav
        className="flex flex-col items-center gap-3 rounded-full bg-slate-900 backdrop-blur-[7px] p-2 shadow-2xl"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)",
          backgroundSize: "20px 20px",
        }}
      >
        <NavItem
          href="/dashboard"
          tooltip="Scan New Receipt"
          className="bg-slate-800 text-white hover:bg-indigo-500"
        >
          <Plus size={24} />
        </NavItem>

        <Separator className="bg-slate-700 w-8" />

        {navLinks.map((link, index) => (
          <NavItem
            key={index}
            href={link.href}
            tooltip={link.tooltip}
            className={link.color}
          >
            {link.icon}
          </NavItem>
        ))}

        <Separator className="bg-slate-700 w-8" />

        <NavItem
          onClick={logout}
          tooltip="Logout"
          className="bg-slate-700 text-red-400 hover:bg-red-500 hover:text-white"
        >
          <LogOut size={22} />
        </NavItem>
      </nav>
    </aside>
  );
};
