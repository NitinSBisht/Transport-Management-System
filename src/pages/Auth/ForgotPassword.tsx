import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, UserCog, Truck } from 'lucide-react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { Button, FormikInput, FormikSelect, FormError, Loader } from '../../components/Common';
import { forgotPassword } from '../../services/authService';
import LoginBackground from '../../assets/images/LoginBackground.webp';

interface ForgotPasswordFormValues {
  email: string;
  role: string;
}

const forgotPasswordValidationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  role: Yup.string()
    .required('Role is required'),
});

const ForgotPassword: React.FC = () => {
  const initialValues: ForgotPasswordFormValues = {
    email: '',
    role: '',
  };

  const roleOptions = [
    { value: '3', label: 'Dispatcher' },
    { value: '4', label: 'Driver' },
    { value: '2', label: 'Admin' },
    { value: '1', label: 'Super Admin' },
    { value: '5', label: 'User' },
  ];

  const handleSubmit = async (values: ForgotPasswordFormValues, { setSubmitting, setFieldError }: any) => {
    try {
      const result = await forgotPassword(values.email, parseInt(values.role));
      
      if (result.success) {
        if (result.message) {
          toast.success(result.message);
        }
        setSubmitting(false);
      } else {
        if (result.error) {
          setFieldError('email', result.error);
          toast.error(result.error);
        }
        setSubmitting(false);
      }
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || err?.message;
      if (errorMsg) {
        setFieldError('email', errorMsg);
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
            <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-2xl">Forgot Password</h1>
            <p className="text-gray-300 mt-1 text-sm drop-shadow-lg">Enter your email to reset your password</p>
          </div>

          <div className="bg-gradient-to-br from-black/40 via-black/30 to-black/40 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 border border-white/10">
            <Formik
              initialValues={initialValues}
              validationSchema={forgotPasswordValidationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, errors }) => (
                <Form className="space-y-5">
                  {errors.email && typeof errors.email === 'string' && !errors.email.includes('required') && !errors.email.includes('Invalid') && (
                    <FormError error={errors.email} />
                  )}

                  <FormikInput
                    name="email"
                    type="email"
                    label="Email Address"
                    placeholder="you@example.com"
                    icon={Mail}
                    required
                  />

                  <FormikSelect
                    name="role"
                    label="Role"
                    placeholder="Select your role"
                    icon={UserCog}
                    options={roleOptions}
                    required
                  />

                  <Button
                    type="submit"
                    fullWidth
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <Loader size="sm" /> : 'Send Reset Link'}
                  </Button>

                  <div className="text-center">
                    <Link 
                      to="/login" 
                      className="inline-flex items-center text-sm text-primary-400 hover:text-primary-300 font-medium transition-colors hover:underline"
                    >
                      <ArrowLeft className="w-4 h-4 mr-1" />
                      Back to Login
                    </Link>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
