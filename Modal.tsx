import React from 'react';

interface ModalProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, setIsOpen, children = null }) => {
    return (
        <div className={`modal-overlay ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
            <div className='modal'>
                {children}
            </div>
        </div>
    );
};

export default Modal;