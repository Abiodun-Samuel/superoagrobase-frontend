'use client';

import { useCallback, useMemo, useState, lazy, Suspense } from 'react';
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
    Calendar,
} from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import InputForm from '@/components/form/InputForm';
import TextareaForm from '@/components/form/TextareaForm';
import SingleSelectForm from '@/components/form/SingleSelectForm';
import SwitchForm from '@/components/form/SwitchForm';
import TagsInput from '@/components/form/TagsInput';
import Button from '@/components/ui/Button';
import { defaultBlogValues, blogValidationSchema } from '@/validation/schema';
import { useCreateBlog } from '@/queries/blogs.query';
import Toast from '@/lib/toastify';

const TiptapEditor = lazy(() => import('@/components/editor/TiptapEditor'));

const AdminCreateBlog = () => {
    const router = useRouter();
    const [imageBase64, setImageBase64] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [showSeoSection, setShowSeoSection] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
        setValue,
        watch,
        control,
    } = useForm({
        resolver: yupResolver(blogValidationSchema),
        defaultValues: defaultBlogValues,
        mode: 'onBlur',
    });

    const watchedStatus = watch('status');
    const watchedContent = watch('content');

    const { mutate: createBlog, isPending: isCreating } = useCreateBlog();

    const generateSlug = useCallback((title) =>
        title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-'),
        []
    );

    const statusOptions = useMemo(
        () => [
            { value: 'draft', text: 'Draft' },
            { value: 'published', text: 'Published' },
        ],
        []
    );

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

    const handleImageChange = useCallback(
        async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            if (!file.type.startsWith('image/')) {
                Toast.error('Please select a valid image file');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                Toast.error('Image size should not exceed 5MB');
                return;
            }

            try {
                const base64String = await convertToBase64(file);
                setImageBase64(base64String);
                setImagePreview(base64String);
                setValue('featured_image', base64String);
            } catch {
                Toast.error('Failed to process image. Please try again.');
            }
        },
        [convertToBase64, setValue]
    );

    const handleRemoveImage = useCallback(() => {
        setImageBase64('');
        setImagePreview(null);
        setValue('featured_image', '');
    }, [setValue]);

    const onSubmit = useCallback(
        async (data) => {
            const payload = {
                ...data,
                slug: generateSlug(data.title),
                tags: data.tags?.length > 0 ? data.tags : undefined,
                featured_image: imageBase64 || undefined,
            };

            Object.keys(payload).forEach((key) => {
                if (payload[key] === '' || payload[key] === null) {
                    delete payload[key];
                }
            });

            createBlog(payload, {
                onSuccess: (response) => {
                    Toast.success(
                        response?.message || 'Blog created successfully!',
                        'The blog post has been added to your collection.'
                    );
                    router.push('/dashboard/blogs');
                },
                onError: (error) => {
                    const message = error?.response?.data?.message || 'Failed to create blog';
                    const errors = error?.response?.data?.errors;

                    if (errors) {
                        const firstError = Object.values(errors)[0];
                        Toast.error(Array.isArray(firstError) ? firstError[0] : firstError);
                    } else {
                        Toast.error(message);
                    }
                },
            });
        },
        [createBlog, imageBase64, router, generateSlug]
    );

    const handleGoBack = useCallback(() => {
        if (isDirty || imageBase64 || watchedContent) {
            if (!window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
                return;
            }
        }
        router.push('/dashboard/blogs');
    }, [isDirty, imageBase64, watchedContent, router]);

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
                        Back to Blogs
                    </Button>

                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                            <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                Create New Blog Post
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-0">
                                Share your thoughts and insights with your audience
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Sidebar */}
                        <div className="lg:col-span-1 space-y-6">

                            {/* Featured Image */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                    Featured Image
                                </h2>
                                <div className="space-y-3">
                                    {!imagePreview ? (
                                        <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors">
                                            <div className="flex flex-col items-center justify-center py-6 px-4">
                                                <ImageIcon className="w-10 h-10 text-gray-400 mb-3" />
                                                <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                                                    <span className="font-semibold">Click to upload</span>
                                                </p>
                                                <p className="text-xs text-center text-gray-500 mt-1">
                                                    PNG, JPG, WEBP — max 5MB
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
                                        <div className="relative aspect-video">
                                            <img
                                                src={imagePreview}
                                                alt="Featured preview"
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleRemoveImage}
                                                disabled={isCreating}
                                                className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                aria-label="Remove image"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Publishing Settings */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                    Publishing
                                </h2>
                                <div className="space-y-4">
                                    <SingleSelectForm
                                        label="Status"
                                        name="status"
                                        options={statusOptions}
                                        register={register}
                                        setValue={setValue}
                                        error={errors.status?.message}
                                        value={watchedStatus}
                                        disabled={isCreating}
                                    />

                                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                Featured Post
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                Show in featured sections
                                            </p>
                                        </div>
                                        <SwitchForm
                                            name="is_featured"
                                            control={control}
                                            error={errors.is_featured?.message}
                                            color="purple"
                                            disabled={isCreating}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
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
                                        disabled={isCreating}
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
                                            disabled={isCreating}
                                            maxLength={500}
                                        />
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            {watch('excerpt')?.length || 0}/500 characters
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InputForm
                                            label="Category"
                                            name="category"
                                            register={register}
                                            error={errors.category?.message}
                                            placeholder="e.g., Technology, Health"
                                            disabled={isCreating}
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
                                                        disabled={isCreating}
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
                                        SEO Settings{' '}
                                        <span className="text-sm font-normal text-gray-400">(Optional)</span>
                                    </h2>
                                    {showSeoSection
                                        ? <ChevronUp className="w-5 h-5 text-gray-400" />
                                        : <ChevronDown className="w-5 h-5 text-gray-400" />
                                    }
                                </button>

                                {showSeoSection && (
                                    <div className="px-6 pb-6 space-y-4">
                                        <div>
                                            <InputForm
                                                label="Meta Title"
                                                name="meta_title"
                                                register={register}
                                                error={errors.meta_title?.message}
                                                placeholder="SEO-optimized title for search engines"
                                                disabled={isCreating}
                                                maxLength={255}
                                            />
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                {watch('meta_title')?.length || 0}/255 characters
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
                                                disabled={isCreating}
                                                maxLength={500}
                                            />
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                {watch('meta_description')?.length || 0}/500 characters
                                            </p>
                                        </div>
                                    </div>
                                )}
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
                                    color="purple"
                                    startIcon={<Save className="w-4 h-4" />}
                                    loading={isCreating}
                                    disabled={isCreating}
                                >
                                    {isCreating
                                        ? watchedStatus === 'published'
                                            ? 'Publishing...'
                                            : 'Saving Draft...'
                                        : watchedStatus === 'published'
                                            ? 'Publish Blog'
                                            : 'Save as Draft'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminCreateBlog;