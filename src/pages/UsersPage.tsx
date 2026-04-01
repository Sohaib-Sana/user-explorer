import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  SimpleGrid,
  Spinner,
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
    dispatch(searchUsers(search));
  };

  const handleAdd = () => {
    dispatch(setSelectedUser(null));
    onOpen();
  };

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6} wrap="wrap" gap={3}>
        <Heading size="lg">Users</Heading>
        <Button colorScheme="blue" onClick={handleAdd}>
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
        <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spaceX={4}>
          {items.map((user) => (
            <UserCard key={user.id} user={user} onEdit={onOpen} />
          ))}
        </SimpleGrid>
      )}

      <UserFormDrawer isOpen={open} onClose={onClose} />
    </Box>
  );
}