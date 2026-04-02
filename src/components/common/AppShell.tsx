import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  Menu,
  Portal,
  Spacer,
  Text,
} from '@chakra-ui/react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logout } from '../../features/auth/authSlice';

export default function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const isUsersPage = location.pathname === '/users' || location.pathname === '/';
  const isBookmarksPage =
    location.pathname === '/bookmarks' || location.pathname === '/login';

  return (
    <div className="app-container">
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
        {isAuthenticated && (
          <Menu.Root positioning={{ placement: 'bottom-end' }}>
            <Menu.Trigger asChild>
              <Button
                variant="ghost"
                p={0}
                minW="auto"
                h="auto"
                rounded="full"
              >
                <Avatar.Root size="md"
                background={'#967DFE'}
                color={'white'}
                >
                  <Avatar.Fallback
                    name={user?.email || 'User'}
                    fontSize="lg"
                  />
                </Avatar.Root>
              </Button>
            </Menu.Trigger>

            <Portal>
              <Menu.Positioner>
                <Menu.Content minW="220px">
                  <Box px={3} py={2}>
                    <Text fontSize="sm" color="gray.500">
                      Signed in as
                    </Text>
                    <Text fontSize="sm" fontWeight="medium" color="black">
                      {user?.email || 'No email'}
                    </Text>
                  </Box>

                  <Menu.Separator />

                  <Menu.Item
                    value="logout"
                    color="red.500"
                    onClick={() => {
                      dispatch(logout());
                      navigate('/login');
                    }}
                  >
                    Logout
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        )}

        <Heading size="sm" color="black" ml={3} alignSelf="flex-end">
          User Explorer
        </Heading>

        <Spacer />

        <Flex gap={3} align="center">
          <Button
            asChild
            variant={isUsersPage ? 'solid' : 'outline'}
            size="sm"
            py={1}
            backgroundColor={isUsersPage ? '#967DFE' : 'transparent'}
            >
            <Link to="/users"  >Users</Link>
          </Button>

          <Button
            asChild
            variant={isBookmarksPage ? 'solid' : 'outline'}
            size="sm"
            py={1}
            backgroundColor={isBookmarksPage ? '#967DFE' : 'transparent'}
          >
            {isAuthenticated ? (
              <Link to="/bookmarks">Bookmarks</Link>
            ) : (
              <Link to="/login">Login</Link>
            )}
          </Button>
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
        </div>
  );
}