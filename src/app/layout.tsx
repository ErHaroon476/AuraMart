import "./globals.css";
import { ReactNode } from "react";
import LayoutWrapper from "./layout-wrapper";

export const metadata = {
  title: "AAMart",
  description: "Top Wholsale Cosmetics Store",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
