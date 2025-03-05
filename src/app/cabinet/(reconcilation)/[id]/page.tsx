import { Title } from "@mantine/core";
import { ReportForm } from "@/entities/reports/ui/report-form";
import { Suspense } from "react";

export default async function ReconcilationPage() {
  return (
    <div>
      <Title order={3} mb={20}>
        Сверить транзакции
      </Title>
      <Suspense>
        <ReportForm />
      </Suspense>
    </div>
  );
}
