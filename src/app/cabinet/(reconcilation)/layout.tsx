import { AppShell, AppShellMain } from "@mantine/core";
import { ReactNode } from "react";
import { ReconcileNavbar } from "./navbar";

export default async function Layout({ children }: { children: ReactNode }) {
  return (
    <AppShell
      padding="lg"
      navbar={{
        width: 300,
        breakpoint: "sm",
      }}
    >
      <ReconcileNavbar />
      <AppShellMain>{children}</AppShellMain>
    </AppShell>
  );
}
