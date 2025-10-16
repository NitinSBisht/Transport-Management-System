import * as Yup from 'yup';

// Login validation schema
export const loginValidationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  role: Yup.string()
    .required('Role is required'),
  rememberMe: Yup.boolean(),
});

// Register validation schema
export const registerValidationSchema = Yup.object({
  name: Yup.string()
    .required('Full name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
  role: Yup.string()
    .required('Role is required')
    .oneOf(['dispatcher', 'admin'], 'Invalid role selected'),
});
