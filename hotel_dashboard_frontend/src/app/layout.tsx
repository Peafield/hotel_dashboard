import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const karla = localFont({
  src: "./fonts/Karla-VariableFont_wght.ttf",
  display: "swap",
  variable: "--font-karla",
});

const merriweather = localFont({
  src: "./fonts/Merriweather-VariableFont_opsz,wdth,wght.ttf",
  display: "swap",
  variable: "--font-merriweather",
});

export const metadata: Metadata = {
  title: "The Hugo Hotel Dashboard",
  description: "Dashboard for room management at The Hugo Hotel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${karla.variable} ${merriweather.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
