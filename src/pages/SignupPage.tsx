import {
  Button,
  Box,
  Flex,
  Field,
  Heading,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react';
import { LuArrowLeft } from 'react-icons/lu';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { toaster } from '../components/ui/toaster';
import type { RegisteredUser } from '../features/auth/authTypes';

export default function SignupPage() {
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Enter a valid email address')
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Must be a valid email containing a domain')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords do not match')
      .required('Confirm password is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      const normalizedEmail = values.email.trim().toLowerCase();
      const storedUsers = localStorage.getItem('registeredUsers');
      const users: RegisteredUser[] = storedUsers ? JSON.parse(storedUsers) : [];

      const alreadyExists = users.some((user) => user.email === normalizedEmail);

      if (alreadyExists) {
        toaster.create({
          title: 'Account already exists',
          description: 'An account with this email already exists.',
          type: 'error',
          meta: { closable: true },
        });
        setSubmitting(false);
        return;
      }

      const newUser: RegisteredUser = {
        email: normalizedEmail,
        password: values.password,
      };

      localStorage.setItem(
        'registeredUsers',
        JSON.stringify([...users, newUser])
      );

      toaster.create({
        title: 'Signup successful',
        description: 'Your account has been created. Please log in.',
        type: 'success',
        meta: { closable: true },
      });

      setSubmitting(false);
      navigate('/login');
    },
  });

  return (
    <Box maxW="320px" h="550px" mx="auto" w="100%" py={8}>
      <Flex align="center" gap={3} mb={6}>
        <Button variant="ghost" size="sm" onClick={() => navigate('/users')} px={2}>
          <LuArrowLeft />
        </Button>
        <Heading size="md" color="black" mb={0}>
          Signup
        </Heading>
      </Flex>

      <form onSubmit={formik.handleSubmit} noValidate>
        <VStack gap={4} align="stretch">
          <Field.Root required invalid={formik.touched.email && !!formik.errors.email}>
            <Field.Label>Email</Field.Label>
            <Input
              type="email"
              placeholder="you@example.com"
              {...formik.getFieldProps('email')}
            />
            <Field.ErrorText>{formik.errors.email as string}</Field.ErrorText>
          </Field.Root>

          <Field.Root required invalid={formik.touched.password && !!formik.errors.password}>
            <Field.Label>Password</Field.Label>
            <Input
              type="password"
              placeholder="••••••••"
              {...formik.getFieldProps('password')}
            />
            <Field.ErrorText>{formik.errors.password as string}</Field.ErrorText>
          </Field.Root>

          <Field.Root
            required
            invalid={formik.touched.confirmPassword && !!formik.errors.confirmPassword}
          >
            <Field.Label>Confirm Password</Field.Label>
            <Input
              type="password"
              placeholder="••••••••"
              {...formik.getFieldProps('confirmPassword')}
            />
            <Field.ErrorText>{formik.errors.confirmPassword as string}</Field.ErrorText>
          </Field.Root>

          <Button type="submit" backgroundColor="brand.600" color="white" mt={2} loading={formik.isSubmitting}>
            Signup
          </Button>

          <Text fontSize="sm" textAlign="center" color="gray.600" mt={4}>
            Already have an account?{' '}
            <Text as="span" color="brand.600" fontWeight="medium">
              <Link to="/login">Login</Link>
            </Text>
          </Text>
        </VStack>
      </form>
    </Box>
  );
}