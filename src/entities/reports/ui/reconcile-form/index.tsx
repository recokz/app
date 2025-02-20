import { prisma } from "@/shared/prisma/prisma";
import styles from "./styles.module.css";
import {
  Accordion,
  AccordionControl,
  AccordionItem,
  AccordionPanel,
  Checkbox,
  Skeleton,
} from "@mantine/core";
import { Suspense } from "react";
import { ReportStatus } from "@prisma/client";
import { ImportForm } from "./steps/import";
import { SalesForm } from "./steps/sales";
import { ExpensesForm } from "./steps/expenses";
import { ResultTable } from "./steps/result";

type Props = {
  id: string;
};

export async function ReconcileForm({ id }: Props) {
  const report = await prisma.report.findUnique({
    where: {
      id,
    },
  });

  let timelineStep = 0;

  switch (report?.status) {
    case ReportStatus.IMPORT:
      timelineStep = 0;
      break;
    case ReportStatus.SALES:
      timelineStep = 1;
      break;
    case ReportStatus.EXPENSES:
      timelineStep = 2;
      break;
    case ReportStatus.DONE:
      timelineStep = 3;
      break;
  }
  return (
    <Accordion
      defaultValue={report?.status || ReportStatus.IMPORT}
      variant={report?.status || ReportStatus.IMPORT}
      classNames={{
        root: styles.root,
        item: styles.item,
        chevron: styles.chevron,
        label: styles.label,
      }}
    >
      <AccordionItem key="import" value={ReportStatus.IMPORT}>
        <AccordionControl
          icon={<AccordionCheckbox active={timelineStep > 0} />}
        >
          Импорт документов и отчета
        </AccordionControl>
        <AccordionPanel>
          <Suspense fallback={<Skeleton w="100%" h="300" />}>
            <ImportForm />
          </Suspense>
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem key="sales" value={ReportStatus.SALES}>
        <AccordionControl
          icon={<AccordionCheckbox active={timelineStep > 1} />}
        >
          Продажи
        </AccordionControl>
        <AccordionPanel>
          <SalesForm />
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem key="costs" value={ReportStatus.EXPENSES}>
        <AccordionControl
          icon={<AccordionCheckbox active={timelineStep > 2} />}
        >
          Расходы
        </AccordionControl>
        <AccordionPanel>
          <ExpensesForm />
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem key="result" value={ReportStatus.DONE}>
        <AccordionControl
          icon={<AccordionCheckbox active={timelineStep > 2} />}
        >
          Итог
        </AccordionControl>
        <AccordionPanel>
          <ResultTable />
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}

function AccordionCheckbox({ active }: { active: boolean }) {
  return active ? (
    <Checkbox size="xs" variant="filled" color="green" defaultChecked />
  ) : (
    <Checkbox size="xs" variant="outline" indeterminate />
  );
}
