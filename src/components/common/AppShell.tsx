import { Box, Button, Flex, Heading, Spacer } from '@chakra-ui/react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logout } from '../../features/auth/authSlice';

export default function AppShell() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  return (
    <Box minH="100vh" bg="gray.50">
      <Flex
        px={6}
        py={4}
        bg="white"
        borderBottom="1px solid"
        borderColor="gray.200"
        align="center"
      >
        <Heading size="md" color='black'>User Explorer</Heading>
        <Spacer />

        <Flex gap={3}>
          <Button asChild variant="ghost">
            <Link to="/users">Users</Link>
          </Button>

          <Button asChild variant="ghost">
            <Link to="/bookmarks">Bookmarks</Link>
          </Button>

          {isAuthenticated ? (
            <Button
              colorPalette="red"
              variant="outline"
              onClick={() => {
                dispatch(logout());
                navigate('/login');
              }}
            >
              Logout {user?.email ? `(${user.email})` : ''}
            </Button>
          ) : (
            <Button asChild colorPalette="blue">
              <Link to="/login">Login</Link>
            </Button>
          )}
        </Flex>
      </Flex>

      <Box maxW="1200px" mx="auto" p={6}>
        <Outlet />
      </Box>
    </Box>
  );
}