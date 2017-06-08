/**
 * Author: zhiyou
 * Date: 2017/05/08
 * Description: APP配置。
 */
import './static/style/base.css';
import 'zepto';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store';
import appRoute from './route';

const store = configureStore();

ReactDOM.render (
	<Provider store={store}>
	    {appRoute(store)}
	</Provider>,
	document.getElementById('root')
);
