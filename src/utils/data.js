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
  Package,
} from 'lucide-react';

export const BADGE_COLORS = {
  'Featured': 'green',
  'Popular': 'blue',
  'Limited Stock': 'red',
  'New Arrival': 'purple',
  'Best Seller': 'yellow',
  'Sale': 'red',
};

export const TRUST_INDICATORS = [
  {
    icon: CheckCircle2,
    label: "Certified Quality Products",
    value: "ISO 9001",
    description: "International quality management certification"
  },
  {
    icon: Globe,
    label: "Pan-Nigeria Delivery",
    value: "All 36 States",
    description: "Complete nationwide coverage and distribution"
  },
  {
    icon: Heart,
    label: "Customer Trust Rating",
    value: "4.9/5.0",
    description: "Based on 10,000+ verified farmer reviews"
  },
  {
    icon: Zap,
    label: "Fast Order Fulfillment",
    value: "24-48 Hours",
    description: "Average delivery time across Nigeria"
  }
];

export const FEATURES = [
  {
    icon: Shield,
    title: "100% Authentic Agricultural Products",
    description: "All products are certified genuine and sourced directly from authorized manufacturers. Every item undergoes strict quality control to ensure you receive only authentic, high-performance agricultural supplies for optimal farm productivity.",
    badge: "Verified",
    color: "green"
  },
  {
    icon: Truck,
    title: "Nationwide Express Delivery Service",
    description: "Fast and reliable delivery to all 36 states in Nigeria within 24-48 hours. Our efficient logistics network ensures your farming supplies arrive on time, every time, so you never miss critical planting or application windows.",
    badge: "Express",
    color: "blue"
  },
  {
    icon: Headphones,
    title: "Expert Agricultural Support 24/7",
    description: "Access certified agronomists and farming experts round-the-clock. Get professional guidance on product selection, application techniques, pest management, and crop optimization tailored to your specific farming needs.",
    badge: "Live Support",
    color: "purple"
  },
  {
    icon: Award,
    title: "Best Price Guarantee & Rewards",
    description: "Competitive wholesale pricing with transparent costs and no hidden fees. Enjoy our loyalty program with exclusive discounts, seasonal offers, and special rates for bulk purchases. Your success is our priority.",
    badge: "Best Value",
    color: "orange"
  }
];

export const STATS =
  [
    { icon: Package, value: "1,000+", label: "Products" },
    { icon: Users, value: "10,000+", label: "Farmers Trust Us" },
    { icon: Shield, value: "100%", label: "Genuine Quality" },
    { icon: Globe, value: "36+", label: "States Nationwide" }
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