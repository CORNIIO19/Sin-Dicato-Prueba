import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteTitle = "Sin Dicato";
const siteDescription =
  "Mercado digital comunitario para la UAMera. Compra, vende y descubre negocios, productos y servicios de la comunidad. SIN intermediarios. SIN complicaciones. SIN DICATO.";

export const metadata: Metadata = {
  title: {
    default: siteTitle,
    template: `%s | ${siteTitle}`,
  },
  description: siteDescription,
  applicationName: siteTitle,
  keywords: [
    "Sin Dicato",
    "mercado digital",
    "UAM",
    "comunidad",
    "negocios",
    "productos",
    "servicios",
    "UAMera",
  ],
  icons: {
    icon: "/branding/icon-sin-dicato.png",
    shortcut: "/branding/icon-sin-dicato.png",
    apple: "/branding/icon-sin-dicato.png",
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: "https://sindicato.xibalbacore.cloud",
    siteName: siteTitle,
    images: [
      {
        url: "/branding/logo-sin-dicato.png",
        width: 1200,
        height: 630,
        alt: "Sin Dicato",
      },
    ],
    locale: "es_MX",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-zinc-900">
        {children}
      </body>
    </html>
  );
}
