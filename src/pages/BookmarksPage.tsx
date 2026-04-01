import { Box, Heading, SimpleGrid, Text } from '@chakra-ui/react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import UserCard from '../components/users/UserCard';

export default function BookmarksPage() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const ids = useAppSelector((state) => state.bookmarks.ids);
  const users = useAppSelector((state) => state.users.items);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const bookmarkedUsers = users.filter((user) => ids.includes(user.id));

  return (
    <Box>
      <Heading size="lg" mb={6}>Bookmarks</Heading>

      {bookmarkedUsers.length === 0 ? (
        <Text>No bookmarked users yet.</Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap={4}>
          {bookmarkedUsers.map((user) => (
            <UserCard key={user.id} user={user} onEdit={() => {}} />
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
}