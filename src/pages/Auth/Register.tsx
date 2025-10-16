import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Truck, MapPin, Phone } from 'lucide-react';
import { Formik, Form } from 'formik';
import toast from 'react-hot-toast';
import { Button, FormikInput, FormikSelect, FormError, Loader } from '../../components/Common';
import { register as registerService } from '../../services/authService';
import { UserRole } from '../../types';
import { registerValidationSchema } from '../../utils/validationSchemas';
import LoginBackground from '../../assets/images/LoginBackground.webp';

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
}

const Register: React.FC = () => {
  const navigate = useNavigate();

  const initialValues: RegisterFormValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'dispatcher',
  };

  const handleSubmit = async (values: RegisterFormValues, { setSubmitting, setFieldError }: any) => {
    try {
      const result = await registerService({
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role
      });
      
      if (result.success) {
        toast.success('Registration successful! Please login.');
        navigate('/login');
      } else {
        const errorMsg = result.error || 'Registration failed';
        setFieldError('email', errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      const errorMsg = 'An unexpected error occurred';
      setFieldError('email', errorMsg);
      toast.error(errorMsg);
    } finally {
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
            Start managing your transport operations efficiently with our powerful platform
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

      {/* Right Side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10 overflow-y-auto">
        <div className="max-w-md w-full my-auto">
          {/* Logo and Title */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full mb-3 lg:hidden shadow-2xl">
              <Truck className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-2xl">Create Account</h1>
            <p className="text-gray-300 mt-1 text-sm drop-shadow-lg">Join our transport management system</p>
          </div>

          {/* Register Form */}
          <div className="bg-gradient-to-br from-black/40 via-black/30 to-black/40 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 border border-white/10 transform hover:scale-[1.01] transition-all duration-300">
            <Formik
              initialValues={initialValues}
              validationSchema={registerValidationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, errors }) => (
                <Form className="space-y-4">
                  {errors.email && typeof errors.email === 'string' && !errors.email.includes('required') && !errors.email.includes('Invalid') && (
                    <FormError error={errors.email} />
                  )}

                  <FormikInput
                    name="name"
                    type="text"
                    label="Full Name"
                    placeholder="John Doe"
                    icon={User}
                    required
                  />

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

                  <FormikInput
                    name="confirmPassword"
                    type="password"
                    label="Confirm Password"
                    placeholder="••••••••"
                    icon={Lock}
                    required
                  />

                  <div>
                    <FormikSelect
                      name="role"
                      label="Role"
                      options={[
                        { value: 'dispatcher', label: 'Dispatcher' },
                        { value: 'admin', label: 'Admin' },
                      ]}
                      required
                    />
                    <p className="mt-1 text-xs text-gray-400">
                      Note: SuperAdmin accounts can only be created by existing SuperAdmins
                    </p>
                  </div>

                  <Button
                    type="submit"
                    fullWidth
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <Loader size="sm" /> : 'Create Account'}
                  </Button>
                </Form>
              )}
            </Formik>

          <div className="mt-5">
            <p className="text-center text-sm text-gray-300">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors hover:underline">
                Sign in
              </Link>
            </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
