import {
  Box,
  Button,
  Flex,
  Heading,
  Spinner,
  Stack,
  Table,
  Text,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchUsers, searchUsers } from '../features/users/usersThunks';
import { setSelectedUser } from '../features/users/usersSlice';
import Pagination from '../components/common/Pagination';
import UserCard from '../components/users/UserCard';
import UserFormDrawer from '../components/users/UserFormDrawer';
import SearchField from '../components/common/SearchField';

export default function UsersPage() {
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

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6} wrap="wrap" gap={3}>
        <Heading size="lg" color="black">
          Users
        </Heading>
        <Button colorPalette="brand" onClick={handleAdd} backgroundColor={'#967DFE'}>
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
            {isMobile ? (
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
                <Table.Root variant="line">
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeader>Name</Table.ColumnHeader>
                      <Table.ColumnHeader>Email</Table.ColumnHeader>
                      <Table.ColumnHeader>Phone</Table.ColumnHeader>
                      <Table.ColumnHeader>Actions</Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
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

      <UserFormDrawer isOpen={open} onClose={handleDrawerClose} />
    </Box>
  );
}