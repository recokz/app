"use client";

import styles from "./styles.module.css";
import {
  Accordion,
  AccordionControl,
  AccordionItem,
  AccordionPanel,
  Checkbox,
  Skeleton,
} from "@mantine/core";
import { Suspense, useEffect, useState } from "react";
import { ReportStatus } from "@prisma/client";
import { ImportInfoStepForm } from "@/entities/reports/ui/report-form/steps/import-info";
import { getReport } from "@/entities/reports/actions/report";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { ImportBankStepForm } from "@/entities/reports/ui/report-form/steps/import-bank";
import { ImportCrmStepForm } from "@/entities/reports/ui/report-form/steps/import-crm";
import { SalesForm } from "@/entities/reports/ui/report-form/steps/sales";
import { ExpensesForm } from "./steps/expenses";
import { ResultTable } from "./steps/result";

export function ReportForm() {
  const params = useParams<{ id: string }>();
  const [currentStatus, setCurrentStatus] = useState<ReportStatus | null>(null);

  const { data: report } = useQuery({
    queryKey: ["report", params.id],
    queryFn: () => getReport(params.id),
  });

  useEffect(() => {
    if (report) {
      setCurrentStatus(report.status);
    }
  }, [report]);

  let timelineStep = 0;

  switch (report?.status) {
    case ReportStatus.import_info:
      timelineStep = 0;
      break;
    case ReportStatus.import_bank:
      timelineStep = 1;
      break;
    case ReportStatus.import_crm:
      timelineStep = 2;
      break;
    case ReportStatus.sales:
      timelineStep = 3;
      break;
    case ReportStatus.expenses:
      timelineStep = 4;
      break;
    case ReportStatus.done:
      timelineStep = 5;
      break;
  }

  return (
    <Accordion
      defaultValue={currentStatus}
      value={currentStatus}
      onChange={(value) => setCurrentStatus(value as ReportStatus)}
      classNames={{
        root: styles.root,
        item: styles.item,
        chevron: styles.chevron,
        label: styles.label,
      }}
    >
      <AccordionItem key="import_info" value={ReportStatus.import_info}>
        <AccordionControl
          icon={<AccordionCheckbox active={timelineStep > 0} />}
          disabled={timelineStep < 0}
        >
          Информация о сверке
        </AccordionControl>
        <AccordionPanel>
          <Suspense fallback={<Skeleton w="100%" h="300" />}>
            <ImportInfoStepForm />
          </Suspense>
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem key="import_bank" value={ReportStatus.import_bank}>
        <AccordionControl
          icon={<AccordionCheckbox active={timelineStep > 1} />}
          disabled={timelineStep < 1}
        >
          Банковские данные
        </AccordionControl>
        <AccordionPanel>
          <Suspense fallback={<Skeleton w="100%" h="300" />}>
            <ImportBankStepForm />
          </Suspense>
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem key="import_crm" value={ReportStatus.import_crm}>
        <AccordionControl
          icon={<AccordionCheckbox active={timelineStep > 2} />}
          disabled={timelineStep < 2}
        >
          Отчет о продажах из CRM
        </AccordionControl>
        <AccordionPanel>
          <Suspense fallback={<Skeleton w="100%" h="300" />}>
            <ImportCrmStepForm />
          </Suspense>
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem key="sales" value={ReportStatus.sales}>
        <AccordionControl
          icon={<AccordionCheckbox active={timelineStep > 3} />}
          disabled={timelineStep < 3}
        >
          Продажи
        </AccordionControl>
        <AccordionPanel>
          <Suspense fallback={<Skeleton w="100%" h="300" />}>
            <SalesForm />
          </Suspense>
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem key="costs" value={ReportStatus.expenses}>
        <AccordionControl
          icon={<AccordionCheckbox active={timelineStep > 4} />}
          disabled={timelineStep < 4}
        >
          Расходы
        </AccordionControl>
        <AccordionPanel>
          <ExpensesForm />
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem key="result" value={ReportStatus.done}>
        <AccordionControl
          icon={<AccordionCheckbox active={timelineStep > 4} />}
          disabled={timelineStep < 4}
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
    <Checkbox size="xs" variant="filled" color="green" checked />
  ) : (
    <Checkbox size="xs" variant="outline" indeterminate onChange={() => {}} />
  );
}
