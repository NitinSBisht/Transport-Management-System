import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { FormikInput, Button, ImageUpload, Loader } from '../Common';
import { 
  Building2, 
  FileText, 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  User,
  Loader2,
  Hash
} from 'lucide-react';

export interface AdminFormData {
  id?: number | string;
  organisationName: string;
  dotNumber: string;
  mcNumber: string;
  taxId: string;
  email: string;
  phoneNumber: string;
  website: string;
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
  ownerName: string;
  ownerEmail: string;
  ownerPhoneNumber: string;
  logo?: string | null; // Base64 string or URL
}

interface AdminFormProps {
  initialValues?: Partial<AdminFormData>;
  onSubmit: (values: AdminFormData) => Promise<void>;
  onCancel: () => void;
  isEdit?: boolean;
  isLoading?: boolean;
  isViewOnly?: boolean;
}

const validationSchema = Yup.object({
  organisationName: Yup.string().required('Organisation name is required'),
  dotNumber: Yup.string().required('DOT number is required'),
  mcNumber: Yup.string().required('MC number is required'),
  taxId: Yup.string()
    .required('Tax ID is required')
    .matches(/^\d{2}-\d{7}$/, 'Invalid Tax ID! Must be in the format XX-XXXXXXX'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phoneNumber: Yup.string().required('Phone number is required'),
  website: Yup.string().url('Invalid URL').required('Website is required'),
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
  ownerName: Yup.string().required('Owner name is required'),
  ownerEmail: Yup.string().email('Invalid email').required('Owner email is required'),
  ownerPhoneNumber: Yup.string().required('Owner phone number is required'),
  logo: Yup.mixed().nullable(),
});

const defaultValues: AdminFormData = {
  organisationName: '',
  dotNumber: '',
  mcNumber: '',
  taxId: '',
  email: '',
  phoneNumber: '',
  website: '',
  streetNumber: '',
  streetName: '',
  country: '',
  state: '',
  city: '',
  zipCode: '',
  address: '',
  latitude: '22.345',
  longitude: '22.345',
  placeId: 'ChIJ7aVxnOTHwoARxKIntFtakKo',
  ownerName: '',
  ownerEmail: '',
  ownerPhoneNumber: '',
  logo: null,
};

const AdminForm: React.FC<AdminFormProps> = ({
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
      {({ isSubmitting, values, setFieldValue, errors, touched }) => (
        <Form className="space-y-6">
          {/* Organisation Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Organisation Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormikInput
                name="organisationName"
                label="Organisation Name"
                placeholder="LogiFleet Solutions"
                icon={Building2}
                variant="light"
                required
                disabled={isViewOnly}
              />
              <FormikInput
                name="dotNumber"
                label="DOT Number"
                placeholder="12345678"
                icon={Hash}
                variant="light"
                required
                disabled={isViewOnly}
              />
              <FormikInput
                name="mcNumber"
                label="MC Number"
                placeholder="MC998877"
                icon={Hash}
                variant="light"
                required
                disabled={isViewOnly}
              />
              <FormikInput
                name="taxId"
                label="Tax ID"
                placeholder="12-3456789"
                icon={FileText}
                variant="light"
                required
                disabled={isViewOnly}
              />
            </div>
            
            {/* Logo Upload */}
            <div className="mt-4">
              <ImageUpload
                label="Organisation Logo"
                value={values.logo}
                onChange={(file, preview) => {
                  // Store base64 string (preview) instead of File object
                  setFieldValue('logo', preview);
                }}
                error={touched.logo && errors.logo ? String(errors.logo) : undefined}
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
                placeholder="organisation.info@yopmail.com"
                icon={Mail}
                variant="light"
                required
                disabled={isViewOnly || isEdit}
              />
              <FormikInput
                name="phoneNumber"
                label="Phone Number"
                placeholder="12345678900"
                icon={Phone}
                variant="light"
                required
                disabled={isViewOnly}
              />
              <div className="md:col-span-2">
                <FormikInput
                  name="website"
                  label="Website"
                  type="url"
                  placeholder="https://logifleet.com"
                  icon={Globe}
                  variant="light"
                  required
                  disabled={isViewOnly}
                />
              </div>
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
                placeholder="221B"
                icon={MapPin}
                variant="light"
                required
                disabled={isViewOnly}
              />
              <FormikInput
                name="streetName"
                label="Street Name"
                placeholder="Baker Street"
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
                  placeholder="221B Baker Street, Los Angeles, California, USA"
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
              {/* <FormikInput
                name="latitude"
                label="Latitude"
                placeholder="34.052235"
                icon={MapPin}
                variant="light"
                required
              />
              <FormikInput
                name="longitude"
                label="Longitude"
                placeholder="-118.243683"
                icon={MapPin}
                variant="light"
                required
              /> */}
              {/* <FormikInput
                name="placeId"
                label="Place ID"
                placeholder="ChIJ7aVxnOTHwoARxKIntFtakKo"
                icon={MapPin}
                variant="light"
                required
              /> */}
            {/* </div> */}
          {/* </div> } */}

          {/* Owner Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Owner Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormikInput
                name="ownerName"
                label="Owner Name"
                placeholder="John Doe"
                icon={User}
                variant="light"
                required
                disabled={isViewOnly}
              />
              <FormikInput
                name="ownerEmail"
                label="Owner Email"
                type="email"
                placeholder="john.doe@logifleet.com"
                icon={Mail}
                variant="light"
                required
                disabled={isViewOnly || isEdit}
              />
              <div className="md:col-span-2">
                <FormikInput
                  name="ownerPhoneNumber"
                  label="Owner Phone Number"
                  placeholder="19876543210"
                  icon={Phone}
                  variant="light"
                  required
                  disabled={isViewOnly}
                />
              </div>
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
                {isSubmitting || isLoading ? 'Saving...' : isEdit ? 'Update Admin' : 'Create Admin'}
              </Button>
            )}
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default AdminForm;
