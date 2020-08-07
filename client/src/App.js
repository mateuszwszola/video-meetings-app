import React, { useEffect } from 'react';
// import socketIOClient from 'socket.io-client';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Layout from 'components/Layout';
import Homepage from 'pages/Homepage';
import HowItWorks from 'pages/HowItWorks';
import About from 'pages/About';
import NotFound from 'pages/NotFound';

// const ENDPOINT = 'http://127.0.0.1:3001';

function App() {
  // useEffect(() => {
  //   const socket = socketIOClient(ENDPOINT);
  //   socket.on('PULSE', (msg) => {
  //     console.log(msg);
  //   });
  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

  return (
    <Router>
      <Layout>
        <Switch>
          <Route exact path="/">
            <Homepage />
          </Route>
          <Route path="/how-it-works">
            <HowItWorks />
          </Route>
          <Route path="/about">
            <About />
          </Route>
          <NotFound />
        </Switch>
      </Layout>
    </Router>
  );
}

export default App;
