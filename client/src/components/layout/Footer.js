import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-auto py-4 px-2 text-center">
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
    </footer>
  );
};

export default Footer;
