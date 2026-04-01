import { Avatar, Button, Card, Flex, Heading, Text, VStack } from '@chakra-ui/react';
import { toaster } from '../../components/ui/toaster';
import type { User } from '../../features/users/usersTypes';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setSelectedUser } from '../../features/users/usersSlice';
import { deleteUser } from '../../features/users/usersThunks';
import { toggleBookmark } from '../../features/bookmarks/bookmarksSlice';

interface Props {
  user: User;
  onEdit: () => void;
}

export default function UserCard({ user, onEdit }: Props) {
  const dispatch = useAppDispatch();

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const bookmarked = useAppSelector((state) => state.bookmarks.ids.includes(user.id));

  const handleEdit = () => {
    dispatch(setSelectedUser(user));
    onEdit();
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(`Delete ${user.firstName} ${user.lastName}?`);
    if (!confirmed) return;
    await dispatch(deleteUser(user.id));
  };

  const handleBookmark = () => {
    if (!isAuthenticated) {
      toaster.create({
        title: 'Login required',
        description: 'You must be logged in to bookmark users.',
        type: 'warning',
        meta: { closable: true },
      });
      return;
    }

    dispatch(toggleBookmark(user.id));
  };

  return (
    <Card.Root>
      <Card.Body>
        <Flex align="start" justify="space-between" mb={4}>
          <Flex gap={3}>
            <Avatar.Root>
              <Avatar.Fallback name={`${user.firstName} ${user.lastName}`} />
              <Avatar.Image src={user.image} />
            </Avatar.Root>

            <VStack align="start" gap={0}>
              <Heading size="sm">
                {user.firstName} {user.lastName}
              </Heading>
              <Text fontSize="sm" color="gray.600">
                {user.email}
              </Text>
              <Text fontSize="sm" color="gray.500">
                {user.phone || 'No phone'}
              </Text>
            </VStack>
          </Flex>
        </Flex>

        <Flex gap={2} wrap="wrap">
          <Button size="sm" onClick={handleEdit}>
            Edit
          </Button>

          <Button size="sm" colorPalette="red" variant="outline" onClick={handleDelete}>
            Delete
          </Button>

          <Button
            size="sm"
            colorPalette={bookmarked ? 'yellow' : 'gray'}
            onClick={handleBookmark}
          >
            {bookmarked ? 'Bookmarked' : 'Bookmark'}
          </Button>
        </Flex>
      </Card.Body>
    </Card.Root>
  );
}