import React from 'react';
import './AdsModal.css';

const AdsModal = ({ show, onClose, children }) => {
    if (!show) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <button className="close-btn" onClick={onClose}>
                    &times;
                </button>
                {children}
            </div>
        </div>
    );
};

export default AdsModal;
