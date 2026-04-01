import {
  Avatar,
  Button,
  Flex,
  Table,
  Text,
} from '@chakra-ui/react';
import { LuStar, LuStarOff } from 'react-icons/lu';
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

  const { isAuthenticated, user: authUser } = useAppSelector((state) => state.auth);
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
    if (!isAuthenticated || !authUser?.email) {
      toaster.create({
        title: 'Login required',
        description: 'You must be logged in to bookmark users.',
        type: 'warning',
        meta: { closable: true },
      });
      return;
    }

    dispatch(
      toggleBookmark({
        userId: user.id,
        email: authUser.email,
      })
    );
  };

  return (
    <Table.Row>
      <Table.Cell>
        <Flex align="center" gap={3}>
          <Avatar.Root size="sm">
            <Avatar.Fallback name={`${user.firstName} ${user.lastName}`} />
            <Avatar.Image src={user.image} />
          </Avatar.Root>
          <Text fontWeight="medium">
            {user.firstName} {user.lastName}
          </Text>
        </Flex>
      </Table.Cell>

      <Table.Cell>{user.email}</Table.Cell>
      <Table.Cell>{user.phone || 'No phone'}</Table.Cell>

      <Table.Cell>
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
            {bookmarked ? <LuStar /> : <LuStarOff />}
          </Button>
        </Flex>
      </Table.Cell>
    </Table.Row>
  );
}