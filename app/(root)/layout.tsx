import { NavBar } from "@/components/NavBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="antialiased bg-[#FBF9F6]">
      <NavBar />
      {children}
    </main>
  );
}
