import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { MantineProvider } from "./mantine-provider";
import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";
import { ruRU } from "@clerk/localizations";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import "./globals.css";
import { QueryProvider } from "./query-provider";
import { Suspense } from "react";

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
    <ClerkProvider localization={ruRU}>
      <html lang="ru" {...mantineHtmlProps}>
        <head>
          <Suspense>
            <ColorSchemeScript />
          </Suspense>
        </head>
        <body>
          <QueryProvider>
            <NuqsAdapter>
              <MantineProvider>{children}</MantineProvider>
            </NuqsAdapter>
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
