import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Inter, Cormorant_Garamond, Montserrat } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
});

const mullerNextWide = localFont({
  variable: "--font-muller-wide",
  src: [
    {
      path: "./fonts/MullerNextWideTrial-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/MullerNextWideTrial-ExtraBold.otf",
      weight: "750",
      style: "normal",
    },
  ],
});

const kosko = localFont({
  variable: "--font-kosko",
  src: "./fonts/Kosko-Regular.ttf",
  weight: "400",
  style: "normal",
});

export const metadata: Metadata = {
  title: {
    default: "Stan — Ювелірні вироби",
    template: "%s | Stan",
  },
  description:
    "Сучасні мінімалістичні прикраси. Намиста, браслети та добірні колекції, створені з турботою.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body
        className={`${inter.variable} ${montserrat.variable} ${cormorant.variable} ${mullerNextWide.variable} ${kosko.variable} antialiased`}
      >
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
