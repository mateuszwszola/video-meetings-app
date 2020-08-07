import React from 'react';

const Link = ({ children, to }) => (
  <a
    href={to}
    className="font-medium sm:text-lg block w-full sm:w-auto text-center p-2"
  >
    {children}
  </a>
);

export default Link;
