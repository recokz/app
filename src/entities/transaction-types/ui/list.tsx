"use client";

import { useQuery } from "@tanstack/react-query";
import { getTransactionTypes } from "@/entities/transaction-types/actions";
import { Flex, Skeleton, Table } from "@mantine/core";
import { TransactionCategory } from "@prisma/client";
import { DeleteTransactionTypeButton } from "@/entities/transaction-types/ui/delete";

export function TransactionTypeList() {
  const {
    data: incomeTransactionTypes,
    isLoading: isIncomeTransactionTypesLoading,
  } = useQuery({
    queryKey: ["transaction-types", TransactionCategory.income],
    queryFn: () => getTransactionTypes(TransactionCategory.income),
  });

  const {
    data: expenseTransactionTypes,
    isLoading: isExpenseTransactionTypesLoading,
  } = useQuery({
    queryKey: ["transaction-types", TransactionCategory.expense],
    queryFn: () => getTransactionTypes(TransactionCategory.expense),
  });

  console.log(incomeTransactionTypes);

  if (isExpenseTransactionTypesLoading || isIncomeTransactionTypesLoading) {
    return (
      <Flex direction="column" gap={8}>
        <Skeleton height={50} />
        <Skeleton height={50} />
        <Skeleton height={50} />
        <Skeleton height={50} />
      </Flex>
    );
  }

  return (
    <Flex gap={20} align="flex-start" justify="flex-start">
      <Table flex={1}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th w={20}>№</Table.Th>
            <Table.Th>Типы по доходам</Table.Th>
            <Table.Th w={50}>Действия</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {incomeTransactionTypes?.map((item, index) => (
            <Table.Tr key={item.id}>
              <Table.Td>{index + 1}</Table.Td>
              <Table.Td>{item.name}</Table.Td>
              <Table.Td>
                {item.organizationId ? (
                  <DeleteTransactionTypeButton id={item.id} />
                ) : null}
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
      <Table flex={1}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th w={20}>№</Table.Th>
            <Table.Th>Типы по расходам</Table.Th>
            <Table.Th w={50}>Действия</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {expenseTransactionTypes?.map((item, index) => (
            <Table.Tr key={item.id}>
              <Table.Td>{index + 1}</Table.Td>
              <Table.Td>{item.name}</Table.Td>
              <Table.Td>
                {item.organizationId ? (
                  <DeleteTransactionTypeButton id={item.id} />
                ) : null}
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Flex>
  );
}
