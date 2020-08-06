import React from 'react';
import { Container } from 'reactstrap';
import Navbar from 'components/Navbar';

const Layout = ({ children }) => (
  <>
    <Navbar />
    <Container>{children}</Container>
  </>
);

export default Layout;
