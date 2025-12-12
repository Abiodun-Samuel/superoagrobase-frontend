'use client';

import { useState, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Package, Shield, Truck, ZoomIn, X } from 'lucide-react';
import IconBadge from '../ui/IconBadge';

export default function ProductImageGallery({ product }) {
    /** -----------------------------
     *  MEMOIZED IMAGES ARRAY
     * ------------------------------*/
    const images = useMemo(() => {
        const parsedImages = product.images ? JSON.parse(product.images) : [];
        return [product.image, ...parsedImages].filter(Boolean);
    }, [product.image, product.images]);

    const [selectedImage, setSelectedImage] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);

    /** -----------------------------
     *  IMAGE NAVIGATION HANDLERS
     * ------------------------------*/
    const handlePrevious = useCallback(() => {
        setSelectedImage(prev => (prev === 0 ? images.length - 1 : prev - 1));
    }, [images.length]);

    const handleNext = useCallback(() => {
        setSelectedImage(prev => (prev === images.length - 1 ? 0 : prev + 1));
    }, [images.length]);

    const handleThumbnailSelect = useCallback((index) => {
        setSelectedImage(index);
    }, []);

    if (images.length === 0) return null;

    return (
        <div itemScope itemType="https://schema.org/ImageObject" className="space-y-5">

            {/* -----------------------------
                MAIN IMAGE VIEW
            ------------------------------ */}
            <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden group">
                <Image
                    src={images[selectedImage]}
                    alt={`${product.title} - ${product.category?.title || 'Agricultural Product'}`}
                    fill
                    className="object-cover"
                    itemProp="contentUrl"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Zoom Icon */}
                <button
                    onClick={() => setIsZoomed(true)}
                    aria-label="Zoom image"
                    className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2.5 rounded-xl shadow-lg opacity-0 
                               group-hover:opacity-100 transition-opacity duration-200 hover:bg-white"
                >
                    <ZoomIn className="w-5 h-5 text-gray-700" />
                </button>

                {/* Navigation Arrows */}
                {images.length > 1 && (
                    <>
                        <NavArrow direction="left" onClick={handlePrevious} />
                        <NavArrow direction="right" onClick={handleNext} />
                    </>
                )}

                {/* Product Badges */}
                {Array.isArray(product.badges) && product.badges.length > 0 && (
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {product.badges.map((badge, index) => (
                            <span
                                key={index}
                                className="px-3 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-xl shadow-lg"
                            >
                                {badge}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* -----------------------------
                THUMBNAIL NAVIGATION
            ------------------------------ */}
            {images.length > 1 && (
                <ThumbnailList
                    images={images}
                    selectedImage={selectedImage}
                    onSelect={handleThumbnailSelect}
                    title={product.title}
                />
            )}

            {/* -----------------------------
                ZOOM MODAL
            ------------------------------ */}
            {isZoomed && (
                <ZoomModal
                    image={images[selectedImage]}
                    alt={product.title}
                    onClose={() => setIsZoomed(false)}
                />
            )}

            {/* -----------------------------
                TRUST BADGES
            ------------------------------ */}
            <TrustBadges />

            {/* SEO */}
            <meta itemProp="name" content={product.title} />
            <meta itemProp="description" content={product.description} />
        </div>
    );
}

/* ============================================================================
   COMPONENTS
============================================================================ */

function NavArrow({ direction, onClick }) {
    const isLeft = direction === 'left';
    const Icon = isLeft ? ChevronLeft : ChevronRight;

    return (
        <button
            onClick={onClick}
            aria-label={`${isLeft ? 'Previous' : 'Next'} image`}
            className={`absolute ${isLeft ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 
                       bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg opacity-0 
                       group-hover:opacity-100 transition-opacity duration-200 hover:bg-white`}
        >
            <Icon className="w-5 h-5 text-gray-700" />
        </button>
    );
}

function ThumbnailList({ images, selectedImage, onSelect, title }) {
    return (
        <div className="grid grid-cols-5 gap-3">
            {images.map((img, index) => {
                const active = selectedImage === index;

                return (
                    <button
                        key={index}
                        onClick={() => onSelect(index)}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 
                            ${active
                                ? 'border-green-600 ring-2 ring-green-600 ring-offset-2'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        <Image
                            src={img}
                            alt={`${title} - view ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 20vw, 10vw"
                        />
                    </button>
                );
            })}
        </div>
    );
}

function ZoomModal({ image, alt, onClose }) {
    return (
        <div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <button
                className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/20 p-2 rounded-xl"
                onClick={onClose}
            >
                <X className="w-6 h-6" />
            </button>

            <div className="relative w-full h-full max-w-5xl max-h-[90vh]">
                <Image
                    src={image}
                    alt={alt}
                    fill
                    className="object-contain"
                    sizes="100vw"
                />
            </div>
        </div>
    );
}

function TrustBadges() {
    return (
        <div className="grid grid-cols-3 gap-4 p-6 bg-gray-50 rounded-xl">
            <TrustBadge icon={<Truck />} title="Fast Delivery" subtitle="1-2 Days" color="green" />
            <TrustBadge icon={<Shield />} title="Genuine Products" subtitle="100% Authentic" color="rose" />
            <TrustBadge icon={<Package />} title="Quality Check" subtitle="Verified" color="purple" />
        </div>
    );
}

function TrustBadge({ icon, title, subtitle, color }) {
    return (
        <div className="flex flex-col items-center text-center space-y-1">
            <IconBadge shape="circle" size="lg" color={color} icon={icon} />
            <p className="text-xs font-medium text-gray-900">{title}</p>
            <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
    );
}
