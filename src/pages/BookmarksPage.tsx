import {
  Box,
  Flex,
  Heading,
  Table,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { setSelectedUser } from '../features/users/usersSlice';
import { fetchUsersByIds } from '../features/users/usersThunks';
import UserCard from '../components/users/UserCard';
import UserFormDrawer from '../components/users/UserFormDrawer';
import SearchField from '../components/common/SearchField';
import Pagination from '../components/common/Pagination';

export default function BookmarksPage() {
  const dispatch = useAppDispatch();
  const { open, onOpen, onClose } = useDisclosure();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const ids = useAppSelector((state) => state.bookmarks.ids);
  const users = useAppSelector((state) => state.users.items);

  useEffect(() => {
    if (isAuthenticated && ids.length > 0) {
      dispatch(fetchUsersByIds(ids));
    }
  }, [dispatch, ids, isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const bookmarkedUsers = ids
    .map((id) => users.find((user) => user.id === id))
    .filter(Boolean);

  // Filter bookmarked users based on search query
  const filteredUsers = searchQuery.trim()
    ? bookmarkedUsers.filter(
        (user) =>
          user &&
          (user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : bookmarkedUsers;

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));

  const visibleUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize) as NonNullable<typeof bookmarkedUsers>[0][];
  }, [filteredUsers, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleClear = () => {
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleDrawerClose = () => {
    dispatch(setSelectedUser(null));
    onClose();
  };

  return (
    <Box>
      <Heading size="lg" mb={6} color="black" justifySelf='start'>
        Bookmarks
      </Heading>

      <Flex gap={3} mb={6} width="100%">
        <SearchField
          placeholder="Search bookmarks..."
          onSearch={handleSearch}
          onClear={handleClear}
          debounceDelay={300}
        />
      </Flex>

      {bookmarkedUsers.length === 0 ? (
        <Text>No bookmarked users yet.</Text>
      ) : filteredUsers.length === 0 ? (
        <Text>No users match your search.</Text>
      ) : (
        <>
          <Box
            bg="white"
            borderWidth="1px"
            borderColor="gray.200"
            rounded="xl"
            shadow="xs"
            overflow="hidden"
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
                {visibleUsers.map((user) => (
                  <UserCard key={user!.id} user={user!} onEdit={onOpen} />
                ))}
              </Table.Body>
            </Table.Root>
          </Box>
          <Pagination
            currentPage={currentPage}
            totalItems={filteredUsers.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      <UserFormDrawer isOpen={open} onClose={handleDrawerClose} />
    </Box>
  );
}