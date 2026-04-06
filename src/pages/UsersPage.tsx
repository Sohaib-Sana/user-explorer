import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Spinner,
  Stack,
  Table,
  Text,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchUsers, searchUsers } from '../features/users/usersThunks';
import { setSelectedUser } from '../features/users/usersSlice';
import Pagination from '../components/common/Pagination';
import UserCard from '../components/users/UserCard';
import UserFormDialog from '../components/users/UserFormDialog';
import SearchField from '../components/common/SearchField';
import type { ViewMode } from '../components/common/AppShell';

export default function UsersPage() {
  const { viewMode } = useOutletContext<{ viewMode: ViewMode }>();

  const dispatch = useAppDispatch();
  const { items, total, limit, skip, query, fetchStatus, error } = useAppSelector(
    (state) => state.users
  );

  const isMobile = useBreakpointValue({ base: true, md: false });
  const { open, onOpen, onClose } = useDisclosure();
  const isLoading = fetchStatus === 'loading';

  useEffect(() => {
    dispatch(fetchUsers({ limit: 12, skip: 0 }));
  }, [dispatch]);

  const currentPage = Math.floor(skip / limit) + 1;

  const handlePageChange = (page: number) => {
    const newSkip = (page - 1) * limit;

    if (query.trim()) {
      dispatch(searchUsers({ query, limit, skip: newSkip }));
    } else {
      dispatch(fetchUsers({ limit, skip: newSkip }));
    }
  };

  const handleSearch = (searchQuery: string) => {
    dispatch(searchUsers({ query: searchQuery, limit: 12, skip: 0 }));
  };

  const handleClear = () => {
    dispatch(fetchUsers({ limit: 12, skip: 0 }));
  };

  const handleAdd = () => {
    dispatch(setSelectedUser(null));
    onOpen();
  };

  const handleDrawerClose = () => {
    dispatch(setSelectedUser(null));
    onClose();
  };

  const showInitialLoader = isLoading && items.length === 0;
  const showEmptyState = !isLoading && fetchStatus === 'succeeded' && items.length === 0;
  const showList = items.length > 0;

  const shouldShowGrid = viewMode === 'grid';

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={4} wrap="wrap" gap={2}>
        <Heading size="lg" color="black">
          Users
        </Heading>
        <Button colorPalette="brand" onClick={handleAdd} backgroundColor={'brand.600'} h="35px">
          + Add User
        </Button>
      </Flex>

      <Flex gap={3} mb={6} width="100%">
        <SearchField
          placeholder="Search users..."
          onSearch={handleSearch}
          onClear={handleClear}
          debounceDelay={500}
        />
      </Flex>

      {showInitialLoader && (
        <Flex justify="center" py={10}>
          <Spinner size="xl" />
        </Flex>
      )}

      {fetchStatus === 'failed' && (
        <Text color="red.500">{error || 'Something went wrong'}</Text>
      )}

      {showEmptyState && <Text>No users found.</Text>}

      {showList && (
        <Box position="relative">
          <Box opacity={isLoading ? 0.6 : 1} transition="opacity 0.2s ease">
            {shouldShowGrid ? (
              <Box minH="420px" w="100%" overflowX="hidden">
                <Grid
                  templateColumns={{
                    base: '1fr',
                    md: 'repeat(2, 1fr)',
                    xl: 'repeat(3, 1fr)',
                  }}
                  gap={{ base: 4, md: 5 }}
                  w="100%"
                >
                  {items.map((user) => (
                    <UserCard key={user.id} user={user} onEdit={onOpen} layout="card" />
                  ))}
                </Grid>
              </Box>
            ) : isMobile ? (
              <Box minH="420px">
                <Stack gap={3}>
                  {items.map((user) => (
                    <UserCard key={user.id} user={user} onEdit={onOpen} layout="card" />
                  ))}
                </Stack>
              </Box>
            ) : (
              <Box
                bg="white"
                borderWidth="1px"
                borderColor="gray.200"
                rounded="xl"
                shadow="xs"
                overflowX="auto"
                minH="420px"
              >
                <Table.Root variant="line" bg="white" color="black">
                  <Table.Header bg="white">
                    <Table.Row bg="white">
                      <Table.ColumnHeader color="black" fontWeight="bold">Name</Table.ColumnHeader>
                      <Table.ColumnHeader color="black" fontWeight="bold">Email</Table.ColumnHeader>
                      <Table.ColumnHeader color="black" fontWeight="bold">Phone</Table.ColumnHeader>
                      <Table.ColumnHeader color="black" fontWeight="bold">Actions</Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body bg="white">
                    {items.map((user) => (
                      <UserCard
                        key={user.id}
                        user={user}
                        onEdit={onOpen}
                        layout="table"
                      />
                    ))}
                  </Table.Body>
                </Table.Root>
              </Box>
            )}
          </Box>

          {isLoading && (
            <Flex
              position="absolute"
              inset={0}
              align="center"
              justify="center"
              bg="whiteAlpha.600"
              pointerEvents="none"
              rounded="xl"
            >
              <Spinner />
            </Flex>
          )}

          <Pagination
            currentPage={currentPage}
            totalItems={total}
            pageSize={limit}
            onPageChange={handlePageChange}
            isLoading={isLoading}
          />
        </Box>
      )}

      <UserFormDialog isOpen={open} onClose={handleDrawerClose} />
    </Box>
  );
}