import React, { useState } from 'react';
import { UserPlus, Building2, CheckCircle, XCircle } from 'lucide-react';
import { Table, TableColumn, Badge, Button, Card, SideDrawer, Loader, ConfirmModal, ToggleSwitch } from '../../components/Common';
import AdminForm, { AdminFormData } from '../../components/SuperAdmin/AdminForm';
import { 
  useGetAdminsQuery, 
  useCreateAdminMutation, 
  useUpdateAdminMutation, 
  useDeleteAdminMutation,
  useToggleAdminStatusMutation,
  AdminData 
} from '../../api/adminsApi';
import toast from 'react-hot-toast';

const ManageAdmins: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminFormData | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit] = useState(10);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<any>(null);

  // API hooks
  const { data: adminsResponse, isLoading, error, refetch } = useGetAdminsQuery({
    search: searchQuery,
    page: currentPage,
    limit: pageLimit,
  });
  const [createAdmin, { isLoading: isCreating }] = useCreateAdminMutation();
  const [updateAdmin, { isLoading: isUpdating }] = useUpdateAdminMutation();
  const [deleteAdmin] = useDeleteAdminMutation();
  const [toggleAdminStatus] = useToggleAdminStatusMutation();

  // Ensure admins is always an array
  const admins = adminsResponse?.data?.admins || [];
  const pagination = adminsResponse?.data?.pagination;

  // Show error toast if API fails
  React.useEffect(() => {
    if (error) {
      toast.error('Failed to load admins. Please try again.');
      console.error('Admin API Error:', error);
    }
  }, [error]);

  // Debug: Log the response to see the structure
  React.useEffect(() => {
    if (adminsResponse) {
      console.log('Admins Response:', adminsResponse);
      console.log('Admins Array:', adminsResponse.data?.admins);
      console.log('Pagination:', adminsResponse.data?.pagination);
    }
  }, [adminsResponse]);

  const handleAddAdmin = () => {
    setSelectedAdmin(null);
    setIsEditMode(false);
    setIsViewMode(false);
    setIsDrawerOpen(true);
  };

  const handleEditAdmin = (admin: AdminData) => {
    // Flatten the nested structure for the form
    const flattenedAdmin: any = {
      id: admin.id,
      organisationName: admin.organisationName,
      dotNumber: admin.dotNumber,
      mcNumber: admin.mcNumber,
      taxId: admin.taxId,
      website: admin.website,
      logo: admin.logo,
      ownerName: admin.ownerName,
      ownerEmail: admin.ownerEmail,
      ownerPhoneNumber: admin.ownerPhoneNumber,
      email: admin.credential?.email || '',
      phoneNumber: admin.credential?.phoneNumber || '',
      streetNumber: admin.address?.streetNumber || '',
      streetName: admin.address?.streetName || '',
      country: admin.address?.country || '',
      state: admin.address?.state || '',
      city: admin.address?.city || '',
      zipCode: admin.address?.zipCode || '',
      address: admin.address?.address || '',
      latitude: String(admin.address?.latitude || ''),
      longitude: String(admin.address?.longitude || ''),
      placeId: admin.address?.placeId || '',
    };
    setSelectedAdmin(flattenedAdmin);
    setIsEditMode(true);
    setIsViewMode(false);
    setIsDrawerOpen(true);
  };

  const handleViewAdmin = (admin: AdminData) => {
    // Flatten the nested structure for the form
    const flattenedAdmin: any = {
      id: admin.id,
      organisationName: admin.organisationName,
      dotNumber: admin.dotNumber,
      mcNumber: admin.mcNumber,
      taxId: admin.taxId,
      website: admin.website,
      logo: admin.logo,
      ownerName: admin.ownerName,
      ownerEmail: admin.ownerEmail,
      ownerPhoneNumber: admin.ownerPhoneNumber,
      email: admin.credential?.email || '',
      phoneNumber: admin.credential?.phoneNumber || '',
      streetNumber: admin.address?.streetNumber || '',
      streetName: admin.address?.streetName || '',
      country: admin.address?.country || '',
      state: admin.address?.state || '',
      city: admin.address?.city || '',
      zipCode: admin.address?.zipCode || '',
      address: admin.address?.address || '',
      latitude: String(admin.address?.latitude || ''),
      longitude: String(admin.address?.longitude || ''),
      placeId: admin.address?.placeId || '',
    };
    setSelectedAdmin(flattenedAdmin);
    setIsEditMode(false);
    setIsViewMode(true);
    setIsDrawerOpen(true);
  };

  const handleDeleteAdmin = (admin: any) => {
    setAdminToDelete(admin);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!adminToDelete) return;

    try {
      await deleteAdmin(adminToDelete.id!).unwrap();
      toast.success(`${adminToDelete.organisationName} deleted successfully`);
      setIsDeleteModalOpen(false);
      setAdminToDelete(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to delete admin');
    }
  };

  const handleToggleStatus = async (admin: AdminData) => {
    const currentStatus = admin.credential?.status || admin.status || 'active';
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    try {
      await toggleAdminStatus({ 
        id: String(admin.id), 
        status: newStatus 
      }).unwrap();
      
      toast.success(`Admin ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update admin status');
    }
  };

  const handleFormSubmit = async (values: AdminFormData) => {
    try {
      console.log('Submitting admin data:', values);
      
      if (isEditMode && values.id) {
        const result = await updateAdmin({ id: values.id, ...values }).unwrap();
        console.log('Update result:', result);
        toast.success('Admin updated successfully');
      } else {
        const result = await createAdmin(values).unwrap();
        console.log('Create result:', result);
        toast.success('Admin created successfully');
      }
      setIsDrawerOpen(false);
      setSelectedAdmin(null);
      refetch();
    } catch (error: any) {
      console.error('Admin submission error:', error);
      const errorMessage = error?.data?.message || error?.message || `Failed to ${isEditMode ? 'update' : 'create'} admin`;
      toast.error(errorMessage);
    }
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedAdmin(null);
    setIsEditMode(false);
    setIsViewMode(false);
  };

  const columns: TableColumn<AdminData>[] = [
    {
      key: 'organisationName',
      label: 'Organisation',
      sortable: true,
      width: '250px',
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{value}</p>
            <p className="text-xs text-gray-500">{row.credential?.email || row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'ownerName',
      label: 'Owner',
      sortable: true,
      render: (value, row) => (
        <div>
          <p className="font-medium text-gray-900">{value}</p>
          <p className="text-xs text-gray-500">{row.ownerEmail}</p>
        </div>
      ),
    },
    {
      key: 'address',
      label: 'Location',
      sortable: false,
      render: (value, row) => (
        <span className="text-sm text-gray-600">
          {row.address?.city || ''}, {row.address?.state || ''}
        </span>
      ),
    },
    {
      key: 'credential',
      label: 'Phone',
      sortable: false,
      render: (value, row) => (
        <span className="text-sm text-gray-600">
          {row.credential?.phoneNumber || row.phoneNumber || 'N/A'}
        </span>
      ),
    },
    {
      key: 'credential',
      label: 'Status',
      sortable: false,
      render: (value, row) => {
        const status = row.credential?.status || row.status || 'active';
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
    // {
    //   key: 'createdAt',
    //   label: 'Created Date',
    //   sortable: true,
    //   render: (value) => (
    //     <span className="text-sm text-gray-600">
    //       {value ? new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
    //     </span>
    //   ),
    // },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Admins</h1>
          <p className="text-gray-600 mt-2">View and manage all admin organizations</p>
        </div>
        <Button onClick={handleAddAdmin} icon={UserPlus} variant="primary">
          Add Organization
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card padding="default" hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Admins</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{admins.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
        <Card padding="default" hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Active</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {admins.filter(a => (a.credential?.status || a.status) === 'active').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
        <Card padding="default" hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Inactive</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {admins.filter(a => (a.credential?.status || a.status) === 'inactive').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      <Table
        columns={columns}
        data={admins}
        actions={{
          view: { label: 'View Details', onClick: handleViewAdmin, variant: 'primary' },
          edit: { label: 'Edit Admin', onClick: handleEditAdmin, variant: 'default' },
          delete: { label: 'Delete Admin', onClick: handleDeleteAdmin, variant: 'danger' },
        }}
        striped
        hoverable
      />

      {/* Side Drawer for Add/Edit/View Admin */}
      <SideDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        title={isViewMode ? 'View Organizations Details' : isEditMode ? 'Edit Organization' : 'Add New Organization'}
        size="xl"
      >
        <AdminForm
          initialValues={selectedAdmin || undefined}
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
          setAdminToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Admin"
        message={`Are you sure you want to delete "${adminToDelete?.organisationName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};

export default ManageAdmins;
