import { Box, Button, Flex, Heading, Spacer } from '@chakra-ui/react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logout } from '../../features/auth/authSlice';

export default function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const isUsersPage = location.pathname === '/users' || location.pathname === '/';
  const isBookmarksPage = location.pathname === '/bookmarks' || location.pathname === '/login';

  return (
    <Box minH="100vh" w="100%" bg="white">
      <Flex
        px={{ base: 4, md: 8 }}
        py={4}
        bg="white"
        borderBottom="1px solid"
        borderColor="gray.200"
        align="center"
        position="sticky"
        top={0}
        zIndex={10}
        w="100%"
      >
        <Heading size="md" color="black">
          User Explorer
        </Heading>

        <Spacer />

        <Flex gap={3}>
          <Button
            asChild
            colorPalette={isUsersPage ? 'blue' : 'gray'}
            variant={isUsersPage ? 'solid' : 'outline'}
          >
            <Link to="/users">Users</Link>
          </Button>

          <Button
            asChild
            colorPalette={isBookmarksPage ? 'blue' : 'gray'}
            variant={isBookmarksPage ? 'solid' : 'outline'}
          >
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

      <Box
        w="100%"
        minH="calc(100vh - 81px)"
        bg="white"
        px={{ base: 4, md: 8 }}
        py={8}
      >
        <Box
          w="100%"
          maxW="1400px"
          mx="auto"
          bg="white"
          p={{ base: 4, md: 6 }}
          border="1px solid"
          borderColor="gray.200"
          rounded="xl"
          shadow="sm"
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}