import {
  Avatar,
  Flex,
  Table,
  Text,
  IconButton,
} from '@chakra-ui/react';
import {  LuStarOff, LuPencil, LuTrash2 } from 'react-icons/lu';
import { FaStar } from 'react-icons/fa'; //
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

        {/* Edit */}
        <IconButton
          aria-label="Edit user"
          size="sm"
          variant="ghost"
          color="blue.500" // ✅ always blue
          onClick={handleEdit}
          _hover={{
            bg: 'gray.100',
            color: 'blue.600', // optional slightly darker on hover
          }}
        >
          <LuPencil />
        </IconButton>

        {/* Delete */}
        <IconButton
          aria-label="Delete user"
          size="sm"
          variant="ghost"
          color="red.500" // ✅ always red
          onClick={handleDelete}
          _hover={{
            bg: 'red.50',
            color: 'red.600', // optional darker on hover
          }}
        >
          <LuTrash2 />
        </IconButton>

        {/* Bookmark (unchanged) */}
        <IconButton
          aria-label="Bookmark user"
          size="sm"
          variant="ghost"
          onClick={handleBookmark}
          color={bookmarked ? 'yellow.400' : 'gray.500'}
          _hover={{
            bg: bookmarked ? 'yellow.50' : 'gray.100',
            color: 'yellow.500',
          }}
        >
          {bookmarked ? <FaStar /> : <LuStarOff />}
        </IconButton>

      </Flex>
    </Table.Cell>
    </Table.Row>
  );
}