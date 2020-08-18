import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useUser } from 'context/userContext';

function ProtectedRoute({ children, ...props }) {
  const user = useUser();

  if (!user) {
    return <Redirect to="/login" />;
  }

  return <Route {...props}>{children}</Route>;
}

export default ProtectedRoute;
