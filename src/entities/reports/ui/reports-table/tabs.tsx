"use client";

import { parseAsStringLiteral, useQueryState } from "nuqs";
import { Button, Group } from "@mantine/core";

export function ReportsTableTabs() {
  const [tab, setTab] = useQueryState(
    "tab",
    parseAsStringLiteral(["all", "in_progress", "done"]).withDefault("all")
  );

  const btnStyles = (isActive: boolean) => {
    return {
      bg: isActive ? "dark.7" : "gray.3",
      c: isActive ? "white" : "dark",
    };
  };

  return (
    <Group>
      <Button
        onClick={() => setTab("all", { shallow: false })}
        {...btnStyles(tab === "all")}
      >
        Все
      </Button>
      <Button
        onClick={() => setTab("in_progress", { shallow: false })}
        {...btnStyles(tab === "in_progress")}
      >
        В работе
      </Button>
      <Button
        onClick={() => setTab("done", { shallow: false })}
        {...btnStyles(tab === "done")}
      >
        Завершенные
      </Button>
    </Group>
  );
}
