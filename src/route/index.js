/**
 * Author: zhiyou
 * Date: 2017/05/08
 * Description: 路由配置。
 */
import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import AppPage from '../containers/app';
import MainPage from '../containers/main';
import NotFoundPage from '../containers/notFound';
import TopicPage from '../containers/topicPage';

let handleParams = ({params}, replace) => {
    if (isNaN(params.topicId)) {
        replace({ pathname: '/not/found' });
    }
};

const appRoutes = () => (
  <Router history={browserHistory}>
    <Route path="/" component={AppPage}>
        <IndexRoute component={MainPage}/>
        <Route path="ht:topicId(/comments)" component={TopicPage} onEnter={handleParams} />
    </Route>
    <Route path="*" component={NotFoundPage} />
  </Router>
);

export default appRoutes;
