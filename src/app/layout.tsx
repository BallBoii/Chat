import type { Metadata } from "next";
import "./globals.css";
import { SocketProvider } from "@/context/SocketContext";

export const metadata: Metadata = {
  title: "Chat App - Real-time Messaging",
  description: "A real-time chat application built with Next.js, React, and Socket.IO",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SocketProvider>
          {children}
        </SocketProvider>
      </body>
    </html>
  );
}
