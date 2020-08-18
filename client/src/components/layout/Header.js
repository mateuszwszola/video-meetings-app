import React from 'react';
import CustomNavLink from 'components/layout/header/CustomNavLink';
import { useUser } from 'context/userContext';

const Header = () => {
  const user = useUser();

  return (
    <header className="py-4 px-2 sm:px-6">
      <nav className="w-full max-w-screen-xl mx-auto flex items-center justify-between">
        <CustomNavLink to="/">Home</CustomNavLink>
        {user ? (
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
