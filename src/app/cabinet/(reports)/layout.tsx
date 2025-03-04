import { CreateReportButton } from "@/features/create-report";
import LogoutButton from "@/features/log-out-button";
import {
  AppShell,
  AppShellFooter,
  AppShellMain,
  AppShellNavbar,
  Box,
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
    >
      <AppShellNavbar p="md">
        <Stack justify="space-between" h="100%">
          <Stack gap={40}>
            <Title order={3} c="blue">
              Reconcile
            </Title>
          </Stack>
          <Box>
            <LogoutButton />
          </Box>
        </Stack>
      </AppShellNavbar>
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
