import {
  Avatar,
  Box,
  Button,

  Flex,
  Heading,
  Menu,
  Portal,
  Text,
} from '@chakra-ui/react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logout } from '../../features/auth/authSlice';

export type ViewMode = 'list' | 'grid';

export default function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const isUsersPage = location.pathname === '/users' || location.pathname === '/';
  const isBookmarksPage =
    location.pathname === '/bookmarks' || location.pathname === '/login';

  const showViewToggle =
    location.pathname === '/users' || location.pathname === '/bookmarks';

  return (
    <div className="app-container">
      <Box minH="100vh" w="100%" bg="white">
       <Flex
          px={{ base: 4, md: 8 }}
          py={4}
          bg="white"
          borderBottom="1px solid"
          borderColor="gray.200"
          position="sticky"
          top={0}
          zIndex={10}
          w="100%"
          direction={{ base: 'column', md: 'row' }}
          align={{ base: 'stretch', md: 'center' }}
          gap={{ base: 3, md: 4 }}
        >
          {/* Left */}
          <Flex
            align="center"
            gap={3}
            minW={0}
            flex={{ base: 'unset', md: 1 }}
            justify={{ base: 'flex-start', md: 'flex-start' }}
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
                    <Avatar.Root size="sm" background="#63c94e" color="white">
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

            <Heading size="xs" color="black" lineHeight="1.1">
              Andrea Assessment
            </Heading>
          </Flex>

          {/* Center */}
          <Flex
            flex={{ base: 'unset', md: 1 }}
            justify="center"
            w="100%"
          >
            {showViewToggle && (
              <Flex
                display={{ base: 'none', md: 'flex' }}
                p="3px"
                rounded="full"
                bg="linear-gradient(90deg, #54b740 0%, #63c94e 100%)"
                w="240px"
              >
                <Button
                  flex={1}
                  size="xs"
                  h="34px"
                  minW="0"
                  px={4}
                  onClick={() => setViewMode('list')}
                  rounded="full"
                  bg={viewMode === 'list' ? 'white' : 'transparent'}
                  color={viewMode === 'list' ? '#54b740' : 'white'}
                  fontWeight="semibold"
                  _hover={{ bg: viewMode === 'list' ? 'white' : 'transparent' }}
                  _active={{ bg: viewMode === 'list' ? 'white' : 'transparent' }}
                >
                  List view
                </Button>

                <Button
                  flex={1}
                  size="xs"
                  h="34px"
                  minW="0"
                  px={4}
                  onClick={() => setViewMode('grid')}
                  rounded="full"
                  bg={viewMode === 'grid' ? 'white' : 'transparent'}
                  color={viewMode === 'grid' ? '#54b740' : 'white'}
                  fontWeight="semibold"
                  _hover={{ bg: viewMode === 'grid' ? 'white' : 'transparent' }}
                  _active={{ bg: viewMode === 'grid' ? 'white' : 'transparent' }}
                >
                  Grid view
                </Button>
              </Flex>
            )}
          </Flex>

          {/* Right */}
          <Flex
            flex={{ base: 'unset', md: 1 }}
            gap={3}
            align="center"
            justify={{ base: 'stretch', md: 'flex-end' }}
            w={{ base: '100%', md: 'auto' }}
          >
           <Button
              asChild
              variant={isUsersPage ? 'solid' : 'outline'}
              size="xs"
              h="35px"
              px={3}
              fontSize="sm"
              flex={{ base: 1, md: 'unset' }}
              backgroundColor={isUsersPage ? '#63c94e' : 'transparent'}
            >
              <Link to="/users">Users</Link>
            </Button>

            <Button
              asChild
              variant={isBookmarksPage ? 'solid' : 'outline'}
              size="xs"
              h="35px"
              px={3}
              fontSize="sm"
              flex={{ base: 1, md: 'unset' }}
              backgroundColor={isBookmarksPage ? '#63c94e' : 'transparent'}
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
            <Outlet context={{ viewMode }} />
          </Box>
        </Box>
      </Box>
    </div>
  );
}