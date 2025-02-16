import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { MantineProvider } from "./mantine-provider";
import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";

import "./globals.css";

export const metadata: Metadata = {
  title: "Reco.kz",
  description: "Reconciliation app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="ru" {...mantineHtmlProps}>
        <head>
          <ColorSchemeScript />
        </head>
        <body>
          <MantineProvider>{children}</MantineProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
