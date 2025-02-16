import { MantineProvider as MantineProviderCore } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { DatesProvider } from "@mantine/dates";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

import "dayjs/locale/ru";

import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/core/styles.css";

dayjs.extend(customParseFormat);

export function MantineProvider({ children }: { children: React.ReactNode }) {
  return (
    <DatesProvider settings={{ locale: "ru" }}>
      <MantineProviderCore>
        {children}
        <Notifications position={"top-right"} />
      </MantineProviderCore>
    </DatesProvider>
  );
}
