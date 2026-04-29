import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flavor Arena MVP",
  description: "Gestion de competencias, catas y degustaciones comparativas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
