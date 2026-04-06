import {
  Button,
  CloseButton,
  Dialog,
  Field,
  Input,
  VStack,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { addUser, updateUser } from '../../features/users/usersThunks';
import { toaster } from '../ui/toaster';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserFormDialog({ isOpen, onClose }: Props) {
  const dispatch = useAppDispatch();
  const selectedUser = useAppSelector((state) => state.users.selectedUser);
  const addStatus = useAppSelector((state) => state.users.addStatus);
  const updateStatus = useAppSelector((state) => state.users.updateStatus);

  const isEditing = Boolean(selectedUser);
  const loading = addStatus === 'loading' || updateStatus === 'loading';

  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, 'First name is too short')
      .required('First name is required'),
    lastName: Yup.string()
      .min(2, 'Last name is too short')
      .required('Last name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Must be a valid email containing a domain (e.g., .com)')
      .required('Email is required'),
    phone: Yup.string()
      .matches(/^\+[\d\s\-()]+$/, 'Phone must start with + followed by numbers')
      .required('Phone is required'),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: selectedUser?.firstName || '',
      lastName: selectedUser?.lastName || '',
      email: selectedUser?.email || '',
      phone: selectedUser?.phone || '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (isEditing && selectedUser) {
          await dispatch(updateUser({ id: selectedUser.id, payload: values })).unwrap();
          toaster.create({
            description: `User updated successfully.`,
            type: 'success',
            meta: { closable: true },
          });
        } else {
          await dispatch(addUser(values)).unwrap();
          toaster.create({
            description: `Created a new user "${values.firstName} ${values.lastName}".`,
            type: 'success',
            meta: { closable: true },
          });
        }
        formik.resetForm();
        onClose();
      } catch (error) {
        toaster.create({
          title: 'Save failed',
          description: 'Could not save user details. Please try again.',
          type: 'error',
          meta: { closable: true },
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (!isOpen) {
      formik.resetForm();
    }
  }, [isOpen]);

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
        <form onSubmit={formik.handleSubmit}>
          <Dialog.Header>
            <Dialog.Title color="black">{isEditing ? 'Update User' : 'Add User'}</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <VStack gap={4} align="stretch">
              <Field.Root required invalid={formik.touched.firstName && !!formik.errors.firstName}>
                <Field.Label>First Name</Field.Label>
                <Input
                  placeholder="first name"
                  {...formik.getFieldProps('firstName')}
                />
                <Field.ErrorText>{formik.errors.firstName as string}</Field.ErrorText>
              </Field.Root>

              <Field.Root required invalid={formik.touched.lastName && !!formik.errors.lastName}>
                <Field.Label>Last Name</Field.Label>
                <Input
                  placeholder="last name"
                  {...formik.getFieldProps('lastName')}
                />
                <Field.ErrorText>{formik.errors.lastName as string}</Field.ErrorText>
              </Field.Root>

              <Field.Root required invalid={formik.touched.email && !!formik.errors.email}>
                <Field.Label>Email</Field.Label>
                <Input
                  type="email"
                  placeholder="john@example.com"
                  {...formik.getFieldProps('email')}
                />
                <Field.ErrorText>{formik.errors.email as string}</Field.ErrorText>
              </Field.Root>

              <Field.Root required invalid={formik.touched.phone && !!formik.errors.phone}>
                <Field.Label>Phone</Field.Label>
                <Input
                  placeholder="e.g. +1 555-0198"
                  {...formik.getFieldProps('phone')}
                />
                <Field.ErrorText>{formik.errors.phone as string}</Field.ErrorText>
              </Field.Root>
            </VStack>
          </Dialog.Body>
          <Dialog.Footer>
            <Button mr={2} variant="outline" onClick={onClose} h="35px">
              Cancel
            </Button>
            <Button type="submit" backgroundColor="brand.500" loading={loading || formik.isSubmitting} h="35px">
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