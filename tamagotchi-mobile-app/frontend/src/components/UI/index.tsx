import React from 'react';

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = (props) => {
    return (
        <button {...props} className="ui-button">
            {props.children}
        </button>
    );
};

export const Modal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="ui-modal">
            <div className="modal-content">
                <button onClick={onClose} className="close-button">Close</button>
                {children}
            </div>
        </div>
    );
};