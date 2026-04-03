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
import { useState } from 'react';
import { LuArrowLeft } from 'react-icons/lu';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../app/hooks';
import { loginSuccess } from '../features/auth/authSlice';
import { toaster } from '../components/ui/toaster';
import type { RegisteredUser } from '../features/auth/authTypes';

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const normalizedEmail = email.trim().toLowerCase();

  const emailError = (() => {
    if (!normalizedEmail) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) return 'Enter a valid email address';
    return '';
  })();

  const passwordError = (() => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return '';
  })();

  const isFormValid = !emailError && !passwordError;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setTouched({
      email: true,
      password: true,
    });

    if (!isFormValid) return;

    let loginEmail = '';

    if (normalizedEmail === 'test@dummy.com' && password === 'dummy@123') {
      loginEmail = 'test@dummy.com';
    } else {
      const storedUsers = localStorage.getItem('registeredUsers');
      const users: RegisteredUser[] = storedUsers ? JSON.parse(storedUsers) : [];

      const matchedUser = users.find(
        (user) => user.email === normalizedEmail && user.password === password
      );

      if (!matchedUser) {
        toaster.create({
          title: 'Login failed',
          description: 'Invalid email or password.',
          type: 'error',
          meta: { closable: true },
        });
        return;
      }
      
      loginEmail = matchedUser.email;
    }

    dispatch(loginSuccess({ email: loginEmail }));
    navigate('/bookmarks');
  };

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

      <form onSubmit={handleSubmit} noValidate>
        <VStack gap={4} align="stretch">
          <Field.Root required invalid={touched.email && !!emailError}>
            <Field.Label>Email</Field.Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() =>
                setTouched((prev) => ({ ...prev, email: true }))
              }
              placeholder="you@example.com"
            />
            <Field.ErrorText>{emailError}</Field.ErrorText>
          </Field.Root>

          <Field.Root required invalid={touched.password && !!passwordError}>
            <Field.Label>Password</Field.Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() =>
                setTouched((prev) => ({ ...prev, password: true }))
              }
              placeholder="••••••••"
            />
            <Field.ErrorText>{passwordError}</Field.ErrorText>
          </Field.Root>

          <Button type="submit" backgroundColor="brand.600" color="white" mt={2}>
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