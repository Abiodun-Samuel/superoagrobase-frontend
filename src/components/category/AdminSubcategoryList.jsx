'use client';

import { useState, useMemo, useCallback, memo, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
    Folders,
    Eye,
    Edit,
    Trash2,
    Plus,
    Image as ImageIcon,
    FolderOpen,
    RefreshCw,
    X,
    Package,
} from 'lucide-react';
import { useAdminSubcategories, useCreateSubcategory, useUpdateSubcategory, useDeleteSubcategory } from '@/queries/subcategories.query';
import { useCategories } from '@/queries/categories.query';
import Button from '@/components/ui/Button';
import IconBadge from '@/components/ui/IconBadge';
import InputForm from '@/components/form/InputForm';
import SingleSelectForm from '@/components/form/SingleSelectForm';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/Table';
import ModalForm from '@/components/modal/ModalForm';
import Modal from '@/components/modal/Modal';
import { useModal } from '@/hooks/useModal';
import Toast from '@/lib/toastify';

// ==================== SKELETON LOADER ====================
const SubcategoryListSkeleton = memo(() => (
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
SubcategoryListSkeleton.displayName = 'SubcategoryListSkeleton';

// ==================== PAGE HEADER ====================
const PageHeader = memo(({ onAdd }) => (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                Subcategories
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Manage product subcategories within categories
            </p>
        </div>
        <Button color="green" onClick={onAdd} startIcon={<Plus className="w-5 h-5" />}>
            Add Subcategory
        </Button>
    </div>
));
PageHeader.displayName = 'PageHeader';

// ==================== SUBCATEGORY ROW ====================
// Columns: subcategory (image + title + slug) | parent category (thumbnail + title) | products count | actions
const SubcategoryRow = memo(({ subcategory, onView, onEdit, onDelete }) => (
    <TableRow className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">

        {/* Subcategory */}
        <TableCell className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                    {subcategory.image ? (
                        <img
                            src={subcategory.image}
                            alt={subcategory.title}
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
                        {subcategory.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Slug: {subcategory.slug}
                    </p>
                </div>
            </div>
        </TableCell>

        {/* Parent category */}
        <TableCell className="px-6 py-4 whitespace-nowrap">
            {subcategory.category ? (
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                        {subcategory.category.image ? (
                            <img
                                src={subcategory.category.image}
                                alt={subcategory.category.title}
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <FolderOpen className="w-4 h-4 text-gray-400" />
                            </div>
                        )}
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-1">
                            {subcategory.category.title}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                            {subcategory.category.slug}
                        </p>
                    </div>
                </div>
            ) : (
                <span className="text-xs text-gray-400">—</span>
            )}
        </TableCell>

        {/* Products count */}
        <TableCell className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center gap-1">
                <Package className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {subcategory.products_count ?? 0}
                </span>
            </div>
        </TableCell>

        {/* Actions */}
        <TableCell className="px-6 py-4 whitespace-nowrap text-right">
            <div className="flex items-center justify-end gap-2">
                <IconBadge
                    variant="light" color="blue" size="sm" shape="circle"
                    icon={<Eye className="w-4 h-4" />}
                    onClick={() => onView(subcategory)}
                    ariaLabel="View subcategory"
                />
                <IconBadge
                    variant="light" color="green" size="sm" shape="circle"
                    icon={<Edit className="w-4 h-4" />}
                    onClick={() => onEdit(subcategory)}
                    ariaLabel="Edit subcategory"
                />
                <IconBadge
                    variant="light" color="red" size="sm" shape="circle"
                    icon={<Trash2 className="w-4 h-4" />}
                    onClick={() => onDelete(subcategory)}
                    ariaLabel="Delete subcategory"
                />
            </div>
        </TableCell>
    </TableRow>
));
SubcategoryRow.displayName = 'SubcategoryRow';

// ==================== IMAGE UPLOAD SECTION ====================
// Identical behaviour and appearance to the category ImageUploadSection.
const ImageUploadSection = memo(({ imagePreview, imageFile, isLoading, onImageChange, onRemoveImage, fileInputRef, imageError }) => (
    <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Subcategory Image
            <span className="text-red-500 ml-1">*</span>
        </label>

        {!imagePreview ? (
            <label className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${imageError
                ? 'border-red-400 dark:border-red-500 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-950/30'
                : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900'
                }`}>
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
            <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 group">
                <img src={imagePreview} alt="Subcategory preview" className="w-full h-full object-cover" />

                {/* Staged-update banner */}
                {imageFile && (
                    <div className="absolute top-0 inset-x-0 flex items-center justify-center gap-2 bg-amber-500/90 text-white text-xs font-semibold px-3 py-1.5 z-10 backdrop-blur-sm">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
                        Image staged — save to apply
                    </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
                    <label className="px-4 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg shadow-lg transition-colors cursor-pointer text-sm font-medium border border-gray-200 dark:border-gray-600">
                        Change Image
                        <input type="file" className="hidden" accept="image/*" onChange={onImageChange} disabled={isLoading} />
                    </label>
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

        {/* Helper / error text */}
        {imageError && !imagePreview ? (
            <p className="text-xs text-red-500 dark:text-red-400 font-medium">{imageError}</p>
        ) : (
            <p className={`text-xs ${imageFile ? 'text-amber-600 dark:text-amber-400 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                {imageFile
                    ? '⚠ New image staged. Save the form to apply the change.'
                    : imagePreview && !imageFile
                        ? 'Current subcategory image. Hover to change or remove.'
                        : 'Upload a subcategory image to help users identify this subcategory.'
                }
            </p>
        )}
    </div>
));
ImageUploadSection.displayName = 'ImageUploadSection';

// ==================== SUBCATEGORY FORM MODAL ====================
// Fields: category (select) + title + image upload. Slug field removed (generated server-side).
const SubcategoryFormModal = memo(({ isOpen, onClose, subcategory, categories, onSubmit, isLoading }) => {
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const fileInputRef = useRef(null);

    const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm({
        defaultValues: { title: '', category_id: '' },
    });

    const categoryValue = watch('category_id');

    // Sync all local state whenever the modal opens OR the target subcategory changes.
    // Depending on isOpen (not just subcategory) ensures that closing then reopening
    // the same item still re-populates the image preview and category select, because
    // handleClose wipes local state and the subcategory object reference hasn't changed.
    useEffect(() => {
        if (!isOpen) return;
        const categoryId = subcategory?.category?.id?.toString() || '';
        reset({
            title: subcategory?.title || '',
            category_id: categoryId,
        });
        // Imperatively set category_id so SingleSelectForm picks up the value
        // even if its internal state initialised before this effect ran.
        setValue('category_id', categoryId);
        setImagePreview(subcategory?.image || null);
        setImageFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }, [isOpen, subcategory, reset, setValue]);

    const categoryOptions = useMemo(() => [
        { value: '', text: 'Select a category' },
        ...categories.map((cat) => ({ value: cat.id.toString(), text: cat.title })),
    ], [categories]);

    const convertToBase64 = useCallback((file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    }), []);

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
        } catch {
            Toast.error('Failed to process image. Please try again.');
        }
    }, [convertToBase64]);

    const handleRemoveImage = useCallback(() => {
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }, []);

    // Image required guard
    const handleFormSubmit = useCallback((data) => {
        if (!imagePreview) {
            Toast.error('Subcategory image is required.');
            return;
        }
        onSubmit({
            title: data.title,
            category_id: data.category_id,
            ...(imageFile && { image: imageFile }),
        });
        // No reset() — deferred to handleClose, called by parent on success
    }, [onSubmit, imagePreview, imageFile]);

    const handleClose = useCallback(() => {
        reset();
        setImagePreview(null);
        setImageFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        onClose();
    }, [reset, onClose]);

    return (
        <ModalForm
            isOpen={isOpen}
            onClose={handleClose}
            title={subcategory ? 'Edit Subcategory' : 'Add Subcategory'}
            description={subcategory ? 'Update subcategory details' : 'Create a new subcategory'}
        >
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">

                <SingleSelectForm
                    key={`category-select-${subcategory?.id ?? 'new'}-${isOpen}`}
                    label="Category"
                    name="category_id"
                    placeholder="Select parent category"
                    options={categoryOptions}
                    register={register}
                    setValue={setValue}
                    error={errors.category_id?.message}
                    searchable={false}
                    value={categoryValue}
                    defaultValue={categoryValue}
                    required
                    disabled={isLoading}
                    validation={{ required: 'Please select a parent category.' }}
                />

                <InputForm
                    label="Subcategory Title"
                    name="title"
                    type="text"
                    register={register}
                    error={errors.title?.message}
                    placeholder="Enter subcategory title"
                    required
                    disabled={isLoading}
                    validation={{ required: 'Subcategory title is required.' }}
                />

                <ImageUploadSection
                    imagePreview={imagePreview}
                    imageFile={imageFile}
                    isLoading={isLoading}
                    onImageChange={handleImageChange}
                    onRemoveImage={handleRemoveImage}
                    fileInputRef={fileInputRef}
                    imageError={!imagePreview ? 'Subcategory image is required.' : null}
                />

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button type="button" variant="outline" color="gray" onClick={handleClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button type="submit" color="green" loading={isLoading} disabled={isLoading}>
                        {isLoading
                            ? (subcategory ? 'Updating...' : 'Creating...')
                            : (subcategory ? 'Update' : 'Create')
                        }
                    </Button>
                </div>
            </form>
        </ModalForm>
    );
});
SubcategoryFormModal.displayName = 'SubcategoryFormModal';

// ==================== VIEW MODAL ====================
const ViewSubcategoryModal = memo(({ isOpen, onClose, subcategory }) => {
    if (!subcategory) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={subcategory.title} description="Subcategory details">
            <div className="space-y-4">
                {subcategory.image && (
                    <div className="w-full h-48 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                        <img src={subcategory.image} alt={subcategory.title} className="w-full h-full object-cover" />
                    </div>
                )}

                <div className="space-y-3">
                    <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Title</label>
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mt-1">{subcategory.title}</p>
                    </div>

                    <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Slug</label>
                        <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">{subcategory.slug}</p>
                    </div>

                    {subcategory.category && (
                        <div>
                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                Parent Category
                            </label>
                            <div className="flex items-center gap-2 mt-1">
                                {subcategory.category.image && (
                                    <div className="w-8 h-8 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                                        <img
                                            src={subcategory.category.image}
                                            alt={subcategory.category.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                    {subcategory.category.title}
                                </p>
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Products</label>
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mt-1">
                            {subcategory.products_count ?? 0}
                        </p>
                    </div>
                </div>
            </div>
        </Modal>
    );
});
ViewSubcategoryModal.displayName = 'ViewSubcategoryModal';

// ==================== DELETE MODAL ====================
const DeleteSubcategoryModal = memo(({ isOpen, onClose, subcategory, onConfirm, isDeleting }) => {
    if (!subcategory) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Delete Subcategory" description="This action cannot be undone">
            <div className="space-y-4">
                <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <div className="flex gap-3">
                        <div className="flex-shrink-0">
                            <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-semibold text-red-900 dark:text-red-100 mb-1">Warning</h3>
                            <p className="text-sm text-red-700 dark:text-red-300">
                                Are you sure you want to delete <strong>{subcategory.title}</strong>?
                                This will affect all products in this subcategory.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <Button variant="outline" color="gray" onClick={onClose} disabled={isDeleting}>
                        Cancel
                    </Button>
                    <Button
                        color="red"
                        onClick={() => onConfirm(subcategory.slug)}
                        loading={isDeleting}
                        startIcon={<Trash2 className="w-4 h-4" />}
                    >
                        Delete Subcategory
                    </Button>
                </div>
            </div>
        </Modal>
    );
});
DeleteSubcategoryModal.displayName = 'DeleteSubcategoryModal';

// ==================== MAIN COMPONENT ====================
const AdminSubcategoryList = () => {
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);

    const addModal = useModal(false);
    const editModal = useModal(false);
    const viewModal = useModal(false);
    const deleteModal = useModal(false);

    const { data: categoriesData } = useCategories();
    const { data: subcategoriesData, isLoading, isError, error } = useAdminSubcategories();
    const { mutateAsync: createSubcategory, isPending: isCreating } = useCreateSubcategory();
    const { mutateAsync: updateSubcategory, isPending: isUpdating } = useUpdateSubcategory();
    const { mutate: deleteSubcategory, isPending: isDeleting } = useDeleteSubcategory();

    const categories = useMemo(() => (
        Array.isArray(categoriesData) ? categoriesData : []
    ), [categoriesData]);

    const allSubcategories = useMemo(() => (
        Array.isArray(subcategoriesData) ? subcategoriesData : []
    ), [subcategoriesData]);

    // ==================== HANDLERS ====================

    const handleAdd = useCallback(() => {
        setSelectedSubcategory(null);
        addModal.openModal();
    }, [addModal]);

    const handleView = useCallback((subcategory) => {
        setSelectedSubcategory(subcategory);
        viewModal.openModal();
    }, [viewModal]);

    const handleEdit = useCallback((subcategory) => {
        setSelectedSubcategory(subcategory);
        editModal.openModal();
    }, [editModal]);

    const handleDelete = useCallback((subcategory) => {
        setSelectedSubcategory(subcategory);
        deleteModal.openModal();
    }, [deleteModal]);

    const handleCreateSubmit = useCallback(async (data) => {
        try {
            await createSubcategory({
                ...data,
                category_id: parseInt(data.category_id, 10),
            });
            addModal.closeModal();
        } catch (err) {
            console.error('Create failed:', err);
        }
    }, [createSubcategory, addModal]);

    // Uses slug as identifier — matches mutation's expected { slug, data } shape
    const handleUpdateSubmit = useCallback(async (data) => {
        if (!selectedSubcategory?.slug) {
            console.error('Update failed: selectedSubcategory.slug is missing', selectedSubcategory);
            Toast.error('Cannot update: subcategory slug is missing.');
            return;
        }
        try {
            await updateSubcategory({
                slug: selectedSubcategory.slug,
                data: {
                    ...data,
                    category_id: parseInt(data.category_id, 10),
                },
            });
            editModal.closeModal();
            setSelectedSubcategory(null);
        } catch (err) {
            console.error('Update failed:', err);
        }
    }, [updateSubcategory, selectedSubcategory, editModal]);

    const confirmDelete = useCallback((slug) => {
        deleteSubcategory(slug, {
            onSuccess: () => {
                deleteModal.closeModal();
                setSelectedSubcategory(null);
            },
        });
    }, [deleteSubcategory, deleteModal]);

    // ==================== RENDER ====================

    return (
        <div className="space-y-6 my-10">
            <PageHeader onAdd={handleAdd} />

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                {isLoading && <SubcategoryListSkeleton />}

                {isError && (
                    <div className="flex flex-col items-center justify-center py-16 px-4">
                        <div className="w-16 h-16 bg-red-50 dark:bg-red-950/30 rounded-full flex items-center justify-center mb-4">
                            <Folders className="w-8 h-8 text-red-500 dark:text-red-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            Failed to Load Subcategories
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-md">
                            {error?.response?.data?.message || 'An error occurred while fetching subcategories'}
                        </p>
                    </div>
                )}

                {!isLoading && !isError && categories.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 px-4">
                        <div className="w-16 h-16 bg-yellow-50 dark:bg-yellow-950/30 rounded-full flex items-center justify-center mb-4">
                            <FolderOpen className="w-8 h-8 text-yellow-500 dark:text-yellow-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            No Categories Found
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-md mb-4">
                            You need to create at least one category before adding subcategories.
                        </p>
                        <Button color="green" href="/dashboard/categories" startIcon={<Plus className="w-4 h-4" />}>
                            Go to Categories
                        </Button>
                    </div>
                )}

                {!isLoading && !isError && categories.length > 0 && allSubcategories.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 px-4">
                        <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                            <Folders className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            No Subcategories Found
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-md mb-4">
                            Get started by creating your first subcategory.
                        </p>
                        <Button color="green" onClick={handleAdd} startIcon={<Plus className="w-4 h-4" />}>
                            Add Subcategory
                        </Button>
                    </div>
                )}

                {!isLoading && !isError && categories.length > 0 && allSubcategories.length > 0 && (
                    <div className="overflow-x-auto">
                        <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <TableHeader className="bg-gray-50 dark:bg-gray-900">
                                <TableRow>
                                    <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Subcategory
                                    </TableCell>
                                    <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Category
                                    </TableCell>
                                    <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Products
                                    </TableCell>
                                    <TableCell isHeader className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {allSubcategories.map((subcategory) => (
                                    <SubcategoryRow
                                        key={subcategory.id}
                                        subcategory={subcategory}
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
            <SubcategoryFormModal
                isOpen={addModal.isOpen}
                onClose={addModal.closeModal}
                subcategory={null}
                categories={categories}
                onSubmit={handleCreateSubmit}
                isLoading={isCreating}
            />

            <SubcategoryFormModal
                isOpen={editModal.isOpen}
                onClose={editModal.closeModal}
                subcategory={selectedSubcategory}
                categories={categories}
                onSubmit={handleUpdateSubmit}
                isLoading={isUpdating}
            />

            <ViewSubcategoryModal
                isOpen={viewModal.isOpen}
                onClose={viewModal.closeModal}
                subcategory={selectedSubcategory}
            />

            <DeleteSubcategoryModal
                isOpen={deleteModal.isOpen}
                onClose={deleteModal.closeModal}
                subcategory={selectedSubcategory}
                onConfirm={confirmDelete}
                isDeleting={isDeleting}
            />
        </div>
    );
};

export default memo(AdminSubcategoryList);