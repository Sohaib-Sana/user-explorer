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
import { useAppDispatch } from '../app/hooks';
import { loginSuccess } from '../features/auth/authSlice';
import { toaster } from '../components/ui/toaster';
import type { RegisteredUser } from '../features/auth/authTypes';

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Enter a valid email address')
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Must be a valid email containing a domain')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      const normalizedEmail = values.email.trim().toLowerCase();
      let loginEmail = '';

      if (normalizedEmail === 'test@dummy.com' && values.password === 'dummy@123') {
        loginEmail = 'test@dummy.com';
      } else {
        const storedUsers = localStorage.getItem('registeredUsers');
        const users: RegisteredUser[] = storedUsers ? JSON.parse(storedUsers) : [];

        const matchedUser = users.find(
          (user) => user.email === normalizedEmail && user.password === values.password
        );

        if (!matchedUser) {
          toaster.create({
            title: 'Login failed',
            description: 'Invalid email or password.',
            type: 'error',
            meta: { closable: true },
          });
          setSubmitting(false);
          return;
        }
        
        loginEmail = matchedUser.email;
      }

      setSubmitting(false);
      dispatch(loginSuccess({ email: loginEmail }));
      navigate('/bookmarks');
    },
  });

  return (
    <Box maxW="320px" h="550px" mx="auto" w="100%" py={8}>
      <Flex align="center" gap={3} mb={6}>
        <Button variant="ghost" size="sm" onClick={() => navigate('/users')} px={2}>
          <LuArrowLeft />
        </Button>
        <Heading size="md" color="black" mb={0}>
          Login
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

          <Button type="submit" backgroundColor="brand.600" color="white" mt={2} loading={formik.isSubmitting}>
            Login
          </Button>

          <Box mt={2} p={4} bg="gray.100" rounded="md" fontSize="sm" color="gray.700" textAlign="left">
            <Text fontWeight="medium" mb={1} color="black">Dummy Credentials:</Text>
            <Text>Email: test@dummy.com</Text>
            <Text>Password: dummy@123</Text>
          </Box>

          <Text fontSize="sm" textAlign="center" color="gray.600" mt={4}>
            Don&apos;t have an account?{' '}
            <Text as="span" color="brand.600" fontWeight="medium">
              <Link to="/signup">Signup now</Link>
            </Text>
          </Text>
        </VStack>
      </form>
    </Box>
  );
}