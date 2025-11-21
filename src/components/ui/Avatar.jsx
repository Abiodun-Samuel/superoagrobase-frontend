import { AlertCircle, Camera, CheckCircle, Loader2, User } from 'lucide-react';
import { useState, useRef, useCallback, useMemo } from 'react';

const AVATAR_SIZES = {
    xs: { container: 'w-7 h-7', text: 'text-xs', icon: 16, badge: 'w-4 h-4', badgeIcon: 12 },
    sm: { container: 'w-10 h-10', text: 'text-sm', icon: 18, badge: 'w-5 h-5', badgeIcon: 14 },
    md: { container: 'w-12 h-12', text: 'text-base', icon: 20, badge: 'w-5 h-5', badgeIcon: 14 },
    lg: { container: 'w-16 h-16', text: 'text-lg', icon: 22, badge: 'w-6 h-6', badgeIcon: 16 },
    xl: { container: 'w-20 h-20', text: 'text-xl', icon: 24, badge: 'w-7 h-7', badgeIcon: 18 },
    '2xl': { container: 'w-28 h-28', text: 'text-2xl', icon: 32, badge: 'w-8 h-8', badgeIcon: 20 },
    '3xl': { container: 'w-36 h-36', text: 'text-3xl', icon: 40, badge: 'w-10 h-10', badgeIcon: 24 }
};

const SHAPE_CLASSES = {
    circle: 'rounded-full',
    square: 'rounded-xl'
};

const MAX_FILE_SIZE = 1.5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = 'image/*';

const getInitials = (initials) => {
    if (!initials) return '';
    return initials.slice(0, 2).toUpperCase();
};

const Avatar = ({
    src,
    alt = 'User avatar',
    initials = '',
    size = 'md',
    shape = 'circle',
    onUpload,
    onError,
    className = '',
    loading = false,
    isProfileCompleted = false,
    showProfileStatus = false
}) => {
    const [imageError, setImageError] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const fileInputRef = useRef(null);

    const sizeConfig = AVATAR_SIZES[size];
    const shapeClass = SHAPE_CLASSES[shape];
    const isUploadable = Boolean(onUpload);
    const showImage = src && !imageError;
    const displayInitials = useMemo(() => getInitials(initials), [initials]);

    const handleImageError = useCallback(() => {
        setImageError(true);
        onError?.('Failed to load image');
    }, [onError]);

    const handleClick = useCallback(() => {
        if (isUploadable && !loading) {
            fileInputRef.current?.click();
        }
    }, [isUploadable, loading]);

    const handleFileChange = useCallback((e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > MAX_FILE_SIZE) {
            onError?.('Image size must be less than 1.5MB');
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        const reader = new FileReader();

        reader.onloadend = () => {
            onUpload?.(reader.result);
            setImageError(false);
        };

        reader.onerror = () => {
            onError?.('Failed to read file');
        };

        reader.readAsDataURL(file);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }, [onUpload, onError]);

    const handleKeyDown = useCallback((e) => {
        if (isUploadable && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            handleClick();
        }
    }, [isUploadable, handleClick]);

    const containerClasses = `
    relative overflow-hidden shadow-xl transition-all duration-300 ease-in-out 
    ring-2 ring-white ${sizeConfig.container} ${shapeClass}
    ${isUploadable && !loading ? 'cursor-pointer hover:shadow-lg' : ''}
    ${className}
  `.trim();

    const overlayClasses = `
    absolute inset-0 bg-black/60 flex items-center justify-center
    transition-opacity duration-300
    ${isHovered && !loading ? 'opacity-100' : 'opacity-0'}
  `;

    const badgeClasses = `
    absolute -bottom-1 -right-1 ${sizeConfig.badge}
    flex items-center justify-center shadow-lg 
    ring-2 ring-white transition-all duration-300 hover:scale-110
    ${isProfileCompleted
            ? 'bg-gradient-to-br from-green-500 to-emerald-600'
            : 'bg-gradient-to-br from-red-500 to-rose-600'
        }
    ${shape === 'circle' ? 'rounded-full' : 'rounded-lg'}
  `;

    return (
        <div className="inline-block relative">
            <div
                className={containerClasses}
                onClick={handleClick}
                onMouseEnter={() => isUploadable && setIsHovered(true)}
                onMouseLeave={() => isUploadable && setIsHovered(false)}
                onKeyDown={handleKeyDown}
                role={isUploadable ? 'button' : 'img'}
                aria-label={isUploadable ? 'Upload avatar' : alt}
                tabIndex={isUploadable && !loading ? 0 : -1}
            >
                {showImage ? (
                    <img
                        src={src}
                        alt={alt}
                        className="w-full h-full object-cover"
                        onError={handleImageError}
                        draggable={false}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-500 via-green-500 to-green-500">
                        {displayInitials ? (
                            <span className={`font-semibold text-white select-none ${sizeConfig.text}`}>
                                {displayInitials}
                            </span>
                        ) : (
                            <User size={sizeConfig.icon} className="text-white opacity-80" />
                        )}
                    </div>
                )}

                {isUploadable && (
                    <>
                        <div className={overlayClasses} aria-hidden="true">
                            <Camera size={sizeConfig.icon * 0.8} className="text-white drop-shadow-lg" />
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept={ACCEPTED_IMAGE_TYPES}
                            onChange={handleFileChange}
                            className="hidden"
                            aria-label="Upload avatar image"
                            disabled={loading}
                        />
                    </>
                )}

                {loading && (
                    <div className={`absolute inset-0 flex items-center justify-center bg-black/50 ${shapeClass}`}>
                        <Loader2 size={22} className="text-white animate-spin" />
                    </div>
                )}
            </div>

            {showProfileStatus && (
                <div
                    className={badgeClasses}
                    aria-label={isProfileCompleted ? 'Profile completed' : 'Profile incomplete'}
                    title={isProfileCompleted ? 'Profile completed' : 'Complete your profile'}
                >
                    {isProfileCompleted ? (
                        <CheckCircle size={sizeConfig.badgeIcon} className="text-white drop-shadow-sm" />
                    ) : (
                        <AlertCircle size={sizeConfig.badgeIcon} className="text-white drop-shadow-sm animate-pulse" />
                    )}
                </div>
            )}
        </div>
    );
};
export default Avatar