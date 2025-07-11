import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import ContextProvider from "@/context/index";

export const metadata: Metadata = {
  title: "AppKit Example App",
  description: "Powered by WalletConnect & Reown",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
 
  const headerList = await headers();

  const cookieString = headerList.get("cookie") ?? "";

  return (
    <html lang="en">
      <body>
        <ContextProvider cookies={cookieString}>{children}</ContextProvider>
      </body>
    </html>
  );
}
