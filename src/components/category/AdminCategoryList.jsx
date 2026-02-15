'use client';

import { useState, useMemo, useCallback, memo, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
    FolderOpen,
    Eye,
    Edit,
    Trash2,
    Plus,
    Package,
    Image as ImageIcon,
    X,
    RefreshCw,
} from 'lucide-react';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/queries/categories.query';
import Button from '@/components/ui/Button';
import TextBadge from '@/components/ui/TextBadge';
import IconBadge from '@/components/ui/IconBadge';
import InputForm from '@/components/form/InputForm';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/Table';
import ModalForm from '@/components/modal/ModalForm';
import Modal from '@/components/modal/Modal';
import { useModal } from '@/hooks/useModal';
import Toast from '@/lib/toastify';

// ==================== SKELETON LOADER ====================
const CategoryListSkeleton = memo(() => (
    <div className="animate-pulse">
        {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center gap-4 p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                </div>
                <div className="flex gap-2">
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
                </div>
            </div>
        ))}
    </div>
));
CategoryListSkeleton.displayName = 'CategoryListSkeleton';

// ==================== PAGE HEADER ====================
const PageHeader = memo(({ onAdd }) => (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                Categories
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Manage product categories and their subcategories
            </p>
        </div>
        <Button
            color="green"
            onClick={onAdd}
            startIcon={<Plus className="w-5 h-5" />}
        >
            Add Category
        </Button>
    </div>
));
PageHeader.displayName = 'PageHeader';

// ==================== CATEGORY ROW ====================
const CategoryRow = memo(({ category, onView, onEdit, onDelete }) => (
    <TableRow className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
        <TableCell className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                    {category.image ? (
                        <img
                            src={category.image}
                            alt={category.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-gray-400" />
                        </div>
                    )}
                </div>
                <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
                        {category.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Slug: {category.slug}
                    </p>
                </div>
            </div>
        </TableCell>
        <TableCell className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center gap-1">
                <FolderOpen className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {category.subcategory?.length || 0}
                </span>
            </div>
        </TableCell>
        <TableCell className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center gap-1">
                <Package className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {category.product_count || 0}
                </span>
            </div>
        </TableCell>
        <TableCell className="px-6 py-4 whitespace-nowrap">
            <div className="flex flex-wrap gap-1">
                {category.badges?.slice(0, 2).map((badge, index) => (
                    <TextBadge key={index} variant="light" color="purple" size="xs">
                        {badge}
                    </TextBadge>
                )) || <span className="text-xs text-gray-400">-</span>}
            </div>
        </TableCell>
        <TableCell className="px-6 py-4 whitespace-nowrap text-right">
            <div className="flex items-center justify-end gap-2">
                <IconBadge
                    variant="light"
                    color="blue"
                    size="sm"
                    shape="circle"
                    icon={<Eye className="w-4 h-4" />}
                    onClick={() => onView(category)}
                    ariaLabel="View category"
                />
                <IconBadge
                    variant="light"
                    color="green"
                    size="sm"
                    shape="circle"
                    icon={<Edit className="w-4 h-4" />}
                    onClick={() => onEdit(category)}
                    ariaLabel="Edit category"
                />
                <IconBadge
                    variant="light"
                    color="red"
                    size="sm"
                    shape="circle"
                    icon={<Trash2 className="w-4 h-4" />}
                    onClick={() => onDelete(category)}
                    ariaLabel="Delete category"
                />
            </div>
        </TableCell>
    </TableRow>
));
CategoryRow.displayName = 'CategoryRow';

// ==================== IMAGE UPLOAD SECTION ====================
const ImageUploadSection = memo(({ imagePreview, imageFile, isLoading, onImageChange, onRemoveImage, fileInputRef, imageError }) => {
    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Category Image
                <span className="text-red-500 ml-1">*</span>
            </label>

            {!imagePreview ? (
                // Upload Area
                <label className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${imageError ? 'border-red-400 dark:border-red-500 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-950/30' : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900'}`}>
                    <div className="flex flex-col items-center justify-center py-6 px-4">
                        <ImageIcon className="w-12 h-12 text-gray-400 mb-3" />
                        <p className="mb-2 text-sm text-center text-gray-600 dark:text-gray-400">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-center text-gray-500 dark:text-gray-500">
                            PNG, JPG, WEBP (Max 5MB)
                        </p>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={onImageChange}
                        disabled={isLoading}
                    />
                </label>
            ) : (
                // Image Preview
                <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 group">
                    <img
                        src={imagePreview}
                        alt="Category preview"
                        className="w-full h-full object-cover"
                    />

                    {/* Staged-update banner — always visible when a new file is picked */}
                    {imageFile && (
                        <div className="absolute top-0 inset-x-0 flex items-center justify-center gap-2 bg-amber-500/90 text-white text-xs font-semibold px-3 py-1.5 z-10 backdrop-blur-sm">
                            <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
                            Image staged — save to apply
                        </div>
                    )}

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
                        {/* Change Image Button */}
                        <label className="px-4 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg shadow-lg transition-colors cursor-pointer text-sm font-medium border border-gray-200 dark:border-gray-600">
                            Change Image
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={onImageChange}
                                disabled={isLoading}
                            />
                        </label>

                        {/* Remove Image Button */}
                        <button
                            type="button"
                            onClick={onRemoveImage}
                            disabled={isLoading}
                            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Remove image"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}

            {/* Helper / status text */}
            {imageError && !imagePreview ? (
                <p className="text-xs text-red-500 dark:text-red-400 font-medium">{imageError}</p>
            ) : (
                <p className={`text-xs ${imageFile ? 'text-amber-600 dark:text-amber-400 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                    {imageFile
                        ? '⚠ New image staged. Save the form to apply the change.'
                        : imagePreview && !imageFile
                            ? 'Current category image. Hover to change or remove.'
                            : 'Upload a category image to help users identify this category.'
                    }
                </p>
            )}
        </div>
    );
});
ImageUploadSection.displayName = 'ImageUploadSection';

// ==================== CATEGORY FORM MODAL ====================
const CategoryFormModal = memo(({ isOpen, onClose, category, onSubmit, isLoading }) => {
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const fileInputRef = useRef(null);

    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
        defaultValues: {
            title: category?.title || '',
            image: category?.image || '',
        }
    });

    // Sync form + image state whenever the target category changes
    useEffect(() => {
        reset({
            title: category?.title || '',
            image: category?.image || '',
        });
        setImagePreview(category?.image || null);
        setImageFile(null);
    }, [category, reset]);

    // Convert file to base64
    const convertToBase64 = useCallback((file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }, []);

    // Handle image file selection
    const handleImageChange = useCallback(async (e) => {
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
            setImageFile(base64String);
            setImagePreview(base64String);
            setValue('image', base64String);
        } catch (error) {
            Toast.error('Failed to process image. Please try again.');
            console.error('Image conversion error:', error);
        }
    }, [convertToBase64, setValue]);

    // Handle image removal
    const handleRemoveImage = useCallback(() => {
        setImageFile(null);
        setImagePreview(null);
        setValue('image', '');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [setValue]);

    // FIX: do NOT reset here — reset is deferred to onClose after success
    const handleFormSubmit = useCallback((data) => {
        if (!imagePreview) {
            Toast.error('Category image is required.');
            return;
        }
        const submitData = {
            title: data.title,
            ...(imageFile && { image: imageFile }),
        };
        onSubmit(submitData);
        // intentionally no reset() here — the parent will close the modal on success,
        // which triggers handleClose and cleans up state.
    }, [onSubmit, imageFile, imagePreview]);

    // Cleanup only when the modal is explicitly closed
    const handleClose = useCallback(() => {
        reset();
        setImagePreview(null);
        setImageFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        onClose();
    }, [reset, onClose]);

    return (
        <ModalForm
            isOpen={isOpen}
            onClose={handleClose}
            title={category ? 'Edit Category' : 'Add Category'}
            description={category ? 'Update category details' : 'Create a new category'}
        >
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
                {/* Title Field */}
                <InputForm
                    label="Category Title"
                    name="title"
                    type="text"
                    register={register}
                    error={errors.title?.message}
                    placeholder="Enter category title"
                    required
                    disabled={isLoading}
                />

                {/* Image Upload Section */}
                <ImageUploadSection
                    imagePreview={imagePreview}
                    imageFile={imageFile}
                    isLoading={isLoading}
                    onImageChange={handleImageChange}
                    onRemoveImage={handleRemoveImage}
                    fileInputRef={fileInputRef}
                    imageError={!imagePreview ? 'Category image is required.' : null}
                />

                {/* Form Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button
                        type="button"
                        variant="outline"
                        color="gray"
                        onClick={handleClose}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        color="green"
                        loading={isLoading}
                        disabled={isLoading}
                    >
                        {isLoading
                            ? (category ? 'Updating...' : 'Creating...')
                            : (category ? 'Update' : 'Create')
                        }
                    </Button>
                </div>
            </form>
        </ModalForm>
    );
});
CategoryFormModal.displayName = 'CategoryFormModal';

// ==================== VIEW MODAL ====================
const ViewCategoryModal = memo(({ isOpen, onClose, category }) => {
    if (!category) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={category.title}
            description="Category details"
        >
            <div className="space-y-4">
                {category.image && (
                    <div className="w-full h-48 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                        <img
                            src={category.image}
                            alt={category.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                <div className="space-y-3">
                    <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                            Title
                        </label>
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mt-1">
                            {category.title}
                        </p>
                    </div>

                    <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                            Slug
                        </label>
                        <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">
                            {category.slug}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                Subcategories
                            </label>
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mt-1">
                                {category.subcategory?.length || 0}
                            </p>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                Products
                            </label>
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mt-1">
                                {category.product_count || 0}
                            </p>
                        </div>
                    </div>

                    {category.badges?.length > 0 && (
                        <div>
                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-2 block">
                                Badges
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {category.badges.map((badge, index) => (
                                    <TextBadge key={index} variant="light" color="purple" size="sm">
                                        {badge}
                                    </TextBadge>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
});
ViewCategoryModal.displayName = 'ViewCategoryModal';

// ==================== DELETE MODAL ====================
const DeleteCategoryModal = memo(({ isOpen, onClose, category, onConfirm, isDeleting }) => {
    if (!category) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Delete Category"
            description="This action cannot be undone"
        >
            <div className="space-y-4">
                <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <div className="flex gap-3">
                        <div className="flex-shrink-0">
                            <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-semibold text-red-900 dark:text-red-100 mb-1">
                                Warning
                            </h3>
                            <p className="text-sm text-red-700 dark:text-red-300">
                                Are you sure you want to delete <strong>{category.title}</strong>?
                                {category.subcategory?.length > 0 && (
                                    <span className="block mt-2">
                                        This category has {category.subcategory.length} subcategory(ies) that will also be affected.
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <Button
                        variant="outline"
                        color="gray"
                        onClick={onClose}
                        disabled={isDeleting}
                    >
                        Cancel
                    </Button>
                    <Button
                        color="red"
                        onClick={() => onConfirm(category.slug)}
                        loading={isDeleting}
                        startIcon={<Trash2 className="w-4 h-4" />}
                    >
                        Delete Category
                    </Button>
                </div>
            </div>
        </Modal>
    );
});
DeleteCategoryModal.displayName = 'DeleteCategoryModal';

// ==================== MAIN COMPONENT ====================
const AdminCategoryList = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Modals
    const addModal = useModal(false);
    const editModal = useModal(false);
    const viewModal = useModal(false);
    const deleteModal = useModal(false);

    // Fetch data
    const { data: categoriesData, isLoading, isError, error } = useCategories();
    const { mutateAsync: createCategory, isPending: isCreating } = useCreateCategory();
    const { mutateAsync: updateCategory, isPending: isUpdating } = useUpdateCategory();
    const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory();

    const categories = useMemo(() => categoriesData || [], [categoriesData]);

    // ==================== HANDLERS ====================

    const handleAdd = useCallback(() => {
        setSelectedCategory(null);
        addModal.openModal();
    }, [addModal]);

    const handleView = useCallback((category) => {
        setSelectedCategory(category);
        viewModal.openModal();
    }, [viewModal]);

    const handleEdit = useCallback((category) => {
        setSelectedCategory(category);
        editModal.openModal();
    }, [editModal]);

    const handleDelete = useCallback((category) => {
        setSelectedCategory(category);
        deleteModal.openModal();
    }, [deleteModal]);

    const handleCreateSubmit = useCallback(async (data) => {
        try {
            await createCategory(data);
            addModal.closeModal();
        } catch (error) {
            console.error('Create failed:', error);
        }
    }, [createCategory, addModal]);

    // FIX: pass `slug` matching the mutation's expected { slug, data } shape
    const handleUpdateSubmit = useCallback(async (data) => {
        if (!selectedCategory?.slug) {
            console.error('Update failed: selectedCategory.slug is missing', selectedCategory);
            Toast.error('Cannot update: category slug is missing.');
            return;
        }
        try {
            await updateCategory({ slug: selectedCategory.slug, data });
            editModal.closeModal();
            setSelectedCategory(null);
        } catch (error) {
            console.error('Update failed:', error);
        }
    }, [updateCategory, selectedCategory, editModal]);

    const confirmDelete = useCallback((slug) => {
        deleteCategory(slug, {
            onSuccess: () => {
                deleteModal.closeModal();
                setSelectedCategory(null);
            },
        });
    }, [deleteCategory, deleteModal]);

    // ==================== RENDER ====================

    return (
        <div className="space-y-6 my-10">
            <PageHeader onAdd={handleAdd} />

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                {isLoading && <CategoryListSkeleton />}

                {isError && (
                    <div className="flex flex-col items-center justify-center py-16 px-4">
                        <div className="w-16 h-16 bg-red-50 dark:bg-red-950/30 rounded-full flex items-center justify-center mb-4">
                            <FolderOpen className="w-8 h-8 text-red-500 dark:text-red-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            Failed to Load Categories
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-md">
                            {error?.response?.data?.message || 'An error occurred while fetching categories'}
                        </p>
                    </div>
                )}

                {!isLoading && !isError && categories.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 px-4">
                        <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                            <FolderOpen className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            No Categories Found
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-md mb-4">
                            Get started by creating your first product category.
                        </p>
                        <Button
                            color="green"
                            onClick={handleAdd}
                            startIcon={<Plus className="w-4 h-4" />}
                        >
                            Add Category
                        </Button>
                    </div>
                )}

                {!isLoading && !isError && categories.length > 0 && (
                    <div className="overflow-x-auto">
                        <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <TableHeader className="bg-gray-50 dark:bg-gray-900">
                                <TableRow>
                                    <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Category
                                    </TableCell>
                                    <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Subcategories
                                    </TableCell>
                                    <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Products
                                    </TableCell>
                                    <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Badges
                                    </TableCell>
                                    <TableCell isHeader className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {categories.map((category) => (
                                    <CategoryRow
                                        key={category.id}
                                        category={category}
                                        onView={handleView}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>

            {/* Modals */}
            <CategoryFormModal
                isOpen={addModal.isOpen}
                onClose={addModal.closeModal}
                category={null}
                onSubmit={handleCreateSubmit}
                isLoading={isCreating}
            />

            <CategoryFormModal
                isOpen={editModal.isOpen}
                onClose={editModal.closeModal}
                category={selectedCategory}
                onSubmit={handleUpdateSubmit}
                isLoading={isUpdating}
            />

            <ViewCategoryModal
                isOpen={viewModal.isOpen}
                onClose={viewModal.closeModal}
                category={selectedCategory}
            />

            <DeleteCategoryModal
                isOpen={deleteModal.isOpen}
                onClose={deleteModal.closeModal}
                category={selectedCategory}
                onConfirm={confirmDelete}
                isDeleting={isDeleting}
            />
        </div>
    );
};

export default memo(AdminCategoryList);