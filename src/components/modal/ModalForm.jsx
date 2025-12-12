import Animated from '@/components/common/Animated';
import { CloseIcon } from '@/icons';
import { useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

const ModalForm = ({
    isOpen,
    description = '',
    onClose,
    title,
    children,
    maxWidth = 'max-w-lg',
    closeOnOutsideClick = true,
}) => {
    const modalRef = useRef(null);
    const backdropRef = useRef(null);

    const handleClose = useCallback(() => {
        onClose();
    }, [onClose]);

    const handleBackdropClick = useCallback(
        (e) => {
            if (closeOnOutsideClick && e.target === backdropRef.current) {
                handleClose();
            }
        },
        [closeOnOutsideClick, handleClose]
    );

    useEffect(() => {
        const handleEscapeKey = (event) => {
            if (event.key === 'Escape') {
                handleClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = '';
        };
    }, [isOpen, handleClose]);

    if (!isOpen) return null;

    return createPortal(
        <div
            ref={backdropRef}
            onMouseDown={handleBackdropClick}
            className="fixed inset-0 z-99999 flex items-center justify-center bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm p-3"
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
        >
            <Animated
                ref={modalRef}
                animation="zoom-in"
                className={`relative w-full ${maxWidth} bg-white dark:bg-gray-800 rounded-xl shadow-xl`}
            >
                <div className="flex items-start gap-2 p-4 border-b shadow border-gray-200 dark:border-gray-700">
                    <div className="flex-1 flex items-center justify-between">
                        <div>
                            <h2
                                id="modal-title"
                                className="text-lg font-semibold text-gray-900 dark:text-gray-100"
                            >
                                {title}
                            </h2>
                            {description && (
                                <p className="text-sm text-gray-800 dark:text-gray-400">
                                    {description}
                                </p>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="shrink-0 bg-red-50 border border-red-200 hover:bg-red-100 dark:bg-white/10 dark:hover:bg-white/20 backdrop-blur-sm text-red-400 shadow-sm p-1.5 transition-all duration-300 hover:scale-110 rounded-full"
                        aria-label="Close modal"
                    >
                        <CloseIcon className="w-4 h-4" />
                    </button>
                </div>

                <div className="p-6 text-gray-700 dark:text-gray-300 max-h-[70vh] overflow-y-auto">
                    {children}
                </div>
            </Animated>
        </div>,
        document.body
    );
};

export default ModalForm;
