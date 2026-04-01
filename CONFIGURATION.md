# State Management
 Redux Toolkit is used for state management.

## Store slices
### users
    Handles:
       - users list
       - loading states
       - error states
       - search results
       - add/update/delete lifecycle
       - selected user for editing


### auth
    Handles:
        - mock login state
        - authenticated user
        - persistence in localStorage


### bookmarks
    Handles:
        - bookmarked user IDs
        - persistence in localStorage

** -------------------------------------------------------------------------------------------------------------------- ** 

# Routing
    I used React Router for page navigation. Routes are mentioned below.

## Routes
    - /users → Users page
    - /login → Login page
    - /bookmarks → Bookmarks page
    - * → Not found page

** -------------------------------------------------------------------------------------------------------------------- ** 

# Local Persistence
    The following are persisted in localStorage:

    - authentication state
    - bookmark IDs

    This makes the app feel more realistic without requiring a real backend auth session.
