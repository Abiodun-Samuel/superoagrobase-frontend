'use client';

import { useState, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import {
    Star,
    MessageSquare,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    Edit2,
    Trash2,
    X,
    Trash,
} from 'lucide-react';

import TextareaForm from '@/components/form/TextareaForm';
import RatingStars from '@/components/products/RatingStars';
import IconBadge from '@/components/ui/IconBadge';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import Modal from '@/components/modal/Modal';
import useAuth from '@/hooks/useAuth';
import {
    useReviews,
    useCreateReview,
    useUpdateReview,
    useDeleteReview,
} from '@/queries/reviews.query';
import { yupResolver } from '@hookform/resolvers/yup';
import { reviewSchema } from '@/validation/schema';
import TextBadge from '../ui/TextBadge';

const REVIEWS_PER_PAGE = 5;

// ---------------------------------------------------------------------------
// Skeleton Loaders
// ---------------------------------------------------------------------------

const ReviewCardSkeleton = () => (
    <div className="p-4 sm:p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 animate-pulse">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-300 dark:bg-gray-700 flex-shrink-0" />
                <div className="space-y-2 flex-1 min-w-0">
                    <div className="h-4 w-24 sm:w-32 bg-gray-300 dark:bg-gray-700 rounded" />
                    <div className="h-3 w-20 sm:w-24 bg-gray-300 dark:bg-gray-700 rounded" />
                </div>
            </div>
            <div className="h-5 w-24 bg-gray-300 dark:bg-gray-700 rounded" />
        </div>
        <div className="space-y-2">
            <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="h-4 w-5/6 bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="h-4 w-4/6 bg-gray-300 dark:bg-gray-700 rounded" />
        </div>
    </div>
);

const ReviewStatisticsSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-green-50 via-emerald-50/30 to-blue-50 dark:from-green-900/10 dark:via-emerald-900/5 dark:to-blue-900/10 rounded-xl sm:rounded-2xl mb-6 sm:mb-8 border border-green-100 dark:border-green-900/30 animate-pulse">
        <div className="flex flex-col items-center justify-center p-4 sm:p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg sm:rounded-xl">
            <div className="h-12 sm:h-16 w-20 sm:w-24 bg-gray-300 dark:bg-gray-700 rounded mb-3" />
            <div className="h-5 sm:h-6 w-24 sm:w-32 bg-gray-300 dark:bg-gray-700 rounded mb-3" />
            <div className="h-3 sm:h-4 w-32 sm:w-40 bg-gray-300 dark:bg-gray-700 rounded" />
        </div>
        <div className="space-y-2 sm:space-y-3">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-2 sm:gap-3">
                    <div className="h-4 w-12 sm:w-16 bg-gray-300 dark:bg-gray-700 rounded" />
                    <div className="flex-1 h-2.5 sm:h-3 bg-gray-300 dark:bg-gray-700 rounded" />
                    <div className="h-4 w-8 sm:w-12 bg-gray-300 dark:bg-gray-700 rounded" />
                </div>
            ))}
        </div>
    </div>
);

// ---------------------------------------------------------------------------
// Delete Confirmation Modal
// ---------------------------------------------------------------------------

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, isDeleting }) => (
    <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Delete Review"
        description="This action cannot be undone."
        maxWidth="max-w-sm"
        closeOnOutsideClick={!isDeleting}
    >
        <div className="space-y-5">
            <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800">
                <Trash className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700 dark:text-red-300">
                    Are you sure you want to delete this review? Once deleted, it cannot be recovered.
                </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-1">
                <Button
                    onClick={onConfirm}
                    color="red"
                    loading={isDeleting}
                    disabled={isDeleting}
                    className="w-full sm:w-auto"
                >
                    {isDeleting ? 'Deleting…' : 'Yes, Delete'}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    color="gray"
                    onClick={onClose}
                    disabled={isDeleting}
                    className="w-full sm:w-auto"
                >
                    Cancel
                </Button>
            </div>
        </div>
    </Modal>
);

// ---------------------------------------------------------------------------
// Individual Review Card
// ---------------------------------------------------------------------------

const ReviewCard = ({ review, onEdit, onRequestDelete, currentUserId }) => {
    const isOwnReview = Boolean(currentUserId && review.user?.id === currentUserId);

    const formattedDate = useMemo(
        () =>
            new Date(review.created_at).toLocaleDateString('en-NG', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }),
        [review.created_at]
    );

    const userInitials = useMemo(() => {
        const name = review.user?.full_name || 'Anonymous';
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }, [review.user?.full_name]);

    return (
        <div
            className="group p-4 sm:p-6 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-green-200 dark:hover:border-green-800 hover:shadow transition-all duration-200 bg-white dark:bg-gray-800"
            itemScope
            itemType="https://schema.org/Review"
        >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 mb-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="relative flex-shrink-0">
                        <Avatar
                            src={review.user?.avatar}
                            initials={userInitials}
                            alt={review.user?.full_name || 'Anonymous'}
                            size="md"
                            shape="circle"
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                            <Star className="w-2 h-2 sm:w-3 sm:h-3 text-white fill-white" />
                        </div>
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span
                                className="font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100 truncate"
                                itemProp="author"
                            >
                                {review.user?.full_name || 'Anonymous User'}
                            </span>
                            {isOwnReview && (
                                <span className="px-2 py-0.5 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full flex-shrink-0">
                                    You
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                            <span itemProp="datePublished">{formattedDate}</span>
                            {review.user?.city && review.user?.state && (
                                <>
                                    <span className="hidden sm:inline">•</span>
                                    <span className="truncate hidden sm:inline">
                                        {review.user.city}, {review.user.state}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
                    <div
                        itemProp="reviewRating"
                        itemScope
                        itemType="https://schema.org/Rating"
                    >
                        <meta itemProp="ratingValue" content={review.rating} />
                        <meta itemProp="bestRating" content="5" />
                        <RatingStars ratings={review.rating} />
                    </div>

                    {isOwnReview && (
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => onEdit(review)}
                                className="p-1.5 sm:p-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                title="Edit review"
                            >
                                <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>
                            <button
                                onClick={() => onRequestDelete(review.id)}
                                className="p-1.5 sm:p-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                title="Delete review"
                            >
                                <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Body */}
            <p
                className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line"
                itemProp="reviewBody"
            >
                {review.comment}
            </p>
        </div>
    );
};

// ---------------------------------------------------------------------------
// Review Form
// ---------------------------------------------------------------------------

const ReviewForm = ({ productId, onCancel, editingReview, setEditingReview, onSuccess }) => {
    const { user } = useAuth();
    const [selectedRating, setSelectedRating] = useState(editingReview?.rating || 5);
    const [hoveredRating, setHoveredRating] = useState(0);

    const isEditing = Boolean(editingReview);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
    } = useForm({
        resolver: yupResolver(reviewSchema),
        defaultValues: {
            rating: editingReview?.rating || 5,
            comment: editingReview?.comment || '',
        },
    });

    const { mutateAsync: createReview, isPending: isCreating } = useCreateReview();
    const { mutateAsync: updateReview, isPending: isUpdating } = useUpdateReview();
    const isSubmitting = isCreating || isUpdating;

    const userInitials = useMemo(() => {
        const name = user?.full_name || '';
        return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
    }, [user?.full_name]);

    const onSubmit = useCallback(
        async (data) => {
            const payload = {
                product_id: productId,
                rating: selectedRating,
                comment: data.comment,
                ...(user?.id && { user_id: user.id }),
            };

            try {
                if (isEditing) {
                    await updateReview({ reviewId: editingReview.id, reviewData: payload });
                } else {
                    await createReview(payload);
                }
                reset({ comment: '' });
                setEditingReview(null);
                onSuccess?.();
            } catch {
                // errors handled by query hooks
            }
        },
        [createReview, updateReview, productId, selectedRating, reset, onSuccess, isEditing, editingReview?.id, user?.id, setEditingReview]
    );

    const handleRatingClick = useCallback(
        (rating) => {
            setSelectedRating(rating);
            setValue('rating', rating);
        },
        [setValue]
    );

    return (
        <div className="mb-6 sm:mb-8 p-4 sm:p-6 lg:p-8 border-2 border-green-200 dark:border-green-800 rounded-xl sm:rounded-2xl bg-gradient-to-br from-green-50/50 to-emerald-50/30 dark:from-green-900/10 dark:to-emerald-900/5">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
                    {isEditing ? 'Edit Your Review' : 'Write Your Review'}
                </h3>
                <button
                    type="button"
                    onClick={onCancel}
                    className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    disabled={isSubmitting}
                    aria-label="Close form"
                >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
            </div>

            {user && (
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <Avatar
                        src={user.avatar}
                        initials={userInitials}
                        alt={user.full_name}
                        size="sm"
                        shape="circle"
                    />
                    <div className="min-w-0 flex-1">
                        <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100 truncate">
                            {user.full_name}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                            Posting as yourself
                        </p>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3">
                        Your Rating <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => handleRatingClick(star)}
                                onMouseEnter={() => setHoveredRating(star)}
                                onMouseLeave={() => setHoveredRating(0)}
                                disabled={isSubmitting}
                                className="transition-transform hover:scale-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Star
                                    className={`w-8 h-8 sm:w-10 sm:h-10 transition-colors ${star <= (hoveredRating || selectedRating)
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300 dark:text-gray-600'
                                        }`}
                                />
                            </button>
                        ))}
                        <span className="ml-1 sm:ml-3 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                            {selectedRating} {selectedRating === 1 ? 'star' : 'stars'}
                        </span>
                    </div>
                    {errors.rating && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.rating.message}
                        </p>
                    )}
                </div>

                <TextareaForm
                    label="Your Review"
                    name="comment"
                    register={register}
                    error={errors.comment?.message}
                    placeholder="Share your experience with this product… (minimum 10 characters)"
                    rows={5}
                    resize="vertical"
                    disabled={isSubmitting}
                    required
                    minLength={10}
                    maxLength={1000}
                />

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                    <Button
                        type="submit"
                        color="green"
                        loading={isSubmitting}
                        disabled={isSubmitting}
                        className="shadow hover:shadow-md w-full sm:w-auto"
                    >
                        {isSubmitting
                            ? isEditing ? 'Updating…' : 'Submitting…'
                            : isEditing ? 'Update Review' : 'Submit Review'}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        color="gray"
                        onClick={onCancel}
                        disabled={isSubmitting}
                        className="w-full sm:w-auto"
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
};

// ---------------------------------------------------------------------------
// Review Statistics
// ---------------------------------------------------------------------------

const ReviewStatistics = ({ reviewsSummary, reviews }) => {
    const ratingDistribution = useMemo(() => {
        if (!reviews?.length) return [];
        return [5, 4, 3, 2, 1].map((star) => {
            const count = reviews.filter((r) => Math.round(r.rating) === star).length;
            const percentage = (count / reviews.length) * 100;
            return { star, count, percentage };
        });
    }, [reviews]);

    if (!reviewsSummary || reviewsSummary.average_ratings === 0) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-green-50 via-emerald-50/30 to-blue-50 dark:from-green-900/10 dark:via-emerald-900/5 dark:to-blue-900/10 rounded-xl sm:rounded-2xl mb-6 sm:mb-8 border border-green-100 dark:border-green-900/30">
            <div className="flex flex-col items-center justify-center text-center p-4 sm:p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-sm">
                <div className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                    {reviewsSummary.average_ratings.toFixed(1)}
                </div>
                <RatingStars ratings={reviewsSummary.average_ratings} size="lg" />
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-3 font-medium">
                    Based on {reviewsSummary.reviews_count}{' '}
                    {reviewsSummary.reviews_count === 1 ? 'review' : 'reviews'}
                </p>
            </div>

            <div className="space-y-2 sm:space-y-3">
                {ratingDistribution.map(({ star, count, percentage }) => (
                    <div key={star} className="flex items-center gap-2 sm:gap-3">
                        <div className="flex items-center gap-1 w-12 sm:w-16 flex-shrink-0">
                            <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{star}</span>
                            <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400" />
                        </div>
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 sm:h-3 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-full rounded-full transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                        <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 w-8 sm:w-12 text-right font-medium">
                            {count}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pageNumbers = useMemo(() => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else if (currentPage <= 3) {
            for (let i = 1; i <= 4; i++) pages.push(i);
            pages.push('...');
            pages.push(totalPages);
        } else if (currentPage >= totalPages - 2) {
            pages.push(1);
            pages.push('...');
            for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
        }

        return pages;
    }, [currentPage, totalPages]);

    if (totalPages <= 1) return null;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mt-6 sm:mt-8">
            <Button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                variant="outline"
                color="gray"
                size="sm"
                startIcon={<ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />}
                className="w-full sm:w-auto"
            >
                <span className="hidden sm:inline">Previous</span>
                <span className="sm:hidden">Prev</span>
            </Button>

            <div className="flex items-center gap-1">
                {pageNumbers.map((page, index) => {
                    if (page === '...') {
                        return (
                            <span key={`ellipsis-${index}`} className="px-1 sm:px-2 text-gray-500 dark:text-gray-400 text-sm">
                                ...
                            </span>
                        );
                    }
                    return (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg text-sm sm:text-base font-medium transition-colors ${page === currentPage
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                        >
                            {page}
                        </button>
                    );
                })}
            </div>

            <Button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                variant="outline"
                color="gray"
                size="sm"
                endIcon={<ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />}
                className="w-full sm:w-auto"
            >
                Next
            </Button>
        </div>
    );
};

// ---------------------------------------------------------------------------
// Main ProductReviews Component
// ---------------------------------------------------------------------------

export default function ProductReviews({ product }) {
    const { user } = useAuth();

    const [showReviewForm, setShowReviewForm] = useState(false);
    const [editingReview, setEditingReview] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteTargetId, setDeleteTargetId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const {
        data: reviewsData,
        isLoading: reviewsLoading,
        isError: reviewsError,
        refetch: refetchReviews,
    } = useReviews({ product_id: product.id });

    const { mutateAsync: deleteReview } = useDeleteReview();

    const reviews = useMemo(() => reviewsData?.data || [], [reviewsData]);
    const reviewsSummary = useMemo(() => reviewsData?.summary || null, [reviewsData]);

    const userReview = useMemo(() => {
        if (!user || !reviews.length) return null;
        return reviews.find((r) => r.user?.id === user.id) || null;
    }, [reviews, user]);

    const paginatedReviews = useMemo(() => {
        const start = (currentPage - 1) * REVIEWS_PER_PAGE;
        return reviews.slice(start, start + REVIEWS_PER_PAGE);
    }, [reviews, currentPage]);

    const totalPages = useMemo(
        () => Math.ceil(reviews.length / REVIEWS_PER_PAGE),
        [reviews.length]
    );

    const handleFormSuccess = useCallback(() => {
        setShowReviewForm(false);
        setEditingReview(null);
        refetchReviews();
        setCurrentPage(1);
    }, [refetchReviews]);

    const handleCancelForm = useCallback(() => {
        setShowReviewForm(false);
        setEditingReview(null);
    }, []);

    const handlePageChange = useCallback((page) => {
        setCurrentPage(page);
        document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, []);

    const handleEditReview = useCallback((review) => {
        setEditingReview(review);
        setShowReviewForm(true);
        setTimeout(() => {
            document.getElementById('review-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    }, []);

    const handleRequestDelete = useCallback((reviewId) => {
        setDeleteTargetId(reviewId);
    }, []);

    const handleCloseDeleteModal = useCallback(() => {
        if (!isDeleting) setDeleteTargetId(null);
    }, [isDeleting]);

    const handleConfirmDelete = useCallback(async () => {
        if (!deleteTargetId) return;
        setIsDeleting(true);
        try {
            await deleteReview(deleteTargetId);
            refetchReviews();
            if (paginatedReviews.length === 1 && currentPage > 1) {
                setCurrentPage((p) => p - 1);
            }
        } finally {
            setIsDeleting(false);
            setDeleteTargetId(null);
        }
    }, [deleteTargetId, deleteReview, refetchReviews, paginatedReviews.length, currentPage]);

    const canWriteReview = Boolean(user && !userReview);

    return (
        <section
            id="reviews-section"
            className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow border border-gray-200 dark:border-gray-700 p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8"
        >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="flex items-center gap-2 sm:gap-3">
                    <IconBadge size="lg" color="orange" icon={<MessageSquare />} />
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                            Customer Reviews
                        </h2>
                        {reviewsSummary && (
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {reviewsSummary.reviews_count}{' '}
                                {reviewsSummary.reviews_count === 1 ? 'review' : 'reviews'}
                            </p>
                        )}
                    </div>
                </div>

                {!showReviewForm && canWriteReview && (
                    <TextBadge
                        onClick={() => setShowReviewForm(true)}
                        variant="outline"
                        color="green"
                        startIcon={<Star />}
                        className="inline-block"
                    >
                        <span className="hidden sm:inline">Write a Review</span>
                        <span className="sm:hidden">Write Review</span>
                    </TextBadge>
                )}
            </div>

            {/* Statistics */}
            {reviewsLoading ? (
                <ReviewStatisticsSkeleton />
            ) : (
                <ReviewStatistics reviewsSummary={reviewsSummary} reviews={reviews} />
            )}

            {/* Review form */}
            {showReviewForm && (
                <div id="review-form">
                    <ReviewForm
                        productId={product.id}
                        onCancel={handleCancelForm}
                        onSuccess={handleFormSuccess}
                        editingReview={editingReview}
                        setEditingReview={setEditingReview}
                    />
                </div>
            )}

            {/* Reviews list */}
            {reviewsLoading ? (
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <ReviewCardSkeleton key={i} />
                    ))}
                </div>
            ) : reviewsError ? (
                <div className="text-center py-12 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-200 dark:border-red-800">
                    <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                    <p className="text-red-600 dark:text-red-400 font-medium mb-2">
                        Failed to load reviews
                    </p>
                    <Button onClick={() => refetchReviews()} variant="outline" color="gray" size="sm">
                        Try Again
                    </Button>
                </div>
            ) : reviews.length > 0 ? (
                <>
                    <div className="space-y-4">
                        {paginatedReviews.map((review) => (
                            <ReviewCard
                                key={review.id}
                                review={review}
                                currentUserId={user?.id}
                                onEdit={handleEditReview}
                                onRequestDelete={handleRequestDelete}
                            />
                        ))}
                    </div>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </>
            ) : (
                <div className="text-center py-12 sm:py-16 bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-800 dark:to-gray-900/50 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-700 px-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/20 rounded-xl sm:rounded-2xl mb-3 sm:mb-4">
                        <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        No reviews yet
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 max-w-sm mx-auto">
                        Be the first to share your experience with this product!
                    </p>
                    {!showReviewForm && canWriteReview && (
                        <Button
                            onClick={() => setShowReviewForm(true)}
                            color="green"
                            startIcon={<Star className="w-3 h-3 sm:w-4 sm:h-4" />}
                            className="w-full sm:w-auto"
                        >
                            Write the First Review
                        </Button>
                    )}
                </div>
            )}

            {/* Delete confirmation modal */}
            <DeleteConfirmModal
                isOpen={Boolean(deleteTargetId)}
                onClose={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
                isDeleting={isDeleting}
            />
        </section>
    );
}