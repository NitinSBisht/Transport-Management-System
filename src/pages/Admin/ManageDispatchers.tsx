import React, { useState } from 'react';
import { UserPlus, User as UserIcon } from 'lucide-react';
import { Table, TableColumn, Badge, Button, Card, SideDrawer, Loader, ConfirmModal, ToggleSwitch } from '../../components/Common';
import DispatcherForm, { DispatcherFormData } from '../../components/Admin/DispatcherForm';
import { 
  useGetDispatchersQuery, 
  useCreateDispatcherMutation, 
  useUpdateDispatcherMutation, 
  useDeleteDispatcherMutation,
  useToggleDispatcherStatusMutation,
  DispatcherData 
} from '../../api/dispatchersApi';
import toast from 'react-hot-toast';

const ManageDispatchers: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedDispatcher, setSelectedDispatcher] = useState<DispatcherFormData | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit] = useState(10);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [dispatcherToDelete, setDispatcherToDelete] = useState<any>(null);

  // API hooks
  const { data: dispatchersResponse, isLoading, error, refetch } = useGetDispatchersQuery({
    search: searchQuery,
    page: currentPage,
    limit: pageLimit,
  });
  const [createDispatcher, { isLoading: isCreating }] = useCreateDispatcherMutation();
  const [updateDispatcher, { isLoading: isUpdating }] = useUpdateDispatcherMutation();
  const [deleteDispatcher] = useDeleteDispatcherMutation();
  const [toggleDispatcherStatus] = useToggleDispatcherStatusMutation();

  // Ensure dispatchers is always an array
  const dispatchers = dispatchersResponse?.data?.dispatchers || [];
  const pagination = dispatchersResponse?.data?.pagination;

  // Show error toast if API fails (only for actual errors, not empty data)
  React.useEffect(() => {
    if (error && !dispatchersResponse) {
      toast.error('Failed to load dispatchers. Please try again.');
      console.error('Dispatcher API Error:', error);
    }
  }, [error, dispatchersResponse]);

  // Debug: Log the response
  React.useEffect(() => {
    if (dispatchersResponse) {
      console.log('Dispatchers Response:', dispatchersResponse);
      console.log('Dispatchers Array:', dispatchersResponse.data?.dispatchers);
      console.log('Pagination:', dispatchersResponse.data?.pagination);
    }
  }, [dispatchersResponse]);

  const handleAddDispatcher = () => {
    setSelectedDispatcher(null);
    setIsEditMode(false);
    setIsViewMode(false);
    setIsDrawerOpen(true);
  };

  const handleEditDispatcher = (dispatcher: any) => {
    const flattenedDispatcher: DispatcherFormData = {
      id: dispatcher.id,
      firstName: dispatcher.firstName,
      lastName: dispatcher.lastName,
      email: dispatcher.credential?.email || '',
      phoneNumber: dispatcher.credential?.phoneNumber || '',
      streetNumber: dispatcher.address?.streetNumber || '',
      streetName: dispatcher.address?.streetName || '',
      country: dispatcher.address?.country || '',
      state: dispatcher.address?.state || '',
      city: dispatcher.address?.city || '',
      zipCode: dispatcher.address?.zipCode || '',
      address: dispatcher.address?.address || '',
      latitude: String(dispatcher.address?.latitude || ''),
      longitude: String(dispatcher.address?.longitude || ''),
      placeId: dispatcher.address?.placeId || '',
      dispatcherLicenseNumber: dispatcher.dispatcherLicenseNumber || '',
      dispatcherCode: dispatcher.dispatcherCode || '',
      shiftTiming: dispatcher.shiftTiming || 'day',
      shiftStartTime: dispatcher.shiftStartTime || '',
      shiftEndTime: dispatcher.shiftEndTime || '',
      hireDate: dispatcher.hireDate || '',
      terminationDate: dispatcher.terminationDate || '',
      dob: dispatcher.dob || '',
      icon: dispatcher.icon,
    };
    setSelectedDispatcher(flattenedDispatcher);
    setIsEditMode(true);
    setIsViewMode(false);
    setIsDrawerOpen(true);
  };

  const handleViewDispatcher = (dispatcher: any) => {
    const flattenedDispatcher: DispatcherFormData = {
      id: dispatcher.id,
      firstName: dispatcher.firstName,
      lastName: dispatcher.lastName,
      email: dispatcher.credential?.email || '',
      phoneNumber: dispatcher.credential?.phoneNumber || '',
      streetNumber: dispatcher.address?.streetNumber || '',
      streetName: dispatcher.address?.streetName || '',
      country: dispatcher.address?.country || '',
      state: dispatcher.address?.state || '',
      city: dispatcher.address?.city || '',
      zipCode: dispatcher.address?.zipCode || '',
      address: dispatcher.address?.address || '',
      latitude: String(dispatcher.address?.latitude || ''),
      longitude: String(dispatcher.address?.longitude || ''),
      placeId: dispatcher.address?.placeId || '',
      dispatcherLicenseNumber: dispatcher.dispatcherLicenseNumber || '',
      dispatcherCode: dispatcher.dispatcherCode || '',
      shiftTiming: dispatcher.shiftTiming || 'day',
      shiftStartTime: dispatcher.shiftStartTime || '',
      shiftEndTime: dispatcher.shiftEndTime || '',
      hireDate: dispatcher.hireDate || '',
      terminationDate: dispatcher.terminationDate || '',
      dob: dispatcher.dob || '',
      icon: dispatcher.icon,
    };
    setSelectedDispatcher(flattenedDispatcher);
    setIsEditMode(false);
    setIsViewMode(true);
    setIsDrawerOpen(true);
  };

  const handleDeleteDispatcher = (dispatcher: any) => {
    setDispatcherToDelete(dispatcher);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!dispatcherToDelete) return;

    try {
      await deleteDispatcher(dispatcherToDelete.id!).unwrap();
      toast.success(`${dispatcherToDelete.firstName} ${dispatcherToDelete.lastName} deleted successfully`);
      setIsDeleteModalOpen(false);
      setDispatcherToDelete(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to delete dispatcher');
    }
  };

  const handleToggleStatus = async (dispatcher: DispatcherData) => {
    const currentStatus = dispatcher.credential?.status || 'active';
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    try {
      await toggleDispatcherStatus({ 
        id: String(dispatcher.id), 
        status: newStatus 
      }).unwrap();
      
      toast.success(`Dispatcher ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update dispatcher status');
    }
  };

  const handleFormSubmit = async (values: DispatcherFormData) => {
    try {
      console.log('Submitting dispatcher data:', values);
      
      if (isEditMode && values.id) {
        const result = await updateDispatcher({ id: values.id, ...values }).unwrap();
        console.log('Update result:', result);
        toast.success('Dispatcher updated successfully');
      } else {
        const result = await createDispatcher(values).unwrap();
        console.log('Create result:', result);
        toast.success('Dispatcher created successfully');
      }
      
      handleCloseDrawer();
      refetch();
    } catch (error: any) {
      console.error('Dispatcher submission error:', error);
      const errorMessage = error?.data?.message || error?.message || `Failed to ${isEditMode ? 'update' : 'create'} dispatcher`;
      toast.error(errorMessage);
    }
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedDispatcher(null);
    setIsEditMode(false);
    setIsViewMode(false);
  };

  const columns: TableColumn<DispatcherData>[] = [
    {
      key: 'firstName',
      label: 'Name',
      sortable: true,
      width: '250px',
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden">
            {row.icon ? (
              <img src={row.icon} alt={`${row.firstName} ${row.lastName}`} className="w-full h-full object-cover" />
            ) : (
              <UserIcon className="w-5 h-5 text-primary-600" />
            )}
          </div>
          <div>
            <p className="font-medium text-gray-900">{row.firstName} {row.lastName}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'credential',
      label: 'Email',
      sortable: false,
      render: (value, row) => (
        <span className="text-sm text-gray-600">
          {row.credential?.email || 'N/A'}
        </span>
      ),
    },
    {
      key: 'credential',
      label: 'Phone',
      sortable: false,
      render: (value, row) => (
        <span className="text-sm text-gray-600">
          {row.credential?.phoneNumber || 'N/A'}
        </span>
      ),
    },
    {
      key: 'credential',
      label: 'Status',
      sortable: false,
      render: (value, row) => {
        const status = row.credential?.status || 'active';
        return (
          <div className="flex items-center space-x-3">
            <ToggleSwitch
              checked={status === 'active'}
              onChange={() => handleToggleStatus(row)}
              size="sm"
            />
            <span className={`text-sm font-medium ${status === 'active' ? 'text-green-600' : 'text-gray-500'}`}>
              {status === 'active' ? 'Active' : 'Inactive'}
            </span>
          </div>
        );
      },
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader size="lg" text="Loading dispatchers..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Dispatchers</h1>
          <p className="text-gray-600 mt-2">View and manage all dispatchers</p>
        </div>
        <Button onClick={handleAddDispatcher} icon={UserPlus} variant="primary">
          Add Dispatcher
        </Button>
      </div>

      {/* Search and Filters */}
      <Card padding="sm">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search dispatchers by name or email..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      </Card>

      {/* Dispatchers Table */}
      <Table
        columns={columns}
        data={dispatchers}
        actions={{
          view: { label: 'View Details', onClick: handleViewDispatcher, variant: 'primary' },
          edit: { label: 'Edit Dispatcher', onClick: handleEditDispatcher, variant: 'default' },
          delete: { label: 'Delete Dispatcher', onClick: handleDeleteDispatcher, variant: 'danger' },
        }}
        striped
        hoverable
      />

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {((currentPage - 1) * pageLimit) + 1} to {Math.min(currentPage * pageLimit, pagination.totalRecords)} of {pagination.totalRecords} dispatchers
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={!pagination.hasPreviousPage}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={!pagination.hasNextPage}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Side Drawer for Add/Edit/View Dispatcher */}
      <SideDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        title={isViewMode ? 'View Dispatcher Details' : isEditMode ? 'Edit Dispatcher' : 'Add New Dispatcher'}
        size="lg"
      >
        <DispatcherForm
          initialValues={selectedDispatcher || undefined}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseDrawer}
          isEdit={isEditMode}
          isLoading={isCreating || isUpdating}
          isViewOnly={isViewMode}
        />
      </SideDrawer>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDispatcherToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Dispatcher"
        message={`Are you sure you want to delete "${dispatcherToDelete?.firstName} ${dispatcherToDelete?.lastName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};

export default ManageDispatchers;
