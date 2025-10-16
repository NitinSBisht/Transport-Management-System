import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Truck, MapPin, Phone, UserCog } from 'lucide-react';
import { Formik, Form, Field } from 'formik';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { Button, FormikInput, FormikSelect, FormError, Loader } from '../../components/Common';
import { ROUTES, ROLES } from '../../utils/constants';
import { getUser } from '../../utils/helpers';
import { loginValidationSchema } from '../../utils/validationSchemas';
import LoginBackground from '../../assets/images/LoginBackground.webp';

interface LoginFormValues {
  email: string;
  password: string;
  role: string;
  rememberMe: boolean;
}

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const initialValues: LoginFormValues = {
    email: '',
    password: '',
    role: '',
    rememberMe: false,
  };

  const roleOptions = [
    { value: '3', label: 'Dispatcher' },
    { value: '4', label: 'Driver' },
    { value: '2', label: 'Admin' },
    { value: '1', label: 'Super Admin' },
    { value: '5', label: 'User' },
  ];

  const handleSubmit = async (values: LoginFormValues, { setSubmitting, setFieldError }: any) => {
    try {
      const result = await login(values.email, values.password, parseInt(values.role), values.rememberMe);
      
      if (result.success) {
        // Show success message from backend if available
        if (result.message) {
          toast.success(result.message);
        }
        
        // Get user data from result or localStorage
        const userData = result.data?.user || getUser();
        const userRole = userData?.role;
        const isPasswordChanged = userData?.isPasswordChanged;
        
        // Small delay to ensure state is updated
        setTimeout(() => {
          setSubmitting(false);
          
          // Check if password needs to be changed first
          if (isPasswordChanged === false) {
            navigate(ROUTES.CHANGE_PASSWORD, { replace: true });
            return;
          }
          
          // Navigate based on role
          if (userRole === ROLES.SUPER_ADMIN) {
            navigate(ROUTES.SUPER_ADMIN.DASHBOARD, { replace: true });
          } else if (userRole === ROLES.ADMIN) {
            navigate(ROUTES.ADMIN.DASHBOARD, { replace: true });
          } else if (userRole === ROLES.DISPATCHER) {
            navigate(ROUTES.DISPATCHER.DASHBOARD, { replace: true });
          } else {
            navigate(ROUTES.DASHBOARD, { replace: true });
          }
        }, 100);
      } else {
        // Show error from backend
        if (result.error) {
          setFieldError('email', result.error);
          toast.error(result.error);
        }
        setSubmitting(false);
      }
    } catch (err: any) {
      // Show error from backend if available
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

      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10">
        <div className="flex flex-col justify-center items-center text-white px-8 py-6 w-full">
          <div className="mb-6 transform hover:scale-110 transition-transform duration-300">
            <Truck className="w-20 h-20 drop-shadow-2xl" />
          </div>
          <h1 className="text-4xl xl:text-5xl font-bold mb-3 drop-shadow-lg text-center">Final 4 Logistics®</h1>
          <p className="text-lg xl:text-xl text-center max-w-md opacity-90 drop-shadow-md">
            Streamline your logistics operations with our comprehensive TMS solution
          </p>
          
          {/* Contact Information */}
          <div className="mt-8 space-y-3 text-center">
            <div className="backdrop-blur-md bg-white/10 p-4 rounded-xl border border-white/20">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <MapPin className="w-5 h-5" />
                <h3 className="font-semibold text-lg">Address</h3>
              </div>
              <p className="text-sm opacity-90">611 Commerce Street, Suite 2611</p>
              <p className="text-sm opacity-90">Nashville, TN, 37203</p>
            </div>
            
            <div className="backdrop-blur-md bg-white/10 p-4 rounded-xl border border-white/20">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <Phone className="w-5 h-5" />
                <h3 className="font-semibold text-lg">Contact</h3>
              </div>
              <div className="flex items-center justify-center gap-4">
                <a href="tel:6293454771" className="text-sm opacity-90 hover:opacity-100 transition-opacity">
                  (629) 345-4771
                </a>
                <span className="text-white/40">|</span>
                <a href="mailto:info@gofinal4.com" className="text-sm opacity-90 hover:opacity-100 transition-opacity">
                  info@gofinal4.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10 overflow-y-auto">
        <div className="max-w-md w-full my-auto">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full mb-3 lg:hidden shadow-2xl">
              <Truck className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-2xl">Welcome Back</h1>
            <p className="text-gray-300 mt-1 text-sm drop-shadow-lg">Sign in to your account</p>
          </div>

          <div className="bg-gradient-to-br from-black/40 via-black/30 to-black/40 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 border border-white/10 transform hover:scale-[1.01] transition-all duration-300">
            <Formik
              initialValues={initialValues}
              validationSchema={loginValidationSchema}
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

                  <FormikInput
                    name="password"
                    type="password"
                    label="Password"
                    placeholder="••••••••"
                    icon={Lock}
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

                  <div className="flex items-center justify-between">
                    <label className="flex items-center cursor-pointer group">
                      <Field
                        type="checkbox"
                        name="rememberMe"
                        className="w-4 h-4 rounded border-white/20 bg-white/10 text-primary-500 focus:ring-2 focus:ring-primary-400 focus:ring-offset-0 transition-all cursor-pointer"
                      />
                      <span className="ml-2 text-sm text-gray-300 group-hover:text-white transition-colors">
                        Remember me
                      </span>
                    </label>
                    <Link to="/forgot-password" className="text-sm text-primary-400 hover:text-primary-300 font-medium transition-colors hover:underline">
                      Forgot password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    fullWidth
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <Loader size="sm" /> : 'Sign In'}
                  </Button>
                </Form>
              )}
            </Formik>

          <div className="mt-5">
            <p className="text-center text-sm text-gray-300">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium transition-colors hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Login;
