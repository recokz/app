"use client";

import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { IconSun, IconMoon } from "@tabler/icons-react";

export function ThemeButton() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  return (
    <ActionIcon
      variant="outline"
      size="lg"
      aria-label="Toggle theme"
      onClick={toggleColorScheme}
    >
      {colorScheme === "dark" ? <IconSun size={18} /> : <IconMoon size={18} />}
    </ActionIcon>
  );
}
