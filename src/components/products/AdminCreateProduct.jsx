'use client';

import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Package, Save, X, Image as ImageIcon, Loader2 } from 'lucide-react';

import InputForm from '@/components/form/InputForm';
import TextareaForm from '@/components/form/TextareaForm';
import SingleSelectForm from '@/components/form/SingleSelectForm';
import SwitchForm from '@/components/form/SwitchForm';
import Button from '@/components/ui/Button';
import { defaultProductValues, productValidationSchema } from '@/validation/schema';
import { useCategories } from '@/queries/categories.query';
import { useCreateProduct } from '@/queries/products.query';
import Toast from '@/lib/toastify';

const AdminCreateProduct = () => {
    const router = useRouter();
    const [imageBase64, setImageBase64] = useState('');
    const [imagePreview, setImagePreview] = useState(null);

    // Form setup with validation
    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
        setValue,
        watch,
        control,
    } = useForm({
        resolver: yupResolver(productValidationSchema),
        defaultValues: defaultProductValues,
        mode: 'onBlur',
    });

    // Watch category for dynamic subcategory loading
    const watchedCategoryId = watch('category_id');

    // Fetch categories
    const { data: categories, isLoading: categoriesLoading, isError: categoriesError } = useCategories();

    // Get subcategories based on selected category
    const subcategories = useMemo(() => {
        if (!watchedCategoryId || !categories?.length) return [];
        const selectedCategory = categories?.find(
            cat => cat.id === parseInt(watchedCategoryId)
        );
        return selectedCategory?.subcategory || [];
    }, [watchedCategoryId, categories]);

    // Create product mutation
    const { mutate: createProduct, isPending: isCreating } = useCreateProduct();

    // Memoized category options
    const categoryOptions = useMemo(() => {
        if (!categories?.length) return [{ value: '', text: 'Loading categories...' }];
        return [
            { value: '', text: 'Select a category' },
            ...categories?.map((category) => ({
                value: category.id.toString(),
                text: category.title,
            }))
        ];
    }, [categories]);

    // Memoized subcategory options
    const subcategoryOptions = useMemo(() => {
        if (!subcategories?.length) return [{ value: '', text: 'No subcategories available' }];
        return [
            { value: '', text: 'Select a subcategory' },
            ...subcategories?.map((subcategory) => ({
                value: subcategory.id.toString(),
                text: subcategory.title,
            }))
        ];
    }, [subcategories]);

    // Status options
    const statusOptions = useMemo(() => [
        { value: 'in_stock', text: 'In Stock' },
        { value: 'out_of_stock', text: 'Out of Stock' },
        { value: 'low_stock', text: 'Low Stock' },
    ], []);

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
    const handleImageChange = useCallback(async (e) => {
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
            setImageBase64(base64String);
            setImagePreview(base64String);
        } catch (error) {
            Toast.error('Failed to process image. Please try again.');
        }
    }, [convertToBase64]);

    // Remove image
    const handleRemoveImage = useCallback(() => {
        setImageBase64('');
        setImagePreview(null);
    }, []);

    // Form submission handler
    const onSubmit = useCallback(async (data) => {
        // Validate image
        if (!imageBase64) {
            Toast.error('Please upload a product image');
            return;
        }

        // Prepare payload with base64 image
        const payload = {
            ...data,
            image: imageBase64,
            // Ensure proper data types
            price: parseFloat(data.price),
            stock: parseInt(data.stock, 10),
            discount_price: data.discount_price ? parseFloat(data.discount_price) : null,
            is_featured: data.is_featured || false,
        };

        createProduct(payload, {
            onSuccess: (response) => {
                Toast.success(
                    response?.message || 'Product created successfully!',
                    'The product has been added to your catalog.'
                );
                router.push('/dashboard/products');
            },
            onError: (error) => {
                const message = error?.response?.data?.message || 'Failed to create product';
                const errors = error?.response?.data?.errors;

                if (errors) {
                    const firstError = Object.values(errors)[0];
                    Toast.error(Array.isArray(firstError) ? firstError[0] : firstError);
                } else {
                    Toast.error(message);
                }
            },
        });
    }, [createProduct, imageBase64, router]);

    // Handle navigation back with unsaved changes check
    const handleGoBack = useCallback(() => {
        if (isDirty || imageBase64) {
            const confirmLeave = Toast.error(
                'You have unsaved changes. Are you sure you want to leave?'
            );
            if (!confirmLeave) return;
        }
        router.push('/dashboard/products');
    }, [isDirty, imageBase64, router]);

    // Loading state
    if (categoriesLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                        <Loader2 className="w-8 h-8 text-green-600 dark:text-green-400 animate-spin" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        Loading Form
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Please wait while we prepare the product form...
                    </p>
                </div>
            </div>
        );
    }

    // Error state
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
                        disabled={isCreating}
                    >
                        Back to Products
                    </Button>

                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                            <Package className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                Create New Product
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-0">
                                Add a new product to your catalog
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Sidebar - Image Upload */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Product Image Upload Card */}
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
                                                    <span className="font-semibold">Click to upload</span>
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
                                                disabled={isCreating}
                                            />
                                        </label>
                                    ) : (
                                        <div className="relative aspect-square">
                                            <img
                                                src={imagePreview}
                                                alt="Product preview"
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleRemoveImage}
                                                disabled={isCreating}
                                                className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                aria-label="Remove image"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                                        <p className="text-xs text-amber-800 dark:text-amber-200 font-medium">
                                            ⚠️ Image Required
                                        </p>
                                        <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                                            Please upload a product image before submitting
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
                                            disabled={isCreating}
                                        />
                                    </div>

                                    <InputForm
                                        label="Subtitle"
                                        name="sub_title"
                                        register={register}
                                        error={errors.sub_title?.message}
                                        placeholder="Enter product subtitle (optional)"
                                        disabled={isCreating}
                                    />

                                    <InputForm
                                        label="Brand"
                                        name="brands"
                                        register={register}
                                        error={errors.brands?.message}
                                        placeholder="Enter brand name"
                                        disabled={isCreating}
                                    />

                                    <div className="md:col-span-2">
                                        <InputForm
                                            label="Keywords"
                                            name="keywords"
                                            register={register}
                                            error={errors.keywords?.message}
                                            placeholder="SEO keywords (comma separated)"
                                            disabled={isCreating}
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
                                        disabled={isCreating}
                                        value={watchedCategoryId}
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
                                        disabled={!watchedCategoryId || isCreating}
                                        searchable
                                        value={watch('subcategory_id')}
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
                                        disabled={isCreating}
                                    />

                                    <TextareaForm
                                        label="Ingredients"
                                        name="ingredients"
                                        register={register}
                                        error={errors.ingredients?.message}
                                        placeholder="List product ingredients or components (optional)..."
                                        rows={4}
                                        resize="vertical"
                                        disabled={isCreating}
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
                                        min="0"
                                        step="0.01"
                                        disabled={isCreating}
                                    />

                                    <InputForm
                                        label="Discount Price"
                                        name="discount_price"
                                        type="number"
                                        register={register}
                                        error={errors.discount_price?.message}
                                        placeholder="0.00 (optional)"
                                        min="0"
                                        step="0.01"
                                        disabled={isCreating}
                                    />

                                    <InputForm
                                        label="Stock Quantity"
                                        name="stock"
                                        type="number"
                                        register={register}
                                        error={errors.stock?.message}
                                        placeholder="0"
                                        required
                                        min="0"
                                        disabled={isCreating}
                                    />

                                    <InputForm
                                        label="Pack Size"
                                        name="pack_size"
                                        register={register}
                                        error={errors.pack_size?.message}
                                        placeholder="e.g., 500g, 1L, 12 pack"
                                        disabled={isCreating}
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
                                        value={watch('status') || 'in_stock'}
                                        disabled={isCreating}
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
                                            color="green"
                                            disabled={isCreating}
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
                                    disabled={isCreating}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    type="submit"
                                    color="green"
                                    startIcon={<Save className="w-4 h-4" />}
                                    loading={isCreating}
                                    disabled={isCreating}
                                >
                                    {isCreating ? 'Creating Product...' : 'Create Product'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminCreateProduct;