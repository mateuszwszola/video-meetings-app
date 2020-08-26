import React from 'react';
import Layout from 'components/Layout';

function About() {
  return (
    <Layout>
      <h2 className="text-center text-2xl sm:text-3xl">About</h2>
      <p className="mt-8 sm:text-xl text-center">
        The aim of the project is to help create video meetings with ease.
      </p>
    </Layout>
  );
}

export default About;
