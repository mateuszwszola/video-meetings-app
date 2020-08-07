import React from 'react';
import Link from 'components/layout/header/Link';
import cheveronDownSvg from 'icons/cheveron-down.svg';

const Header = () => {
  const [showDropdown, setShowDropdown] = React.useState(false);

  const toggleDropdown = () => setShowDropdown((on) => !on);

  return (
    <header className="w-full p-6 sm:p-12">
      <nav className="w-full max-w-screen-xl mx-auto flex flex-col items-center sm:flex-row sm:justify-between">
        <div className="w-full flex items-center relative">
          <Link to="/">Home</Link>
          <button
            onClick={toggleDropdown}
            className="absolute right-0 px-2 py-1"
          >
            <img src={cheveronDownSvg} alt="Dropdown icon" className="h-6" />
          </button>
        </div>
        {showDropdown ? (
          <div className="mt-4 sm:mt-0 w-full sm:w-auto flex flex-col items-center sm:flex-row space-y-4 sm:space-y-0 sm:space-x-12">
            <Link to="/how-it-works">How It Works</Link>
            <Link to="/about">About</Link>
          </div>
        ) : (
          ''
        )}
      </nav>
    </header>
  );
};

export default Header;
