import { createBrowserRouter, Navigate } from 'react-router-dom';
import UsersPage from '../pages/UsersPage';
import LoginPage from '../pages/LoginPage';
import BookmarksPage from '../pages/BookmarksPage';
import NotFoundPage from '../pages/NotFoundPage';
import AppShell from '../components/common/AppShell';
import SignupPage from '../pages/SignupPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/users" replace /> },
      { path: 'users', element: <UsersPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
      { path: 'bookmarks', element: <BookmarksPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);