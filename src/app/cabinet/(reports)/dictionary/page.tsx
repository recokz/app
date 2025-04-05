import { TransactionTypeList } from "@/entities/transaction-types/ui/list";
import { Flex } from "@mantine/core";
import { TransactionTypeCreate } from "@/entities/transaction-types/ui/create";

export default function CabinetDictionaryPage() {
  return (
    <Flex gap={20} direction="column">
      <Flex justify="flex-end">
        <TransactionTypeCreate />
      </Flex>
      <TransactionTypeList />
    </Flex>
  );
}
