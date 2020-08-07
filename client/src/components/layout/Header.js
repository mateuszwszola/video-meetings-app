import React from 'react';
import Link from 'components/layout/header/Link';
import cheveronDownSvg from 'icons/cheveron-down.svg';

const Header = () => {
  const [showDropdown, setShowDropdown] = React.useState(false);

  const toggleDropdown = () => setShowDropdown((on) => !on);

  return (
    <header className="fixed w-full p-6 sm:p-12">
      <nav className="w-full max-w-screen-xl mx-auto flex flex-col items-center sm:flex-row sm:justify-between">
        <div className="w-full sm:w-auto flex items-center relative">
          <Link to="/">Home</Link>
          <button
            onClick={toggleDropdown}
            className="sm:hidden absolute right-0 px-2 py-1"
          >
            <img src={cheveronDownSvg} alt="Dropdown icon" className="h-6" />
          </button>
        </div>
        {showDropdown ? (
          <div className="sm:hidden mt-4 w-full flex flex-col items-center space-y-4">
            <Link to="/how-it-works">How It Works</Link>
            <Link to="/about">About</Link>
          </div>
        ) : (
          ''
        )}
        <div className="hidden sm:block">
          <div className="flex flex-row items-center space-x-12">
            <Link to="/how-it-works">How It Works</Link>
            <Link to="/about">About</Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
