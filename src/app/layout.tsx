import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "İşler LearnTwin AI",
  description: "Her öğrencinin öğrenme biçimi görünür olsun.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
