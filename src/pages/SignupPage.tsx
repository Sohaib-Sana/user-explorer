import {
  Button,
  Card,
  Field,
  Heading,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toaster } from '../components/ui/toaster';
import type { RegisteredUser } from '../features/auth/authTypes';

export default function SignupPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [touched, setTouched] = useState({
    email: false,
    password: false,
    confirmPassword: false,
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

  const confirmPasswordError = (() => {
    if (!confirmPassword) return 'Confirm password is required';
    if (confirmPassword !== password) return 'Passwords do not match';
    return '';
  })();

  const isFormValid = !emailError && !passwordError && !confirmPasswordError;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setTouched({
      email: true,
      password: true,
      confirmPassword: true,
    });

    if (!isFormValid) return;

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
      return;
    }

    const newUser: RegisteredUser = {
      email: normalizedEmail,
      password,
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

    navigate('/login');
  };

  return (
    <Card.Root maxW="480px" mx="auto">
      <Card.Body>
        <Heading size="md" mb={6} color="black">
          Signup
        </Heading>

        <form onSubmit={handleSubmit} noValidate>
          <VStack gap={4} align="stretch">
            <Field.Root required invalid={touched.email && !!emailError}>
              <Field.Label>Email</Field.Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
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

            <Field.Root
              required
              invalid={touched.confirmPassword && !!confirmPasswordError}
            >
              <Field.Label>Confirm Password</Field.Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() =>
                  setTouched((prev) => ({ ...prev, confirmPassword: true }))
                }
                placeholder="••••••••"
              />
              <Field.ErrorText>{confirmPasswordError}</Field.ErrorText>
            </Field.Root>

            <Button type="submit" backgroundColor="#63c94e" color="white">
              Signup
            </Button>

            <Text fontSize="sm" textAlign="center" color="gray.600">
              Already have an account?{' '}
              <Text as="span" color="#63c94e" fontWeight="medium">
                <Link to="/login">Login</Link>
              </Text>
            </Text>
          </VStack>
        </form>
      </Card.Body>
    </Card.Root>
  );
}