"use client";

import { Flex, NavLink } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function CabinetNavBar() {
  const pathname = usePathname();

  return (
    <Flex direction="column">
      <NavLink
        component={Link}
        href="/cabinet"
        label="Отчеты"
        active={pathname === "/cabinet"}
        rightSection={
          <IconChevronRight
            size={12}
            stroke={1.5}
            className="mantine-rotate-rtl"
          />
        }
      />
      <NavLink
        component={Link}
        href="/cabinet/dictionary"
        label="Справочник"
        active={pathname === "/cabinet/dictionary"}
        rightSection={
          <IconChevronRight
            size={12}
            stroke={1.5}
            className="mantine-rotate-rtl"
          />
        }
      />
    </Flex>
  );
}
