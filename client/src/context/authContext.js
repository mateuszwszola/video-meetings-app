import React, { createContext, useContext } from 'react';
import useFirebaseAuth from 'hooks/useFirebaseAuth';
import Loading from 'components/Loading';

const AuthContext = createContext();

function AuthProvider(props) {
  const { user, login, logout, status } = useFirebaseAuth();

  if (status === 'loading') {
    return <Loading />;
  }

  const value = {
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value} {...props} />;
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
}

export { AuthProvider, useAuth };
