import React, { useState, useEffect } from 'react';
import { User as UserIcon, Building2 } from 'lucide-react';
import { Table, TableColumn, Card, Loader, ToggleSwitch } from '../../components/Common';
import { useGetAdminsQuery } from '../../api/adminsApi';
import { 
  useGetDispatchersQuery, 
  useToggleDispatcherStatusMutation,
  DispatcherData 
} from '../../api/dispatchersApi';
import toast from 'react-hot-toast';

const ManageDispatchers: React.FC = () => {
  const [selectedOrganization, setSelectedOrganization] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit] = useState(10);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);

  // Fetch organizations (admins)
  const { data: adminsResponse, isLoading: isLoadingOrgs } = useGetAdminsQuery({
    page: 1,
    limit: 1000, // Get all organizations
  });

  // Fetch dispatchers based on selected organization
  const { data: dispatchersResponse, isLoading: isLoadingDispatchers, error, refetch } = useGetDispatchersQuery({
    admin: selectedOrganization,
    search: searchQuery,
    page: currentPage,
    limit: pageLimit,
  });

  const [toggleDispatcherStatus] = useToggleDispatcherStatusMutation();

  // Ensure dispatchers and admins are always arrays
  const dispatchers = dispatchersResponse?.data?.dispatchers || [];
  const pagination = dispatchersResponse?.data?.pagination;
  const organizations = adminsResponse?.data?.admins || [];

  // Show error toast if API fails (only for actual errors, not empty data)
  useEffect(() => {
    if (error && !dispatchersResponse) {
      toast.error('Failed to load dispatchers. Please try again.');
      console.error('Dispatcher API Error:', error);
    }
  }, [error, dispatchersResponse]);

  // Set first organization as default when organizations load
  useEffect(() => {
    if (organizations.length > 0 && !selectedOrganization) {
      setSelectedOrganization(String(organizations[0].id));
    }
  }, [organizations, selectedOrganization]);

  const handleToggleStatus = async (dispatcher: DispatcherData) => {
    const currentStatus = dispatcher.credential?.status || 'active';
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    setIsTogglingStatus(true);
    try {
      await toggleDispatcherStatus({ 
        id: String(dispatcher.id), 
        status: newStatus 
      }).unwrap();
      
      toast.success(`Dispatcher ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update dispatcher status');
    } finally {
      setIsTogglingStatus(false);
    }
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
      key: 'dispatcherCode',
      label: 'Dispatcher Code',
      sortable: false,
      render: (value) => (
        <span className="text-sm font-medium text-gray-900">
          {value || 'N/A'}
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

  if (isLoadingOrgs) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader size="lg" text="Loading organizations..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* Loading Overlay */}
      {isTogglingStatus && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Loader size="lg" text="Updating status..." />
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Dispatchers</h1>
          <p className="text-gray-600 mt-2">View and manage dispatchers by organization</p>
        </div>
      </div>

      {/* Filters */}
      <Card padding="sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Organization Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Organization
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Building2 className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={selectedOrganization}
                onChange={(e) => {
                  setSelectedOrganization(e.target.value);
                  setCurrentPage(1);
                }}
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900"
              >
                <option value="">All Organizations</option>
                {organizations.map((org) => (
                  <option key={org.id} value={String(org.id)}>
                    {org.organisationName}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Dispatchers
            </label>
            <input
              type="text"
              placeholder="Search by name or email..."
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
      <Card padding="none">
        {isLoadingDispatchers ? (
          <div className="flex items-center justify-center py-12">
            <Loader size="lg" text="Loading dispatchers..." />
          </div>
        ) : dispatchers.length === 0 ? (
          <div className="text-center py-12">
            <UserIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Dispatchers Found</h3>
            <p className="text-gray-600">
              {selectedOrganization 
                ? 'This organization has no dispatchers yet.' 
                : 'Select an organization to view its dispatchers.'}
            </p>
          </div>
        ) : (
          <Table
            columns={columns}
            data={dispatchers}
            striped
            hoverable
          />
        )}
      </Card>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {((currentPage - 1) * pageLimit) + 1} to {Math.min(currentPage * pageLimit, pagination.totalRecords)} of {pagination.totalRecords} dispatchers
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={!pagination.hasPreviousPage}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={!pagination.hasNextPage}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageDispatchers;
