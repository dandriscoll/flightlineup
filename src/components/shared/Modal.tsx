import React from 'react';

interface ModalProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    title?: string;
    children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, setIsOpen, title, children = null }) => {
    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            setIsOpen(false);
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="modal-overlay active"
            onClick={handleOverlayClick}
        >
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                {title && (
                    <div className="modal-header">
                        <h2 className="modal-title">{title}</h2>
                        <button
                            className="modal-close"
                            onClick={() => setIsOpen(false)}
                            aria-label="Close modal"
                        >
                            ✕
                        </button>
                    </div>
                )}
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
