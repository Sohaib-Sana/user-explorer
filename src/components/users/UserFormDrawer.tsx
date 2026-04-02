import {
  Button,
  CloseButton,
  Drawer,
  Field,
  Input,
  Portal,
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
    <Drawer.Root
      open={isOpen}
      onOpenChange={(details) => {
        if (!details.open) onClose();
      }}
      placement="end"
      size="md"
    >
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <form onSubmit={handleSubmit}>
              <Drawer.Header>
                {isEditing ? 'Update User' : 'Add User'}
              </Drawer.Header>

              <Drawer.Body>
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
              </Drawer.Body>

              <Drawer.Footer>
                <Button mr={3} variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" colorPalette="blue" loading={loading}>
                  {isEditing ? 'Update' : 'Add'}
                </Button>
              </Drawer.Footer>
            </form>

            <Drawer.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}