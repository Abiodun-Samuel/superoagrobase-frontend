'use client';

import { useCallback, useState, lazy, Suspense, useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    FileText,
    Save,
    X,
    Image as ImageIcon,
    Loader2,
    ChevronDown,
    ChevronUp,
    AlertCircle,
    Pencil,
} from 'lucide-react';

import InputForm from '@/components/form/InputForm';
import TextareaForm from '@/components/form/TextareaForm';
import SingleSelectForm from '@/components/form/SingleSelectForm';
import SwitchForm from '@/components/form/SwitchForm';
import TagsInput from '@/components/form/TagsInput';
import Button from '@/components/ui/Button';
import { blogValidationSchema } from '@/validation/schema';
import { useBlog, useUpdateBlog } from '@/queries/blogs.query';
import Toast from '@/lib/toastify';
import AdminEditBlogSkeleton from './AdminEditBlogSkeleton';

const TiptapEditor = lazy(() => import('@/components/editor/TiptapEditor'));

const STATUS_OPTIONS = [
    { value: 'draft', text: 'Draft' },
    { value: 'published', text: 'Published' },
];

const AdminEditBlog = ({ slug }) => {
    const router = useRouter();
    const imageInputRef = useRef(null);

    const [imagePreview, setImagePreview] = useState(null);
    const [imageBase64, setImageBase64] = useState('');
    const [isImageChanged, setIsImageChanged] = useState(false);
    const [showSeoSection, setShowSeoSection] = useState(false);

    const { data: blog, isLoading: isFetchingBlog, isError: fetchError } = useBlog(slug);
    const { mutate: updateBlog, isPending: isUpdating } = useUpdateBlog();

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
        setValue,
        watch,
        control,
        reset,
    } = useForm({
        resolver: yupResolver(blogValidationSchema),
        mode: 'onBlur',
    });

    const excerptLength = watch('excerpt')?.length ?? 0;
    const metaTitleLength = watch('meta_title')?.length ?? 0;
    const metaDescLength = watch('meta_description')?.length ?? 0;

    // Populate form once blog data is available
    useEffect(() => {
        if (!blog) return;

        reset({
            title: blog.title ?? '',
            excerpt: blog.excerpt ?? '',
            content: blog.content ?? '',
            featured_image: blog.featured_image ?? '',
            category: blog.category ?? '',
            tags: blog.tags ?? [],
            status: blog.status ?? 'draft',
            is_featured: blog.is_featured ?? false,
            meta_title: blog.meta_title ?? '',
            meta_description: blog.meta_description ?? '',
        });

        if (blog.featured_image) {
            setImagePreview(blog.featured_image);
            setImageBase64(blog.featured_image);
        }

        if (blog.meta_title || blog.meta_description) {
            setShowSeoSection(true);
        }
    }, [blog, reset]);

    // ─── Image handling ────────────────────────────────────────────────────────

    const convertToBase64 = useCallback(
        (file) =>
            new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            }),
        []
    );

    const processImageFile = useCallback(
        async (file) => {
            if (!file.type.startsWith('image/')) {
                Toast.error('Please select a valid image file');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                Toast.error('Image size should not exceed 5MB');
                return;
            }
            try {
                const base64 = await convertToBase64(file);
                setImageBase64(base64);
                setImagePreview(base64);
                setIsImageChanged(true);
                setValue('featured_image', base64);
            } catch {
                Toast.error('Failed to process image. Please try again.');
            }
        },
        [convertToBase64, setValue]
    );

    const handleImageInputChange = useCallback(
        async (e) => {
            const file = e.target.files?.[0];
            // Reset the input value so the same file can be re-selected
            e.target.value = '';
            if (!file) return;
            await processImageFile(file);
        },
        [processImageFile]
    );

    const handleChangeImageClick = useCallback(() => {
        imageInputRef.current?.click();
    }, []);

    const handleRemoveImage = useCallback(() => {
        setImageBase64('');
        setImagePreview(null);
        setIsImageChanged(true);
        setValue('featured_image', '');
    }, [setValue]);

    // ─── Navigation ───────────────────────────────────────────────────────────

    const handleGoBack = useCallback(() => {
        if (
            (isDirty || isImageChanged) &&
            !window.confirm('You have unsaved changes. Are you sure you want to leave?')
        ) {
            return;
        }
        router.push('/dashboard/blogs');
    }, [isDirty, isImageChanged, router]);

    // ─── Submit ───────────────────────────────────────────────────────────────

    const onSubmit = useCallback(
        (data) => {
            const payload = {
                ...data,
                tags: data.tags?.length > 0 ? data.tags : undefined,
                featured_image: isImageChanged ? imageBase64 || null : undefined,
            };

            // Strip empty / undefined fields
            Object.keys(payload).forEach((key) => {
                if (payload[key] === '' || payload[key] === undefined) {
                    delete payload[key];
                }
            });

            updateBlog(
                { slug, payload },
                {
                    onSuccess: (res) => {
                        Toast.success(
                            res?.message ?? 'Blog updated successfully!',
                            'The blog post has been updated.'
                        );
                        router.push('/dashboard/blogs');
                    },
                    onError: (error) => {
                        const serverErrors = error?.response?.data?.errors;
                        const message = error?.response?.data?.message ?? 'Failed to update blog';

                        if (serverErrors) {
                            const first = Object.values(serverErrors)[0];
                            Toast.error(Array.isArray(first) ? first[0] : first);
                        } else {
                            Toast.error(message);
                        }
                    },
                }
            );
        },
        [updateBlog, imageBase64, isImageChanged, router, slug]
    );

    // ─── Render: loading / error states ───────────────────────────────────────

    if (isFetchingBlog) return <AdminEditBlogSkeleton />;

    if (fetchError) {
        return (
            <div className="mt-20 bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
                        <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        Failed to Load Blog Post
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                        Unable to load blog post. The blog may not exist or there was a connection
                        error.
                    </p>
                    <div className="flex gap-3 justify-center">
                        <Button
                            variant="outline"
                            color="gray"
                            onClick={() => window.location.reload()}
                        >
                            Try Again
                        </Button>
                        <Button onClick={() => router.push('/dashboard/blogs')}>
                            Go Back to Blogs
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // ─── Render: main form ────────────────────────────────────────────────────

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
                        Back to Blogs
                    </Button>

                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                            <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                Edit Blog Post
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-0">
                                Update and refine your blog content
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* ── Sidebar ─────────────────────────────────────── */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Featured Image */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                    Featured Image
                                </h2>

                                {/*
                                 * Always-mounted hidden input — keeps the ref stable across
                                 * preview state changes so clicking Change/upload never breaks.
                                 */}
                                <input
                                    ref={imageInputRef}
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageInputChange}
                                    disabled={isUpdating}
                                />

                                <div className="space-y-3">
                                    {imagePreview ? (
                                        <>
                                            <div className="relative aspect-video rounded-lg overflow-hidden ring-1 ring-gray-200 dark:ring-gray-700">
                                                <img
                                                    src={imagePreview}
                                                    alt="Featured preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={handleChangeImageClick}
                                                    disabled={isUpdating}
                                                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <Pencil className="w-3.5 h-3.5" />
                                                    Change
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveImage}
                                                    disabled={isUpdating}
                                                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <X className="w-3.5 h-3.5" />
                                                    Remove
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={handleChangeImageClick}
                                            disabled={isUpdating}
                                            className="flex flex-col items-center justify-center w-full aspect-video border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <ImageIcon className="w-12 h-12 text-gray-400 mb-3" />
                                            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                                                Click to upload
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                                PNG, JPG, WEBP (Max 5MB)
                                            </p>
                                        </button>
                                    )}

                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Optional: Add a featured image to make your blog post more
                                        appealing
                                    </p>
                                </div>
                            </div>

                            {/* Publishing Settings */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                    Publishing Settings
                                </h2>
                                <div className="space-y-4">
                                    {/*
                                     * Controller is required here — not the register+value hybrid.
                                     * When reset() fires, react-hook-form updates its internal
                                     * store. Controller subscribes to that store, so field.value
                                     * always reflects the reset value. register() only syncs
                                     * through the DOM (ref), so uncontrolled custom selects like
                                     * SingleSelectForm never receive the reset value via register.
                                     */}
                                    <Controller
                                        name="status"
                                        control={control}
                                        render={({ field }) => (
                                            <SingleSelectForm
                                                label="Status"
                                                name={field.name}
                                                options={STATUS_OPTIONS}
                                                value={field.value}
                                                onChange={field.onChange}
                                                onBlur={field.onBlur}
                                                error={errors.status?.message}
                                                disabled={isUpdating}
                                            />
                                        )}
                                    />

                                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                Featured Post
                                            </p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                                Display in featured sections
                                            </p>
                                        </div>
                                        <SwitchForm
                                            name="is_featured"
                                            control={control}
                                            error={errors.is_featured?.message}
                                            color="purple"
                                            disabled={isUpdating}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Main content ─────────────────────────────────── */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Basic Information */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                    Basic Information
                                </h2>
                                <div className="space-y-4">
                                    <InputForm
                                        label="Blog Title"
                                        name="title"
                                        register={register}
                                        error={errors.title?.message}
                                        placeholder="Enter an engaging blog title"
                                        required
                                        disabled={isUpdating}
                                    />

                                    <div>
                                        <TextareaForm
                                            label="Excerpt"
                                            name="excerpt"
                                            register={register}
                                            error={errors.excerpt?.message}
                                            placeholder="Write a compelling excerpt that summarizes your blog post..."
                                            rows={3}
                                            resize="vertical"
                                            required
                                            disabled={isUpdating}
                                            maxLength={500}
                                        />
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            {excerptLength}/500 characters
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InputForm
                                            label="Category"
                                            name="category"
                                            register={register}
                                            error={errors.category?.message}
                                            placeholder="e.g., Technology, Health, Business"
                                            disabled={isUpdating}
                                        />

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Tags
                                            </label>
                                            <Controller
                                                name="tags"
                                                control={control}
                                                render={({ field }) => (
                                                    <TagsInput
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        error={errors.tags?.message}
                                                        disabled={isUpdating}
                                                        placeholder="Add tags..."
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Content Editor */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                    Blog Content
                                </h2>
                                <Controller
                                    name="content"
                                    control={control}
                                    render={({ field }) => (
                                        <Suspense
                                            fallback={
                                                <div className="flex items-center justify-center h-64 border border-gray-300 dark:border-gray-600 rounded-lg">
                                                    <Loader2 className="w-8 h-8 animate-spin text-purple-600 dark:text-purple-400" />
                                                </div>
                                            }
                                        >
                                            <TiptapEditor
                                                content={field.value}
                                                onChange={field.onChange}
                                                error={errors.content?.message}
                                                placeholder="Start writing your amazing blog post..."
                                            />
                                        </Suspense>
                                    )}
                                />
                            </div>

                            {/* SEO Settings (Collapsible) */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                                <button
                                    type="button"
                                    onClick={() => setShowSeoSection((prev) => !prev)}
                                    className="w-full flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                >
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        SEO Settings (Optional)
                                    </h2>
                                    {showSeoSection ? (
                                        <ChevronUp className="w-5 h-5 text-gray-500" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-500" />
                                    )}
                                </button>

                                {showSeoSection && (
                                    <div className="p-6 pt-0 space-y-4">
                                        <div>
                                            <InputForm
                                                label="Meta Title"
                                                name="meta_title"
                                                register={register}
                                                error={errors.meta_title?.message}
                                                placeholder="SEO-optimized title for search engines"
                                                disabled={isUpdating}
                                                maxLength={255}
                                            />
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                {metaTitleLength}/255 characters
                                            </p>
                                        </div>

                                        <div>
                                            <TextareaForm
                                                label="Meta Description"
                                                name="meta_description"
                                                register={register}
                                                error={errors.meta_description?.message}
                                                placeholder="Brief description for search engine results..."
                                                rows={3}
                                                resize="vertical"
                                                disabled={isUpdating}
                                                maxLength={500}
                                            />
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                {metaDescLength}/500 characters
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
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
                                    color="purple"
                                    startIcon={<Save className="w-4 h-4" />}
                                    loading={isUpdating}
                                    disabled={isUpdating}
                                >
                                    {isUpdating ? 'Updating...' : 'Update Blog Post'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminEditBlog;