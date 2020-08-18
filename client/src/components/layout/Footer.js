import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="mt-auto py-4 px-2">
      <div className="flex justify-center space-x-4 py-2">
        <Link className="text-sm uppercase text-gray-600" to="/how-it-works">
          How It Works
        </Link>
        <Link className="text-sm uppercase text-gray-600" to="/about">
          About
        </Link>
      </div>
      <div className="text-center">
        <p className="space-x-1">
          <span>Created with</span>
          <span role="img" aria-label="heart-icon">
            ❤️
          </span>{' '}
          <span>by</span>
          <a
            className="text-blue-400"
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/mateuszwszola"
          >
            Mateusz Wszola
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
