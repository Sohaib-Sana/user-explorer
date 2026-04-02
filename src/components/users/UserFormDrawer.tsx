import {
  Button,
  CloseButton,
  Dialog,
  Field,
  Input,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { addUser, updateUser } from '../../features/users/usersThunks';
import { toaster } from '../ui/toaster';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserFormDrawer({ isOpen, onClose }: Props) {
  const dispatch = useAppDispatch();
  const selectedUser = useAppSelector((state) => state.users.selectedUser);
  const addStatus = useAppSelector((state) => state.users.addStatus);
  const updateStatus = useAppSelector((state) => state.users.updateStatus);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (selectedUser) {
      setFirstName(selectedUser.firstName || '');
      setLastName(selectedUser.lastName || '');
      setEmail(selectedUser.email || '');
      setPhone(selectedUser.phone || '');
    } else {
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
    }
  }, [selectedUser, isOpen]);

  const isEditing = Boolean(selectedUser);
  const loading = addStatus === 'loading' || updateStatus === 'loading';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = { firstName, lastName, email, phone };

    try {
      if (isEditing && selectedUser) {
        await dispatch(updateUser({ id: selectedUser.id, payload })).unwrap();
        toaster.create({
          title: 'User updated',
          description: `Updated the user "${payload.firstName} ${payload.lastName}".`,
          type: 'success',
          meta: { closable: true },
        });
      } else {
        await dispatch(addUser(payload)).unwrap();
        toaster.create({
          title: 'User added',
          description: `Created a new user "${payload.firstName} ${payload.lastName}".`,
          type: 'success',
          meta: { closable: true },
        });
      }
    } catch (error) {
      toaster.create({
        title: 'Save failed',
        description: 'Could not save user details. Please try again.',
        type: 'error',
        meta: { closable: true },
      });
      return;
    }

    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(details) => !details.open && onClose()}>
      <Dialog.Backdrop />
      <Dialog.Content
        position="fixed"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        maxW="md"
        w="full"
        p={4}
        borderRadius="lg"
        bg="white"
      >
        <form onSubmit={handleSubmit}>
          <Dialog.Header>
            <Dialog.Title color="black">{isEditing ? 'Update User' : 'Add User'}</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
                <VStack gap={4} align="stretch">
                  <Field.Root required>
                    <Field.Label>First Name</Field.Label>
                    <Input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </Field.Root>

                  <Field.Root required>
                    <Field.Label>Last Name</Field.Label>
                    <Input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </Field.Root>

                  <Field.Root required>
                    <Field.Label>Email</Field.Label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Phone</Field.Label>
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </Field.Root>
                </VStack>
              </Dialog.Body>
              <Dialog.Footer>
                <Button mr={3} variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" colorPalette="blue" loading={loading}>
                  {isEditing ? 'Update' : 'Add'}
                </Button>
              </Dialog.Footer>
            </form>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" position="absolute" top={3} right={3} />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Root>
  );
}