"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, ScanLine } from "lucide-react";
import React from "react";
import { Badge } from "./ui/badge";

const Illustration = () => (
  <div className="relative w-full max-w-lg mx-auto h-80">
    <div className="absolute top-10 left-10 w-16 h-16 bg-amber-200 rounded-full opacity-70 animate-float-slow" />
    <div className="absolute bottom-10 right-10 w-20 h-20 bg-teal-200 rounded-xl opacity-70 animate-float-medium" />
    <div className="absolute top-20 right-20 w-8 h-8 bg-rose-200 rounded-full opacity-70 animate-float-fast" />

    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative w-52 h-72 bg-white rounded-2xl shadow-2xl p-4 flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-slate-700">GROCERIES</span>
          <div className="w-6 h-6 bg-emerald-400 rounded-full" />
        </div>
        <div className="w-full h-px bg-slate-200" />
        <div className="w-3/4 h-3 bg-slate-200 rounded-full" />
        <div className="w-1/2 h-3 bg-slate-200 rounded-full" />
        <div className="w-full h-px bg-slate-200" />
        <div className="w-2/3 h-3 bg-slate-200 rounded-full" />
        <div className="w-1/2 h-3 bg-slate-200 rounded-full" />
        <div className="absolute bottom-4 right-4 w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center">
          <ScanLine className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  </div>
);

export function LandingPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const handleGetStarted = () => {
    router.push(user ? "/dashboard" : "/login");
  };

  return (
    <section className="flex flex-col items-center justify-center max-h-screen text-center px-4 py-20 w-full text-slate-800 overflow-hidden">
      <Illustration />

      <Badge
        variant="outline"
        className="bg-[#F6EFE6] border-[#EADFCC] text-[#6B4F2E] text-sm py-1 px-4 rounded-full font-medium mt-6"
      >
        Receipt Scanner
      </Badge>

      <h1 className="text-4xl md:text-5xl font-bold mt-8">
        Snap, Scan, <span className="text-yellow-800">Sorted.</span>
      </h1>
      <p className="mt-4 max-w-xl text-base text-slate-600">
        Effortlessly digitize your receipts. No more lost papers, just clear,
        organized expenses at your fingertips.
      </p>
      <div className="mt-10">
        {isLoading ? (
          <Button size="lg" disabled>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Please wait
          </Button>
        ) : (
          <Button
            size="lg"
            className="bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
            onClick={handleGetStarted}
          >
            {user ? "Go to Your Dashboard" : "Get Started for Free"}
          </Button>
        )}
      </div>
    </section>
  );
}
