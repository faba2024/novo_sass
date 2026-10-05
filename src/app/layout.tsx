import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import type { ReactNode } from "react";
import { Providers } from "@/components/providers";
import { env } from "@/lib/env";
import "./globals.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display-face", display: "swap", weight: ["500", "600", "700", "800"] });
const ui = Instrument_Sans({ subsets: ["latin"], variable: "--font-ui", display: "swap", weight: ["400", "500", "600", "700"] });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono-face", display: "swap", weight: ["400", "500", "700"] });

// O app depende de sessão/Supabase em várias rotas. Força renderização em runtime
// para impedir que o build da Vercel tente pré-renderizar páginas privadas.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(env.appUrl),
  title: { default: "TOP BURGER OS — o sistema da sua hamburgueria", template: "%s · TOP BURGER OS" },
  description: "Pedidos online, cozinha, delivery, caixa, estoque com ficha técnica, financeiro e fidelidade em um só sistema feito para hamburguerias.",
  applicationName: "TOP BURGER OS",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#faf7f2",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${ui.variable} ${mono.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
