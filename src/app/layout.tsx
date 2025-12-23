import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";


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
        {children}

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
