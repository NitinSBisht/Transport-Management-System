# Table Component Usage Guide

## Overview
A reusable, fully-featured table component with dynamic columns, actions, and conditional visibility.

## Features
- ✅ Dynamic columns with custom rendering
- ✅ Built-in actions (View, Edit, Delete)
- ✅ Custom actions support
- ✅ Conditional action visibility per row
- ✅ Row click handler
- ✅ Loading state
- ✅ Empty state message
- ✅ Striped rows
- ✅ Hover effects
- ✅ Responsive design

## Basic Usage

```tsx
import { Table, TableColumn, TableAction } from '../../components/Common';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
}

const UsersTable = () => {
  const users: User[] = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'admin', status: 'active' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'user', status: 'inactive' },
  ];

  // Define columns
  const columns: TableColumn<User>[] = [
    {
      key: 'name',
      label: 'Name',
      width: '200px',
    },
    {
      key: 'email',
      label: 'Email',
    },
    {
      key: 'role',
      label: 'Role',
      render: (value) => (
        <span className="capitalize font-medium">{value}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <Badge variant={value === 'active' ? 'success' : 'danger'}>
          {value}
        </Badge>
      ),
    },
  ];

  // Define actions
  const actions = {
    view: {
      label: 'View',
      onClick: (row: User) => {
        console.log('View user:', row);
      },
      variant: 'primary' as const,
    },
    edit: {
      label: 'Edit',
      onClick: (row: User) => {
        console.log('Edit user:', row);
      },
      variant: 'default' as const,
      // Conditionally show edit only for active users
      show: (row: User) => row.status === 'active',
    },
    delete: {
      label: 'Delete',
      onClick: (row: User) => {
        if (confirm(`Delete ${row.name}?`)) {
          console.log('Delete user:', row);
        }
      },
      variant: 'danger' as const,
    },
  };

  return (
    <Table
      columns={columns}
      data={users}
      actions={actions}
      onRowClick={(row) => console.log('Row clicked:', row)}
      emptyMessage="No users found"
      striped
      hoverable
    />
  );
};
```

## Advanced Usage with Custom Actions

```tsx
const actions = {
  view: {
    label: 'View Details',
    onClick: (row: User) => navigate(`/users/${row.id}`),
    variant: 'primary' as const,
  },
  edit: {
    label: 'Edit User',
    onClick: (row: User) => setEditingUser(row),
    variant: 'default' as const,
    show: (row: User) => row.role !== 'superadmin', // Hide edit for superadmins
  },
  delete: {
    label: 'Delete User',
    onClick: (row: User) => handleDelete(row.id),
    variant: 'danger' as const,
    show: (row: User) => row.status === 'inactive', // Only show delete for inactive users
  },
  custom: [
    {
      label: 'Activate',
      icon: CheckCircle,
      onClick: (row: User) => handleActivate(row.id),
      variant: 'success' as const,
      show: (row: User) => row.status === 'inactive',
    },
    {
      label: 'Send Email',
      icon: Mail,
      onClick: (row: User) => handleSendEmail(row.email),
      variant: 'primary' as const,
    },
  ],
};
```

## Props Reference

### TableColumn<T>
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| key | string | Yes | Key to access data in row object |
| label | string | Yes | Column header label |
| render | (value, row) => ReactNode | No | Custom render function for cell |
| sortable | boolean | No | Enable sorting (future feature) |
| width | string | No | Column width (e.g., '200px', '20%') |

### TableAction<T>
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| label | string | Yes | Action button tooltip |
| icon | Component | No | Custom icon component |
| onClick | (row) => void | Yes | Click handler |
| variant | 'default' \| 'primary' \| 'danger' \| 'success' | No | Button color variant |
| show | (row) => boolean | No | Conditional visibility function |

### TableProps<T>
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| columns | TableColumn<T>[] | Yes | - | Array of column definitions |
| data | T[] | Yes | - | Array of data rows |
| actions | Object | No | - | Actions configuration (view, edit, delete, custom) |
| onRowClick | (row) => void | No | - | Row click handler |
| loading | boolean | No | false | Show loading state |
| emptyMessage | string | No | 'No data available' | Message when data is empty |
| className | string | No | '' | Additional CSS classes |
| striped | boolean | No | true | Alternate row colors |
| hoverable | boolean | No | true | Hover effect on rows |

## Styling Variants

### Action Button Variants
- **default**: Gray color (general actions)
- **primary**: Blue color (view, info actions)
- **danger**: Red color (delete, remove actions)
- **success**: Green color (approve, activate actions)

## Examples

### Simple Table (No Actions)
```tsx
<Table
  columns={columns}
  data={data}
  emptyMessage="No records found"
/>
```

### Table with Only View Action
```tsx
<Table
  columns={columns}
  data={data}
  actions={{
    view: {
      label: 'View',
      onClick: handleView,
    },
  }}
/>
```

### Table with Conditional Actions
```tsx
<Table
  columns={columns}
  data={data}
  actions={{
    edit: {
      label: 'Edit',
      onClick: handleEdit,
      show: (row) => row.canEdit, // Only show if canEdit is true
    },
    delete: {
      label: 'Delete',
      onClick: handleDelete,
      show: (row) => !row.isProtected, // Hide for protected rows
    },
  }}
/>
```

### Loading State
```tsx
<Table
  columns={columns}
  data={data}
  loading={isLoading}
/>
```

## Tips
1. Use `render` function for custom cell formatting (badges, links, etc.)
2. Use `show` function in actions for row-specific visibility
3. Use `onRowClick` for navigating to detail pages
4. Combine with `Card` component for better layout
5. Use TypeScript generics for type-safe data handling

## Integration Example

```tsx
import { Card, Table, Badge, TableColumn } from '../../components/Common';

const MyPage = () => {
  return (
    <Card title="Users List" padding="none">
      <Table
        columns={columns}
        data={users}
        actions={actions}
      />
    </Card>
  );
};
```
