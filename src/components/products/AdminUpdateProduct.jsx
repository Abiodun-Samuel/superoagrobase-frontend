'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Package, Save, X, Image as ImageIcon } from 'lucide-react';

import InputForm from '@/components/form/InputForm';
import TextareaForm from '@/components/form/TextareaForm';
import SingleSelectForm from '@/components/form/SingleSelectForm';
import SwitchForm from '@/components/form/SwitchForm';
import Button from '@/components/ui/Button';
import { defaultProductValues, productValidationSchema } from '@/validation/schema';
import { useCategories } from '@/queries/categories.query';
import { useUpdateProduct, useAdminProduct } from '@/queries/products.query';
import Toast from '@/lib/toastify';

// Skeleton Loader Component
const ProductFormSkeleton = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 animate-pulse">
            <div className="mx-auto">
                {/* Header Skeleton */}
                <div className="mb-8">
                    <div className="h-10 w-40 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4" />
                    <div className="flex items-center gap-3">
                        <div className="w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                        <div className="space-y-2">
                            <div className="h-7 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
                            <div className="h-4 w-60 bg-gray-200 dark:bg-gray-700 rounded" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Sidebar Skeleton */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
                            <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg" />
                        </div>
                    </div>

                    {/* Main Content Skeleton */}
                    <div className="lg:col-span-2 space-y-6">
                        {[1, 2, 3, 4, 5].map((item) => (
                            <div
                                key={item}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                            >
                                <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
                                <div className="space-y-4">
                                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const AdminUpdateProduct = ({ slug }) => {
    const router = useRouter();
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [hasNewImage, setHasNewImage] = useState(false);

    // Fetch existing product data
    const {
        data: productData,
        isLoading: productLoading,
        isError: productError,
    } = useAdminProduct(slug);

    // Fetch categories
    const {
        data: categories,
        isLoading: categoriesLoading,
        isError: categoriesError,
    } = useCategories();

    // Form setup with validation
    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
        setValue,
        watch,
        control,
        reset,
        getValues,
    } = useForm({
        resolver: yupResolver(productValidationSchema),
        defaultValues: defaultProductValues,
        mode: 'onBlur',
    });

    // Watch critical fields
    const watchedCategoryId = watch('category_id');
    const watchedSubcategoryId = watch('subcategory_id');

    // Get subcategories based on selected category
    const subcategories = useMemo(() => {
        if (!watchedCategoryId || !categories?.length) return [];
        const selectedCategory = categories.find(
            (cat) => cat.id === parseInt(watchedCategoryId)
        );
        return selectedCategory?.subcategory || [];
    }, [watchedCategoryId, categories]);

    // Reset subcategory when category changes
    useEffect(() => {
        if (watchedCategoryId && productData) {
            const currentSubcategoryId = getValues('subcategory_id');
            const isValidSubcategory = subcategories.some(
                (sub) => sub.id.toString() === currentSubcategoryId
            );

            if (currentSubcategoryId && !isValidSubcategory) {
                setValue('subcategory_id', '', { shouldValidate: true });
            }
        }
    }, [watchedCategoryId, subcategories, setValue, getValues, productData]);

    // Populate form with product data when loaded (only once)
    useEffect(() => {
        if (productData && !isDirty) {
            const formData = {
                category_id: productData.category?.id?.toString() || '',
                subcategory_id: productData.subcategory?.id?.toString() || '',
                title: productData.title || '',
                sub_title: productData.sub_title || '',
                keywords: productData.keywords || '',
                description: productData.description || '',
                ingredients: productData.ingredients || '',
                is_featured: Boolean(productData.is_featured),
                brands: productData.brands || '',
                status: productData.status || 'in_stock',
                pack_size: productData.pack_size || '',
                price: productData.price?.toString() || '',
                discount_price: productData.discount_price?.toString() || '',
                stock: productData.stock?.toString() || '',
            };

            reset(formData);

            // Set initial image preview
            if (productData.image) {
                setImagePreview(productData.image);
                setHasNewImage(false);
            }
        }
    }, [productData, reset, isDirty]);

    // Update product mutation
    const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();

    // Memoized category options
    const categoryOptions = useMemo(() => {
        if (!categories?.length) return [{ value: '', text: 'Loading categories...' }];
        return [
            { value: '', text: 'Select a category' },
            ...categories.map((category) => ({
                value: category.id.toString(),
                text: category.title,
            })),
        ];
    }, [categories]);

    // Memoized subcategory options
    const subcategoryOptions = useMemo(() => {
        if (!subcategories?.length)
            return [{ value: '', text: 'No subcategories available' }];
        return [
            { value: '', text: 'Select a subcategory' },
            ...subcategories.map((subcategory) => ({
                value: subcategory.id.toString(),
                text: subcategory.title,
            })),
        ];
    }, [subcategories]);

    // Status options
    const statusOptions = useMemo(
        () => [
            { value: 'in_stock', text: 'In Stock' },
            { value: 'out_of_stock', text: 'Out of Stock' },
            { value: 'low_stock', text: 'Low Stock' },
        ],
        []
    );

    // Convert file to base64
    const convertToBase64 = useCallback((file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }, []);

    // Handle image upload
    const handleImageChange = useCallback(
        async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            // Validate file type
            if (!file.type.startsWith('image/')) {
                Toast.error('Please select a valid image file');
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                Toast.error('Image size should not exceed 5MB');
                return;
            }

            try {
                const base64String = await convertToBase64(file);
                setImageFile(base64String);
                setImagePreview(base64String);
                setHasNewImage(true);
            } catch (error) {
                Toast.error('Failed to process image. Please try again.');
            }
        },
        [convertToBase64]
    );

    // Remove image
    const handleRemoveImage = useCallback(() => {
        setImageFile(null);
        setImagePreview(productData?.image || null);
        setHasNewImage(false);
    }, [productData]);

    // Form submission handler
    const onSubmit = useCallback(
        async (formData) => {
            // Build clean product data payload (without productSlug)
            const productPayload = {
                category_id: formData.category_id,
                subcategory_id: formData.subcategory_id || null,
                title: formData.title,
                sub_title: formData.sub_title || '',
                keywords: formData.keywords || '',
                description: formData.description || '',
                ingredients: formData.ingredients || '',
                brands: formData.brands || '',
                pack_size: formData.pack_size || '',
                status: formData.status || 'in_stock',
                is_featured: Boolean(formData.is_featured),
                price: parseFloat(formData.price) || 0,
                stock: parseInt(formData.stock, 10) || 0,
                discount_price: formData.discount_price
                    ? parseFloat(formData.discount_price)
                    : null,
            };

            // Only include image if a new one was uploaded
            if (hasNewImage && imageFile) {
                productPayload.image = imageFile;
            }

            // Call mutation with properly separated slug and data
            updateProduct(
                {
                    productSlug: slug, // Use slug from props, not productData
                    productData: productPayload,
                },
                {
                    onSuccess: (response) => {
                        Toast.success(
                            response?.message || 'Product updated successfully!',
                            'All changes have been saved.'
                        );
                        // Reset image state
                        setHasNewImage(false);
                        setImageFile(null);
                        // Navigate after short delay to show success message
                        setTimeout(() => {
                            router.push('/dashboard/products');
                        }, 1000);
                    },
                    onError: (error) => {
                        const message =
                            error?.response?.data?.message || 'Failed to update product';
                        const errors = error?.response?.data?.errors;

                        if (errors) {
                            const firstError = Object.values(errors)[0];
                            Toast.error(Array.isArray(firstError) ? firstError[0] : firstError);
                        } else {
                            Toast.error(message);
                        }
                    },
                }
            );
        },
        [updateProduct, imageFile, hasNewImage, slug, router]
    );

    // Handle navigation back
    const handleGoBack = useCallback(() => {
        if (isDirty || hasNewImage) {
            const confirmed = window.confirm(
                'You have unsaved changes. Are you sure you want to leave?'
            );
            if (!confirmed) return;
        }
        router.push('/dashboard/products');
    }, [router, isDirty, hasNewImage]);

    // Loading state with skeleton
    if (productLoading || categoriesLoading) {
        return <ProductFormSkeleton />;
    }

    // Error state - Categories
    if (categoriesError) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
                        <Package className="w-8 h-8 text-red-600 dark:text-red-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        Failed to Load Form
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                        Unable to load categories. Please check your connection and try again.
                    </p>
                    <div className="flex gap-3 justify-center">
                        <Button
                            variant="outline"
                            color="gray"
                            onClick={() => window.location.reload()}
                        >
                            Try Again
                        </Button>
                        <Button onClick={() => router.push('/dashboard/products')}>
                            Go Back to Products
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // Product not found
    if (productError || !productData) {
        return (
            <div className="relative bg-gradient-to-br from-orange-50 via-white to-orange-50/30 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 rounded-2xl border border-orange-100 dark:border-orange-900/30 overflow-hidden">
                {/* Decorative Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
                                <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="1" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                </div>

                {/* Decorative Blobs */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-200/20 dark:bg-orange-500/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-orange-300/20 dark:bg-orange-400/5 rounded-full blur-3xl" />

                {/* Content */}
                <div className="relative px-6 py-12 sm:px-12 sm:py-16">
                    <div className="max-w-md mx-auto text-center space-y-6">
                        {/* Icon with Animated Ring */}
                        <div className="relative inline-flex items-center justify-center mb-2">
                            <div className="absolute inset-0 bg-orange-100 dark:bg-orange-900/20 rounded-full animate-ping opacity-20" />
                            <div className="relative flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/20 rounded-2xl shadow-lg border border-orange-200/50 dark:border-orange-800/30">
                                <Package className="w-10 h-10 text-orange-600 dark:text-orange-400" />
                            </div>
                        </div>

                        {/* Title */}
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                Product Not Found
                            </h3>
                            <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                                We couldn't find the product you're looking for. It may have been removed or doesn't exist.
                            </p>
                        </div>

                        {/* Divider */}
                        <div className="relative py-3">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-orange-200/50 dark:border-orange-800/30" />
                            </div>
                            <div className="relative flex justify-center">
                                <span className="px-4 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gradient-to-br from-orange-50 via-white to-orange-50/30 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
                                    What would you like to do?
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                            <Button
                                onClick={() => router.push('/dashboard/products')}
                                startIcon={<ArrowLeft className="w-4 h-4" />}
                                className="shadow-lg hover:shadow-xl"
                            >
                                Back to Products
                            </Button>
                            <Button
                                onClick={() => window.location.reload()}
                                variant="outline"
                                className="bg-white dark:bg-gray-800"
                            >
                                Refresh Page
                            </Button>
                        </div>

                        {/* Helper Text */}
                        <p className="text-xs text-gray-500 dark:text-gray-500 pt-2">
                            Need help? Contact our{' '}
                            <button
                                onClick={() => router.push('/dashboard/support')}
                                className="text-orange-600 dark:text-orange-400 hover:underline font-medium"
                            >
                                support team
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Button
                        variant="outline"
                        color="gray"
                        startIcon={<ArrowLeft className="w-4 h-4" />}
                        onClick={handleGoBack}
                        className="mb-4"
                        disabled={isUpdating}
                    >
                        Back to Products
                    </Button>

                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                            <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                Edit Product
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-0">
                                Update product information and settings
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Sidebar - Image Upload */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                    Product Image
                                </h2>
                                <div className="space-y-4">
                                    {!imagePreview ? (
                                        <label className="flex flex-col items-center justify-center w-full aspect-square border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors">
                                            <div className="flex flex-col items-center justify-center py-6 px-4">
                                                <ImageIcon className="w-12 h-12 text-gray-400 mb-3" />
                                                <p className="mb-2 text-sm text-center text-gray-600 dark:text-gray-400">
                                                    <span className="font-semibold">
                                                        Click to upload
                                                    </span>
                                                </p>
                                                <p className="text-xs text-center text-gray-500 dark:text-gray-500">
                                                    PNG, JPG, WEBP
                                                </p>
                                                <p className="text-xs text-center text-gray-500 dark:text-gray-500">
                                                    Max 5MB
                                                </p>
                                            </div>
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                disabled={isUpdating}
                                            />
                                        </label>
                                    ) : (
                                        <div className="relative aspect-square">
                                            <img
                                                src={imagePreview}
                                                alt="Product preview"
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                            {hasNewImage && (
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveImage}
                                                    disabled={isUpdating}
                                                    className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    aria-label="Remove image"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            )}
                                            <label className="absolute bottom-2 right-2 px-4 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg shadow-lg transition-colors cursor-pointer text-sm font-medium border border-gray-200 dark:border-gray-600">
                                                Change Image
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                    disabled={isUpdating}
                                                />
                                            </label>
                                        </div>
                                    )}
                                    <div className={`border rounded-lg p-3 ${hasNewImage
                                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                                        : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                                        }`}>
                                        <p className={`text-xs ${hasNewImage
                                            ? 'text-green-700 dark:text-green-300'
                                            : 'text-blue-700 dark:text-blue-300'
                                            }`}>
                                            {hasNewImage
                                                ? '✓ New image selected. Click "Save Changes" to update.'
                                                : 'Current product image displayed'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Content Area - Form Fields */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Basic Information Card */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                    Basic Information
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <InputForm
                                            label="Product Title"
                                            name="title"
                                            register={register}
                                            error={errors.title?.message}
                                            placeholder="Enter product title"
                                            required
                                            disabled={isUpdating}
                                        />
                                    </div>

                                    <InputForm
                                        label="Subtitle"
                                        name="sub_title"
                                        register={register}
                                        error={errors.sub_title?.message}
                                        placeholder="Enter product subtitle (optional)"
                                        disabled={isUpdating}
                                    />

                                    <InputForm
                                        label="Brand"
                                        name="brands"
                                        register={register}
                                        error={errors.brands?.message}
                                        placeholder="Enter brand name"
                                        disabled={isUpdating}
                                    />

                                    <div className="md:col-span-2">
                                        <InputForm
                                            label="Keywords"
                                            name="keywords"
                                            register={register}
                                            error={errors.keywords?.message}
                                            placeholder="SEO keywords (comma separated)"
                                            disabled={isUpdating}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Category & Classification Card */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                    Category & Classification
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <SingleSelectForm
                                        label="Category"
                                        name="category_id"
                                        options={categoryOptions}
                                        register={register}
                                        setValue={setValue}
                                        error={errors.category_id?.message}
                                        placeholder="Select a category"
                                        searchable
                                        required
                                        disabled={isUpdating}
                                        defaultValue={watchedCategoryId}
                                    />

                                    <SingleSelectForm
                                        label="Subcategory"
                                        name="subcategory_id"
                                        options={subcategoryOptions}
                                        register={register}
                                        setValue={setValue}
                                        error={errors.subcategory_id?.message}
                                        placeholder={
                                            watchedCategoryId
                                                ? 'Select a subcategory'
                                                : 'Select a category first'
                                        }
                                        disabled={!watchedCategoryId || isUpdating}
                                        searchable
                                        defaultValue={watchedSubcategoryId}
                                    />
                                </div>
                            </div>

                            {/* Detailed Description Card */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                    Detailed Description
                                </h2>
                                <div className="space-y-4">
                                    <TextareaForm
                                        label="Product Description"
                                        name="description"
                                        register={register}
                                        error={errors.description?.message}
                                        placeholder="Describe your product in detail..."
                                        rows={6}
                                        resize="vertical"
                                        disabled={isUpdating}
                                    />

                                    <TextareaForm
                                        label="Ingredients"
                                        name="ingredients"
                                        register={register}
                                        error={errors.ingredients?.message}
                                        placeholder="List product ingredients or components (optional)..."
                                        rows={4}
                                        resize="vertical"
                                        disabled={isUpdating}
                                    />
                                </div>
                            </div>

                            {/* Pricing & Inventory Card */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                    Pricing & Inventory
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputForm
                                        label="Price"
                                        name="price"
                                        type="number"
                                        register={register}
                                        error={errors.price?.message}
                                        placeholder="0.00"
                                        required
                                        disabled={isUpdating}
                                    />

                                    <InputForm
                                        label="Discount Price"
                                        name="discount_price"
                                        type="number"
                                        register={register}
                                        error={errors.discount_price?.message}
                                        placeholder="0.00 (optional)"
                                        disabled={isUpdating}
                                    />

                                    <InputForm
                                        label="Stock Quantity"
                                        name="stock"
                                        type="number"
                                        register={register}
                                        error={errors.stock?.message}
                                        placeholder="0"
                                        required
                                        disabled={isUpdating}
                                    />

                                    <InputForm
                                        label="Pack Size"
                                        name="pack_size"
                                        register={register}
                                        error={errors.pack_size?.message}
                                        placeholder="e.g., 500g, 1L, 12 pack"
                                        disabled={isUpdating}
                                    />
                                </div>
                            </div>

                            {/* Product Settings Card */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                    Product Settings
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <SingleSelectForm
                                        label="Status"
                                        name="status"
                                        options={statusOptions}
                                        register={register}
                                        setValue={setValue}
                                        error={errors.status?.message}
                                        placeholder="Select product status"
                                        defaultValue={watch('status')}
                                        disabled={isUpdating}
                                    />

                                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
                                        <div>
                                            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                Featured Product
                                            </label>
                                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                                Display in featured sections
                                            </p>
                                        </div>
                                        <SwitchForm
                                            name="is_featured"
                                            control={control}
                                            error={errors.is_featured?.message}
                                            color="blue"
                                            disabled={isUpdating}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <Button
                                    type="button"
                                    variant="outline"
                                    color="gray"
                                    onClick={handleGoBack}
                                    disabled={isUpdating}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    type="submit"
                                    color="blue"
                                    startIcon={<Save className="w-4 h-4" />}
                                    loading={isUpdating}
                                    disabled={isUpdating}
                                >
                                    {isUpdating ? 'Saving Changes...' : 'Save Changes'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminUpdateProduct;