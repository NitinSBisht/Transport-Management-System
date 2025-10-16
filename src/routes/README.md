# Routes Structure

This directory contains the routing configuration for the TMS application, organized in a modular and scalable way.

## File Structure

```
routes/
├── index.tsx                 # Main routes file - orchestrates all routes
├── authRoutes.tsx           # Public authentication routes
├── commonRoutes.tsx         # Routes accessible to all authenticated users
├── superAdminRoutes.tsx     # SuperAdmin specific routes
├── adminRoutes.tsx          # Admin specific routes
├── dispatcherRoutes.tsx     # Dispatcher specific routes
├── ProtectedRoute.tsx       # Route guard for authenticated users
├── RoleBasedRoute.tsx       # Route guard for role-based access
└── PublicRoute.tsx          # Route guard for public pages
```

## Route Files

### `authRoutes.tsx`
Contains all public authentication routes:
- `/login` - Login page
- `/register` - Registration page
- `/forgot-password` - Forgot password page
- `/reset-password` - Reset password page (with token)

### `commonRoutes.tsx`
Routes accessible to all authenticated users:
- `/change-password` - Change password page

### `superAdminRoutes.tsx`
Routes only accessible to SuperAdmin role:
- `/superadmin/dashboard` - SuperAdmin dashboard
- `/superadmin/admins` - Manage admins
- `/superadmin/dispatchers` - Manage dispatchers

### `adminRoutes.tsx`
Routes only accessible to Admin role:
- `/admin/dashboard` - Admin dashboard
- `/admin/dispatchers` - Manage dispatchers
- `/admin/loads` - Manage loads
- `/admin/assign-loads` - Assign loads

### `dispatcherRoutes.tsx`
Routes only accessible to Dispatcher role:
- `/dispatcher/dashboard` - Dispatcher dashboard
- `/dispatcher/loads` - My loads
- `/dispatcher/update-status` - Update status
- `/dispatcher/profile` - Profile

## Adding New Routes

### For a new public route:
1. Add the route component in `authRoutes.tsx`
2. Wrap it with `<PublicRoute>` component

### For a new common route (all authenticated users):
1. Add the route in `commonRoutes.tsx`
2. No additional wrapper needed (already protected by parent)

### For a new role-specific route:
1. Add the route in the appropriate role file (e.g., `adminRoutes.tsx`)
2. Wrap it with `<RoleBasedRoute allowedRoles={[ROLES.ADMIN]}>` component

## Example: Adding a New Admin Route

```tsx
// In adminRoutes.tsx
<Route
  path={ROUTES.ADMIN.NEW_FEATURE}
  element={
    <RoleBasedRoute allowedRoles={[ROLES.ADMIN]}>
      <NewFeaturePage />
    </RoleBasedRoute>
  }
/>
```

## Benefits of This Structure

1. **Scalability** - Easy to add new routes without cluttering the main file
2. **Maintainability** - Routes are organized by role/purpose
3. **Readability** - Clear separation of concerns
4. **Reusability** - Route guards are reusable across different route files
5. **Performance** - Code splitting is easier with modular structure

## Route Guards

- **ProtectedRoute** - Ensures user is authenticated
- **RoleBasedRoute** - Ensures user has the required role(s)
- **PublicRoute** - Redirects authenticated users to their dashboard
