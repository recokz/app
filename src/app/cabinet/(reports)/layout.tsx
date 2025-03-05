import { CreateReportButton } from "@/entities/reports/ui/reports-table/create-report";
import { LogoutButton } from "@/features/log-out-button";
import { ThemeButton } from "@/features/theme-button";
import {
  AppShell,
  AppShellFooter,
  AppShellHeader,
  AppShellMain,
  AppShellNavbar,
  Flex,
  Stack,
  Title,
} from "@mantine/core";
import { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
  return (
    <AppShell
      padding="md"
      navbar={{
        width: 300,
        breakpoint: "sm",
      }}
      header={{
        height: 60,
      }}
    >
      <AppShellNavbar p="md">
        <Stack justify="space-between" h="100%">
          <div />
          <Flex gap={10} align="center" justify="space-between">
            <LogoutButton />
          </Flex>
        </Stack>
      </AppShellNavbar>
      <AppShellHeader p="sm">
        <Flex justify="space-between" align="center">
          <Title order={3} c="blue">
            Reconcile
          </Title>
          <ThemeButton />
        </Flex>
      </AppShellHeader>
      <AppShellMain>{children}</AppShellMain>
      <AppShellFooter
        p="md"
        pl="calc(var(--app-shell-navbar-offset, 0rem) + var(--app-shell-padding))"
      >
        <Flex justify="end">
          <CreateReportButton />
        </Flex>
      </AppShellFooter>
    </AppShell>
  );
}
