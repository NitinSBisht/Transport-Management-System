import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { User, Mail, Phone, Building2, Calendar, Shield } from 'lucide-react';
import { Card, Loader, Badge } from '../../components/Common';
import { useGetSuperAdminProfileQuery } from '../../api/superAdminApi';
import { useGetAdminProfileQuery } from '../../api/adminsApi';
import toast from 'react-hot-toast';

const Profile: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const isSuperAdmin = user?.role === 'superadmin';

  // Fetch profile based on role
  const { 
    data: superAdminData, 
    isLoading: superAdminLoading, 
    error: superAdminError 
  } = useGetSuperAdminProfileQuery(undefined, {
    skip: !isSuperAdmin,
  });

  const { 
    data: adminData, 
    isLoading: adminLoading, 
    error: adminError 
  } = useGetAdminProfileQuery(undefined, {
    skip: isSuperAdmin,
  });

  const isLoading = isSuperAdmin ? superAdminLoading : adminLoading;

  // Show error toast only for the active query
  React.useEffect(() => {
    if (isSuperAdmin && superAdminError) {
      toast.error('Failed to load profile. Please try again.');
      console.error('Super Admin Profile API Error:', superAdminError);
    }
  }, [isSuperAdmin, superAdminError]);

  React.useEffect(() => {
    if (!isSuperAdmin && adminError) {
      toast.error('Failed to load profile. Please try again.');
      console.error('Admin Profile API Error:', adminError);
    }
  }, [isSuperAdmin, adminError]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader size="lg" />
      </div>
    );
  }

  // Super Admin Profile
  if (isSuperAdmin && superAdminData) {
    const profile = superAdminData.data;
    const fullName = `${profile.firstName} ${profile.lastName}`;
    
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">View your account information</p>
        </div>

        <Card padding="default">
          <div className="flex items-start space-x-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden">
              {profile.icon ? (
                <img src={profile.icon} alt={fullName} className="w-full h-full object-cover" />
              ) : (
                <Shield className="w-12 h-12 text-primary-600" />
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">{fullName}</h2>
                <Badge variant="primary">Super Admin</Badge>
                <Badge variant={profile.credential.status === 'active' ? 'success' : 'danger'}>
                  {profile.credential.status.toUpperCase()}
                </Badge>
              </div>
              
              <div className="space-y-3 mt-4">
                <div className="flex items-center space-x-3 text-gray-600">
                  <Mail className="w-5 h-5" />
                  <span>{profile.credential.email}</span>
                </div>
                
                <div className="flex items-center space-x-3 text-gray-600">
                  <Phone className="w-5 h-5" />
                  <span>{profile.credential.phoneNumber}</span>
                </div>

                {profile.createdAt && (
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Calendar className="w-5 h-5" />
                    <span>
                      Member since {new Date(profile.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Admin Profile
  if (!isSuperAdmin && adminData) {
    const profile = adminData.data;
    
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">View your account information</p>
        </div>

        {/* Organisation Card */}
        <Card padding="default">
          <div className="flex items-start space-x-6">
            {/* Logo */}
            <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden">
              {profile.logo ? (
                <img src={profile.logo} alt={profile.organisationName} className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-12 h-12 text-primary-600" />
              )}
            </div>

            {/* Organisation Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">{profile.organisationName}</h2>
                <Badge variant={profile.credential?.status === 'active' ? 'success' : 'danger'}>
                  {profile.credential?.status?.toUpperCase() || 'ACTIVE'}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Email</p>
                  <p className="text-gray-900">{profile.credential?.email || 'N/A'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 font-medium">Phone</p>
                  <p className="text-gray-900">{profile.credential?.phoneNumber || 'N/A'}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 font-medium">DOT Number</p>
                  <p className="text-gray-900">{profile.dotNumber}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 font-medium">MC Number</p>
                  <p className="text-gray-900">{profile.mcNumber}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 font-medium">Tax ID</p>
                  <p className="text-gray-900">{profile.taxId}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 font-medium">Website</p>
                  <a 
                    href={profile.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:underline"
                  >
                    {profile.website}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Owner Information */}
        <Card padding="default">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            Owner Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500 font-medium">Name</p>
              <p className="text-gray-900">{profile.ownerName}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 font-medium">Email</p>
              <p className="text-gray-900">{profile.ownerEmail}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 font-medium">Phone</p>
              <p className="text-gray-900">{profile.ownerPhoneNumber}</p>
            </div>
          </div>
        </Card>

        {/* Address Information */}
        {profile.address && (
          <Card padding="default">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Address Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 font-medium">Street</p>
                <p className="text-gray-900">
                  {profile.address.streetNumber} {profile.address.streetName}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 font-medium">City</p>
                <p className="text-gray-900">{profile.address.city}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 font-medium">State</p>
                <p className="text-gray-900">{profile.address.state}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 font-medium">Country</p>
                <p className="text-gray-900">{profile.address.country}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 font-medium">Zip Code</p>
                <p className="text-gray-900">{profile.address.zipCode}</p>
              </div>

              <div className="md:col-span-2">
                <p className="text-sm text-gray-500 font-medium">Full Address</p>
                <p className="text-gray-900">{profile.address.address}</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-600">No profile data available</p>
    </div>
  );
};

export default Profile;
