import { ReportsTable } from "@/entities/reports/ui/reports-table";
import { reportsTabCache } from "@/entities/reports/ui/reports-table/search-params";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ tab: string }>;
}) {
  await reportsTabCache.parse(searchParams);

  return (
    <div>
      <ReportsTable />
    </div>
  );
}
