import {
  Shield, Truck, Headphones, CreditCard, Award, Leaf, TrendingUp, Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube, Heart, CheckCircle2, Zap, Users, Globe,
  Home,
  Info,
  Wrench,
  BookOpen,
  Mail,
  ShoppingBag,
  LayoutDashboard,
  UserCircle,
  LogIn,
  Clock,
  PackageSearch,
  Factory,
  Sprout, ShieldCheck, Store, User,
} from 'lucide-react';

export const features = [
  {
    icon: Shield,
    title: "100% Genuine Products",
    description: "Every product is agro-certified and sourced directly from trusted manufacturers. Your farm deserves only authentic quality.",
    badge: "Verified"
  },
  {
    icon: Truck,
    title: "Lightning-Fast Delivery",
    description: "Nationwide delivery within 24-48 hours. We understand timing is everything in agriculture—your supplies arrive when you need them.",
    badge: "Express"
  },
  {
    icon: Headphones,
    title: "24/7 Expert Support",
    description: "Round-the-clock access to certified agronomists. Get professional advice on product selection, application, and farm management anytime.",
    badge: "Live Help"
  },
  {
    icon: CreditCard,
    title: "Secure Payment Options",
    description: "Multiple payment methods with bank-level encryption. Pay with cards, transfers, or flexible installment plans for bulk orders.",
    badge: "Safe & Protected"
  },
  {
    icon: Award,
    title: "Best Price Guarantee",
    description: "Competitive wholesale pricing with no hidden fees. Found a better price? We'll match it and give you an extra 5% discount.",
    badge: "Best Deal"
  },
  {
    icon: TrendingUp,
    title: "Loyalty Rewards Program",
    description: "Earn points on every purchase and unlock exclusive discounts, early access to new products, and seasonal farmer benefits.",
    badge: "Rewards"
  },
  {
    icon: Leaf,
    title: "Eco-Friendly Practices",
    description: "Committed to sustainable agriculture. We promote organic options and environmentally responsible farming solutions.",
    badge: "Sustainable"
  },
  {
    icon: Users,
    title: "Farmer Community",
    description: "Join 10,000+ farmers in our network. Share experiences, learn best practices, and grow together with seasonal workshops.",
    badge: "10K+ Farmers"
  }
];

export const trustIndicators = [
  { icon: CheckCircle2, label: "ISO Certified", value: "9001:2015" },
  { icon: Globe, label: "Nationwide Coverage", value: "36 States" },
  { icon: Heart, label: "Customer Satisfaction", value: "98%" },
  { icon: Zap, label: "Average Delivery", value: "36 Hours" }
]
export const footerData = {
  company: {
    name: 'SuperoAgrobase',
    tagline: 'Key to Agricultural Productivity.',
    description: 'Supero Agrobase Limited is a fast-rising agribusiness enterprise that leverages in-depth research and development to provide farmers with high quality agricultural inputs, farm management, consultancy and agricultural laboratory services.',
    contact: {
      email: 'support@superoagrobase.com',
      phone: '+234 800 123 4567',
      address: 'Plot 45, Agric Plaza, Lagos-Ibadan Expressway, Lagos, Nigeria'
    }
  },

  links: {
    quickLinks: [
      { label: 'About Us', href: '/about' },
      { label: 'Our Story', href: '/story' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press & Media', href: '/press' },
      { label: 'Blog', href: '/blogs' },
      { label: 'Affiliate Program', href: '/affiliate' }
    ],
    customerService: [
      { label: 'Help Center', href: '/help' },
      { label: 'Track Order', href: '/track-order' },
      { label: 'Returns & Refunds', href: '/returns' },
      { label: 'Shipping Info', href: '/shipping' },
      { label: 'FAQs', href: '/faqs' },
      { label: 'Contact Support', href: '/contact' }
    ],
    shop: [
      { label: 'All Products', href: '/products' },
      { label: 'Seeds & Seedlings', href: '/products/seeds' },
      { label: 'Fertilizers', href: '/products/fertilizers' },
      { label: 'Farm Equipment', href: '/products/equipment' },
      { label: 'Organic Products', href: '/products/organic' },
      { label: 'Special Offers', href: '/offers' }
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'Accessibility', href: '/accessibility' },
      { label: 'Disclaimer', href: '/disclaimer' }
    ]
  },

  social: [
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com', color: '#1877F2' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com', color: '#1DA1F2' },
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com', color: '#E4405F' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com', color: '#0A66C2' },
    { name: 'YouTube', icon: Youtube, href: 'https://youtube.com', color: '#FF0000' }
  ],

  paymentMethods: [
    { name: 'Visa', logo: '💳' },
    { name: 'Mastercard', logo: '💳' },
    { name: 'Verve', logo: '💳' },
    { name: 'PayPal', logo: '🅿️' },
    { name: 'Bank Transfer', logo: '🏦' }
  ]
};

export const NavbarData = {
  topBar: {
    phone: '+2348157037737',
    email: 'contact@superoagrobase.com',
    address: '10, Jimoh Odu Street, Opp Benson B/S, Ikorodu Garage, Ikorodu, Lagos'
  },
  mainNav: [
    { id: 'home', label: 'Home', path: '/', icon: Home },
    { id: 'about', label: 'About', path: '/about', icon: Info },
    {
      id: 'services',
      label: 'Services',
      path: '/services',
      icon: Wrench,
      dropdown: [
        {
          id: 'agro-input',
          label: 'Agro-Input',
          path: '/services/agro-input',
          icon: PackageSearch
        },

        {
          id: 'agricourt-ventures',
          label: 'AgriCourt Ventures',
          path: '/services/agricourt-ventures',
          icon: Factory
        },

        {
          id: 'harvest-yield-farm',
          label: 'HarvestYield Farm',
          path: '/services/harvest-yield-farm',
          icon: Sprout
        },

      ]
    },
    { id: 'blogs', label: 'Blogs', path: '/blogs', icon: BookOpen },
    { id: 'contact', label: 'Contact', path: '/contact', icon: Mail },
    { id: 'products', label: 'Products', path: '/products', icon: ShoppingBag }
  ],
  userMenu: {
    authenticated: [
      { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { id: 'profile', label: 'My Profile', path: '/dashboard/profile', icon: UserCircle },
      { id: 'orders', label: 'My Orders', path: '/dashboard/orders', icon: Clock },
    ],
    guest: [
      { id: 'login', label: 'Login', path: '/auth/login', icon: LogIn },
      { id: 'register', label: 'Register', path: '/auth/register', icon: UserCircle }
    ]
  }
};
export const ROLE_CONFIG = {
  'super admin': {
    icon: ShieldCheck,
    color: 'purple',
    label: 'Super Admin'
  },
  'admin': {
    icon: Shield,
    color: 'blue',
    label: 'Admin'
  },
  'vendor': {
    icon: Store,
    color: 'orange',
    label: 'Vendor'
  },
  'user': {
    icon: User,
    color: 'gray',
    label: 'User'
  }
};