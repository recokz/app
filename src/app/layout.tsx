import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { MantineProvider } from "./mantine-provider";
import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";
import { ruRU } from "@clerk/localizations";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { GoogleTagManager } from "@next/third-parties/google";

import "./globals.css";
import { QueryProvider } from "./query-provider";
import { Suspense } from "react";

const gtmId = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID;

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
        {gtmId && <GoogleTagManager gtmId={gtmId} />}
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
