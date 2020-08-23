import React from 'react';
import CustomNavLink from 'components/layout/header/CustomNavLink';
import { useAuth0 } from '@auth0/auth0-react';

const Header = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <header className="py-4 px-2 sm:px-6">
      <nav className="w-full max-w-screen-xl mx-auto flex items-center justify-between">
        <CustomNavLink to="/">Home</CustomNavLink>
        {isAuthenticated ? (
          <CustomNavLink to="/dashboard">Dashboard</CustomNavLink>
        ) : (
          <>
            <CustomNavLink to="/login">Login</CustomNavLink>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
