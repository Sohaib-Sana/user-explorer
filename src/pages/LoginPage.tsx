import { Button, Card, Field, Heading, Input, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../app/hooks';
import { loginSuccess } from '../features/auth/authSlice';

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

    dispatch(loginSuccess({ email: normalizedEmail }));
    navigate('/bookmarks');
  };

  return (
    <Card.Root maxW="480px" mx="auto">
      <Card.Body>
        <Heading size="md" mb={6} color="black">
          Login
        </Heading>

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

            <Button type="submit" colorPalette="blue" disabled={!isFormValid}>
              Login
            </Button>
          </VStack>
        </form>
      </Card.Body>
    </Card.Root>
  );
}