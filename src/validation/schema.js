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

// profile 
export const basicInfoSchema = yup.object({
  first_name: yup
    .string()
    .min(2, 'First name must be at least 2 characters')
    .required('First name is required')
    .trim(),
  last_name: yup
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .required('Last name is required')
    .trim(),
  email: yup
    .string()
    .email('Invalid email address')
    .required('Email is required')
    .lowercase()
    .trim(),
  phone_number: yup
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .required('Phone number is required')
    .trim(),
});

export const personalDetailsSchema = yup.object({
  date_of_birth: yup.date().nullable(),
  gender: yup.string().oneOf(['Male', 'Female', 'Others']).nullable(),
});

export const addressSchema = yup.object({
  street: yup.string().trim(),
  city: yup.string().required('City is required').trim(),
  state: yup.string().required('State is required').trim(),
  country: yup.string().required('Country is required').trim(),
  postal_code: yup.string().trim(),
});

export const preferencesSchema = yup.object({
  is_marketing_subscribed: yup
    .boolean()
    .required('Marketing preference is required'),
})

export const productValidationSchema = yup.object({
  // Category & Classification
  category_id: yup
    .number()
    .nullable()
    .transform((value, originalValue) =>
      originalValue === '' || originalValue === null ? null : value
    )
    .label('Category'),

  subcategory_id: yup
    .number()
    .nullable()
    .transform((value, originalValue) =>
      originalValue === '' || originalValue === null ? null : value
    )
    .label('Subcategory'),

  // Basic Information
  title: yup
    .string()
    .required('Product title is required')
    .max(255, 'Title must not exceed 255 characters')
    .trim()
    .label('Title'),

  sub_title: yup
    .string()
    .nullable()
    .max(255, 'Subtitle must not exceed 255 characters')
    .trim()
    .label('Subtitle'),

  keywords: yup
    .string()
    .nullable()
    .max(255, 'Keywords must not exceed 255 characters')
    .trim()
    .label('Keywords'),

  // Detailed Information
  description: yup
    .string()
    .nullable()
    .max(5000, 'Description must not exceed 5000 characters')
    .trim()
    .label('Description'),

  ingredients: yup
    .string()
    .nullable()
    .max(3000, 'Ingredients must not exceed 3000 characters')
    .trim()
    .label('Ingredients'),

  // Product Attributes
  is_featured: yup
    .boolean()
    .default(false)
    .label('Featured'),

  brands: yup
    .string()
    .nullable()
    .max(255, 'Brand must not exceed 255 characters')
    .trim()
    .label('Brand'),

  // Images
  image: yup
    .string()
    .nullable()
    .label('Main Image'),

  images: yup
    .array()
    .nullable()
    .of(yup.string())
    .label('Additional Images'),

  // Status
  status: yup
    .string()
    .nullable()
    .oneOf(
      ['in_stock', 'out_of_stock', 'pending', 'active', 'inactive'],
      'Invalid status selected'
    )
    .label('Status'),

  // Packaging & Pricing
  pack_size: yup
    .string()
    .nullable()
    .max(255, 'Pack size must not exceed 255 characters')
    .trim()
    .label('Pack Size'),

  price: yup
    .number()
    .required('Price is required')
    .min(0, 'Price must be greater than or equal to 0')
    .typeError('Price must be a valid number')
    .label('Price'),

  discount_price: yup
    .number()
    .nullable()
    .transform((value, originalValue) =>
      originalValue === '' || originalValue === null ? null : value
    )
    .min(0, 'Discount price must be greater than or equal to 0')
    .test(
      'is-less-than-price',
      'Discount price must be less than the regular price',
      function (value) {
        const { price } = this.parent;
        if (!value || !price) return true;
        return value < price;
      }
    )
    .typeError('Discount price must be a valid number')
    .label('Discount Price'),

  // Inventory
  stock: yup
    .number()
    .required('Stock quantity is required')
    .integer('Stock must be a whole number')
    .min(0, 'Stock must be greater than or equal to 0')
    .typeError('Stock must be a valid number')
    .label('Stock'),
});


export const reviewSchema = yup.object().shape({
  rating: yup
    .number()
    .min(1, 'Please select a rating')
    .max(5, 'Rating cannot exceed 5')
    .required('Rating is required'),
  comment: yup
    .string()
    .min(10, 'Review must be at least 10 characters')
    .max(1000, 'Review cannot exceed 1000 characters')
    .required('Review is required'),
});

export const defaultProductValues = {
  category_id: '',
  subcategory_id: '',
  title: '',
  sub_title: '',
  keywords: '',
  description: '',
  ingredients: '',
  is_featured: false,
  brands: '',
  image: '',
  images: [],
  status: 'in_stock',
  pack_size: '',
  price: '',
  discount_price: '',
  stock: '',
};