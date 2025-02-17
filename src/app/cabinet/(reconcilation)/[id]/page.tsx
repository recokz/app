import { Title } from "@mantine/core";
import { ReconcileForm } from "@/entities/reports/ui/reconcile-form";

export default async function ReconcilationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const reportId = (await params).id;

  return (
    <div>
      <Title order={3} mb={20}>
        Сверить транзакции
      </Title>
      <ReconcileForm id={reportId} />
    </div>
  );
}
