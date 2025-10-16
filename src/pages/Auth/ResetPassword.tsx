import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Truck } from 'lucide-react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { Button, FormikInput, FormError, Loader } from '../../components/Common';
import { resetPassword } from '../../services/authService';
import LoginBackground from '../../assets/images/LoginBackground.webp';

interface ResetPasswordFormValues {
  password: string;
  confirmPassword: string;
}

const resetPasswordValidationSchema = Yup.object({
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[@$!%*?&#]/, 'Password must contain at least one special character'),
  confirmPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
});

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const initialValues: ResetPasswordFormValues = {
    password: '',
    confirmPassword: '',
  };

  const handleSubmit = async (values: ResetPasswordFormValues, { setSubmitting, setFieldError }: any) => {
    try {
      const result = await resetPassword(values.password, values.confirmPassword, token || undefined);
      
      if (result.success) {
        if (result.message) {
          toast.success(result.message);
        }
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        if (result.error) {
          setFieldError('password', result.error);
          toast.error(result.error);
        }
        setSubmitting(false);
      }
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || err?.message;
      if (errorMsg) {
        setFieldError('password', errorMsg);
        toast.error(errorMsg);
      }
      setSubmitting(false);
    }
  };

  return (
    <div className="h-screen flex relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${LoginBackground})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/75 backdrop-blur-[2px]"></div>
      </div>

      {/* Content */}
      <div className="w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10 overflow-y-auto">
        <div className="max-w-md w-full my-auto">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full mb-3 shadow-2xl">
              <Truck className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-2xl">Reset Password</h1>
            <p className="text-gray-300 mt-1 text-sm drop-shadow-lg">Enter your new password</p>
          </div>

          <div className="bg-gradient-to-br from-black/40 via-black/30 to-black/40 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 border border-white/10">
            <Formik
              initialValues={initialValues}
              validationSchema={resetPasswordValidationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, errors }) => (
                <Form className="space-y-5">
                  {errors.password && typeof errors.password === 'string' && !errors.password.includes('required') && (
                    <FormError error={errors.password} />
                  )}

                  <FormikInput
                    name="password"
                    type="password"
                    label="New Password"
                    placeholder="••••••••"
                    icon={Lock}
                    required
                  />

                  <FormikInput
                    name="confirmPassword"
                    type="password"
                    label="Confirm Password"
                    placeholder="••••••••"
                    icon={Lock}
                    required
                  />

                  <Button
                    type="submit"
                    fullWidth
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <Loader size="sm" /> : 'Reset Password'}
                  </Button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
