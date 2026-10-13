import type { Metadata } from "next";
import { Cormorant_Garamond, Nunito } from "next/font/google";
import { Providers } from "@/app/providers";
import "./globals.scss";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const body = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Rafa Store | Moda feminina",
  description: "Roupas femininas com delicadeza — biquínis, vestidos, saias e mais.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${body.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
