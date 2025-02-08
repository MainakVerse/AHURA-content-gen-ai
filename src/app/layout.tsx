import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { twMerge } from "tailwind-merge";
import "@/styles/globals.css";
import { MouseProvider } from "../../context/MouseContext";
import NeonCursor from "@/components/NeonCursor";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ahura | AI Content Creator",
  description: "World's Best AI Content Creation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={twMerge(inter.className, "bg-black text-white antialiased")}
        suppressHydrationWarning
      >
        <MouseProvider>
          <NeonCursor />
          {children}
        </MouseProvider>
      </body>
    </html>
  );
}
