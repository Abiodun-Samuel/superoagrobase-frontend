import {
  Shield, Truck, Headphones, Award, Facebook,
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
  Package,
  Search,
  ShoppingCart,
  PhoneIcon,
  Boxes,
  Newspaper,
  HelpCircle,
  FileText,
  Cookie,
  AlertTriangle, CreditCard, MapPin, CheckCircle, AlertCircle,
  UserPenIcon
} from 'lucide-react';

export const SITE_DATA = {
  // Basic Information
  name: 'SuperoAgrobase',
  legalName: 'Supero Incorporation Limited',
  tagline: 'Key to Agricultural Productivity',
  domain: 'https://superoagrobase.com',

  // Contact Information
  email: 'contact@superoagrobase.com',
  phone: '+2348157037737',
  whatsapp: 'https://wa.me/message/KK2QPDR6KTLBK1',

  address: {
    street: '10, Jimoh Odu Street, Opp Benson B/S, Ikorodu Garage',
    city: 'Ikorodu',
    state: 'Lagos',
    stateCode: 'LA',
    country: 'Nigeria',
    countryCode: 'NG',
    full: '10, Jimoh Odu Street, Opp Benson B/S, Ikorodu Garage, Ikorodu, Lagos, Nigeria'
  },

  // Geolocation (Ikorodu, Lagos coordinates)
  geo: {
    latitude: '6.6153',
    longitude: '3.5075'
  },

  // Business Details
  business: {
    type: 'Agribusiness Enterprise',
    founded: '2020',
    priceRange: '₦₦',
    openingHours: {
      weekdays: { open: '08:00', close: '18:00' },
      saturday: { open: '09:00', close: '16:00' },
      sunday: 'closed'
    }
  },

  // Descriptions
  descriptions: {
    short: 'Nigeria\'s #1 agricultural marketplace for quality seeds, fertilizers, and farm equipment.',
    medium: 'Shop 1000+ quality agricultural products: seeds, fertilizers, farm equipment, pesticides, herbicides & more. Fast nationwide delivery. Trusted by 10,000+ farmers.',
    long: 'Supero Incorporation Limited is a fast-rising agribusiness enterprise that leverages in-depth research and development to provide farmers with high quality agricultural inputs, farm management, consultancy and agricultural laboratory services. Shop genuine products with expert support and fast delivery across Nigeria.',
    tagline: 'Key to Agricultural Productivity'
  },

  // Social Media
  social: {
    facebook: 'https://www.facebook.com/superoagrobasedltd/',
    instagram: 'https://www.instagram.com/superoagrobase/',
    twitter: 'https://twitter.com/LimitedSupero',
    whatsapp: 'https://wa.me/message/KK2QPDR6KTLBK1',
    twitterHandle: '@LimitedSupero'
  },

  // Assets
  assets: {
    logo: '/images/logo/logo.png',
    logoWidth: 600,
    logoHeight: 60,
    ogImage: '/images/images/og-image.jpg',
    ogImageWidth: 1200,
    ogImageHeight: 630,
    favicon: '/favicon/favicon.ico'
  },

  // SEO Keywords (Base)
  keywords: {
    primary: [
      'SuperoAgrobase',
      'agricultural marketplace Nigeria',
      'farm products Nigeria',
      'seeds fertilizers Nigeria',
      'Supero Incorporation Limited'
    ],
    secondary: [
      'buy farm inputs Nigeria',
      'agricultural supplies',
      'farm equipment Nigeria',
      'pesticides herbicides Nigeria',
      'agro chemicals Nigeria',
      'farming supplies online',
      'crop protection products',
      'animal feed Nigeria',
      'irrigation equipment',
      'farm machinery Nigeria',
      'agricultural tools',
      'organic fertilizers',
      'hybrid seeds Nigeria'
    ],
    locations: [
      'Ikorodu',
      'Lagos',
      'Ibadan',
      'Abuja',
      'Port Harcourt',
      'Kano',
      'Nigeria'
    ]
  },

  // Features/USPs
  features: [
    'Fast Nationwide Delivery',
    'Trusted by 10,000+ Farmers',
    'Genuine Products',
    'Expert Support',
    '1000+ Quality Products',
    'Agricultural Consultancy',
    'Laboratory Services',
    'Farm Management Solutions'
  ],

  // Verification IDs
  verification: {
    google: 'your-google-verification-code',
    bing: 'your-bing-verification-code',
    facebook: 'your-facebook-app-id'
  }
};

export const BADGE_COLORS = {
  'Featured': 'green',
  'Popular': 'blue',
  'Limited Stock': 'red',
  'New Arrival': 'purple',
  'Best Seller': 'yellow',
  'Sale': 'red',
};

export const STATS =
  [
    { icon: Package, value: "1,000+", label: "Products" },
    { icon: Users, value: "10,000+", label: "Farmers Trust Us" },
    { icon: Shield, value: "100%", label: "Genuine Quality" },
    { icon: Globe, value: "36+", label: "States Nationwide" }
  ]

export const FOOTER_DATA = {
  company: {
    name: SITE_DATA?.name,
    description: SITE_DATA?.descriptions?.long,
    contact: {
      phone: SITE_DATA?.phone,
      email: SITE_DATA?.email,
      address: SITE_DATA?.address?.full
    }
  },

  links: {
    quickLinks: [
      { label: 'Products', href: '/products', icon: Boxes },
      { label: 'Contact', href: '/contact', icon: Mail },
      { label: 'Blogs', href: '/blogs', icon: Newspaper },
      { label: 'Become a vendor', href: '/become-a-vendor', icon: Store },
    ],
    customerService: [
      { label: 'Orders', href: '/dashboard/orders', icon: ShoppingBag },
      { label: 'Profile', href: '/dashboard/profile', icon: UserPenIcon },
      { label: 'Cart', href: '/cart', icon: ShoppingCart },
      { label: 'FAQs', href: '/faqs', icon: HelpCircle },
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy-policy', icon: ShieldCheck },
      { label: 'Terms of Service', href: '/terms-of-service', icon: FileText },
      { label: 'Cookie Policy', href: '/cookie-policy', icon: Cookie },
      { label: 'Disclaimer', href: '/disclaimer', icon: AlertTriangle },
    ],
  },

  social: [
    { name: 'Facebook', icon: Facebook, href: SITE_DATA?.social?.facebook, color: '#1877F2' },
    { name: 'Twitter', icon: Twitter, href: SITE_DATA?.social?.twitter, color: '#1DA1F2' },
    { name: 'Instagram', icon: Instagram, href: SITE_DATA?.social?.instagram, color: '#E4405F' },
    { name: 'Whatsapp', icon: PhoneIcon, href: SITE_DATA?.social?.whatsapp, color: '#E4405F' },
  ],

  paymentMethods: [
    {
      name: 'PayStack', logo: '/images/images/paystack.svg', sub: ['Visa', 'Mastercard', 'Verve', 'Bank Transfer']
    },
  ]
};

export const NAVBAR_DATA = {
  topBar: {
    phone: SITE_DATA?.phone,
    email: SITE_DATA?.email,
    address: SITE_DATA?.address?.full
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

export const MOCK_PRODUCTS = [
  {
    "id": 2,
    "slug": "platinum-f1-10g-cakenmxx",
    "title": "Platinum F1",
    "sub_title": null,
    "keywords": null,
    "description": "A hybrid that is most suitable for cultivation in tropical lowland.\nIt displays strong vigor and wide adaptability to different growing\nconditions. Fruits are high round, firm and medium-sized. Its\nexcellent disease resistance package and heat set are the reasons.\nwhy this hybrid has become very popular.\n\nDays to Maturity - 60-70DAT\nFruit Size; 160-180g\nResistance\nHR: ToMV\/Vd\nIR: Rs\/TYLCV\nrecommended for tropical low land conditions,\ngood heat set, good cracking tolerance",
    "ingredients": "Tomato Seeds",
    "is_featured": true,
    "brands": "East West Seeds",
    "image": "https:\/\/res.cloudinary.com\/psalmzie\/image\/upload\/v1679496814\/superoagrobase\/products\/jvuc8nqjfpslkpww4a2v.jpg",
    "images": null,
    "view_count": 243,
    "sales_count": 0,
    "status": "in_stock",
    "pack_size": "10g",
    "price": "26000.00",
    "discount_price": null,
    "stock": 7,
    "badges": [
      "Limited Stock",
      "Featured"
    ],
    "category": {
      "id": 2,
      "slug": "seeds",
      "image": "https:\/\/res.cloudinary.com\/psalmzie\/image\/upload\/v1677677850\/superoagrobase\/category\/llnpfhaz5meipfdutvzn.jpg",
      "title": "Seeds",
      "badges": []
    },
    "subcategory": {
      "id": 1,
      "category_id": 2,
      "title": "Tomato Seeds",
      "slug": "tomato-seeds",
      "image": "https:\/\/res.cloudinary.com\/psalmzie\/image\/upload\/v1673637181\/superoagrobase\/subcategory\/czqdyr9mkbg9nkt3rmbc.jpg",
      "created_at": "2025-11-16T03:36:44.000000Z",
      "updated_at": "2025-11-16T03:36:44.000000Z"
    },
    "created_at": "2023-03-01T19:27:09.000000Z",
    "updated_at": "2025-11-12T10:58:43.000000Z"
  },
  {
    "id": 18,
    "slug": "prema-100g-bfsascqj",
    "title": "Prema",
    "sub_title": null,
    "keywords": null,
    "description": "Prema\n\nA vigorous selection with strong, erect foliage\ndevelopment. Bulbs are highly single centered\nand show very good uniformity in shape and size.\nColor is attractive bright red. Prema is especially\nrecommended for rainy season cultivation in the\ntropics. Properly cured bulbs can be stored for a\nlong period.\nMaturity Days;110-120DAT.\nPlant vigor; strong\nBulb shape; Flat globe.\nBulb firmness; firm.\nBulb color; Bright red.\nBulb bolting; Moderately tolerant.\nStorage; Excellent.\nBulb weight; 95-115gr.",
    "ingredients": "Onion Seed",
    "is_featured": true,
    "brands": "East West Seed",
    "image": "https:\/\/res.cloudinary.com\/psalmzie\/image\/upload\/v1679496036\/superoagrobase\/products\/cjdmcly42ihri4tkwzgb.jpg",
    "images": null,
    "view_count": 212,
    "sales_count": 0,
    "status": "in_stock",
    "pack_size": "100g",
    "price": "14500.00",
    "discount_price": null,
    "stock": 32,
    "badges": [
      "Featured"
    ],
    "category": {
      "id": 2,
      "slug": "seeds",
      "image": "https:\/\/res.cloudinary.com\/psalmzie\/image\/upload\/v1677677850\/superoagrobase\/category\/llnpfhaz5meipfdutvzn.jpg",
      "title": "Seeds",
      "badges": []
    },
    "subcategory": {
      "id": 5,
      "category_id": 2,
      "title": "Onions Seeds",
      "slug": "onions-seeds",
      "image": "https:\/\/res.cloudinary.com\/psalmzie\/image\/upload\/v1673637433\/superoagrobase\/subcategory\/jng9nm1zbigvzqniegho.jpg",
      "created_at": "2025-11-16T03:36:44.000000Z",
      "updated_at": "2025-11-16T03:36:44.000000Z"
    },
    "created_at": "2023-03-02T15:54:55.000000Z",
    "updated_at": "2025-11-14T22:53:03.000000Z"
  },
  {
    "id": 47,
    "slug": "spartan-300-od-1ooml-3gmfu86t",
    "title": "Spartan 300 OD",
    "sub_title": null,
    "keywords": null,
    "description": "Spartan 300 OD\n\nSpartan 300 OD is an insect poison with a mix of contact, ingestion, and fundamental properties. It offers quick and secure assurance on cotton and vegetable harvests.\nDynamic Ingredient: Imidacloprid 210g\/L + Beta-Cyfluthrin 90g\/L 0D\nImidacloprid has been assessed as a grain protectant for control of an extensive variety of put away item creepy crawly species. It is a foundational insect spray having a place with a class of synthetic substances called the neonicotinoids that follow up on bugs\u2019 focal sensory systems. The compound works by obstructing the transmission of upgrades in the bug sensory system. In particular, it causes a blockage of the nicotinic neuronal pathway. By obstructing nicotinic acetylcholine receptors, imidacloprid keeps acetylcholine from sending motivations between nerves, bringing about the bug\u2019s loss of motion and inevitable demise. It is powerful on contact and through stomach activity. Since imidacloprid ties significantly more unequivocally to bug neuron receptors than vertebrate neuron receptors, this insect poison is more harmful to bugs than warm blooded animals.\nBeta-cyfluthrin is an insect poison, going about as a contact and stomach poison. It consolidates a quick thump down impact with durable viability. It isn\u2019t fundamental in plants. It is utilized in agribusiness, cultivation (field and safeguarded harvests), and viticulture.\nAPPLICATION\nUtilize Spartan 300 OD Insecticide when you have bug bothers swarming your yields and ornamentals. Most great control will be accomplished when applications are made preceding the egg seal of the objective nuisances. Apply on quiet days when wind speed is low to limit the gamble of float.\nCenter Crops: Rice, Maize, Tomato, Cotton, vegetables.\n\nCenter vermin: Whiteflies, Aphids, Armyworms, Borers, Bollworms, Thrips.\nPortion rate: 40ml \u2013 80ml (4-8ml) with 16L sprayer",
    "ingredients": "Imidachlopid 210g\/l +  Beta-cyfluthrin 90g\/l OD",
    "is_featured": true,
    "brands": "Shandong Welfang Rainbow Chemical Co, Ltd",
    "image": "https:\/\/res.cloudinary.com\/psalmzie\/image\/upload\/v1695724420\/superoagrobase\/products\/edfugfrn0oy4bdwpgmx7.jpg",
    "images": null,
    "view_count": 670,
    "sales_count": 0,
    "status": "in_stock",
    "pack_size": "1OOml",
    "price": "5000.00",
    "discount_price": null,
    "stock": 14,
    "badges": [
      "Popular",
      "Featured"
    ],
    "category": {
      "id": 3,
      "slug": "agrochemical",
      "image": "https:\/\/res.cloudinary.com\/psalmzie\/image\/upload\/v1673627966\/superoagrobase\/category\/mxaw5gypk2eplvkdmyfj.jpg",
      "title": "AgroChemical",
      "badges": []
    },
    "subcategory": {
      "id": 6,
      "category_id": 3,
      "title": "Insecticides",
      "slug": "insecticides",
      "image": "https:\/\/res.cloudinary.com\/psalmzie\/image\/upload\/v1673637737\/superoagrobase\/subcategory\/lmxoywnx5fgi32h8udwp.jpg",
      "created_at": "2025-11-16T03:36:44.000000Z",
      "updated_at": "2025-11-16T03:36:44.000000Z"
    },
    "created_at": "2023-03-03T16:10:24.000000Z",
    "updated_at": "2025-11-14T14:04:46.000000Z"
  },
  {
    "id": 128,
    "slug": "tecnokel-aminoca-b-1l-quwfpug2",
    "title": "Tecnokel AminoCa B",
    "sub_title": null,
    "keywords": null,
    "description": "Tecnokel AminoCaB is an organic liquid fertilizer formulated to correct deficiencies in Calcium and boron in the plant. The Combination of Calcium and Boron increases fruit firmness and post-harvest quality. Calcium is involved in the induction of heat shock proteins. Tecnokel Amino CaB is recommended for all kind of crops.\n\nApplication Timming: Start applications in pre-flowering and repeat in each fruit formation.\nRate: Apply 2-3 Litre\/ Ha",
    "ingredients": "Free L-Amino acids 6.0%\nCalcium 10.0%\nBoron 0.2%\npH  3.5",
    "is_featured": true,
    "brands": "AgriTecno",
    "image": "https:\/\/res.cloudinary.com\/psalmzie\/image\/upload\/v1706536582\/superoagrobase\/products\/owyldjnok1rz3e66v8f9.jpg",
    "images": null,
    "view_count": 844,
    "sales_count": 0,
    "status": "in_stock",
    "pack_size": "1L",
    "price": "12000.00",
    "discount_price": null,
    "stock": 30,
    "badges": [
      "Popular",
      "Featured"
    ],
    "category": {
      "id": 5,
      "slug": "fertilizers",
      "image": "https:\/\/res.cloudinary.com\/psalmzie\/image\/upload\/v1704893204\/superoagrobase\/category\/kr1ps6n5o5p3ikoo6myh.jpg",
      "title": "Fertilizers",
      "badges": []
    },
    "subcategory": {
      "id": 9,
      "category_id": 5,
      "title": "Bio-stimulant",
      "slug": "bio-stimulant",
      "image": "https:\/\/res.cloudinary.com\/psalmzie\/image\/upload\/v1706101608\/superoagrobase\/subcategory\/lzsn9jhiqzbhttg0a77o.jpg",
      "created_at": "2025-11-16T03:36:44.000000Z",
      "updated_at": "2025-11-16T03:36:44.000000Z"
    },
    "created_at": "2024-01-29T18:56:22.000000Z",
    "updated_at": "2025-11-15T05:18:06.000000Z"
  },
]

export const STEPS = [
  {
    id: 1,
    title: "Browse & Select Products",
    description: "Search our catalog of agricultural products like seeds, pesticide. Add your chosen products to your shopping cart with just one click.",
    icon: Search,
    ariaLabel: "Step 1: Browse agricultural products and add to cart"
  },
  {
    id: 2,
    title: "Place Order & Pay",
    description: "Complete your purchase with secure checkout. Choose from multiple payment methods including cash on delivery, bank transfer, or pay later options.",
    icon: ShoppingCart,
    ariaLabel: "Step 2: Place order with flexible payment options"
  },
  {
    id: 3,
    title: "Monitor Order Status",
    description: "Track your agricultural product order through your personal dashboard. View order status, processing updates, and estimated delivery time.",
    icon: Package,
    ariaLabel: "Step 3: Track order in your dashboard"
  },
  {
    id: 4,
    title: "Delivery or Pickup",
    description: "Choose doorstep delivery to your farm or warehouse, or pick up your order at our nearest collection center at your convenience.",
    icon: Truck,
    ariaLabel: "Step 4: Receive delivery or pickup your order"
  }
];

export const TRUST_INDICATORS = [
  {
    icon: CheckCircle2,
    label: "Certified Quality",
    value: "ISO 9001",
    description: "International quality management certification for agricultural supplies"
  },
  {
    icon: Globe,
    label: "Nationwide Coverage",
    value: "All 36 States",
    description: "Complete delivery and pickup network across Nigeria"
  },
  {
    icon: Heart,
    label: "Customer Satisfaction",
    value: "4.9/5.0",
    description: "Rated by 10,000+ verified farmers nationwide"
  },
  {
    icon: Zap,
    label: "Quick Processing",
    value: "Same Day",
    description: "Fast order processing and fulfillment service"
  }
];

export const FEATURES = [
  {
    icon: Shield,
    title: "Certified Genuine Farm Products",
    description: "Purchase verified authentic agricultural supplies including seeds, fertilizers, pesticides, and equipment. Every product is quality-tested and sourced from authorized manufacturers to guarantee optimal crop yields and farm performance.",
    badge: "Verified",
    color: "green"
  },
  {
    icon: Truck,
    title: "Delivery & Office Pickup Options",
    description: "Choose convenient doorstep delivery to your farm across all 36 Nigerian states or collect your order from our pickup centers. Flexible fulfillment options designed for busy farmers with reliable logistics support.",
    badge: "Flexible",
    color: "blue"
  },
  {
    icon: Headphones,
    title: "24/7 Agricultural Expert Support",
    description: "Connect with certified agronomists and farming consultants anytime. Receive professional advice on crop protection, fertilizer application, pest control, soil management, and product recommendations for your farm type.",
    badge: "Live Help",
    color: "purple"
  },
  {
    icon: Award,
    title: "Competitive Prices & Loyalty Rewards",
    description: "Save money with wholesale pricing on bulk orders, transparent costs, and no hidden charges. Earn rewards through our farmer loyalty program with exclusive discounts, seasonal promotions, and special member benefits.",
    badge: "Best Value",
    color: "orange"
  }
];

export const FAQ_DATA = {
  homeFAQs: [
    {
      question: `What products does ${SITE_DATA.name} sell?`,
      answer: `${SITE_DATA.name} offers a wide range of agricultural products including seeds, fertilizers, pesticides, herbicides, fungicides, farm equipment, irrigation systems, animal feed, and other farming supplies for Nigerian farmers. We provide quality agricultural inputs, farm management services, and agricultural laboratory services.`
    },
    {
      question: "Do you deliver nationwide in Nigeria?",
      answer: "Yes, we deliver to all 36 states in Nigeria. Delivery typically takes 1-3 business days depending on your location. We partner with reliable logistics companies to ensure your products arrive safely and on time."
    },
    {
      question: "Are the products genuine and quality assured?",
      answer: `Absolutely! All products sold on ${SITE_DATA.name} are 100% genuine and sourced directly from reputable manufacturers and authorized distributors. ${SITE_DATA.legalName} leverages in-depth research and development to guarantee quality and authenticity for all agricultural products.`
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept multiple payment methods including bank transfers, debit cards, credit cards, USSD, and mobile money transfers. All transactions are secure and encrypted for your safety."
    },
    {
      question: "Can I return a product if I'm not satisfied?",
      answer: "Yes, we have a 7-day return policy for unopened products in their original packaging. If you receive a damaged or wrong product, contact us immediately for a free replacement or full refund."
    },
    {
      question: `Where is ${SITE_DATA.name} located?`,
      answer: `We are located at ${SITE_DATA.address.full}. You can contact us via phone at ${SITE_DATA.phone}, email at ${SITE_DATA.email}, or through WhatsApp for immediate assistance.`
    }
  ],
  faqsPAGE: [
    // Ordering & Account FAQs
    {
      faqType: 'ordering',
      icon: ShoppingCart,
      question: 'How do I place an order on SuperoAgrobase?',
      answer: 'Ordering from SuperoAgrobase is simple and straightforward:\n\n1. Browse our extensive catalog of agricultural products including seeds, fertilizers, pesticides, herbicides, and farm equipment\n2. Add your desired items to cart by clicking the "Add to Cart" button\n3. Review your cart and proceed to checkout\n4. Fill in your delivery address and contact information\n5. Choose your preferred payment method\n6. Confirm your order and receive an order confirmation via email or SMS\n\nYou can also place orders via WhatsApp at {phone} or call us directly for personalized assistance.'
    },
    {
      faqType: 'ordering',
      icon: FileText,
      question: 'Do I need to create an account to place an order?',
      answer: 'While you can browse our products without an account, we recommend creating one for a better shopping experience. With an account, you can track your orders, save your delivery addresses, access exclusive deals, view your purchase history, and enjoy faster checkout on future orders. Registration is quick, free, and takes less than 2 minutes.'
    },
    {
      faqType: 'ordering',
      icon: AlertCircle,
      question: 'What is the minimum order quantity or value?',
      answer: 'We welcome orders of all sizes at SuperoAgrobase. There is no minimum order quantity for most products. Whether you\'re a smallholder farmer needing a few packets of seeds or a large-scale commercial farmer requiring bulk quantities of fertilizers, we\'re here to serve you. For bulk orders above ₦500,000, please contact us for special pricing and dedicated support.'
    },
    {
      faqType: 'ordering',
      icon: CheckCircle,
      question: 'Can I modify or cancel my order after placing it?',
      answer: 'Yes, you can modify or cancel your order within 2 hours of placing it. Please contact our customer support team immediately via WhatsApp at {phone}, call us at {phone}, or email {email}. Once your order has been processed for dispatch, modifications may not be possible. We\'ll do our best to accommodate your request whenever feasible.'
    },

    // Payment & Billing FAQs
    {
      faqType: 'payment',
      icon: CreditCard,
      question: 'What payment methods do you accept?',
      answer: 'SuperoAgrobase offers multiple secure payment options for your convenience:\n\n• Bank Transfer: Direct transfer to our company account\n• Online Payment: Pay with your debit or credit card (Visa, Mastercard, Verve)\n• Mobile Money: Payment via mobile wallets and USSD codes\n• Payment on Delivery: Available for select locations (Lagos and Ogun State)\n• POS Payment: Pay with your card upon delivery (where available)\n\nAll online transactions are secured with industry-standard encryption to protect your financial information.'
    },
    {
      faqType: 'payment',
      icon: Shield,
      question: 'Is it safe to pay online on your website?',
      answer: 'Absolutely! Your security is our top priority. We use advanced SSL encryption and partner with trusted payment gateways to ensure your financial information is completely secure. We never store your complete card details on our servers. All transactions are processed through PCI-DSS compliant payment processors. You can shop with confidence knowing your data is protected at every step.'
    },
    {
      faqType: 'payment',
      icon: FileText,
      question: 'Will I receive a receipt or invoice for my purchase?',
      answer: 'Yes, you will receive a detailed invoice for every purchase. An electronic invoice will be sent to your registered email address immediately after payment confirmation. For corporate customers requiring official receipts for accounting purposes, we can provide stamped company invoices upon request. All invoices include product details, quantities, prices, tax information, and our company details.'
    },
    {
      faqType: 'payment',
      icon: Clock,
      question: 'How long does it take to confirm my payment?',
      answer: 'Online card payments are confirmed instantly. For bank transfers, confirmation typically takes between 10 minutes to 2 hours during banking hours (Monday to Friday, 8:00 AM - 5:00 PM). To speed up the process, please send your payment receipt via WhatsApp to {phone} or email it to {email} with your order number. Weekend or holiday transfers may take slightly longer to reflect.'
    },

    // Delivery & Shipping FAQs
    {
      faqType: 'delivery',
      icon: Truck,
      question: 'Which locations do you deliver to?',
      answer: 'SuperoAgrobase provides fast nationwide delivery across all 36 states in Nigeria and the FCT. We have partnerships with reliable logistics companies to ensure your agricultural products reach you safely, whether you\'re in Lagos, Abuja, Port Harcourt, Kano, Ibadan, Kaduna, Onitsha, or any other location in Nigeria. Delivery times vary by location, with urban areas typically receiving orders faster than remote rural areas.'
    },
    {
      faqType: 'delivery',
      icon: Clock,
      question: 'How long will it take to receive my order?',
      answer: 'Delivery times depend on your location:\n\n• Lagos & Ogun State: 1-3 business days\n• Major cities (Abuja, Port Harcourt, Ibadan, Kano): 3-5 business days\n• Other states: 5-7 business days\n• Remote locations: 7-10 business days\n\nOrders placed before 2:00 PM on weekdays are typically processed the same day. Weekend orders are processed on the next business day. You\'ll receive tracking information once your order is dispatched.'
    },
    {
      faqType: 'delivery',
      icon: Package,
      question: 'How much does delivery cost?',
      answer: 'Delivery fees are calculated based on your location and the weight/size of your order. Rates start from as low as ₦1,500 for intra-city delivery in Lagos. The exact delivery cost will be displayed at checkout before you complete your order. We offer FREE DELIVERY on orders above ₦50,000 to select locations. For bulk orders, please contact us for special delivery rates and arrangements.'
    },
    {
      faqType: 'delivery',
      icon: MapPin,
      question: 'Can I track my order?',
      answer: 'Yes! Once your order is dispatched, you\'ll receive a tracking number via SMS and email. You can use this number to monitor your delivery status in real-time. You can also check your order status by logging into your account on our website. For immediate assistance with tracking, contact our customer support team via WhatsApp at {phone}.'
    },
    {
      faqType: 'delivery',
      icon: AlertCircle,
      question: 'What happens if I\'m not available to receive my delivery?',
      answer: 'Our delivery partner will call you 30 minutes to 1 hour before arrival. If you\'re unavailable, you can arrange for someone else to receive the order on your behalf (please inform us in advance). Alternatively, we can reschedule delivery for another convenient day. Please note that additional delivery charges may apply for multiple delivery attempts. We recommend providing accurate contact information and being available on your chosen delivery date.'
    },

    // Products & Quality FAQs
    {
      faqType: 'product',
      icon: Shield,
      question: 'Are all your products genuine and of good quality?',
      answer: 'Absolutely! At SuperoAgrobase, we guarantee 100% genuine products. All our agricultural inputs—including seeds, fertilizers, pesticides, herbicides, and equipment—are sourced directly from authorized manufacturers and certified distributors. We work with leading global and local brands to ensure you receive only authentic, high-quality products that meet international standards. Every product undergoes quality checks before dispatch. Your success as a farmer is our priority.'
    },
    {
      faqType: 'product',
      icon: Package,
      question: 'Do you sell both local and imported agricultural products?',
      answer: 'Yes, we offer a comprehensive selection of both locally-produced and imported agricultural products. Our inventory includes trusted Nigerian brands as well as internationally recognized products from leading manufacturers worldwide. Whether you prefer local varieties adapted to Nigerian conditions or specialized imported inputs for specific crops, we have you covered. All imported products meet Nigerian regulatory standards and have proper NAFDAC or regulatory approvals.'
    },
    {
      faqType: 'product',
      icon: FileText,
      question: 'Can I get technical advice on which products to use for my farm?',
      answer: 'Yes! SuperoAgrobase offers free agricultural consultancy services to help you make informed decisions. Our team of experienced agronomists can provide recommendations on the best seeds, fertilizers, pesticides, and herbicides for your specific crops, soil type, and farming conditions. Contact us via WhatsApp at {phone}, call {phone}, or email {email} to speak with our agricultural experts. We\'re committed to supporting your farming success beyond just selling products.'
    },
    {
      faqType: 'product',
      icon: CheckCircle,
      question: 'Do your products come with usage instructions?',
      answer: 'Yes, all our products come with detailed usage instructions and application guidelines. For pesticides, herbicides, and fertilizers, we provide clear dosage recommendations, safety precautions, and application methods. Seeds come with planting instructions including spacing, depth, and growing conditions. For any questions about product usage, our agricultural experts are always available to provide guidance and support. Safety first—always read and follow product labels.'
    },

    // Returns & Refunds FAQs
    {
      faqType: 'return',
      icon: Shield,
      question: 'What is your return and refund policy?',
      answer: 'We want you to be completely satisfied with your purchase. Our return policy includes:\n\n• Products can be returned within 7 days of delivery if unused and in original packaging\n• Damaged or defective products are eligible for immediate replacement or full refund\n• Wrong items delivered will be replaced at no extra cost to you\n• Perishable items like seeds must be reported within 24 hours of delivery\n\nTo initiate a return, contact our customer support with your order number and photos of the product. Approved returns are processed within 7-14 business days.'
    },
    {
      faqType: 'return',
      icon: Package,
      question: 'What should I do if I receive a damaged or wrong product?',
      answer: 'We sincerely apologize if this happens. Please contact us immediately via WhatsApp at {phone}, call {phone}, or email {email} with your order number and clear photos of the damaged or wrong product. Do not open or use the product. Our team will arrange for collection and send you the correct product or a replacement at no additional cost. Your satisfaction is our priority, and we\'ll resolve the issue promptly.'
    },
    {
      faqType: 'return',
      icon: CreditCard,
      question: 'How long does it take to receive a refund?',
      answer: 'Once your return is approved and we receive the product back, refunds are processed within 7-14 business days. The refund will be credited to the original payment method you used. For bank transfers, the funds will reflect in your account within 3-5 business days after processing. For card payments, it may take 7-14 business days depending on your bank. You\'ll receive a confirmation email once the refund is processed.'
    },

    // Customer Support FAQs
    {
      faqType: 'support',
      icon: Headphones,
      question: 'How can I contact customer support?',
      answer: 'Our dedicated customer support team is here to help you. Contact us through any of these channels:\n\n• WhatsApp: {phone} (Fastest response)\n• Phone: {phone} (Monday to Saturday, 8:00 AM - 6:00 PM)\n• Email: {email} (24/7, response within 24 hours)\n• Visit us: {address}\n\nWe typically respond to WhatsApp messages within minutes during business hours. For urgent matters, calling is recommended.'
    },
    {
      faqType: 'support',
      icon: Clock,
      question: 'What are your business hours?',
      answer: 'SuperoAgrobase operates at the following hours:\n\n• Monday to Friday: 8:00 AM - 6:00 PM\n• Saturday: 9:00 AM - 4:00 PM\n• Sunday: Closed\n\nYou can place orders online 24/7 through our website. Orders placed outside business hours will be processed the next business day. Our WhatsApp line is monitored during business hours for quick responses.'
    },
    {
      faqType: 'support',
      icon: MapPin,
      question: 'Can I visit your physical store or warehouse?',
      answer: 'Yes, you\'re welcome to visit our store in Ikorodu, Lagos! Our address is {address}. You can inspect products, place orders in person, and receive expert advice from our agricultural specialists. We recommend calling ahead at {phone} or sending a WhatsApp message to ensure we have your desired products in stock. Our team will be happy to assist you with all your agricultural needs.'
    },
    {
      faqType: 'support',
      icon: FileText,
      question: 'Do you offer bulk purchase discounts for large orders?',
      answer: 'Yes! We provide attractive discounts for bulk purchases and are committed to supporting large-scale farmers and agro-dealers. The discount rate depends on the quantity and product category. For orders exceeding ₦200,000, please contact our sales team at {phone} or {email} to discuss special pricing, payment terms, and dedicated logistics support. We also offer flexible payment plans for registered commercial farmers and agricultural cooperatives.'
    }
  ]
}

export const FAQ_CATEGORIES = [
  {
    key: 'ordering',
    title: 'Ordering & Account',
    description: 'Learn how to place orders and manage your account',
    icon: ShoppingCart
  },
  {
    key: 'payment',
    title: 'Payment & Billing',
    description: 'Information about payment methods and security',
    icon: CreditCard
  },
  {
    key: 'delivery',
    title: 'Delivery & Shipping',
    description: 'Everything about our delivery process',
    icon: Truck
  },
  {
    key: 'product',
    title: 'Products & Quality',
    description: 'Information about our agricultural products',
    icon: Package
  },
  {
    key: 'return',
    title: 'Returns & Refunds',
    description: 'Our return policy and refund process',
    icon: Shield
  },
  {
    key: 'support',
    title: 'Customer Support',
    description: 'How to reach us and get help',
    icon: Headphones
  }
];

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First', icon: '🆕' },
  { value: 'oldest', label: 'Oldest First', icon: '📅' },
  { value: 'price_asc', label: 'Price: Low to High', icon: '💰' },
  { value: 'price_desc', label: 'Price: High to Low', icon: '💎' },
  { value: 'name_asc', label: 'Name: A to Z', icon: '🔤' },
  { value: 'name_desc', label: 'Name: Z to A', icon: '🔡' },
  { value: 'popular', label: 'Most Popular', icon: '🔥' }
];

export const PER_PAGE_OPTIONS = [
  { value: 20, label: '20' },
  { value: 50, label: '50' },
  { value: 100, label: '100' },
  { value: 150, label: '150' }
];