import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import ReduxProvider from "@/store/providers/ReduxProvider";
import { SocketProvider } from "@/contexts/SocketContext";

export const metadata: Metadata = {
  title: 'Spark',
  description: 'Find your spark!',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <ReduxProvider>
          <SocketProvider>
            {children}
          </SocketProvider>
        </ReduxProvider>

        <Toaster position="top-right" toastOptions={{
          duration: 3000,
          style: {
            background: '#111',
            color: '#fff'
          }
        }} />
      </body>
    </html>
  );
}
