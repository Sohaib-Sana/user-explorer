import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Spinner,
  Table,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchUsers, searchUsers } from '../features/users/usersThunks';
import { setSelectedUser } from '../features/users/usersSlice';
import UserCard from '../components/users/UserCard';
import UserFormDrawer from '../components/users/UserFormDrawer';

export default function UsersPage() {
  const dispatch = useAppDispatch();
  const { items, fetchStatus, error } = useAppSelector((state) => state.users);
  const [search, setSearch] = useState('');
  const { open, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    dispatch(fetchUsers({ limit: 12, skip: 0 }));
  }, [dispatch]);

  const handleSearch = () => {
    if (!search.trim()) {
      dispatch(fetchUsers({ limit: 12, skip: 0 }));
      return;
    }
    dispatch(searchUsers(search.trim()));
  };

  const handleAdd = () => {
    dispatch(setSelectedUser(null));
    onOpen();
  };

  const handleDrawerClose = () => {
    dispatch(setSelectedUser(null));
    onClose();
  };

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6} wrap="wrap" gap={3}>
        <Heading size="lg" color='black'>Users</Heading>
        <Button colorPalette="blue" onClick={handleAdd}>
          Add User
        </Button>
      </Flex>

      <Flex gap={3} mb={6}>
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearch();
          }}
        />
        <Button onClick={handleSearch}>Search</Button>
      </Flex>

      {fetchStatus === 'loading' && (
        <Flex justify="center" py={10}>
          <Spinner size="xl" />
        </Flex>
      )}

      {fetchStatus === 'failed' && (
        <Text color="red.500">{error || 'Something went wrong'}</Text>
      )}

      {fetchStatus === 'succeeded' && items.length === 0 && (
        <Text>No users found.</Text>
      )}

      {fetchStatus === 'succeeded' && items.length > 0 && (
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
              {items.map((user) => (
                <UserCard key={user.id} user={user} onEdit={onOpen} />
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      )}

      <UserFormDrawer isOpen={open} onClose={handleDrawerClose} />
    </Box>
  );
}