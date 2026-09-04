import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://maasworkshop.net"),
  title: "MAAS Workshop — Makarim Ahsan",
  description: "A teenager who likes vibecoding and doing AI stuff.",
  openGraph: {
    title: "MAAS Workshop — Makarim Ahsan",
    description: "A teenager who likes vibecoding and doing AI stuff.",
    type: "website",
    siteName: "MAAS Workshop",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "MAAS Workshop" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "MAAS Workshop — Makarim Ahsan",
    description: "A teenager who likes vibecoding and doing AI stuff.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans bg-bg text-text antialiased min-h-screen">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
