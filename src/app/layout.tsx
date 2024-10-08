import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ViewTransitions } from "next-view-transitions";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TWB - Test",
  description: "TWB - DEVELOPMENT BUILD",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="en">
        <body className={inter.className}>
          <Toaster position="top-center" richColors />
          {children}
        </body>
      </html>
    </ViewTransitions>
  );
}
