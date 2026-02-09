import * as yup from 'yup';

const phoneRegex = /^(\+234|0)[789]\d{9}$/;

export const RegisterSchema = yup.object({
  email: yup
    .string()
    .trim()
    .email('Please enter a valid email')
    .required('Email is required'),
  first_name: yup
    .string()
    .trim()
    .min(2, 'First name must be at least 2 characters')
    .required('First name is required'),
  last_name: yup
    .string()
    .trim()
    .min(2, 'Last name must be at least 2 characters')
    .required('Last name is required'),
  password: yup.string().required('Password is required'),
});

export const LoginSchema = yup.object({
  email: yup.string().trim().email().required('Email is required'),
  password: yup.string().trim().required('Password is required'),
});

export const ForgotPasswordSchema = yup.object({
  email: yup.string().trim().email().required('Email is required'),
});


export const ResetPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .required('Password is required'),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
});

export const CheckoutSchema = yup.object({
  first_name: yup
    .string()
    .trim()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters')
    .required('First name is required'),

  last_name: yup
    .string()
    .trim()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters')
    .required('Last name is required'),

  email: yup
    .string()
    .trim()
    .email('Please enter a valid email address')
    .required('Email is required'),

  phone_number: yup
    .string()
    .trim()
    .matches(phoneRegex, 'Please enter a valid Nigerian phone number (e.g., 08012345678)')
    .required('Phone number is required'),

  whatsapp_number: yup
    .string()
    .trim()
    .matches(phoneRegex, 'Please enter a valid WhatsApp number (e.g., 08012345678)')
    .nullable()
    .transform((value, originalValue) => {
      return originalValue === '' ? null : value;
    })
    .notRequired(),

  delivery_method: yup
    .string()
    .oneOf(['waybill', 'pickup'], 'Invalid delivery method')
    .required('Please select a delivery method'),

  address: yup
    .string()
    .trim()
    .when('delivery_method', {
      is: 'waybill',
      then: (schema) => schema
        .min(5, 'Address must be at least 5 characters')
        .required('Street address is required for home delivery'),
      otherwise: (schema) => schema.notRequired().nullable()
    }),

  country: yup
    .string()
    .trim()
    .when('delivery_method', {
      is: 'waybill',
      then: (schema) => schema
        .min(2, 'Country must be at least 2 characters')
        .max(50, 'Country must not exceed 50 characters')
        .required('Country is required for home delivery'),
      otherwise: (schema) => schema.notRequired().nullable()
    }),

  state: yup
    .string()
    .trim()
    .when('delivery_method', {
      is: 'waybill',
      then: (schema) => schema
        .min(2, 'State must be at least 2 characters')
        .max(50, 'State must not exceed 50 characters')
        .required('State is required for home delivery'),
      otherwise: (schema) => schema.notRequired().nullable()
    }),

  city: yup
    .string()
    .trim()
    .when('delivery_method', {
      is: 'waybill',
      then: (schema) => schema
        .min(2, 'City must be at least 2 characters')
        .max(50, 'City must not exceed 50 characters')
        .required('City is required for home delivery'),
      otherwise: (schema) => schema.notRequired().nullable()
    }),

  // Payment Method (Conditional validation based on delivery and shipping)
  payment_method: yup
    .string()
    .oneOf(['online', 'later'], 'Invalid payment method')
    .required('Please select a payment method')
    .test(
      'payment-method-validation',
      'Invalid payment method for selected delivery option',
      function (value) {
        const { delivery_method, city, state } = this.parent;

        if (delivery_method === 'pickup') {
          return true;
        }

        if (delivery_method === 'waybill') {
          if (!city || !state) {
            return true;
          }

          return true;
        }

        return true;
      }
    ),

  // Save Shipping Details
  save_delivery_details: yup
    .boolean()
    .default(false)
    .notRequired(),
}).test(
  'delivery-address-complete',
  'Please complete all delivery address fields',
  function (values) {
    const { delivery_method, address, city, state, country } = values;

    if (delivery_method === 'waybill') {
      if (!address || !city || !state || !country) {
        return this.createError({
          path: 'delivery_method',
          message: 'Please complete your delivery address before proceeding'
        });
      }
    }
    return true;
  }
);

export const ContactSchema = yup.object({
  name: yup.string().trim().required('Name is required'),
  email: yup.string().trim().email('Invalid email address').required('Email is required'),
  phone: yup.string().optional(),
  subject: yup.string().optional(),
  message: yup.string().trim().required('Message is required'),
});

export const VendorRequestSchema = yup.object({
  // Personal Information
  first_name: yup
    .string()
    .trim()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters')
    .required('First name is required'),

  last_name: yup
    .string()
    .trim()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters')
    .required('Last name is required'),

  email: yup
    .string()
    .trim()
    .email('Please enter a valid email address')
    .required('Email is required'),

  phone_number: yup
    .string()
    .trim()
    // .matches(phoneRegex, 'Please enter a valid Nigerian phone number (e.g., 08012345678)')
    .required('Phone number is required'),

  // Company Information
  company_name: yup
    .string()
    .trim()
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must not exceed 100 characters')
    .required('Company name is required'),

  company_email: yup
    .string()
    .trim()
    .email('Please enter a valid company email address')
    .required('Company email is required'),

  company_phone: yup
    .string()
    .trim()
    // .matches(phoneRegex, 'Please enter a valid company phone number (e.g., 08012345678)')
    .required('Company phone number is required'),

  company_address: yup
    .string()
    .trim()
    .min(10, 'Company address must be at least 10 characters')
    .max(500, 'Company address must not exceed 500 characters')
    .required('Company address is required'),

  company_website: yup
    .string()
    .trim()
    .url('Please enter a valid website URL (e.g., https://example.com)')
    .nullable()
    .transform((value, originalValue) => {
      return originalValue === '' ? null : value;
    })
    .notRequired(),

  // Terms Agreement
  terms_accepted: yup
    .boolean()
    .oneOf([true], 'You must accept the vendor terms and conditions to continue')
    .required('You must accept the vendor terms and conditions'),
});