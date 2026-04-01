# User Explorer

Built this assessment with **React + TypeScript + Vite + Chakra UI + Redux Toolkit**.

This application allows users to:

- Browse users
- Search users
- Add a user
- Update a user
- Remove a user
- Bookmark users
- Use a mock authentication flow for bookmark access

---

## Tech Stack

- **React**
- **TypeScript**
- **Vite**
- **Chakra UI**
- **Redux Toolkit**
- **React Router DOM**
- **Axios**

---

## Features

### 1. User Listing
- Fetches users from DummyJSON API
- Displays users in a responsive grid
- Handles loading, error, and empty states

### 2. Search
- Search users by keyword
- Triggers API-based search
- Handles empty results cleanly

### 3. Add User
- Add a new user using a form
- Shows loading state while submitting

### 4. Update User
- Edit an existing user
- Prefills form with selected user data
- Shows updating state

### 5. Remove User
- Delete a user
- Includes confirmation before delete
- Handles removing state

### 6. Bookmark User
- Mark/unmark users as bookmarked
- Only available to authenticated users
- Bookmarks are persisted in `localStorage`

### 7. Authentication (Mock)
- Simple login form using email + password
- Authentication state is stored locally
- Only authenticated users can manage bookmarks

---


## Structure that I followed

src/
  app/
    store.ts
    hooks.ts
    providers.tsx
    router.tsx

  components/
    common/
    users/
    auth/

  features/
    auth/
    users/
    bookmarks/

  pages/
    UsersPage.tsx
    LoginPage.tsx
    BookmarksPage.tsx
    NotFoundPage.tsx

  services/
    api.ts
    usersApi.ts

  utils/
  theme/
  types/

  main.tsx

## API Used

Using the **DummyJSON Users API**.

Examples of endpoints used:

- `GET /users`
- `GET /users/search?q=...`
- `POST /users/add`
- `PATCH /users/:id`
- `DELETE /users/:id`


Base URL:

```env
VITE_API_BASE_URL=https://dummyjson.com



