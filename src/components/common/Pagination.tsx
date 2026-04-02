import { Button, Flex, Text } from '@chakra-ui/react';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export default function Pagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  isLoading = false,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  const goToPage = (page: number) => {
    const normalized = Math.min(Math.max(page, 1), totalPages);
    if (normalized !== currentPage) {
      onPageChange(normalized);
    }
  };

  return (
    <Flex mt={6} justify="space-between" align="center" wrap="wrap" gap={4}>
      <Text color="gray.600" fontSize="sm">
        Showing {startItem}–{endItem} of {totalItems} users
      </Text>

      <Flex align="center" gap={3} wrap="wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(1)}
          disabled={isFirstPage || isLoading}
        >
          {'<<'}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(currentPage - 1)}
          disabled={isFirstPage || isLoading}
        >
          Prev
        </Button>

        <Text color="gray.600" fontSize="sm" px={2} minW="90px" textAlign="center">
          Page {currentPage} of {totalPages}
        </Text>

        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(currentPage + 1)}
          disabled={isLastPage || isLoading}
        >
          Next
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(totalPages)}
          disabled={isLastPage || isLoading}
        >
          {'>>'}
        </Button>
      </Flex>
    </Flex>
  );
}