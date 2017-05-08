// Libraries
import React from 'react';
import Router, { Route, IndexRoute } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';

// Components
import MainPage from '../containers/main';
import DemoPage from '../containers/demo';
import NotFoundPage from '../containers/notFound';

const appRoutes = () => (
  <Router history={createBrowserHistory()}>
    <Route path="/">
      <IndexRoute component={MainPage}/>
      <Route path="demo" component={DemoPage}/>
      <Route path="*" component={NotFoundPage} />
    </Route>
  </Router>
);

export default appRoutes;
