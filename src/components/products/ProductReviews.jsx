'use client';

import { useState } from 'react';
import { Star, MessageSquare, ThumbsUp, User } from 'lucide-react';
import RatingStars from '@/components/products/RatingStars';
import IconBadge from '../ui/IconBadge';
import Button from '../ui/Button';

/**
 * Product Reviews Section with Add Review Form
 */
export default function ProductReviews({ product }) {
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [newReview, setNewReview] = useState({
        rating: 5,
        comment: '',
        name: ''
    });

    const handleSubmitReview = (e) => {
        e.preventDefault();
        // Submit review logic here
        setShowReviewForm(false);
        setNewReview({ rating: 5, comment: '', name: '' });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-NG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <section id='review' className="bg-white rounded-2xl shadow p-5 lg:p-8 mb-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <IconBadge size='xl' color='orange' icon={<MessageSquare />} />

                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Reviews</h2>
                        {product.reviews_summary && (
                            <p className="text-sm text-gray-600">
                                {product.reviews_summary.reviews_count} {product.reviews_summary.reviews_count === 1 ? 'review' : 'reviews'}
                            </p>
                        )}
                    </div>
                </div>
                <Button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                >
                    Write a Review
                </Button>
            </div>

            {/* Review Summary */}
            {product.reviews_summary && product.reviews_summary.average_ratings > 0 && (
                <div className="flex items-center gap-6 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl mb-8">
                    <div className="text-center">
                        <div className="text-5xl font-bold text-gray-900 mb-2">
                            {product.reviews_summary.average_ratings.toFixed(1)}
                        </div>
                        <RatingStars ratings={product.reviews_summary.average_ratings} size="lg" />
                        <p className="text-sm text-gray-600 mt-2">
                            Based on {product.reviews_summary.reviews_count} {product.reviews_summary.reviews_count === 1 ? 'review' : 'reviews'}
                        </p>
                    </div>
                    <div className="flex-1 space-y-2">
                        {[5, 4, 3, 2, 1].map((star) => {
                            const count = product.reviews?.filter(r => Math.round(r.rating) === star).length || 0;
                            const percentage = product.reviews?.length ? (count / product.reviews.length) * 100 : 0;
                            return (
                                <div key={star} className="flex items-center gap-3">
                                    <span className="text-sm font-medium text-gray-700 w-12">{star} star</span>
                                    <div className="flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                        <div
                                            className="bg-yellow-400 h-full rounded-full transition-all duration-300"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                    <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Add Review Form */}
            {showReviewForm && (
                <div className="mb-8 p-6 border-2 border-green-200 rounded-xl bg-green-50/50">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Write Your Review</h3>
                    <form onSubmit={handleSubmitReview} className="space-y-6">
                        {/* Rating */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-3">
                                Your Rating *
                            </label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setNewReview({ ...newReview, rating: star })}
                                        className="transition-transform hover:scale-110"
                                    >
                                        <Star
                                            className={`w-8 h-8 ${star <= newReview.rating
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'text-gray-300'
                                                }`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Name */}
                        <div>
                            <label htmlFor="reviewer-name" className="block text-sm font-semibold text-gray-900 mb-3">
                                Your Name *
                            </label>
                            <input
                                id="reviewer-name"
                                type="text"
                                required
                                value={newReview.name}
                                onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                                placeholder="Enter your name"
                            />
                        </div>

                        {/* Comment */}
                        <div>
                            <label htmlFor="review-comment" className="block text-sm font-semibold text-gray-900 mb-3">
                                Your Review *
                            </label>
                            <textarea
                                id="review-comment"
                                required
                                rows="4"
                                value={newReview.comment}
                                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors resize-none"
                                placeholder="Share your experience with this product..."
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                className="px-8 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors duration-200"
                            >
                                Submit Review
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowReviewForm(false)}
                                className="px-8 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors duration-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Reviews List */}
            <div className="space-y-6">
                {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.map((review) => (
                        <div
                            key={review.id}
                            className="p-6 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors duration-200"
                            itemScope
                            itemType="https://schema.org/Review"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                                        <User className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900" itemProp="author">
                                            Customer #{review.user_id}
                                        </div>
                                        <div className="text-sm text-gray-500" itemProp="datePublished">
                                            {formatDate(review.created_at)}
                                        </div>
                                    </div>
                                </div>
                                <div itemProp="reviewRating" itemScope itemType="https://schema.org/Rating">
                                    <meta itemProp="ratingValue" content={review.rating} />
                                    <meta itemProp="bestRating" content="5" />
                                    <RatingStars ratings={review.rating} />
                                </div>
                            </div>
                            <p className="text-gray-700 leading-relaxed mb-4 whitespace-pre-line" itemProp="reviewBody">
                                {review.comment}
                            </p>
                            <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 transition-colors">
                                <ThumbsUp className="w-4 h-4" />
                                Helpful
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-xl">
                        <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600 font-medium mb-2">No reviews yet</p>
                        <p className="text-gray-500 text-sm">Be the first to review this product!</p>
                    </div>
                )}
            </div>
        </section>
    );
}