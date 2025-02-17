import { AppShell, AppShellMain, AppShellNavbar } from "@mantine/core";
import { ReactNode, Suspense } from "react";
import { ReconcileNavbar } from "./navbar";

export default async function Layout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ id: string }>;
}) {
  const reportId = (await params).id;

  return (
    <AppShell
      padding="lg"
      navbar={{
        width: 300,
        breakpoint: "sm",
      }}
    >
      <Suspense fallback={<AppShellNavbar p="md" />}>
        <ReconcileNavbar id={reportId} />
      </Suspense>
      <AppShellMain>{children}</AppShellMain>
    </AppShell>
  );
}
