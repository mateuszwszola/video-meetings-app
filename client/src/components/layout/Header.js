import React from 'react';
import CustomNavLink from 'components/layout/header/CustomNavLink';
import cheveronDownSvg from 'icons/cheveron-down.svg';

const Header = () => {
  const [showDropdown, setShowDropdown] = React.useState(false);

  const toggleDropdown = () => setShowDropdown((on) => !on);

  return (
    <header className="sm:fixed w-full p-6">
      <nav className="w-full max-w-screen-xl mx-auto flex flex-col items-center sm:flex-row sm:justify-between">
        <div className="w-full sm:w-auto flex items-center relative">
          <CustomNavLink to="/">Home</CustomNavLink>
          <button
            onClick={toggleDropdown}
            className="sm:hidden absolute right-0 px-2 py-1"
          >
            <img src={cheveronDownSvg} alt="Dropdown icon" className="h-6" />
          </button>
        </div>
        {showDropdown ? (
          <div className="sm:hidden mt-4 w-full flex flex-col items-center space-y-4">
            <CustomNavLink to="/how-it-works">How It Works</CustomNavLink>
            <CustomNavLink to="/about">About</CustomNavLink>
          </div>
        ) : (
          ''
        )}
        <div className="hidden sm:block">
          <div className="flex flex-row items-center space-x-12">
            <CustomNavLink to="/how-it-works">How It Works</CustomNavLink>
            <CustomNavLink to="/about">About</CustomNavLink>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
