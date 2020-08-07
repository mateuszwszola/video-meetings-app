import React from 'react';
import Header from 'components/layout/Header';
import Footer from 'components/layout/Footer';

const Layout = ({ children }) => (
  <div className="w-full min-h-screen flex flex-col flex-1">
    <Header />
    <main className="px-2 w-full max-w-screen-xl mx-auto flex flex-col flex-1">
      {children}
    </main>
    <Footer />
  </div>
);

export default Layout;
