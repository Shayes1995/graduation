import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
    const user = JSON.parse(localStorage.getItem('admin')); 

    if (!user) {
        return <Navigate to="/" />;

    }

    if (user.role !== requiredRole) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;
