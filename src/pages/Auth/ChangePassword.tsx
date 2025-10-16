import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowLeft } from 'lucide-react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { Button, FormikInput, FormError, Loader, Card } from '../../components/Common';
import { changePassword } from '../../services/authService';

interface ChangePasswordFormValues {
  oldPassword: string;
  password: string;
  confirmPassword: string;
}

const changePasswordValidationSchema = Yup.object({
  oldPassword: Yup.string()
    .required('Current password is required'),
  password: Yup.string()
    .required('New password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[@$!%*?&#]/, 'Password must contain at least one special character')
    .notOneOf([Yup.ref('oldPassword')], 'New password must be different from current password'),
  confirmPassword: Yup.string()
    .required('Please confirm your new password')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
});

const ChangePassword: React.FC = () => {
  const navigate = useNavigate();

  const initialValues: ChangePasswordFormValues = {
    oldPassword: '',
    password: '',
    confirmPassword: '',
  };

  const handleSubmit = async (values: ChangePasswordFormValues, { setSubmitting, setFieldError, resetForm }: any) => {
    try {
      const result = await changePassword(values.oldPassword, values.password, values.confirmPassword);
      
      if (result.success) {
        if (result.message) {
          toast.success(result.message);
        }
        resetForm();
        setTimeout(() => {
          navigate(-1);
        }, 2000);
      } else {
        if (result.error) {
          setFieldError('oldPassword', result.error);
          toast.error(result.error);
        }
        setSubmitting(false);
      }
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || err?.message;
      if (errorMsg) {
        setFieldError('oldPassword', errorMsg);
        toast.error(errorMsg);
      }
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">Change Password</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Update your account password</p>
      </div>

      <Card>
        <Formik
          initialValues={initialValues}
          validationSchema={changePasswordValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors }) => (
            <Form className="space-y-5">
              {errors.oldPassword && typeof errors.oldPassword === 'string' && !errors.oldPassword.includes('required') && (
                <FormError error={errors.oldPassword} />
              )}

              <FormikInput
                name="oldPassword"
                type="password"
                label="Current Password"
                placeholder="Enter your current password"
                icon={Lock}
                required
              />

              <FormikInput
                name="password"
                type="password"
                label="New Password"
                placeholder="Enter your new password"
                icon={Lock}
                required
              />

              <FormikInput
                name="confirmPassword"
                type="password"
                label="Confirm New Password"
                placeholder="Confirm your new password"
                icon={Lock}
                required
              />

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin/dashboard')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Loader size="sm" /> : 'Change Password'}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Card>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Password Requirements:</h3>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• At least 8 characters long</li>
          <li>• Contains at least one uppercase letter</li>
          <li>• Contains at least one lowercase letter</li>
          <li>• Contains at least one number</li>
          <li>• Contains at least one special character (@$!%*?&#)</li>
        </ul>
      </div>
    </div>
  );
};

export default ChangePassword;
