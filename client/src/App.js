import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Layout from 'components/Layout';
import Homepage from 'pages/Homepage';
import HowItWorks from 'pages/HowItWorks';
import About from 'pages/About';
import Room from 'pages/Room';
import NotFound from 'pages/NotFound';
import { SocketProvider } from 'context/SocketContext';

function App() {
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
          <Route path="/:roomName">
            <SocketProvider>
              <Room />
            </SocketProvider>
          </Route>
          <NotFound />
        </Switch>
      </Layout>
    </Router>
  );
}

export default App;
