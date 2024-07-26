import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const withAuth = (WrappedComponent, allowedRoles) => {
  return (props) => {
    const session = Cookies.get('session');
    const userRole = session ? Cookies.get('UserRol') || '' : '';

    if (!session) {
      return <Navigate to="/" replace />;
    }

    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/" replace />;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
