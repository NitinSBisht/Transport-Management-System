import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { FormikInput, Button, ImageUpload, Loader, FormikSelect } from '../Common';
import { User, Mail, Phone, MapPin, FileText, Calendar, Clock, Loader2 } from 'lucide-react';

export interface DispatcherFormData {
  id?: string | number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  streetNumber: string;
  streetName: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  address: string;
  latitude: string;
  longitude: string;
  placeId: string;
  dispatcherLicenseNumber: string;
  dispatcherCode: string;
  shiftTiming: 'day' | 'night' | 'flexible';
  shiftStartTime: string;
  shiftEndTime: string;
  hireDate: string;
  terminationDate?: string;
  dob: string;
  icon?: string | null;
}

interface DispatcherFormProps {
  initialValues?: Partial<DispatcherFormData>;
  onSubmit: (values: DispatcherFormData) => Promise<void>;
  onCancel: () => void;
  isEdit?: boolean;
  isLoading?: boolean;
  isViewOnly?: boolean;
}

const validationSchema = Yup.object({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phoneNumber: Yup.string().required('Phone number is required'),
  streetNumber: Yup.string().required('Street number is required'),
  streetName: Yup.string().required('Street name is required'),
  country: Yup.string().required('Country is required'),
  state: Yup.string().required('State is required'),
  city: Yup.string().required('City is required'),
  zipCode: Yup.string().required('Zip code is required'),
  address: Yup.string().required('Address is required'),
  latitude: Yup.string().required('Latitude is required'),
  longitude: Yup.string().required('Longitude is required'),
  placeId: Yup.string().required('Place ID is required'),
  dispatcherLicenseNumber: Yup.string().required('Dispatcher license number is required'),
  dispatcherCode: Yup.string().required('Dispatcher code is required'),
  shiftTiming: Yup.string().oneOf(['day', 'night', 'rotational']).required('Shift timing is required'),
  shiftStartTime: Yup.string().required('Shift start time is required'),
  shiftEndTime: Yup.string().required('Shift end time is required'),
  hireDate: Yup.string().required('Hire date is required'),
  dob: Yup.string().required('Date of birth is required'),
});

const defaultValues: DispatcherFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  streetNumber: '',
  streetName: '',
  country: '',
  state: '',
  city: '',
  zipCode: '',
  address: '',
  latitude: '22.5726',
  longitude: '88.3639',
  placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
  dispatcherLicenseNumber: '',
  dispatcherCode: '',
  shiftTiming: 'day',
  shiftStartTime: '',
  shiftEndTime: '',
  hireDate: '',
  terminationDate: '',
  dob: '',
  icon: null,
};

const DispatcherForm: React.FC<DispatcherFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  isEdit = false,
  isLoading = false,
  isViewOnly = false,
}) => {
  // Show loader when form is loading (e.g., fetching initial data)
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <Formik
      initialValues={{ ...defaultValues, ...initialValues }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ values, errors, touched, isSubmitting, setFieldValue }) => (
        <Form className="space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormikInput
                name="firstName"
                label="First Name"
                placeholder="John"
                icon={User}
                variant="light"
                required
                disabled={isViewOnly}
              />
              <FormikInput
                name="lastName"
                label="Last Name"
                placeholder="Doe"
                icon={User}
                variant="light"
                required
                disabled={isViewOnly}
              />
              <FormikInput
                name="dob"
                label="Date of Birth"
                type="date"
                icon={Calendar}
                variant="light"
                required
                disabled={isViewOnly}
              />
            </div>
            
            {/* Profile Icon Upload */}
            <div className="mt-4">
              <ImageUpload
                label="Profile Picture"
                value={values.icon}
                onChange={(file, preview) => {
                  setFieldValue('icon', preview);
                }}
                error={touched.icon && errors.icon ? String(errors.icon) : undefined}
                disabled={isSubmitting || isLoading || isViewOnly}
                variant="light"
                maxSize={5}
                acceptedFormats={['image/jpeg', 'image/jpg', 'image/png']}
              />
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormikInput
                name="email"
                label="Email"
                type="email"
                placeholder="john.doe@example.com"
                icon={Mail}
                variant="light"
                required
                disabled={isViewOnly || isEdit}
              />
              <FormikInput
                name="phoneNumber"
                label="Phone Number"
                placeholder="1234567890"
                icon={Phone}
                variant="light"
                required
                disabled={isViewOnly}
              />
            </div>
          </div>

          {/* Address Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Address Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormikInput
                name="streetNumber"
                label="Street Number"
                placeholder="123"
                icon={MapPin}
                variant="light"
                required
                disabled={isViewOnly}
              />
              <FormikInput
                name="streetName"
                label="Street Name"
                placeholder="Main Street"
                icon={MapPin}
                variant="light"
                required
                disabled={isViewOnly}
              />
              <FormikInput
                name="city"
                label="City"
                placeholder="Los Angeles"
                icon={MapPin}
                variant="light"
                required
                disabled={isViewOnly}
              />
              <FormikInput
                name="state"
                label="State"
                placeholder="California"
                icon={MapPin}
                variant="light"
                required
                disabled={isViewOnly}
              />
              <FormikInput
                name="country"
                label="Country"
                placeholder="USA"
                icon={MapPin}
                variant="light"
                required
                disabled={isViewOnly}
              />
              <FormikInput
                name="zipCode"
                label="Zip Code"
                placeholder="90001"
                icon={MapPin}
                variant="light"
                required
                disabled={isViewOnly}
              />
              <div className="md:col-span-2">
                <FormikInput
                  name="address"
                  label="Full Address"
                  placeholder="123 Main Street, Los Angeles"
                  icon={MapPin}
                  variant="light"
                  required
                  disabled={isViewOnly}
                />
              </div>
            </div>
          </div>

          {/* Location Coordinates */}
          {/* <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Location Coordinates
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormikInput
                name="latitude"
                label="Latitude"
                placeholder="34.0522"
                icon={MapPin}
                variant="light"
                required
                disabled={isViewOnly}
              />
              <FormikInput
                name="longitude"
                label="Longitude"
                placeholder="-118.2437"
                icon={MapPin}
                variant="light"
                required
                disabled={isViewOnly}
              />
              <FormikInput
                name="placeId"
                label="Place ID"
                placeholder="ChIJABCDEFG123456789"
                icon={MapPin}
                variant="light"
                required
                disabled={isViewOnly}
              />
            </div>
          </div> */}

          {/* Dispatcher Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Dispatcher Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormikInput
                name="dispatcherLicenseNumber"
                label="Dispatcher License Number"
                placeholder="DL123456"
                icon={FileText}
                variant="light"
                required
                disabled={isViewOnly}
              />
              <FormikInput
                name="dispatcherCode"
                label="Dispatcher Code"
                placeholder="DISP001"
                icon={FileText}
                variant="light"
                required
                disabled={isViewOnly}
              />
            </div>
          </div>

          {/* Shift Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Shift Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormikSelect
                name="shiftTiming"
                label="Shift Timing"
                options={[
                  { value: 'day', label: 'Day Shift' },
                  { value: 'night', label: 'Night Shift' },
                  { value: 'rotational', label: 'Flexible' },
                ]}
                icon={Clock}
                variant="light"
                required
                disabled={isViewOnly}
              />
              <FormikInput
                name="shiftStartTime"
                label="Shift Start Time"
                type="time"
                icon={Clock}
                variant="light"
                required
                disabled={isViewOnly}
              />
              <FormikInput
                name="shiftEndTime"
                label="Shift End Time"
                type="time"
                icon={Clock}
                variant="light"
                required
                disabled={isViewOnly}
              />
            </div>
          </div>

          {/* Employment Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Employment Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormikInput
                name="hireDate"
                label="Hire Date"
                type="date"
                icon={Calendar}
                variant="light"
                required
                disabled={isViewOnly}
              />
              <FormikInput
                name="terminationDate"
                label="Termination Date (Optional)"
                type="date"
                icon={Calendar}
                variant="light"
                disabled={isViewOnly}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              disabled={isSubmitting || isLoading}
            >
              {isViewOnly ? 'Close' : 'Cancel'}
            </Button>
            {!isViewOnly && (
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting || isLoading}
                icon={isSubmitting || isLoading ? Loader2 : undefined}
              >
                {isSubmitting || isLoading ? 'Saving...' : isEdit ? 'Update Dispatcher' : 'Create Dispatcher'}
              </Button>
            )}
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default DispatcherForm;
