import {
  Avatar,
  Flex,
  Box,
  Table,
  Text,
  IconButton,
  Button
} from '@chakra-ui/react';
import { useState } from 'react';
// import { LuStarOff, LuPencil, LuTrash2 } from 'react-icons/lu';
// import { FaStar } from 'react-icons/fa';
import { LuBookmark, LuBookmarkCheck, LuPencil, LuTrash2 } from 'react-icons/lu';
import { toaster } from '../../components/ui/toaster';
import type { User } from '../../features/users/usersTypes';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setSelectedUser } from '../../features/users/usersSlice';
import { deleteUser } from '../../features/users/usersThunks';
import { toggleBookmark } from '../../features/bookmarks/bookmarksSlice';
import DeleteConfirmationDialog from '../common/DeleteConfirmationDialog';

interface Props {
  user: User;
  onEdit: () => void;
  layout?: 'table' | 'card';
}

export default function UserCard({ user, onEdit, layout = 'table' }: Props) {
  const dispatch = useAppDispatch();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { isAuthenticated, user: authUser } = useAppSelector((state) => state.auth);
  const bookmarked = useAppSelector((state) => state.bookmarks.ids.includes(user.id));

  const handleEdit = () => {
    dispatch(setSelectedUser(user));
    onEdit();
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleteDialogOpen(false);
    try {
      await dispatch(deleteUser(user.id)).unwrap();
      toaster.create({
        // title: 'User deleted',
        description: `User deleted successfully.`,
        type: 'success',
        meta: { closable: true },
      });
    } catch (error) {
      toaster.create({
        title: 'Delete failed',
        description: 'Could not delete the user. Please try again.',
        type: 'error',
        meta: { closable: true },
      });
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
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

    const actionLabel = bookmarked ? 'Removed bookmark for' : 'Bookmarked';
    toaster.create({
      // title: 'Bookmark updated',
      description: `${actionLabel} user "${user.firstName} ${user.lastName}".`,
      type: 'success',
      meta: { closable: true },
    });
  };

  if (layout === 'card') {
  return (
    <>
      <Box
        p={4}
        mb={3}
        borderWidth="1px"
        borderColor="gray.200"
        rounded="lg"
        shadow="xs"
        bg="white"
        w="100%"
      >
        {/* Top section */}
        <Flex align="flex-start" justify="space-between" mb={3} gap={2}>
          <Flex align="center" gap={3}>
            <Avatar.Root size="sm">
              <Avatar.Fallback name={`${user.firstName} ${user.lastName}`} />
              {user.image ? <Avatar.Image src={user.image} /> : null}
            </Avatar.Root>

            <Box>
              <Text fontWeight="bold">
                {user.firstName} {user.lastName}
              </Text>
              <Text fontSize="sm" color="gray.600">
                {user.email}
              </Text>
              <Text fontSize="sm" color="gray.600">
                {user.phone || 'No phone'}
              </Text>
            </Box>
          </Flex>


          <IconButton
            aria-label="Bookmark user"
            size="sm"
            variant="ghost"
            onClick={handleBookmark}
            color={bookmarked ? '#967DFE' : 'gray.400'}
            _hover={{
              bg: bookmarked ? 'purple.50' : 'gray.100',
              color: '#967DFE',
            }}
          >
            {bookmarked ? <LuBookmarkCheck size={16} /> : <LuBookmark size={16} />}
          </IconButton>
        </Flex>


        <Box borderTop="1px solid" borderColor="gray.100" my={3} />

        <Flex gap={3}>
          <Button
            flex={1}
            variant="outline"
            onClick={handleEdit}
          >
            Edit
          </Button>

          <Button
            flex={1}
            variant="outline"
            colorPalette="red"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </Flex>
      </Box>

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete User"
        description={`Are you sure you want to delete ${user.firstName} ${user.lastName}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
}

  return (
    <>
      <Table.Row>
      <Table.Cell>
        <Flex align="center" gap={3}>
          <Avatar.Root size="sm">
            <Avatar.Fallback name={`${user.firstName} ${user.lastName}`} />
            {user.image ? <Avatar.Image src={user.image} /> : null}
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
          color="blue.500" 
          onClick={handleEdit}
          _hover={{
            bg: 'gray.100',
            color: 'blue.600', 
          }}
        >
          <LuPencil />
        </IconButton>

        {/* Delete */}
        <IconButton
          aria-label="Delete user"
          size="sm"
          variant="ghost"
          color="red.500" 
          onClick={handleDelete}
          _hover={{
            bg: 'red.50',
            color: 'red.600',
          }}
        >
          <LuTrash2 />
        </IconButton>

        <IconButton
          aria-label="Bookmark user"
          size="sm"
          variant="ghost"
          onClick={handleBookmark}
          color={bookmarked ? 'yellow.400' : 'gray.400'}
          _hover={{
            bg: bookmarked ? 'purple.50' : 'gray.100',
            color: '#967DFE',
          }}
        >
          {bookmarked ? <LuBookmarkCheck size={16} /> : <LuBookmark size={16} />}
        </IconButton>

      </Flex>
    </Table.Cell>
    </Table.Row>

    <DeleteConfirmationDialog
      isOpen={isDeleteDialogOpen}
      onClose={handleCancelDelete}
      onConfirm={handleConfirmDelete}
      title="Delete User"
      description={`Are you sure you want to delete ${user.firstName} ${user.lastName}? This action cannot be undone.`}
      confirmText="Delete"
      cancelText="Cancel"
    />
    </>
  );
}