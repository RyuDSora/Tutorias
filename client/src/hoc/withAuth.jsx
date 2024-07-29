import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { encryptionKey, decryptValue } from '../components/hashes';

const withAuth = (WrappedComponent, allowedRoles) => {
  return (props) => {
    const session = decryptValue(Cookies.get('$3s1.4'),encryptionKey);
    const role = decryptValue(Cookies.get('&0l3'),encryptionKey)
    const userRole = session ? role || '' : '';

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
