import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Homepage from 'pages/Homepage';
import HowItWorks from 'pages/HowItWorks';
import About from 'pages/About';
import Meeting from 'pages/Meeting';
import NotFound from 'pages/NotFound';

function App() {
  return (
    <Router>
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
          <Meeting />
        </Route>
        <NotFound />
      </Switch>
    </Router>
  );
}

export default App;
