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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) return;

    dispatch(loginSuccess({ email: normalizedEmail }));
    navigate('/users');
  };

  return (
    <Card.Root maxW="480px" mx="auto">
      <Card.Body>
        <Heading size="md" mb={6} color="black">
          Login
        </Heading>

        <form onSubmit={handleSubmit}>
          <VStack gap={4} align="stretch">
            <Field.Root required>
              <Field.Label>Email</Field.Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </Field.Root>

            <Field.Root required>
              <Field.Label>Password</Field.Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </Field.Root>

            <Button type="submit" colorPalette="blue">
              Login
            </Button>
          </VStack>
        </form>
      </Card.Body>
    </Card.Root>
  );
}